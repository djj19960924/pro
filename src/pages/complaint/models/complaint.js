import {
  complaint_list,
  complaint_del,
  complaint_list_top
} from '@/services/services';

export default {
  namespace: 'complaint',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(complaint_list, payload);
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
    *del({ payload, callback }, { call, put }) {
      const response = yield call(complaint_del, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *complaint_list_top({ payload, callback }, { call, put }) {
      const response = yield call(complaint_list_top, payload);
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
