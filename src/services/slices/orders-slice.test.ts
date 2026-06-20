import reducer, {
  clearSelectedOrder,
  getFeedsThunk,
  getOrderByNumberThunk,
  getUserOrdersThunk,
  ordersInitialState
} from './orders-slice';
import { TOrder, TOrdersData } from '@utils-types';

const feedData: TOrdersData = {
  orders: [
    {
      _id: 'order-1',
      status: 'done',
      name: 'Order one',
      createdAt: '2026-06-15T00:00:00.000Z',
      updatedAt: '2026-06-15T00:00:00.000Z',
      number: 1001,
      ingredients: ['bun-1', 'main-1']
    }
  ],
  total: 1,
  totalToday: 1
};

const userOrders: TOrder[] = [
  {
    _id: 'order-2',
    status: 'pending',
    name: 'Order two',
    createdAt: '2026-06-16T00:00:00.000Z',
    updatedAt: '2026-06-16T00:00:00.000Z',
    number: 1002,
    ingredients: ['bun-1', 'main-1']
  }
];

const selectedOrder: TOrder = {
  _id: 'order-3',
  status: 'done',
  name: 'Order three',
  createdAt: '2026-06-17T00:00:00.000Z',
  updatedAt: '2026-06-17T00:00:00.000Z',
  number: 1003,
  ingredients: ['bun-1', 'main-1']
};

describe('orders reducer', () => {
  it('returns initial state by default', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      ordersInitialState
    );
  });

  it('clears selected order', () => {
    const state = reducer(
      {
        ...ordersInitialState,
        selectedOrder,
        selectedOrderLoading: true,
        selectedOrderError: 'boom'
      },
      clearSelectedOrder()
    );

    expect(state.selectedOrder).toBeNull();
    expect(state.selectedOrderLoading).toBe(false);
    expect(state.selectedOrderError).toBeNull();
  });

  it('handles feed request lifecycle', () => {
    const pendingState = reducer(
      ordersInitialState,
      getFeedsThunk.pending('', undefined)
    );
    const fulfilledState = reducer(
      ordersInitialState,
      getFeedsThunk.fulfilled(feedData, '', undefined)
    );
    const rejectedState = reducer(
      ordersInitialState,
      getFeedsThunk.rejected(null, '', undefined, 'boom')
    );

    expect(pendingState.feedLoading).toBe(true);
    expect(pendingState.feedError).toBeNull();
    expect(fulfilledState.feedLoading).toBe(false);
    expect(fulfilledState.feed).toEqual(feedData);
    expect(rejectedState.feedLoading).toBe(false);
    expect(rejectedState.feedError).toBe('boom');
  });

  it('handles user orders request lifecycle', () => {
    const pendingState = reducer(
      ordersInitialState,
      getUserOrdersThunk.pending('', undefined)
    );
    const fulfilledState = reducer(
      ordersInitialState,
      getUserOrdersThunk.fulfilled(userOrders, '', undefined)
    );
    const rejectedState = reducer(
      ordersInitialState,
      getUserOrdersThunk.rejected(null, '', undefined, 'boom')
    );

    expect(pendingState.userOrdersLoading).toBe(true);
    expect(pendingState.userOrdersError).toBeNull();
    expect(fulfilledState.userOrdersLoading).toBe(false);
    expect(fulfilledState.userOrders).toEqual(userOrders);
    expect(rejectedState.userOrdersLoading).toBe(false);
    expect(rejectedState.userOrdersError).toBe('boom');
  });

  it('handles selected order request lifecycle', () => {
    const pendingState = reducer(
      ordersInitialState,
      getOrderByNumberThunk.pending('', 1003)
    );
    const fulfilledState = reducer(
      ordersInitialState,
      getOrderByNumberThunk.fulfilled(selectedOrder, '', 1003)
    );
    const rejectedState = reducer(
      ordersInitialState,
      getOrderByNumberThunk.rejected(null, '', 1003, 'boom')
    );

    expect(pendingState.selectedOrderLoading).toBe(true);
    expect(pendingState.selectedOrderError).toBeNull();
    expect(fulfilledState.selectedOrderLoading).toBe(false);
    expect(fulfilledState.selectedOrder).toEqual(selectedOrder);
    expect(rejectedState.selectedOrderLoading).toBe(false);
    expect(rejectedState.selectedOrderError).toBe('boom');
  });
});
