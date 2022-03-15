import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {KeepList} from '../../../components/keep/KeepList';
import {KeepTabNavigation} from '../../../navigation';
import {useNavigation} from '@react-navigation/native';
import LogOutButton from '../../../components/LogOutButton';
import firebase from 'firebase';
import {useKeepListDispatch, useKeepListState} from './index';
import {setKeepList, setTime} from './reducer/reducer';
import {KeepInput} from '../../../components/keep/KeepInput';
import Loading from '../../../components/Loading';
import firestore = firebase.firestore;
import {endTodayDate, startTodayDate} from '../../../utils/time/time';

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
  const time = useKeepListState((state) => state.time);

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

  useEffect(() => {
    console.log(keepList);
  }, [keepList]);

  useEffect(() => {
    const db = firebase.firestore();
    const {currentUser} = firebase.auth();
    let unsubscribe = () => {
      // do nothing
    };
    if (currentUser) {
      setLoading(true);
      const ref = db
        .collection(`users/${currentUser.uid}/times`)
        .where('updatedAt', '>=', firestore.Timestamp.fromDate(startTodayDate()))
        .where('updatedAt', '<', firestore.Timestamp.fromDate(endTodayDate()));
      unsubscribe = ref.onSnapshot(
        (snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (data) {
              const timeData = {
                id: doc.id,
                keeps: data.keeps,
                keep_id: data.keep_id,
                keep_bodyText: data.keep_bodyText,
                hours: data.hours,
                minutes: data.minutes,
                seconds: data.seconds,
                year: data.year,
                month: data.month,
                day: data.day,
                updatedAt: data.updatedAt.toDate(),
              };
              dispatch(setTime(timeData));
            }
            setLoading(false);
          });
        },
        () => {
          setLoading(false);
          // Alert.alert('データの読み込みに失敗しました。');
        },
      );
    }
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    console.log(time);
  }, [time]);

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
