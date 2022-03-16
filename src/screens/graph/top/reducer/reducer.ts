export interface GraphTopState {
  time_list: Time[];
  time?: Time;
}

export interface TaskTime {
  task_id: string;
  task_bodyText: string;
  totalSeconds: number;
}

export type Time = {
  id: string;
  tasks?: TaskTime[];
  task_id: string;
  task_bodyText: string;
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
