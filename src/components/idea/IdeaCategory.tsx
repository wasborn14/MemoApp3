import React, {useCallback, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {Feather} from '@expo/vector-icons';
import firebase from 'firebase';
import {IdeaCategoryDetail} from '../../screens/idea/reducer/reducer';

type Props = {
  ideaCategory: IdeaCategoryDetail;
};

export const IdeaCategory: React.FC<Props> = ({ideaCategory}) => {
  const [editIdeaCategoryId, setEditIdeaCategoryId] = useState('noMatch');

  const deleteIdeaCategory = useCallback((id) => {
    const {currentUser} = firebase.auth();
    if (currentUser) {
      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(id);
      Alert.alert('タスクを削除します。', 'よろしいですか？', [
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
    <>
      {ideaCategory.categoryId === editIdeaCategoryId ? (
        <>
          {/*<IdeaCategoryInput id={ideaCategory.id} text={ideaCategory.bodyText} onPress={() => setEditIdeaCategoryId('noMatch')} />*/}
        </>
      ) : (
        <TouchableOpacity style={styles.ideaCategoryListItem} onPress={() => {}}>
          <View style={styles.ideaCategoryInner}>
            <Text style={styles.ideaCategoryListItemTitle} numberOfLines={1}>
              {ideaCategory.categoryName}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.ideaCategoryDelete}
            onPress={() => {
              setEditIdeaCategoryId(ideaCategory.categoryId);
            }}
          >
            <Feather name="edit" color="#B0b0b0" size={16} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ideaCategoryDelete}
            onPress={() => {
              deleteIdeaCategory(ideaCategory.categoryId);
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
  ideaCategoryListItem: {
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
  runningColor: {
    backgroundColor: '#adffff',
  },
  ideaCategoryInner: {
    flex: 1,
  },
  ideaCategoryListItemTitle: {
    fontSize: 16,
    lineHeight: 32,
  },
  ideaCategoryListItemDate: {
    fontSize: 12,
    lineHeight: 16,
    color: '#848484',
  },
  ideaCategoryDelete: {
    padding: 8,
  },
});
