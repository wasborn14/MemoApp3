import {startTodayDate} from '../../../../utils/time/time';

export interface TaskListState {
  task_list: TaskDetail[];
  time_detail?: TimeDetail;
}

export interface TaskTime {
  task_id: string;
  task_bodyText: string;
  totalSeconds: number;
}

export type TimeDetail = {
  id: string;
  tasks?: TaskTime[];
  task_id: string;
  task_bodyText: string;
  updatedAt: Date;
};

export type TaskDetail = {
  id: string;
  bodyText: string;
  updatedAt: Date;
  timeUpdatedAt: Date;
  todayTotalSeconds: number;
};

export const setTaskList = (payload: TaskDetail[] | undefined) => ({
  type: 'setTaskList' as const,
  payload,
});

export const setTime = (payload: TimeDetail | undefined) => ({
  type: 'setTime' as const,
  payload,
});

export type Action = ReturnType<typeof setTaskList> | ReturnType<typeof setTime>;

export const initialState: TaskListState = {
  task_list: [],
};

export const taskListReducer = (state: TaskListState, action: Action) => {
  switch (action.type) {
    case 'setTaskList':
      if (action.payload) {
        const todayStartAt = startTodayDate();
        state.task_list = action.payload.map((task) => {
          if (task.timeUpdatedAt <= todayStartAt) {
            return {...task, todayTotalSeconds: 0};
          }
          return task;
        });
      }
      break;
    case 'setTime':
      if (action.payload) {
        state.time_detail = action.payload;
      }
      break;
  }
};
