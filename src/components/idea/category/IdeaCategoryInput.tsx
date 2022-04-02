import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, TextInput} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {translateErrors} from '../../../utils';
import {IdeaCategoryDetail} from '../../../screens/idea/category/reducer/reducer';
import {postIdeaCategory, updateIdeaCategory} from '../../../infras/api';
import {useIdeaCategoryListState} from '../../../screens/idea/category';

type Props = {
  handlePressDisabled?: () => void;
  ideaCategory?: IdeaCategoryDetail;
  onPress?: () => void;
};

export const IdeaCategoryInput: React.FC<Props> = ({
  handlePressDisabled,
  ideaCategory,
  onPress,
}) => {
  const [inputText, setInputText] = useState('');
  const maxSortNo = useIdeaCategoryListState((state) => state.maxSortNo);

  const createPress = useCallback(() => {
    if (!inputText) {
      handlePressDisabled && handlePressDisabled();
      return;
    }
    postIdeaCategory(inputText, maxSortNo)
      .then(() => {
        handlePressDisabled && handlePressDisabled();
        setInputText('');
      })
      .catch((error) => {
        console.log(error);
        const errorMsg = translateErrors(error.code);
        Alert.alert(errorMsg.title, errorMsg.description);
      });
  }, [inputText, handlePressDisabled, maxSortNo]);

  const editPress = useCallback(() => {
    if (inputText && ideaCategory) {
      updateIdeaCategory(ideaCategory, inputText)
        .then(() => {
          onPress && onPress();
        })
        .catch((error) => {
          const errorMsg = translateErrors(error.code);
          Alert.alert(errorMsg.title, errorMsg.description);
        });
    }
  }, [ideaCategory, inputText, onPress]);

  useEffect(() => {
    ideaCategory && setInputText(ideaCategory.name);
  }, [ideaCategory]);

  return (
    <View style={styles.container}>
      <TextInput
        value={inputText}
        style={styles.inputText}
        onChangeText={(text) => setInputText(text)}
        onBlur={onPress ? editPress : createPress}
        placeholder="create IdeaCategory..."
        autoFocus={true}
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
