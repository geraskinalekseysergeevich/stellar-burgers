import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';
import {
  selectIsAuthChecked,
  selectIsAuthenticated
} from '../../services/selectors';
import { useSelector } from '../../services/store';

export const RequireAuth: FC = () => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <Outlet />;
};
