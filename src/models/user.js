import { queryCurrent, getCurrent } from "@/services/services";

export default {
  namespace: "currentUser",

  state: {
    list: [],
    currentUser: {}
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      if (
        localStorage.getItem("currentUserObj") &&
        JSON.parse(localStorage.getItem("currentUserObj")) &&
        localStorage.getItem("userId") &&
        localStorage.getItem("userId") ==
          JSON.parse(localStorage.getItem("currentUserObj")).userId &&
        localStorage.getItem("currentUserObj") != "null" &&
        localStorage.getItem("currentUserObj") != "undefined"
      ) {
        yield put({
          type: "saveCurrentUser",
          payload: JSON.parse(localStorage.getItem("currentUserObj"))
        });
      } else {
        const response = yield call(queryCurrent);
        if (response.meta && response.meta.code == 200)
          localStorage.setItem(
            "currentUserObj",
            JSON.stringify(response.data.data) 
          );
        yield put({
          type: "saveCurrentUser",
          payload: response.data.data
        });
      }
    },
    *getCurrentUser(_, { call, put }) {
      // 单点登录
      const response = yield call(getCurrent);
      yield put({
        type: "saveCurrentUser",
        payload: response.data
      });
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {}
      };
    }
  }
};
