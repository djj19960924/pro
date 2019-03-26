import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  TreeSelect,
  DatePicker,
  Select,
  Button,
  Modal,
  message,
  Divider,
  Spin,
  Menu,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import FourCards from '@/components/FourCards';
import Link from 'umi/link';

import styles from '@/less/TableList.less';

import { checkData, cutStr, getnyr, getfulltime } from '@/utils/utils';
import { rc, fileUrl } from '@/global';
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
const CreateForm = Form.create()(props => {
  const { modalVisible, handleModalVisible, record } = props;
  return (
    <Modal
      destroyOnClose
      title="意见详情"
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      onOk={() => handleModalVisible()}
    >
      <div style={{marginBottom:10,padding:'0 20px'}}>
        <span style={{color:'#4A4A4A'}}>意见类型 : </span>
        <span style={{color:'#828282'}}>{record.type_name}</span>
      </div>
      <div style={{marginBottom:10,padding:'0 20px'}}>
        <span style={{color:'#4A4A4A'}}>意见说明 : </span><br/>
        <span style={{color:'#828282'}}>{record.content}</span><br/>
        {
          record.image_urls && record.image_urls.split(',').map(ele => (
            <div style={{width:72,height:72,textAlign:'center',display:'inline-block',marginRight:8,marginBottom:8,overflow:'hidden'}}>
              <a target='_blank' href={fileUrl + '/' + ele}>
                <img style={{height:"100%"}} src={fileUrl + '/' + ele}/>
              </a>
            </div>
          ))
        }
      </div>
      <div style={{marginBottom:10,padding:'0 20px'}}>
        <span style={{color:'#4A4A4A'}}>联系人 : </span>
        <span style={{color:'#828282'}}>{record.uname}</span>
      </div>
      <div style={{marginBottom:10,padding:'0 20px'}}>
        <span style={{color:'#4A4A4A'}}>联系方式 : </span>
        <span style={{color:'#828282'}}>{record.type_name}</span>
      </div>
      <div style={{marginBottom:10,padding:'0 20px'}}>
        <span style={{color:'#4A4A4A'}}>反馈日期 : </span>
        <span style={{color:'#828282'}}>{record.create_time && getfulltime(record.create_time)}</span>
      </div>
    </Modal>
  );
});

@connect(({complaint, loading }) => ({
  complaint,
  loading: loading.models.complaint,
}))
@Form.create()
class resource extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据

    record:{},

    tjData:[
      {
        icon:a1,
        key:'今日投诉数量',
        value:0
      },
      {
        icon:a2,
        key:'今日建议数量',
        value:0
      },
      {
        icon:a3,
        key:'投诉总数量',
        value:0
      },
      {
        icon:a4,
        key:'建议总数量',
        value:0
      },
    ],
  };

  columns = [
    {
      title: "",
      dataIndex: 'isnew',
      width: '5%',
      render(val) {
        return (val?<div><span style={{color: '#fff',
          background:'#008D14',
          fontSize:12,
          padding:'2px 4px',
          borderRadius:3}}>新</span></div>:'--');
      }
    },
    {
      title: '意见类型',
      dataIndex: 'type_name',
      width: '15%',
    },
    {
      title: '意见说明',
      dataIndex: 'content',
      width: '20%',
      render(val) {
        return cutStr(val,10);
      }
    },
    {
      title: '姓名',
      dataIndex: 'uname',
      width: '15%',
      render(val) {
        return cutStr(val,10);
      }
    },
    {
      title: '联系方式',
      dataIndex: 'tel',
      width: '15%',
    },
    {
      title: '反馈日期',
      dataIndex: 'create_time',
      width: '15%',
      render(val) {
        return getfulltime(val);
      }
    },
    {
      title: '操作',
      width: '20%',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.detail(record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => this.delete(record.id)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    let params = {
      pn: this.state.currentPage,
      ps: this.state.pageSize,
    };
    this.getList(params);
    
    const { dispatch } = this.props;
    dispatch({
      type: 'complaint/complaint_list_top',
      payload: params,
      callback: res => {
        if(res.code == 200){
          var data = [
            {
              icon:a1,
              key:'今日投诉数量',
              value:res.data['投诉']
            },
            {
              icon:a2,
              key:'今日建议数量',
              value:res.data['建议']
            },
            {
              icon:a3,
              key:'投诉总数量',
              value:res.data['sum_投诉']
            },
            {
              icon:a4,
              key:'建议总数量',
              value:res.data['sum_建议']
            },
          ]
          this.setState({
            tjData:data
          })
        }
      },
    });
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
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
      pn: pagination.current,
      ps: pagination.pageSize,
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
          this.getList({ pn: this.state.currentPage, ps: this.state.pageSize, ...fieldsValue });
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
        this.getList({ pn: this.state.currentPage, ps: this.state.pageSize });
      }
    );
  };

  // list
  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'complaint/list',
      payload: params,
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

  // delete
  delete = idList => {
    let ids = [];
    if (idList) {
      ids = [idList];
    } else {
      if (this.state.selectedRows.length == 0) {
        Modal.warning({
          title: '提示',
          content: '您还没有选择任何记录',
        });
        return;
      }
      for (let i = 0; i < this.state.selectedRows.length; i++) {
        ids.push(this.state.selectedRows[i].id);
      }
    }
    Modal.confirm({
      content: '是否确定删除记录？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'complaint/del',
          payload: ids,
          callback: res => {
            if (res.code == 200) {
              let current = this.state.currentPage;
              if (this.state.currentDataNum == ids.length && this.state.currentPage > 1) {
                current = this.state.currentPage - 1;
                this.setState({
                  currentPage: current,
                });
              }
              this.getList({ pn: current, ps: this.state.pageSize, ...this.state.formValues });
            }
          },
        });
      },
    });
  };

  // detail
  detail = record => {
    this.setState({
      modalVisible:true,
      record:record,
    })
  }

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="意见类型">
              {getFieldDecorator('type_name')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="建议">建议</Option>
                  <Option value="投诉">投诉</Option>
                </Select>
              )}
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
    complaint: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = {
      // 传递方法
      handleModalVisible: this.handleModalVisible,
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      record:this.state.record,
    };

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <FourCards data={this.state.tjData}></FourCards>
              <div className={styles.tableListOperator}>
                <Button type="danger" onClick={() => this.delete()}>
                  删除
                </Button>
              </div>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                total={data.itemCount}
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

export default resource;
