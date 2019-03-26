import { tice_all_list, tice_all_more, tice_report, ticeSetting_all, tice_guide ,tice_guide_search,chufang_guide,chufang_guide_search} from '@/services/services';

export default {
  namespace: 'guide_tice_all',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(tice_all_list, payload);
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
    *moreList({ payload, callback }, { call, put }) {
      const response = yield call(tice_all_more, payload);
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
    *getReport({ payload, callback }, { call, put }) {
      const response = yield call(tice_report, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *getTiceSetting({ payload, callback }, { call, put }) {
      const response = yield call(ticeSetting_all, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    // 体测指导
    *tice_guide({ payload, callback }, { call, put }) {
      const response = yield call(tice_guide, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    // 查询体测指导
    *tice_guide_search({ payload, callback }, { call, put }) {
      const response = yield call(tice_guide_search, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    // 处方指导
    *chufang_guide({ payload, callback }, { call, put }) {
      const response = yield call(chufang_guide, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    // 查询处方指导
    *chufang_guide_search({ payload, callback }, { call, put }) {
      const response = yield call(chufang_guide_search, payload);
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
