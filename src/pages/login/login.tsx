import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';

import { loginThunk } from '../../services/slices/user-slice';
import { LoginUI } from '@ui-pages';
import {
  selectIsAuthenticated,
  selectUserError,
  selectUserLoading
} from '../../services/selectors';
import { useDispatch, useSelector } from '../../services/store';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [from, isAuthenticated, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginThunk({ email, password }))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      });
  };

  return (
    <LoginUI
      errorText={error || (loading ? 'Вход...' : '')}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
