import React, {useCallback, useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, TextInput, Alert} from 'react-native';
import CircleButton from '../../components/CircleButton';
import firebase from 'firebase';
import {KeepTabNavigation} from '../../navigation';
import {useNavigation} from '@react-navigation/native';
import {translateErrors} from '../../utils';

const KeepCreateScreen = () => {
  const nav = useNavigation<KeepTabNavigation>();
  const [bodyText, setBodyText] = useState('');

  const handlePress = useCallback(() => {
    const {currentUser} = firebase.auth();
    const db = firebase.firestore();
    console.log(currentUser?.uid);
    if (currentUser) {
      const ref = db.collection(`users/${currentUser.uid}/keeps`);
      ref
        .add({
          bodyText,
          updatedAt: new Date(),
        })
        .then(() => {
          nav.goBack();
        })
        .catch((error) => {
          console.log(error);
          const errorMsg = translateErrors(error.code);
          Alert.alert(errorMsg.title, errorMsg.description);
        });
    }
  }, [nav, bodyText]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={bodyText}
          onChangeText={(text) => setBodyText(text)}
          multiline
          style={styles.input}
          autoFocus
          autoCapitalize="none"
        />
      </View>
      <CircleButton name="check" onPress={handlePress} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 27,
    paddingVertical: 32,
    flex: 1,
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    textAlignVertical: 'top',
  },
});

export default KeepCreateScreen;
