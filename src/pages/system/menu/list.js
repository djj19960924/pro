import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  Modal,
  message,
  Tree,
  Divider,
  Spin,
  Menu,
  Dropdown,
  Icon
} from "antd";
import StandardTable from "@/components/StandardTable";
import Link from "umi/link";

import styles from "@/less/TableList.less";

import { checkData } from "@/utils/utils";
import { rc } from "@/global";

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");
const TreeNode = Tree.TreeNode;

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
      title="新增/修改菜单"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="菜单名称"
      >
        {form.getFieldDecorator("menuName", {})(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="菜单url"
      >
        {form.getFieldDecorator("menuUrl", {})(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="菜单图标"
      >
        {form.getFieldDecorator("menuIcon", {})(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="菜单排序"
      >
        {form.getFieldDecorator("menuOrder", {
          rules: [{ required: true, message: "请输入" }]
        })(<InputNumber min={1} max={100} />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu
}))
@Form.create()
class tice extends PureComponent {
  state = {
    modalVisible: false,
    confirmLoading: false,
    currentMenu: { name: "菜单管理", id: "0" }
  };

  componentDidMount() {
    this.getList();
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      editId: null
    });
  };

  // add or update
  handleAdd = fields => {
    this.setState({ confirmLoading: true });
    let params = { ...fields };
    this.state.editId && (params.menuId = this.state.editId);
    !this.state.editId && (params.parentId = this.state.currentMenu.id);
    const { dispatch } = this.props;
    dispatch({
      type: "menu/add",
      payload: params,
      callback: res => {
        if (res.meta.code == 200) {
          this.setState({
            confirmLoading: false
          });
          this.state.editId
            ? message.success("修改成功")
            : message.success("添加成功");
          this.handleModalVisible();
          this.getList();
        }
      }
    });
  };

  // list
  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "menu/list",
      payload: null
    });
  };

  onSelect = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      this.setState({
        currentMenu: { name: info.node.props.title, id: selectedKeys[0] }
      });
    } else {
      this.setState({
        currentMenu: { name: "菜单管理", id: "0" }
      });
    }
  };

  addMenu = () => {
    Modal.confirm({
      title: "提示",
      content: `确定在“${this.state.currentMenu.name}”下添加子菜单吗`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        this.setState({
          modalVisible: true
        });
      }
    });
  };

  editMenu = () => {
    if (this.state.currentMenu.name === "菜单管理") {
      message.error("请选择要修改的菜单");
      return;
    }
    this.setState({
      modalVisible: true,
      editId: this.state.currentMenu.id
    });
    form_modal.setFieldsValue({
      menuName: this.state.currentMenu.name.split(",")[0],
      menuUrl: this.state.currentMenu.name.split(",")[1],
      menuIcon: this.state.currentMenu.name.split(",")[2],
      menuOrder: this.state.currentMenu.name.split(",")[3]
    });
    console.log(this.state.currentMenu);
    return;
  };

  delMenu = () => {
    if (this.state.currentMenu.id == 0) {
      Modal.error({
        title: "提示",
        content: `无法删除该菜单`
      });
      return;
    }
    Modal.confirm({
      title: "提示",
      content: `确定删除菜单“${this.state.currentMenu.name}”吗`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: "menu/delete",
          payload: this.state.currentMenu.id,
          callback: res => {
            if (res.meta.code == 200) {
              message.success("删除成功");
              this.getList();
            }
          }
        });
      }
    });
  };

  // 菜单生成
  getTree = list => {
    if (list) {
      return list.map(item => {
        return (
          <TreeNode
            title={
              item.menuName +
              "," +
              item.menuUrl +
              "," +
              item.menuIcon +
              "," +
              item.menuOrder
            }
            key={item.menuId}
          >
            {item.subMenu !== null && this.getTree(item.subMenu)}
          </TreeNode>
        );
      });
    }
  };

  render() {
    const {
      menu: { data },
      loading
    } = this.props;

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading
    };

    return (
      <Card bordered={false}>
        <Button type="primary" onClick={this.addMenu}>
          添加菜单
        </Button>
        <Button
          style={{ marginLeft: 10 }}
          type="primary"
          onClick={this.editMenu}
        >
          修改
        </Button>
        <Button style={{ marginLeft: 10 }} type="danger" onClick={this.delMenu}>
          删除
        </Button>
        <Tree showLine defaultExpandedKeys={["0"]} onSelect={this.onSelect}>
          <TreeNode title="菜单管理" key="0">
            {data && this.getTree(data)}
          </TreeNode>
        </Tree>
        <CreateForm {...parentMethods} {...parentStates} />
      </Card>
    );
  }
}

export default tice;
