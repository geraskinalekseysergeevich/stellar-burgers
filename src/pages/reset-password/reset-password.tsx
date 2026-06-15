import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ResetPasswordUI } from '@ui-pages';
import {
  clearUserError,
  resetPasswordThunk
} from '../../services/slices/user-slice';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserError, selectUserLoading } from '../../services/selectors';

export const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const error = useSelector(selectUserError);
  const loading = useSelector(selectUserLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(clearUserError());
    dispatch(resetPasswordThunk({ password, token })).then((result) => {
      if (resetPasswordThunk.fulfilled.match(result)) {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      }
    });
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={loading ? '' : error || ''}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
