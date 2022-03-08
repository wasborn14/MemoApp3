import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import CircleButton from '../../components/CircleButton';
import {dateToString} from '../../utils';
import {UserMemo} from './MemoListScreen';
import {MemoStackPramList, MemoTabNavigation} from '../../navigation';
import {StackScreenProps} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import firebase from 'firebase';

export interface MemoDetailParams {
  id: string;
}

type MemoDetailProp = StackScreenProps<MemoStackPramList, 'MemoDetail'>;

const MemoDetailScreen: React.FC<MemoDetailProp> = ({route}) => {
  const {id} = route.params;
  const nav = useNavigation<MemoTabNavigation>();
  const [memo, setMemo] = useState<UserMemo | null>(null);

  useEffect(() => {
    const {currentUser} = firebase.auth();
    if (currentUser) {
      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/memos`).doc(id);
      ref.onSnapshot((doc) => {
        const data = doc.data();
        setMemo({
          id: doc.id,
          bodyText: data?.bodyText,
          updatedAt: data?.updatedAt.toDate(),
        });
      });
    }
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.memoHeader}>
        <Text style={styles.memoTitle} numberOfLines={1}>
          {memo?.bodyText}
        </Text>
        <Text style={styles.memoDate}>{dateToString(memo?.updatedAt)}</Text>
      </View>
      <ScrollView style={styles.memoBody}>
        <Text style={styles.memoText}>{memo?.bodyText}</Text>
      </ScrollView>
      <CircleButton
        style={{top: 60, bottom: 'auto'}}
        name="edit-2"
        onPress={() => {
          nav.navigate('MemoEdit', {id: memo?.id, bodyText: memo?.bodyText});
        }}
      />
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

export default MemoDetailScreen;
