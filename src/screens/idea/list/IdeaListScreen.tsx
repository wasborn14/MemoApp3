import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
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
import DraggableFlatList, {RenderItemParams, ScaleDecorator} from 'react-native-draggable-flatlist';
import {editIdeaTextSortNo} from '../../../infras/api';

const IdeaListScreen = () => {
  const nav = useNavigation<IdeaTabNavigation>();
  const dispatch = useIdeaListDispatch();
  const ideaTitleList = useIdeaListState((state) => state.ideaTitleList);
  const selectedIdeaCategory = useIdeaListState((state) => state.selectedIdeaCategory);
  const [isCreateIdeaTitle, setIsCreateIdeaTitle] = useState(false);
  const [isStopFetchData, setIsStopFetchData] = useState(false);

  useEffect(() => {
    nav.setOptions({
      headerLeft: () => (
        <View style={{marginTop: 8, marginHorizontal: 16}}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>Idea</Text>
        </View>
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
      const ref = db.collection(`users/${currentUser.uid}/ideaCategories`).orderBy('sortNo', 'asc');
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
          // Alert.alert('????????????????????????????????????????????????');
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
    if (currentUser && !isStopFetchData) {
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
          // Alert.alert('????????????????????????????????????????????????');
        },
      );
    }
    return unsubscribe;
  }, [dispatch, selectedIdeaCategory, isStopFetchData]);

  const getMaxSortNo = useCallback(() => {
    if (ideaTitleList.length > 0) {
      return Math.max(...ideaTitleList.map((ideaTitle) => ideaTitle.sortNo));
    }
    return 0;
  }, [ideaTitleList]);

  useEffect(() => {
    dispatch(setMaxSortNo(getMaxSortNo()));
  }, [dispatch, getMaxSortNo]);

  const renderItem = ({item, drag}: RenderItemParams<IdeaTitleDetail>) => {
    return (
      <ScaleDecorator>
        <IdeaTitle ideaTitle={item} onLongPress={drag} />
      </ScaleDecorator>
    );
  };

  const updateSortNo = useCallback(
    (changedIdeaTitleList: IdeaTitleDetail[]) => {
      if (!selectedIdeaCategory) return;
      dispatch(setIdeaTitleList(changedIdeaTitleList));
      setIsStopFetchData(true);

      const changedSortNumbers: {id: string; sortPosition: number}[] = [];
      changedIdeaTitleList.map((changedIdeaTitle, index) => {
        const sortPosition = index + 1;
        if (changedIdeaTitle.sortNo !== sortPosition) {
          changedSortNumbers.push({
            id: changedIdeaTitle.id,
            sortPosition: sortPosition,
          });
        }
      });
      if (changedSortNumbers.length > 0) {
        changedSortNumbers.map((changedSortNumber) => {
          editIdeaTextSortNo(
            selectedIdeaCategory?.id,
            changedSortNumber.id,
            changedSortNumber.sortPosition,
          );
        });

        // ????????????????????????????????????????????????????????????????????????
        setTimeout(() => {
          setIsStopFetchData(false);
        }, 1000);
      }
    },
    [selectedIdeaCategory, dispatch],
  );

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
            <DraggableFlatList
              data={ideaTitleList}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{paddingBottom: 20}}
              ListFooterComponent={<View style={{height: 100}} />}
              onDragEnd={({data}) => updateSortNo(data)}
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
