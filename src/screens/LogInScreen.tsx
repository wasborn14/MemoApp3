import React, {useCallback, useEffect, useState} from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import Button from '../components/Button';
import Loading from '../components/Loading';
import {MainTabNavigation} from '../navigation';
import {useNavigation} from '@react-navigation/native';
import firebase from 'firebase';
import {translateErrors} from '../utils';

const LogInScreen = () => {
  const nav = useNavigation<MainTabNavigation>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
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
      } else {
        setIsLoading(false);
      }
    });
    return unsubscribe;
  }, [nav]);

  const handlePress = useCallback(() => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
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
      })
      .then(() => {
        setIsLoading(false);
      });
  }, [nav, email, password]);

  return (
    <View style={styles.container}>
      <Loading isLoading={isLoading} />
      <View style={styles.inner}>
        <Text style={styles.title}>Log In</Text>
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
          <Text style={styles.footerText}>Not registered?</Text>
          <TouchableOpacity onPress={() => nav.navigate('SignUp')}>
            <Text style={styles.footerLink}>Sign up here!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
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
    color: '#467FD3',
  },
});

export default LogInScreen;
