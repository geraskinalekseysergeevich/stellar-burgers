import { ConstructorPageUI } from '@ui-pages';
import { useSelector } from '../../services/store';
import { selectIngredientsLoading } from '../../services/selectors';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
