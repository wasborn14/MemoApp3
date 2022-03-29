import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {IdeaCategoryDetail} from '../../../screens/idea/category/reducer/reducer';
import {IdeaCategoryInput} from './IdeaCategoryInput';
import {deleteIdeaCategory} from '../../../infras/api';

type Props = {
  ideaCategory: IdeaCategoryDetail;
};

export const IdeaCategory: React.FC<Props> = ({ideaCategory}) => {
  const [editIdeaCategoryId, setEditIdeaCategoryId] = useState('noMatch');
  const [isIdeaCategorySelected, setIsIdeaCategorySelected] = useState(false);

  const handlePressDelete = useCallback((ideaCategoryId: string) => {
    Alert.alert('カテゴリを削除します。', 'よろしいですか？', [
      {
        text: 'キャンセル',
      },
      {
        text: '削除する',
        style: 'destructive',
        onPress: () => {
          deleteIdeaCategory(ideaCategoryId).catch(() => {
            Alert.alert('削除に失敗しました。');
          });
        },
      },
    ]);
  }, []);

  useEffect(() => {
    console.log(ideaCategory);
  }, [ideaCategory]);

  return (
    <>
      {ideaCategory.id === editIdeaCategoryId ? (
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
              isIdeaCategorySelected && styles.selectedIdeaCategoryColor,
            ]}
            onPress={() => {
              setIsIdeaCategorySelected(!isIdeaCategorySelected);
            }}
          >
            <View style={styles.ideaCategoryInner}>
              <Text style={styles.ideaCategoryListItemTitle} numberOfLines={1}>
                {ideaCategory.name}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.ideaCategoryDelete}
              onPress={() => {
                setEditIdeaCategoryId(ideaCategory.id);
              }}
            >
              <Feather name="edit" color="#B0b0b0" size={16} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ideaCategoryDelete}
              onPress={() => {
                handlePressDelete(ideaCategory.id);
              }}
            >
              <Feather name="x" color="#B0b0b0" size={16} />
            </TouchableOpacity>
          </TouchableOpacity>
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
  selectedIdeaCategoryColor: {
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
