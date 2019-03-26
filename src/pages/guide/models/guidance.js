import {
  expertguidance_list,// 专家指导记录
  expertguidance_detail,
  personalguidance_list,// 个人指导记录

  specialist_get,
  wxuser_get,

  getGuidance,
} from '@/services/guide';
import { tice_report } from '@/services/services';

export default {
  namespace: 'guidance',

  state: {
    data: [],
  },

  effects: {
    *specialist_list({ payload, callback }, { call, put }) {
      const response = yield call(expertguidance_list, payload);
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
    *personalguidance_list({ payload, callback }, { call, put }) {
      const response = yield call(personalguidance_list, payload);
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
    *specialist_detail({ payload, callback }, { call, put }) {
      const response = yield call(expertguidance_detail, payload);
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
    
    *getGuidance({ payload, callback }, { call, put }) {// 获取处方报告
      const response = yield call(getGuidance, payload);
      yield put({ 
        type: 'none',
      });
      if (callback) callback(response);
    },
    *getReport({ payload, callback }, { call, put }) {// 查看体测报告
      const response = yield call(tice_report, payload);
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
