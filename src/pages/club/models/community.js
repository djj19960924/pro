import {
  community_list,
  community_add,
  community_del,
  community_get,
  admin_list,
  user_list,
  change_admin,
  community_pass_user,
  community_history
} from "@/services/clubs";

export default {
  namespace: "community",

  state: {
    data: []
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(community_list, payload);
      let data = {};

      console.log(response);

      response &&
        ((data.pagination = {
          total: response.data.total,
          pageSize: payload.size,
          current: payload.page + 1
        }),
        (data.list = response.data.data));
      yield put({
        type: "save",
        payload: data
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(community_add, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(community_del, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(community_get, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *change_admin_post({ payload, callback }, { call, put }) {
      const response = yield call(change_admin, payload);
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    *admin_list_get({ payload, callback }, { call, put }) {
      const response = yield call(admin_list, payload);
      let data = {};

      //console.log("admin list get ")
      //console.log(response);

      response &&
        ((data.pagination = {
          total: response.data.total,
          pageSize: payload.size,
          current: payload.page
        }),
        (data.list = response.data.data));
      yield put({
        type: "none",
      });
      if (callback) callback(response);
    },

    *pass_user({payload,callback},{call,put}){
      const response = yield call(community_pass_user,payload)
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },

    *history({callback},{call,put}){
      const response = yield call(community_history)
      yield put({
        type: "none"
      });
      if (callback) callback(response);
    },
    
    *user_list_get({ payload, callback }, { call, put }) {
      const response = yield call(user_list, payload);
      let data = {};

      //console.log("user list get ")
      //console.log(response);

      response &&
        ((data.pagination = {
          total: response.data.total,
          pageSize: payload.size,
          current: payload.page
        }),
        (data.list = response.data.data));
        yield put({
          type: "save",
          payload: data
        });
      if (callback) callback(response);
    },
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
