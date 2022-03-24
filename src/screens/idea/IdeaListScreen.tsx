import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {IdeaTitleInput} from '../../components/idea/IdeaTitleInput';
import firebase from 'firebase';
import {useIdeaListDispatch, useIdeaListState} from './index';
import {IdeaTitleDetail, setIdeaTitleList} from './reducer/reducer';
import Loading from '../../components/Loading';
import {useNavigation} from '@react-navigation/native';
import {IdeaTabNavigation} from '../../navigation';
import {Feather} from '@expo/vector-icons';
import {IdeaTitle} from '../../components/idea/IdeaTitle';

const IdeaListScreen = () => {
  const nav = useNavigation<IdeaTabNavigation>();
  const [isLoading, setLoading] = useState(false);
  const dispatch = useIdeaListDispatch();
  const ideaTitleList = useIdeaListState((state) => state.ideaTitleList);
  const [isCreateCategory, setIsCreateCategory] = useState(false);

  useEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{marginTop: 8, marginHorizontal: 16}}
          onPress={() => {
            setIsCreateCategory((prev) => !prev);
          }}
        >
          {isCreateCategory ? (
            <Feather name="x" color="black" size={24} />
          ) : (
            <Feather name="plus" color="black" size={24} />
          )}
        </TouchableOpacity>
      ),
    });
  }, [nav, isCreateCategory]);

  useEffect(() => {
    const db = firebase.firestore();
    const {currentUser} = firebase.auth();
    let unsubscribe = () => {
      // do nothing
    };
    if (currentUser) {
      setLoading(true);
      const ref = db.collection(`users/${currentUser.uid}/ideas`).orderBy('updatedAt', 'asc');
      unsubscribe = ref.onSnapshot(
        (snapshot) => {
          const ideaTitleListData: IdeaTitleDetail[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            ideaTitleListData.push({
              categoryId: doc.id,
              categoryName: data.categoryName,
              ideaTextList: data.ideaTextList,
              updatedAt: data.updatedAt.toDate(),
            });
          });
          dispatch(setIdeaTitleList(ideaTitleListData));
          setLoading(false);
        },
        () => {
          setLoading(false);
          // Alert.alert('データの読み込みに失敗しました。');
        },
      );
    }
    return unsubscribe;
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Loading isLoading={isLoading} />
      {isCreateCategory && (
        <IdeaTitleInput handlePressDisabled={() => setIsCreateCategory(false)} />
      )}
      <View style={styles.ideaTitleListWrap}>
        <FlatList
          data={ideaTitleList}
          renderItem={({item}) => <IdeaTitle ideaTitle={item} />}
          keyExtractor={(item) => item.categoryId}
          contentContainerStyle={{paddingBottom: 20}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b4513',
  },
  ideaTitleListWrap: {
    marginTop: 8,
  },
});

export default IdeaListScreen;
