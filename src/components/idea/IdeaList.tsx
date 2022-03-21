import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {IdeaCategoryDetail, IdeaDetail} from '../../screens/idea/reducer/reducer';
import {Idea} from './Idea';

type Props = {
  ideaCategory: IdeaCategoryDetail;
  ideaList: IdeaDetail[];
};

export const IdeaList: React.FC<Props> = ({ideaCategory, ideaList}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={ideaList}
        renderItem={({item}) => <Idea idea={item} ideaCategory={ideaCategory} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b4513',
  },
});
