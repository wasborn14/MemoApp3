import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import firebase from 'firebase';
import {useIdeaCategoryListDispatch, useIdeaCategoryListState} from './index';
import {IdeaCategoryDetail, setIdeaCategoryList, setMaxSortNo} from './reducer/reducer';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@expo/vector-icons';
import {IdeaTabNavigation} from '../../../navigation';
import {IdeaCategory} from '../../../components/idea/category/IdeaCategory';
import {IdeaCategoryInput} from '../../../components/idea/category/IdeaCategoryInput';
import {Ionicons} from '@expo/vector-icons';
import DraggableFlatList, {RenderItemParams, ScaleDecorator} from 'react-native-draggable-flatlist';
import {editIdeaCategorySortNo} from '../../../infras/api';

const IdeaCategoryListScreen = () => {
  const nav = useNavigation<IdeaTabNavigation>();
  const dispatch = useIdeaCategoryListDispatch();
  const ideaCategoryList = useIdeaCategoryListState((state) => state.ideaCategoryList);
  const [isCreateIdeaCategory, setIsCreateIdeaCategory] = useState(false);
  const [isStopFetchData, setIsStopFetchData] = useState(false);

  const getMaxSortNo = useCallback(() => {
    if (ideaCategoryList.length > 0) {
      return Math.max(...ideaCategoryList.map((ideaCategory) => ideaCategory.sortNo));
    }
    return 0;
  }, [ideaCategoryList]);

  useEffect(() => {
    dispatch(setMaxSortNo(getMaxSortNo()));
  }, [dispatch, getMaxSortNo]);

  useEffect(() => {
    nav.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => nav.goBack()} style={{marginLeft: 16, marginTop: 10}}>
          <Ionicons name="chevron-back-circle-outline" size={28} color="black" />
        </TouchableOpacity>
      ),
      headerTitle: '',
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
    if (currentUser && !isStopFetchData) {
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
        },
        () => {
          // Alert.alert('データの読み込みに失敗しました。');
        },
      );
    }
    return unsubscribe;
  }, [dispatch, isStopFetchData]);

  const updateSortNo = useCallback(
    (changedIdeaCategoryList: IdeaCategoryDetail[]) => {
      dispatch(setIdeaCategoryList(changedIdeaCategoryList));
      setIsStopFetchData(true);

      const changedSortNumbers: {id: string; sortPosition: number}[] = [];
      changedIdeaCategoryList.map((changedIdeaCategory, index) => {
        const sortPosition = index + 1;
        if (changedIdeaCategory.sortNo !== sortPosition) {
          changedSortNumbers.push({
            id: changedIdeaCategory.id,
            sortPosition: sortPosition,
          });
        }
      });
      if (changedSortNumbers.length > 0) {
        changedSortNumbers.map((changedSortNumber) => {
          editIdeaCategorySortNo(changedSortNumber.id, changedSortNumber.sortPosition);
        });

        // 表示の乱れの抑制のため、データの再取得に間をおく
        setTimeout(() => {
          setIsStopFetchData(false);
        }, 1000);
      }
    },
    [dispatch],
  );

  const renderItem = ({item, drag}: RenderItemParams<IdeaCategoryDetail>) => {
    return (
      <ScaleDecorator>
        <IdeaCategory ideaCategory={item} onLongPress={drag} />
      </ScaleDecorator>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.ideaTitleCreateButton}
        onPress={() => {
          setIsCreateIdeaCategory((prev) => !prev);
        }}
      >
        <Text style={styles.ideaTitle}>Create Category</Text>
        <View style={styles.iconWrap}>
          {isCreateIdeaCategory ? (
            <Feather name="x" color="white" size={24} />
          ) : (
            <Feather name="plus" color="white" size={24} />
          )}
        </View>
      </TouchableOpacity>
      <View>
        {isCreateIdeaCategory && (
          <IdeaCategoryInput handlePressDisabled={() => setIsCreateIdeaCategory(false)} />
        )}
        <View style={styles.ideaTitleListWrap}>
          <DraggableFlatList
            data={ideaCategoryList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{paddingBottom: 20}}
            ListFooterComponent={<View style={{height: 100}} />}
            onDragEnd={({data}) => updateSortNo(data)}
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
  ideaTitleCreateButton: {
    marginTop: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ideaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  iconWrap: {
    marginTop: 4,
    marginLeft: 8,
  },
  ideaTitleListWrap: {
    marginTop: 8,
  },
});

export default IdeaCategoryListScreen;
