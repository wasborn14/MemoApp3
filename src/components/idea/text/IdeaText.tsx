import React, {useCallback, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {IdeaTitleDetail, IdeaTextDetail} from '../../../screens/idea/list/reducer/reducer';
import {IdeaTextInput} from './IdeaTextInput';
import {translateErrors} from '../../../utils';
import {deleteIdeaText} from '../../../infras/api';
import {useIdeaListState} from '../../../screens/idea/list';

type Props = {
  ideaTitle: IdeaTitleDetail;
  ideaText: IdeaTextDetail;
};

export const IdeaText: React.FC<Props> = ({ideaTitle, ideaText}) => {
  const [editIdeaTextId, setEditIdeaTextId] = useState(-1);
  const selectedIdeaCategory = useIdeaListState((state) => state.selectedIdeaCategory);

  const handlePressDelete = useCallback(
    (id: number) => {
      if (!selectedIdeaCategory) {
        return;
      }
      const deletedIdeaTextList = ideaTitle.ideaTextList.filter(function (ideaText) {
        return ideaText.ideaTextId !== id;
      });
      deleteIdeaText(selectedIdeaCategory?.ideaCategoryId, ideaTitle, deletedIdeaTextList).catch(
        (error) => {
          const errorMsg = translateErrors(error.code);
          Alert.alert(errorMsg.title, errorMsg.description);
        },
      );
    },
    [ideaTitle, selectedIdeaCategory],
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
      {ideaText.ideaTextId === editIdeaTextId ? (
        <>
          <IdeaTextInput
            text={ideaText.ideaText}
            editIdeaTextId={editIdeaTextId}
            ideaTitle={ideaTitle}
            onPress={() => setEditIdeaTextId(-1)}
          />
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.ideaTitleListItem}
            onLongPress={() => {
              setEditIdeaTextId(ideaText.ideaTextId);
            }}
          >
            <View style={styles.ideaTitleInner}>
              <Text style={styles.ideaTitleListItemTitle} numberOfLines={1}>
                {ideaText.ideaText}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.ideaTitleDelete}
              onPress={() => {
                confirmDelete(ideaText.ideaTextId);
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
  ideaTitleListItem: {
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
  ideaTitleInner: {
    flex: 1,
  },
  ideaTitleListItemTitle: {
    fontSize: 16,
    lineHeight: 26,
  },
  ideaTitleListItemDate: {
    fontSize: 12,
    lineHeight: 16,
    color: '#848484',
  },
  ideaTitleDelete: {
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
