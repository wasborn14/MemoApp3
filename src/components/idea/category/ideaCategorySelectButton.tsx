import React from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList, Text} from 'react-native';
import {useIdeaListDispatch, useIdeaListState} from '../../../screens/idea/list';
import {setSelectedIdeaCategory} from '../../../screens/idea/list/reducer/reducer';

const IdeaCategorySelectButton = () => {
  const dispatch = useIdeaListDispatch();
  const ideaCategoryList = useIdeaListState((state) => state.ideaCategoryList);
  const selectedIdeaCategory = useIdeaListState((state) => state.selectedIdeaCategory);

  return (
    <View style={styles.container}>
      <FlatList
        data={ideaCategoryList}
        renderItem={({item}) => (
          <View style={styles.selectButtonWrap}>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => dispatch(setSelectedIdeaCategory(item))}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  item.id === selectedIdeaCategory?.id && styles.selectedButtonColor,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 30,
    backgroundColor: '#FFDDAA',
  },
  selectButtonWrap: {
    justifyContent: 'center',
  },
  selectButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
  selectedButtonColor: {
    color: '#E58009',
    fontSize: 20,
  },
});

export default IdeaCategorySelectButton;
