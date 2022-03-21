import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {IdeaDetail} from '../../screens/idea/reducer/reducer';
import {Idea} from './Idea';

type Props = {
  ideaList: IdeaDetail[];
};

export const IdeaList: React.FC<Props> = ({ideaList}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={ideaList}
        renderItem={({item}) => <Idea idea={item} />}
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
