import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Tree,
  Divider,
  Checkbox
} from "antd";
import StandardTable from "@/components/StandardTable";

import styles from "@/less/TableList.less";
import myStyle from "./role.less";

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const CheckboxGroup = Checkbox.Group;

message.config({ top: 100 });

let form_modal = null;
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    confirmLoading
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
      title="新增/修改角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="角色名称"
      >
        {form.getFieldDecorator("roleName", {
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator("remake", {
          rules: [
            {
              required: false,
              message: "请输入(小于20个字符)",
              whitespace: true,
              max: 20
            }
          ]
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

let auth_modal = null;
const CreateAuthForm = Form.create()(props => {
  const {
    authTree,
    getAuthTree,
    modalVisible_auth,
    form,
    handleChangeAuth,
    handleModalVisible_auth,
    confirmLoading
  } = props;
  auth_modal = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleChangeAuth(fieldsValue);
    });
  };
  return (
    <Modal
      width={800}
      destroyOnClose
      title="配置权限"
      visible={modalVisible_auth}
      onOk={okHandle}
      onCancel={() => handleModalVisible_auth()}
      confirmLoading={confirmLoading}
    >
      <div style={{ height: "60vh", overflowY: "scroll" }}>
        {authTree.length && getAuthTree(authTree)}
      </div>
    </Modal>
  );
});

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role
}))
@Form.create()
class system extends PureComponent {
  state = {
    modalVisible: false,
    modalVisible_auth: false,
    confirmLoading: false,
    formValues: {},

    currentRole: { name: "荣成市角色管理分布", id: "0" },
    currentLevel: "0-0",
    tree: null,
    editId: null,
    setAuthId: null,
    authTree: [], // 角色权限树

    checkGroup: []
  };

  columns = [
    {
      title: "序列",
      render: (text, record, index) => <div>{index + 1}</div>
    },
    {
      title: "角色名称",
      dataIndex: "roleName"
    },
    {
      title: "权限",
      align: "center",
      render: (text, record) => (
        <div onClick={() => this.setAuth(record)} className={myStyle.authBtn}>
          更改
        </div>
      )
    },
    {
      title: "备注",
      dataIndex: "remake",
      render: val => <div>{val || "--"}</div>
    },
    {
      title: "操作",
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.getById(record)}>修改</a>
          {/* <Divider type="vertical" />
          <a onClick={() => this.delRole(record)}>删除</a> */}
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    this.getAllList();
    this.getList(0);
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      editId: null
    });
  };
  handleModalVisible_auth = flag => {
    this.setState({
      modalVisible_auth: !!flag
    });
  };

  // 查询
  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf()
      };

      this.setState(
        {
          formValues: values
        },
        function() {
          this.getList(this.state.currentRole.id, fieldsValue);
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
        formValues: {}
      },
      () => {
        this.getList(this.state.currentRole.id);
      }
    );
  };

  //setAuth
  handleChangeAuth = fields => {
    this.setState({ confirmLoading: true });
    let menuIds = [];
    this.state.checkGroup.forEach(ele => {
      if (ele.checkAll) {
        menuIds.push(ele.parentId);
      }
      ele.checkedList.forEach(ele => {
        menuIds.push(parseInt(ele.split("-")[1]));
      });
    });
    const { dispatch } = this.props;
    dispatch({
      type: "role/saveAuth",
      payload: {
        menuIds: menuIds,
        roleId: this.state.setAuthId
      },
      callback: res => {
        if (res.meta.code == 200) {
          this.setState({
            confirmLoading: false,
            modalVisible_auth: false
          });
          message.success("权限更新成功");

          // 更新菜单
          dispatch({
            type: "role/getAuthTree",
            payload:localStorage.getItem('roleId'),
            callback: res => {
              let auth = []
              const getAuth = (arr) => {
                arr.forEach((ele,i) => {
                  if(ele.hasMenu){
                    auth.push(ele.menuUrl)
                  }
                  if(ele.subMenu){
                    getAuth(ele.subMenu)
    
                    // 如果有子集菜单权限，就给父级菜单权限
                    for(let i=0;i<ele.subMenu.length;i++){
                      if(ele.subMenu[i].hasMenu){
                        auth.push(ele.menuUrl);
                        break;
                      }
                    }
    
                  }
                })
              }
              getAuth(res.data.data)
    
              let obj = {
                roleId:localStorage.getItem('roleId'),
                list:auth
              }
              localStorage.setItem('auth',JSON.stringify(obj))
            }
          });
        }
      }
    });
  };

  // add or update
  handleAdd = fields => {
    this.setState({ confirmLoading: true });
    let params = { ...fields, parentId: this.state.currentRole.id };
    const { dispatch } = this.props;
    if (!this.state.editId) {
      dispatch({
        type: "role/add",
        payload: params,
        callback: res => {
          if (res.meta.code == 200) {
            this.setState({
              confirmLoading: false,
              modalVisible: false
            });
            message.success("添加成功");
            this.getList(this.state.currentRole.id);
            this.getAllList();
          }
        }
      });
    } else {
      params.roleId = this.state.editId;
      dispatch({
        type: "role/update",
        payload: params,
        callback: res => {
          if (res.meta.code == 200) {
            this.setState({
              confirmLoading: false,
              modalVisible: false,
              editId: null
            });
            message.success("修改成功");
            this.getList(this.state.currentRole.id);
            this.getAllList();
          }
        }
      });
    }
  };

  // del
  delRole = record => {
    Modal.confirm({
      title: "提示",
      content: `确定删除角色“${record.roleName}”吗`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: "role/delete",
          payload: { id: record.roleId },
          callback: res => {
            if (res.meta.code == 200) {
              message.success("删除成功");
              this.getList(this.state.currentRole.id);
              this.getAllList();
            }
          }
        });
      }
    });
  };

  // list
  getList = (id, fieldsValue) => {
    let params = { id: id };
    if (fieldsValue && fieldsValue.roleName) {
      params.roleName = fieldsValue.roleName;
    }
    const { dispatch } = this.props;
    dispatch({
      type: "role/list",
      payload: params
    });
  };

  // allList
  getAllList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "role/tree",
      payload: null,
      callback: res => {
        this.setState({
          tree: res.data.data
        });
        // 缓存角色树
        let roleTree = [];
        res.data.data.forEach(ele => {
          roleTree.push({
            title: ele.roleName,
            value: ele.roleId,
            key: ele.roleId,
            children: this.getRoleChildren(ele.subRole)
          });
        });
        localStorage.setItem("roleTree", JSON.stringify(roleTree));
      }
    });
  };
  getRoleChildren = list => {
    let arr = [];
    if (!list) return;
    list.forEach(ele => {
      arr.push({
        title: ele.roleName,
        value: ele.roleId,
        key: ele.roleId,
        children: this.getRoleChildren(ele.subRole)
      });
    });
    return arr;
  };

  // getById
  getById = record => {
    const { dispatch } = this.props;
    dispatch({
      type: "role/getById",
      payload: record.roleId,
      callback: res => {
        this.setState({
          modalVisible: true,
          editId: res.data.data.roleId
        });
        form_modal.setFieldsValue({
          roleName: res.data.data.roleName,
          remake: res.data.data.remake
        });
      }
    });
  };

  // 点击选择树
  onSelect = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      this.getList(selectedKeys[0]);
      this.setState({
        currentRole: { name: info.node.props.title, id: selectedKeys[0] },
        currentLevel: info.node.props.pos
      });
    } else {
      this.getList(0);
      this.setState({
        currentRole: { name: "荣成市角色管理分布", id: "0" },
        currentLevel: "0-0"
      });
    }
  };

  // 点击新增
  addRole = () => {
    if (this.state.currentLevel.split("-").length > 3) {
      Modal.error({
        title: "提示",
        content: `无法继续新增下级角色`
      });
      return;
    }
    Modal.confirm({
      title: "提示",
      content: `确定在“${this.state.currentRole.name}”下添加角色吗`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        this.setState({
          modalVisible: true
        });
      }
    });
  };

  // 角色树生成
  getTree = list => {
    if (list) {
      return list.map(item => {
        return (
          <TreeNode title={item.roleName} key={item.roleId}>
            {item.subRole && this.getTree(item.subRole)}
          </TreeNode>
        );
      });
    }
  };

  /*
   * 权限管理
   */
  setAuth = record => {
    const { dispatch } = this.props;
    dispatch({
      type: "role/getAuthTree",
      payload: record.roleId,
      callback: res => {
        if (res.meta.code == 200) {
          let checkGroup = [],
            list = res.data.data;
          for (let i = 0; i < list.length; i++) {
            let checkedList = [];
            let plainOptions = [];
            if (list[i].subMenu) {
              let subList = list[i].subMenu;
              for (let j = 0; j < subList.length; j++) {
                plainOptions.push({
                  label: subList[j].menuName,
                  value: subList[j].parentId + "-" + subList[j].menuId
                });
                if (subList[j].hasMenu) {
                  checkedList.push(
                    subList[j].parentId + "-" + subList[j].menuId
                  );
                }
              }
            }
            checkGroup.push({
              checkedList: checkedList,
              indeterminate:
                !!checkedList.length &&
                checkedList.length < plainOptions.length,
              checkAll: checkedList.length === plainOptions.length,
              plainOptions: plainOptions,
              parentId: list[i].menuId
            });
          }
          this.setState({
            setAuthId: record.roleId,
            modalVisible_auth: true,
            authTree: res.data.data,
            checkGroup: checkGroup
          });
        }
      }
    });
  };
  onChange = (checkedList, index) => {
    let checkGroup = this.state.checkGroup;
    checkGroup[index].checkedList = checkedList;
    checkGroup[index].indeterminate =
      !!checkedList.length &&
      checkedList.length < checkGroup[index].plainOptions.length;
    checkGroup[index].checkAll =
      checkedList.length === checkGroup[index].plainOptions.length;
    this.setState({
      checkGroup: checkGroup,
      a: checkedList.length + "_" + index // ？？？ set一个跟原来不同的数值，让组件更新数据 ？
    });
  };
  onCheckAllChange = (e, index) => {
    let checkGroup = this.state.checkGroup,
      checkedList = [];
    checkGroup[index].plainOptions.forEach(ele => {
      checkedList.push(ele.value);
    });
    checkGroup[index].checkAll = e.target.checked;
    (checkGroup[index].checkedList = e.target.checked ? checkedList : []),
      (checkGroup[index].indeterminate = false),
      this.setState({
        checkGroup: checkGroup,
        a: e.target.checked + "-" + index // ？？？ set一个跟原来不同的数值，让组件更新数据 ？
      });
  };
  getAuthTree = list => {
    return list.map((item, index) => {
      return (
        <div>
          <Checkbox
            indeterminate={this.state.checkGroup[index].indeterminate}
            onChange={e => this.onCheckAllChange(e, index)}
            checked={this.state.checkGroup[index].checkAll}
          >
            {item.menuName}
          </Checkbox>
          <div style={{ height: 10 }} />
          {item.subMenu && (
            <CheckboxGroup
              style={{ paddingLeft: 24 }}
              options={this.state.checkGroup[index].plainOptions}
              value={this.state.checkGroup[index].checkedList}
              onChange={checkedList => this.onChange(checkedList, index)}
            />
          )}
          <div style={{ height: 10 }} />
        </div>
      );
    });
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
            <FormItem label="角色名称">
              {getFieldDecorator("roleName")(<Input placeholder="请输入" />)}
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
      role: { data },
      loading
    } = this.props;

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,

      handleChangeAuth: this.handleChangeAuth,
      handleModalVisible_auth: this.handleModalVisible_auth,
      getAuthTree: this.getAuthTree
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,

      modalVisible_auth: this.state.modalVisible_auth,
      authTree: this.state.authTree
    };

    return (
      <div className={myStyle.container}>
        {/* tree */}
        <div className={myStyle.tree}>
          <div>角色分布管理</div>
          <Tree showLine defaultExpandAll={true} onSelect={this.onSelect}>
            <TreeNode title="荣成市角色管理分布" key="0">
              {data && this.getTree(this.state.tree)}
            </TreeNode>
          </Tree>
        </div>
        <div className={myStyle.table}>
          <Card bordered={false}>
            {/* table */}
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={this.addRole}>
                  新增
                </Button>
              </div>
              <div className={styles.tableListForm}>
                {this.renderSimpleForm()}
              </div>
              <StandardTable
                selectedRows={[]}
                showRowSelect="none"
                showPagination="none"
                loading={loading}
                data={{ list: data }}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                total={data.length}
              />
            </div>
            <CreateForm {...parentMethods} {...parentStates} />
            <CreateAuthForm {...parentMethods} {...parentStates} />
          </Card>
        </div>
      </div>
    );
  }
}

export default system;
