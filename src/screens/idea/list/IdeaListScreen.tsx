import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList, Text} from 'react-native';
import {IdeaTitleInput} from '../../../components/idea/title/IdeaTitleInput';
import firebase from 'firebase';
import {useIdeaListDispatch, useIdeaListState} from './index';
import {
  IdeaTitleDetail,
  setIdeaCategoryList,
  setIdeaTitleList,
  setSelectedIdeaCategory,
  setMaxSortNo,
} from './reducer/reducer';
import {useNavigation} from '@react-navigation/native';
import {IdeaTabNavigation} from '../../../navigation';
import {Feather} from '@expo/vector-icons';
import {IdeaTitle} from '../../../components/idea/title/IdeaTitle';
import {IdeaCategoryDetail} from '../category/reducer/reducer';
import {Entypo} from '@expo/vector-icons';
import IdeaCategorySelectButton from '../../../components/idea/category/ideaCategorySelectButton';

const IdeaListScreen = () => {
  const nav = useNavigation<IdeaTabNavigation>();
  const dispatch = useIdeaListDispatch();
  const ideaTitleList = useIdeaListState((state) => state.ideaTitleList);
  const selectedIdeaCategory = useIdeaListState((state) => state.selectedIdeaCategory);
  const [isCreateIdeaTitle, setIsCreateIdeaTitle] = useState(false);
  const maxSortNo = useIdeaListState((state) => state.maxSortNo);

  useEffect(() => {
    nav.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{marginTop: 8, marginHorizontal: 16}}
          onPress={() => {
            nav.navigate('IdeaCategory');
          }}
        >
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>Idea</Text>
        </TouchableOpacity>
      ),
      headerTitle: '',
      headerRight: () => (
        <TouchableOpacity
          style={{marginTop: 8, marginHorizontal: 16}}
          onPress={() => {
            nav.navigate('IdeaCategory');
          }}
        >
          <Entypo name="add-to-list" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [nav, isCreateIdeaTitle]);

  useEffect(() => {
    const db = firebase.firestore();
    const {currentUser} = firebase.auth();
    let unsubscribe = () => {
      // do nothing
    };
    if (currentUser) {
      const ref = db
        .collection(`users/${currentUser.uid}/ideaCategories`)
        .orderBy('updatedAt', 'asc');
      unsubscribe = ref.onSnapshot(
        (snapshot) => {
          const ideaCategoryListData: IdeaCategoryDetail[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            ideaCategoryListData.push({
              id: doc.id,
              name: data.name,
              sortNo: data.sortNo,
              updatedAt: data.updatedAt.toDate(),
            });
          });
          dispatch(setIdeaCategoryList(ideaCategoryListData));
          dispatch(setSelectedIdeaCategory(ideaCategoryListData[0]));
          // setSelectedIdeaCategory(ideaCategoryListData[0]);
        },
        () => {
          // Alert.alert('データの読み込みに失敗しました。');
        },
      );
    }
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    if (!selectedIdeaCategory) {
      return;
    }
    const db = firebase.firestore();
    const {currentUser} = firebase.auth();
    let unsubscribe = () => {
      // do nothing
    };
    if (currentUser) {
      const ref = db
        .collection(`users/${currentUser.uid}/ideaCategories`)
        .doc(selectedIdeaCategory.id)
        .collection('ideaTitles')
        .orderBy('sortNo', 'asc');
      unsubscribe = ref.onSnapshot(
        (snapshot) => {
          const ideaTitleListData: IdeaTitleDetail[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            ideaTitleListData.push({
              id: doc.id,
              name: data.name,
              ideaTextList: data.ideaTextList,
              sortNo: data.sortNo,
              updatedAt: data.updatedAt.toDate(),
            });
          });
          dispatch(setIdeaTitleList(ideaTitleListData));
        },
        () => {
          // Alert.alert('データの読み込みに失敗しました。');
        },
      );
    }
    return unsubscribe;
  }, [dispatch, selectedIdeaCategory]);

  const getMaxSortNo = useCallback(() => {
    if (ideaTitleList.length > 0) {
      return Math.max(...ideaTitleList.map((ideaTitle) => ideaTitle.sortNo));
    }
    return 0;
  }, [ideaTitleList]);

  useEffect(() => console.log(maxSortNo), [maxSortNo]);

  useEffect(() => {
    dispatch(setMaxSortNo(getMaxSortNo()));
  }, [dispatch, getMaxSortNo]);

  return (
    <View style={styles.container}>
      <IdeaCategorySelectButton />
      <TouchableOpacity
        style={styles.ideaTitleButton}
        onPress={() => {
          setIsCreateIdeaTitle((prev) => !prev);
        }}
      >
        <Text style={styles.ideaTitle}>{selectedIdeaCategory?.name}</Text>
        <View style={styles.iconWrap}>
          {isCreateIdeaTitle ? (
            <Feather name="x" color="white" size={24} />
          ) : (
            <Feather name="plus" color="white" size={24} />
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.ideaTitleListWrap}>
        {selectedIdeaCategory && (
          <>
            {isCreateIdeaTitle && (
              <IdeaTitleInput handlePressDisabled={() => setIsCreateIdeaTitle(false)} />
            )}
            <FlatList
              data={ideaTitleList}
              renderItem={({item}) => <IdeaTitle ideaTitle={item} />}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{paddingBottom: 20}}
              ListFooterComponent={<View style={{height: 100}} />}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b4513',
  },
  ideaTitleButton: {
    marginTop: 8,
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ideaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  iconWrap: {
    marginLeft: 8,
  },
  ideaTitleListWrap: {
    marginTop: 8,
  },
});

export default IdeaListScreen;
