import React, {useState} from 'react';
import {Text, View, StyleSheet, KeyboardAvoidingView, TextInput, ScrollView} from 'react-native';
import CircleButton from '../components/CircleButton';
import {dateToString} from '../utils';

const MemoEditScreen = () => {
  const [body, setBody] = useState('');
  const [memo, setMemo] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.memoHeader}>
        <Text style={styles.memoTitle} numberOfLines={1}>
          テストテキスト
        </Text>
        <Text style={styles.memoDate}>2022年2月28日</Text>
      </View>
      <ScrollView style={styles.memoBody}>
        <Text style={styles.memoText}>テストテキスト</Text>
      </ScrollView>
      <CircleButton style={{top: 60, bottom: 'auto'}} name="edit-2" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  memoHeader: {
    backgroundColor: 'gray',
    height: 96,
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 19,
  },
  memoTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  memoDate: {
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 16,
  },
  memoBody: {
    paddingVertical: 32,
    paddingHorizontal: 27,
  },
  memoText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default MemoEditScreen;
