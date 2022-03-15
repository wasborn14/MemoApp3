export interface KeepListState {
  keep_list: Keep[];
  time?: Time;
}

export interface KeepTime {
  keep_id: string;
  keep_bodyText: string;
  totalSeconds: number;
}

export type Time = {
  id: string;
  keeps?: KeepTime[];
  keep_id: string;
  keep_bodyText: string;
  hours: number;
  minutes: number;
  seconds: number;
  year: number;
  month: number;
  day: number;
  updatedAt: Date;
};

export type Keep = {
  id: string;
  bodyText?: string;
  updatedAt?: Date;
  timeUpdatedAt?: Date;
  todayTotalSeconds?: number;
};

export const setKeepList = (payload: Keep[] | undefined) => ({
  type: 'setKeepList' as const,
  payload,
});

export const setTime = (payload: Time | undefined) => ({
  type: 'setTime' as const,
  payload,
});

export const setTimeForKeep = (payload: {
  keep_id: string;
  updatedAt: Date;
  totalSeconds: number;
}) => ({
  type: 'setTimeForKeep' as const,
  payload,
});

export type Action =
  | ReturnType<typeof setKeepList>
  | ReturnType<typeof setTime>
  | ReturnType<typeof setTimeForKeep>;

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
    case 'setTime':
      if (action.payload) {
        state.time = action.payload;
      }
      break;
    case 'setTimeForKeep':
      state.keep_list = state.keep_list.map((keep) => {
        if (keep.id == action.payload.keep_id) {
          keep.timeUpdatedAt = action.payload.updatedAt;
          keep.todayTotalSeconds = action.payload.totalSeconds;
          return keep;
        }
        return keep;
      });
  }
};
