import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TaskTabNavigation} from '../../../navigation';
import {useNavigation} from '@react-navigation/native';
import LogOutButton from '../../../components/LogOutButton';
import firebase from 'firebase';
import {setTimeList} from './reducer/reducer';
import Loading from '../../../components/Loading';
import {useGraphTopDispatch, useGraphTopState} from './index';
import {TimeDetail} from '../../task/list/reducer/reducer';
import {TimeList} from '../../../components/time/TimeList';

const GraphTopScreen = () => {
  const nav = useNavigation<TaskTabNavigation>();
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
          const userTimeDetails: TimeDetail[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            userTimeDetails.push({
              id: data.id,
              tasks: data.tasks,
              task_id: data.task_id,
              task_bodyText: data.task_bodyText,
              updatedAt: data.updatedAt.toDate(),
            });
          });
          dispatch(setTimeList(userTimeDetails));
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
