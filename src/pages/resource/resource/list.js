import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  TreeSelect,
  Upload,
  Select,
  Button,
  Avatar,
  Modal,
  message,
  Divider,
  Cascader,
  Spin,
  Menu,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import UploadImg from '@/components/UploadImg';
import Link from 'umi/link';
import { Map,Markers } from 'react-amap';

import styles from '@/less/TableList.less';
import myStyles from '@/less/resource.less';

import { checkData } from '@/utils/utils';
import { rc,fileUrl,mapKey,requestUrl_upload } from '@/global';
import { cutStr , getFullArea} from '@/utils/utils'

const installations = [
  { id: 1, name: "无线" },
  { id: 2, name: "停车" },
  { id: 3, name: "休息区" },
  { id: 4, name: "公交" },
  { id: 5, name: "储物间" },
  { id: 6, name: "卖品" },
  { id: 7, name: "器材" },
  { id: 8, name: "地板" },
  { id: 9, name: "塑胶地" },
  { id: 10, name: "更衣室" },
  { id: 11, name: "其他" },
  { id: 12, name: "洗手间" },
  { id: 13, name: "灯光" },
  { id: 14, name: "教练" },
  { id: 15, name: "空调" }
]

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
  const { vedio_name,vedio,vedioloading,modalVisible, form, handleAdd, handleModalVisible, confirmLoading, getImgUrl, infoImg, typeList, chooseType, installations, chooseInstallations,handleChange,beforeUpload } = props;
  form_modal = form;
  const okHandle = () => {
    // 图片
    form.setFieldsValue({
      gym_img: infoImg,
    });

    // 类型
    let type_ids = []
    typeList && typeList.forEach(ele => {
      if(ele.isChoose){
        type_ids.push(ele.id)
      }
    })
    if(type_ids.length > 0){
      form.setFieldsValue({
        type_ids: type_ids.join(),
      });
    }else{
      form.setFieldsValue({
        type_ids: null,
      });
    }

    // 设施
    let installations_ids = []
    installations.forEach(ele => {
      if(ele.isChoose){
        installations_ids.push(ele.id)
      }
    })
    if(installations_ids.length > 0){
      form.setFieldsValue({
        installations_ids: installations_ids.join(),
      });
    }else{
      form.setFieldsValue({
        installations_ids: null,
      });
    }
    // 视频
    form.setFieldsValue({
      gym_video: vedio,
    });


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
      width={720}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <Row>
        <Col span={24}>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="场馆图片">
            {form.getFieldDecorator('gym_img', {
              rules: [{ required: true, message: '请上传图片' }],
            })(
              <UploadImg
                getImgUrl={getImgUrl} // 获取上传文件的地址
                imgUrl={infoImg} // 获取上传文件的地址
              />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="场馆类型">
            {form.getFieldDecorator('type_ids', {
              rules: [{ required: true, message: '请选择场馆类型' }],
            })(
              <div>
                {
                  typeList && typeList.map(item => (
                    <span 
                      key={item.id}
                      onClick={() => chooseType(item.id)} 
                      className={myStyles.typeItem}
                      style={item.isChoose?{background:'#3F99EE'}:{}}
                    >
                      {item.type_name}
                    </span>
                  ))
                }
              </div>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem style={{marginBottom:8}} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="场馆视频">
            {form.getFieldDecorator('gym_video', {
              rules: [{ required: false }],
            })(
              <div>
                <Upload
                  showUploadList={false}
                  action={`${requestUrl_upload}/upload/start`}
                  data={file => {
                    return { file: file };
                  }}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  headers = {{
                    authorization: localStorage.getItem("token"),
                    id: localStorage.getItem("identityId")
                  }}
                >
                  <Button loading={vedioloading} style={{width:100}} type='primary' size='small'>上传视频</Button>
                </Upload>
                {
                  vedio&&<a style={{marginLeft:10}}>{vedio}</a>
                }
              </div>
              )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="场馆名称">
            {form.getFieldDecorator('gym_name', {
              rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="开放时间">
            {form.getFieldDecorator('openTime', {
              rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="费用">
            {form.getFieldDecorator('price', {
              rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
            })(<Input type='number' placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="负责人">
            {form.getFieldDecorator('connect_user', {
              rules: [{ required: false, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        {/* <Col span={12}>
          <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="联系方式">
            {form.getFieldDecorator('connect_user_tel', {
              rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col> */}
      </Row>
      <Row>
        <Col span={12}>
          <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="所属区域">
            {form.getFieldDecorator('area_id', {
              rules: [{ required: true, message: '请选择'}],
            })(
              <Cascader options={JSON.parse(localStorage.getItem('areaTree'))} placeholder="请选择" showSearch />,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="场馆电话">
            {form.getFieldDecorator('connect_user_tel', {
              rules: [{ message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem style={{marginBottom:8}} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="场馆地址">
            {form.getFieldDecorator('address', {
              rules: [{ required: true, message: '请输入(小于50个字符)', whitespace: true, max: 50 }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="场馆设施">
            {form.getFieldDecorator('installations_ids', {
              rules: [{ required: true, message: '请选择场馆设施' }],
            })(
              <div>
                {
                  installations && installations.map(item => (
                    <span 
                      key={item.id}
                      onClick={() => chooseInstallations(item.id)} 
                      className={myStyles.typeItem}
                      style={item.isChoose?{background:'#3F99EE'}:{}}
                    >
                      {item.name}
                    </span>
                  ))
                }
              </div>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem style={{marginBottom:8}} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="场馆介绍">
            {form.getFieldDecorator('introduce', {
              rules: [{ required: true, message: '请输入(小于200个字符)', whitespace: true, max: 200 }],
            })(<textarea className={myStyles.formtextarea} placeholder="请输入场馆介绍和荣誉展示"></textarea>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem style={{marginBottom:8}} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="备注">
            {form.getFieldDecorator('remark', {
              rules: [{ message: '请输入(小于200个字符)', whitespace: true, max: 200 }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

// 定位地图
const CreateForm_local = Form.create()(props => {
  const { modalVisible_local, form,handleModalVisible_local,clickMap,okaddlongandlat,locationInfo } = props;
  const markers = [{
    position:{
      longitude: locationInfo && locationInfo.longitude, 
      latitude: locationInfo && locationInfo.latitude
    },
    title:locationInfo && locationInfo.gym_name,
  }]

  const okHandle = () => {
    okaddlongandlat(locationInfo)
  };
  const events = {
    click: (e) => {
      clickMap(e)
    },
  }
  return (
    <Modal
      title="定位"
      width="800px"
      height='400px'
      visible={modalVisible_local}
      onOk={okHandle}
      onCancel={() => handleModalVisible_local()}
    >
    <div style={{position:'relative',bottom:10}}>
      经度 ：{locationInfo && locationInfo.longitude} &nbsp;纬度 ：{locationInfo && locationInfo.latitude}
    </div>
    <div style={{height:'500px',width:'100%'}}>
      <Map
        plugins={['ToolBar']}
        zoom={14}
        amapkey={mapKey}
        events={events}
        center={{
          longitude:(locationInfo && locationInfo.longitude)||122.487084,
          latitude:(locationInfo && locationInfo.latitude)||37.16599
        }}
      >
        <Markers
          markers={markers}
        />
      </Map>
    </div>
      
    </Modal>
  );
});

@connect(({ resource, loading }) => ({
  resource,
  loading: loading.models.resource,
}))
@Form.create()
class resource extends PureComponent {
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

    installations:installations,
  };
  columns = [
    {
      title: '体育场馆图片',
      render(val,record) {
        return (
          record.gym_img?
          <Avatar shape="square" size={40} src={fileUrl+'/'+record.gym_img}/>:
          '--'
        )
      }
    },
    {
      title: '场馆id',
      dataIndex: 'id',
    },
    {
      title: '体育场馆名称',
      dataIndex: 'gym_name',
    },
    {
      title: '体育场馆分类',
      dataIndex: 'type_name',
    },
    {
      title: '负责人',
      dataIndex: 'connect_user',
      render:(val) => (<div>{val||'--'}</div>)
    },
    {
      title: '联系方式',
      dataIndex: 'connect_user_tel',
      render:(val) => (<div>{val||'--'}</div>)
    },
    {
      title: '地址',
      dataIndex: 'address',
      render:(val) => (<div>{val?cutStr(val,10):'--'}</div>)
    },
    {
      title: '开放时间',
      dataIndex: 'open_time',
      render:(val) => (<div>{val?val:'--'}</div>)
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render:(val) => (<div>{val?cutStr(val,10):'--'}</div>)
    },
    // {
    //   title: '预约次数',
    //   dataIndex: 'count',
    //   render:(val) => (<div>{val || 0}</div>)
    // },
    {
      title:'场馆教练',
      dataIndex:'coach',
      render:(text, record)=>{
        return(
        <Fragment>
          <Link to={`${rc}/resource/resource/coachDetail?gymId=${record.id}`}>
            查看教练
          </Link>
        </Fragment>
      )}
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.setLocation(record)}>定位</a>
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
    this.getType();
  }

  // 对话框
  handleModalVisible = flag => {
    if(this.state.editId){
      this.init()
      let params = {
        pn: this.state.currentPage,
        ps: this.state.pageSize,
      };
      // this.getList(params);
    }
    this.setState({
      modalVisible: !!flag,
      editId: null,
      infoImg:''
    });

    form_modal.resetFields();

  };
  handleModalVisible_local = flag => {
    this.setState({
      modalVisible_local: !!flag,
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
          this.getList({ pn: this.state.currentPage, ps: this.state.pageSize, ...values });
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
    fields.area_id = fields.area_id[1]
    const { dispatch } = this.props;
    if(!this.state.editId){// 添加
      dispatch({
        type: 'resource/add',
        payload: fields,
        callback: res => {
          this.setState({ confirmLoading: false });
          if (res.code == 200) {
            this.handleModalVisible();
            this.init()
            form_modal.resetFields();
            this.getList({
              pn: this.state.currentPage,
              ps: this.state.pageSize,
              ...this.state.formValues,
            });
            message.success('添加成功');
          }
        },
      });
    }else{//修改
      fields.id = this.state.editId
      dispatch({
        type: 'resource/update',
        payload: fields,
        callback: res => {
          this.setState({ confirmLoading: false });
          if (res.code == 200) {
            this.handleModalVisible();
            this.init()
            form_modal.resetFields();
            this.getList({
              pn: this.state.currentPage,
              ps: this.state.pageSize,
              ...this.state.formValues,
            });
            message.success('添加成功');
          }
        },
      });
    }
  };

  // list
  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/list',
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
          type: 'resource/del',
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
  edit = function(e, record) {
    if (e.key == 1) {
      this.state.installations.forEach(ele => {
        record.installations_ids.split(",").forEach(item => {
          if(ele.id == item){
            ele.isChoose = true
          }
        })
      })
      this.state.typeList.forEach(ele => {
        record.type_ids.split(",").forEach(item => {
          if(ele.id == item){
            ele.isChoose = true
          }
        })
      })
      this.setState({
        modalVisible: true,
        editId: record.id,
        infoImg:record.gym_img,
        vedio:record.gym_video
      },() => {
        form_modal.setFieldsValue({
          gym_name: record.gym_name,
          price: record.price+'',
          connect_user: record.connect_user,
          connect_user_tel: record.connect_user_tel,
          area_id: getFullArea(record.area_id),
          gym_tel: record.gym_tel,
          address: record.address,
          introduce: record.introduce,
          remark: record.remark,
          gym_video:record.gym_video,
          openTime:record.open_time,
        });
      });
    } else {
      this.delete([record.id]);
    }
  };

  // 获取分类
  getType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/typeList',
      payload: {},
      callback: res => {
        if (res.code == 200) {
          this.setState({
            typeList:res.data.list
          });
        }
      },
    });
  }

  getImgUrl = url => {
    this.setState({ infoImg: url });
  };

  chooseType = id => {
    let a = ''
    let typeList = this.state.typeList
    typeList.forEach(ele => {
      if(ele.id == id){
        ele.isChoose = !ele.isChoose
        a = ele.isChoose
      }
    });
    this.setState({
      typeList:typeList,
      typeid:id + '' + a
    })
  }

  chooseInstallations = id => {
    let a = ''
    let installations = this.state.installations
    installations.forEach(ele => {
      if(ele.id == id){
        ele.isChoose = !ele.isChoose
        a = ele.isChoose
      }
    });
    this.setState({
      installations:installations,
      installationsid:id + '' + a
    })
  }

  // 初始化 installations typeList
  init = () => {
    let installations = this.state.installations;
    let typeList = this.state.typeList;
    installations.forEach(ele => {
      ele.isChoose = false;
    })
    typeList.forEach(ele => {
      ele.isChoose = false;
    })
  }

  // 定位
  setLocation = record => {
    console.log(record)
    this.setState({
      modalVisible_local:true,
      locationInfo:record
    })
  }
  clickMap = (e) => {
    let locationInfo = this.state.locationInfo;
    locationInfo.longitude = e.lnglat.lng;
    locationInfo.latitude = e.lnglat.lat;
    this.setState({
      longitude:e.lnglat.lng,
      latitude:e.lnglat.lat,
      locationInfo:locationInfo,
    })
  }
  okaddlongandlat = (locationInfo) => {
    this.setState({ confirmLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/update',
      payload: locationInfo,
      callback: res => {
        this.setState({ confirmLoading: false });
        if (res.code == 200) {
          this.handleModalVisible_local();
          // this.getList({
          //   pn: this.state.currentPage,
          //   ps: this.state.pageSize,
          //   ...this.state.formValues,
          // });
          message.success('定位成功');
        }
      },
    });
  }

  // 上传文件限制
  beforeUpload = file => {
    console.log(file)
    const isJPG = file.type === 'video/mp4' || file.type === 'video/avi' || file.type === 'video/3gp';
    if (!isJPG) {
      message.error('只能上传视频格式的文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('视频大小不能超过 10 M');
    }
    return isJPG && isLt2M;
  };
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ vedioloading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({ 
        vedioloading: false ,
        vedio:info.file.response.data.finalFileName,
        vedio_name:info.file.name
      });
    }
  };

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {typeList} = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="场馆名称">
              {getFieldDecorator('a_gym_name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="场馆分类">
              {getFieldDecorator('a_type_id')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                {
                  typeList && typeList.map(item => (
                    <Option key={item.id}>{item.type_name}</Option>
                  ))
                }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="负责人">
              {getFieldDecorator('a_connect_name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="联系方式">
              {getFieldDecorator('a_connect_tel')(<Input placeholder="请输入" />)}
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
      resource: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      getImgUrl:this.getImgUrl,
      chooseType:this.chooseType,
      chooseInstallations:this.chooseInstallations,
      beforeUpload:this.beforeUpload,
      handleChange:this.handleChange,

      // map
      handleModalVisible_local:this.handleModalVisible_local,
      okaddlongandlat:this.okaddlongandlat,
      clickMap:this.clickMap,
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
      infoImg:this.state.infoImg,
      typeList:this.state.typeList,
      installations:this.state.installations,
      vedioloading:this.state.vedioloading,
      vedio:this.state.vedio,
      vedio_name:this.state.vedio_name,

      // map
      modalVisible_local:this.state.modalVisible_local,
      locationInfo:this.state.locationInfo

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
                <Button type="danger" onClick={() => this.delete()}>
                  删除
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
                total={data.itemCount}
              />
            </div>
          </Card>
          <CreateForm {...parentMethods} {...parentStates} />
          <CreateForm_local {...parentMethods} {...parentStates} />
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

export default resource;
