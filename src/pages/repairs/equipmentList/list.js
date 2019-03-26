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
  Cascader,
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

import { checkData, getnyr,getFullArea } from '@/utils/utils';
import { rc,fileUrl } from '@/global';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const type = ['设备名称','设备品牌','设备类型','','设备厂家'];
const { MonthPicker } = DatePicker;

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
    base,
    chooseVillage,
    villageList,

    getPointList,
  } = props;
  form_modal = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };

  let names,brands,types,suppliers;
  if(base){
    names = base.names.map((data)=>(<Option value={data.id} key={data.id}>{data.name}</Option>));
    brands = base.brands.map((data)=>(<Option value={data.id} key={data.id}>{data.name}</Option>));
    types = base.types.map((data)=>(<Option value={data.id} key={data.id}>{data.name}</Option>));
    suppliers = base.suppliers.map((data)=>(<Option value={data.id} key={data.id}>{data.name}</Option>));
  }
  let village;
  if(villageList){
    village = villageList.map((data)=>(<Option value={data.id} key={data.id}>{data.name}</Option>));
  }
  
  return (
    <Modal
      destroyOnClose
      title="新增/修改设施"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
      width="900px"
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备名称">
        {form.getFieldDecorator('nameId', {
          rules: [{ required: true, message: '请选择...' }],
        })(
          <Select placeholder="设备名称" style={{ width: '100%' }}>{names}</Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="基本信息">
        <div>
          <Col span={8}>
            <FormItem>
              {form.getFieldDecorator('brandId', {
                rules: [{ required: true, message: '请选择...' }],
              })(
                <Select placeholder="品牌" style={{ width: '90%' }}>{brands}</Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {form.getFieldDecorator('typeId', {
                rules: [{ required: true, message: '请选择...' }],
              })(
                <Select placeholder="类型" style={{ width: '90%' }}>{types}</Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {form.getFieldDecorator('supplierId', {
                rules: [{ required: true, message: '请选择...' }],
              })(
                <Select placeholder="厂家" style={{ width: '90%' }}>{suppliers}</Select>
              )}
            </FormItem>
          </Col>
        </div>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属站点">
        <div>
          <Col span={10}>
            <FormItem>
              {form.getFieldDecorator('communitId', {
                rules: [{ required: true, message: '请选择...' }],
              })(
                <Cascader 
                  onChange={getPointList} 
                  options={JSON.parse(localStorage.getItem('areaTree'))} 
                  placeholder="请选择" 
                  showSearch 
                  style={{ width: '90%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {form.getFieldDecorator('villageId', {
                rules: [{ required: true, message: '请选择...' }],
              })(
                <Select onSelect={chooseVillage} placeholder="请选择" style={{ width: '90%' }}>{village}</Select>
              )}
            </FormItem>
          </Col>
        </div>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="安装时间">
        {form.getFieldDecorator('installTime', {
          rules: [{ required: true, message: '请选择日期...' }],
        })(
          <MonthPicker format='YYYY/MM' /> 
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ equipment, loading }) => ({
  equipment,
  loading: loading.models.equipment,
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
      dataIndex: 'imageUrl',
      render(val,record) {
        return (
          record.imageUrl?
          <Avatar shape="square" size={40} src={fileUrl+'/'+record.imageUrl}/>:
          '--'
        )
      }
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '厂家',
      dataIndex: 'supplier',
    },
    {
      title: '安装时间',
      dataIndex: 'installTime',
      render(val) {
        return <span>{val?val.substring(0,7):'--'}</span>;
      },
    },
    {
      title: '位置',
      dataIndex: 'position',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={e => this.edit({key:1}, record)} className="ant-dropdown-link">修改</a>
          <Divider type="vertical" />
          <a onClick={e => this.edit({key:2}, record)} className="ant-dropdown-link">删除</a>
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

    // base
    const { dispatch } = this.props;
    dispatch({
      type: 'equipment/base',
      payload:this.state.organizeId,
      callback: (res) => {
        this.setState({base:res});
      },
    });
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      editId: null,
      villageList:[]
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
    let params = {
      villageId:fields.villageId,
      nameId:fields.nameId,
      brandId:fields.brandId,
      typeId:fields.typeId,
      supplierId:fields.supplierId,
      installTime:getnyr(fields.installTime),
      position:this.state.position,
      organizeId:this.state.organizeId,
      communitId:fields.communitId[1]
    }
    this.setState({ confirmLoading: true });

    if(this.state.editId){
      params.id = this.state.editId;
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'equipment/add',
      payload: params,
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
    console.log(params)
    let payload = {
      page:params.page,
      size:params.size,
      param:{
        organizeId:this.state.organizeId
      }
    }
    params.villageId && (payload.param.villageId = params.villageId)
    const { dispatch } = this.props;
    dispatch({
      type: 'equipment/list',
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
          type: 'equipment/delete',
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
  edit = function (e, record) {
    if (e.key == 1) {

      let params = {
        paramTable:'community',
        paramId:record.communitId,
        organizeId:this.state.organizeId,
      }
      this.props.dispatch({
        type: 'repairsArea/list',
        payload: params,
        callback:(res) => {
          this.setState({
            villageList:res.data.content,
            modalVisible:true,
            editId:record.id
          },() => {
            form_modal.setFieldsValue({
              nameId: record.nameId,
              brandId: record.brandId,
              typeId: record.typeId,
              supplierId: record.supplierId,
              installTime: moment(record.installTime),
              communitId:getFullArea(record.communitId),
              villageId:record.villageId,
            })
          })
        }
      });
    } else if (e.key == 2) {
      this.delete([record.id]);
    }
  };

  // 选择village
  chooseVillage = (id,e) => {
    this.setState({
      position:e.props.children
    })
  }

  // 通过id获取base中的name
  getNameFormBase = (id,base) => {
    if(!this.state.base) return;
    const x = this.state.base[base];
    if(!x) return false;
    for(let i=0;i<x.length;i++){
      if(x[i].id === id){
        return x[i].name
      }
    }
  };

  // 获取健身站点列表
  getPointList = (e) => {
    const { dispatch } = this.props;
    let params = {
      paramTable:'community',
      paramId:e[1],
      organizeId:this.state.organizeId,
    }
    dispatch({
      type: 'repairsArea/list',
      payload: params,
      callback:(res) => {
        this.setState({
          villageList:res.data.content
        })
      }
    });
  }
  getPointList_search = (e) => {
    const { dispatch } = this.props;
    let params = {
      paramTable:'community',
      paramId:e[1],
      organizeId:this.state.organizeId,
    }
    dispatch({
      type: 'repairsArea/list',
      payload: params,
      callback:(res) => {
        this.setState({
          villageList_search:res.data.content
        })
      }
    });
  }

  // 筛选表单
  renderSimpleForm() {
    const {
      dispatch,
      form: { getFieldDecorator },
    } = this.props;

    let village;
    if(this.state.villageList_search){
      village = this.state.villageList_search.map((data)=>(<Option value={data.id} key={data.id}>{data.name}</Option>));
    }

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label='所属区域'>
              {getFieldDecorator('area')(
                <Cascader onChange={this.getPointList_search} options={JSON.parse(localStorage.getItem('areaTree'))} placeholder="请选择" showSearch />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label=''>
              {getFieldDecorator('villageId')(
                <Select placeholder="请选择">{village}</Select>
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
      equipment: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      chooseVillage: this.chooseVillage,

      getPointList:this.getPointList
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
      base:this.state.base,
      villageList:this.state.villageList,
    };

    if (checkData(data)) {
      for(let i=0;i<data.list.length;i++){
        data.list[i].name = this.getNameFormBase(data.list[i].nameId,'names');
        data.list[i].brand = this.getNameFormBase(data.list[i].brandId,'brands');
        data.list[i].type = this.getNameFormBase(data.list[i].typeId,'types');
        data.list[i].supplier = this.getNameFormBase(data.list[i].supplierId,'suppliers');
      }
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
