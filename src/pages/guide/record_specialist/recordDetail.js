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
  Upload,
  message,
  Divider,
  DatePicker,
  Spin,
  Menu,
  TreeSelect,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import WxUserDetail from '@/components/WxUserDetail';
import UploadImg from '@/components/UploadImg';
import router from "umi/router";
import Link from 'umi/link';
import { getPageQuery } from "@/utils/utils";

import styles from '@/less/TableList.less';
import mystyles from '@/less/guide.less';

import zhuanjiahead from '@/assets/zhuanjiahead.png'

import { checkData, getnyr, cutStr, getfulltime } from '@/utils/utils';
import { rc,requestUrl_kxjs } from '@/global';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

message.config({ top: 100 });

// 对话框
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleModalVisible,
    recordList
  } = props;
  const footer = <div onClick={() => handleModalVisible()} style={{textAlign:'center'}}><Button type='primary'>关闭</Button></div>
  return (
    <Modal
      destroyOnClose
      title="指导记录"
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={footer}
    >
    <div style={{maxHeight:300,overflowY:'scroll'}}>
    {
      recordList && recordList.map((item) => (
        <div>
          {item.name && item.adviceTime && item.questions &&
            <div>
              <div className={mystyles.recordName}>
                <b>用户名：{item.name}</b>
                <span>{getfulltime(item.adviceTime,'hh:mm')}</span>
              </div>
              <div className={mystyles.question}>
                {item.questions}
              </div>
            </div>
          }
          {item.expertName && item.reponse_time && item.expert_reponse &&
            <div>
              <div className={mystyles.recordName}>
                <b>专家：{item.expertName}</b>
                <span>{getfulltime(item.reponse_time,'hh:mm')}</span>
              </div>
              <div className={mystyles.response}>
                {item.expert_reponse}
              </div>
            </div>
          }
        </div>
      ))
    }
    </div>
    </Modal>
  );
});
// 用户详情
const CreateWxUserDetail = Form.create()(props => {
  const {
    wxUserDetailModalVisible,
    handleWxUserDetailModalVisible,
    wxUserInfo,
  } = props;
  const footer = <div onClick={() => handleWxUserDetailModalVisible()} style={{textAlign:'center'}}><Button type='primary'>关闭</Button></div>
  return (
    <Modal
      destroyOnClose
      title="用户信息"
      width={860}
      visible={wxUserDetailModalVisible}
      onCancel={() => handleWxUserDetailModalVisible()}
      footer={footer}
      centered={true}
    >
      <WxUserDetail wxUserInfo={wxUserInfo}></WxUserDetail>
    </Modal>
  );
});

@connect(({ guidance, loading }) => ({
  guidance,
  loading: loading.models.guidance,
}))
@Form.create()
class guide extends PureComponent {
  state = {
    modalVisible: false,
    confirmLoading: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据
  };

  columns = [
    {
      title: '头像',
      render:(val,record) => {
        return record.wxUserDto.headImg ? (
          <Avatar src={record.wxUserDto.headImg}/>
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
      render:(val,record) => {
        return <div>{record.wxUserDto.nickName?record.wxUserDto.nickName:'--'}</div>
      }
    },
    {
      title: '性别',
      render:(val,record) => {
        return <div>{record.wxUserDto.sex==1?'男':record.wxUserDto.sex==2?'女':'--'}</div>
      }
    },
    {
      title: '出生日期',
      render:(val,record) => {
        return <div>{record.wxUserDto.birthday?record.wxUserDto.birthday.substring(0,10):'--'}</div>
      }
    },
    {
      title: '手机号',
      render:(val,record) => {
        return <div>{record.wxUserDto.phone?record.wxUserDto.phone:'--'}</div>
      }
    },
    {
      title: '人群类别',
      render:(val,record) => {
        return <div>{record.wxUserDto.personClass==1?'青年':record.wxUserDto.personClass==2?'中老年':'--'}</div>
      }
    },
    {
      title: '身高',
      render:(val,record) => {
        return <div>{record.wxUserDto.height?(record.wxUserDto.height + '(cm)'):'--'}</div>
      }
    },
    {
      title: '体重',
      render:(val,record) => {
        return <div>{record.wxUserDto.weight?(record.wxUserDto.weight + '(kg)'):'--'}</div>
      }
    },
    {
      title: '指导内容',
      render:(val,record) => {
        return <div>{record.msg?cutStr(record.msg):'--'}</div>
      }
    },
    {
      title: '指导时间',
      render:(val,record) => {
        return <div>{record.newResponseTime?(record.newResponseTime.substring(0,10)):'--'}</div>
      }
    },
    // {
    //   title: '体测报告',
    //   render: (text, record) => (
    //     <Fragment>
    //       <a onClick={() => this.toReport(record)}>查看</a>
    //     </Fragment>
    //   ),
    // },
  ];

  // 查看报告
  toReport = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'guidance/getReport',
      payload: record.tc_reportId,
      callback: res => {
        if(res.meta.code == 200){
          let reportRecord = {},user = res.data.data.user,report = res.data.data.report;
          for(var key in user){
            reportRecord[key] = user[key]
          }
          for(var key in report){
            reportRecord[key] = report[key]
          }
          localStorage.setItem('reportRecord',JSON.stringify(reportRecord))
          router.push(`${rc}/guide/report`);
        }
      },
    });
  }

  componentDidMount() {
    let params = {
      pn: this.state.currentPage,
      ps: this.state.pageSize,
    };
    this.getList(params);
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      editId:null
    });
  };
  handleWxUserDetailModalVisible = flag => {
    this.setState({
      wxUserDetailModalVisible: !!flag,
    });
  };

  // 多选
  handleSelectRows = rows => {
    this.state.selectedRows[this.state.currentPage - 1] = rows;
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
    params.specialId = getPageQuery().id
    const { dispatch } = this.props;
    dispatch({
      type: 'guidance/personalguidance_list',
      payload: params,
      callback: res => {
        if (res.code == 200) {
          this.setState({
            currentDataNum: res.data.list.length,
            // selectedRows: [],
          });
        }
      },
    });
  };

  // 详情
  detail = (id) => {// id为userid
    const { dispatch } = this.props;
    dispatch({
      type: 'guidance/specialist_detail',
      payload: id,
      callback: res => {
        if (res.code == 200) {
          if(res.data.list.length == 0){
            Modal.warning({
              title: '提示',
              content: '该用户还没有指导记录',
            });
            return;
          }
          this.setState({
            modalVisible:true,
            recordList:res.data.list
          });
        }
      },
    });
  }

  // 查看用户
  seeWxUser = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'guidance/getWxUserDetail',
      payload: id,
      callback: res => {
        if (res.code == 200) {
          this.setState({
            wxUserInfo:res.data
          })
          this.handleWxUserDetailModalVisible(true)
        }
      },
    });
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
            <FormItem label="用户名">
              {getFieldDecorator('a_usname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="性别">
              {getFieldDecorator('a_sex')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">男</Option>
                  <Option value="2">女</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="人群类别">
              {getFieldDecorator('a_groupName')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">青年</Option>
                  <Option value="2">中老年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="指导时间">
              {getFieldDecorator('a_adviceTime')(<DatePicker/>)}
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
      guidance: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = { 
      // 传递方法
      handleModalVisible: this.handleModalVisible,
      handleWxUserDetailModalVisible:this.handleWxUserDetailModalVisible,
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
      recordList:this.state.recordList,
      wxUserDetailModalVisible:this.state.wxUserDetailModalVisible,
      wxUserInfo:this.state.wxUserInfo,
    };

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
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
          <CreateWxUserDetail {...parentMethods} {...parentStates} />
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

export default guide;
