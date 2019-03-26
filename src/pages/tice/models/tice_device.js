import {
  tice_device_list,
  tice_device_add,
  tice_device_edit,
  tice_device_delete,
  getallpoint,
  tice_device_updatePoint,
} from '@/services/services';

export default {
  namespace: 'tice_device',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(tice_device_list, payload);
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
      const response = yield call(tice_device_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(tice_device_edit, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(tice_device_delete, payload);
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
    *updatePoint({ payload, callback }, { call, put }) {
      const response = yield call(tice_device_updatePoint, payload);
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
