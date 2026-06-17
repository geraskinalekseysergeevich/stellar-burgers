import rootReducer from './root-reducer';
import { constructorInitialState } from './slices/constructor-slice';
import { ingredientsInitialState } from './slices/ingredients-slice';
import { ordersInitialState } from './slices/orders-slice';
import { userInitialState } from './slices/user-slice';

describe('rootReducer', () => {
  it('returns initial store state for unknown action', () => {
    expect(rootReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      orders: ordersInitialState,
      user: userInitialState
    });
  });
});
