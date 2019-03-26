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
let form_modal = null;
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    confirmLoading,
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
      title="修改团队信息"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="团队名称">
        {form.getFieldDecorator('teamName', {
          rules: [{ required: true, message: '请输入(20字符以内)',max: 20}],
        })(<Input placeholder='请输入'/>)}
      </FormItem>
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
      title: '序列',
      render:(val,record,index) => {
        return <div>{index+1}</div>
      }
    },
    {
      title: '团队名称',
      dataIndex: 'name',
      editable: true,
      render:(val) => {
        return <div>{val?val:'--'}</div>
      }
    },
    {
      title: '用户人数',
      dataIndex: 'usids',
      render:(val) => {
        return <div>{val?val:'--'}</div>
      }
    },
    {
      title: '专家人数',
      dataIndex: 'expertids',
      render:(val) => {
        return <div>{val?val:'--'}</div>
      }
    },
    {
      title: '分配时间',
      dataIndex: 'createTime',
      render:(val) => {
        return <div>{val?getnyr(val):'--'}</div>
      }
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Dropdown overlay={this.menu_detail(record)} trigger={['click']}>
            <a className="ant-dropdown-link">
              详情 <Icon type="down" />
            </a>
          </Dropdown>
          <Divider type="vertical" />
          <Dropdown overlay={this.menu(record)} trigger={['click']}>
            <a className="ant-dropdown-link">
              编辑 <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      ),
    },
  ];

  menu_detail = record => {
    return (
      <Menu>
        <Menu.Item key="1">
          <Link to={`${rc}/guide/team/user?id=${record.id}`}>
            用户详情
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to={`${rc}/guide/team/expert?id=${record.id}`}>
            专家详情
          </Link>
        </Menu.Item>
      </Menu>
    );
  };

  menu = record => {
    return (
      <Menu onClick={e => this.edit(e, record)}>
        <Menu.Item key="1">修改</Menu.Item>
        <Menu.Item key="2">删除</Menu.Item>
      </Menu>
    );
  };

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

  // add
  handleAdd = (fields) => {
    this.setState({confirmLoading:true})
    fields.teamid = this.state.editId;
    const { dispatch } = this.props;
    dispatch({
      type: 'team/update',
      payload: fields,
      callback: res => {
        if (res.code == 200) {
          message.success('修改成功')
          this.setState({
            confirmLoading:false,
            modalVisible:false,
            editId:null
          })
          let params = {
            pn: this.state.currentPage,
            ps: this.state.pageSize,
          };
          this.getList(params);
        }
      },
    });
  }

  // list
  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'team/list',
      payload: params,
      callback: res => {
        if (res.code == 200) {
          console.log(res)

          this.setState({
            currentDataNum: res.data.list.length,
            // selectedRows: [],
          });
        }
      },
    });
  };

  // 编辑
  edit = (e,record) => {
    if(e.key == 1){// get
      this.setState({
        editId: record.id,
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'team/get',
        payload: {teamid:record.id},
        callback: res => {
          if (res.code == 200) {
            this.setState({
              modalVisible: true,
            });
            form_modal.setFieldsValue({
              teamName:res.data.name
            });
          }
        },
    });
    }
    if(e.key == 2){// del
      const ids = [record.id]
      Modal.confirm({
        content: '是否确定删除记录？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.props.dispatch({
            type: 'team/del',
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
    }
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
            <FormItem label="团队名称">
              {getFieldDecorator('a_name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {/* <Col md={6} sm={24}>
            <FormItem label="分配时间">
              {getFieldDecorator('a_time')(<DatePicker/>)}
            </FormItem>
          </Col> */}
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
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
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
