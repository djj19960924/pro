import {
  msg_list,
  msg_add
} from '@/services/msg';
import {
  upload,
} from '@/services/services';
import {
  community_list,
  competition_list
} from "@/services/clubs";

export default {
  namespace: 'msg',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {// 消息列表
      const response = yield call(msg_list, payload);
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
    *add({ payload, callback }, { call, put }) {// 添加消息
      const response = yield call(msg_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *upload({ payload, callback }, { call, put }) {// 上传文件
      const response = yield call(upload, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *clubList({ payload, callback }, { call, put }) { // 社团列表
      const response = yield call(community_list, payload);
      yield put({
        type: "none",
      });
      if (callback) callback(response);
    },
    *gameList({ payload, callback }, { call, put }) {// 赛事活动列表
      const response = yield call(competition_list, payload);
      yield put({
        type: "none"
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
