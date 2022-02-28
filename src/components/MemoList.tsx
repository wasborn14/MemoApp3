import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Feather} from '@expo/vector-icons';

export const MemoList = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.memoListItem}>
        <View>
          <Text style={styles.memoListItemTitle}>title</Text>
          <Text style={styles.memoListItemDate}>date</Text>
        </View>
        <TouchableOpacity style={styles.memoDelete}>
          <Feather name="x" color="#B0b0b0" size={16} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  memoListItem: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 19,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  memoListItemTitle: {
    fontSize: 16,
    lineHeight: 32,
  },
  memoListItemDate: {
    fontSize: 12,
    lineHeight: 16,
    color: '#848484',
  },
  memoDelete: {
    padding: 8,
  },
});
