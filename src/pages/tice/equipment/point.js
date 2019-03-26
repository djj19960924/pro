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
  Cascader,
  message,
  Divider,
  Spin,
  Menu,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import Link from 'umi/link';

import styles from '@/less/TableList.less';

import { checkData , getFullArea } from '@/utils/utils';
import { rc } from '@/global';

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
  const { modalVisible, form, handleAdd, handleModalVisible, confirmLoading, areaTree } = props;
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
      title="新增/修改体测点"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属区域">
        {form.getFieldDecorator('areaid', {
          rules: [{ required: true, message: '请选择' }],
        })(
          <Cascader options={JSON.parse(localStorage.getItem('areaTree'))} placeholder="请选择" showSearch />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="体测点名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="负责人">
        {form.getFieldDecorator('connectUserName', {
          rules: [{ required: false, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系方式">
        {form.getFieldDecorator('connectUserTel', {
          rules: [
            { required: false, message: '请输入11位手机号', whitespace: true, max: 11, min: 11 },
          ],
        })(<Input placeholder="请输入11位手机号" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="具体地址">
        {form.getFieldDecorator('addr', {
          rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ tice_point, loading }) => ({
  tice_point,
  loading: loading.models.tice_point,
}))
@Form.create()
class tice extends PureComponent {
  state = {
    areaTree: JSON.parse(localStorage.getItem('areaTree')),
    modalVisible: false,
    confirmLoading: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    editId: null,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据
  };

  columns = [
    {
      title: '体测点',
      dataIndex: 'name',
      width: '10%',
    },
    // {
    //   title: '区域',
    //   dataIndex: 'areaName',
    //   width: '10%',
    // },
    {
      title: '负责人',
      dataIndex: 'connectUserName',
      width: '10%',
      render: text => <div>{text ? text : '--'}</div>,
    },
    {
      title: '联系方式',
      dataIndex: 'connectUserTel',
      width: '15%',
      render: text => <div>{text ? text : '--'}</div>,
    },
    {
      title: '详细地址',
      dataIndex: 'addr',
      width: '25%',
    },
    {
      title: '设备数量',
      dataIndex: 'deviceCount',
      width: '10%',
    },
    {
      title: '操作',
      width: '20%',
      render: (text, record) => (
        <Fragment>
          <Link to={`${rc}/tice/equipment/device?pointId=${record.id}`}>详情</Link>
          <Divider type="vertical" />
          <Dropdown overlay={this.menu(record.id)} trigger={['click']}>
            <a className="ant-dropdown-link">
              编辑 <Icon type="down" />
            </a>
          </Dropdown>
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

      fieldsValue.areaId&&(fieldsValue.areaId = fieldsValue.areaId[1])

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
    fields.areaid = fields.areaid[1]
    const { dispatch } = this.props;
    dispatch({
      type: 'tice_point/add',
      payload: fields,
      callback: res => {
        this.setState({ confirmLoading: false });
        if (res.meta.code == 200) {
          this.handleModalVisible();
          form_modal.resetFields();
          this.getList({
            pn: this.state.currentPage,
            ps: this.state.pageSize,
            ...this.state.formValues,
          });
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
      type: 'tice_point/list',
      payload: params,
      callback: res => {
        if (res.meta.code == 200) {
          this.setState({
            currentDataNum: res.data.data.length,
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
          content: '您还没有选择任何体测点',
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
          type: 'tice_point/delete',
          payload: ids,
          callback: res => {
            if (res.meta.code == 200) {
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
      const { dispatch } = this.props;
      dispatch({
        type: 'tice_point/edit',
        payload: id,
        callback: res => {
          if (res.meta.code == 200) {
            this.setState({
              modalVisible: true,
              editId: res.data.data.id,
            });
            form_modal.setFieldsValue({
              areaid: getFullArea(res.data.data.areaid),
              name: res.data.data.name,
              addr: res.data.data.addr,
              connectUserName: res.data.data.connectUserName,
              connectUserTel: res.data.data.connectUserTel,
            });
          }
        },
      });
    } else {
      this.delete([id]);
    }
  };

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="体测点名称">
              {getFieldDecorator('venueName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属区域">
              {getFieldDecorator('areaId')(
                <Cascader options={JSON.parse(localStorage.getItem('areaTree'))} placeholder="请选择" showSearch />
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
      tice_point: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    let data_d = {
      list:[]
    }
    if(data.data){
      data_d.list = data.data
      data_d.pagination = data.pagination;
      data_d.pagination.total = data.total;
    }

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
      areaTree: this.state.areaTree,
    };

    if (checkData(data)) {
      return ( 
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增体测点
                </Button>
                <Button type="danger" onClick={() => this.delete()}>
                  删除
                </Button>
              </div>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data_d}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                total={data.total}
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

export default tice;
