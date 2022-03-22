import React, {useCallback, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {IdeaCategoryDetail, IdeaDetail} from '../../screens/idea/reducer/reducer';
import {IdeaInput} from './IdeaInput';
import {translateErrors} from '../../utils';
import {deleteIdea} from '../../infras/api';

type Props = {
  ideaCategory: IdeaCategoryDetail;
  idea: IdeaDetail;
};

export const Idea: React.FC<Props> = ({ideaCategory, idea}) => {
  const [editIdeaId, setEditIdeaId] = useState(-1);

  const handlePressDelete = useCallback(
    (id: number) => {
      const deletedIdeaList = ideaCategory.ideaList.filter(function (idea) {
        return idea.id !== id;
      });
      deleteIdea(ideaCategory, deletedIdeaList).catch((error) => {
        const errorMsg = translateErrors(error.code);
        Alert.alert(errorMsg.title, errorMsg.description);
      });
    },
    [ideaCategory],
  );

  const confirmDelete = useCallback(
    (id: number) => {
      Alert.alert('アイデアを削除します。', 'よろしいですか？', [
        {
          text: 'キャンセル',
        },
        {
          text: '削除する',
          style: 'destructive',
          onPress: () => {
            handlePressDelete(id);
          },
        },
      ]);
    },
    [handlePressDelete],
  );

  return (
    <>
      {idea.id === editIdeaId ? (
        <>
          <IdeaInput
            text={idea.ideaText}
            editIdeaId={editIdeaId}
            ideaCategory={ideaCategory}
            onPress={() => setEditIdeaId(-1)}
          />
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.ideaCategoryListItem}
            onLongPress={() => {
              setEditIdeaId(idea.id);
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
                confirmDelete(idea.id);
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
