import {IdeaCategoryDetail} from '../../category/reducer/reducer';

export interface IdeaListState {
  ideaCategoryList: IdeaCategoryDetail[];
  ideaTitleList: IdeaTitleDetail[];
}

export interface IdeaTitleDetail {
  ideaCategoryId: string;
  ideaCategoryName: string;
  ideaTitleId: string;
  ideaTitleName: string;
  ideaTextList: IdeaTextDetail[];
  updatedAt: Date;
}

export interface IdeaTextDetail {
  ideaTextId: number;
  ideaText: string;
  point: number;
  updatedAt: Date;
}

export const setIdeaTitleList = (payload: IdeaTitleDetail[] | undefined) => ({
  type: 'setIdeaTitleList' as const,
  payload,
});

export const setIdeaCategoryList = (payload: IdeaCategoryDetail[] | undefined) => ({
  type: 'setIdeaCategoryList' as const,
  payload,
});

export type Action = ReturnType<typeof setIdeaTitleList> | ReturnType<typeof setIdeaCategoryList>;

export const initialState: IdeaListState = {
  ideaCategoryList: [],
  ideaTitleList: [],
};

export const ideaListReducer = (state: IdeaListState, action: Action) => {
  switch (action.type) {
    case 'setIdeaCategoryList':
      if (action.payload) {
        state.ideaCategoryList = action.payload;
      }
      break;
    case 'setIdeaTitleList':
      if (action.payload) {
        state.ideaTitleList = action.payload;
      }
      break;
  }
};
