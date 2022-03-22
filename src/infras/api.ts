import firebase from 'firebase';
import {IdeaCategoryDetail, IdeaDetail} from '../screens/idea/reducer/reducer';

// Idea
// IdeaCategory

// post
export const postIdeaCategory = async (inputText: string) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideas`);
    return ref.add({
      categoryName: inputText,
      ideaList: [],
      updatedAt: new Date(),
    });
  }
};

// update
export const updateIdeaCategory = async (ideaCategory: IdeaCategoryDetail, inputText: string) => {
  const {currentUser} = firebase.auth();
  if (currentUser && ideaCategory) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(ideaCategory.categoryId);
    return ref.set(
      {
        categoryName: inputText,
        ideaList: ideaCategory.ideaList,
        updatedAt: new Date(),
      },
      {merge: true},
    );
  }
};

// delete
export const deleteIdeaCategory = async (categoryId: string) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(categoryId);
    return ref.delete();
  }
};

// Idea
// post
export const updateIdea = async (ideaCategory: IdeaCategoryDetail, newIdea: IdeaDetail) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(ideaCategory.categoryId);
    return ref.set(
      {
        categoryName: ideaCategory.categoryName,
        ideaList: [...ideaCategory.ideaList, newIdea],
        updatedAt: new Date(),
      },
      {merge: true},
    );
  }
};

// update
export const editIdea = async (ideaCategory: IdeaCategoryDetail, sortIdeaList: IdeaDetail[]) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(ideaCategory.categoryId);
    return ref.set(
      {
        categoryName: ideaCategory.categoryName,
        ideaList: sortIdeaList,
        updatedAt: new Date(),
      },
      {merge: true},
    );
  }
};

// delete
export const deleteIdea = async (
  ideaCategory: IdeaCategoryDetail,
  deletedIdeaList: IdeaDetail[],
) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(ideaCategory.categoryId);
    return ref.set(
      {
        categoryName: ideaCategory.categoryName,
        ideaList: deletedIdeaList,
        updatedAt: new Date(),
      },
      {merge: true},
    );
  }
};
