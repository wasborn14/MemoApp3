import firebase from 'firebase';
import {IdeaTitleDetail, IdeaTextDetail} from '../screens/idea/list/reducer/reducer';
import {IdeaCategoryDetail} from '../screens/idea/category/reducer/reducer';

// IdeaCategory
// post
export const postIdeaCategory = async (inputText: string, maxSortNo: number) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideaCategories`);
    return ref.add({
      name: inputText,
      sortNo: maxSortNo + 1,
      updatedAt: new Date(),
    });
  }
};

// update
export const updateIdeaCategory = async (ideaCategory: IdeaCategoryDetail, inputText: string) => {
  const {currentUser} = firebase.auth();
  if (currentUser && ideaCategory) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideaCategories`).doc(ideaCategory.id);
    return ref.set(
      {
        id: ideaCategory.id,
        name: inputText,
        sortNo: ideaCategory.sortNo,
        updatedAt: new Date(),
      },
      {merge: true},
    );
  }
};

// delete
export const deleteIdeaCategory = async (ideaCategoryId: string) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideaCategories`).doc(ideaCategoryId);
    return ref.delete();
  }
};

// IdeaTitle
// post
export const postIdeaTitle = async (selectedIdeaCategoryId: string, inputText: string) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db.collection(
      `users/${currentUser.uid}/ideaCategories/${selectedIdeaCategoryId}/ideaTitles`,
    );
    return ref.add({
      name: inputText,
      ideaTextList: [],
      updatedAt: new Date(),
    });
  }
};

// update
export const updateIdeaTitle = async (
  selectedIdeaCategoryId: string,
  ideaTitle: IdeaTitleDetail,
  inputText: string,
) => {
  const {currentUser} = firebase.auth();
  if (currentUser && ideaTitle) {
    const db = firebase.firestore();
    const ref = db
      .collection(`users/${currentUser.uid}/ideaCategories/${selectedIdeaCategoryId}/ideaTitles`)
      .doc(ideaTitle.id);
    return ref.set(
      {
        name: inputText,
        ideaTextList: ideaTitle.ideaTextList,
        updatedAt: new Date(),
      },
      {merge: true},
    );
  }
};

// delete
export const deleteIdeaTitle = async (selectedIdeaCategoryId: string, ideaTitleId: string) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db
      .collection(`users/${currentUser.uid}/ideaCategories/${selectedIdeaCategoryId}/ideaTitles`)
      .doc(ideaTitleId);
    return ref.delete();
  }
};

// IdeaText
// post
export const updateIdeaText = async (
  selectedIdeaCategoryId: string,
  ideaTitle: IdeaTitleDetail,
  newIdeaText: IdeaTextDetail,
) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db
      .collection(`users/${currentUser.uid}/ideaCategories/${selectedIdeaCategoryId}/ideaTitles`)
      .doc(ideaTitle.id);
    return ref.set(
      {
        ideaTitleName: ideaTitle.name,
        ideaTextList: [...ideaTitle.ideaTextList, newIdeaText],
        updatedAt: new Date(),
      },
      {merge: true},
    );
  }
};

// update
export const editIdeaText = async (
  selectedIdeaCategoryId: string,
  ideaTitle: IdeaTitleDetail,
  sortIdeaTextList: IdeaTextDetail[],
) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db
      .collection(`users/${currentUser.uid}/ideaCategories/${selectedIdeaCategoryId}/ideaTitles`)
      .doc(ideaTitle.id);
    return ref.set(
      {
        ideaTitleName: ideaTitle.name,
        ideaTextList: sortIdeaTextList,
        updatedAt: new Date(),
      },
      {merge: true},
    );
  }
};

// delete
export const deleteIdeaText = async (
  selectedIdeaCategoryId: string,
  ideaTitle: IdeaTitleDetail,
  deletedIdeaTextList: IdeaTextDetail[],
) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db
      .collection(`users/${currentUser.uid}/ideaCategories/${selectedIdeaCategoryId}/ideaTitles`)
      .doc(ideaTitle.id);
    return ref.set(
      {
        ideaTitleName: ideaTitle.name,
        ideaTextList: deletedIdeaTextList,
        updatedAt: new Date(),
      },
      {merge: true},
    );
  }
};
