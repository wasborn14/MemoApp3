import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, ScrollView} from 'react-native';
import firebase from 'firebase';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@expo/vector-icons';
import {setShoppingItemList, ShoppingItemDetail} from './reducer/reducer';
import {useShoppingTopState, useShppingTopDispatch} from './index';
import {ShoppingNavigation} from '../../navigation';
import {ShoppingItemInput} from '../../components/shopping/top/ShoppingItemInput';
import {ShoppingItem} from '../../components/shopping/top/ShoppingItem';
import CircleButton from '../../components/CircleButton';

const ShoppingTopScreen = () => {
  const nav = useNavigation<ShoppingNavigation>();
  const dispatch = useShppingTopDispatch();
  const shoppingItemList = useShoppingTopState((state) => state.shoppingItemList);
  const [isCreateIdeaCategory, setIsCreateIdeaCategory] = useState(false);

  useEffect(() => {
    nav.setOptions({
      headerLeft: () => (
        <View style={{marginTop: 8, marginHorizontal: 16}}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>SoppingList</Text>
        </View>
      ),
      headerTitle: '',
    });
  }, [nav]);

  useEffect(() => {
    const db = firebase.firestore();
    const {currentUser} = firebase.auth();
    let unsubscribe = () => {
      // do nothing
    };
    if (currentUser) {
      const ref = db.collection(`users/${currentUser.uid}/shoppingItems`).orderBy('check', 'desc');
      // .orderBy('updatedAt', 'asc');
      unsubscribe = ref.onSnapshot(
        (snapshot) => {
          const shoppingItemListData: ShoppingItemDetail[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            shoppingItemListData.push({
              id: doc.id,
              name: data.name,
              check: data.check,
              updatedAt: data.updatedAt.toDate(),
            });
          });
          dispatch(setShoppingItemList(shoppingItemListData));
        },
        () => {
          // Alert.alert('データの読み込みに失敗しました。');
        },
      );
    }
    return unsubscribe;
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.ideaTitleCreateButton}
        onPress={() => {
          setIsCreateIdeaCategory((prev) => !prev);
        }}
      >
        <Text style={styles.ideaTitle}>Create Item</Text>
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
          <ShoppingItemInput handlePressDisabled={() => setIsCreateIdeaCategory(false)} />
        )}
        <ScrollView style={styles.ideaTitleListWrap}>
          {shoppingItemList.map((shoppingItem, index) => (
            <View key={`shopping_item_${index}`}>
              <ShoppingItem shoppingItem={shoppingItem} />
            </View>
          ))}
        </ScrollView>
      </View>
      {!isCreateIdeaCategory && (
        <CircleButton
          name="plus"
          onPress={() => {
            setIsCreateIdeaCategory((prev) => !prev);
          }}
        />
      )}
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

export default ShoppingTopScreen;
