import React, {useCallback, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {Feather} from '@expo/vector-icons';
import firebase from 'firebase';
import {TaskInput} from './TaskInput';
import {translateErrors} from '../../utils';
import {useTaskListState} from '../../screens/task/list';
import {TaskTime, TaskDetail, TimeDetail} from '../../screens/task/list/reducer/reducer';
import {convertSecToTime, isSameDate, startTodayDate} from '../../utils/time/time';
import {useTimer} from 'use-timer';

type Props = {
  task: TaskDetail;
};

export const Task: React.FC<Props> = ({task}) => {
  const [editTaskId, setEditTaskId] = useState('noMatch');
  const {time, start, pause, status} = useTimer({
    initialTime: task.timeUpdatedAt >= startTodayDate() ? task.todayTotalSeconds : 0,
  });
  const timeDetail = useTaskListState((state) => state.time_detail);

  const deleteTask = useCallback((id) => {
    const {currentUser} = firebase.auth();
    if (currentUser) {
      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/tasks`).doc(id);
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

  const updateTimeDetail = useCallback(
    (now: Date, timeDetail: TimeDetail, time: number, currentUser) => {
      if (!timeDetail.tasks) return;
      const db = firebase.firestore();
      const new_tasks = createNewTasks(timeDetail.tasks, time);
      const ref = db.collection(`users/${currentUser.uid}/times`).doc(timeDetail.id);
      ref
        .set(
          {
            id: timeDetail.id,
            tasks: new_tasks,
            task_id: task.id,
            task_bodyText: task.bodyText,
            updatedAt: now,
          },
          {merge: true},
        )
        .then(() => {
          const taskRef = db.collection(`users/${currentUser.uid}/tasks`).doc(task.id);
          taskRef
            .set(
              {
                timeUpdatedAt: now,
                todayTotalSeconds: time,
              },
              {merge: true},
            )
            .then(() => {
              pause();
            })
            .catch((error) => {
              console.log(error);
              const errorMsg = translateErrors(error.code);
              Alert.alert(errorMsg.title, errorMsg.description);
            });
        })
        .catch((error) => {
          console.log(error);
          const errorMsg = translateErrors(error.code);
          Alert.alert(errorMsg.title, errorMsg.description);
        });
    },
    [createNewTasks, pause, task],
  );

  const createTimeDetail = useCallback(
    (now: Date, time: number, currentUser) => {
      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/times/`);
      ref
        .add({
          tasks: [{task_id: task.id, task_bodyText: task.bodyText, totalSeconds: time}],
          task_id: task.id,
          task_bodyText: task.bodyText,
          updatedAt: now,
        })
        .then(() => {
          const taskRef = db.collection(`users/${currentUser.uid}/tasks`).doc(task.id);
          taskRef
            .set(
              {
                timeUpdatedAt: now,
                todayTotalSeconds: time,
              },
              {merge: true},
            )
            .then(() => {
              pause();
            })
            .catch((error) => {
              console.log(error);
              const errorMsg = translateErrors(error.code);
              Alert.alert(errorMsg.title, errorMsg.description);
            });
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
    if (status === 'RUNNING') {
      const {currentUser} = firebase.auth();
      if (!currentUser) {
        return;
      }
      const now = new Date();
      if (timeDetail && isSameDate(timeDetail.updatedAt, now)) {
        if (timeDetail.tasks) {
          updateTimeDetail(now, timeDetail, time, currentUser);
        }
      } else {
        createTimeDetail(now, time, currentUser);
      }
    } else {
      start();
    }
  }, [timeDetail, createTimeDetail, updateTimeDetail, time, status, start]);

  return (
    <>
      {task.id === editTaskId ? (
        <>
          <TaskInput id={task.id} text={task.bodyText} onPress={() => setEditTaskId('noMatch')} />
        </>
      ) : (
        <TouchableOpacity
          style={[styles.taskListItem, status === 'RUNNING' && styles.runningColor]}
          onPress={handleTimePress}
        >
          <View style={styles.taskInner}>
            <Text style={styles.taskListItemTitle} numberOfLines={1}>
              {task.bodyText}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 16}}>{convertSecToTime(time)}</Text>
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
  runningColor: {
    backgroundColor: '#adffff',
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
