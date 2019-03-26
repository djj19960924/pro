import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  TreeSelect,
  Select,
  Button,
  Modal,
  message,
  Divider,
  Spin,
  Tabs,
  Menu,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import Link from 'umi/link';

import styles from '@/less/TableList.less';

import { checkData } from '@/utils/utils';
import { rc } from '@/global';

const TabPane = Tabs.TabPane;
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
  const { modalVisible, form, handleAdd, handleModalVisible, confirmLoading } = props;
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
      title="新增/修改"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ specialist, loading }) => ({
  specialist,
  loading: loading.models.specialist,
}))
@Form.create()
class resource extends PureComponent {
  state = {
    modalVisible: false,
    confirmLoading: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    editId: null,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据

    key:'type'
  };

  columns = [
    {
      title: "序列",
      render(val, record, index) {
        return <div>{index + 1}</div>;
      }
    },
    {
      title: '名称' ,
      dataIndex: 'name',
    },
    {
      title: '操作',
      width: '20%',
      render: (text, record) => (
        <Fragment>
          {/* <Link to={`${rc}/tice/equipment/device?pointId=${record.id}`}>详情</Link> */}
          <a onClick={() => this.edit({key:1},record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.edit({key:2},record.id)}>删除</a>
          {/* <Dropdown overlay={this.menu(record.id)} trigger={['click']}>
            <a className="ant-dropdown-link">
              编辑 <Icon type="down" />
            </a>
          </Dropdown> */}
        </Fragment>
      ),
    },
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
      ps: this.state.pageSize,
    };
    this.getList(params);
  }

  // 对话框
  handleModalVisible = flag => {
    if(this.state.editId){
      let params = {
        pn: this.state.currentPage,
        ps: this.state.pageSize,
      };
      this.getList(params);
    }
    this.setState({
      modalVisible: !!flag,
      editId: null,
    });

    form_modal.resetFields();
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

  // add or update
  handleAdd = fields => {
    this.setState({ confirmLoading: true });
    this.state.editId && (fields.id = this.state.editId);
    const { dispatch } = this.props;
    dispatch({
      type: `specialist/${this.state.key}Add`,
      payload: fields,
      callback: res => {
        this.setState({ confirmLoading: false });
        if (res.code == 200) {
          this.handleModalVisible();
          form_modal.resetFields();
          this.getList({
            pn: this.state.currentPage,
            ps: this.state.pageSize,
            ...this.state.formValues,
          });
          if(res.data == '类别已存在' || res.data == "职位已存在"){
            message.warning(res.data);
            return;
          }
          if (fields.id) {
            message.success('修改成功');
          } else {
            message.success('添加成功');
          }
        }
      },
    });
  };

  // list
  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: `specialist/${this.state.key}List`,
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

  //delete
  delete = idList => {
    let ids = [];
    if (idList) {
      ids = idList;
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
          type: `specialist/${this.state.key}Del`,
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

  // 编辑
  edit = function(e, id) {
    if (e.key == 1) {
      this.setState({
        modalVisible: true,
        editId: id.id,
      },() => {
        form_modal.setFieldsValue({
          name: id.name,
        });
      });
    } else {
      this.delete([id]);
    }
  };

  onChange = (key) => {
    this.setState({
      currentPage:1,
      key:key
    },() => {
      this.getList({
        pn: this.state.currentPage,
        ps: this.state.pageSize,
      });
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
            <FormItem label="名称">
              {getFieldDecorator('a_name')(<Input placeholder="请输入" />)}
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
      specialist: { data },
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

    const arr = [
      {tab:'服务类别',key:'type'},
      {tab:'职务头衔',key:'postion'},
    ]

    if (checkData(data)) {
      return (
        <Card bordered={false}>
          <Tabs onChange={this.onChange} tabPosition='left'>
          {
            arr.map(ele => (
              <TabPane tab={ele.tab} key={ele.key}>
                <div style={{marginLeft:20}} className={styles.tableList}>
                  <div className={styles.tableListOperator}>
                    <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                      新增
                    </Button>
                    <Button type="danger" onClick={() => this.delete()}>
                      删除
                    </Button>
                  </div>
                  {/* <div className={styles.tableListForm}>{this.renderSimpleForm()}</div> */}
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
                <CreateForm {...parentMethods} {...parentStates} />
              </TabPane>
            ))
          }
          </Tabs>
        </Card>
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
