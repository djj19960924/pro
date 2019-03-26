import { stringify } from 'qs';
import request from '@/utils/request';
import { cleanParams } from '@/utils/utils';
import { requestUrl_msg } from '@/global.js';

export async function msg_list(params) {
    console.log(params)
    params.pn--
    return request(requestUrl_msg + 'msg/queryAlreadyPublishMessage', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function msg_add(params) {
    return request(requestUrl_msg + 'msg/publishMessage', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}