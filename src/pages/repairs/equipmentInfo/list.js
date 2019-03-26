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

import { checkData, getnyr } from '@/utils/utils';
import { rc, fileUrl } from '@/global';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const type = ['设备名称','设备品牌','设备类型','','设备厂家'];

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
    infoImg,
    getImgUrl,
  } = props;
  form_modal = form;
  const okHandle = () => {
    form.setFieldsValue({
      imageUrl: infoImg,
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新增/修改设施信息"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="信息名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="信息类别">
        {form.getFieldDecorator('type', {
          rules: [{ required: true, message: '请选择' }],
        })(
          <Select style={{ width: '100%' }} placeholder='信息类别'>
            <Option value="0">设备名称</Option>
            <Option value="1">设备品牌</Option>
            <Option value="2">设备类型</Option>
            <Option value="4">设备厂家</Option>
          </Select>)}
      </FormItem>
      {
        form.getFieldsValue().type == '0'&&
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="信息图片">
          {form.getFieldDecorator('imageUrl', {
            rules: [{ required: true, message: '请上传图片' }],
          })(
            <UploadImg
              getImgUrl={getImgUrl} // 获取上传文件的地址
              imgUrl={infoImg} // 获取上传文件的地址
            />
          )}
        </FormItem>
      }
    </Modal>
  );
});

@connect(({ equipmentInfo, loading }) => ({
  equipmentInfo,
  loading: loading.models.equipmentInfo,
}))
@Form.create()
class system extends PureComponent {
  state = {
    modalVisible: false,
    confirmLoading: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    editId: null,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据

    organizeId:63,
  };

  columns = [
    {
      title: '设施图片',
      render(val,record) {
        return (
          record.imageUrl?
          <Avatar shape="square" size={40} src={fileUrl+'/'+record.imageUrl}/>:
          '--'
        )
      }
    },
    {
      title: '设备信息',
      dataIndex: 'name',
    },
    {
      title: '信息类别',
      dataIndex: 'type',
      render(val) {
        return <div>{type[val]}</div>;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={e => this.edit({key:1}, record.id)} className="ant-dropdown-link">修改</a>
          <Divider type="vertical" />
          <a onClick={e => this.edit({key:2}, record.id)} className="ant-dropdown-link">删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    let params = {
      page: this.state.currentPage,
      size: this.state.pageSize,
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
      page: pagination.current,
      size: pagination.pageSize,
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
          this.getList({ page: this.state.currentPage, size: this.state.pageSize, ...fieldsValue });
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
        this.getList({ page: this.state.currentPage, size: this.state.pageSize });
      }
    );
  };

  // add or update
  handleAdd = fields => {
    this.setState({ confirmLoading: true });
    fields.organizeId = this.state.organizeId;
    this.state.editId && (fields.id = this.state.editId);
    const { dispatch } = this.props;
    dispatch({
      type: 'equipmentInfo/add',
      payload: fields,
      callback: res => {
        this.setState({ confirmLoading: false });
        if (res.code == 200) {
          this.handleModalVisible();
          form_modal.resetFields();
          this.getList({
            page: this.state.currentPage,
            size: this.state.pageSize,
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
    let payload = {
      page:params.page,
      size:params.size,
      param:{
        organizeId:this.state.organizeId
      }
    }
    params.infoName && (payload.param.name = params.infoName)
    params.infoType && (payload.param.type = params.infoType)
    const { dispatch } = this.props;
    dispatch({
      type: 'equipmentInfo/list',
      payload: payload,
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

  // delete
  delete = idList => {
    let ids = [];
    if (idList) {
      ids = idList;
    } 
    else {
      Modal.warning({
        title: '提示',
        content: '暂不支持批量删除',
      });
      return;
      if (this.state.selectedRows.length == 0) {
        Modal.warning({
          title: '提示',
          content: '您还没有选择任何用户',
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
          type: 'equipmentInfo/delete',
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
              this.getList({ page: current, size: this.state.pageSize, ...this.state.formValues });
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
        type: 'equipmentInfo/get',
        payload: id,
        callback: res => {
          if (res.code == 200) {
            this.setState({
              modalVisible: true,
              editId: res.data.id,
              infoImg:res.data.imageUrl
            });
            form_modal.setFieldsValue({
              name: res.data.name,
              type: res.data.type,
            });
          }
        },
      });
    } else if (e.key == 2) {
      this.delete([id]);
    }
  };

  getImgUrl = url => {
    this.setState({ infoImg: url });
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
            <FormItem label="设施名称">
              {getFieldDecorator('infoName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="信息类别">
              {getFieldDecorator('infoType')(
                <Select placeholder='请选择'>
                  <Option value="0">设备名称</Option>
                  <Option value="1">设备品牌</Option>
                  <Option value="2">设备类型</Option>
                  <Option value="4">设备厂家</Option>
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
      equipmentInfo: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      getImgUrl:this.getImgUrl,
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
      infoImg:this.state.infoImg,
    };

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增
                </Button>
              </div>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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
          style={{ position: 'absolute', top: 140, left: 0, right: 0 }}
          size="large"
          tip="Loading..."
        />
      );
    }
  }
}

export default system;
