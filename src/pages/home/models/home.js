import {
  analysis_gym,
  analysis_rms,
  analysis_tice,
  analysis_top,
  analysis_guide,
  analysis_club
} from '@/services/home';

export default {
  namespace: 'home',

  state: {
    data: [],
  },

  effects: {
    *analysis_gym({callback},{call,put}){
      const response = yield call(analysis_gym);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *analysis_rms({callback},{call,put}){
      const response = yield call(analysis_rms);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *analysis_tice({callback},{call,put}){
      const response = yield call(analysis_tice);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *analysis_top({callback},{call,put}){
      const response = yield call(analysis_top);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *analysis_guide({payload,callback},{call,put}){
      const response = yield call(analysis_guide,payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *analysis_club({callback},{call,put}){
      const response = yield call(analysis_club);
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
