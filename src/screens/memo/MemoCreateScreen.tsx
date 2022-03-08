import React, {useCallback, useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, TextInput, Alert} from 'react-native';
import CircleButton from '../../components/CircleButton';
import firebase from 'firebase';
import {MemoTabNavigation} from '../../navigation';
import {useNavigation} from '@react-navigation/native';
import {translateErrors} from '../../utils';

const MemoCreateScreen = () => {
  const nav = useNavigation<MemoTabNavigation>();
  const [bodyText, setBodyText] = useState('');

  const handlePress = useCallback(() => {
    const {currentUser} = firebase.auth();
    const db = firebase.firestore();
    if (currentUser) {
      const ref = db.collection(`users/${currentUser.uid}/memos`);
      ref
        .add({
          bodyText,
          updatedAt: new Date(),
        })
        .then(() => {
          nav.goBack();
        })
        .catch((error) => {
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

export default MemoCreateScreen;
