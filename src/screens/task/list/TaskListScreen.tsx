import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TaskList} from '../../../components/task/TaskList';
import firebase from 'firebase';
import {useTaskListDispatch, useTaskListState} from './index';
import {setTaskList, setTime, TaskDetail} from './reducer/reducer';
import {TaskInput} from '../../../components/task/TaskInput';
import Loading from '../../../components/Loading';
import firestore = firebase.firestore;
import {endTodayDate, startTodayDate} from '../../../utils/time/time';

const TaskListScreen = () => {
  const taskList = useTaskListState((state) => state.task_list);
  const dispatch = useTaskListDispatch();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const db = firebase.firestore();
    const {currentUser} = firebase.auth();
    let unsubscribe = () => {
      // do nothing
    };
    if (currentUser) {
      setLoading(true);
      const ref = db.collection(`users/${currentUser.uid}/tasks`).orderBy('updatedAt', 'asc');
      unsubscribe = ref.onSnapshot(
        (snapshot) => {
          const userTasks: TaskDetail[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            userTasks.push({
              id: doc.id,
              bodyText: data.bodyText,
              updatedAt: data.updatedAt.toDate(),
              timeUpdatedAt: data.timeUpdatedAt.toDate(),
              todayTotalSeconds: data.todayTotalSeconds,
            });
          });
          dispatch(setTaskList(userTasks));
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
                tasks: data.tasks,
                task_id: data.task_id,
                task_bodyText: data.task_bodyText,
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

  return (
    <View style={styles.container}>
      <Loading isLoading={isLoading} />
      <TaskInput />
      <TaskList tasks={taskList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b4513',
  },
});

export default TaskListScreen;
