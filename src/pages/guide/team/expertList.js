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
import UploadImg from '@/components/UploadImg';
import SpacialDetail from '@/components/SpacialDetail';
import Link from 'umi/link';

import styles from '@/less/TableList.less';

import zhuanjiahead from '@/assets/zhuanjiahead.png'

import { getPageQuery,checkData, getnyr } from '@/utils/utils';
import { rc,requestUrl_kxjs,fileUrl } from '@/global';

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
    searchExpertList,
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
      title="添加专家"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="专家名称">
        {form.getFieldDecorator('expertids', {
          rules: [{ required: true, message: '请选择'}],
        })(
          <Select
            style={{width:'100%'}}
            showSearch
            placeholder='输入专家名称查询'
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onInputKeyDown={handleSearch}
            notFoundContent={null}
          >
            {
              searchExpertList && searchExpertList.map(item => (
                <Option key={item.user_id}>{item.name}</Option>
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
    serviceType:[]
  };

  columns = [
    {
      title: '专家头像',
      render:(val,record) => {
        return record.headimg ? (
          <Avatar src={fileUrl + '/' + record.headimg}/>
        ) : (
          <Avatar
            style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
            icon="user"
          />
        );
      }
    },
    {
      title: '专家姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render:(val) => {
        return <div>{val==1?'男':val==2?'女':'--'}</div>
      }
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '所属区域',
      dataIndex: 'fullname',
    },
    {
      title: '服务类别',
      dataIndex: 'servicetypename',
    },
    {
      title: '所在机构',
      dataIndex: 'department',
      render:(val) => {
        return <div>{val?val:'--'}</div>
      }
    },
    {
      title: '职务',
      dataIndex: 'postionname',
      render:(val) => {
        return <div>{val?val:'--'}</div>
      }
    },
    {
      title: '技术职称',
      dataIndex: 'society_titles',
      render:(val) => {
        return <div>{val?val:'--'}</div>
      }
    },
    {
      title: '专家认证时间',
      dataIndex: 'createtime',
      render:(val) => (
        <div>{val?val.substring(0,10):'--'}</div>
      )
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.delete(record.user_id)}>移出</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.getList();
    // this.getServiceType();
  }

  // 获取服务类别
  getServiceType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'specialist/allType',
      payload: {},
      callback: res => {
        if (res.code == 200) {
          this.setState({
            serviceType: res.data.list,
          });
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
  handleSpecialDetailModalVisible = flag => {
    this.setState({
      specialDetailModalVisible: !!flag,
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
      type: 'team/update',
      payload: {
        teamid:getPageQuery().id,
        expertids:fields.expertids
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
      type: 'team/getExpertList', 
      payload: {
        teamid:getPageQuery().id
      },
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
        message.error('请先勾选专家');return;
      }
      this.state.selectedRows.forEach((item) => {
        item.forEach(ele => {
          ids.push(ele.user_id)
        })
      })
    }
    const { dispatch } = this.props;
    Modal.confirm({
      content: "是否确定移出专家？",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        dispatch({
          type: 'team/delExpert',
          payload: {
            id:getPageQuery().id,
            expertids:ids
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
        type: 'team/searchExpertList',
        payload: {name:e.target.value},
        callback: res => {
          if (res.code == 200) {
            this.setState({
              searchExpertList:res.data.list
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

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch1} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="专家姓名">
              {getFieldDecorator('a_name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="服务类别">
              {getFieldDecorator('a_sevicetypeid')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                {
                  this.state.serviceType.map(ele => (
                    <Option key={ele.id}>{ele.name}</Option>
                  ))
                }
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
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      specialDetailModalVisible:this.state.specialDetailModalVisible,
      specialInfo:this.state.specialInfo,
      confirmLoading: this.state.confirmLoading,
      searchExpertList:this.state.searchExpertList
    };

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={this.handleModalVisible}>添加专家</Button>
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
