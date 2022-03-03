import React, {useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, TextInput} from 'react-native';
import CircleButton from '../components/CircleButton';

const MemoCreateScreen = () => {
  const [bodyText, setBodyText] = useState('');

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
      <CircleButton name="check" />
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
