import {
  area_list,
  area_list_,
  area_add,
  area_getById,
  area_del,
  area_tree
} from '@/services/repairs';

export default {
  namespace: 'repairsArea',

  state: {
    data: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(area_list, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *list_({ payload, callback }, { call, put }) {
      const response = yield call(area_list_, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *treeList({ payload, callback }, { call, put }) {// 展开区域树
      const response = yield call(area_list, payload);
      yield put({
        type: 'none',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *treeList_({ payload, callback }, { call, put }) {// 展开区域树 
      const response = yield call(area_list_, payload);
      yield put({
        type: 'none',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *tree({ payload, callback }, { call, put }) {
      const response = yield call(area_tree, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(area_add, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *getById({ payload, callback }, { call, put }) {
      const response = yield call(area_getById, payload);
      yield put({
        type: 'none',
      });
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(area_del, payload);
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
