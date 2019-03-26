import {
  sportTarget_list,
  sportData_eat_records,
  sportData_sport_records
} from '@/services/guide';

export default {
  namespace: 'guide_sport_target',

  state: {
    data: [],
  },

  effects: {
    *targetList({ payload, callback }, { call, put }) {// 运动目标
      const response = yield call(sportTarget_list, payload);
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
    *eatRecords({ payload, callback }, { call, put }) {
      const response = yield call(sportData_eat_records, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *sportRecords({ payload, callback }, { call, put }) {
      const response = yield call(sportData_sport_records, payload);
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
