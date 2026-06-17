import reducer, {
  getIngredientsThunk,
  ingredientsInitialState
} from './ingredients-slice';
import { TIngredient } from '@utils-types';

const ingredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 100,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png'
  }
];

describe('ingredients reducer', () => {
  it('sets loading on request', () => {
    const state = reducer(
      ingredientsInitialState,
      getIngredientsThunk.pending('', undefined)
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores ingredients on success', () => {
    const state = reducer(
      { ...ingredientsInitialState, loading: true },
      getIngredientsThunk.fulfilled(ingredients, '', undefined)
    );

    expect(state.loading).toBe(false);
    expect(state.items).toEqual(ingredients);
  });

  it('stores error on failure', () => {
    const state = reducer(
      { ...ingredientsInitialState, loading: true },
      getIngredientsThunk.rejected(null, '', undefined, 'boom')
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('boom');
  });
});
