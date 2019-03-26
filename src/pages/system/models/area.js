import {
  area_list,
  area_add,
  area_update,
  area_getById,
  area_del,
  area_tree
} from "@/services/services";

export default {
  namespace: "area",

  state: {
    data: []
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(area_list, payload);
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
      const response = yield call(area_tree, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(area_add, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(area_update, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *getById({ payload, callback }, { call, put }) {
      const response = yield call(area_getById, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(area_del, payload);
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
