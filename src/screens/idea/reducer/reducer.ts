export interface IdeaListState {
  ideaCategoryList: IdeaCategoryDetail[];
}

export interface IdeaCategoryDetail {
  categoryId: string;
  categoryName: string;
  ideaList: IdeaDetail[];
  updatedAt: Date;
}

export interface IdeaDetail {
  ideaText: string;
  updatedAt: Date;
}

export const setIdeaCategoryList = (payload: IdeaCategoryDetail[] | undefined) => ({
  type: 'setIdeaCategoryList' as const,
  payload,
});

export type Action = ReturnType<typeof setIdeaCategoryList>;

export const initialState: IdeaListState = {
  ideaCategoryList: [],
};

export const ideaListReducer = (state: IdeaListState, action: Action) => {
  switch (action.type) {
    case 'setIdeaCategoryList':
      if (action.payload) {
        state.ideaCategoryList = action.payload;
      }
      break;
  }
};
