import {
    wxuser_list,
  } from '@/services/guide';
  
  export default {
    namespace: 'sysWxuser',
  
    state: {
      data: [],
    },
  
    effects: {
      *list({ payload, callback }, { call, put }) {
        const response = yield call(wxuser_list, payload);
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
  