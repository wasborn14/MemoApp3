import React, {useCallback, useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, TextInput, Alert} from 'react-native';
import CircleButton from '../../components/CircleButton';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {KeepStackPramList, KeepTabNavigation} from '../../navigation';
import firebase from 'firebase';
import {translateErrors} from '../../utils';

export interface KeepEditParams {
  id?: string;
  bodyText?: string;
}

type KeepEditProp = StackScreenProps<KeepStackPramList, 'KeepEdit'>;

const KeepEditScreen: React.FC<KeepEditProp> = ({route}) => {
  const {id, bodyText} = route.params;
  const nav = useNavigation<KeepTabNavigation>();
  const [body, setBody] = useState(bodyText);

  const handlePress = useCallback(() => {
    const {currentUser} = firebase.auth();
    if (currentUser) {
      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/keeps`).doc(id);
      ref
        .set(
          {
            bodyText: body,
            updatedAt: new Date(),
          },
          {merge: true},
        )
        .then(() => {
          nav.goBack();
        })
        .catch((error) => {
          const errorMsg = translateErrors(error.code);
          Alert.alert(errorMsg.title, errorMsg.description);
        });
    }
  }, [id, body, nav]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={body}
          multiline
          style={styles.input}
          onChangeText={(text) => {
            setBody(text);
          }}
        />
      </View>
      <CircleButton name="check" onPress={() => handlePress()} />
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

export default KeepEditScreen;
