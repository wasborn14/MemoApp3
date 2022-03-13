import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {KeepTabNavigation} from '../../../navigation';
import {useNavigation} from '@react-navigation/native';
import LogOutButton from '../../../components/LogOutButton';
import firebase from 'firebase';
import {setTimeList, Time} from './reducer/reducer';
import Loading from '../../../components/Loading';
import {useGraphTopDispatch, useGraphTopState} from './index';
import {TimeList} from '../../../components/time/TimeList';

const GraphTopScreen = () => {
  const nav = useNavigation<KeepTabNavigation>();
  const timeList = useGraphTopState((state) => state.time_list);
  const dispatch = useGraphTopDispatch();
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
      const ref = db.collection(`users/${currentUser.uid}/times`).orderBy('updatedAt', 'asc');
      unsubscribe = ref.onSnapshot(
        (snapshot) => {
          const userTimes: Time[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            userTimes.push({
              id: data.id,
              keep_id: data.keep_id,
              keep_bodyText: data.keep_bodyText,
              hours: data.hours,
              minutes: data.minutes,
              seconds: data.seconds,
              year: data.year,
              month: data.month,
              day: data.day,
              updatedAt: data.updatedAt.toDate(),
            });
          });
          dispatch(setTimeList(userTimes));
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
      <TimeList timeList={timeList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b4513',
  },
});

export default GraphTopScreen;
