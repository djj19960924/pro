import {
  orders_list,
  orders_add,
  orders_del,
  orders_tj
} from '@/services/repairs';

export default {
  namespace: 'orders',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(orders_list, payload);
      let data = {};
      response &&
        (
          data.pagination = {
            total: response.totalElements,
            pageSize: payload.size,
            current: payload.page,
          },
          data.list = response.content
        );
      yield put({
        type: 'save',
        payload: data,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(orders_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *orders_tj({ payload, callback }, { call, put }) {
      const response = yield call(orders_tj, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(orders_del, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
