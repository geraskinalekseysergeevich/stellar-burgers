import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { ForgotPasswordUI } from '@ui-pages';
import {
  clearUserError,
  forgotPasswordThunk
} from '../../services/slices/user-slice';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserError, selectUserLoading } from '../../services/selectors';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const error = useSelector(selectUserError);
  const loading = useSelector(selectUserLoading);
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(clearUserError());
    dispatch(forgotPasswordThunk({ email })).then((result) => {
      if (forgotPasswordThunk.fulfilled.match(result)) {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      }
    });
  };

  return (
    <ForgotPasswordUI
      errorText={loading ? '' : error || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
