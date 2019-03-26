import { stringify } from 'qs';
import request from '@/utils/request';
import { cleanParams } from '@/utils/utils';
import { requestUrl_pingtai,requestUrl_kxjs } from '@/global.js';

// 获取当前用户
export async function getUser(userId) {
    return request(requestUrl_pingtai + '/user/info?userId=' + userId, {
      method: 'get',
    });
}

// 管理员
export async function user_update(params) {
    params = cleanParams(params)
    console.log(params)
    let formData = new FormData();
    params.name && formData.append('name', params.name);
    params.sex && formData.append('sex', params.sex);
    params.birthday && formData.append('birthday', params.birthday);
    params.phone && formData.append('phone', params.phone);
    params.headimg && formData.append('headimg', params.headimg);
    // formData.append('deptid', params.deptid);
    // formData.append('roleId', params.roleId);
    formData.append('userId', params.userId); // 修改

    return request(requestUrl_pingtai + '/user/addOrUpdate', {
      method: 'post',
      body: JSON.stringify(params),
    },'json');
  }

  // 专家
  export async function specialist_update(params) {
    let obj = cleanParams(params),
        newParams={
            user:{
                birthday:obj.birthday,
                deptid:obj.deptid,
                email:obj.email,
                name:obj.name,
                phone:obj.phone,
                sex:obj.sex,
                user_name:obj.phone,
                headimg:obj.headimg
            },
            userInfo:{
                persontype:1
            }
        };
    for (let key in obj){
        if(key != 'birthday' && key != 'deptid' && 
        key != 'email' && key != 'name' && 
        key != 'phone' && key != 'sex'){
            newParams.userInfo[key] = obj[key]
        }
    }
    if(obj.user_id){
        newParams.user.user_id = obj.user_id
    }
    return request(requestUrl_kxjs + '/expert/saveupdate', {
        method: 'post',
        body: JSON.stringify(newParams),
    },'json');
}

  // 修改密码
  export async function changePwd(params) {
    let formData = new FormData();
    formData.append('userId', params.userId);
    formData.append('oldPwd', params.oldPassword);
    formData.append('newPwd', params.newPassword);
    return request(requestUrl_pingtai + '/user/modify', {
      method: 'post',
      body: formData
    });
}