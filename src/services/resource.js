import { stringify } from 'qs';
import request from '@/utils/request';
import { cleanParams } from '@/utils/utils';
import { requestUrl_resource } from '@/global.js';

// 场馆类型
export async function type_list(params) {
    return request(requestUrl_resource + '/gym/type/list', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
} 
export async function type_add(params) {
    let formData = new FormData();
    formData.append('type_name', params.name);
    params.id && formData.append('type_id', params.id);
    return request(requestUrl_resource + '/gym/type/saveUpdate', {
        method: 'post',
        body: formData
    });
}
export async function type_del(ids) {
    let formData = new FormData();
    formData.append('type_ids', ids);
    return request(requestUrl_resource + '/gym/type/delete', {
        method: 'post',
        body: formData
    });
}

// 场馆
export async function gym_list(params) {
    return request(requestUrl_resource + '/gym/list', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
} 
export async function gym_add(params) {
    return request(requestUrl_resource + '/gym/saveUpdate', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function gym_update(params) {
    return request(requestUrl_resource + '/gym/update', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function gym_del(ids) {
    let formData = new FormData();
    formData.append('gym_ids', ids);
    return request(requestUrl_resource + '/gym/delete', {
        method: 'post',
        body: formData
    });
}
export async function gym_get(id) {
    let formData = new FormData();
    formData.append('gym_id', id);
    return request(requestUrl_resource + '/gym/detail', {
        method: 'post',
        body: formData
    });
}
// 教练
export async function coach_add(params) {
    return request(requestUrl_resource + '/gymmaster/saveGymMaster', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function coach_update(params) {
    return request(requestUrl_resource + '/gymmaster/updateGymMaster', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function coach_list(params) {
    return request(requestUrl_resource + '/gymmaster/queryAllListByParam', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function coach_all() {
    return request(requestUrl_resource + '/gymmaster/queryAllList', {
        method: 'get',
    });
}
export async function coach_del(id) {
    let formData = new FormData();
    formData.append('gymMasterId', id);
    return request(requestUrl_resource + '/gymmaster/deleteGymMaster', {
        method: 'post',
        body: formData
    });
}
