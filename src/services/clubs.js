import { stringify } from "qs";
import request from "@/utils/request_match";
import {
  requestUrl_luo,
  requestUrl_pingtai,
  requestUrl_repairs
} from "@/global.js";

// 管理员
export async function admin_list(params) {
  return request(
    requestUrl_luo +
      "/match/admin/get_all?page=" +
      params.page +
      "&size=10000" +
      "&key=" +
      params.key,
    {
      method: "get"
    }
  );
}

// 小程序用户 社团成员
export async function user_list(params) {
  let url = requestUrl_luo +
  "/match/event/get_all_user?page=" +
  params.page +
  "&size=" +
  params.size +
  "&match_id=" +
  params.matchId;
  if (undefined == params.infoName) {
      url = url + "&username="
  } else {
    url = url + "&username=" + params.infoName
  }
  if (undefined == params.infoContactInfo) {
    url = url + "&phone="
  } else {
    url = url + "&phone=" + params.infoContactInfo
  }
  return request(url,
    {
      method: "get"
    }
  );
}

// 社团
export async function community_list(params) {
  if (undefined == params.param || JSON.stringify(params.param) == "{}") {
    return request(
      requestUrl_luo +
        "/match/event/get_all?page=" +
        params.page +
        "&size=" +
        params.size +
        "&eventName=" +
        "&matchType=&contactInfo=&adminName=",
      {
        method: "get"
      }
    );
  } else {
    //console.log(params.param.matchType);

    let paramUrl =
      "/match/event/get_all?page=" + params.page + "&size=" + params.size;
    if (undefined != params.param.eventName) {
      paramUrl = paramUrl + "&eventName=" + params.param.eventName;
    }
    if (undefined != params.param.contactInfo) {
      paramUrl = paramUrl + "&contactInfo=" + params.param.contactInfo;
    }
    if (undefined != params.param.matchType) {
      paramUrl = paramUrl + "&matchType=" + params.param.matchType;
    }
    if (undefined != params.param.adminName) {
      paramUrl = paramUrl + "&adminName=" + params.param.adminName;
    }
    return request(requestUrl_luo + paramUrl, {
      method: "get"
    });
  }
}

export async function community_add(params) {
  return request(
    requestUrl_luo + "/match/event/create_match",
    {
      method: "post",
      body: JSON.stringify(params)
    },
    "json"
  );
}
// 批量删除社团
export async function community_del(params) {
  return request(
    requestUrl_luo + `/match/event/del_match`,
    {
      method: "post",
      body: JSON.stringify(params)
    },
    "json"
  );
}

//社团审核成员
export async function community_pass_user(params){
  console.log('params:',params)
  return request(
    requestUrl_luo + `/match/event/pass_user?societyId=`+params.societyId+"&passed="+params.passed,
    {
      method: "post",
    }
  )
}

// 社团修改管理员
export async function change_admin(params) {
  let formData = new FormData();
  formData.append("matchId", params.matchId);
  formData.append("adminId", params.adminId);
  formData.append("contactInfo", params.contactInfo);
  return request(
    requestUrl_luo +
      "/match/event/change_admin?matchId=" +
      params.matchId +
      "&adminId=" +
      params.adminId +
      "&contactInfo=" +
      params.contactInfo,
    {
      method: "post"
    }
  );
}


export async function competition_get(params) {
  return request(requestUrl_luo + `/match/competition/detail?competition_id=`
   + params.id , {
    method: "get"
  });
}

// 赛事
export async function competition_list(params) {
  if (undefined == params.param || JSON.stringify(params.param) == "{}") {
    return request(
      requestUrl_luo +
        "/match/competition/get_all?page=" +
        params.page +
        "&size=" +
        params.size+
        "&matchEventId=" +
        (params.matchEventId||"")+
        "&competitionName=" +
        "&competitionType="+(params.competitionType||'')+"&organizer=&adminName=&startTime=",
      {
        method: "get"
      }
    );
  } else {
    // console.log("--- 赛事 查询 ");

    let paramUrl =
      "/match/competition/get_all?page=" + params.page + "&size=" + params.size;
    if (undefined != params.param.infoName) {
      paramUrl = paramUrl + "&competitionName=" + params.param.infoName;
    }
    if (undefined != params.param.infoOrganizer) {
      paramUrl = paramUrl + "&organizer=" + params.param.infoOrganizer;
    }
    if (undefined != params.param.infoType) {
      paramUrl = paramUrl + "&competitionType=" + params.param.infoType;
    }
    if (undefined != params.param.infoAdminName) {
      paramUrl = paramUrl + "&adminName=" + params.param.infoAdminName;
    }
    if (undefined != params.param.infoTime) {
      paramUrl = paramUrl + "&startTime=" + params.param.infoTime;
    }
    return request(requestUrl_luo + paramUrl, {
      method: "get"
    });
  }
}
// 新增赛事
export async function competition_add(params) {
  return request(
    requestUrl_luo + "/match/competition/release_competition",
    {
      method: "post",
      body: JSON.stringify(params)
    },
    "json"
  );
}
// 赛事审核
export async function competition_pass(payload) {
  var competitionId = payload.competitionId;
  var passed = payload.passed
  return request(
    requestUrl_luo + "/match/competition/pass?competitionId="
    + competitionId+"&passed="+passed,
    {
      method: "post",
    }
  );
}

//审核报名赛事的用户
export async function competition_user_pass(payload){
  var registration_id = payload.registration_id;
  var passed = payload.passed
  return request(
    requestUrl_luo +"/match/registration/passed?registration_id="
    + registration_id+"&passed="+passed,
    {
      method:"post"
    }
  )
}

export async function competition_grade_example(payload){
  return request(
    requestUrl_luo +"/grade/example?competitionId="+payload,
    {
      method:"get"
    }
  )
}

//历史赛事活动统计
export async function community_history(){
  return request(
    requestUrl_luo + "/analysis/top",
    {
      method:"get"
    }
  )
}

export async function competition_grade_list(payload){
  console.log('payload1:',payload)
  return request(
    requestUrl_luo +"/grade/list?competitionId="+payload,
    {
      method:"get"
    }
  )
}


// 添加新闻报名
export async function competition_registration_add(params) {
  return request(
    requestUrl_luo + "/match/competition/add_registration",
    {
      method: "post",
      body: JSON.stringify(params)
    },
    "json"
  );
}
// 批量删除赛事
export async function competition_del(params) {
  console.log('=== param ')
  console.log(params)
  return request(
    requestUrl_luo + `/match/competition/del`,
    {
      method: "post",
      body: JSON.stringify(params)
    },
    "json"
  );
}

// 新闻
export async function news_list(params) {
  //console.log("--- news list params ");

  if (undefined == params.param || JSON.stringify(params.param) == "{}") {
    return request(
      requestUrl_luo +
        "/match/news/get_all?page=" +
        params.page +
        "&size=" +
        params.size +
        "&queryType=3" +
        "&key=&adminName=&title=&newsType=&content=",
      {
        method: "get"
      }
    );
  } else {
    //console.log("--- 赛事 查询 ");

    let paramUrl =
      "/match/news/get_all?page=" + params.page + "&size=" + params.size;
    paramUrl = paramUrl + "&queryType=1&key=&newsType="
    if (undefined != params.param.infoName) {
      paramUrl = paramUrl + "&title=" + params.param.infoName;
    } else {
      paramUrl = paramUrl + "&title=";
    }
    if (undefined != params.param.infoContent) {
      paramUrl = paramUrl + "&content=" + params.param.infoContent;
    } else {
      paramUrl = paramUrl + "&content=";
    }
    if (undefined != params.param.infoAdminId) {
      paramUrl = paramUrl + "&adminName=" + params.param.infoAdminId;
    } else {
      paramUrl = paramUrl + "&adminName=";
    }
    return request(requestUrl_luo + paramUrl, {
      method: "get"
    });
  }
}
// 新增新闻
export async function news_add(params) {
  return request(
    requestUrl_luo + "/match/news/add",
    {
      method: "post",
      body: JSON.stringify(params)
    },
    "json"
  );
}
// 新闻详情 
export async function news_get(params) {
  return request(
    requestUrl_luo + "/match/news/detail?news_id=" 
      + params.news_id,
    {
      method: "get"
    }
  );
}
// 新闻审核
export async function news_pass(params) {
  //console.log(params)
  return request(
    requestUrl_luo + "/match/news/pass?news_id="
      + params.news_id,
    {
      method: "post",
    }
  );
}
// 删除新闻
export async function news_del(params) {
  //console.log(params)
  return request(
    requestUrl_luo + "/match/news/del",
    {
      method: "post",
      body: JSON.stringify(params)
    },
    'json'
  );
}



// 报名信息
export async function registration_list(params) {
  //console.log("--- news list params ");
  //console.log(params);
 
  let url =  requestUrl_luo +
  "/match/registration/get_all?page=" +
  params.page +
  "&size=" +
  params.size; 
  if (undefined != params.competition_name) {
    url = url + "&competitionName=" + params.competition_name;
  } else {
    url = url + "&competitionName=";
  }
  return request(
    url, {
      method: "get"
    }
  );
}

export async function registration_user_list(params) {

  let url =  requestUrl_luo +
  "/match/registration/get_all_user?page=" +
  params.page +
  "&size=" +
  params.size +
  "&competition_id=" +
  params.competition_id;

  if (undefined == params.name) {
    url = url + "&name="
  } else {
    url = url + '&name=' + params.name; 
  }

  return request(url,
    {
      method: "get"
    }
  );
}
