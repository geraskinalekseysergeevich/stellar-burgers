import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';

import { registerThunk } from '../../services/slices/user-slice';
import { clearUserError } from '../../services/slices/user-slice';
import { RegisterUI } from '@ui-pages';
import {
  selectIsAuthenticated,
  selectUserError,
  selectUserLoading
} from '../../services/selectors';
import { useDispatch, useSelector } from '../../services/store';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const [userName, setUserName] = useState('');
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

    dispatch(clearUserError());

    (async () => {
      try {
        await dispatch(
          registerThunk({ name: userName, email, password })
        ).unwrap();
        navigate(from, { replace: true });
      } catch {
        // error is stored in redux and displayed by the form
      }
    })();
  };

  return (
    <RegisterUI
      errorText={error || (loading ? 'Регистрация...' : '')}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
