import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Preloader } from '@ui';
import {
  selectIsAuthChecked,
  selectIsAuthenticated
} from '../../services/selectors';
import { useSelector } from '../../services/store';

export const RequireAnon: FC = () => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};
