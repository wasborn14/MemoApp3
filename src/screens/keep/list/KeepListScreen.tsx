import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {KeepList} from '../../../components/keep/KeepList';
import {KeepTabNavigation} from '../../../navigation';
import {useNavigation} from '@react-navigation/native';
import LogOutButton from '../../../components/LogOutButton';
import firebase from 'firebase';
import {useKeepListDispatch, useKeepListState} from './index';
import {setKeepList} from './reducer/reducer';
import {KeepInput} from '../../../components/keep/KeepInput';
import Loading from '../../../components/Loading';

export type UserKeep = {
  id: string;
  bodyText?: string;
  updatedAt?: Date;
};

const KeepListScreen = () => {
  const nav = useNavigation<KeepTabNavigation>();
  const keepList = useKeepListState((state) => state.keep_list);
  const dispatch = useKeepListDispatch();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    nav.setOptions({
      headerRight: () => <LogOutButton />,
    });
  }, [nav]);

  useEffect(() => {
    const db = firebase.firestore();
    const {currentUser} = firebase.auth();
    let unsubscribe = () => {
      // do nothing
    };
    if (currentUser) {
      setLoading(true);
      const ref = db.collection(`users/${currentUser.uid}/keeps`).orderBy('updatedAt', 'desc');
      unsubscribe = ref.onSnapshot(
        (snapshot) => {
          const userKeeps: UserKeep[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            userKeeps.push({
              id: doc.id,
              bodyText: data.bodyText,
              updatedAt: data.updatedAt.toDate(),
            });
          });
          dispatch(setKeepList(userKeeps));
          setLoading(false);
        },
        () => {
          setLoading(false);
          // Alert.alert('データの読み込みに失敗しました。');
        },
      );
    }
    return unsubscribe;
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Loading isLoading={isLoading} />
      <KeepInput />
      <KeepList keeps={keepList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b4513',
  },
});

export default KeepListScreen;
