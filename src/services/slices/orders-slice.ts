import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';

export type OrdersState = {
  feed: TOrdersData | null;
  feedLoading: boolean;
  feedError: string | null;
  userOrders: TOrder[];
  userOrdersLoading: boolean;
  userOrdersError: string | null;
  selectedOrder: TOrder | null;
  selectedOrderLoading: boolean;
  selectedOrderError: string | null;
};

export const ordersInitialState: OrdersState = {
  feed: null,
  feedLoading: false,
  feedError: null,
  userOrders: [],
  userOrdersLoading: false,
  userOrdersError: null,
  selectedOrder: null,
  selectedOrderLoading: false,
  selectedOrderError: null
};

export const getFeedsThunk = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('orders/getFeeds', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : 'Не удалось загрузить ленту заказов'
    );
  }
});

export const getUserOrdersThunk = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/getUserOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : 'Не удалось загрузить заказы пользователя'
    );
  }
});

export const getOrderByNumberThunk = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/getOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    const order = response.orders[0];

    if (!order) {
      return rejectWithValue('Заказ не найден');
    }

    return order;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось загрузить заказ'
    );
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: ordersInitialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
      state.selectedOrderError = null;
      state.selectedOrderLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.feed = action.payload;
      })
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError =
          action.payload ?? 'Не удалось загрузить ленту заказов';
      })
      .addCase(getUserOrdersThunk.pending, (state) => {
        state.userOrdersLoading = true;
        state.userOrdersError = null;
      })
      .addCase(getUserOrdersThunk.fulfilled, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrdersThunk.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrdersError =
          action.payload ?? 'Не удалось загрузить заказы пользователя';
      })
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.selectedOrderLoading = true;
        state.selectedOrderError = null;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.selectedOrderLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.selectedOrderLoading = false;
        state.selectedOrderError =
          action.payload ?? 'Не удалось загрузить заказ';
      });
  }
});

export const { clearSelectedOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
