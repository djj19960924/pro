import { systemInfo_set, systemInfo_get } from '@/services/services';

export default {
  namespace: 'params',

  state: {},

  effects: {
    *set({ payload, callback }, { call, put }) {
      const response = yield call(systemInfo_set, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(systemInfo_get, payload);
      yield put({
        type: 'save',
        payload: response.data,
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
