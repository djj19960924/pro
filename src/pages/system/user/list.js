import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import moment from "moment";
import {
  Row,
  Col,
  Card,
  Avatar,
  Form,
  Input,
  Cascader,
  Select,
  Button,
  Modal,
  message,
  Divider,
  DatePicker,
  Spin,
  Menu,
  TreeSelect,
  Dropdown,
  Icon
} from "antd";
import StandardTable from "@/components/StandardTable";
import UploadImg from "@/components/UploadImg";
import Link from "umi/link";

import styles from "@/less/TableList.less";
import myStyle from "./user.less";

import { checkData, getnyr ,getFullArea } from "@/utils/utils";
import { rc,fileUrl } from "@/global";

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");

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
    areaTree,
    roleTree,
    editId
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
      title="新增/修改用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="账号">
        {form.getFieldDecorator("userName", {
          rules: [
            { required: true, message: "请输入", whitespace: true },
            { pattern: "([A-Za-z0-9_])", message: "字母、数字、下划线组合" }
            // { max:10,min:5,message:'请输入6-16位字符' }
          ],
          validateFirst: true
        })(<Input placeholder="请输入" disabled={Boolean(editId)} />)}
      </FormItem>
      {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
        {form.getFieldDecorator('password', {
          rules: [
            { required: true, message: '请输入(6-16字符)', whitespace: true, max: 16, min: 6 },
          ],
        })(<Input type="password" placeholder="请输入" disabled={Boolean(editId)} />)}
      </FormItem> */}
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="用户名称"
      >
        {form.getFieldDecorator("name", {
          rules: [
            {
              required: true,
              message: "请输入(小于20个字符)",
              whitespace: true,
              max: 20
            }
          ]
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="所属区域"
      >
        {form.getFieldDecorator("deptid", {
          rules: [{ required: true, message: "请选择" }]
        })(
          <Cascader options={JSON.parse(localStorage.getItem('areaTree'))} placeholder="请选择" showSearch />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
        {form.getFieldDecorator("roleId", {
          rules: [{ required: true, message: "请选择" }]
        })(
          <TreeSelect
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 200, overflow: "auto" }}
            treeData={roleTree}
            placeholder="请选择"
            treeDefaultExpandAll
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
        {form.getFieldDecorator("sex", {
          rules: [{ required: true, message: "请选择" }]
        })(
          <Select placeholder="请选择" style={{ width: "100%" }}>
            <Option value="1">男</Option>
            <Option value="0">女</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="出生年月"
      >
        {form.getFieldDecorator("birthday", {
          rules: [{ required: true, message: "请选择日期" }]
        })(<DatePicker />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="联系方式"
      >
        {form.getFieldDecorator("phone", {
          rules: [
            {
              required: true,
              message: "请输入手机号",
              whitespace: true,
              max: 11,
              min: 11
            }
          ]
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user
}))
@Form.create()
class system extends PureComponent {
  state = {
    areaTree: JSON.parse(localStorage.getItem('areaTree')),
    roleTree: JSON.parse(localStorage.getItem("roleTree")),

    modalVisible: false,
    confirmLoading: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    editId: null,

    currentDataNum: null // 当前列表条数，用于判断当前页是否只有一条数据
  };

  columns = [
    {
      title: "头像",
      dataIndex: "headimg",
      render: (text, record) => {
        return record.headimg ? (
          <Avatar
            src={fileUrl + record.headimg}
          />
        ) : (
          <Avatar
            style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
            icon="user"
          />
        );
      }
    },
    {
      title: "用户名",
      dataIndex: "name"
    },
    {
      title: "账号",
      dataIndex: "userName"
    },
    {
      title: "性别",
      dataIndex: "sex",
      render: text => <span>{text == "0" ? "女" : "男"}</span>
    },
    {
      title: "出生日期",
      dataIndex: "birthday",
      render: text => <span>{text.substring(0,10) || '--'}</span>
    },
    {
      title: "联系方式",
      dataIndex: "phone"
    },
    {
      title: "角色",
      dataIndex: "roleName",
      // render: text => (text?<span>{text}&nbsp;&nbsp;&nbsp; <span onClick={() => this.changeRole()} className={myStyle.authBtn}>更换</span></span>:'--'),
      render: text => (text ? text : "--")
    },
    {
      title: "操作",
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.resetPwd(record.userId)}>重置密码</a>
          <Divider type="vertical" />
          <Dropdown overlay={this.menu(record.userId)} trigger={["click"]}>
            <a className="ant-dropdown-link">
              编辑 <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      )
    }
  ];

  menu = id => {
    return (
      <Menu onClick={e => this.edit(e, id)}>
        <Menu.Item key="1">修改</Menu.Item>
        <Menu.Item key="2">删除</Menu.Item>
      </Menu>
    );
  };

  componentDidMount() {
    let params = {
      pn: this.state.currentPage,
      ps: this.state.pageSize
    };
    this.getList(params);
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      editId: null
    });

    form_modal.resetFields();
  };

  // 多选
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows
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
      pageSize: pagination.pageSize
    });
    const params = {
      pn: pagination.current,
      ps: pagination.pageSize,
      ...formValues,
      ...filters
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

      fieldsValue.deptid = fieldsValue.deptid && fieldsValue.deptid[1]

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf()
      };

      this.setState(
        {
          formValues: values,
          currentPage: 1
        },
        function() {
          this.getList({
            pn: this.state.currentPage,
            ps: this.state.pageSize,
            ...fieldsValue
          });
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
        currentPage: 1
      },
      () => {
        this.getList({ pn: this.state.currentPage, ps: this.state.pageSize });
      }
    );
  };

  // add or update
  handleAdd = fields => {
    fields.deptid = fields.deptid[1]
    fields.birthday = getnyr(fields.birthday);
    this.setState({ confirmLoading: true });
    this.state.editId && (fields.id = this.state.editId);
    const { dispatch } = this.props;
    dispatch({
      type: "user/add",
      payload: fields,
      callback: res => {
        this.setState({ confirmLoading: false });
        if (res.meta.code == 200) {
          this.handleModalVisible();
          form_modal.resetFields();
          this.getList({
            pn: this.state.currentPage,
            ps: this.state.pageSize,
            ...this.state.formValues
          });
          if (fields.id) {
            message.success("修改成功");
          } else {
            message.success("添加成功");
          }
        }
      }
    });
  };

  // list
  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/list",
      payload: params,
      callback: res => {
        if (res.meta.code == 200) {
          this.setState({
            currentDataNum: res.data.data.length,
            selectedRows: []
          });
        }
      }
    });
  };

  // delete
  delete = idList => {
    let ids = [];
    if (idList) {
      ids = idList;
    } else {
      if (this.state.selectedRows.length == 0) {
        Modal.warning({
          title: "提示",
          content: "您还没有选择任何用户"
        });
        return;
      }
      for (let i = 0; i < this.state.selectedRows.length; i++) {
        ids.push(this.state.selectedRows[i].userId);
      }
    }
    Modal.confirm({
      content: "是否确定删除记录？",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        this.props.dispatch({
          type: "user/delete",
          payload: ids,
          callback: res => {
            if (res.meta.code == 200) {
              let current = this.state.currentPage;
              if (
                this.state.currentDataNum == ids.length &&
                this.state.currentPage > 1
              ) {
                current = this.state.currentPage - 1;
                this.setState({
                  currentPage: current
                });
              }
              this.getList({
                pn: current,
                ps: this.state.pageSize,
                ...this.state.formValues
              });
            }
          }
        });
      }
    });
  };

  // 重置密码
  resetPwd = id => {
    Modal.confirm({
      content: "是否确定重置密码？",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        this.props.dispatch({
          type: "user/resetPwd",
          payload: { userId: id },
          callback: res => {
            if (res.meta.code == 200) {
              message.success("操作成功");
            }
          }
        });
      }
    });
  };

  // 编辑
  edit = function(e, id) {
    if (e.key == 1) {
      const { dispatch } = this.props;
      dispatch({
        type: "user/getById",
        payload: { userId: id },
        callback: res => {
          if (res.meta.code == 200) {
            this.setState({
              modalVisible: true,
              editId: res.data.data.userId
            });
            form_modal.setFieldsValue({
              userName: res.data.data.userName,
              name: res.data.data.name,
              sex: res.data.data.sex,
              birthday: moment(res.data.data.birthday),
              phone: res.data.data.phone,
              deptid: getFullArea(res.data.data.deptid),
              roleId: res.data.data.roleId,
              password: "000000"
            });
          }
        }
      });
    } else if (e.key == 2) {
      this.delete([id]);
    } else if (e.key == 3) {
      this.resetPwd(id);
    }
  };

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用户名称">
              {getFieldDecorator("name1")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="性别">
              {getFieldDecorator("sex")(
                <Select placeholder="请选择" style={{ width: "100%" }}>
                  <Option value="1">男</Option>
                  <Option value="0">女</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="联系方式">
              {getFieldDecorator("phone1")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="所属区域">
              {getFieldDecorator("deptid")(
                <Cascader options={JSON.parse(localStorage.getItem('areaTree'))} placeholder="请选择" showSearch />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="角色">
              {getFieldDecorator("roleId")(
                <TreeSelect
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 200, overflow: "auto" }}
                  treeData={this.state.roleTree}
                  placeholder="请选择"
                  treeDefaultExpandAll
                />
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
      user: { data },
      loading
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
      areaTree: this.state.areaTree,
      roleTree: this.state.roleTree,
      editId: this.state.editId
    };

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  新增用户
                </Button>
                <Button type="danger" onClick={() => this.delete()}>
                  删除
                </Button>
              </div>
              <div className={styles.tableListForm}>
                {this.renderSimpleForm()}
              </div>
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
          style={{ position: "absolute", top: 140, left: 0, right: 0 }}
          size="large"
          tip="Loading..."
        />
      );
    }
  }
}

export default system;
