import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {IdeaCategoryInput} from '../../components/idea/IdeaCategoryInput';
import firebase from 'firebase';
import {useIdeaListDispatch, useIdeaListState} from './index';
import {IdeaCategoryDetail, setIdeaCategoryList} from './reducer/reducer';
import Loading from '../../components/Loading';
import {useNavigation} from '@react-navigation/native';
import {IdeaTabNavigation} from '../../navigation';
import {Feather} from '@expo/vector-icons';
import {IdeaCategory} from '../../components/idea/IdeaCategory';

const IdeaListScreen = () => {
  const nav = useNavigation<IdeaTabNavigation>();
  const [isLoading, setLoading] = useState(false);
  const dispatch = useIdeaListDispatch();
  const ideaCategoryList = useIdeaListState((state) => state.ideaCategoryList);
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
          const ideaCategoryListData: IdeaCategoryDetail[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            ideaCategoryListData.push({
              categoryId: doc.id,
              categoryName: data.categoryName,
              ideaList: data.ideaList,
              updatedAt: data.updatedAt.toDate(),
            });
          });
          dispatch(setIdeaCategoryList(ideaCategoryListData));
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
        <IdeaCategoryInput handlePressDisabled={() => setIsCreateCategory(false)} />
      )}
      <View style={styles.ideaCategoryListWrap}>
        <FlatList
          data={ideaCategoryList}
          renderItem={({item}) => <IdeaCategory ideaCategory={item} />}
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
  ideaCategoryListWrap: {
    marginTop: 8,
  },
});

export default IdeaListScreen;
