import {
    registration_list,
    competition_add,
    registration_user_list,
    competition_user_pass
    // society_del,
    // socieyt_get
  } from "@/services/clubs";
  
  export default {
    namespace: "competitionRegistration",
  
    state: {
      data: []
    },
  
    effects: {
      *list({ payload, callback }, { call, put }) {
        const response = yield call(registration_list, payload);
        let data = {};
        response &&
          ((data.pagination = {
            total: response.data.total,
            pageSize: payload.size,
            current: payload.page
          }),
          (data.list = response.data.data));
        yield put({
          type: "save",
          payload: data
        });
        if (callback) callback(response);
      },
      *add({ payload, callback }, { call, put }) {
        const response = yield call(competition_add, payload);
        yield put({
          type: "none"
        });
        if (callback) callback(response);
      },
      // *delete({ payload, callback }, { call, put }) {
      //   const response = yield call(society_list, payload);
      //   yield put({
      //     type: "none"
      //   });
      //   if (callback) callback(response);
      // },
      // *get({ payload, callback }, { call, put }) {
      //   const response = yield call(socieyt_get, payload);
      //   yield put({
      //     type: "none"
      //   });
      //   if (callback) callback(response);
      // }
      //审核报名赛事的用户
      *user_pass({payload, callback },{call,put}){
        console.log('payload:',payload)
        const response =yield call(competition_user_pass,payload);
        yield put({
          type: "none"
        });
        if (callback) callback(response);
      },

      *list_user({ payload, callback }, { call, put }) {
        const response = yield call(registration_user_list, payload);
        let data = {};
        response &&
          ((data.pagination = {
            total: response.data.total,
            pageSize: payload.size,
            current: payload.page
          }),
          (data.list = response.data.data));
        yield put({
          type: "save",
          payload: data
        });
        if (callback) callback(response);
      }
    },
  
    reducers: {
      save(state, action) {
        return {
          ...state,
          data: action.payload
        };
      }
    }
  };
  