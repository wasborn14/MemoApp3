import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {IdeaCategoryDetail} from '../../screens/idea/reducer/reducer';
import {IdeaCategory} from './IdeaCategory';

type Props = {
  ideaCategoryList: IdeaCategoryDetail[];
};

export const IdeaCategoryList: React.FC<Props> = ({ideaCategoryList}) => {
  console.log(ideaCategoryList);

  return (
    <View style={styles.container}>
      <FlatList
        data={ideaCategoryList}
        renderItem={({item}) => <IdeaCategory ideaCategory={item} />}
        keyExtractor={(item) => item.categoryId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b4513',
    marginTop: 8,
  },
});
