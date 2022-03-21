import React, {useCallback, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {Feather} from '@expo/vector-icons';
import firebase from 'firebase';
import {IdeaCategoryDetail} from '../../screens/idea/reducer/reducer';
import {IdeaCategoryInput} from './IdeaCategoryInput';
import {IdeaInput} from './IdeaInput';
import {IdeaList} from './IdeaList';

type Props = {
  ideaCategory: IdeaCategoryDetail;
};

export const IdeaCategory: React.FC<Props> = ({ideaCategory}) => {
  const [editIdeaCategoryId, setEditIdeaCategoryId] = useState('noMatch');
  const [isCreateIdeaSelected, setIsCreateIdeaSelected] = useState(false);
  const [isCategorySelected, setIsCategorySelected] = useState(false);

  const deleteIdeaCategory = useCallback((id) => {
    const {currentUser} = firebase.auth();
    if (currentUser) {
      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(id);
      Alert.alert('カテゴリを削除します。', 'よろしいですか？', [
        {
          text: 'キャンセル',
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
          <IdeaCategoryInput
            ideaCategory={ideaCategory}
            onPress={() => setEditIdeaCategoryId('noMatch')}
          />
        </>
      ) : (
        <>
          <TouchableOpacity
            style={[
              styles.ideaCategoryListItem,
              isCategorySelected && styles.selectedCategoryColor,
            ]}
            onPress={() => {
              setIsCategorySelected(!isCategorySelected);
            }}
          >
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
          {isCategorySelected && (
            <>
              <IdeaList ideaCategory={ideaCategory} ideaList={ideaCategory.ideaList} />
              {!isCreateIdeaSelected && (
                <TouchableOpacity
                  style={styles.ideaCreatContainer}
                  onPress={() => {
                    setEditIdeaCategoryId(ideaCategory.categoryId);
                  }}
                >
                  <TouchableOpacity
                    style={styles.ideaCreateButton}
                    onPress={() => {
                      setIsCreateIdeaSelected(true);
                    }}
                  >
                    <View style={styles.ideaCreateIcon}>
                      <Feather name="plus" color="#B0b0b0" size={16} />
                    </View>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            </>
          )}
          {isCategorySelected && isCreateIdeaSelected && (
            <IdeaInput
              ideaCategory={ideaCategory}
              handlePressSave={() => setIsCreateIdeaSelected(false)}
            />
          )}
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
  selectedCategoryColor: {
    backgroundColor: '#adffff',
  },
  runningColor: {
    backgroundColor: '#adffff',
  },
  ideaCategoryInner: {
    flex: 1,
  },
  ideaCategoryListItemTitle: {
    fontSize: 16,
    lineHeight: 26,
  },
  ideaCategoryListItemDate: {
    fontSize: 12,
    lineHeight: 16,
    color: '#848484',
  },
  ideaCategoryDelete: {
    padding: 4,
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
