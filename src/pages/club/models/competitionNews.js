import {
    news_list,
    competition_add,
    admin_list,
    competition_list,
    news_add,
    news_get,
    news_pass,
    news_del
  } from "@/services/clubs";
  
  export default {
    namespace: "competitionNews",
  
    state: {
      data: []
    },
  
    effects: {
      *list({ payload, callback }, { call, put }) {
        const response = yield call(news_list, payload);
        let data = {};

        //console.log('--- 赛事活动新闻')
        //console.log(response);
  
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
        const response = yield call(news_add, payload);
        yield put({
          type: "none"
        });
        if (callback) callback(response);
      },
      *admin_list_get({ payload, callback }, { call, put }) {
        const response = yield call(admin_list, payload);
        let data = {};
  
        //console.log("admin list get ");
        //console.log(response);
  
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
      *competition_list_get({ payload, callback }, { call, put }) {
        const response = yield call(competition_list, payload);
        let data = {};
  
        //console.log("competition list get ");
        //console.log(response);
  
        yield put({
          type: "none"
        });
        if (callback) callback(response);
      },
      *delete({ payload, callback }, { call, put }) {
        const response = yield call(news_del, payload);
        yield put({
          type: "none"
        });
        if (callback) callback(response);
      },
      *pass({ payload, callback }, { call, put }) {
        const response = yield call(news_pass, payload);
        yield put({
          type: "none"
        });
        if (callback) callback(response);
      },
      *get({ payload, callback }, { call, put }) {
        const response = yield call(news_get, payload);
        let data;
        response,
        (data = response.data);
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
  