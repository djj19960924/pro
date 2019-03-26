import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

// 检查data是否为空或空对象或空数组
export function checkData(data) {
  if (data === undefined || data === null || data === '') {
    return false;
  } else if (JSON.stringify(data) === '{}') {
    return false;
  } else if (data.length === 0) {
    return false;
  } else {
    return true;
  }
}

// 获取年月日 时分秒
export function getfulltime(date,type) {
  if (!date) return '';
  date = new Date(date);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  
  let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  if (m < 10) m = '0' + m;
  if (d < 10) d = '0' + d;
  let result = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
  if(type == 'hh:mm'){
    result = y + '-' + m + '-' + d + ' ' + h + ':' + min;
  }
  return result;
}
// 获取年月日
export function getnyr(date) {
  if (!date) return '';
  if(typeof date == 'string' && date.indexOf('-') > 0){
    return date.substring(0,10)
  }
  if(typeof date == 'string'){
    date = Number(date)
  }
  date = new Date(date);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  if (m < 10) m = '0' + m;
  if (d < 10) d = '0' + d;
  let result = y + '-' + m + '-' + d;
  return result;
}

// 
export function cleanParams (params) {
  let getnyr = (date) => {
    if (!date) return '';
    date = new Date(date);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    if (m < 10) m = '0' + m;
    if (d < 10) d = '0' + d;
    let result = y + '-' + m + '-' + d;
    return result;
  }
  if(params){
    let newParams = {}
    for (let key in params){
      if(params[key] === 0 || params[key]){
        if(key.indexOf('a_') == 0 && key.length > 2){
          // 时间格式
          if(params[key]._isAMomentObject){
            newParams[key.substring(2)] = getnyr(params[key])
          }else{
            newParams[key.substring(2)] = params[key]
          }
        }else{
          // 时间格式
          if(params[key]._isAMomentObject){
            newParams[key] = getnyr(params[key])
          }else{
            newParams[key] = params[key]
          }
        }
      }
    }
    return newParams
  }else{
    return params
  }
}

// 
export function cutStr(str,num){
  if(!str)
    return <div>--</div>
  let n = num ? num : 6;
  if(str.length > n) {
    return <div title={str}>{str.substring(0,n) + '...'}</div>
  }else{
    return <div>{str}</div>
  }
}

// 区域级联选择中通过最后一级地址id,查出整个级联的地址id数组
export function getFullArea(lastId){
  var list = localStorage.getItem('areaTree');
  list = list ? JSON.parse(list) : []
  for(var i=0;i<list.length;i++){
    var subList = list[i].children
    for(var j=0;j<subList.length;j++){
      if(subList[j].value == lastId){
        return [list[i].value , lastId]
      }
    }
  }
  return []
}