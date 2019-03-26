import { stringify } from 'qs';
import request from '@/utils/request';
import { cleanParams } from '@/utils/utils';
import { requestUrl_home , requestUrl_analysis} from '@/global.js';

// top
export async function analysis_top() {
    return request(
        requestUrl_home+ '/analysis/queryIndexPageTopModel', {
            method: "get",
        }
    )
}

// 体测
export async function analysis_tice() {
    return request(
        requestUrl_home+ '/analysis/queryIndexPageTcModel', {
            method: "get",
        }
    )
}

// 场馆
export async function analysis_gym() {
    return request(
        requestUrl_analysis+ '/analysis/querySportResourcesInfoModel', {
            method: "get",
        }
    )
}

// 排名
export async function analysis_guide(param) {
    return request(
        requestUrl_analysis + '/analysis/queryIndexSpecialGuildAnalysis?chooseDate=' + param, {
            method: "get",
        }
    )
}

// 体育设施
export async function analysis_rms() {
    return request(
        requestUrl_home+ '/analysis/queryIndexPageRmsModel', {
            method: "get",
        }
    )
}

// 社团
export async function analysis_club() {
    return request(
        requestUrl_home+ '/analysis/queryIndexPageMatchModel', {
            method: "get",
        }
    )
}