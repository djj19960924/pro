import {
  equipment_list,
  equipment_add,
  equipment_del,
  equipment_get,
  equipment_base
} from '@/services/repairs';

export default {
  namespace: 'equipment',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(equipment_list, payload);
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
    *base({ payload, callback }, { call, put }) {
      const response = yield call(equipment_base, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(equipment_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(equipment_del, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(equipment_get, payload);
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
