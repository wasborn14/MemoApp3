import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, TextInput} from 'react-native';
import {Feather} from '@expo/vector-icons';
import firebase from 'firebase';
import {translateErrors} from '../../utils';

type Props = {
  id?: string;
  text?: string;
  onPress?: () => void;
};

export const KeepInput: React.FC<Props> = ({id, text, onPress}) => {
  const [bodyText, setBodyText] = useState('');

  const createPress = useCallback(() => {
    const {currentUser} = firebase.auth();
    const db = firebase.firestore();
    if (currentUser) {
      const ref = db.collection(`users/${currentUser.uid}/keeps`);
      ref
        .add({
          bodyText,
          updatedAt: new Date(),
        })
        .then(() => {
          setBodyText('');
        })
        .catch((error) => {
          console.log(error);
          const errorMsg = translateErrors(error.code);
          Alert.alert(errorMsg.title, errorMsg.description);
        });
    }
  }, [bodyText]);

  const editPress = useCallback(() => {
    const {currentUser} = firebase.auth();
    if (currentUser) {
      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/keeps`).doc(id);
      ref
        .set(
          {
            bodyText: bodyText,
            updatedAt: new Date(),
          },
          {merge: true},
        )
        .then(() => {
          onPress && onPress();
        })
        .catch((error) => {
          const errorMsg = translateErrors(error.code);
          Alert.alert(errorMsg.title, errorMsg.description);
        });
    }
  }, [id, bodyText, onPress]);

  useEffect(()=>{
    text && setBodyText(text);
  },[text]);

  return (
    <View style={styles.container}>
      <TextInput
        value={bodyText}
        style={styles.inputText}
        onChangeText={(text) => setBodyText(text)}
      />
      <TouchableOpacity onPress={onPress ? editPress : createPress}>
        <Feather name="plus" size={24} color="black" />
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
