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
      ideaCategoryName: inputText,
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
    const ref = db
      .collection(`users/${currentUser.uid}/ideaCategories`)
      .doc(ideaCategory.ideaCategoryId);
    return ref.set(
      {
        ideaCategoryId: ideaCategory.ideaCategoryId,
        ideaCategoryName: inputText,
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
      ideaTitleName: inputText,
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
      .doc(ideaTitle.ideaTitleId);
    return ref.set(
      {
        ideaTitleName: inputText,
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
    // const ref = db.collection(`users/${currentUser.uid}/ideaCategories`).doc(ideaTitle.ideaTitleId);
    const ref = db
      .collection(`users/${currentUser.uid}/ideaCategories/${selectedIdeaCategoryId}/ideaTitles`)
      .doc(ideaTitle.ideaTitleId);
    return ref.set(
      {
        ideaTitleName: ideaTitle.ideaTitleName,
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
    // const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(ideaTitle.ideaTitleId);
    const ref = db
      .collection(`users/${currentUser.uid}/ideaCategories/${selectedIdeaCategoryId}/ideaTitles`)
      .doc(ideaTitle.ideaTitleId);
    return ref.set(
      {
        ideaTitleName: ideaTitle.ideaTitleName,
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
      .doc(ideaTitle.ideaTitleId);
    return ref.set(
      {
        ideaTitleName: ideaTitle.ideaTitleName,
        ideaTextList: deletedIdeaTextList,
        updatedAt: new Date(),
      },
      {merge: true},
    );
  }
};
