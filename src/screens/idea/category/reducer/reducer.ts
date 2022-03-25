// export interface IdeaListState {
//     ideaTitleList: IdeaTitleDetail[];
// }
//
// export interface IdeaTitleDetail {
//     ideaTitleId: string;
//     ideaTitleName: string;
//     ideaTextList: IdeaTextDetail[];
//     updatedAt: Date;
// }
//
// export interface IdeaTextDetail {
//     ideaTextId: number;
//     ideaText: string;
//     point: number;
//     updatedAt: Date;
// }

export interface IdeaCategoryListState {
  ideaCategoryList: IdeaCategoryDetail[];
  maxSortNo: number;
}

export interface IdeaCategoryDetail {
  ideaCategoryId: string;
  ideaCategoryName: string;
  sortNo: number;
  updatedAt: Date;
}

export const setIdeaCategoryList = (payload: IdeaCategoryDetail[] | undefined) => ({
  type: 'setIdeaCategoryList' as const,
  payload,
});

export const setMaxSortNo = (payload: number) => ({
  type: 'setMaxSortNo' as const,
  payload,
});

export type Action = ReturnType<typeof setIdeaCategoryList> | ReturnType<typeof setMaxSortNo>;

export const initialState: IdeaCategoryListState = {
  ideaCategoryList: [],
  maxSortNo: -1,
};

export const ideaCategoryListReducer = (state: IdeaCategoryListState, action: Action) => {
  switch (action.type) {
    case 'setIdeaCategoryList':
      if (action.payload) {
        state.ideaCategoryList = action.payload;
      }
      break;
    case 'setMaxSortNo':
      state.maxSortNo = action.payload;
      break;
  }
};
