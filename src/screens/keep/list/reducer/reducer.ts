export interface KeepListState {
  keep_list: Keep[];
}

export type Keep = {
  id: string;
  bodyText?: string;
  updatedAt?: Date;
};

export const setKeepList = (payload: Keep[] | undefined) => ({
  type: 'setKeepList' as const,
  payload,
});

export type Action = ReturnType<typeof setKeepList>;

export const initialState: KeepListState = {
  keep_list: [],
};

export const keepListReducer = (state: KeepListState, action: Action) => {
  switch (action.type) {
    case 'setKeepList':
      if (action.payload) {
        state.keep_list = action.payload;
      }
      break;
  }
};
