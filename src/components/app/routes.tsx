import { FC } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  type Location
} from 'react-router-dom';

import { Modal } from '@components';
import { IngredientDetails } from '@components';
import { OrderInfo } from '@components';
import { Preloader } from '@ui';
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
import {
  selectIsAuthChecked,
  selectIsAuthenticated
} from '../../services/selectors';
import { useSelector } from '../../services/store';
import { Ingredient } from '../../pages/ingredient';

type TLocationState = {
  background?: Location;
};

const RequireAuth: FC = () => {
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

const RequireAnon: FC = () => {
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
