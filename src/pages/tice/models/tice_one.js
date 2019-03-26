import { tice_one_list, tice_one_delete } from '@/services/services';

export default {
  namespace: 'tice_one',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(tice_one_list, payload);
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
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(tice_one_delete, payload);
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
