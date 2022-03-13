export interface GraphTopState {
  time_list: Time[];
}

export type Time = {
  id: string;
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

export const setTimeList = (payload: Time[] | undefined) => ({
  type: 'setTimeList' as const,
  payload,
});

export type Action = ReturnType<typeof setTimeList>;

export const initialState: GraphTopState = {
  time_list: [],
};

export const graphTopReducer = (state: GraphTopState, action: Action) => {
  switch (action.type) {
    case 'setTimeList':
      if (action.payload) {
        state.time_list = action.payload;
      }
      break;
  }
};
