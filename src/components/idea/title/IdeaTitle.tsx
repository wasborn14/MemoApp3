import React, {useCallback, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert, FlatList} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {IdeaTitleDetail} from '../../../screens/idea/list/reducer/reducer';
import {IdeaTitleInput} from './IdeaTitleInput';
import {IdeaTextInput} from '../text/IdeaTextInput';
import {deleteIdeaTitle} from '../../../infras/api';
import {IdeaText} from '../text/IdeaText';
import {useIdeaListState} from '../../../screens/idea/list';

type Props = {
  ideaTitle: IdeaTitleDetail;
  onLongPress: () => void;
};

export const IdeaTitle: React.FC<Props> = ({ideaTitle, onLongPress}) => {
  const [editIdeaTitleId, setEditIdeaTitleId] = useState('noMatch');
  const [isCreateIdeaSelected, setIsCreateIdeaSelected] = useState(false);
  const [isIdeaTitleSelected, setIsIdeaTitleSelected] = useState(false);
  const selectedIdeaCategory = useIdeaListState((state) => state.selectedIdeaCategory);

  const handlePressDelete = useCallback(
    (ideaTitleId: string) => {
      Alert.alert('カテゴリを削除します。', 'よろしいですか？', [
        {
          text: 'キャンセル',
        },
        {
          text: '削除する',
          style: 'destructive',
          onPress: () => {
            if (selectedIdeaCategory) {
              deleteIdeaTitle(selectedIdeaCategory.id, ideaTitleId).catch(() => {
                Alert.alert('削除に失敗しました。');
              });
            }
          },
        },
      ]);
    },
    [selectedIdeaCategory],
  );

  return (
    <>
      {ideaTitle.id === editIdeaTitleId ? (
        <>
          <IdeaTitleInput ideaTitle={ideaTitle} onPress={() => setEditIdeaTitleId('noMatch')} />
        </>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.ideaTitleListItem, isIdeaTitleSelected && styles.selectedIdeaTitleColor]}
            onPress={() => {
              setIsIdeaTitleSelected(!isIdeaTitleSelected);
            }}
            onLongPress={onLongPress}
          >
            <View style={styles.ideaTitleInner}>
              <Text style={styles.ideaTitleListItemTitle} numberOfLines={1}>
                {ideaTitle.name}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.ideaTitleDelete}
              onPress={() => {
                setEditIdeaTitleId(ideaTitle.id);
              }}
            >
              <Feather name="edit" color="#B0b0b0" size={16} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ideaTitleDelete}
              onPress={() => {
                handlePressDelete(ideaTitle.id);
              }}
            >
              <Feather name="x" color="#B0b0b0" size={16} />
            </TouchableOpacity>
          </TouchableOpacity>
          {isIdeaTitleSelected && (
            <>
              <FlatList
                data={ideaTitle.ideaTextList}
                renderItem={({item}) => <IdeaText ideaText={item} ideaTitle={ideaTitle} />}
                keyExtractor={(item) => item.id.toString()}
              />
              {!isCreateIdeaSelected && (
                <View style={styles.ideaCreatContainer}>
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
                </View>
              )}
            </>
          )}
          {isIdeaTitleSelected && isCreateIdeaSelected && (
            <IdeaTextInput
              ideaTitle={ideaTitle}
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
  ideaTitleListItem: {
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
  selectedIdeaTitleColor: {
    backgroundColor: '#D7FFDB',
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
    paddingVertical: 4,
    paddingHorizontal: 8,
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
    paddingVertical: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    alignItems: 'center',
    borderRadius: 20,
    width: 100,
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
