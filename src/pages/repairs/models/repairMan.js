import {
  repairMan_list,
  repairMan_add,
  repairMan_del,
} from '@/services/repairs';

export default {
  namespace: 'repairMan',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(repairMan_list, payload);
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
      const response = yield call(repairMan_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(repairMan_del, payload);
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
