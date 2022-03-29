import {IdeaCategoryDetail} from '../../category/reducer/reducer';

export interface IdeaListState {
  ideaCategoryList: IdeaCategoryDetail[];
  ideaTitleList: IdeaTitleDetail[];
  selectedIdeaCategory?: IdeaCategoryDetail;
}

export interface IdeaTitleDetail {
  id: string;
  name: string;
  ideaTextList: IdeaTextDetail[];
  updatedAt: Date;
}

export interface IdeaTextDetail {
  id: number;
  name: string;
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

export const setSelectedIdeaCategory = (payload: IdeaCategoryDetail | undefined) => ({
  type: 'setSelectedIdeaCategory' as const,
  payload,
});

export type Action =
  | ReturnType<typeof setIdeaTitleList>
  | ReturnType<typeof setIdeaCategoryList>
  | ReturnType<typeof setSelectedIdeaCategory>;

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
    case 'setSelectedIdeaCategory':
      state.selectedIdeaCategory = action.payload;
      break;
  }
};
