import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, TextInput} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {translateErrors} from '../../utils';
import {IdeaTitleDetail} from '../../screens/idea/reducer/reducer';
import {postIdeaTitle, updateIdeaTitle} from '../../infras/api';

type Props = {
  handlePressDisabled?: () => void;
  ideaTitle?: IdeaTitleDetail;
  onPress?: () => void;
};

export const IdeaTitleInput: React.FC<Props> = ({handlePressDisabled, ideaTitle, onPress}) => {
  const [inputText, setInputText] = useState('');

  const createPress = useCallback(() => {
    if (!inputText) {
      return;
    }
    postIdeaTitle(inputText)
      .then(() => {
        handlePressDisabled && handlePressDisabled();
        setInputText('');
      })
      .catch((error) => {
        console.log(error);
        const errorMsg = translateErrors(error.code);
        Alert.alert(errorMsg.title, errorMsg.description);
      });
  }, [inputText, handlePressDisabled]);

  const editPress = useCallback(() => {
    if (inputText && ideaTitle) {
      updateIdeaTitle(ideaTitle, inputText)
        .then(() => {
          onPress && onPress();
        })
        .catch((error) => {
          const errorMsg = translateErrors(error.code);
          Alert.alert(errorMsg.title, errorMsg.description);
        });
    }
  }, [ideaTitle, inputText, onPress]);

  useEffect(() => {
    ideaTitle && setInputText(ideaTitle.ideaTitleName);
  }, [ideaTitle]);

  return (
    <View style={styles.container}>
      <TextInput
        value={inputText}
        style={styles.inputText}
        onChangeText={(text) => setInputText(text)}
        onBlur={onPress ? editPress : createPress}
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
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 8,
    paddingHorizontal: 19,
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
