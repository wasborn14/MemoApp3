export interface ShoppingTopState {
  shoppingItemList: ShoppingItemDetail[];
}

export interface ShoppingItemDetail {
  id: string;
  name: string;
  check: boolean;
  updatedAt: Date;
}

export const setShoppingItemList = (payload: ShoppingItemDetail[] | undefined) => ({
  type: 'setShoppingItemList' as const,
  payload,
});

export type Action = ReturnType<typeof setShoppingItemList>;

export const initialState: ShoppingTopState = {
  shoppingItemList: [],
};

export const shoppingTopReducer = (state: ShoppingTopState, action: Action) => {
  switch (action.type) {
    case 'setShoppingItemList':
      if (action.payload) {
        state.shoppingItemList = action.payload;
      }
      break;
  }
};
