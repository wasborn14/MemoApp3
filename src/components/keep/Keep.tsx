import React, {useCallback, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {UserKeep} from '../../screens/keep/list/KeepListScreen';
import firebase from 'firebase';
import {KeepInput} from './KeepInput';
import {useStopwatch} from 'react-timer-hook';
import {translateErrors} from '../../utils';

type Props = {
  keep: UserKeep;
};

export const Keep: React.FC<Props> = ({keep}) => {
  const [editKeepId, setEditKeepId] = useState('noMatch');
  const {seconds, minutes, hours, isRunning, start, pause} = useStopwatch({
    autoStart: false,
  });

  const deleteKeep = useCallback((id) => {
    const {currentUser} = firebase.auth();
    if (currentUser) {
      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/keeps`).doc(id);
      Alert.alert('メモを削除します。', 'よろしいですか？', [
        {
          text: 'キャンセル',
          onPress: () => {
            // do nothing
          },
        },
        {
          text: '削除する',
          style: 'destructive',
          onPress: () => {
            ref.delete().catch(() => {
              Alert.alert('削除に失敗しました。');
            });
          },
        },
      ]);
    }
  }, []);

  const handleTimePress = useCallback(() => {
    if (isRunning) {
      const {currentUser} = firebase.auth();
      const db = firebase.firestore();
      if (currentUser) {
        const now = new Date();
        const ref = db.collection(`users/${currentUser.uid}/times/`);
        ref
          .add({
            keep_id: keep.id,
            keep_bodyText: keep.bodyText,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            year: now.getFullYear(),
            month: now.getMonth(),
            day: now.getDay(),
            updatedAt: now,
          })
          .then(() => {
            pause();
          })
          .catch((error) => {
            console.log(error);
            const errorMsg = translateErrors(error.code);
            Alert.alert(errorMsg.title, errorMsg.description);
          });
      }
    } else {
      start();
    }
  }, [isRunning, keep.bodyText, keep.id, start, pause, hours, minutes, seconds]);

  return (
    <>
      {keep.id === editKeepId ? (
        <>
          <KeepInput id={keep.id} text={keep.bodyText} onPress={() => setEditKeepId('noMatch')} />
        </>
      ) : (
        <TouchableOpacity style={styles.keepListItem} onPress={handleTimePress}>
          <View style={styles.keepInner}>
            <Text style={styles.keepListItemTitle} numberOfLines={1}>
              {keep.bodyText}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 16}}>{hours > 0 && hours + ':'}</Text>
            <Text style={{fontSize: 16}}>{minutes > 0 && minutes + ':'}</Text>
            <Text style={{fontSize: 16}}>{seconds}</Text>
          </View>
          <TouchableOpacity
            style={styles.keepDelete}
            onPress={() => {
              setEditKeepId(keep.id);
            }}
          >
            <Feather name="edit" color="#B0b0b0" size={16} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keepDelete}
            onPress={() => {
              deleteKeep(keep.id);
            }}
          >
            <Feather name="x" color="#B0b0b0" size={16} />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b4513',
    marginTop: 8,
  },
  keepListItem: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 19,
    marginVertical: 4,
    marginHorizontal: 16,
    alignItems: 'center',
    borderRadius: 20,
    // 影の設定
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 10,
  },
  keepInner: {
    flex: 1,
  },
  keepListItemTitle: {
    fontSize: 16,
    lineHeight: 32,
  },
  keepListItemDate: {
    fontSize: 12,
    lineHeight: 16,
    color: '#848484',
  },
  keepDelete: {
    padding: 8,
  },
});
