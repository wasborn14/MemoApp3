import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, TextInput} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {translateErrors} from '../../../utils';
import {IdeaTitleDetail, IdeaTextDetail} from '../../../screens/idea/list/reducer/reducer';
import {editIdeaText, updateIdeaText} from '../../../infras/api';
import {useIdeaListState} from '../../../screens/idea/list';

type Props = {
  editIdeaTextId?: number;
  ideaTitle: IdeaTitleDetail;
  id?: string;
  name?: string;
  onPress?: () => void;
  handlePressSave?: () => void;
};

export const IdeaTextInput: React.FC<Props> = ({
  editIdeaTextId,
  ideaTitle,
  name,
  onPress,
  handlePressSave,
}) => {
  const [inputText, setInputText] = useState('');
  const selectedIdeaCategory = useIdeaListState((state) => state.selectedIdeaCategory);

  const getMaxId = useCallback(() => {
    if (ideaTitle.ideaTextList.length > 0) {
      return Math.max(...ideaTitle.ideaTextList.map((ideaText) => ideaText.id));
    }
    return 0;
  }, [ideaTitle]);

  const createPress = useCallback(() => {
    if (!inputText || !selectedIdeaCategory) {
      handlePressSave && handlePressSave();
      return;
    }
    const newIdea: IdeaTextDetail = {
      id: getMaxId() + 1,
      name: inputText,
      point: 1,
      updatedAt: new Date(),
    };
    updateIdeaText(selectedIdeaCategory.id, ideaTitle, newIdea)
      .then(() => {
        handlePressSave && handlePressSave();
      })
      .catch((error) => {
        const errorMsg = translateErrors(error.code);
        Alert.alert(errorMsg.title, errorMsg.description);
      });
  }, [inputText, ideaTitle, getMaxId, handlePressSave, selectedIdeaCategory]);

  const getSortIdeaList = useCallback(() => {
    const targetIdea = ideaTitle.ideaTextList.filter(function (ideaText) {
      return ideaText.id === editIdeaTextId;
    });
    const ideaTextList: IdeaTextDetail[] = ideaTitle.ideaTextList.filter(function (ideaText) {
      return ideaText.id !== editIdeaTextId;
    });
    const convertedIdea: IdeaTextDetail = {
      ...targetIdea[0],
      name: inputText,
      updatedAt: new Date(),
    };
    ideaTextList.push(convertedIdea);
    return ideaTextList.sort((a, b) => {
      return a.id - b.id;
    });
  }, [editIdeaTextId, ideaTitle, inputText]);

  const editPress = useCallback(() => {
    if (!inputText || !selectedIdeaCategory) {
      return;
    }
    const sortIdeaList = getSortIdeaList();
    editIdeaText(selectedIdeaCategory.id, ideaTitle.id, sortIdeaList)
      .then(() => {
        onPress && onPress();
      })
      .catch((error) => {
        const errorMsg = translateErrors(error.code);
        Alert.alert(errorMsg.title, errorMsg.description);
      });
  }, [getSortIdeaList, onPress, ideaTitle, inputText, selectedIdeaCategory]);

  useEffect(() => {
    name && setInputText(name);
  }, [name]);

  return (
    <View style={styles.container}>
      <TextInput
        value={inputText}
        style={styles.inputText}
        onChangeText={(text) => setInputText(text)}
        onBlur={onPress ? editPress : createPress}
        placeholder="create IdeaText..."
        autoFocus={true}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={onPress ? editPress : createPress}>
        {onPress ? (
          <Feather name="check" size={24} color="black" />
        ) : (
          <Feather name="plus" size={24} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 19,
    marginVertical: 4,
    marginRight: 16,
    marginLeft: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 10,
    flexDirection: 'row',
  },
  inputText: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
  },
});
