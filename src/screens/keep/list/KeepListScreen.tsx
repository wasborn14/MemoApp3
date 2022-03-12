import React, {useEffect, useMemo, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {KeepList} from '../../../components/keep/KeepList';
import Loading from '../../../components/Loading';
import Button from '../../../components/Button';
import {KeepTabNavigation} from '../../../navigation';
import {useNavigation} from '@react-navigation/native';
import LogOutButton from '../../../components/LogOutButton';
import firebase from 'firebase';
import {useKeepListDispatch, useKeepListState} from './index';
import {setKeepList} from './reducer/reducer';
import {KeepInput} from '../../../components/keep/KeepInput';

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

  const NoKeepListView = useMemo(
    () => (
      <View style={emptyStyles.container}>
        <Loading isLoading={isLoading} />
        <View style={emptyStyles.inner}>
          <Text style={emptyStyles.title}>最初のメモを作成しよう</Text>
          <Button
            label="作成する"            onPress={() => {
            nav.navigate('KeepCreate');
          }}

            style={emptyStyles.button}
          />
        </View>
      </View>
    ),
    [nav, isLoading],
  );

  return (
    <>
      {keepList.length === 0 ? (
        NoKeepListView
      ) : (
        <View style={styles.container}>
          <KeepInput />
          <KeepList keeps={keepList} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b4513',
  },
});

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    alignSelf: 'center',
  },
});

export default KeepListScreen;
