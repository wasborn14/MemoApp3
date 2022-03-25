import React, {createContext, Dispatch, useContext} from 'react';
import {createContext as createContextSelector, useContextSelector} from 'use-context-selector';
import {
  Action,
  initialState,
  ideaCategoryListReducer,
  IdeaCategoryListState,
} from './reducer/reducer';
import {useImmerReducer} from 'use-immer';
import IdeaCategoryListScreen from './IdeaCategoryListScreen';
const IdeaCategoryListContext = createContextSelector<IdeaCategoryListState>(initialState);

const IdeaCategoryListDispatchContext = createContext<Dispatch<Action> | void>(undefined);

export function useIdeaCategoryListState<T>(selector: (state: IdeaCategoryListState) => T): T {
  return useContextSelector(IdeaCategoryListContext, selector);
}

export function useIdeaCategoryListDispatch(): Dispatch<Action> {
  const context = useContext(IdeaCategoryListDispatchContext);
  if (context === undefined) {
    throw new Error();
  }
  return context;
}

const IdeaCategoryListContainer: React.FC = () => {
  const [state, dispatch] = useImmerReducer(ideaCategoryListReducer, initialState);

  return (
    <IdeaCategoryListContext.Provider value={state}>
      <IdeaCategoryListDispatchContext.Provider value={dispatch}>
        <IdeaCategoryListScreen />
      </IdeaCategoryListDispatchContext.Provider>
    </IdeaCategoryListContext.Provider>
  );
};

export default IdeaCategoryListContainer;
