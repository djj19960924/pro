import {
  okCount,// 每日合格人数
  tcAgeRatio,// 用户年龄阶段比例
  tcCount,// top
  tcSex,// 不同各阶段性别比例
  bmi_level,//bmi
  project_avg,//雷达
} from '@/services/tcCharts';
import {
  tice_point_list
} from '@/services/services';
export default {
  namespace: 'tice_charts',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *okCount({ payload, callback }, { call, put }) {
      const response = yield call(okCount, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *bmi_level({ payload, callback }, { call, put }) {
      const response = yield call(bmi_level, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *project_avg({ payload, callback }, { call, put }) {
      const response = yield call(project_avg, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *tcAgeRatio({ payload, callback }, { call, put }) {
      const response = yield call(tcAgeRatio, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *tcCount({ payload, callback }, { call, put }) {
      const response = yield call(tcCount, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *tcSex({ payload, callback }, { call, put }) {
      const response = yield call(tcSex, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *tice_point_list({ payload, callback }, { call, put }) {
      const response = yield call(tice_point_list, {ps:100,pn:1});
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
