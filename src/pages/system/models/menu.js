import { menu_list, menu_add, menu_edit, menu_del } from "@/services/services";

export default {
  namespace: "menu",

  state: {
    data: []
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(menu_list, payload);
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
    *add({ payload, callback }, { call, put }) {
      const response = yield call(menu_add, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    // *edit({ payload, callback }, { call, put }) {
    //   const response = yield call(tice_point_edit, payload);
    //   yield put({
    //     type: 'none',
    //   });
    //   if (callback) callback(response);
    // },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(menu_del, payload);
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
