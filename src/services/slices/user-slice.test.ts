import reducer, {
  clearUserError,
  forgotPasswordThunk,
  getUserThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
  resetPasswordThunk,
  setAuthChecked,
  updateUserThunk,
  userInitialState
} from './user-slice';
import { TUser } from '@utils-types';

const user: TUser = {
  email: 'alex@example.com',
  name: 'Alex'
};

describe('user reducer', () => {
  it('returns initial state by default', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      userInitialState
    );
  });

  it('sets auth checked flag', () => {
    const state = reducer(userInitialState, setAuthChecked(true));

    expect(state.isAuthChecked).toBe(true);
  });

  it('clears user error', () => {
    const state = reducer(
      { ...userInitialState, error: 'boom' },
      clearUserError()
    );

    expect(state.error).toBeNull();
  });

  it('handles login lifecycle', () => {
    const pendingState = reducer(
      userInitialState,
      loginThunk.pending('', { email: 'alex@example.com', password: '123' })
    );
    const fulfilledState = reducer(
      userInitialState,
      loginThunk.fulfilled(user, '', {
        email: 'alex@example.com',
        password: '123'
      })
    );
    const rejectedState = reducer(
      userInitialState,
      loginThunk.rejected(
        null,
        '',
        {
          email: 'alex@example.com',
          password: '123'
        },
        'boom'
      )
    );

    expect(pendingState.loading).toBe(true);
    expect(pendingState.error).toBeNull();
    expect(fulfilledState.loading).toBe(false);
    expect(fulfilledState.user).toEqual(user);
    expect(fulfilledState.isAuthenticated).toBe(true);
    expect(fulfilledState.isAuthChecked).toBe(true);
    expect(rejectedState.loading).toBe(false);
    expect(rejectedState.error).toBe('boom');
    expect(rejectedState.isAuthChecked).toBe(true);
  });

  it('handles register lifecycle', () => {
    const pendingState = reducer(
      userInitialState,
      registerThunk.pending('', {
        email: 'alex@example.com',
        name: 'Alex',
        password: '123'
      })
    );
    const fulfilledState = reducer(
      userInitialState,
      registerThunk.fulfilled(user, '', {
        email: 'alex@example.com',
        name: 'Alex',
        password: '123'
      })
    );
    const rejectedState = reducer(
      userInitialState,
      registerThunk.rejected(
        null,
        '',
        {
          email: 'alex@example.com',
          name: 'Alex',
          password: '123'
        },
        'boom'
      )
    );

    expect(pendingState.loading).toBe(true);
    expect(fulfilledState.user).toEqual(user);
    expect(fulfilledState.isAuthenticated).toBe(true);
    expect(rejectedState.loading).toBe(false);
    expect(rejectedState.error).toBe('boom');
  });

  it('handles auth check lifecycle', () => {
    const pendingState = reducer(
      userInitialState,
      getUserThunk.pending('', undefined)
    );
    const fulfilledState = reducer(
      userInitialState,
      getUserThunk.fulfilled(user, '', undefined)
    );
    const rejectedState = reducer(
      { ...userInitialState, user },
      getUserThunk.rejected(null, '', undefined, 'boom')
    );

    expect(pendingState.loading).toBe(true);
    expect(fulfilledState.user).toEqual(user);
    expect(fulfilledState.isAuthenticated).toBe(true);
    expect(fulfilledState.isAuthChecked).toBe(true);
    expect(rejectedState.loading).toBe(false);
    expect(rejectedState.user).toBeNull();
    expect(rejectedState.isAuthenticated).toBe(false);
    expect(rejectedState.isAuthChecked).toBe(true);
  });

  it('handles profile update lifecycle', () => {
    const pendingState = reducer(
      userInitialState,
      updateUserThunk.pending('', { email: 'alex@example.com' })
    );
    const fulfilledState = reducer(
      userInitialState,
      updateUserThunk.fulfilled(user, '', { email: 'alex@example.com' })
    );
    const rejectedState = reducer(
      userInitialState,
      updateUserThunk.rejected(null, '', { email: 'alex@example.com' }, 'boom')
    );

    expect(pendingState.loading).toBe(true);
    expect(fulfilledState.loading).toBe(false);
    expect(fulfilledState.user).toEqual(user);
    expect(rejectedState.loading).toBe(false);
    expect(rejectedState.error).toBe('boom');
  });

  it('handles logout lifecycle', () => {
    const fulfilledState = reducer(
      { ...userInitialState, user, isAuthenticated: true },
      logoutThunk.fulfilled(undefined, '', undefined)
    );
    const rejectedState = reducer(
      { ...userInitialState, user, isAuthenticated: true },
      logoutThunk.rejected(null, '', undefined, 'boom')
    );

    expect(fulfilledState.user).toBeNull();
    expect(fulfilledState.isAuthenticated).toBe(false);
    expect(fulfilledState.isAuthChecked).toBe(true);
    expect(rejectedState.user).toBeNull();
    expect(rejectedState.isAuthenticated).toBe(false);
    expect(rejectedState.isAuthChecked).toBe(true);
  });

  it('handles forgot password lifecycle', () => {
    const pendingState = reducer(
      userInitialState,
      forgotPasswordThunk.pending('', { email: 'alex@example.com' })
    );
    const fulfilledState = reducer(
      userInitialState,
      forgotPasswordThunk.fulfilled(undefined, '', {
        email: 'alex@example.com'
      })
    );
    const rejectedState = reducer(
      userInitialState,
      forgotPasswordThunk.rejected(
        null,
        '',
        { email: 'alex@example.com' },
        'boom'
      )
    );

    expect(pendingState.loading).toBe(true);
    expect(fulfilledState.loading).toBe(false);
    expect(rejectedState.loading).toBe(false);
    expect(rejectedState.error).toBe('boom');
  });

  it('handles reset password lifecycle', () => {
    const pendingState = reducer(
      userInitialState,
      resetPasswordThunk.pending('', { password: '123', token: 'token' })
    );
    const fulfilledState = reducer(
      userInitialState,
      resetPasswordThunk.fulfilled(undefined, '', {
        password: '123',
        token: 'token'
      })
    );
    const rejectedState = reducer(
      userInitialState,
      resetPasswordThunk.rejected(
        null,
        '',
        { password: '123', token: 'token' },
        'boom'
      )
    );

    expect(pendingState.loading).toBe(true);
    expect(fulfilledState.loading).toBe(false);
    expect(rejectedState.loading).toBe(false);
    expect(rejectedState.error).toBe('boom');
  });
});
