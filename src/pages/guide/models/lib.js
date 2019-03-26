import {
  lib_type_list,
  lib_type_add,
  lib_type_del,
  
  lib_target_list,
  lib_target_add,
  lib_target_del,
  
  lib_content_list,
  lib_content_add,
  lib_content_del,
} from '@/services/guide';

export default {
  namespace: 'lib',

  state: {
    data: [],
  },

  effects: {
    *type_list({ payload, callback }, { call, put }) {
      const response = yield call(lib_type_list, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *type_add({ payload, callback }, { call, put }) {
      const response = yield call(lib_type_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *type_del({ payload, callback }, { call, put }) {
      const response = yield call(lib_type_del, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    // ...
    *target_list({ payload, callback }, { call, put }) {
      const response = yield call(lib_target_list, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *target_add({ payload, callback }, { call, put }) {
      const response = yield call(lib_target_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *target_del({ payload, callback }, { call, put }) {
      const response = yield call(lib_target_del, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    // ...
    *content_list({ payload, callback }, { call, put }) {
      const response = yield call(lib_content_list, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *content_add({ payload, callback }, { call, put }) {
      const response = yield call(lib_content_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *content_del({ payload, callback }, { call, put }) {
      const response = yield call(lib_content_del, payload);
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
