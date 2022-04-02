import React, {useCallback, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {IdeaCategoryDetail} from '../../../screens/idea/category/reducer/reducer';
import {IdeaCategoryInput} from './IdeaCategoryInput';
import {deleteIdeaCategory} from '../../../infras/api';

type Props = {
  ideaCategory: IdeaCategoryDetail;
  onLongPress: () => void;
};

export const IdeaCategory: React.FC<Props> = ({ideaCategory, onLongPress}) => {
  const [editIdeaCategoryId, setEditIdeaCategoryId] = useState('noMatch');

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
          <TouchableOpacity style={styles.ideaCategoryListItem} onLongPress={onLongPress}>
            <View style={styles.ideaCategoryInner}>
              <Text style={styles.ideaCategoryListItemTitle} numberOfLines={1}>
                {ideaCategory.name}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.ideaCategoryEdit}
              onPress={() => {
                setEditIdeaCategoryId(ideaCategory.id);
              }}
            >
              <Feather name="edit" color="#DADADA" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handlePressDelete(ideaCategory.id);
              }}
            >
              <Feather name="x" color="#DADADA" size={20} />
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
    backgroundColor: '#D7FFDB',
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
  ideaCategoryEdit: {
    paddingRight: 12,
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
