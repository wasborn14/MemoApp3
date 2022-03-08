import React, {useCallback} from 'react';
import {Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MainTabNavigation} from '../navigation';
import firebase from 'firebase';

const LogOutButton = () => {
  const nav = useNavigation<MainTabNavigation>();

  const handlePress = useCallback(() => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        nav.reset({
          index: 0,
          routes: [{name: 'LogIn'}],
        });
      })
      .catch(() => {
        Alert.alert('ログアウトに失敗しました');
      });
  }, [nav]);

  return (
    <TouchableOpacity style={styles.container} onPress={() => handlePress()}>
      <Text style={styles.label}>ログアウト</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
});

export default LogOutButton;
