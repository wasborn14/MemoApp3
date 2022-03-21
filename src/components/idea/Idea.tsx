import React, {useCallback, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {Feather} from '@expo/vector-icons';
import firebase from 'firebase';
import {IdeaCategoryDetail, IdeaDetail} from '../../screens/idea/reducer/reducer';
import {IdeaCategoryInput} from './IdeaCategoryInput';
import {IdeaInput} from './IdeaInput';

type Props = {
  idea: IdeaDetail;
};

export const Idea: React.FC<Props> = ({idea}) => {
  const [editIdeaCategoryId, setEditIdeaCategoryId] = useState(-1);
  const [isCreateIdeaSelected, setIsCreateIdeaSelected] = useState(false);
  const [isCategorySelected, setIsCategorySelected] = useState(false);

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
      {idea.id === editIdeaCategoryId ? (
        <>
          {/*<IdeaCategoryInput*/}
          {/*    id={ideaCategory.categoryId}*/}
          {/*    text={ideaCategory.categoryName}*/}
          {/*    onPress={() => setEditIdeaCategoryId('noMatch')}*/}
          {/*/>*/}
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.ideaCategoryListItem}
            onPress={() => {
              setIsCategorySelected(!isCategorySelected);
            }}
          >
            <View style={styles.ideaCategoryInner}>
              <Text style={styles.ideaCategoryListItemTitle} numberOfLines={1}>
                {idea.ideaText}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.ideaCategoryDelete}
              onPress={() => {
                setEditIdeaCategoryId(idea.id);
              }}
            >
              <Feather name="edit" color="#B0b0b0" size={16} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ideaCategoryDelete}
              onPress={() => {
                deleteIdeaCategory(idea.id);
              }}
            >
              <Feather name="x" color="#B0b0b0" size={16} />
            </TouchableOpacity>
          </TouchableOpacity>
          {/*{isCreateIdeaSelected && <IdeaInput ideaCategory={idea} />}*/}
          {/*{isCategorySelected && !isCreateIdeaSelected && (*/}
          {/*    <TouchableOpacity*/}
          {/*        style={styles.ideaCreatContainer}*/}
          {/*        onPress={() => {*/}
          {/*            setEditIdeaCategoryId(ideaCategory.categoryId);*/}
          {/*        }}*/}
          {/*    >*/}
          {/*        <TouchableOpacity*/}
          {/*            style={styles.ideaCreateButton}*/}
          {/*            onPress={() => {*/}
          {/*                setIsCreateIdeaSelected(true);*/}
          {/*            }}*/}
          {/*        >*/}
          {/*            <View style={styles.ideaCreateIcon}>*/}
          {/*                <Feather name="plus" color="#B0b0b0" size={16} />*/}
          {/*            </View>*/}
          {/*        </TouchableOpacity>*/}
          {/*    </TouchableOpacity>*/}
          {/*)}*/}
        </>
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
    marginLeft: 32,
    marginRight: 16,
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
  ideaCreatContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 20,
  },
  ideaCreateButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 19,
    marginVertical: 4,
    marginHorizontal: 16,
    alignItems: 'center',
    borderRadius: 20,
    width: 80,
    // 影の設定
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 10,
  },
  ideaCreateIcon: {
    flex: 1,
    alignItems: 'center',
  },
});
