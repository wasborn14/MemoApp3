import React, {useCallback, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {UserTask} from '../../screens/task/list/TaskListScreen';
import firebase from 'firebase';
import {TaskInput} from './TaskInput';
import {useStopwatch} from 'react-timer-hook';
import {translateErrors} from '../../utils';
import {useTaskListDispatch, useTaskListState} from '../../screens/task/list';
import {TaskTime, setTimeForTask, Time} from '../../screens/task/list/reducer/reducer';
import {convertSeconds, sameDate} from '../../utils/time/time';

type Props = {
  task: UserTask;
};

export const Task: React.FC<Props> = ({task}) => {
  const [editTaskId, setEditTaskId] = useState('noMatch');
  const {seconds, minutes, hours, isRunning, start, pause} = useStopwatch({
    autoStart: false,
  });
  const time = useTaskListState((state) => state.time);
  const dispatch = useTaskListDispatch();

  const deleteTask = useCallback((id) => {
    const {currentUser} = firebase.auth();
    if (currentUser) {
      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/tasks`).doc(id);
      console.log('id', id);
      Alert.alert('タスクを削除します。', 'よろしいですか？', [
        {
          text: 'キャンセル',
          onPress: () => {
            // do nothing
          },
        },
        {
          text: '削除する',
          style: 'destructive',
          onPress: () => {
            ref.delete().catch(() => {
              Alert.alert('削除に失敗しました。');
            });
          },
        },
      ]);
    }
  }, []);

  const createNewTasks = useCallback(
    (tasks: TaskTime[], totalSeconds: number) => {
      const different = tasks.filter(function (item) {
        return item.task_id !== task.id;
      });
      const new_task = {
        task_id: task.id,
        task_bodyText: task.bodyText,
        totalSeconds: totalSeconds,
      };
      return [...different, new_task];
    },
    [task],
  );

  const updateTimes = useCallback(
    (now: Date, time: Time, totalSeconds: number, currentUser) => {
      if (!time.tasks) return;
      const db = firebase.firestore();
      const new_tasks = createNewTasks(time.tasks, totalSeconds);
      const ref = db.collection(`users/${currentUser.uid}/times`).doc(time.id);
      ref
        .set(
          {
            id: time.id,
            tasks: new_tasks,
            task_id: task.id,
            task_bodyText: task.bodyText,
            updatedAt: now,
          },
          {merge: true},
        )
        .then(() => {
          // この時 tasklistに対して今の時間を設定する必要あり
          dispatch(setTimeForTask({task_id: task.id, updatedAt: now, totalSeconds}));
          pause();
        })
        .catch((error) => {
          console.log(error);
          const errorMsg = translateErrors(error.code);
          Alert.alert(errorMsg.title, errorMsg.description);
        });
    },
    [dispatch, createNewTasks, pause, task],
  );

  const createTimes = useCallback(
    (now: Date, totalSeconds: number, currentUser) => {
      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/times/`);
      ref
        .add({
          tasks: [{task_id: task.id, task_bodyText: task.bodyText, totalSeconds: totalSeconds}],
          task_id: task.id,
          task_bodyText: task.bodyText,
          updatedAt: now,
        })
        .then(() => {
          pause();
        })
        .catch((error) => {
          console.log(error);
          const errorMsg = translateErrors(error.code);
          Alert.alert(errorMsg.title, errorMsg.description);
        });
    },
    [pause, task],
  );

  const handleTimePress = useCallback(() => {
    if (isRunning) {
      const {currentUser} = firebase.auth();
      if (!currentUser) {
        return;
      }
      const now = new Date();
      const totalSeconds = convertSeconds(hours, minutes, seconds);
      if (time && sameDate(time.updatedAt, now)) {
        if (time.tasks) {
          updateTimes(now, time, totalSeconds, currentUser);
        }
      } else {
        createTimes(now, totalSeconds, currentUser);
      }
    } else {
      start();
    }
  }, [createTimes, updateTimes, hours, minutes, seconds, time, isRunning, start]);

  return (
    <>
      {task.id === editTaskId ? (
        <>
          <TaskInput id={task.id} text={task.bodyText} onPress={() => setEditTaskId('noMatch')} />
        </>
      ) : (
        <TouchableOpacity style={styles.taskListItem} onPress={handleTimePress}>
          <View style={styles.taskInner}>
            <Text style={styles.taskListItemTitle} numberOfLines={1}>
              {task.bodyText}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 16}}>{hours > 0 && hours + ':'}</Text>
            <Text style={{fontSize: 16}}>{minutes > 0 && minutes + ':'}</Text>
            <Text style={{fontSize: 16}}>{seconds}</Text>
          </View>
          <TouchableOpacity
            style={styles.taskDelete}
            onPress={() => {
              setEditTaskId(task.id);
            }}
          >
            <Feather name="edit" color="#B0b0b0" size={16} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.taskDelete}
            onPress={() => {
              deleteTask(task.id);
            }}
          >
            <Feather name="x" color="#B0b0b0" size={16} />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b4513',
    marginTop: 8,
  },
  taskListItem: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 19,
    marginVertical: 4,
    marginHorizontal: 16,
    alignItems: 'center',
    borderRadius: 20,
    // 影の設定
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 10,
  },
  taskInner: {
    flex: 1,
  },
  taskListItemTitle: {
    fontSize: 16,
    lineHeight: 32,
  },
  taskListItemDate: {
    fontSize: 12,
    lineHeight: 16,
    color: '#848484',
  },
  taskDelete: {
    padding: 8,
  },
});