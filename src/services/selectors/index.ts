import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export const selectIngredientsState = (state: RootState) => state.ingredients;
export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectBuns = createSelector(selectIngredients, (items) =>
  items.filter((item) => item.type === 'bun')
);
export const selectMains = createSelector(selectIngredients, (items) =>
  items.filter((item) => item.type === 'main')
);
export const selectSauces = createSelector(selectIngredients, (items) =>
  items.filter((item) => item.type === 'sauce')
);
export const selectIngredientById = (id: string) => (state: RootState) =>
  state.ingredients.items.find((item) => item._id === id);

export const selectConstructorState = (state: RootState) =>
  state.burgerConstructor;
export const selectConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;
export const selectConstructorOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;
export const selectConstructorOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;
export const selectConstructorError = (state: RootState) =>
  state.burgerConstructor.error;

export const selectFeedState = (state: RootState) => state.orders.feed;
export const selectFeedLoading = (state: RootState) => state.orders.feedLoading;
export const selectFeedError = (state: RootState) => state.orders.feedError;
export const selectFeedOrders = (state: RootState) =>
  state.orders.feed?.orders ?? [];
export const selectFeedTotals = (state: RootState) =>
  state.orders.feed
    ? {
        total: state.orders.feed.total,
        totalToday: state.orders.feed.totalToday
      }
    : {
        total: 0,
        totalToday: 0
      };

export const selectUserOrders = (state: RootState) => state.orders.userOrders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.orders.userOrdersLoading;
export const selectUserOrdersError = (state: RootState) =>
  state.orders.userOrdersError;
export const selectSelectedOrder = (state: RootState) =>
  state.orders.selectedOrder;
export const selectSelectedOrderLoading = (state: RootState) =>
  state.orders.selectedOrderLoading;
export const selectSelectedOrderError = (state: RootState) =>
  state.orders.selectedOrderError;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
