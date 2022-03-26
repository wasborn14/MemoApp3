import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList, Text} from 'react-native';
import {IdeaTitleInput} from '../../../components/idea/title/IdeaTitleInput';
import firebase from 'firebase';
import {useIdeaListDispatch, useIdeaListState} from './index';
import {IdeaTitleDetail, setIdeaTitleList} from './reducer/reducer';
import Loading from '../../../components/Loading';
import {useNavigation} from '@react-navigation/native';
import {IdeaTabNavigation} from '../../../navigation';
import {Feather} from '@expo/vector-icons';
import {IdeaTitle} from '../../../components/idea/title/IdeaTitle';
import Swiper from 'react-native-swiper';
import {IdeaCategoryDetail, setIdeaCategoryList} from '../category/reducer/reducer';
import {Entypo} from '@expo/vector-icons';

const IdeaListScreen = () => {
  const nav = useNavigation<IdeaTabNavigation>();
  const [isLoading, setLoading] = useState(false);
  const dispatch = useIdeaListDispatch();
  const ideaCategoryList = useIdeaListState((state) => state.ideaCategoryList);
  const ideaTitleList = useIdeaListState((state) => state.ideaTitleList);
  const [isCreateIdeaTitle, setIsCreateIdeaTitle] = useState(false);

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
              ideaCategoryId: data.ideaCategoryId,
              ideaCategoryName: data.ideaCategoryName,
              ideaTitleId: doc.id,
              ideaTitleName: data.ideaTitleName,
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

  const separetedIdeaTitleList = (ideaCategory: IdeaCategoryDetail) => {
    return ideaTitleList.filter(function (ideaTitle) {
      return ideaTitle.ideaCategoryId === ideaCategory.ideaCategoryId;
    });
  };

  return (
    <View style={styles.container}>
      <Loading isLoading={isLoading} />
      <Swiper
        showsButtons={false}
        loop={false}
        loadMinimal={true} // これで
        dotColor="rgba(255,255,255,0)"
        activeDotColor="rgba(255,255,255,0)"
      >
        {ideaCategoryList.map((ideaCategory, index) => (
          <View key={index.toString()}>
            <TouchableOpacity
              style={styles.ideaTitleButton}
              onPress={() => {
                setIsCreateIdeaTitle((prev) => !prev);
              }}
            >
              <Text style={styles.ideaTitle}>{ideaCategory.ideaCategoryName}</Text>
              <View style={styles.iconWrap}>
                {isCreateIdeaTitle ? (
                  <Feather name="x" color="white" size={24} />
                ) : (
                  <Feather name="plus" color="white" size={24} />
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.ideaTitleListWrap}>
              {isCreateIdeaTitle && (
                <IdeaTitleInput
                  ideaCategory={ideaCategory}
                  handlePressDisabled={() => setIsCreateIdeaTitle(false)}
                />
              )}
              <FlatList
                data={separetedIdeaTitleList(ideaCategory)}
                renderItem={({item}) => <IdeaTitle ideaCategory={ideaCategory} ideaTitle={item} />}
                keyExtractor={(item) => item.ideaTitleId}
                contentContainerStyle={{paddingBottom: 20}}
                ListFooterComponent={<View style={{height: 100}}></View>}
              />
            </View>
          </View>
        ))}
      </Swiper>
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
