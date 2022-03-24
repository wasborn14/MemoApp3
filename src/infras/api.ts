import firebase from 'firebase';
import {IdeaTitleDetail, IdeaTextDetail} from '../screens/idea/reducer/reducer';

// IdeaText
// IdeaTitle

// post
export const postIdeaTitle = async (inputText: string) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideas`);
    return ref.add({
      ideaTitleName: inputText,
      ideaTextList: [],
      updatedAt: new Date(),
    });
  }
};

// update
export const updateIdeaTitle = async (ideaTitle: IdeaTitleDetail, inputText: string) => {
  const {currentUser} = firebase.auth();
  if (currentUser && ideaTitle) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(ideaTitle.ideaTitleId);
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
export const deleteIdeaTitle = async (ideaTitleId: string) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(ideaTitleId);
    return ref.delete();
  }
};

// IdeaText
// post
export const updateIdeaText = async (ideaTitle: IdeaTitleDetail, newIdeaText: IdeaTextDetail) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(ideaTitle.ideaTitleId);
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
  ideaTitle: IdeaTitleDetail,
  sortIdeaTextList: IdeaTextDetail[],
) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(ideaTitle.ideaTitleId);
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
  ideaTitle: IdeaTitleDetail,
  deletedIdeaTextList: IdeaTextDetail[],
) => {
  const {currentUser} = firebase.auth();
  if (currentUser) {
    const db = firebase.firestore();
    const ref = db.collection(`users/${currentUser.uid}/ideas`).doc(ideaTitle.ideaTitleId);
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
