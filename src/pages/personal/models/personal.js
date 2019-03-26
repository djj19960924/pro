import {
  user_update,
  specialist_update,
  getUser,
  changePwd
} from '@/services/personal';

export default {
  namespace: 'personal',

  state: {
    data: [],
  },

  effects: {
    *getUser({ payload, callback }, { call, put }) {
      const response = yield call(getUser, payload);
      if(response.code == 200){
        localStorage.setItem('currentUserObj',JSON.stringify(response.data))
      }
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *changePwd({ payload, callback }, { call, put }) {
      const response = yield call(changePwd, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *user_update({ payload, callback }, { call, put }) {
      const response = yield call(user_update, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *specialist_update({ payload, callback }, { call, put }) {
      console.log('payload:',payload)
      const response = yield call(specialist_update, payload);
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
