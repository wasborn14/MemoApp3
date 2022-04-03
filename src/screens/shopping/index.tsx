import React, {createContext, Dispatch, useContext} from 'react';
import {createContext as createContextSelector, useContextSelector} from 'use-context-selector';
import {useImmerReducer} from 'use-immer';
import {Action, initialState, shoppingTopReducer, ShoppingTopState} from './reducer/reducer';
import ShoppingTopScreen from './ShoppingTopScreen';

const ShoppingTopContext = createContextSelector<ShoppingTopState>(initialState);

const ShoppingTopDispatchContext = createContext<Dispatch<Action> | void>(undefined);

export function useShoppingTopState<T>(selector: (state: ShoppingTopState) => T): T {
  return useContextSelector(ShoppingTopContext, selector);
}

export function useShppingTopDispatch(): Dispatch<Action> {
  const context = useContext(ShoppingTopDispatchContext);
  if (context === undefined) {
    throw new Error();
  }
  return context;
}

const ShoppingTopContainer: React.FC = () => {
  const [state, dispatch] = useImmerReducer(shoppingTopReducer, initialState);

  return (
    <ShoppingTopContext.Provider value={state}>
      <ShoppingTopDispatchContext.Provider value={dispatch}>
        <ShoppingTopScreen />
      </ShoppingTopDispatchContext.Provider>
    </ShoppingTopContext.Provider>
  );
};

export default ShoppingTopContainer;
