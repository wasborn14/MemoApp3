import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, TextInput} from 'react-native';
import {Feather} from '@expo/vector-icons';
import firebase from 'firebase';
import {translateErrors} from '../../utils';
import {IdeaCategoryDetail, IdeaDetail} from '../../screens/idea/reducer/reducer';

type Props = {
  editIdeaId?: number;
  ideaCategory: IdeaCategoryDetail;
  id?: string;
  text?: string;
  onPress?: () => void;
  handlePressSave?: () => void;
};

export const IdeaInput: React.FC<Props> = ({
  editIdeaId,
  ideaCategory,
  text,
  onPress,
  handlePressSave,
}) => {
  const [inputText, setInputText] = useState('');

  const getMaxId = useCallback(() => {
    if (ideaCategory.ideaList.length > 0) {
      return Math.max(...ideaCategory.ideaList.map((idea) => idea.id));
    }
    return 0;
  }, [ideaCategory]);

  const createPress = useCallback(() => {
    if (!inputText) {
      return;
    }
    const {currentUser} = firebase.auth();
    if (currentUser) {
      const idea: IdeaDetail = {
        id: getMaxId() + 1,
        ideaText: inputText,
        point: 1,
        updatedAt: new Date(),
      };

      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(ideaCategory.categoryId);
      ref
        .set(
          {
            categoryName: ideaCategory.categoryName,
            ideaList: [...ideaCategory.ideaList, idea],
            updatedAt: new Date(),
          },
          {merge: true},
        )
        .then(() => {
          handlePressSave && handlePressSave();
        })
        .catch((error) => {
          const errorMsg = translateErrors(error.code);
          Alert.alert(errorMsg.title, errorMsg.description);
        });
    }
  }, [inputText, ideaCategory, getMaxId, handlePressSave]);

  const getSortIdeaList = useCallback(() => {
    const targetIdea = ideaCategory.ideaList.filter(function (idea) {
      return idea.id === editIdeaId;
    });
    const ideaList: IdeaDetail[] = ideaCategory.ideaList.filter(function (idea) {
      return idea.id !== editIdeaId;
    });
    const convertedIdea: IdeaDetail = {
      ...targetIdea[0],
      ideaText: inputText,
      updatedAt: new Date(),
    };
    ideaList.push(convertedIdea);
    return ideaList.sort((a, b) => {
      return a.id - b.id;
    });
  }, [editIdeaId, ideaCategory, inputText]);

  const editPress = useCallback(() => {
    if (!inputText) {
      return;
    }
    const {currentUser} = firebase.auth();
    if (currentUser) {
      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(ideaCategory.categoryId);

      const sortIdeaList = getSortIdeaList();
      ref
        .set(
          {
            categoryName: ideaCategory.categoryName,
            ideaList: sortIdeaList,
            updatedAt: new Date(),
          },
          {merge: true},
        )
        .then(() => {
          onPress && onPress();
        })
        .catch((error) => {
          const errorMsg = translateErrors(error.code);
          Alert.alert(errorMsg.title, errorMsg.description);
        });
    }
  }, [getSortIdeaList, onPress, ideaCategory, inputText]);

  useEffect(() => {
    text && setInputText(text);
  }, [text]);

  return (
    <View style={styles.container}>
      <TextInput
        value={inputText}
        style={styles.inputText}
        onChangeText={(text) => setInputText(text)}
      />
      <TouchableOpacity onPress={onPress ? editPress : createPress}>
        {onPress ? (
          <Feather name="check" size={24} color="black" />
        ) : (
          <Feather name="plus" size={24} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 8,
    paddingHorizontal: 19,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 10,
    flexDirection: 'row',
  },
  inputText: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
  },
});
