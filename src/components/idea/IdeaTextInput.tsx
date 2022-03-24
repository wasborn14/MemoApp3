import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, TextInput} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {translateErrors} from '../../utils';
import {IdeaTitleDetail, IdeaTextDetail} from '../../screens/idea/reducer/reducer';
import {editIdeaText, updateIdeaText} from '../../infras/api';

type Props = {
  editIdeaTextId?: number;
  ideaTitle: IdeaTitleDetail;
  id?: string;
  text?: string;
  onPress?: () => void;
  handlePressSave?: () => void;
};

export const IdeaTextInput: React.FC<Props> = ({
  editIdeaTextId,
  ideaTitle,
  text,
  onPress,
  handlePressSave,
}) => {
  const [inputText, setInputText] = useState('');

  const getMaxId = useCallback(() => {
    if (ideaTitle.ideaTextList.length > 0) {
      return Math.max(...ideaTitle.ideaTextList.map((ideaText) => ideaText.ideaTextId));
    }
    return 0;
  }, [ideaTitle]);

  const createPress = useCallback(() => {
    if (!inputText) {
      return;
    }
    const newIdea: IdeaTextDetail = {
      ideaTextId: getMaxId() + 1,
      ideaText: inputText,
      point: 1,
      updatedAt: new Date(),
    };
    updateIdeaText(ideaTitle, newIdea)
      .then(() => {
        handlePressSave && handlePressSave();
      })
      .catch((error) => {
        const errorMsg = translateErrors(error.code);
        Alert.alert(errorMsg.title, errorMsg.description);
      });
  }, [inputText, ideaTitle, getMaxId, handlePressSave]);

  const getSortIdeaList = useCallback(() => {
    const targetIdea = ideaTitle.ideaTextList.filter(function (ideaText) {
      return ideaText.ideaTextId === editIdeaTextId;
    });
    const ideaTextList: IdeaTextDetail[] = ideaTitle.ideaTextList.filter(function (ideaText) {
      return ideaText.ideaTextId !== editIdeaTextId;
    });
    const convertedIdea: IdeaTextDetail = {
      ...targetIdea[0],
      ideaText: inputText,
      updatedAt: new Date(),
    };
    ideaTextList.push(convertedIdea);
    return ideaTextList.sort((a, b) => {
      return a.ideaTextId - b.ideaTextId;
    });
  }, [editIdeaTextId, ideaTitle, inputText]);

  const editPress = useCallback(() => {
    if (!inputText) {
      return;
    }
    const sortIdeaList = getSortIdeaList();
    editIdeaText(ideaTitle, sortIdeaList)
      .then(() => {
        onPress && onPress();
      })
      .catch((error) => {
        const errorMsg = translateErrors(error.code);
        Alert.alert(errorMsg.title, errorMsg.description);
      });
  }, [getSortIdeaList, onPress, ideaTitle, inputText]);

  useEffect(() => {
    text && setInputText(text);
  }, [text]);

  return (
    <View style={styles.container}>
      <TextInput
        value={inputText}
        style={styles.inputText}
        onChangeText={(text) => setInputText(text)}
        onBlur={onPress ? editPress : createPress}
        placeholder="create IdeaText..."
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