import React, {createContext, Dispatch, useContext} from 'react';
import {createContext as createContextSelector, useContextSelector} from 'use-context-selector';
import {Action, initialState, ideaListReducer, IdeaListState} from './reducer/reducer';
import {useImmerReducer} from 'use-immer';
import IdeaListScreen from './IdeaListScreen';

const IdeaListContext = createContextSelector<IdeaListState>(initialState);

const IdeaListDispatchContext = createContext<Dispatch<Action> | void>(undefined);

export function useIdeaListState<T>(selector: (state: IdeaListState) => T): T {
  return useContextSelector(IdeaListContext, selector);
}

export function useIdeaListDispatch(): Dispatch<Action> {
  const context = useContext(IdeaListDispatchContext);
  if (context === undefined) {
    throw new Error();
  }
  return context;
}

const IdeaListContainer: React.FC = () => {
  const [state, dispatch] = useImmerReducer(ideaListReducer, initialState);

  return (
    <IdeaListContext.Provider value={state}>
      <IdeaListDispatchContext.Provider value={dispatch}>
        <IdeaListScreen />
      </IdeaListDispatchContext.Provider>
    </IdeaListContext.Provider>
  );
};

export default IdeaListContainer;
