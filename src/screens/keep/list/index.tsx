import React, {createContext, Dispatch, useContext} from 'react';
import {createContext as createContextSelector, useContextSelector} from 'use-context-selector';
import {Action, initialState, keepListReducer, KeepListState} from './reducer/reducer';
import {useImmerReducer} from 'use-immer';
import KeepListScreen from './KeepListScreen';

const KeepListContext = createContextSelector<KeepListState>(initialState);

const KeepListDispatchContext = createContext<Dispatch<Action> | void>(undefined);

export function useKeepListState<T>(selector: (state: KeepListState) => T): T {
  return useContextSelector(KeepListContext, selector);
}

export function useKeepListDispatch(): Dispatch<Action> {
  const context = useContext(KeepListDispatchContext);
  if (context === undefined) {
    throw new Error();
  }
  return context;
}

const KeepListContainer: React.FC = () => {
  const [state, dispatch] = useImmerReducer(keepListReducer, initialState);

  return (
    <KeepListContext.Provider value={state}>
      <KeepListDispatchContext.Provider value={dispatch}>
        <KeepListScreen />
      </KeepListDispatchContext.Provider>
    </KeepListContext.Provider>
  );
};

export default KeepListContainer;
