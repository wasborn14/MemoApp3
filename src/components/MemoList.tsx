import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, FlatList, Alert} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {MemoTabNavigation} from '../navigation';
import {useNavigation} from '@react-navigation/native';
import {UserMemo} from '../screens/memo/MemoListScreen';
import {dateToString} from '../utils';
import firebase from 'firebase';

type Props = {
  memos: UserMemo[];
};

export const MemoList: React.FC<Props> = ({memos}) => {
  const nav = useNavigation<MemoTabNavigation>();

  const deleteMemo = useCallback((id) => {
    const {currentUser} = firebase.auth();
    if (currentUser) {
      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/memos`).doc(id);
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
        data={memos}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.memoListItem}
            onPress={() => {
              nav.navigate('MemoDetail', {id: item.id});
            }}
          >
            <View>
              <Text style={styles.memoListItemTitle} numberOfLines={1}>
                {item.bodyText}
              </Text>
              <Text style={styles.memoListItemDate}>{dateToString(item.updatedAt)}</Text>
            </View>
            <TouchableOpacity
              style={styles.memoDelete}
              onPress={() => {
                deleteMemo(item.id);
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
    backgroundColor: '#F0F4F8',
  },
  memoListItem: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 19,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  memoListItemTitle: {
    fontSize: 16,
    lineHeight: 32,
  },
  memoListItemDate: {
    fontSize: 12,
    lineHeight: 16,
    color: '#848484',
  },
  memoDelete: {
    padding: 8,
  },
});
