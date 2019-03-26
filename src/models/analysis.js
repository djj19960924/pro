import {getAllPoint} from '@/services/repairs';
import {
  analysis_society,
  analysis_userInfo,
  analysis_sports,
  analysis_sportResourcesInfo,
  analysis_tcBodyPointInfo,
  analysis_tcUserInfo
} from '@/services/analysis'

export default {
  namespace: 'analysis',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(getAllPoint, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback(response);
    },

    //获取用户图表
    *queryUserInfoModel({callback},{call,put}){
      const response = yield call(analysis_userInfo);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },

    //获取运动数据图表
    *querySportInfoModel({callback},{call,put}){
      const response = yield call(analysis_sports);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },

    //获取体测数据图表
    *queryTcUserInfoModel({callback},{call,put}){
      const response = yield call(analysis_tcUserInfo);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    
    //获取赛事社团数据图表
    *queryMatchInfoModel({callback},{call,put}){
      const response = yield call(analysis_society);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },

    //获取体测点数据图表
    *queryTcBodyPointInfoModel({callback},{call,put}){
      const response = yield call(analysis_tcBodyPointInfo);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },

    //获取体测资源数据图表
    *querySportResourcesInfoModel({callback},{call,put}){
      const response = yield call(analysis_sportResourcesInfo);
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
