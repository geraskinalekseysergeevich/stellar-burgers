import { useEffect } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import {
  selectFeedError,
  selectFeedLoading,
  selectFeedOrders
} from '../../services/selectors';
import { getFeedsThunk } from '../../services/slices/orders-slice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const loading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  useEffect(() => {
    dispatch(getFeedsThunk());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div className='text text_type_main-medium pt-10'>{error}</div>;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeedsThunk());
      }}
    />
  );
};
