import React, {createContext, Dispatch, useContext} from 'react';
import {createContext as createContextSelector, useContextSelector} from 'use-context-selector';
import {Action, initialState, taskListReducer, TaskListState} from './reducer/reducer';
import {useImmerReducer} from 'use-immer';
import TaskListScreen from './TaskListScreen';

const TaskListContext = createContextSelector<TaskListState>(initialState);

const TaskListDispatchContext = createContext<Dispatch<Action> | void>(undefined);

export function useTaskListState<T>(selector: (state: TaskListState) => T): T {
  return useContextSelector(TaskListContext, selector);
}

export function useTaskListDispatch(): Dispatch<Action> {
  const context = useContext(TaskListDispatchContext);
  if (context === undefined) {
    throw new Error();
  }
  return context;
}

const TaskListContainer: React.FC = () => {
  const [state, dispatch] = useImmerReducer(taskListReducer, initialState);

  return (
    <TaskListContext.Provider value={state}>
      <TaskListDispatchContext.Provider value={dispatch}>
        <TaskListScreen />
      </TaskListDispatchContext.Provider>
    </TaskListContext.Provider>
  );
};

export default TaskListContainer;
