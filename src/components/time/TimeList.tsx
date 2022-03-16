import React from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
import {Time} from '../../screens/graph/top/reducer/reducer';

type Props = {
  timeList: Time[];
};

export const TimeList: React.FC<Props> = ({timeList}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={timeList}
        renderItem={({item}) => (
          <>
            <TouchableOpacity style={styles.taskListItem}>
              <View style={styles.taskInner}>
                <Text style={styles.taskListItemTitle} numberOfLines={1}>
                  {item.task_bodyText}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 16}}>作業時間：</Text>
                  <Text style={{fontSize: 16}}>{item.hours > 0 && item.hours + '時間'}</Text>
                  <Text style={{fontSize: 16}}>{item.minutes > 0 && item.minutes + '分'}</Text>
                  <Text style={{fontSize: 16}}>{item.seconds > 0 && item.seconds + '秒'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </>
        )}
        keyExtractor={(item) => item.id}
      />
      {/*// state: data.state,*/}
      {/*// task_id: data.task_id,*/}
      {/*// task_bodyText: data.task_bodyText,*/}
      {/*// year: data.year,*/}
      {/*// month: data.month,*/}
      {/*// day: data.day,*/}
      {/*// updatedAt: data.updatedAt.toDate(),*/}
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
