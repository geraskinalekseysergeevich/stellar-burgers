import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export type IngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
};

export const ingredientsInitialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const getIngredientsThunk = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/getIngredients', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : 'Не удалось загрузить ингредиенты'
    );
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: ingredientsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Не удалось загрузить ингредиенты';
      });
  }
});

export default ingredientsSlice.reducer;
