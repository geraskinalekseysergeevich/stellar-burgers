import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { PayloadAction } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from '../../utils/cookie';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  updateUserApi
} from '@api';
import { TRegisterData, TLoginData } from '@api';
import { TUser } from '@utils-types';

export type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

export const userInitialState: UserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  loading: false,
  error: null
};

type TAuthResponse = Awaited<ReturnType<typeof loginUserApi>>;

const saveTokens = (data: TAuthResponse) => {
  localStorage.setItem('refreshToken', data.refreshToken);
  setCookie('accessToken', data.accessToken);
};

export const loginThunk = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    saveTokens(response);
    return response.user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось войти'
    );
  }
});

export const registerThunk = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    saveTokens(response);
    return response.user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось зарегистрироваться'
    );
  }
});

export const getUserThunk = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('user/getUser', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserApi();
    return response.user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : 'Не удалось получить пользователя'
    );
  }
});

export const updateUserThunk = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateUser', async (user, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(user);
    return response.user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось обновить профиль'
    );
  }
});

export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('user/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось выйти'
    );
  } finally {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  }
});

export const forgotPasswordThunk = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>('user/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    await forgotPasswordApi(data);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось отправить письмо'
    );
  }
});

export const resetPasswordThunk = createAsyncThunk<
  void,
  { password: string; token: string },
  { rejectValue: string }
>('user/resetPassword', async (data, { rejectWithValue }) => {
  try {
    await resetPasswordApi(data);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось сбросить пароль'
    );
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Не удалось войти';
        state.isAuthChecked = true;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Не удалось зарегистрироваться';
        state.isAuthChecked = true;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUserThunk.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Не удалось обновить профиль';
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Не удалось отправить письмо';
      })
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Не удалось сбросить пароль';
      });
  }
});

export const { setAuthChecked, clearUserError } = userSlice.actions;

export default userSlice.reducer;
