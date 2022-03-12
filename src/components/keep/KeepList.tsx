import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, FlatList, Alert} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {KeepTabNavigation} from '../../navigation';
import {useNavigation} from '@react-navigation/native';
import {UserKeep} from '../../screens/keep/list/KeepListScreen';
import firebase from 'firebase';

type Props = {
  keeps: UserKeep[];
};

export const KeepList: React.FC<Props> = ({keeps}) => {
  const nav = useNavigation<KeepTabNavigation>();

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

  return (
    <View style={styles.container}>
      <FlatList
        data={keeps}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.keepListItem}
            onPress={() => {
              nav.navigate('KeepDetail', {id: item.id});
            }}
          >
            <View style={styles.keepInner}>
              <Text style={styles.keepListItemTitle} numberOfLines={1}>
                {item.bodyText}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.keepDelete}
              onPress={() => {
                deleteKeep(item.id);
              }}
            >
              <Feather name="x" color="#B0b0b0" size={16} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
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
