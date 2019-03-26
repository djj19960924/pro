import {
  competition_list,
  competition_add,
  community_list,
  admin_list,
  competition_del,
  competition_get,
  competition_registration_add,
  competition_pass,
  competition_grade_example,
  competition_grade_list
} from "@/services/clubs";

export default {
  namespace: "competition",

  state: {
    data: []
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(competition_list, payload);
      let data = {};
      response &&
        ((data.pagination = {
          total: response.data.total,
          pageSize: payload.size,
          current: payload.page,
        }),
        (data.list = response.data.data));
      yield put({
        type: "save",
        payload: data
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(competition_add, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *pass({ payload, callback }, { call, put }) {
      
      const response = yield call(competition_pass, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *admin_list_get({ payload, callback }, { call, put }) {
      const response = yield call(admin_list, payload);
      let data = {};
      response &&
        ((data.pagination = {
          total: response.data.total,
          pageSize: payload.size,
          current: payload.page
        }),
        (data.list = response.data.data));
      yield put({
        type: "none",
        payload: data
      });
      if (callback) callback(response);
    },
    *match_list_get({ payload, callback }, { call, put }) {
      const response = yield call(community_list, payload);
      let data = {};
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(competition_del, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(competition_get, payload);
      let data;
      response,
        (data = response.data);
      yield put({
        type: "none",
        payload: data
      });
      if (callback) callback(response);
    },
    *add_registration({ payload, callback }, { call, put }) {
      const response = yield call(competition_registration_add, payload);
      //console.log(response);
      yield put({
        type: "none",
      });
      if (callback) callback(response);
    },
    *grade_example({ payload, callback }, { call, put }) {
      const response = yield call(competition_grade_example, payload);
      yield put({
        type: "none",
      });
      if (callback) callback(response);
    },
    *grade_list({ payload, callback }, { call, put }) {
      const response = yield call(competition_grade_list, payload);
      yield put({
        type: "none",
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
