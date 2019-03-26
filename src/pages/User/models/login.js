import { routerRedux } from "dva/router";
import { userLogin, userLogout ,systemInfo_get} from "@/services/services";
import { setAuthority } from "@/utils/authority";
import { reloadAuthorized } from "@/utils/Authorized";
import cookie from "react-cookies";
import { rc } from "@/global";

export default {
  namespace: "login",

  state: {},

  effects: {
    *login({ payload, callback }, { call, put }) {
      const response = yield call(userLogin, payload);
      yield put({
        type: "changeLoginStatus",
        payload: {
          currentAuthority: response.data.data
            ? response.data.data.roleId
            : "guest"
        }
      });
      if (callback) callback(response);
      // Login successfully
      if (response.meta.code == 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("identityId", response.data.data.identityId);
        localStorage.setItem("isPingtai", false);
        localStorage.setItem("userId", response.data.data.userId);
        localStorage.setItem("roleId", response.data.data.roleId);
        reloadAuthorized();
        yield put(routerRedux.push(rc));
      }
    },

    *logout(_, { call, put }) {
      // yield put(routerRedux.push("/"));
      // const response = yield call(userLogout);
      // yield put({
      //   type: "changeLoginStatus",
      //   payload: {
      //     currentAuthority: "guest"
      //   }
      // });
      // if(response.code == 200){

      localStorage.removeItem("token");
      localStorage.removeItem("identityId");
      localStorage.removeItem("currentUserObj");
      localStorage.removeItem("userId");
      localStorage.removeItem("roleId");
      localStorage.removeItem("auth");
      reloadAuthorized();

      // console.log(location);
      
      location.href = location.origin;
      // }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state
      };
    }
  }
};
