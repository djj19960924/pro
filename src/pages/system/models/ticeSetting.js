import {
  ticeSetting_all,
  ticeSetting_saveProjects,
  ticeSetting_saveLevels,
} from '@/services/services';

export default {
  namespace: 'ticeSetting',

  state: {},

  effects: {
    *setting_all({ payload, callback }, { call, put }) {
      const response = yield call(ticeSetting_all, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *saveProjects({ payload, callback }, { call, put }) {
      const response = yield call(ticeSetting_saveProjects, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *saveLevels({ payload, callback }, { call, put }) {
      const response = yield call(ticeSetting_saveLevels, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    // *get({ payload, callback }, { call, put }) {
    //   const response = yield call(systemInfo_get, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response.data,
    //   });
    //   if (callback) callback(response);
    // },
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
