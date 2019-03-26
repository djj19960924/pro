import { stringify } from "qs";
import request from "@/utils/request";
import {
  requestUrl_tice,
  requestUrl_pingtai,
  requestUrl_log,
  requestUrl_complaint,
  requestUrl_upload,
  requestUrl_kxjs
} from "@/global.js";

// allProject
export async function getAllProject() {
  return request(requestUrl_tice + "/v2_project/all", {
    method: "get",
  });
}

// upload
export async function upload(file) {
  let formData = new FormData();
  formData.append("file", file);
  return request(requestUrl_upload + "/upload/start", {
    method: "post",
    body: formData
  });
}

// login
export async function userLogin(params) {
  let formData = new FormData();
  formData.append("userName", params.userName);
  formData.append("password", params.password);
  return request(requestUrl_log + "/login", {
    method: "post",
    body: formData
  });
}
//logout
export async function userLogout(params) {
  return request(requestUrl_log + "/logout", {
    method: "post"
  });
}
// currentUser use token
export async function queryCurrent(params) {
  return request(
    requestUrl_pingtai + "/user/info?userId=" + localStorage.getItem("userId"),
    {
      method: "get"
    }
  );
}
// 单点登录获取用户信息
export async function getCurrent(params) {
  return request(requestUrl_pingtai + "/pb/user/info/auth", {
    method: "get"
  });
}

// select中选项
export async function getallpoint(areaId) {
  let formData = new FormData();
  areaId && formData.append("areaId", areaId);
  return request(requestUrl_tice + "/dev/venue/list", {
    method: "post",
    body: formData
  });
}

// 体测点管理
export async function tice_point_list(params) {
  let formData = new FormData();
  formData.append("pn", params.pn - 1);
  formData.append("ps", params.ps);
  params.venueName && formData.append("venueName", params.venueName);
  params.areaId && formData.append("areaId", params.areaId);
  return request(requestUrl_tice + "/dev/venue/list", {
    method: "post",
    body: formData
  });
}
export async function tice_point_add(params) {
  return request(requestUrl_tice + "/dev/venue/saveUpdate", {
    method: "post",
    body: JSON.stringify(params)
  },"json");
}
export async function tice_point_edit(params) {
  let formData = new FormData();
  formData.append("id", params);
  return request(requestUrl_tice + "/dev/venue/detail/id", {
    method: "post",
    body: formData
  });
}
export async function tice_point_delete(params) {
  let formData = new FormData();
  formData.append("ids", params);
  return request(requestUrl_tice + "/dev/venue/delete", {
    method: "post",
    body: formData
  });
}

// 体测设备管理
export async function tice_device_list(params) {
  let formData = new FormData();
  // formData.append("pn", params.pn - 1);
  // formData.append("ps", params.ps);
  // params.venueid && formData.append("venueid", params.venueid);
  // params.devname && formData.append("devname", params.devname);
  // params.devno && formData.append("devno", params.devno);
  // params.devstatus && formData.append("devstatus", params.devstatus);
  params.currentstatus &&
    formData.append("currentstatus", params.currentstatus);

  let url = requestUrl_tice + `/dev/list?pn=${params.pn - 1}&ps=${params.ps}`
  if(params.venueid){
    url += `&venueid=${params.venueid}`
  }
  if(params.deviceNo){
    url += `&deviceNo=${params.deviceNo}`
  }
  if(params.status){
    url += `&status=${params.status}`
  }
  return request(url, {
    method: "post",
    body: formData
  });
}
export async function tice_device_add(params) {
  let formData = new FormData();
  formData.append("data", JSON.stringify(params));
  console.log(params)
  return request(requestUrl_tice + "/dev/saveUpdate", {
    method: "post",
    body: JSON.stringify(params)
  },"json");
}
export async function tice_device_edit(params) {
  let formData = new FormData();
  formData.append("id", params);
  return request(requestUrl_tice + "/dev/id?id=" + params, {
    method: "get"
  });
}
export async function tice_device_delete(params) {
  let formData = new FormData();
  formData.append("devids", params);
  return request(requestUrl_tice + "/dev/delete", {
    method: "post",
    body: formData
  });
}
export async function tice_device_updatePoint(params) {
  let formData = new FormData();
  return request(requestUrl_tice + "/dev/updateAddress?id=" + params.id + '&venueid=' + params.venueid, {
    method: "post",
    body: formData
  });
}

// 调用记录管理
export async function tice_record_list(params) {
  let formData = new FormData();
  formData.append("pn", params.pn - 1);
  formData.append("ps", params.ps);
  formData.append("deviceId", params.deviceId);
  params.devcuseTime && formData.append("devcuseTime", params.devcuseTime);
  params.venueId && formData.append("venueId", params.venueId);
  return request(requestUrl_tice + "/dev/invoke/list", {
    method: "post",
    body: formData
  });
}
export async function tice_record_delete(params) {
  let formData = new FormData();
  formData.append("devids", params);
  return request(requestUrl_tice + "/dev/delete", {
    method: "post",
    body: formData
  });
}

// 单项体测数据
export async function tice_one_list(params) {
  let obj = {
    pn: params.pn - 1,
    ps: params.ps
  };
  params.groupName && (obj.groupName = params.groupName);
  params.projectNo && (obj.tcType = params.projectNo);
  params.tel && (obj.tel = params.tel);
  params.usname && (obj.name = params.usname);
  params.venueId && (obj.venueId = params.venueId);
  return request(
    requestUrl_tice + "/single/list",
    {
      method: "post",
      body: JSON.stringify(obj)
    },
    "json"
  );
}
export async function tice_one_list_weidu(params) {// 多维度数据分析
  let obj = {
    pn: params.pn - 1,
    ps: params.ps
  };
  params.tcType && (obj.tcType = params.tcType.join());
  params.venueId && (obj.venueId = params.venueId.join());
  params.sex && (obj.sex = params.sex.join());
  params.ageInterval && (obj.ageInterval = params.ageInterval.join());
  params.grade && (obj.grade = params.grade.join());
  return request(
    requestUrl_tice + "/single/list",
    {
      method: "post",
      body: JSON.stringify(obj)
    },
    "json"
  );
}
export async function tice_one_delete(params) {
  let formData = new FormData();
  formData.append("ids", params.ids);
  formData.append("projectId", params.projectId);
  return request(requestUrl_tice + "/single/delete", {
    method: "post",
    body: formData
  });
}

// 11项体测数据
export async function tice_all_list(params) {
  let obj = {
    pn: params.pn - 1,
    ps: params.ps
  };
  params.groupName && (obj.groupName = params.groupName);
  params.level && (obj.level = Number(params.level));
  params.reportTime && (obj.reportTime = params.reportTime);
  params.tel && (obj.tel = params.tel);
  params.usname && (obj.name = params.usname);
  return request(
    requestUrl_tice + "/_11p/list",
    {
      method: "post",
      body: JSON.stringify(obj)
    },
    "json"
  );
}
export async function tice_all_more(params) {
  let obj = {
    pn: params.pn - 1,
    ps: params.ps,
    openId: params.openId
  };
  params.level && (obj.level = params.level);
  params.reportTime && (obj.reportTime = params.reportTime);

  let url = requestUrl_tice + "/_11p/history?pn=" + obj.pn + "&ps=" + obj.ps + "&openId=" + obj.openId;
  if(params.level){
    url += `&level=${params.level}`
  }
  if(params.reportTime){
    url += `&reportTime=${params.reportTime}`
  }
  return request(
    url,
    {
      method: "post",
      body: "{}"
    },
    "json"
  );
}
export async function tice_report(reportId) {
  let formData = new FormData();
  formData.append("reportId", reportId);
  return request(requestUrl_tice + "/_11p/get/report", {
    method: "post",
    body: formData
  });
}
// 体测报告中 新增专家指导
export async function tice_guide(params) {
  return request(
    requestUrl_kxjs + "/expert/addSpecialReport",
    {
      method: "post",
      body: JSON.stringify(params)
    },
    "json"
  );
}
// 体测报告中 查询专家指导
export async function tice_guide_search(params) {
  let formData = new FormData();
  formData.append("tc_reportId", params.tc_reportId);
  formData.append("openId", params.openId);
  return request(
    requestUrl_kxjs + "/expert/querySpecialReport",
    {
      method: "post",
      body: formData
    }
  );
}
// 处方中 新增专家指导
export async function chufang_guide(params) {
  return request(
    requestUrl_kxjs + "/web/sport/addSportSpecialReport",
    {
      method: "post",
      body: JSON.stringify(params)
    },
    "json"
  );
}
// 处方中 查询专家指导
export async function chufang_guide_search(params) {
  let formData = new FormData();
  formData.append("sportReportId", params.sportReportId);
  formData.append("openId", params.openId);
  return request(
    requestUrl_kxjs + "/web/sport/querySportSpecialReport",
    {
      method: "post",
      body: formData
    }
  );
}


// 菜单管理
export async function menu_list() {
  return request(requestUrl_pingtai + "/menu/list", {
    method: "get"
  });
}
export async function menu_del(id) {
  return request(requestUrl_pingtai + "/menu/delById?id=" + id, {
    method: "get"
  });
}
export async function menu_add(params) {
  let formData = new FormData();
  formData.append("jsonData", JSON.stringify(params));
  return request(requestUrl_pingtai + "/menu/addOrUpdate", {
    method: "post",
    body: formData
  });
}

//区域管理
export async function area_list(params) {
  if (params.fullname) {
    return request(
      requestUrl_pingtai +
        "/dept/list?fullName=" +
        params.fullname +
        "&id=" +
        params.id,
      {
        method: "get"
      }
    );
  } else {
    return request(requestUrl_pingtai + "/dept/list?id=" + params.id, {
      method: "get"
    });
  }
}
export async function area_tree(id) {
  return request("http://www.whtiyu.cn/admin/dept/tree", {
    // return request(requestUrl_pingtai + "/dept/tree", {
    method: "get"
  });
}
export async function area_del(id) {
  return request(requestUrl_pingtai + "/dept/del?deptId=" + id, {
    method: "get"
  });
}
export async function area_getById(id) {
  return request(requestUrl_pingtai + "/dept/getDeptId?deptId=" + id, {
    method: "post"
  });
}
export async function area_add(params) {
  let formData = new FormData();
  formData.append("jsonParam", JSON.stringify(params));
  return request(requestUrl_pingtai + "/dept/add", {
    method: "post",
    body: formData
  });
}
export async function area_update(params) {
  let formData = new FormData();
  formData.append("jsonParam", JSON.stringify(params));
  return request(requestUrl_pingtai + "/dept/update", {
    method: "post",
    body: formData
  });
}

// 角色管理
export async function role_list(params) {
  return request(requestUrl_pingtai + "/role/list?roleId=" + params.id, {
    method: "get"
  });
}
export async function role_tree() {
  return request(requestUrl_pingtai + "/role/tree", {
    method: "get"
  });
}
export async function role_del(params) {
  return request(requestUrl_pingtai + "/role/delById?ROLE_ID=" + params.id, {
    method: "get"
  });
}
export async function role_getById(id) {
  return request(requestUrl_pingtai + "/role/get?roleId=" + id, {
    method: "get"
  });
}
export async function role_add(params) {
  let formData = new FormData();
  formData.append("roleName", params.roleName);
  params.remake && formData.append("remake", params.remake);
  formData.append("parentId", params.parentId);
  return request(requestUrl_pingtai + "/role/add", {
    method: "post",
    body: formData
  });
}
export async function role_update(params) {
  let formData = new FormData();
  formData.append("jsonData", JSON.stringify(params));
  return request(requestUrl_pingtai + "/role/edit", {
    method: "post",
    body: formData
  });
}
export async function role_getAuthTree(id) {
  return request(requestUrl_pingtai + "/role/tree/auth?roleId=" + id, {
    method: "get"
  });
}
export async function role_saveAuth(params) {
  let formData = new FormData();
  formData.append("ROLE_ID", params.roleId);
  formData.append("menuIds", params.menuIds);
  return request(requestUrl_pingtai + "/role/auth/save", {
    method: "post",
    body: formData
  });
}

// 用户管理
export async function user_list(params) {
  let formData = new FormData();
  formData.append("pn", params.pn - 1);
  formData.append("ps", params.ps);

  let param = {};
  params.name1 && (param.name = params.name1);
  params.sex && (param.sex = params.sex);
  params.phone1 && (param.phone = params.phone1);
  params.deptid && (param.deptid = params.deptid);
  params.roleId && (param.roleId = params.roleId);

  console.log(param)

  formData.append("param", JSON.stringify(param));
  return request(requestUrl_pingtai + "/user/list", {
    method: "post",
    body: formData
  });
}
export async function user_add(params) {
  // let formData = new FormData();
  // !params.id && formData.append('userName', params.userName); // 修改时不传账号
  // !params.id && formData.append('password', params.password); // 修改时不传密码
  // formData.append('name', params.name);
  // formData.append('sex', params.sex);
  // formData.append('birthday', params.birthday);
  // formData.append('phone', params.phone);
  // formData.append('headimg', params.headimg);
  // formData.append('deptid', params.deptid);
  // formData.append('roleId', params.roleId);
  // params.id && formData.append('userId', params.id); // 修改

  // 修改时
  params.id && (params.userId = params.id);
  params.id && delete params["password"];
  params.id && delete params["userName"];
  params.id && delete params["id"];

  // 加默认头像
  if(params.sex == 1){// 男
    params.headimg = 'man12138.jpeg'
  }else{// 女
    params.headimg = 'women12138.jpeg'
  }
  return request(
    requestUrl_pingtai + "/user/addOrUpdate",
    {
      method: "post",
      body: JSON.stringify(params)
    },
    "json"
  );
}
export async function user_resetPwd(params) {
  let formData = new FormData();
  formData.append("userId", params.userId);
  return request(requestUrl_pingtai + "/user/resetpass", {
    method: "post",
    body: formData
  });
}
export async function user_getById(params) {
  return request(requestUrl_pingtai + "/user/info?userId=" + params.userId, {
    method: "get"
  });
}
export async function user_del(ids) {
  return request(requestUrl_pingtai + "/user/delById?userId=" + ids.join(","), {
    method: "get"
  });
}

// 系统信息维护
export async function systemInfo_set(params) {
  params.id = 1;
  let formData = new FormData();
  formData.append("jsonParam", JSON.stringify(params));
  return request(requestUrl_pingtai + "/system/info/update", {
    method: "post",
    body: formData
  });
}
export async function systemInfo_get() {
  return request(requestUrl_pingtai + "/system/info/info?paramID=1", {
    method: "get"
  });
}

// 体测设置
export async function ticeSetting_all() {
  return request(requestUrl_tice + "/config/stlev/single", {
    method: "post",
    body: "{}"
  },"json");
}
export async function ticeSetting_saveProjects(params) {
  console.log(params)
  return request(
    requestUrl_tice + "/config/testproject/saveUpdate",
    {
      method: "post",
      body: JSON.stringify(params)
    },
    "json"
  );
}
export async function ticeSetting_saveLevels(params) {
  return request(
    requestUrl_tice + "/config/levels/saveUpdate",
    {
      method: "post",
      body: JSON.stringify(params)
    },
    "json"
  );
}

// 投诉
export async function complaint_list(params) {
  return request(
    requestUrl_complaint + "/complain/list",
    {
      method: "post",
      body: JSON.stringify(params)
    },
    "json"
  );
}
export async function complaint_del(ids) {
  let formData = new FormData();
  formData.append("complaint_ids", ids);
  return request(requestUrl_complaint + "/complain/delete", {
    method: "post",
    body: formData
  });
}

export async function complaint_list_top() {
  return request(requestUrl_complaint + "/complain/list_top", {
    method: "get",
  });
}
