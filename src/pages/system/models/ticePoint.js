import {
  tice_point_list,
  tice_point_add,
  tice_point_edit,
  tice_point_delete,
} from '@/services/services';

export default {
  namespace: 'ticePoint',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(tice_point_list, payload);
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
      const response = yield call(tice_point_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(tice_point_edit, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(tice_point_delete, payload);
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
