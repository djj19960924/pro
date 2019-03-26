import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  Avatar,
  message,
  Divider,
  DatePicker,
  Spin,
  Menu,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import Link from 'umi/link';

import styles from '../../../less/TableList.less';
import myStyles from './index.less';

import { checkData, getPageQuery, getnyr } from '../../../utils/utils';
import { rc } from '../../../global';
let project = [];
project = JSON.parse(localStorage.getItem("allProject"))

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

message.config({ top: 100 });

@connect(({ tice_one_weidu, loading }) => ({
  tice_one_weidu,
  loading: loading.models.tice_one_weidu,
}))
@Form.create()
class tice extends PureComponent {
  state = {
    payload:{
      sex:[],
      ageInterval:[],
      tcType:[],
      grade:[],
      venueId:[],
    },
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    sex:[
      {
        name:'全部',
        value:-1,
        isChoose:true,
      },
      {
        name:'男',
        value:'1',
      },
      {
        name:'女',
        value:'2',
      }
    ],
    ageInterval:[
      {
        name:'全部',
        isChoose:true,
        value:-1,
      },
      {
        name:'20岁以下',
        value:'1',
      },
      {
        name:'20-39岁',
        value:'2',
      },
      {
        name:'40-59岁',
        value:'3',
      },
      {
        name:'60岁以上',
        value:'4',
      }
    ],
    tcType:[],
    grade:[
      {
        name:'全部',
        isChoose:true,
        value:-1,
      },
      {
        name:'较差',
        value:'1,2',
      },
      {
        name:'一般',
        value:'3',
      },
      {
        name:'较好',
        value:'4,5',
      }
    ],
    venueId:[]
  };

  columns = [
    {
      title: '头像',
      render:(val,record) => {
        return record.headImage ? (
          <Avatar src={record.headImage}/>
        ) : (
          <Avatar
            style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
            icon="user"
          />
        );
      }
    },
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: val => <div>{val == 1 ? '男' : val == 2 ? '女' : '--'}</div>,
    },
    {
      title: '出生日期',
      dataIndex: 'bthDate',
      render: val => <div>{val ? val : '--'}</div>,
    },
    // {
    //   title: '人群类别',
    //   dataIndex: 'groupName',
    //   render: val => <div>{val ? val : '--'}</div>,
    // },
    {
      title: '手机号',
      dataIndex: 'tel',
      render: val => <div>{val ? val : '--'}</div>,
    },
    {
      title: '体测项目',
      dataIndex: 'tcTypeName',
      render: val => <div>{val ? val : '--'}</div>,
    },
    {
      title: '体测结果',
      dataIndex: 'score',
      render: val => <div>{val ? val : '--'}</div>,
    },
    {
      title: '体测得分',
      dataIndex: 'grade',
      render: val => <div>{val ? val : '--'}</div>,
    },
    {
      title: '体测时间',
      dataIndex: 'createTime',
      render: val => <div>{val ? val.substring(0,10) : '--'}</div>,
    },
    {
      title: '体测点',
      dataIndex: 'venueName',
      render: val => <div>{val ? val : '--'}</div>,
    },
    {
      title: '设备编号',
      dataIndex: 'deviceNo',
      render: val => <div>{val ? val : '--'}</div>,
    },
  ];

  componentDidMount() {
    let params = {
      pn: this.state.currentPage,
      ps: this.state.pageSize,
    };
    this.getList(params);

    // 体测项目列表
    let allProject = localStorage.getItem('allProject')
    allProject && (allProject = JSON.parse(allProject))
    let ids = []
    allProject.forEach(ele => {
      ids.push(ele.tcType)
      ele.value = ele.tcType
    })
    allProject.unshift({
      name:'全部',
      isChoose:true,
      value:-1
    })
    this.setState({
      tcType:allProject
    })

    // 体测点列表
    let venueId=[]
    this.props.dispatch({
      type: 'tice_device/getallpoint',
      payload: null, // 区域id
      callback: res => {
        if (res.meta.code == 200) {
          let values = []
          res.data.data.forEach(ele => {
            values.push(ele.id)
            venueId.push({
              value:ele.id,
              name:ele.name
            })
          })
          venueId.unshift({
            name:'全部',
            isChoose:true,
            value:-1
          })
          this.setState({
            venueId: venueId,
          });
        }
      },
    });
  }

  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    this.setState({
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    });
    const params = {
      pn: pagination.current,
      ps: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    let payload = this.state.payload;
    payload.pn = pagination.current
    payload.ps = pagination.pageSize

    this.getList(payload || params);
  };

  // list
  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tice_one_weidu/list',
      payload: params
    });
  };

  // 点击选择过滤
  chooseItem = (index,arr,value) => {// index:数组下标 arr:数组名即接口参数字段名 value:所选的值即要传的参数值
    let payload = this.state.payload;
    let itemArr = this.state[arr];
    if(index === 0){// 点击全部
      itemArr.forEach(ele => {
        ele.isChoose = false
      })
      itemArr[0].isChoose = true;
      payload[arr] = []
    }else{
      itemArr[0].isChoose = false;
      itemArr[index].isChoose = !itemArr[index].isChoose;
      // 选中或未选中时，对payload进行更改
      if(itemArr[index].isChoose){// 选中
        payload[arr].push(value)
      }else{// 未选中
        payload[arr].forEach((ele,i) => {
          if(ele == value){
            payload[arr].splice(i,1)
          }
        })
      }
      if(!itemArr[index].isChoose){// 反选全部的前置判断
        let n = 0;
        for(let i=0;i<itemArr.length;i++){
          if(itemArr[i].isChoose){
            n = 1;
            break;
          }
        }
        if(!n){// 反选全部
          itemArr[0].isChoose = true;
          payload[arr] = []
        }
      }
    }
    payload.pn = 1;
    payload.ps = this.state.pageSize;
    let obj = {
      a:arr + index + itemArr[index].isChoose,
      payload:payload
    }
    obj[arr] = itemArr
    this.setState(obj,() => {
      this.getList(payload)
    })
  }

  render() {
    const {
      tice_one_weidu: { data },
      loading,
    } = this.props;
    const { sex , ageInterval , tcType , grade , venueId } = this.state
    let data_d = {
      list:[]
    }
    if(data.data){
      data_d.list = data.data;
      data_d.pagination = data.pagination;
      data_d.pagination.total = data.total;
    }

    if (checkData(data)) {
      return (
        <Card bordered={false}>
          <div className={myStyles.fliterContainer}>
            <div className={myStyles.filterItem}>
              <div className={myStyles.filterTitle}>性别:</div>
              {
                sex.map((ele,index)=> (
                  <div onClick={() => this.chooseItem(index,'sex',ele.value)} className={ele.isChoose ? myStyles.current : ''}>{ele.name}</div>
                ))
              }
            </div>
            <div className={myStyles.filterItem}>
              <div className={myStyles.filterTitle}>年龄:</div>
              {
                ageInterval.map((ele,index)=> (
                  <div onClick={() => this.chooseItem(index,'ageInterval',ele.value)} className={ele.isChoose ? myStyles.current : ''}>{ele.name}</div>
                ))
              }
            </div>
            <div className={myStyles.filterItem}>
              <div className={myStyles.filterTitle}>项目:</div>
              {
                tcType.map((ele,index)=> (
                  <div onClick={() => this.chooseItem(index,'tcType',ele.value)} className={ele.isChoose ? myStyles.current : ''}>{ele.name}</div>
                ))
              }
            </div>
            <div className={myStyles.filterItem}>
              <div className={myStyles.filterTitle}>等级:</div>
              {
                grade.map((ele,index)=> (
                  <div onClick={() => this.chooseItem(index,'grade',ele.value)} className={ele.isChoose ? myStyles.current : ''}>{ele.name}</div>
                ))
              }
            </div>
            <div className={myStyles.filterItem}>
              <div className={myStyles.filterTitle}>站点:</div>
              {
                venueId.map((ele,index)=> (
                  <div onClick={() => this.chooseItem(index,'venueId',ele.value)} className={ele.isChoose ? myStyles.current : ''}>{ele.name}</div>
                ))
              }
            </div>
          </div>
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={[]}
              showRowSelect="none"
              loading={loading}
              data={data_d}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              total={data.total}
            />
          </div>
        </Card>
      );
    } else {
      return (
        <Spin
          style={{ position: 'absolute', top: 140, left: 0, right: 0 }}
          size="large"
          tip="Loading..."
        />
      );
    }
  }
}

export default tice;