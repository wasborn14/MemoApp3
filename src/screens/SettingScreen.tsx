import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {MainTabNavigation} from '../navigation';
import {useNavigation} from '@react-navigation/native';
import {UserMemo} from './memo/MemoListScreen';
import firebase from 'firebase';

type Props = {
  memos: UserMemo[];
};

export const SettingScreen: React.FC<Props> = () => {
  const nav = useNavigation<MainTabNavigation>();

  const handlePress = useCallback(() => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        nav.reset({
          index: 0,
          routes: [{name: 'LogIn'}],
        });
      })
      .catch(() => {
        Alert.alert('ログアウトに失敗しました');
      });
  }, [nav]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.memoListItem} onPress={handlePress}>
        <View>
          <Text style={styles.memoListItemTitle} numberOfLines={1}>
            ログアウト
          </Text>
        </View>
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
