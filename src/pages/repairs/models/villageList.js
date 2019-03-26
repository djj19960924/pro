import {
  getAllPoint2,
} from '@/services/repairs';

export default {
  namespace: 'villageList',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(getAllPoint2, payload);
      yield put({
        type: 'save',
        payload: response.data.list,
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
