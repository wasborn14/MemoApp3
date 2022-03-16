export interface TaskListState {
  task_list: Task[];
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
  updatedAt: Date;
};

export type Task = {
  id: string;
  bodyText?: string;
  updatedAt?: Date;
  timeUpdatedAt?: Date;
  todayTotalSeconds?: number;
};

export const setTaskList = (payload: Task[] | undefined) => ({
  type: 'setTaskList' as const,
  payload,
});

export const setTime = (payload: Time | undefined) => ({
  type: 'setTime' as const,
  payload,
});

export const setTimeForTask = (payload: {
  task_id: string;
  updatedAt: Date;
  totalSeconds: number;
}) => ({
  type: 'setTimeForTask' as const,
  payload,
});

export type Action =
  | ReturnType<typeof setTaskList>
  | ReturnType<typeof setTime>
  | ReturnType<typeof setTimeForTask>;

export const initialState: TaskListState = {
  task_list: [],
};

export const taskListReducer = (state: TaskListState, action: Action) => {
  switch (action.type) {
    case 'setTaskList':
      if (action.payload) {
        state.task_list = action.payload;
      }
      break;
    case 'setTime':
      if (action.payload) {
        state.time = action.payload;
      }
      break;
    case 'setTimeForTask':
      state.task_list = state.task_list.map((task) => {
        if (task.id == action.payload.task_id) {
          task.timeUpdatedAt = action.payload.updatedAt;
          task.todayTotalSeconds = action.payload.totalSeconds;
          return task;
        }
        return task;
      });
  }
};
