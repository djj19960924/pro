import { stringify } from 'qs';
import request from '@/utils/request';
import { cleanParams } from '@/utils/utils';
import { requestUrl_analysis } from '@/global.js';

//用户大数据
export async function analysis_userInfo() {
    return request(
        requestUrl_analysis+ '/analysis/queryUserInfoModel', {
            method: "get",
        }
    )
}
//运动大数据
export async function analysis_sports() {
    return request(
        requestUrl_analysis+ '/analysis/querySportInfoModel', {
            method: "get",
        }
    )
}
//用户体测大数据
export async function analysis_tcUserInfo() {
    return request(
        requestUrl_analysis+ '/analysis/queryTcUserInfoModel', {
            method: "get",
        }
    )
}

//社团大数据
export async function analysis_society() {
    return request(
        requestUrl_analysis+ '/analysis/queryMatchInfoModel', {
            method: "get",
        }
    )
}

//体测点大数据
export async function analysis_tcBodyPointInfo() {
    return request(
        requestUrl_analysis+ '/analysis/queryTcBodyPointInfoModel', {
            method: "get",
        }
    )
}
// export async function analysis_tcBodyPointInfo() {
//     return request(
//         'http://192.168.2.165:11010/tc/tc_server/queryTcBodyPointInfoModel', {
//             method: "get",
//         }
//     )
// }

//体测资源大数据
export async function analysis_sportResourcesInfo() {
    return request(
        requestUrl_analysis+ '/analysis/querySportResourcesInfoModel', {
            method: "get",
        }
    )
}
