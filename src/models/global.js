import {
  area_tree,
  role_tree,
  role_getAuthTree,
  getAllProject,
  systemInfo_get
} from '@/services/services';
export default {
  namespace: 'global',

  state: {},

  effects: {
    *areaTree({ payload, callback }, { call, put }) {
      const response = yield call(area_tree, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *roleTree({ payload, callback }, { call, put }) {
      const response = yield call(role_tree, payload); 
      yield put({
        type: 'none',
      });
      if (callback) callback(response); 
    },
    *authTree({ payload, callback }, { call, put }) {
      const response = yield call(role_getAuthTree, payload); 
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *allProject({ payload, callback }, { call, put }) {
      const response = yield call(getAllProject, payload); 
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *getParams({ payload, callback }, { call, put }) {// 平台基础参数
      const response = yield call(systemInfo_get, payload);
      yield put({
        type: 'none',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        collapsed: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
