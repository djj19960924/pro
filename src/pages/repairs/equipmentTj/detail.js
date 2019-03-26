import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Avatar,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Cascader,
  Divider,
  DatePicker,
  Spin,
  Menu,
  TreeSelect,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import UploadImg from '@/components/UploadImg';
import Link from 'umi/link';

import styles from '@/less/TableList.less';

import { checkData, getnyr , getPageQuery } from '@/utils/utils';
import { rc,fileUrl } from '@/global';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ equipment, loading }) => ({
  equipment,
  loading: loading.models.equipment,
}))
@Form.create()
class system extends PureComponent {
  state = {
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    editId: null,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据

    organizeId:63,
  };

  columns = [
    // {
    //   title: '设施图片',
    //   dataIndex: 'imageUrl',
    //   render(val,record) {
    //     return (
    //       record.imageUrl?
    //       <Avatar shape="square" size={40} src={fileUrl+'/'+record.imageUrl}/>:
    //       '--'
    //     )
    //   }
    // },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '厂家',
      dataIndex: 'supplier',
    },
    {
      title: '安装时间',
      dataIndex: 'installTime',
      render(val) {
        return <span>{val?val.substring(0,7):'--'}</span>;
      },
    },
    {
      title: '位置',
      dataIndex: 'position',
    }
  ];

  componentDidMount() {
    let params = {
      page: this.state.currentPage,
      size: this.state.pageSize,
    };
    this.getList(params);

    // base
    const { dispatch } = this.props;
    dispatch({
      type: 'equipment/base',
      payload:this.state.organizeId,
      callback: (res) => {
        this.setState({base:res});
      },
    });
  }

  // 多选
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

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
      page: pagination.current,
      size: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.getList(params);
  };

  // list
  getList = params => {
    let payload = {
      page:params.page,
      size:params.size,
      param:{
        organizeId:this.state.organizeId,
        villageId:getPageQuery().id
      }
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'equipment/list',
      payload: payload,
      callback: res => {
        if (res.code == 200) {
          this.setState({
            currentDataNum: res.data.list.length,
            selectedRows: [],
          });
        }
      },
    });
  };
  

  // 通过id获取base中的name
  getNameFormBase = (id,base) => {
    if(!this.state.base) return;
    const x = this.state.base[base];
    if(!x) return false;
    for(let i=0;i<x.length;i++){
      if(x[i].id === id){
        return x[i].name
      }
    }
  };

  render() {
    const {
      equipment: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    if (checkData(data)) {
      for(let i=0;i<data.list.length;i++){
        data.list[i].name = this.getNameFormBase(data.list[i].nameId,'names');
        data.list[i].brand = this.getNameFormBase(data.list[i].brandId,'brands');
        data.list[i].type = this.getNameFormBase(data.list[i].typeId,'types');
        data.list[i].supplier = this.getNameFormBase(data.list[i].supplierId,'suppliers');
      }
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                total={data.pagination.total}
                
              />
            </div>
          </Card>
        </div>
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

export default system;
