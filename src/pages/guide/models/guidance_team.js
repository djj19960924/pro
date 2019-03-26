import {
  team_list,
  team_del,
  team_userlist,

  specialist_get,
  wxuser_get,
} from '@/services/guide';

export default {
  namespace: 'guidance_team',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(team_list, payload);
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
    *del({ payload, callback }, { call, put }) {
      const response = yield call(team_del, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *getUserList({ payload, callback }, { call, put }) {
      const response = yield call(team_userlist, payload);
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

    
    *getSpecialDetail({ payload, callback }, { call, put }) {// 查看专家详情
      const response = yield call(specialist_get, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *getWxUserDetail({ payload, callback }, { call, put }) {// 查看用户详情
      const response = yield call(wxuser_get, payload);
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
