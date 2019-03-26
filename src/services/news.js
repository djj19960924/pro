import { stringify } from 'qs';
import request from '@/utils/request';
import { cleanParams } from '@/utils/utils';
import { requestUrl_news } from '@/global.js';

// 新闻类型
export async function type_list(params) {
    return request(requestUrl_news + '/news/type/list', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
} 
export async function type_add(params) {
    return request(requestUrl_news + '/news/type/saveupdate', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function type_del(ids) {
    let formData = new FormData();
    formData.append('news_type_ids', ids);
    return request(requestUrl_news + '/news/type/delete', {
        method: 'post',
        body: formData
    });
}

// 新闻
export async function news_list(params) {
    return request(requestUrl_news + '/news/list', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function news_add(params) {
    console.log(params)
    return request(requestUrl_news + '/news/saveupdate', {
        method: 'post',
        body: JSON.stringify(cleanParams(params)),
    },'json');
}
export async function news_del(ids) {
    let formData = new FormData();
    formData.append('news_ids', ids);
    return request(requestUrl_news + '/news/delete', {
        method: 'post',
        body: formData
    });
}
