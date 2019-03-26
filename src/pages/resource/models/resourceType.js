import {
  type_list,
  type_add,
  type_del
} from '@/services/resource';

export default {
  namespace: 'resourceType',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(type_list, payload);
      let data = response.data;
      data &&
        (data.pagination = {
          total: data.itemCount,
          pageSize: payload.ps,
          current: payload.pn,
        });
      yield put({
        type: 'save',
        payload: data,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(type_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *del({ payload, callback }, { call, put }) {
      const response = yield call(type_del, payload);
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
