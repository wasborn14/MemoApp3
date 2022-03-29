import {IdeaCategoryDetail} from '../../category/reducer/reducer';

export interface IdeaListState {
  ideaCategoryList: IdeaCategoryDetail[];
  ideaTitleList: IdeaTitleDetail[];
  selectedIdeaCategory?: IdeaCategoryDetail;
  maxSortNo: number;
}

export interface IdeaTitleDetail {
  id: string;
  name: string;
  ideaTextList: IdeaTextDetail[];
  sortNo: number;
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

export const setMaxSortNo = (payload: number) => ({
  type: 'setMaxSortNo' as const,
  payload,
});

export type Action =
  | ReturnType<typeof setIdeaTitleList>
  | ReturnType<typeof setIdeaCategoryList>
  | ReturnType<typeof setSelectedIdeaCategory>
  | ReturnType<typeof setMaxSortNo>;

export const initialState: IdeaListState = {
  ideaCategoryList: [],
  ideaTitleList: [],
  maxSortNo: -1,
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
    case 'setMaxSortNo':
      state.maxSortNo = action.payload;
      break;
  }
};
