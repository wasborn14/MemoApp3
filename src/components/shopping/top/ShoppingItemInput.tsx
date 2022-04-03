import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, TextInput} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {translateErrors} from '../../../utils';
import {ShoppingItemDetail} from '../../../screens/shopping/reducer/reducer';
import {postShoppingItem, updateShoppingItem} from '../../../infras/api';

type Props = {
  handlePressDisabled?: () => void;
  shoppingItem?: ShoppingItemDetail;
  onPress?: () => void;
};

export const ShoppingItemInput: React.FC<Props> = ({
  handlePressDisabled,
  shoppingItem,
  onPress,
}) => {
  const [inputText, setInputText] = useState('');

  const createPress = useCallback(() => {
    if (!inputText) {
      handlePressDisabled && handlePressDisabled();
      return;
    }
    postShoppingItem(inputText)
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
    if (inputText && shoppingItem) {
      updateShoppingItem(shoppingItem, inputText)
        .then(() => {
          onPress && onPress();
        })
        .catch((error) => {
          const errorMsg = translateErrors(error.code);
          Alert.alert(errorMsg.title, errorMsg.description);
        });
    }
  }, [shoppingItem, inputText, onPress]);

  useEffect(() => {
    shoppingItem && setInputText(shoppingItem.name);
  }, [shoppingItem]);

  return (
    <View style={styles.container}>
      <TextInput
        value={inputText}
        style={styles.inputText}
        onChangeText={(text) => setInputText(text)}
        onBlur={onPress ? editPress : createPress}
        placeholder="create ShoppingItem..."
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
    paddingVertical: 4,
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
