import React, {useCallback, useState} from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import Button from '../components/Button';
import firebase from 'firebase';
import {useNavigation} from '@react-navigation/native';
import {MainTabNavigation} from '../navigation';
import {translateErrors} from '../utils';

const SignUpScreen = () => {
  const nav = useNavigation<MainTabNavigation>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlePress = useCallback(() => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        nav.reset({
          index: 0,
          routes: [
            {
              name: 'MainTab',
              params: {
                screen: 'MemoList',
              },
            },
          ],
        });
      })
      .catch((error) => {
        const errorMsg = translateErrors(error.code);
        Alert.alert(errorMsg.title, errorMsg.description);
      });
  }, [nav, email, password]);

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email Address"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          autoCapitalize="none"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        <Button label="Submit" onPress={handlePress} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already registered?</Text>
          <TouchableOpacity
            onPress={() =>
              nav.reset({
                index: 0,
                routes: [{name: 'LogIn'}],
              })
            }
          >
            <Text style={styles.footerLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b4513',
  },
  inner: {
    paddingHorizontal: 27,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#FFF',
  },
  input: {
    fontSize: 16,
    height: 48,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
  },
  footerText: {
    fontSize: 14,
    lineHeight: 24,
    marginRight: 8,
  },
  footerLink: {
    fontSize: 14,
    lineHeight: 24,
    color: '#FFF',
  },
});

export default SignUpScreen;
