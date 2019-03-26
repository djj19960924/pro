import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  TreeSelect,
  Avatar,
  Form,
  Input,
  Divider,
  Select,
  Cascader,
  Button,
  Modal,
  message,
  Spin,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { Map , Markers } from 'react-amap';
import UploadImg from '@/components/UploadImg';

import styles from '@/less/TableList.less';

import { checkData , getFullArea } from '@/utils/utils';
import { mapKey,fileUrl } from '@/global';

const FormItem = Form.Item;
message.config({ top: 100 });

const defaultImg = 'http://webmap0.bdimg.com/client/services/thumbnails?width=132&height=104&align=center,center&quality=100&src=http%3A%2F%2Fhiphotos.baidu.com%2Fspace%2Fpic%2Fitem%2F4afbfbedab64034ff0749211a7c379310a551d6f.jpg'

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
    editId,
    getImgUrl,
  } = props;
  form_modal = form;
  const okHandle = () => {
    // 图片
    form.setFieldsValue({
      img_urls: infoImg,
    });

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新增/修改健身站点"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="站点名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属区域">
        {form.getFieldDecorator('communityId', {
          rules: [{ required: true, message: '请选择'}],
        })(
          <Cascader options={JSON.parse(localStorage.getItem('areaTree'))} placeholder="请选择" showSearch />
          )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图片">
        {form.getFieldDecorator('img_urls', {
          rules: [{ required: true, message: '请选择'}],
        })(
          <UploadImg
            getImgUrl={getImgUrl} // 获取上传文件的地址
            imgUrl={infoImg} // 获取上传文件的地址
          />
          )}
      </FormItem>
    </Modal>
  );
});

// 定位地图
const CreateForm_local = Form.create()(props => {
  const { modalVisible_local, form,handleModalVisible_local,clickMap,longitude,latitude,okaddlongandlat } = props;

  const okHandle = () => {
    okaddlongandlat(longitude,latitude)
  };
  const events = {
    click: (e) => {
      clickMap(e)
    },
  }  
  const markers = [{
    position:{
      longitude: longitude, 
      latitude: latitude
    }
  }]
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
      经度 ：{longitude} &nbsp;纬度 ：{latitude}
    </div>
    <div style={{height:'500px',width:'100%'}}>
      <Map
        plugins={['ToolBar']}
        zoom={14}
        amapkey={mapKey}
        events={events}
        center={{ longitude:longitude || 122.487084 , latitude:latitude || 37.16599 }}
      >
      {
        longitude && latitude && 
        <Markers
          markers={markers}
        />
      }
      </Map>
    </div>
      
    </Modal>
  );
});

@connect(({ villageList, loading }) => ({
  villageList,
  loading: loading.models.villageList,
}))
@Form.create()
class repairs extends PureComponent {
  state = {
    areaTree: JSON.parse(localStorage.getItem('areaTree')),
    communityList:[{name:'等级划分',id:4}],

    modalVisible: false,
    showCommunityList:false,
    formValues: {}, // 筛选表单中的值

    editId: null,

    organizeId:63,
  };

  columns = [
    {
      title: '序列',
      render: (text, record, index) => <div>{index+1}</div>,
    },
    {
      title: '站点图片',
      dataIndex: 'img_urls',
      render: val => {
        return (
          <Avatar shape="square" size={40} src={val?(fileUrl + val):defaultImg}/>
        )
      }
    },
    {
      title: '站点名称',
      dataIndex: 'name',
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      render: val => <div>{val?val:'--'}</div>,
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      render: val => <div>{val?val:'--'}</div>,
    },
    {
      title: '地理位置',
      render: (val,record) => <a onClick={() => this.location(record)}>定位</a>,
    },
    {
      title: '图片预览',
      dataIndex: 'img_urls',
      render: (val,record) => (
        val ? <a target='_blank' href={fileUrl + val}>预览</a> : '暂无'
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.update(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.delete(record)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.getList();
  }

  // 对话框
  handleModalVisible = flag => {
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
        },
        function() {
          this.getList(fieldsValue);
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
      },
      () => {
        this.getList();
      }
    );
  };

  // list
  getList = (fields) => {
    var params = {id:this.state.organizeId}
    if(fields){
      params.communityId = fields.communityId[1]
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'villageList/list',
      payload: params,
    });
  };  
  
  // add or update
  handleAdd = fields => {
    fields.communityId = fields.communityId[1]
    fields.organizeId = this.state.organizeId
    this.setState({ confirmLoading: true });
    let params = {
      paramTable:'village',
      param:fields
    }
    if(!this.state.editId){
      this.props.dispatch({
        type: 'repairsArea/add',
        payload: params,
        callback: res => {
          if (res.code == 200) {
            this.setState({
              confirmLoading: false,
              modalVisible: false,
            });
            message.success('添加成功');
            this.getList();
          }
        },
      });
    }else{
      params.param.id = this.state.editId;
      this.props.dispatch({
        type: 'repairsArea/add',
        payload: params,
        callback: res => {
          if (res.code == 200) {
            this.setState({
              confirmLoading: false,
              modalVisible: false,
              editId: null,
            });
            message.success('修改成功');
            this.getList();
          }
        },
      });
    }
  };

  // delete
  delete = record => {
    Modal.confirm({
      title: '提示',
      content: `确定删除区域“${record.name}”吗`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        let params = { 
          paramId:record.id,
          paramTable:'village'
        }
        const { dispatch } = this.props;
        dispatch({
          type: 'repairsArea/delete',
          payload: params,
          callback: res => {
            if (res.code == 200) {
              message.success('删除成功');
              this.getList();
            }
          },
        });
      },
    });
  }
  
  // update
  update = record => {
    console.log(record)
    this.setState({
      modalVisible: true,
      editId: record.id,
      infoImg:record.img_urls
    },()=>{
      form_modal.setFieldsValue({
        name: record.name,
        communityId:getFullArea(record.communityId),
      });
    });
  }

  // 定位
  location = (record) => {
    this.setState({
      modalVisible_local:true,
      locationVillageId:record.id,
      longitude:record.longitude,
      latitude:record.latitude,
    })
  }
  clickMap = (e) => {
    this.setState({
      longitude:e.lnglat.lng,
      latitude:e.lnglat.lat,
    })
  }
  okaddlongandlat = (longitude,latitude) => {
    this.setState({
      confirmLoading: true,
    });
    let params = {
      paramTable:'village',
      param:{
        id:this.state.locationVillageId,
        longitude:longitude,
        latitude:latitude,
      }
    }
    this.props.dispatch({
      type: 'repairsArea/add',
      payload: params,
      callback: (res) => {
        if (res.code == 200) {
          this.setState({
            confirmLoading: false,
          });
          message.success('定位成功');
          this.getList();
        }
      },
    });
    this.setState({
      modalVisible_local: false,
      currentPage:1,
    });
  }

  // 图片
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
            <FormItem label="所属区域">
              {getFieldDecorator('communityId')(
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
      villageList: { data },
      loading,
    } = this.props;

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      getImgUrl:this.getImgUrl,
      okaddlongandlat:this.okaddlongandlat,
      clickMap:this.clickMap,
      handleModalVisible_local:this.handleModalVisible_local,
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      modalVisible_local: this.state.modalVisible_local,
      longitude: this.state.longitude,
      latitude: this.state.latitude,
      confirmLoading: this.state.confirmLoading,
      editId: this.state.editId,
      infoImg:this.state.infoImg,
    };

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增健身站点
                </Button>
              </div>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <StandardTable
                selectedRows={[]}
                showRowSelect="none"
                loading={loading}
                data={{list:data}}
                columns={this.columns}
                onChange={this.handleStandardTableChange}
                total={data.length}
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

export default repairs;