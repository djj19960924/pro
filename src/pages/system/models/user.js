import {
  user_list,
  user_add,
  user_getById,
  user_del,
  user_resetPwd
} from "@/services/services";

export default {
  namespace: "user",

  state: {
    data: []
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(user_list, payload);
      let res = {
        list: [],
        pagination: {
          total: response.data.total,
          pageSize: payload.ps,
          current: payload.pn
        }
      };
      if (response.meta.code == 200) {
        res.list = response.data.data;
      }
      yield put({
        type: "save",
        payload: res
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(user_add, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *getById({ payload, callback }, { call, put }) {
      const response = yield call(user_getById, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(user_del, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *resetPwd({ payload, callback }, { call, put }) {
      const response = yield call(user_resetPwd, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    }
  }
};
