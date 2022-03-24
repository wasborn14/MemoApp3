export interface IdeaListState {
  ideaTitleList: IdeaTitleDetail[];
}

export interface IdeaTitleDetail {
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

export type Action = ReturnType<typeof setIdeaTitleList>;

export const initialState: IdeaListState = {
  ideaTitleList: [],
};

export const ideaListReducer = (state: IdeaListState, action: Action) => {
  switch (action.type) {
    case 'setIdeaTitleList':
      if (action.payload) {
        state.ideaTitleList = action.payload;
      }
      break;
  }
};
