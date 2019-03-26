import {
  wxuser_list,
  wxuser_get,
  wxuser_allotOne,
  wxuser_allotMany, 
  
  specialist_get,
} from '@/services/guide';

export default {
  namespace: 'wxuser',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(wxuser_list, payload);
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
    *get({ payload, callback }, { call, put }) {
      const response = yield call(wxuser_get, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *allotOne({ payload, callback }, { call, put }) {
      const response = yield call(wxuser_allotOne, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *allotMany({ payload, callback }, { call, put }) {
      const response = yield call(wxuser_allotMany, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *getSpecialDetail({ payload, callback }, { call, put }) {// 查看专家详情
      const response = yield call(specialist_get, payload);
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
