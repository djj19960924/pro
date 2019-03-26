import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Dropdown,
  Menu,
  Button,
  Icon,
  Modal,
  message,
  Tree,
  Carousel,
  Upload,
  Divider,
  Spin,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { Map } from 'react-amap';
import UploadImgs from '@/components/UploadImgs'
import { mapKey } from '@/global';
import { checkData, getPageQuery, getnyr } from '@/utils/utils';

import styles from '@/less/TableList.less';
import myStyle from './area.less';
import { requestUrl_pingtai, fileUrl } from '@/global.js';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

message.config({ top: 100 });

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
      title="新增/修改区域"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="区域名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
        })(<Input placeholder="请输入" />)}
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
        center={{longitude:122.487084, latitude:37.16599}}
      >
      </Map>
    </div>
        
    </Modal>
  );
});
// 上传图片
const CreateForm_img = Form.create()(props => {
  const { modalVisible_img, form, handleModalVisible_img, okSaveImg, imgList, getImgList } = props;

  return (
    <Modal
      title="上传小区图片"
      width={680}
      visible={modalVisible_img}
      onOk={okSaveImg}
      onCancel={() => handleModalVisible_img()}
    >
      <UploadImgs 
        getImgList={getImgList} 
        imgList={imgList}
        type='picture'
        max={5}
      >
      </UploadImgs>
    </Modal>
  );
});

@connect(({ repairsArea, loading }) => ({
  repairsArea,
  loading: loading.models.repairsArea,
}))
@Form.create()
class repairs extends PureComponent {
  state = {
    modalVisible: false,
    modalVisible_local: false,
    modalVisible_img:false,
    imgList:[],
    confirmLoading: false,
    formValues: {},

    currentArea: { name: '', id: '0' },
    currentLevel: '0-0',
    tree: null,
    editId: null,

    organizeId:63,
  };

  // 区、镇
  columns1 = [
    {
      title: '序列',
      dataIndex: 'num',
    },
    {
      title: '区域名称',
      dataIndex: 'fullname',
    },
    {
      title: '备注',
      dataIndex: 'tips',
      render: val => <div>{val || '--'}</div>,
    },
  ];  
  // 社区
  columns2 = [
    {
      title: '序列',
      render: (text, record, index) => <div>{index+1}</div>,
    },
    {
      title: '区域名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.getById(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.delArea(record)}>删除</a>
        </Fragment>
      ),
    },
  ];
  // 小区
  columns3 = [
    {
      title: '序列',
      render: (text, record, index) => <div>{index+1}</div>,
    },
    {
      title: '区域名称',
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
      title: '图片',
      render: (text, record) => (
        record.img_urls?<a onClick={() => this.preview(record)}>预览</a>:'--'
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.location(record)}>定位</a>
          <Divider type="vertical" />
          <a onClick={() => this.saveImg(record)}>添加图片</a>
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
    this.getAllList();
    this.getList();
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      editId: null,
    });
  };
  handleModalVisible_local = flag => {
    this.setState({
      modalVisible_local: !!flag,
    });
  };
  handleModalVisible_img = flag => {
    this.setState({
      modalVisible_img: !!flag,
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

  // add
  handleAdd = fields => {
    let params = {};
    if(this.state.currentLevel.split('-').length == 3){//添加社区
      params = {
        paramTable:'community',
        param:{
          name:fields.name,
          streetId:this.state.currentArea.id,
          organizeId:this.state.organizeId
        }
      }
    }
    if(this.state.currentLevel.split('-').length == 4){//添加小区
      params = {
        paramTable:'village',
        param:{
          name:fields.name,
          communityId:this.state.currentArea.id,
          organizeId:this.state.organizeId
        }
      }
    }
    this.setState({ confirmLoading: true });
    // let params = { ...fields, pid: this.state.currentArea.id };
    const { dispatch } = this.props;
    if (!this.state.editId) {
      dispatch({
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
    } else {
      params.param.id = this.state.editId;
      dispatch({
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

  edit = (e,record) => {
    if(e.key == 1){
      this.getById(record)
    }
    if(e.key == 2){
      this.delArea(record)
    }
  }

  // del
  delArea = record => {
    Modal.confirm({
      title: '提示',
      content: `确定删除区域“${record.name}”吗`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        let params = { paramId:record.id }
        if(this.state.currentLevel.split('-').length == 3){// 删除社区
          params.paramTable = 'community'
        } 
        if(this.state.currentLevel.split('-').length == 4){// 删除小区
          params.paramTable = 'village'
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
  };

  // treeList
  getAllList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairsArea/tree',
      payload: null,
      callback: res => {
        this.setState({
          tree: res.data.data,
        });
      },
    });
  };

  // list
  getList = (fieldsValue) => {
    const { dispatch } = this.props;
    if (this.state.currentLevel.split('-').length <= 2) {
      let params = {
        id:this.state.currentArea.id
      }
      fieldsValue&&(params.fullname = fieldsValue.areaName)
      dispatch({
        type: 'repairsArea/list_',
        payload: params,
      });
    }else if(this.state.currentLevel.split('-').length == 3){
      let params = {
        paramTable:'street',
        paramId:this.state.currentArea.id,
        organizeId:this.state.organizeId,
      }
      fieldsValue&&(params.name = fieldsValue.areaName)
      dispatch({
        type: 'repairsArea/list',
        payload: params,
      });
    }else if(this.state.currentLevel.split('-').length == 4){
      let params = {
        paramTable:'community',
        paramId:this.state.currentArea.id,
        organizeId:this.state.organizeId,
      }
      fieldsValue&&(params.name = fieldsValue.areaName)
      dispatch({
        type: 'repairsArea/list',
        payload: params,
      });
    }
  };

  // getById
  getById = record => {
    let params = { id:record.id }
    if(this.state.currentLevel.split('-').length == 3){// 获取社区
      params.paramTable = 'community'
    } 
    if(this.state.currentLevel.split('-').length == 4){// 获取小区
      params.paramTable = 'village'
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'repairsArea/getById',
      payload: params,
      callback: res => {
        this.setState({
          modalVisible: true,
          editId: res.data.id,
        });
        form_modal.setFieldsValue({
          name: res.data.name,
        });
      },
    });
  };

  // 点击选择树
  onSelect = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      this.setState({
        currentArea: { name: info.node.props.title, id: selectedKeys[0] },
        currentLevel: info.node.props.pos,
      },() => {
        this.getList();
      });
    } else {
      this.setState({
        currentArea: { name: '', id: '0' },
        currentLevel: '0-0',
      },() => {
        this.getList();
      });
    }
  };

  // 点击新增
  addArea = () => {
    if (this.state.currentLevel.split('-').length < 2
      || this.state.currentLevel.split('-').length > 3) {
      Modal.error({
        title: '提示',
        content: `无法在该级下新增区域`,
      });
      return;
    }
    Modal.confirm({
      title: '提示',
      content: `确定在“${this.state.currentArea.name}”下添加区域吗`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.setState({
          modalVisible: true,
        });
      },
    });
  };

  // 树生成
  getTree = list => {
    if (list) {
      return list.map(item => {
        return (
          <TreeNode isLeaf={false} title={item.fullname} key={item.id}>
            {item.subDept && this.getTree(item.subDept)}
            {/* {this.getTree(this.state.childTreeData)} */}
          </TreeNode>
        );
      });
    }
  };
  setTree = (list,id,subDept) => {
      list.forEach(ele => {
        if(ele.id == id){
          ele.subDept = subDept
        }else{
          ele.subDept&&this.setTree(ele.subDept,id,subDept)
        }
      })
      return list;
  }

  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      const { dispatch } = this.props;
      const id = treeNode.props.eventKey
      if (treeNode.props.pos.split('-').length <= 2) {
        setTimeout(() => {
          resolve();
        }, 200);
      }
      else{
        let params = {// 社区 小区 
          paramTable:'street',
          paramId:id,
          organizeId:this.state.organizeId,
        }
        if(treeNode.props.pos.split('-').length == 4){
          params.paramTable = 'community'
        }
        dispatch({
          type: 'repairsArea/treeList',
          payload: params,
          callback:(res) => {
            let subDept = [];
            res.data.content.forEach(ele => {
              subDept.push({
                fullname:ele.name,
                id:ele.id,
                pid:id
              })
            });
            this.setTree(this.state.tree,id,subDept)
            resolve();
          }
        });
      }
    });
  }

  // 预览
  preview = (record) => {
    
  }
  // 定位
  location = (record) => {
    this.setState({
      modalVisible_local:true,
      locationVillageId:record.id,
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
            modalVisible: false,
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
  // 添加图片
  saveImg = (record) => {
    this.props.dispatch({
      type: 'repairsArea/getById',
      payload: {
        id:record.id,
        paramTable:'village'
      },
      callback: res => {
        if(res.code == 200){
          if(res.data.img_urls){
            let str = res.data.img_urls;
            let arr = str.split(',')
            arr.forEach((ele,index) => {
              arr[index] = {
                uid:ele.split(';')[0],
                name:ele.split(';')[1],
                url:ele.split(';')[2],
              }
            })
            this.setState({
              imgList:arr
            });
          }else{
            this.setState({
              imgList:[]
            });
          }
          this.setState({
            modalVisible_img: true,
            changeImgVillageId:record.id,
          });
        }
      },
    });
  }
  okSaveImg = () => {
    this.setState({ confirmLoading: true });
    let params = {
      paramTable:'village',
      param:{
        id:this.state.changeImgVillageId,
        img_urls:this.state.imgList,
      }
    }
    this.props.dispatch({
      type: 'repairsArea/add',
      payload: params,
      callback: res => {
        if (res.code == 200) {
          this.setState({
            confirmLoading: false,
            modalVisible_img: false,
          });
          message.success('添加图片成功');
          this.getList();
        }
      },
    });
  }
  getImgList = (e , type) => {
    let arr = this.state.imgList;
    if(type == 'done'){
      arr.push({
        uid:e.data.finalFileName.split('/')[4].substring(0,e.data.finalFileName.split('/')[4].length - 4),
        url:e.data.finalFileName,
        name:e.data.finalFileName.split('/')[4],
      })
    }
    if(type == 'removed'){
      arr.forEach((ele,index) => {
        if(ele.uid == e.file.uid){
          arr.splice(index,1)
        }
      })
    }
    this.setState({imgList:arr})
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
            <FormItem label="区域名称">
              {getFieldDecorator('areaName')(<Input placeholder="请输入" />)}
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
    let {
      repairsArea: { data },
      loading,
    } = this.props;

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      okaddlongandlat:this.okaddlongandlat,
      clickMap:this.clickMap,
      handleModalVisible_local:this.handleModalVisible_local,
      handleModalVisible_img:this.handleModalVisible_img,
      okSaveImg:this.okSaveImg,
      getImgList:this.getImgList,
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      modalVisible_local: this.state.modalVisible_local,
      modalVisible_img: this.state.modalVisible_img,
      longitude: this.state.longitude,
      latitude: this.state.latitude,
      confirmLoading: this.state.confirmLoading,
      imgList:this.state.imgList,
    };

    let dataObj, total, columns;
    if(data && data.length !== 0){
      if(data.data){ // 区镇
        columns = this.columns1;
        dataObj = { list: data.data };
        total = data.data.length;
      }else{// 社区 小区
        dataObj = { list: data.content };
        total = data.content.length;
        columns = this.columns2;
        if(this.state.currentLevel.split('-').length == 4){
          columns = this.columns3;
        }
      }
    }
    else{
      return (
        <Spin
          style={{ position: 'absolute', top: 140, left: 0, right: 0 }}
          size="large"
          tip="Loading..."
        />
      );
    }

    return (
      <div className={myStyle.container}>
        {/* tree */}
        <div className={myStyle.tree}>
          <div>体育设施区域分布</div>
          <Tree defaultExpandAll={true} onSelect={this.onSelect}>
            {this.getTree(this.state.tree)}
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
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <StandardTable
                selectedRows={[]}
                showRowSelect="none"
                // showPagination="none"
                loading={loading}
                data={dataObj}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                total={total}
              />
            </div>
            <CreateForm {...parentMethods} {...parentStates} />
            <CreateForm_local {...parentMethods} {...parentStates} />
            <CreateForm_img {...parentMethods} {...parentStates} />
          </Card>
        </div>
      </div>
    );
  }
}

export default repairs;
