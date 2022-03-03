import React, {useEffect, useMemo, useState} from 'react';
import {Text, View, StyleSheet, Alert} from 'react-native';
import {MemoList} from '../components/MemoList';
import CircleButton from '../components/CircleButton';
import Loading from '../components/Loading';
import Button from '../components/Button';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation';
import {useNavigation} from '@react-navigation/native';
import LogOutButton from '../components/LogOutButton';
import firebase from 'firebase';

type RootScreenProp = StackNavigationProp<RootStackParamList>;

export type UserMemo = {
  id: string;
  bodyText?: string;
  updatedAt?: Date;
};

const MemoListScreen = () => {
  const nav = useNavigation<RootScreenProp>();
  const [memos, setMemos] = useState<UserMemo[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    nav.setOptions({
      headerRight: () => <LogOutButton />,
    });
  }, [nav]);

  useEffect(() => {
    const db = firebase.firestore();
    const {currentUser} = firebase.auth();
    if (currentUser) {
      setLoading(true);
      const ref = db.collection(`users/${currentUser.uid}/memos`).orderBy('updatedAt', 'desc');
      ref.onSnapshot(
        (snapshot) => {
          const userMemos: UserMemo[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            userMemos.push({
              id: doc.id,
              bodyText: data.bodyText,
              updatedAt: data.updatedAt.toDate(),
            });
          });
          setMemos(userMemos);
          setLoading(false);
        },
        () => {
          setLoading(false);
          Alert.alert('データの読み込みに失敗しました。');
        },
      );
    }
  }, []);

  const NoMemoListView = useMemo(
    () => (
      <View style={emptyStyles.container}>
        <Loading isLoading={isLoading} />
        <View style={emptyStyles.inner}>
          <Text style={emptyStyles.title}>最初のメモを作成しよう</Text>
          <Button
            label="作成する"
            onPress={() => {
              nav.navigate('MemoCreate');
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
      {memos.length === 0 ? (
        NoMemoListView
      ) : (
        <View style={styles.container}>
          <MemoList memos={memos} />
          <CircleButton name="plus" onPress={() => nav.navigate('MemoCreate')} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
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

export default MemoListScreen;
