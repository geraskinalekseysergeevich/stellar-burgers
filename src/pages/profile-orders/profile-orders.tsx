import { useEffect } from 'react';

import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { Preloader } from '@ui';
import {
  selectUserOrders,
  selectUserOrdersError,
  selectUserOrdersLoading
} from '../../services/selectors';
import { getUserOrdersThunk } from '../../services/slices/orders-slice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const loading = useSelector(selectUserOrdersLoading);
  const error = useSelector(selectUserOrdersError);

  useEffect(() => {
    dispatch(getUserOrdersThunk());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div className='text text_type_main-medium pt-10'>{error}</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
