import { useEffect } from 'react';
import { getIngredientsThunk } from '../../services/slices/ingredients-slice';
import { getUserThunk } from '../../services/slices/user-slice';
import { useDispatch } from '../../services/store';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { AppRoutes } from './routes';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredientsThunk());
    dispatch(getUserThunk());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppRoutes />
    </div>
  );
};

export default App;
