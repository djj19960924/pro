import {
  news_list,
  news_add,
  news_del,
  news_get,
  type_list,
} from '@/services/news';
import {
  upload, 
} from '@/services/services';

export default {
  namespace: 'news002',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(news_list, payload);
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
      const response = yield call(news_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *del({ payload, callback }, { call, put }) {
      const response = yield call(news_del, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *typeList({ payload, callback }, { call, put }) {
      const response = yield call(type_list, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *upload({ payload, callback }, { call, put }) {
      const response = yield call(upload, payload);
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
