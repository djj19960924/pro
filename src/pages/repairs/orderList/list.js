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
  Divider,
  Badge,
  DatePicker,
  Spin,
  Menu,
  TreeSelect,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import UploadImg from '@/components/UploadImg';
import FourCards from '@/components/FourCards';
import Link from 'umi/link';

import styles from '@/less/TableList.less';

import { checkData, getnyr,cutStr } from '@/utils/utils';
import { rc,fileUrl } from '@/global';
import a1 from './images/1.png'
import a2 from './images/2.png'
import a3 from './images/3.png'
import a4 from './images/4.png'

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
message.config({ top: 100 });

// 对话框
let form_modal = null;
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    confirmLoading,
    persons
  } = props;
  form_modal = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="分配维修人员"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分配维修人员">
        {form.getFieldDecorator('adminId', {
          rules: [{ required: true, message: '清选择'}],
        })(
          <Select style={{ width: '100%' }} placeholder='请分配维修人员'>
          {
            persons.map(ele => (
              <Option key={ele.id}>{`${ele.nickname} (${ele.username})`}</Option>
            ))
          }
          </Select>
          )}
      </FormItem>
    </Modal>
  );
});

// 是否超时
const isTimeout = function(date1) {
  var date2 = new Date();
  date2 = getnyr(date2)

  console.log(date1)
  console.log(date2)

  var year1 =  date1.substr(0,4);
  var year2 =  date2.substr(0,4); 

  var month1 = date1.substr(5,2);
  var month2 = date2.substr(5,2);
  
  var day1 = date1.substr(8,2);
  var day2 = date2.substr(8,2);
  
  var temp1 = year1+"/"+month1+"/"+day1;
  var temp2 = year2+"/"+month2+"/"+day2;
  
  var dateaa= new Date(temp1); 
  var datebb = new Date(temp2); 
  var date = datebb.getTime() - dateaa.getTime(); 
  var time = Math.floor(date / (1000 * 60 * 60 * 24));
  return time + 1
}

@connect(({ orders, loading }) => ({
  orders,
  loading: loading.models.orders,
}))
@Form.create()
class system extends PureComponent {
  state = {
    modalVisible: false,
    confirmLoading: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    editId: null,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据

    organizeId:63,
    persons:[],
    tjData:[
      {
        icon:a1,
        key:'今日报修数量',
        value:0
      },
      {
        icon:a2,
        key:'今日维修数量',
        value:0
      },
      {
        icon:a3,
        key:'待维修总数量',
        value:0
      },
      {
        icon:a4,
        key:'已维修总数量',
        value:0
      },
    ]
  };

  columns = [
    {
      title: '工单号',
      dataIndex: 'name',
    },
    {
      title: '损坏图片',
      dataIndex: 'images',
      render(val){
        return (
          val && val.length>0 ?
          <Avatar shape="square" size={40} src={fileUrl+'/'+val[0]}/>:
          '--'
        )
      }
    },
    {
      title: '位置',
      dataIndex: 'position',
      render(val){
        return <div>{cutStr(val,12)}</div>
      }
    },
    {
      title: '问题描述',
      dataIndex: 'content',
      render(val){
        return <div>{cutStr(val,12)}</div>
      }
    },
    {
      title: '语音描述',
      dataIndex: 'voiceFile',
      render(val){
        return (
          val ? <a target='_blank' href={fileUrl + '/' + val} download>播放</a> : <div>无</div>
        )
      }
    },
    {
      title: '报修时间',
      dataIndex: 'createTime',
      render(val){
        return <div>{val?val.substring(0,10):'--'}</div>
      }
    },
    {
      title: '分配时间',
      dataIndex: 'updateTime',
      render(val,record){
        return <div>{record.admin?val.substring(0,10):'--'}</div>
      }
    },
    {
      title: '维修状态',
      dataIndex: 'type',
      render(val) {
        return <span>{val==0?<Badge status='error' text='待维修'/>:val==1?<Badge status='warning' text='维修中'/>:<Badge status='success' text='已维修'/>}</span>;
      },
    },
    {
      title: '维修人',
      dataIndex: 'admin',
      render(val) {
        return <span>{(val&&val.nickname)?val.nickname:'--'}</span>;
      },
    },
    {
      title: '超时预警(7天)',
      render(val,record){
        return record.type == 2 ?
        <div>维修完成</div>
        :
        <div>
          {
            isTimeout(record.createTime.substring(0,10)) > 30 ?
            <div><span style={{color:'#B70008'}}>严重超时</span> (<span>{isTimeout(record.createTime.substring(0,10))}天</span>)</div>:
            isTimeout(record.createTime.substring(0,10)) > 7 ?
            <div><span style={{color:'#FF401C'}}>已超时</span> (<span>{isTimeout(record.createTime.substring(0,10))}天</span>)</div>:
            <div style={{color:'#1CBF15'}}>{isTimeout(record.createTime.substring(0,10))}天</div>
          }
        </div>
      }
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          {
            !record.admin ? <a onClick={() => this.fenpeiClick(record)}>分配</a> : <div>已分配</div>
          }
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    let params = {
      page: this.state.currentPage,
      size: this.state.pageSize,
    };
    this.getList(params);
    
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/orders_tj',
      callback: res => {
        this.setState({
          tjData:[
            {
              icon:a1,
              key:'今日报修数量',
              value:res['toDayRepairCount']
            },
            {
              icon:a2,
              key:'今日维修数量',
              value:res['toDayRepairedCount']
            },
            {
              icon:a3,
              key:'待维修总数量',
              value:res['0']
            },
            {
              icon:a4,
              key:'已经维修总数量',
              value:res['2']
            },
          ]
        })
      },
    });
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      editId: null,
    });

    form_modal.resetFields();
  };

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

  // 查询
  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState(
        {
          formValues: values,
          currentPage: 1,
        },
        function() {
          this.getList({ page: this.state.currentPage, size: this.state.pageSize, ...fieldsValue });
        }
      );
    });
  };

  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState(
      {
        formValues: {},
        currentPage: 1,
      },
      () => {
        this.getList({ page: this.state.currentPage, size: this.state.pageSize });
      }
    );
  };

  // 确定分配
  handleAdd = fields => {
    this.setState({ confirmLoading: true });
    fields.organizeId = this.state.organizeId;

    let params = {
      "id":this.state.editId,
      "admin":{"id":fields.adminId}
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'orders/add',
      payload: params,
      callback: res => {
        this.setState({ confirmLoading: false });
        if (res.code == 200) {
          this.handleModalVisible();
          form_modal.resetFields();
          this.getList({
            page: this.state.currentPage,
            size: this.state.pageSize,
            ...this.state.formValues,
          });
          message.success('分配成功');
        }
      },
    });
  };
  fenpeiClick = (record) => {
    this.setState({
      modalVisible:true,
      editId:record.id
    })
    let params = {
      page:1,
      size:10000
    }
    params.param = {
      "level":1,
      "organizeId":this.state.organizeId
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'repairMan/list',
      payload: params,
      callback: res => {
        this.setState({
          persons:res.content
        })
      },
    });
  }

  // list
  getList = params => {
    let payload = {
      page:params.page,
      size:params.size,
      param:{
        organizeId:this.state.organizeId
      }
    }
    params.name && (payload.param.name = params.name)
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/list',
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

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="工单号">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      orders: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
      persons:this.state.persons
    };

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <FourCards data={this.state.tjData}></FourCards>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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
          <CreateForm {...parentMethods} {...parentStates} />
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
