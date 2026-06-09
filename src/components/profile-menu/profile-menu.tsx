import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutThunk } from '../../services/slices/user-slice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutThunk()).finally(() => {
      navigate('/login', { replace: true });
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
