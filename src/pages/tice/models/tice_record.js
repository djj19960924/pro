import { tice_record_list, tice_record_delete, getallpoint } from '@/services/services';

export default {
  namespace: 'tice_record',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(tice_record_list, payload);
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
      const response = yield call(tice_record_delete, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *getallpoint({ payload, callback }, { call, put }) {
      const response = yield call(getallpoint, payload);
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
