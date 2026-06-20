import reducer, {
  addIngredient,
  clearConstructor,
  closeOrderModal,
  constructorInitialState,
  moveIngredient,
  removeIngredient,
  createOrderThunk
} from './constructor-slice';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

const bun: TIngredient = {
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
};

const bunInConstructor: TConstructorIngredient = {
  ...bun,
  id: 'bun-item-1'
};

const filling: TIngredient = {
  _id: 'main-1',
  name: 'Начинка',
  type: 'main',
  proteins: 11,
  fat: 21,
  carbohydrates: 31,
  calories: 41,
  price: 200,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png'
};

const order: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Тестовый заказ',
  createdAt: '2026-06-15T00:00:00.000Z',
  updatedAt: '2026-06-15T00:00:00.000Z',
  number: 424242,
  ingredients: ['bun-1', 'main-1', 'bun-1']
};

describe('burgerConstructor reducer', () => {
  it('adds bun to bun slot', () => {
    const state = reducer(constructorInitialState, addIngredient(bun));

    expect(state.bun?._id).toBe('bun-1');
    expect(state.ingredients).toEqual([]);
  });

  it('adds filling ingredient to list', () => {
    const state = reducer(constructorInitialState, addIngredient(filling));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe('main-1');
  });

  it('removes ingredient by id', () => {
    const startState = {
      ...constructorInitialState,
      ingredients: [{ ...filling, id: 'item-1' }]
    };

    const state = reducer(startState, removeIngredient('item-1'));

    expect(state.ingredients).toEqual([]);
  });

  it('moves ingredient inside filling list', () => {
    const secondIngredient = { ...filling, _id: 'main-2', id: 'item-2' };
    const startState = {
      ...constructorInitialState,
      ingredients: [{ ...filling, id: 'item-1' }, secondIngredient]
    };

    const state = reducer(
      startState,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients[0].id).toBe('item-2');
    expect(state.ingredients[1].id).toBe('item-1');
  });

  it('clears constructor state', () => {
    const startState = {
      ...constructorInitialState,
      bun: bunInConstructor,
      ingredients: [{ ...filling, id: 'item-1' }],
      orderRequest: true,
      orderModalData: order,
      error: 'bad'
    };

    expect(reducer(startState, clearConstructor())).toEqual(
      constructorInitialState
    );
  });

  it('handles order thunk lifecycle', () => {
    const pendingState = reducer(
      constructorInitialState,
      createOrderThunk.pending('', undefined)
    );
    const fulfilledState = reducer(
      { ...constructorInitialState, bun: bunInConstructor },
      createOrderThunk.fulfilled(order, '', undefined)
    );
    const rejectedState = reducer(
      constructorInitialState,
      createOrderThunk.rejected(null, '', undefined, 'error')
    );

    expect(pendingState.orderRequest).toBe(true);
    expect(fulfilledState.orderRequest).toBe(false);
    expect(fulfilledState.orderModalData?.number).toBe(424242);
    expect(fulfilledState.bun).toBeNull();
    expect(fulfilledState.ingredients).toEqual([]);
    expect(rejectedState.orderRequest).toBe(false);
    expect(rejectedState.error).toBe('error');
  });

  it('closes order modal', () => {
    const state = reducer(
      { ...constructorInitialState, orderRequest: true, orderModalData: order },
      closeOrderModal()
    );

    expect(state.orderModalData).toBeNull();
    expect(state.orderRequest).toBe(false);
  });
});
