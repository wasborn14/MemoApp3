import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
import {TaskTime, TimeDetail} from '../../screens/task/list/reducer/reducer';
import {startTodayDate} from '../../utils/time/time';

type Props = {
  timeList: TimeDetail[];
};

export const TimeList: React.FC<Props> = ({timeList}) => {
  const [todayTasks, setTodayTasks] = useState<TaskTime[]>([]);

  useEffect(() => {
    const todayTasksData = timeList.filter(function (time) {
      if (time.updatedAt >= startTodayDate()) {
        return time;
      }
    });
    if (todayTasksData[0]?.tasks) {
      setTodayTasks(todayTasksData[0].tasks);
    }
  }, [timeList]);

  return (
    <View style={styles.container}>
      <FlatList
        data={todayTasks}
        renderItem={({item}) => (
          <>
            <TouchableOpacity style={styles.taskListItem}>
              <View style={styles.taskInner}>
                <Text style={styles.taskListItemTitle} numberOfLines={1}>
                  {item.task_bodyText}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 16, fontWeight: '700'}}>{item.totalSeconds}</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
        keyExtractor={(item) => item.task_id}
      />
    </View>
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
    flexDirection: 'row',
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
