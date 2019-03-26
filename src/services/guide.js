import { stringify } from 'qs';
import request from '@/utils/request';
import { cleanParams,getnyr } from '@/utils/utils';
import { requestUrl_kxjs, requestUrl_sport } from '@/global.js';

// 专家服务类别
export async function serviceType_list(params) {
    return request(requestUrl_kxjs + '/service_postion/web/list', {//service改成web
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function serviceType_add(params) {
    return request(requestUrl_kxjs + '/service_postion/web/saveupdate', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function serviceType_del(ids) {
    let formData = new FormData();
    formData.append('service_ids', ids);
    return request(requestUrl_kxjs + '/service_postion/web/delete', {
        method: 'post',
        body: formData
    });
}

// 专家职务头衔
export async function postion_list(params) {
    return request(requestUrl_kxjs + '/service_postion/position/list', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function postion_add(params) {
    return request(requestUrl_kxjs + '/service_postion/position/saveupdate', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function postion_del(ids) {
    let formData = new FormData();
    formData.append('service_ids', ids);
    return request(requestUrl_kxjs + '/service_postion/position/delete', {
        method: 'post',
        body: formData
    });
}

// 专家
export async function specialist_list(params) {
    return request(requestUrl_kxjs + '/expert/list', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function specialist_add(params) {
    // let obj = cleanParams(params),
    //     newParams={
    //         user:{
    //             birthday:obj.birthday,
    //             deptid:obj.deptid,
    //             email:obj.email,
    //             name:obj.name,
    //             phone:obj.phone,
    //             sex:obj.sex,
    //             user_name:obj.phone,
    //             headimg:obj.headimg
    //         },
    //         userInfo:{
    //             persontype:1
    //         }
    //     };
    // for (let key in obj){
    //     if(key != 'birthday' && key != 'deptid' && 
    //     key != 'email' && key != 'name' && 
    //     key != 'phone' && key != 'sex'){
    //         newParams.userInfo[key] = obj[key]
    //     }
    // }
    // if(obj.user_id){
    //     newParams.user.user_id = obj.user_id
    // }
    return request(requestUrl_kxjs + '/expert/saveupdate', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function specialist_del(ids) {
    let formData = new FormData();
    formData.append('ids', ids);
    return request(requestUrl_kxjs + '/expert/delete', {
        method: 'post',
        body: formData
    });
}
export async function specialist_get(id) {
    let formData = new FormData();
    formData.append('id', id);
    return request(requestUrl_kxjs + '/expert/detail', {
        method: 'post',
        body: formData
    });
}

// 微信用户
export async function wxuser_list(params) {
    let formData = new FormData();
    formData.append('ps', params.ps);
    formData.append('pn', params.pn - 1);
    params.a_usname && formData.append('userName', params.a_usname);
    params.a_sex && formData.append('sex', params.a_sex);
    params.a_groupName && formData.append('personClass', params.a_groupName);
    console.log(params)
    return request(requestUrl_kxjs + '/wechat/user/list', { 
        method: 'post',
        body: formData
    });
}
export async function wxuser_get(id) {
    let formData = new FormData();
    formData.append('wechatuserid', 2);
    return request(requestUrl_kxjs + '/wechat/user/detail', {
        method: 'post',
        body: formData
    });
}
export async function wxuser_allotOne(params) {
    let formData = new FormData();
    formData.append('expertid', params.expertid);
    formData.append('wechatuserid', params.wechatuserid);
    return request(requestUrl_kxjs + '/wechat/user/allot/one', {
        method: 'post',
        body: formData
    });
}
export async function wxuser_allotMany(params) {
    let formData = new FormData();
    formData.append('expertids', params.expertids);
    formData.append('teamname', params.teamname);
    formData.append('usids', params.usids);
    return request(requestUrl_kxjs + '/wechat/user/allot/many', {
        method: 'post',
        body: formData
    });
}

// 团队
export async function team_list(params) {// 团队列表
    return request(requestUrl_kxjs + '/expert/team/list', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function team_del(id) { // 删除团队
    let formData = new FormData();
    formData.append('teamid', id);
    return request(requestUrl_kxjs + '/expert/team/delete', {
        method: 'post',
        body: formData
    });
}
export async function team_update(params) { // 修改团队信息、新增团队专家
    let formData = new FormData();
    formData.append('teamid', params.teamid);
    params.teamName && formData.append('teamName', params.teamName);
    params.expertids && formData.append('expertids', params.expertids);
    return request(requestUrl_kxjs + '/expert/team/expert/plus', {
        method: 'post',
        body: formData
    });
}
export async function team_userlist(id) {// 团队用户列表
    let formData = new FormData();
    formData.append('teamid', id);
    return request(requestUrl_kxjs + '/expert/team/weusers', {
        method: 'post',
        body: formData
    });
}
export async function team_adduser(params) {// 新增团队用户
    let formData = new FormData();
    formData.append('teamid', params.teamid);
    formData.append('wechat_usids', params.wechat_usids);
    return request(requestUrl_kxjs + '/expert/team/weusers/plus', {
        method: 'post',
        body: formData
    });
}
export async function team_deluser(params) {// 删除团队用户
    let formData = new FormData();
    formData.append('teamid', params.id);
    formData.append('wechat_usids', params.wechat_usids);
    return request(requestUrl_kxjs + '/expert/team/weusers/delete', {
        method: 'post',
        body: formData
    });
}
export async function team_expertlist(params) {// 团队专家列表
    let formData = new FormData();
    formData.append('teamid', params.teamid);
    return request(requestUrl_kxjs + '/expert/team/expert/list', {
        method: 'post',
        body: formData
    });
}
export async function team_delexpert(params) {// 删除团队专家
    let formData = new FormData();
    formData.append('teamid', params.id);
    formData.append('expertids', params.expertids);
    return request(requestUrl_kxjs + '/expert/team/expert/delete', {
        method: 'post',
        body: formData
    });
}

// 指导记录
export async function expertguidance_list(params) {// 专家指导记录
    return request(requestUrl_kxjs + '/expert/guidance/list', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function expertguidance_detail(id) { // 记录详情
    let formData = new FormData();
    formData.append('wechat_usid', id);
    return request(requestUrl_kxjs + '/expert/guidance/detail', {
        method: 'post',
        body: formData
    });
}
export async function repeat_userList(params) {// 咨询人员列表
    return request(requestUrl_kxjs + '/wechat/user/advice/list', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function personalguidance_list(params) {// 个人指导记录
    console.log(params)
    var obj = {
        "nick_name": params.nick_name || "",
        "personClass": params.personClass || "",
        "responseTime": params.responseTime ? getnyr(params.responseTime) : "",
        "sex": params.sex || "",
        "pn": params.pn - 1,
        "ps": params.ps,
        "specialId":params.specialId
      }
    return request(requestUrl_kxjs + '/expert/querySpecialGuidanceOpenId', {
        method: 'post',
        body: JSON.stringify(obj),
    },'json');
}

// 处方库
export async function lib_type_list() {// type
    let formData = new FormData();
    return request(requestUrl_kxjs + '/expert/prescription/type/list', {
        method: 'post',
        body: formData
    });
}
export async function lib_type_add(params) {// type
    return request(requestUrl_kxjs + '/expert/prescription/type/saveUpdate', {
        method: 'post',
        body: JSON.stringify(cleanParams(params))
    },'json');
}
export async function lib_type_del(ids) {// type
    let formData = new FormData();
    formData.append('ids', ids);
    return request(requestUrl_kxjs + '/expert/prescription/type/delete', {
        method: 'post',
        body: formData
    });
}
export async function lib_target_list(id) {// target
    let formData = new FormData();
    formData.append('reference_id', id);
    return request(requestUrl_kxjs + '/expert/prescription/target/list', {
        method: 'post',
        body: formData
    });
}
export async function lib_target_add(params) {// target
    return request(requestUrl_kxjs + '/expert/prescription/target/saveUpdate', {
        method: 'post',
        body: JSON.stringify(cleanParams(params))
    },'json');
}
export async function lib_target_del(ids) {// target
    let formData = new FormData();
    formData.append('ids', ids);
    return request(requestUrl_kxjs + '/expert/prescription/target/delete', {
        method: 'post',
        body: formData
    });
}
export async function lib_content_list(id) {// content
    let formData = new FormData();
    formData.append('reference_id', id);
    return request(requestUrl_kxjs + '/expert/prescription/content/list', {
        method: 'post',
        body: formData
    });
}
export async function lib_content_add(params) {// content
    return request(requestUrl_kxjs + '/expert/prescription/content/saveUpdate', {
        method: 'post',
        body: JSON.stringify(cleanParams(params))
    },'json');
}
export async function lib_content_del(ids) {// content
    let formData = new FormData();
    formData.append('ids', ids);
    return request(requestUrl_kxjs + '/expert/prescription/content/delete', {
        method: 'post',
        body: formData
    });
}

// 运动目标
export async function sportTarget_list(params) {
    params.pn--
    return request(requestUrl_sport + '/web/sport/list2', {
        method: 'post',
        body: JSON.stringify(cleanParams(params))
    },'json');
}
export async function sportData_list(params) {
    params.pn--
    return request(requestUrl_sport + '/web/sport/data/list2', {
        method: 'post',
        body: JSON.stringify(cleanParams(params))
    },'json');
}
export async function sportData_eat_records(params) {
    let formData = new FormData();
    formData.append('openId', params.openId);
    params.date && formData.append('date', params.date);
    return request(requestUrl_sport + '/web/sport/queryEatRecords', {
        method: 'post',
        body: formData
    });
}
export async function sportData_sport_records(params) {
    let formData = new FormData();
    formData.append('openId', params.openId);
    params.date && formData.append('date', params.date);
    return request(requestUrl_sport + '/web/sport/querySportRecords', {
        method: 'post',
        body: formData
    });
}

// 处方
// export async function getGuidance(id) {
//     return request(requestUrl_sport + '/getGuidance?userId=' + id, {
//         method: 'get',
//     });
// }
export async function getGuidance(id) {
    let formData = new FormData();
    formData.append('tc_report_code', id);
    return request(requestUrl_sport + '/web/sport/querySportReportByTcReportCode', {
        method: 'post',
        body: formData
    });
}