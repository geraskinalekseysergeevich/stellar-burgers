import { FC } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  type Location
} from 'react-router-dom';

import { Modal } from '@components';
import { IngredientDetails } from '@components';
import { OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Order,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { Ingredient } from '../../pages/ingredient';
import { RequireAnon } from './require-anon';
import { RequireAuth } from './require-auth';

type TLocationState = {
  background?: Location;
};

const IngredientModal: FC = () => {
  const navigate = useNavigate();

  return (
    <Modal
      title='Детали ингредиента'
      onClose={() => {
        navigate(-1);
      }}
    >
      <IngredientDetails />
    </Modal>
  );
};

const OrderModal: FC = () => {
  const navigate = useNavigate();

  return (
    <Modal
      title='Детали заказа'
      onClose={() => {
        navigate(-1);
      }}
    >
      <OrderInfo />
    </Modal>
  );
};

export const AppRoutes: FC = () => {
  const location = useLocation();
  const state = location.state as TLocationState | null;
  const background = state?.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<Order />} />
        <Route element={<RequireAnon />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route path='/profile/orders/:number' element={<Order />} />
        </Route>
        <Route path='/ingredients/:id' element={<Ingredient />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route path='/ingredients/:id' element={<IngredientModal />} />
          <Route path='/feed/:number' element={<OrderModal />} />
          <Route path='/profile/orders/:number' element={<OrderModal />} />
        </Routes>
      )}
    </>
  );
};
