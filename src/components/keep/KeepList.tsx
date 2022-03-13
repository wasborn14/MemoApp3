import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {UserKeep} from '../../screens/keep/list/KeepListScreen';
import {Keep} from './Keep';

type Props = {
  keeps: UserKeep[];
};

export const KeepList: React.FC<Props> = ({keeps}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={keeps}
        renderItem={({item}) => <Keep keep={item} />}
        keyExtractor={(item) => item.id}
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
