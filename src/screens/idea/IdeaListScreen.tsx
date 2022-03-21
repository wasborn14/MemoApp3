import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {IdeaCategoryInput} from '../../components/idea/IdeaCategoryInput';
import firebase from 'firebase';
import {useIdeaListDispatch, useIdeaListState} from './index';
import {IdeaCategoryDetail, setIdeaCategoryList} from './reducer/reducer';
import {IdeaCategoryList} from '../../components/idea/IdeaCategoryList';
import Loading from '../../components/Loading';

const IdeaListScreen = () => {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useIdeaListDispatch();
  const ideaCategoryList = useIdeaListState((state) => state.ideaCategoryList);

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
      <IdeaCategoryInput />
      <IdeaCategoryList ideaCategoryList={ideaCategoryList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b4513',
  },
});

export default IdeaListScreen;
