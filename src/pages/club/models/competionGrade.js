import {
    competition_grade_example,
    competition_grade_list
  } from "@/services/clubs";
  
  export default {
    namespace: "competitionGrade",
  
    state: {
      data: []
    },
  
    effects: {
      *grade_list({ payload, callback }, { call, put }) {
        const response = yield call(competition_grade_list, payload);
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
      *grade_example({ payload, callback }, { call, put }) {
        const response = yield call(competition_grade_example, payload);
        yield put({
          type: "none",
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
  