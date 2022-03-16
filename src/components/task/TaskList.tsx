import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {UserTask} from '../../screens/task/list/TaskListScreen';
import {Task} from './Task';

type Props = {
  tasks: UserTask[];
};

export const TaskList: React.FC<Props> = ({tasks}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={({item}) => <Task task={item} />}
        keyExtractor={(item) => item.id}
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
});
