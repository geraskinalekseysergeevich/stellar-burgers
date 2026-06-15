import { combineReducers } from '@reduxjs/toolkit';

import {
  burgerConstructorReducer,
  ingredientsReducer,
  ordersReducer,
  userReducer
} from './slices';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  orders: ordersReducer,
  user: userReducer
});

export default rootReducer;
