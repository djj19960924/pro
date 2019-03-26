import {
  team_list,
  team_del,
  team_update,
  team_userlist,
  team_adduser,
  team_deluser,
  team_expertlist,
  team_delexpert,

  wxuser_list,
  specialist_list,
  
  specialist_get,
  wxuser_get,
} from '@/services/guide';

export default {
  namespace: 'team',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {// 团队列表
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
    *get({ payload, callback }, { call, put }) {// 团队详情 传id
      const response = yield call(team_list, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {// 团队更新
      const response = yield call(team_update, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *del({ payload, callback }, { call, put }) { // 团队删除
      const response = yield call(team_del, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *getUserList({ payload, callback }, { call, put }) {// 团队下用户列表
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
    *addUser({ payload, callback }, { call, put }) { // 团队下添加用户
      const response = yield call(team_adduser, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *delUser({ payload, callback }, { call, put }) {// 团队下移出用户
      const response = yield call(team_deluser, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *searchUserList({ payload, callback }, { call, put }) {// 微信用户模糊查询
      const response = yield call(wxuser_list, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *getExpertList({ payload, callback }, { call, put }) {// 团队下专家列表
      const response = yield call(team_expertlist, payload);
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
    *delExpert({ payload, callback }, { call, put }) {// 团队下移出专家
      const response = yield call(team_delexpert, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *searchExpertList({ payload, callback }, { call, put }) {// 专家模糊查询
      const response = yield call(specialist_list, payload);
      yield put({
        type: 'none',
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
