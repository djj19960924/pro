import {
  repeat_userList,
  expertguidance_detail,
  
  wxuser_get,
} from '@/services/guide';

export default {
  namespace: 'repeat',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(repeat_userList, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *chatList({ payload, callback }, { call, put }) {
      const response = yield call(expertguidance_detail, payload);
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
