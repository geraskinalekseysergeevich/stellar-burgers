import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import {
  clearSelectedOrder,
  getOrderByNumberThunk
} from '../../services/slices/orders-slice';
import {
  selectIngredients,
  selectIngredientsLoading,
  selectSelectedOrderError,
  selectSelectedOrder,
  selectSelectedOrderLoading
} from '../../services/selectors';
import { useDispatch, useSelector } from '../../services/store';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderData = useSelector(selectSelectedOrder);
  const ingredients = useSelector(selectIngredients);
  const loading = useSelector(selectSelectedOrderLoading);
  const ingredientsLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectSelectedOrderError);

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumberThunk(Number(number)));
    }

    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (error) {
    return <div className='text text_type_main-medium pt-10'>{error}</div>;
  }

  if (loading || ingredientsLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
