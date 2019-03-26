import {
  gym_list,
  gym_add,
  gym_update,
  gym_del,
  gym_get,
  type_list
} from '@/services/resource';

export default {
  namespace: 'resource',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(gym_list, payload);
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
      const response = yield call(gym_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(gym_update, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *del({ payload, callback }, { call, put }) {
      const response = yield call(gym_del, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(gym_get, payload);
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
