import React, {useCallback, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {ShoppingItemDetail} from '../../../screens/shopping/reducer/reducer';
import {ShoppingItemInput} from './ShoppingItemInput';
import {deleteShoppingItem, updateShoppingItemCheck} from '../../../infras/api';
import Touchable from '../../../Touchable';

type Props = {
  shoppingItem: ShoppingItemDetail;
};

export const ShoppingItem: React.FC<Props> = ({shoppingItem}) => {
  const [editShoppingItemId, setEditShoppingItemId] = useState('noMatch');

  const handlePressDelete = useCallback((shoppingItemId: string) => {
    Alert.alert('アイテムを削除します。', 'よろしいですか？', [
      {
        text: 'キャンセル',
      },
      {
        text: '削除する',
        style: 'destructive',
        onPress: () => {
          deleteShoppingItem(shoppingItemId).catch(() => {
            Alert.alert('削除に失敗しました。');
          });
        },
      },
    ]);
  }, []);

  const updateCheck = useCallback(() => {
    updateShoppingItemCheck(shoppingItem.id, shoppingItem.check);
  }, [shoppingItem]);

  return (
    <>
      {shoppingItem.id === editShoppingItemId ? (
        <>
          <ShoppingItemInput
            shoppingItem={shoppingItem}
            onPress={() => setEditShoppingItemId('noMatch')}
          />
        </>
      ) : (
        <>
          <Touchable
            style={[
              styles.ideaCategoryListItem,
              shoppingItem.check && styles.selectedShoppingItemColor,
            ]}
            onPress={updateCheck}
            onLongPress={() => {
              setEditShoppingItemId(shoppingItem.id);
            }}
          >
            <View style={styles.ideaCategoryInner}>
              <Text style={styles.ideaCategoryListItemTitle} numberOfLines={1}>
                {shoppingItem.name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                handlePressDelete(shoppingItem.id);
              }}
            >
              <Feather name="x" color="#DADADA" size={20} />
            </TouchableOpacity>
          </Touchable>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b4513',
    marginTop: 8,
  },
  ideaCategoryListItem: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 19,
    marginVertical: 2,
    marginHorizontal: 16,
    alignItems: 'center',
    borderRadius: 20,
    // 影の設定
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 10,
  },
  selectedIdeaCategoryColor: {
    backgroundColor: '#D7FFDB',
  },
  runningColor: {
    backgroundColor: '#adffff',
  },
  ideaCategoryInner: {
    flex: 1,
  },
  ideaCategoryListItemTitle: {
    fontSize: 16,
    lineHeight: 26,
  },
  ideaCategoryListItemDate: {
    fontSize: 12,
    lineHeight: 16,
    color: '#848484',
  },
  ideaCategoryEdit: {
    paddingRight: 12,
  },
  ideaCreatContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 20,
  },
  ideaCreateButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 19,
    marginVertical: 4,
    marginHorizontal: 16,
    alignItems: 'center',
    borderRadius: 20,
    width: 80,
    // 影の設定
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 10,
  },
  ideaCreateIcon: {
    flex: 1,
    alignItems: 'center',
  },
  selectedShoppingItemColor: {
    backgroundColor: '#D7FFDB',
  },
});
