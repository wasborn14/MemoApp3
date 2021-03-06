import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Loading from '../components/Loading';
import {MainTabNavigation} from '../navigation';
import {useNavigation} from '@react-navigation/native';
import firebase from 'firebase';

const OpeningScreen = () => {
  const nav = useNavigation<MainTabNavigation>();
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
                screen: 'Shopping',
                param: {
                  screen: 'shoppingTop',
                },
              },
            },
          ],
        });
      } else {
        nav.reset({
          index: 0,
          routes: [
            {
              name: 'LogIn',
            },
          ],
        });
        setIsLoading(false);
      }
    });
    return unsubscribe;
  }, [nav]);

  return (
    <View style={styles.container}>
      <Loading isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b4513',
  },
});

export default OpeningScreen;
