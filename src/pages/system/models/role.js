import {
  role_list,
  role_add,
  role_update,
  role_getById,
  role_del,
  role_tree,
  role_getAuthTree,
  role_saveAuth,
} from "@/services/services";

export default {
  namespace: "role",

  state: {
    data: []
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(role_list, payload);
      let res = [];
      if (JSON.stringify(response.data) != "{}") {
        res = response.data.data;
      }
      yield put({
        type: "save",
        payload: res
      });
      if (callback) callback(response);
    },
    *tree({ payload, callback }, { call, put }) {
      const response = yield call(role_tree, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(role_add, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(role_update, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *getById({ payload, callback }, { call, put }) {
      const response = yield call(role_getById, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(role_del, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *getAuthTree({ payload, callback }, { call, put }) {
      const response = yield call(role_getAuthTree, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *saveAuth({ payload, callback }, { call, put }) {
      const response = yield call(role_saveAuth, payload);
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
