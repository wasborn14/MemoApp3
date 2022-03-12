import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import CircleButton from '../../components/CircleButton';
import {dateToString} from '../../utils';
import {UserKeep} from './list/KeepListScreen';
import {KeepStackPramList, KeepTabNavigation} from '../../navigation';
import {StackScreenProps} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import firebase from 'firebase';

export interface KeepDetailParams {
  id: string;
}

type KeepDetailProp = StackScreenProps<KeepStackPramList, 'KeepDetail'>;

const KeepDetailScreen: React.FC<KeepDetailProp> = ({route}) => {
  const {id} = route.params;
  const nav = useNavigation<KeepTabNavigation>();
  const [keep, setKeep] = useState<UserKeep | null>(null);

  useEffect(() => {
    const {currentUser} = firebase.auth();
    if (currentUser) {
      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/keeps`).doc(id);
      ref.onSnapshot((doc) => {
        const data = doc.data();
        setKeep({
          id: doc.id,
          bodyText: data?.bodyText,
          updatedAt: data?.updatedAt.toDate(),
        });
      });
    }
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.keepHeader}>
        <Text style={styles.keepTitle} numberOfLines={1}>
          {keep?.bodyText}
        </Text>
        <Text style={styles.keepDate}>{dateToString(keep?.updatedAt)}</Text>
      </View>
      <ScrollView style={styles.keepBody}>
        <Text style={styles.keepText}>{keep?.bodyText}</Text>
      </ScrollView>
      <CircleButton
        style={{top: 60, bottom: 'auto'}}
        name="edit-2"
        onPress={() => {
          nav.navigate('KeepEdit', {id: keep?.id, bodyText: keep?.bodyText});
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
  keepHeader: {
    backgroundColor: 'gray',
    height: 96,
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 19,
  },
  keepTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  keepDate: {
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 16,
  },
  keepBody: {
    paddingVertical: 32,
    paddingHorizontal: 27,
  },
  keepText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default KeepDetailScreen;
