import React, {createContext, Dispatch, useContext} from 'react';
import {createContext as createContextSelector, useContextSelector} from 'use-context-selector';
import {Action, initialState, graphTopReducer, GraphTopState} from './reducer/reducer';
import {useImmerReducer} from 'use-immer';
import GraphTopScreen from './GraphTopScreen';

const GraphTopContext = createContextSelector<GraphTopState>(initialState);

const GraphTopDispatchContext = createContext<Dispatch<Action> | void>(undefined);

export function useGraphTopState<T>(selector: (state: GraphTopState) => T): T {
  return useContextSelector(GraphTopContext, selector);
}

export function useGraphTopDispatch(): Dispatch<Action> {
  const context = useContext(GraphTopDispatchContext);
  if (context === undefined) {
    throw new Error();
  }
  return context;
}

const GraphTopContainer: React.FC = () => {
  const [state, dispatch] = useImmerReducer(graphTopReducer, initialState);

  return (
    <GraphTopContext.Provider value={state}>
      <GraphTopDispatchContext.Provider value={dispatch}>
        <GraphTopScreen />
      </GraphTopDispatchContext.Provider>
    </GraphTopContext.Provider>
  );
};

export default GraphTopContainer;
