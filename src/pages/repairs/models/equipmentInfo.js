import {
  equipmentInfo_list,
  equipmentInfo_add,
  equipmentInfo_del,
  equipmentInfo_get
} from '@/services/repairs';

export default {
  namespace: 'equipmentInfo',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(equipmentInfo_list, payload);
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
      const response = yield call(equipmentInfo_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(equipmentInfo_del, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(equipmentInfo_get, payload);
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
