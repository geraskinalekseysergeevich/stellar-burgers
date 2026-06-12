import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { orderBurgerApi } from '@api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import type { RootState } from '../store';

export type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

export const constructorInitialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  error: null
};

const getOrderIngredientIds = (state: RootState) => {
  const bun = state.burgerConstructor.bun;
  const ingredients = state.burgerConstructor.ingredients;

  if (!bun) {
    return [];
  }

  return [bun._id, ...ingredients.map((item) => item._id), bun._id];
};

export const createOrderThunk = createAsyncThunk<
  TOrder,
  void,
  { state: RootState; rejectValue: string }
>('burgerConstructor/createOrder', async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const bun = state.burgerConstructor.bun;

  if (!bun) {
    return rejectWithValue('Нужно выбрать булку');
  }

  try {
    const response = await orderBurgerApi(getOrderIngredientIds(state));
    return {
      ...response.order,
      ingredients: getOrderIngredientIds(state)
    } as TOrder;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось оформить заказ'
    );
  }
});

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: constructorInitialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
          return;
        }

        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: uuidv4()
        }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const next = [...state.ingredients];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      state.ingredients = next;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.orderRequest = false;
      state.orderModalData = null;
      state.error = null;
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload ?? 'Не удалось оформить заказ';
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  closeOrderModal
} = constructorSlice.actions;

export default constructorSlice.reducer;
