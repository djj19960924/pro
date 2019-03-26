import {
    coach_add,
    coach_update,
    coach_list,
    coach_all,
    coach_del,
    gym_list
  } from '@/services/resource';
  
  export default {
    namespace: 'coach',
  
    state: {
      data: [],
    },
  
    effects: {
      *list({ payload, callback }, { call, put }) {
        const response = yield call(coach_list, payload);
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
      *add({ payload, callback }, { call, put }) {
        const response = yield call(coach_add, payload);
        yield put({
          type: 'none',
        });
        if (callback) callback(response);
      },
      *update({ payload, callback }, { call, put }) {
        const response = yield call(coach_update, payload);
        yield put({
          type: 'none',
        });
        if (callback) callback(response);
      },
      *del({ payload, callback }, { call, put }) {
        const response = yield call(coach_del, payload);
        yield put({
          type: 'none',
        });
        if (callback) callback(response);
      },
      *all({ payload, callback }, { call, put }) {
        const response = yield call(coach_all, payload);
        yield put({
          type: 'none',
        });
        if (callback) callback(response);
      },
      *gymList({ payload, callback }, { call, put }) {
        const response = yield call(gym_list, payload);
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
  