import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  InputNumber,
  Modal,
  message,
  Tree,
  Divider
} from "antd";
import StandardTable from "@/components/StandardTable";

import styles from "@/less/TableList.less";
import myStyle from "./area.less";

const FormItem = Form.Item;
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
      title="新增/修改区域"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="区域名称"
      >
        {form.getFieldDecorator("fullname", {
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
        {form.getFieldDecorator("tips", {
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
        {form.getFieldDecorator("num", {
          rules: [{ required: true, message: "请输入" }]
        })(<InputNumber min={1} max={100} />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ area, loading }) => ({
  area,
  loading: loading.models.area
}))
@Form.create()
class tice extends PureComponent {
  state = {
    modalVisible: false,
    confirmLoading: false,
    formValues: {},

    currentArea: { name: "荣成市区域管理分布", id: "0" },
    currentLevel: "0-0",
    tree: null,
    editId: null
  };

  columns = [
    {
      title: "序列",
      dataIndex: "num"
    },
    {
      title: "区域名称",
      dataIndex: "fullname"
    },
    {
      title: "备注",
      dataIndex: "tips",
      render: val => <div>{val || "--"}</div>
    },
    {
      title: "操作",
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.getById(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.delArea(record)}>删除</a>
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
          this.getList(this.state.currentArea.id, fieldsValue);
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
        this.getList(this.state.currentArea.id);
      }
    );
  };

  // add
  handleAdd = fields => {
    this.setState({ confirmLoading: true });
    let params = { ...fields, pid: this.state.currentArea.id };
    const { dispatch } = this.props;
    if (!this.state.editId) {
      dispatch({
        type: "area/add",
        payload: params,
        callback: res => {
          if (res.meta.code == 200) {
            this.setState({
              confirmLoading: false,
              modalVisible: false
            });
            message.success("添加成功");
            this.getList(this.state.currentArea.id);
            this.getAllList();
          }
        }
      });
    } else {
      params.id = this.state.editId;
      dispatch({
        type: "area/update",
        payload: params,
        callback: res => {
          if (res.meta.code == 200) {
            this.setState({
              confirmLoading: false,
              modalVisible: false,
              editId: null
            });
            message.success("修改成功");
            this.getList(this.state.currentArea.id);
            this.getAllList();
          }
        }
      });
    }
  };

  // del
  delArea = record => {
    Modal.confirm({
      title: "提示",
      content: `确定删除区域“${record.fullname}”吗`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: "area/delete",
          payload: record.id,
          callback: res => {
            if (res.meta.code == 200) {
              message.success("删除成功");
              this.getList(this.state.currentArea.id);
              this.getAllList();
            }
          }
        });
      }
    });
  };

  // allList
  getAllList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "area/tree",
      payload: null,
      callback: res => {
        this.setState({
          tree: res.data.data
        });
        // 缓存区域树
        let areaTree = [];
        res.data.data.forEach(ele => {
          areaTree.push({
            label: ele.fullname,
            value: ele.id,
            children: this.getChildren(ele.subDept)
          });
        });
        localStorage.setItem('areaTree', JSON.stringify(areaTree[0].children));
      }
    });
  };
  getChildren = list => {
    let arr = [];
    if (!list) return;
    list.forEach(ele => {
      arr.push({
        label: ele.fullname,
        value: ele.id,
        children: this.getChildren(ele.subDept)
      });
    });
    return arr;
  };

  // list
  getList = (id, fieldsValue) => {
    let params = { id: id };
    if (fieldsValue && fieldsValue.fullname) {
      params.fullname = fieldsValue.fullname;
    }
    const { dispatch } = this.props;
    dispatch({
      type: "area/list",
      payload: params
    });
  };

  // getById
  getById = record => {
    const { dispatch } = this.props;
    dispatch({
      type: "area/getById",
      payload: record.id,
      callback: res => {
        this.setState({
          modalVisible: true,
          editId: res.data.data.id
        });
        form_modal.setFieldsValue({
          num: res.data.data.num,
          fullname: res.data.data.fullname,
          tips: res.data.data.tips
        });
      }
    });
  };

  // 点击选择树
  onSelect = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      this.getList(selectedKeys[0]);
      this.setState({
        currentArea: { name: info.node.props.title, id: selectedKeys[0] },
        currentLevel: info.node.props.pos
      });
    } else {
      this.getList(0);
      this.setState({
        currentArea: { name: "荣成市区域管理分布", id: "0" },
        currentLevel: "0-0"
      });
    }
  };

  // 点击新增
  addArea = () => {
    if (this.state.currentLevel.split("-").length > 3) {
      Modal.error({
        title: "提示",
        content: `无法继续新增下级区域`
      });
      return;
    }
    Modal.confirm({
      title: "提示",
      content: `确定在“${this.state.currentArea.name}”下添加区域吗`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        this.setState({
          modalVisible: true
        });
      }
    });
  };

  // 树生成
  getTree = list => {
    if (list) {
      return list.map(item => {
        return (
          <TreeNode title={item.fullname} key={item.id}>
            {item.subDept && this.getTree(item.subDept)}
          </TreeNode>
        );
      });
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
            <FormItem label="区域名称">
              {getFieldDecorator("fullname")(<Input placeholder="请输入" />)}
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
      area: { data },
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
      <div className={myStyle.container}>
        {/* tree */}
        <div className={myStyle.tree}>
          <div>区域分布管理</div>
          <Tree showLine defaultExpandAll={true} onSelect={this.onSelect}>
            <TreeNode title="荣成市区域管理分布" key="0">
              {data && this.getTree(this.state.tree)}
            </TreeNode>
          </Tree>
        </div>
        <div className={myStyle.table}>
          <Card bordered={false}>
            {/* table */}
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={this.addArea}>
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
          </Card>
        </div>
      </div>
    );
  }
}

export default tice;
