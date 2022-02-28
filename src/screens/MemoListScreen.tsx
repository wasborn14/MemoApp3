import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {MemoList} from '../components/MemoList';
import CircleButton from '../components/CircleButton';

const MemoListScreen = () => {
  return (
    <View style={styles.container}>
      <MemoList />
      <CircleButton name="plus" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
});

export default MemoListScreen;
