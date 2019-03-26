import { stringify } from 'qs';
import request from '@/utils/request';
import { cleanParams } from '@/utils/utils';
import { requestUrl_tice } from '@/global.js';

// 每日合格人数
export async function okCount() {
    return request(
        requestUrl_tice + '/analysis/okCount', {
            method: "get",
        }
    )
}
// 用户年龄阶段比例
export async function tcAgeRatio() {
    return request(
        requestUrl_tice + '/analysis/tcAgeRatio', {
            method: "get",
        }
    )
}
// top
export async function tcCount() {
    return request(
        requestUrl_tice + '/analysis/tcCount', {
            method: "get",
        }
    )
}
// 不同各阶段性别比例
export async function tcSex() {
    return request(
        requestUrl_tice + '/analysis/tcSex', {
            method: "get",
        }
    )
}
// bmi
export async function bmi_level() {
    return request(
        requestUrl_tice + '/analysis/bmi_level', {
            method: "get",
        }
    )
}

// 雷达
export async function project_avg() {
    return request(
        requestUrl_tice + '/analysis/project_avg', {
            method: "get",
        }
    )
}
