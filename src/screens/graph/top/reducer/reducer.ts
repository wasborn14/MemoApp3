import {TimeDetail} from '../../../task/list/reducer/reducer';

export interface GraphTopState {
  time_list: TimeDetail[];
}

export const setTimeList = (payload: TimeDetail[] | undefined) => ({
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
