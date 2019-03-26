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
  Cascader,
  DatePicker,
  Spin,
  Menu,
  TreeSelect,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import UploadImg from '@/components/UploadImg';
import SpacialDetail from '@/components/SpacialDetail';
import WxUserDetail from '@/components/WxUserDetail';
import Link from 'umi/link';

import styles from '@/less/TableList.less';

import zhuanjiahead from '@/assets/zhuanjiahead.png'

import { checkData, getnyr } from '@/utils/utils';
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
      title="分配"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="专家">
        {form.getFieldDecorator('expertid', {
          rules: [{ required: true, message: '请选择'}],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
          {
            allSpecialist&&allSpecialist.map((item) => (<Option key={item.user_id}>{item.name}</Option>))
          }
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});
const CreateFormAllotMany = Form.create()(props => {
  const {
    modalVisible_many,
    form,
    handleAdd_many,
    handleModalVisible_many,
    confirmLoading,
    allSpecialist,
  } = props;
  const okHandle_many = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd_many(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="团队分配"
      visible={modalVisible_many}
      onOk={okHandle_many}
      onCancel={() => handleModalVisible_many()}
      confirmLoading={confirmLoading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="团队名称">
        {form.getFieldDecorator('teamname', {
          rules: [{ required: true, message: '请输入(20字符以内)',max: 20 }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="专家">
        {form.getFieldDecorator('expertids', {
          rules: [{ required: true, message: '请选择'}],
        })(
          <Select mode="multiple" placeholder="请选择" style={{ width: '100%' }}>
          {
            allSpecialist&&allSpecialist.map((item) => (<Option key={item.user_id}>{item.name}</Option>))
          }
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

@connect(({ wxuser, loading }) => ({
  wxuser,
  loading: loading.models.wxuser,
}))
@Form.create()
class guide extends PureComponent {
  state = {
    modalVisible: false,
    confirmLoading_many:false,
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
    // {
    //   title: '体测评分',
    //   dataIndex: 'tcGrade',
    //   render:(val) => {
    //     return <div>{val?val:'--'}</div>
    //   }
    // },
    // {
    //   title: '指导专家',
    //   dataIndex: 'expertName',
    //   render:(val,record) => {
    //     return <div>{val?<a onClick={() => this.seeSpecial(record.expertid)}>{val}</a>:'--'}</div>
    //   }
    // },
    // {
    //   title: '操作',
    //   render: (text, record) => (
    //     <Fragment>
    //       <a onClick={() => this.allot(record.id)}>分配</a>
    //     </Fragment>
    //   ),
    // },
  ];

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
    });
  };
  handleModalVisible_many = flag => {
    this.setState({
      modalVisible_many: !!flag,
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

  // add (个人)
  handleAdd = (fields) => {
    this.setState({
      confirmLoading: true,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'wxuser/allotOne',
      payload: {
        expertid:fields.expertid,
        wechatuserid:this.state.allotId,
      },
      callback: res => {
        if (res.code == 200) {
          this.setState({
            modalVisible: false,
            confirmLoading: false,
          });
          this.getList(this.state.currentPage,this.state.pageSize,)
        }
      },
    });
  }
  // add (团队)
  handleAdd_many = (fields) => {
    let usids = [] 
    this.state.selectedRows.forEach((item) => {
      item.forEach(ele => {
        usids.push(ele.id)
      })
    })
    fields.usids = usids;
    this.setState({
      confirmLoading: true,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'wxuser/allotMany',
      payload: fields,
      callback: res => {
        if (res.code == 200) {
          this.setState({
            modalVisible_many: false,
            confirmLoading: false,
            selectedRows:[]
          });
          message.success('团队分配成功')
        }
      },
    });
  }
  // list
  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wxuser/list',
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

  // 分配
  allot = (id) => {
    this.setState({
      modalVisible: true,
      allotId:id
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'specialist/list',
      payload: {},
      callback: res => {
        if (res.code == 200) {
          console.log(res)
          this.setState({
            allSpecialist: res.data.list,
          });
        }
      },
    });
  }
  allotMany = () => {
    if(this.state.selectedRows.length == 0){
      message.error('请先勾选用户');return;
    }
    this.state.selectedRows.forEach((item) => {
      if(item.length){
        this.setState({
          modalVisible_many: true,
        });
        const { dispatch } = this.props;
        dispatch({
          type: 'specialist/list',
          payload: {},
          callback: res => {
            if (res.code == 200) {
              this.setState({
                allSpecialist: res.data.list,
              });
            }
          },
        });
      }else{
        message.error('请先勾选用户')
      }
    })
  }
  
  // 查看专家
  seeSpecial = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wxuser/getSpecialDetail',
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
      type: 'wxuser/get',
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* <Col md={6} sm={24}>
            <FormItem label="指导专家">
              {getFieldDecorator('a_expertid')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col> */}
        </Row>
      </Form>
    );
  }

  render() {
    const {
      wxuser: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = { 
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleAdd_many: this.handleAdd_many,
      handleModalVisible_many: this.handleModalVisible_many,
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
      modalVisible_many: this.state.modalVisible_many,
      confirmLoading: this.state.confirmLoading,
      allSpecialist:this.state.allSpecialist
    };

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button onClick={this.allotMany} type="primary">团队分配</Button>
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
          <CreateFormAllotMany {...parentMethods} {...parentStates} />
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
