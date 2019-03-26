import {
  specialist_list,
  specialist_add, 
  specialist_del,
  specialist_get,

  serviceType_list,
  serviceType_add,
  serviceType_del,

  postion_list,
  postion_add,
  postion_del,
} from '@/services/guide';

export default {
  namespace: 'specialist',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(specialist_list, payload);
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
      const response = yield call(specialist_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *del({ payload, callback }, { call, put }) {
      const response = yield call(specialist_del, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(specialist_get, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },    
    *allType({ payload, callback }, { call, put }) {
      const response = yield call(serviceType_list, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    }, 
    *allPostion({ payload, callback }, { call, put }) {
      const response = yield call(postion_list, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },

    
    *typeList({ payload, callback }, { call, put }) {
      const response = yield call(serviceType_list, payload);
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
    *typeAdd({ payload, callback }, { call, put }) {
      const response = yield call(serviceType_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *typeDel({ payload, callback }, { call, put }) {
      const response = yield call(serviceType_del, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    
    *postionList({ payload, callback }, { call, put }) {
      const response = yield call(postion_list, payload);
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
    *postionAdd({ payload, callback }, { call, put }) {
      const response = yield call(postion_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *postionDel({ payload, callback }, { call, put }) {
      const response = yield call(postion_del, payload);
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
