import {
  sportData_list,
} from '@/services/guide';

export default {
  namespace: 'guide_sport',

  state: {
    data: [],
  },

  effects: {
    *dataList({ payload, callback }, { call, put }) {// 运动数据
      const response = yield call(sportData_list, payload);
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
    }
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
