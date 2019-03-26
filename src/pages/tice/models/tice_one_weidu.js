import { tice_one_list_weidu } from '@/services/services';

export default {
  namespace: 'tice_one_weidu',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(tice_one_list_weidu, payload);
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
