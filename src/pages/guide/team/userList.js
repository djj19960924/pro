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
  Cascader,
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
import UploadImg from '@/components/UploadImg';
import Link from 'umi/link';
import SpacialDetail from '@/components/SpacialDetail';
import WxUserDetail from '@/components/WxUserDetail';

import styles from '@/less/TableList.less';

import zhuanjiahead from '@/assets/zhuanjiahead.png'

import { getPageQuery,checkData, getnyr } from '@/utils/utils';
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
    handleAdd,
    handleModalVisible,
    confirmLoading,
    allSpecialist,
    handleSearch,
    searchUserList,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="添加成员"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator('wechat_usids', {
          rules: [{ required: true, message: '请选择'}],
        })(
          <Select
            style={{width:'100%'}}
            showSearch
            placeholder='输入用户名查询'
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onInputKeyDown={handleSearch}
            notFoundContent={null}
          >
            {
              searchUserList && searchUserList.map(item => (
                <Option key={item.id}>{item.name}</Option>
              ))
            }
            {/* {options} */}
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});
// 专家详情
const CreateSpecialDetail = Form.create()(props => {
  const {
    specialDetailModalVisible,
    handleSpecialDetailModalVisible,
    specialInfo,
  } = props;
  const footer = <div onClick={() => handleSpecialDetailModalVisible()} style={{textAlign:'center'}}><Button type='primary'>关闭</Button></div>
  return (
    <Modal
      destroyOnClose
      title="专家详情"
      width={860}
      visible={specialDetailModalVisible}
      onCancel={() => handleSpecialDetailModalVisible()}
      footer={footer}
      centered={true}
    >
      <SpacialDetail specialInfo={specialInfo}></SpacialDetail>
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

@connect(({ team, loading }) => ({
  team,
  loading: loading.models.team,
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
        return record.headImg ? (
          <Avatar src={record.headImg}/>
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
      dataIndex: 'nickName',
      // render:(val,record) => {
      //   return <div>{val?<a onClick={() => this.seeWxUser(record.id)}>{val}</a>:'--'}</div>
      // }
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render:(val) => {
        return <div>{val==1?'男':val==2?'女':'--'}</div>
      }
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      render:(val) => {
        return <div>{val?val.substring(0,10):'--'}</div>
      }
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      render:(val) => {
        return <div>{val?val:'--'}</div>
      }
    },
    {
      title: '人群类别',
      dataIndex: 'personClass',
      render:(val) => {
        return <div>{val==1?'青年':val==2?'中老年':'--'}</div>
      }
    },
    {
      title: '身高(cm)',
      dataIndex: 'height',
      render:(val) => {
        return <div>{val?(val + ' cm'):'--'}</div>
      }
    },
    {
      title: '体重(kg)',
      dataIndex: 'weight',
      render:(val) => {
        return <div>{val?(val + ' kg'):'--'}</div>
      }
    },
    {
      title: '体测评分',
      dataIndex: 'tcGrade',
      render:(val) => {
        return <div>{val?val:'--'}</div>
      }
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.delete(record.id)}>移出</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.getList();
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleSpecialDetailModalVisible = flag => {
    this.setState({
      specialDetailModalVisible: !!flag,
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

  // 查询
  handleSearch1 = e => {
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

  // add
  handleAdd = (fields) => {
    this.setState({confirmLoading:true})
    const { dispatch } = this.props;
    dispatch({
      type: 'team/addUser',
      payload: {
        teamid:getPageQuery().id,
        wechat_usids:fields.wechat_usids
      },
      callback: res => {
        if (res.code == 200) {
          this.setState({
            confirmLoading:false,
            modalVisible:false,
          })
          message.success('添加成功');
          this.getList()
        }
      },
    });
  }

  // list
  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'team/getUserList',
      payload: getPageQuery().id,
      callback: res => {
        if (res.code == 200) {
          this.setState({
            currentDataNum: res.data.list.length,
            selectedRows:[]
          });
        }
      },
    });
  };

  // delete
  delete = (id) => {
    let ids = [];
    if(id){
      ids = [id]
    }
    else{
      if(this.state.selectedRows.length == 0){
        message.error('请先勾选用户');return;
      }
      this.state.selectedRows.forEach((item) => {
        item.forEach(ele => {
          ids.push(ele.id)
        })
      })
    }
    const { dispatch } = this.props;
    Modal.confirm({
      content: "是否确定移出用户？",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        dispatch({
          type: 'team/delUser',
          payload: {
            id:getPageQuery().id,
            wechat_usids:ids
          },
          callback: res => {
            if (res.code == 200) {
              this.getList()
            }
          },
        });
      }
    });
  }

  handleSearch = e => {
    if (e.keyCode == "13") {
      const { dispatch } = this.props;
      dispatch({
        type: 'team/searchUserList',
        payload: {usname:e.target.value},
        callback: res => {
          if (res.code == 200) {
            this.setState({
              searchUserList:res.data.list
            })
          }
        },
      });
    }
  }

  // 查看专家
  seeSpecial = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'team/getSpecialDetail',
      payload: id,
      callback: res => {
        if (res.code == 200) {
          this.setState({
            specialInfo:res.data
          })
          this.handleSpecialDetailModalVisible(true)
        }
      },
    });
  }

  // 查看用户
  seeWxUser = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'team/getWxUserDetail',
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
      <Form onSubmit={this.handleSearch1} layout="inline">
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
          <Col md={6} sm={24}>
            <FormItem label="指导专家">
              {getFieldDecorator('a_expertid')(<Input placeholder="请输入" />)}
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
      team: { data },
      loading, 
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = { 
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleSearch:this.handleSearch,
      handleSpecialDetailModalVisible:this.handleSpecialDetailModalVisible,
      handleWxUserDetailModalVisible:this.handleWxUserDetailModalVisible,
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      specialDetailModalVisible:this.state.specialDetailModalVisible,
      specialInfo:this.state.specialInfo,
      wxUserDetailModalVisible:this.state.wxUserDetailModalVisible,
      wxUserInfo:this.state.wxUserInfo,
      confirmLoading: this.state.confirmLoading,
      searchUserList:this.state.searchUserList
    };

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={this.handleModalVisible}>添加成员</Button>
                <Button onClick={() => this.delete()} type="danger">移出</Button>
              </div>
              {/* <div className={styles.tableListForm}>{this.renderSimpleForm()}</div> */}
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data.list?{list:data.list}:{list:[]}}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                total={data.itemCount}
              />
            </div>
          </Card>
          <CreateForm {...parentMethods} {...parentStates} />
          <CreateSpecialDetail {...parentMethods} {...parentStates} />
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
