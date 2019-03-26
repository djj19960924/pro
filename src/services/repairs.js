import { stringify } from 'qs';
import request from '@/utils/request';
import { requestUrl_pingtai,requestUrl_repairs } from '@/global.js';

// 区域地址管理
export async function area_add(params) {
    let formData = new FormData();
    formData.append('paramTable', params.paramTable);
    // if(params.param.img_urls){
    //     let arr = params.param.img_urls;
    //     arr.forEach((ele,i) => {
    //         arr[i] = ele.uid + ';' + ele.name + ';' + ele.url
    //     })
    //     params.param.img_urls = arr.join(',')
    // }
    formData.append('param', JSON.stringify(params.param));
    return request(requestUrl_repairs + '/address/saveOrUpdate', {
        method: 'post',
        body: formData,
    });
}
export async function area_del(params) {
    let formData = new FormData();
    formData.append('paramTable', params.paramTable);
    formData.append('paramId', params.paramId);
    return request(requestUrl_repairs + '/address/delete', {
        method: 'post',
        body: formData,
    });
}
export async function area_getById(params) {
    return request(requestUrl_repairs + `/address/search/${params.id}?paramTable=${params.paramTable}`, {
        method: 'get',
    });
}
export async function area_list(params) {
    let formData = new FormData();
    formData.append('page', 1);
    formData.append('size', 500);
    formData.append('paramTable', params.paramTable);
    formData.append('paramId', params.paramId);
    formData.append('organizeId', params.organizeId);
    return request(requestUrl_repairs + '/address/search', {
        method: 'post',
        body: formData,
    });
}
export async function area_list_(params) {
  if (params.fullname) {
    return request(requestUrl_pingtai + '/dept/list?fullName=' + params.fullname + '&id=' + params.id, {
      method: 'get',
    });
  } else {
    return request(requestUrl_pingtai + '/dept/list?id=' + params.id, {
      method: 'get',
    });
  }
}
export async function area_tree() {
    return request("http://www.whtiyu.cn/admin/dept/tree", {
        // return request(requestUrl_pingtai + '/dept/tree', {
    method: 'get',
  });
}

// 健身站点列表管理
export async function getAllPoint(params) {
    var url = requestUrl_repairs + `/address/all/village?organizeId=${params.id}`
    if(params.communityId){
        url = requestUrl_repairs + `/address/all/village?organizeId=${params.id}&communityId=${params.communityId}`
    }
    return request(url, {
        method: 'get',
    });
}
export async function getAllPoint2(params) {
    var url = requestUrl_repairs + `/address/all/village2?organizeId=${params.id}`
    if(params.communityId){
        url = requestUrl_repairs + `/address/all/village2?organizeId=${params.id}&commId=${params.communityId}`
    }
    return request(url, {
        method: 'get',
    });
}
export async function getAllPoint3(params) {
    var url = requestUrl_repairs + `/address/all/village3?organizeId=${params.id}`
    if(params.communityId){
        url = requestUrl_repairs + `/address/all/village3?organizeId=${params.id}&commId=${params.communityId}`
    }
    return request(url, {
        method: 'get',
    });
}

// 设施信息管理
export async function equipmentInfo_list(params) {
    let formData = new FormData();
    formData.append('page', params.page);
    formData.append('size', params.size);
    formData.append('param', JSON.stringify(params.param));// type organizeId
    return request(requestUrl_repairs + '/equipmentInfo/search', {
        method: 'post',
        body: formData,
    });
}
export async function equipmentInfo_add(params) {
    let formData = new FormData();
    formData.append('param', JSON.stringify(params));// name type_0_1_2_4_名称_品牌_类型_厂家 organizeId imageUrl
    return request(requestUrl_repairs + '/equipmentInfo/saveOrUpdate', {
        method: 'post',
        body: formData,
    });
}
export async function equipmentInfo_del(id) {
    return request(requestUrl_repairs + `/equipmentInfo/delete/${id}`, {
        method: 'get',
    });
}
export async function equipmentInfo_get(id) {
    return request(requestUrl_repairs + `/equipmentInfo/search/${id}`, {
        method: 'get',
    });
}

// 设施列表管理
export async function equipment_base(organizeId) {
    return request(requestUrl_repairs + `/equipment/base?organizeId=${organizeId}`, {
        method: 'get',
    });
}
export async function equipment_list(params) {
    let formData = new FormData();
    formData.append('page', params.page);
    formData.append('size', params.size);
    formData.append('param', JSON.stringify(params.param));// villageId organizeId
    return request(requestUrl_repairs + '/equipment/search', {
        method: 'post',
        body: formData,
    });
}
export async function equipment_add(params) {
    console.log(params)
    let formData = new FormData();
    formData.append('param', JSON.stringify(params));// villageId nameId brandId typeId supplierId installTime position organizeId
    return request(requestUrl_repairs + '/equipment/saveOrUpdate', {
        method: 'post',
        body: formData,
    });
}
export async function equipment_del(id) {
    return request(requestUrl_repairs + `/equipment/delete/${id}`, {
        method: 'get',
    });
}
export async function equipment_get(id) {
    return request(requestUrl_repairs + `/equipment/search/${id}`, {
        method: 'get',
    });
}

// 维修工单管理
export async function orders_list(params) {
    console.log(params)
    let formData = new FormData();
    formData.append('page', params.page);
    formData.append('size', params.size);
    formData.append('param', JSON.stringify(params.param));// name organizeId
    return request(requestUrl_repairs + '/orders/search', {
        method: 'post',
        body: formData,
    });
}
export async function orders_del(id) {
    return request(requestUrl_repairs + `/orders/delete/${id}`, {
        method: 'get',
    });
}
export async function orders_tj() {
    return request(requestUrl_repairs + `/orders/queryTopInfo`, {
        method: 'get',
    });
}
export async function orders_add(params) {// 分配 param:{"id":302,"admin":{"id":117}}
    let formData = new FormData();
    formData.append('param', JSON.stringify(params));
    return request(requestUrl_repairs + '/orders/saveOrUpdate', {
        method: 'post',
        body: formData,
    });
}

// 维修人员管理
export async function repairMan_list(params) {
    let formData = new FormData();
    formData.append('page', params.page);
    formData.append('size', params.size);
    formData.append('param', JSON.stringify(params.param));// level_1 organizeId
    return request(requestUrl_repairs + '/manage/list', {
        method: 'post',
        body: formData,
    });
}
export async function repairMan_add(params) {
    let formData = new FormData();
    formData.append('jsonData', JSON.stringify(params));// username nickname password remarks level organizeId status
    return request(requestUrl_repairs + '/manage/addOrUpdate', {
        method: 'post',
        body: formData,
    });
}
export async function repairMan_del(id) {
    return request(requestUrl_repairs + `/manage/delById?id=${id}`, {
        method: 'get',
    });
}