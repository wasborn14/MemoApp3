import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, TextInput} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {translateErrors} from '../../../utils';
import {IdeaTitleDetail} from '../../../screens/idea/list/reducer/reducer';
import {postIdeaTitle, updateIdeaTitle} from '../../../infras/api';
import {useIdeaListState} from '../../../screens/idea/list';

type Props = {
  handlePressDisabled?: () => void;
  ideaTitle?: IdeaTitleDetail;
  onPress?: () => void;
};

export const IdeaTitleInput: React.FC<Props> = ({handlePressDisabled, ideaTitle, onPress}) => {
  const [inputText, setInputText] = useState('');
  const selectedIdeaCategory = useIdeaListState((state) => state.selectedIdeaCategory);
  const maxSortNo = useIdeaListState((state) => state.maxSortNo);

  const createPress = useCallback(() => {
    if (!inputText || !selectedIdeaCategory) {
      handlePressDisabled && handlePressDisabled();
      return;
    }
    postIdeaTitle(selectedIdeaCategory.id, inputText, maxSortNo)
      .then(() => {
        handlePressDisabled && handlePressDisabled();
        setInputText('');
      })
      .catch((error) => {
        console.log(error);
        const errorMsg = translateErrors(error.code);
        Alert.alert(errorMsg.title, errorMsg.description);
      });
  }, [inputText, selectedIdeaCategory, handlePressDisabled, maxSortNo]);

  const editPress = useCallback(() => {
    if (inputText && ideaTitle && selectedIdeaCategory) {
      updateIdeaTitle(selectedIdeaCategory.id, ideaTitle, inputText)
        .then(() => {
          onPress && onPress();
        })
        .catch((error) => {
          const errorMsg = translateErrors(error.code);
          Alert.alert(errorMsg.title, errorMsg.description);
        });
    }
  }, [selectedIdeaCategory, ideaTitle, inputText, onPress]);

  useEffect(() => {
    ideaTitle && setInputText(ideaTitle.name);
  }, [ideaTitle]);

  return (
    <View style={styles.container}>
      <TextInput
        value={inputText}
        style={styles.inputText}
        onChangeText={(text) => setInputText(text)}
        onBlur={onPress ? editPress : createPress}
        autoFocus={true}
        autoCapitalize="none"
        placeholder="create IdeaTitle..."
        selectionColor="#8b4513"
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
    paddingLeft: 12,
    paddingRight: 16,
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
