import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Divider,
  Spin,
  Menu,
  Dropdown,
  Badge,
  DatePicker,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import Link from 'umi/link';

import styles from '@/less/TableList.less';

import { checkData, getPageQuery, getnyr } from '@/utils/utils';
import { rc } from '@/global';

let project = [];
project = JSON.parse(localStorage.getItem("allProject"))
console.log(project)

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const disabled = { opacity: 0.4 },
  abled = { opacity: 1 };

message.config({ top: 100 });

// 添加设备对话框
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
      title="新增/修改设备"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备名称">
        {form.getFieldDecorator('projectId', {
          rules: [{ required: true, message: '请选择' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {project.map(item => {
              return <Option key={item.id}>{item.name + '测试仪'}</Option>;
            })}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备编号">
        {form.getFieldDecorator('deviceNo', {
          rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备状态">
        {form.getFieldDecorator('currentstatus', {
          rules: [{ required: true, message: '请选择' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            <Option value="1">正常</Option>
            <Option value="2">故障</Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="体测类别">
        {form.getFieldDecorator('devtype', {
          rules: [{ required: true, message: '请选择' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            <Option value="1">国民体质测试(AO)</Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="安装日期">
        {form.getFieldDecorator('usetime', {
          rules: [{ required: true, message: '请选择' }],
        })(<DatePicker />)}
      </FormItem>
      {/* 禁用启用状态默认为1，不用传，可更改 */}
    </Modal>
  );
});

// 设备调用对话框
let dy_modal = null;
const DiaoyongForm = Form.create()(props => {
  const { dymodalVisible, form, handleDy, handleDyModalVisible, confirmLoading, allpoint } = props;
  dy_modal = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleDy(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="设备调用"
      visible={dymodalVisible}
      onOk={okHandle}
      onCancel={() => handleDyModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem
        style={{ display: 'none' }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="projectId"
      >
        {form.getFieldDecorator('projectId', {
          rules: [{ required: true, message: '请输入' }],
        })(<Input disabled={true} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备名称">
        {form.getFieldDecorator('devName', {
          rules: [{ required: true, message: '请输入' }],
        })(<Input disabled={true} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备编号">
        {form.getFieldDecorator('deviceNo', {
          rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
        })(<Input disabled={true} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="体测点">
        {form.getFieldDecorator('venueid', {
          rules: [{ required: true, message: '请选择' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {allpoint.map(item => {
              return <Option key={item.id}>{item.name}</Option>;
            })}
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});

// 查看设备对话框
const SeeAdviceForm = Form.create()(props => {
  const { seeAdviceVisible, form, adviceInfo, handleSeeAdviceVisible } = props;
  return (
    <Modal
      destroyOnClose
      title="查看设备"
      visible={seeAdviceVisible}
      footer={null}
      onCancel={() => handleSeeAdviceVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备名称">
        {form.getFieldDecorator('devName', {
          initialValue: adviceInfo && (adviceInfo.devName+'测试仪'),
        })(<Input />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备编号">
        {form.getFieldDecorator('deviceNo', {
          initialValue: adviceInfo && adviceInfo.deviceNo,
        })(<Input />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属体测点">
        {form.getFieldDecorator('venuename', {
          initialValue: adviceInfo && adviceInfo.venueName,
        })(<Input />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备状态">
        {adviceInfo && (
          <div style={adviceInfo.currentstatus == 1 ? { color: '#52C41A' } : { color: '#F5222D' }}>
            {adviceInfo.currentstatus == 1 ? '正常' : '故障'}
          </div>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="禁用状态">
        {adviceInfo && (
          <div style={adviceInfo.status == 1 ? { color: '#52C41A' } : { color: '#F5222D' }}>
            {adviceInfo.status == 1 ? '启用' : '禁用'}
          </div>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="安装时间">
        {form.getFieldDecorator('usetime', {
          initialValue: adviceInfo && getnyr(adviceInfo.usetime),
        })(<Input />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="使用时间">
        {form.getFieldDecorator('installtime', {
          initialValue:
            adviceInfo &&
            (getnyr(adviceInfo.installtime) ? getnyr(adviceInfo.installtime) : '暂未使用'),
        })(<Input />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ tice_device, loading }) => ({
  tice_device,
  loading: loading.models.tice_device,
}))
@Form.create()
class tice extends PureComponent {
  state = {
    modalVisible: false,
    dymodalVisible: false,
    seeAdviceVisible: false,
    confirmLoading: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    editId: null,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据

    venueid: null, // 体测点id

    allpoint: [], // select中所有的体测点

    adviceInfo: null, // 查看设备信息
  };

  columns = [
    {
      title: '设备名称',
      dataIndex: 'devName',
      width: '15%',
      render: (val, record) => {
        return record.status == 2 ? (
          <a onClick={() => this.seeDeviceInfo(record)} style={{ opacity: 0.4, color: '#595959' }}>
            {val + '测试仪'}
          </a>
        ) : (
          <a onClick={() => this.seeDeviceInfo(record)} style={{ color: '#3F99EE' }}>
            {val + '测试仪'}
          </a>
        );
      },
    },
    {
      title: '设备编号',
      dataIndex: 'deviceNo',
      width: '15%',
      render(val, record) {
        return <div style={record.status == 2 ? disabled : abled}>{val}</div>;
      },
    },
    {
      title: '体测点',
      dataIndex: 'venueName',
      width: '15%',
      render(val, record) {
        return <div style={record.status == 2 ? disabled : abled}>{val}</div>;
      },
    },
    {
      title: '体测类别',
      dataIndex: 'devtype',
      width: '15%',
      render(val, record) {
        return (
          <div style={record.status == 2 ? disabled : abled}>
            {val == '1' ? '国民体质测试(AO)' : ''}
          </div>
        );
      },
    },
    {
      title: '设备状态',
      dataIndex: 'currentstatus',
      width: '10%',
      align: 'center',
      render(val, record) {
        return (
          <Badge
            style={record.status == 2 ? disabled : abled}
            status={val == 1 ? 'success' : 'error'}
            text={val == 1 ? '正常' : '故障'}
          />
        );
      },
      filterMultiple: false,
      filters: [
        {
          text: '正常',
          value: 1,
        },
        {
          text: '故障',
          value: 2,
        },
      ],
    },
    {
      title: '调用记录',
      width: '10%',
      align: 'center',
      render: (val, record) => (
        <Link
          style={record.status == 2 ? disabled : abled}
          to={`${rc}/tice/equipment/record?id=${record.id}`}
        >
          详情
        </Link>
      ),
    },
    {
      title: '操作',
      width: '20%',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleDyModalVisible(true, record)}>调用</a>
          <Divider type="vertical" />
          {record.status == 1 ? (
            <a
              style={{ color: '#F5222D' }}
              onClick={() => {
                this.disUse(record);
              }}
            >
              禁用
            </a>
          ) : (
            <a
              style={{ color: '#52C41A' }}
              onClick={() => {
                this.disUse(record);
              }}
            >
              启用
            </a>
          )}
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
    this.setState({ venueid: getPageQuery().pointId }, () => {
      let params = {
        pn: this.state.currentPage,
        ps: this.state.pageSize,
      };
      this.getList(params);
    });
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      editId: null,
    });

    form_modal.resetFields();
  };
  handleDyModalVisible = (flag, record) => {
    if (flag) {
      // 点击调用
      const { dispatch } = this.props;
      dispatch({
        type: 'tice_device/getallpoint',
        payload: null, // 区域id
        callback: res => {
          if (res.meta.code == 200) {
            dy_modal.setFieldsValue({
              devName: record.devName,
              deviceNo: record.deviceNo,
              projectId: record.projectId,
            });
            this.setState({
              editId: record.id,
              dymodalVisible: !!flag,
              allpoint: res.data.data,
            },()=>{
              console.log(res.data.data)
            });
          }
        },
      });
    } else {
      // 取消、关闭、确定
      dy_modal.resetFields();
      this.setState({
        dymodalVisible: !!flag,
        editId: null,
      });
    }
  };
  handleSeeAdviceVisible = flag => {
    this.setState({
      seeAdviceVisible: !!flag,
    });
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
      console.log(fieldsValue)

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

    fields.venueid = this.state.venueid;
    fields.usetime = getnyr(fields.usetime);

    const { dispatch } = this.props;
    dispatch({
      type: 'tice_device/add',
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
    params.venueid = this.state.venueid;
    const { dispatch } = this.props;
    dispatch({
      type: 'tice_device/list',
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
          content: '您还没有选择任何设备',
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
          type: 'tice_device/delete',
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

  // 调用
  handleDy = fields => {
    this.setState({ confirmLoading: true });
    let params = {
      id: this.state.editId,
      pid: this.state.editId,
      deviceNo: fields.deviceNo,
      projectId: fields.projectId, //
      venueid: fields.venueid,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'tice_device/updatePoint',
      payload: params,
      callback: res => {
        if (res.meta.code == 200) {
          this.setState({ confirmLoading: false });
          this.handleDyModalVisible();
          this.getList({ 
            pn: this.state.currentPage,
            ps: this.state.pageSize,
            ...this.state.formValues,
          });
          message.success('操作成功');
        }
      },
    });
  };

  // 禁用
  disUse = record => {
    let params = { id: record.id };
    record.status == 1 ? (params.status = 2) : (params.status = 1);

    const { dispatch } = this.props;
    dispatch({
      type: 'tice_device/add',
      payload: params,
      callback: res => {
        if (res.meta.code == 200) {
          this.getList({
            pn: this.state.currentPage,
            ps: this.state.pageSize,
            ...this.state.formValues,
          });
          message.success('操作成功');
        }
      },
    });
  };

  // 编辑
  edit = function(e, id) {
    if (e.key == 1) {
      const { dispatch } = this.props;
      dispatch({
        type: 'tice_device/edit',
        payload: id,
        callback: res => {
          if (res.meta.code == 200) {
            this.setState({
              modalVisible: true,
              editId: res.data.data.id,
            });
            form_modal.setFieldsValue({
              projectId: res.data.data.projectId,
              devtype: res.data.data.devtype,
              deviceNo: res.data.data.deviceNo,
              currentstatus: res.data.data.currentstatus + '',
              usetime: moment(res.data.data.usetime),
            });
          }
        },
      });
    } else {
      this.delete([id]);
    }
  };

  // 查看设备
  seeDeviceInfo = record => {
    this.setState({
      adviceInfo: record,
      seeAdviceVisible: true,
    });
  };

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* <Col md={6} sm={24}>
            <FormItem label="设备名称">
              {getFieldDecorator('devname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col> */}
          <Col md={6} sm={24}>
            <FormItem label="设备编号">
              {getFieldDecorator('deviceNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="禁用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">启用</Option>
                  <Option value="2">禁用</Option>
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
      tice_device: { data },
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
    };

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增设备
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
          <DiaoyongForm
            dymodalVisible={this.state.dymodalVisible}
            handleDyModalVisible={this.handleDyModalVisible}
            handleDy={this.handleDy}
            confirmLoading={this.state.confirmLoading}
            allpoint={this.state.allpoint}
          />
          <SeeAdviceForm
            seeAdviceVisible={this.state.seeAdviceVisible}
            adviceInfo={this.state.adviceInfo}
            handleSeeAdviceVisible={this.handleSeeAdviceVisible}
          />
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
