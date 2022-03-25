import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import firebase from 'firebase';
import {useIdeaCategoryListDispatch, useIdeaCategoryListState} from './index';
import {IdeaCategoryDetail, setIdeaCategoryList, setMaxSortNo} from './reducer/reducer';
import Loading from '../../../components/Loading';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@expo/vector-icons';
import {IdeaTabNavigation} from '../../../navigation';
import {IdeaCategory} from '../../../components/idea/category/IdeaCategory';
import {IdeaCategoryInput} from '../../../components/idea/category/IdeaCategoryInput';

const IdeaCategoryListScreen = () => {
  const nav = useNavigation<IdeaTabNavigation>();
  const [isLoading, setLoading] = useState(false);
  const dispatch = useIdeaCategoryListDispatch();
  const ideaCategoryList = useIdeaCategoryListState((state) => state.ideaCategoryList);
  const [isCreateIdeaCategory, setIsCreateIdeaCategory] = useState(false);

  const maxSortNo = useCallback(() => {
    if (ideaCategoryList.length > 0) {
      return Math.max(...ideaCategoryList.map((ideaCategory) => ideaCategory.sortNo));
    }
    return 0;
  }, [ideaCategoryList]);

  useEffect(() => {
    dispatch(setMaxSortNo(maxSortNo()));
  }, [dispatch, maxSortNo]);

  useEffect(() => {
    nav.setOptions({
      headerLeft: () => <Feather name="x" color="black" size={24} />,
      headerRight: () => (
        <TouchableOpacity
          style={{marginTop: 8, marginHorizontal: 16}}
          onPress={() => {
            setIsCreateIdeaCategory((prev) => !prev);
          }}
        >
          {isCreateIdeaCategory ? (
            <Feather name="x" color="black" size={24} />
          ) : (
            <Feather name="plus" color="black" size={24} />
          )}
        </TouchableOpacity>
      ),
    });
  }, [nav, isCreateIdeaCategory]);

  useEffect(() => {
    const db = firebase.firestore();
    const {currentUser} = firebase.auth();
    let unsubscribe = () => {
      // do nothing
    };
    if (currentUser) {
      setLoading(true);
      const ref = db
        .collection(`users/${currentUser.uid}/ideaCategories`)
        .orderBy('updatedAt', 'asc');
      unsubscribe = ref.onSnapshot(
        (snapshot) => {
          const ideaCategoryListData: IdeaCategoryDetail[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            ideaCategoryListData.push({
              ideaCategoryId: doc.id,
              ideaCategoryName: data.ideaCategoryName,
              sortNo: data.sortNo,
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
      <View>
        {isCreateIdeaCategory && (
          <IdeaCategoryInput handlePressDisabled={() => setIsCreateIdeaCategory(false)} />
        )}
        <View style={styles.ideaTitleListWrap}>
          <FlatList
            data={ideaCategoryList}
            renderItem={({item}) => <IdeaCategory ideaCategory={item} />}
            keyExtractor={(item) => item.ideaCategoryId}
            contentContainerStyle={{paddingBottom: 20}}
          />
        </View>
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

export default IdeaCategoryListScreen;
