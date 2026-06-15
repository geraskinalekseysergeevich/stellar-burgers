import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import {
  clearConstructor,
  closeOrderModal as closeOrderModalAction,
  createOrderThunk
} from '../../services/slices/constructor-slice';
import {
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorOrderModalData,
  selectConstructorOrderRequest,
  selectIsAuthenticated
} from '../../services/selectors';
import { useDispatch, useSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorIngredients);
  const orderRequest = useSelector(selectConstructorOrderRequest);
  const orderModalData = useSelector(selectConstructorOrderModalData);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    dispatch(createOrderThunk());
  };

  const closeOrderModal = () => {
    dispatch(closeOrderModalAction());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
