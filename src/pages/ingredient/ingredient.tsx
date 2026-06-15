import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { IngredientDetails } from '@components';
import { Preloader } from '@ui';
import { getIngredientsThunk } from '../../services/slices/ingredients-slice';
import {
  selectIngredientById,
  selectIngredientsLoading
} from '../../services/selectors';
import { useDispatch, useSelector } from '../../services/store';

export const Ingredient: FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const loading = useSelector(selectIngredientsLoading);
  const ingredient = useSelector(selectIngredientById(id || ''));

  useEffect(() => {
    dispatch(getIngredientsThunk());
  }, [dispatch]);

  if (loading || !ingredient) {
    return <Preloader />;
  }

  return (
    <main className='pt-30'>
      <h1 className='text text_type_main-large mb-10'>Детали ингредиента</h1>
      <IngredientDetails />
    </main>
  );
};
