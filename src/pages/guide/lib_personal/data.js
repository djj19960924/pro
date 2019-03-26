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
  Upload,
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
import myStyles from '@/less/guide.less';

import zhuanjiahead from '@/assets/zhuanjiahead.png'

import { checkData, getnyr } from '@/utils/utils';
import { rc,requestUrl_kxjs } from '@/global';

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
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    confirmLoading,
    addType,
    editType,
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
      title='新增/修改'
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
    >
    {
      (addType=='type' || editType=='type')&&
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入(20字符以内)',max: 20}],
        })(<Input placeholder='请输入'/>)}
      </FormItem>
    }
    {
      (addType=='target' || editType=='target')&&
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="锻炼目标">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入(20字符以内)',max: 20}],
        })(<Input placeholder='请输入'/>)}
      </FormItem>
    }
    {
      (addType=='content' || editType=='content')&&
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入(200字符以内)',max: 200}],
        })(<Input placeholder='请输入'/>)}
      </FormItem>
    }
    </Modal>
  );
});

@connect(({ lib, loading }) => ({
  lib,
  loading: loading.models.lib,
}))
@Form.create()
class guide extends PureComponent {
  state = {
    modalVisible: false,
    confirmLoading: false,

    type_list:[],
    target_list:[],
    content_list:[],
  };

  componentDidMount() {
    this.getTypeList()
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      editId:null,
    });
  };

  //
  addClick = (addType) => {
    if(addType == 'target' && !this.state.typeId){
      message.warning('请选择类型');
      return;
    }
    if(addType == 'content' && !this.state.targetId){
      message.warning('请选择锻炼目标');
      return;
    }
    this.setState({
      addType:addType,
      editType:null,
      modalVisible:true,
    })
  }

  // add
  handleAdd = (fields) => {
    this.setState({
      confirmLoading:true,
    })
    const { dispatch } = this.props;
    if(!this.state.editId){// add
      if(this.state.addType == 'type'){
        dispatch({
          type: 'lib/type_add',
          payload:fields,
          callback: res => {
            if (res.code == 200) {
              this.setState({
                confirmLoading:false,
              })
              this.handleModalVisible()
              this.getTypeList()
            }
          },
        });
      }
      if(this.state.addType == 'target'){
        fields.reference_id = this.state.typeId
        dispatch({
          type: 'lib/target_add',
          payload:fields,
          callback: res => {
            if (res.code == 200) {
              this.setState({
                confirmLoading:false,
              })
              this.handleModalVisible()
              this.getTargetList()
            }
          },
        });
      }
      if(this.state.addType == 'content'){
        fields.reference_id = this.state.targetId
        dispatch({
          type: 'lib/content_add',
          payload:fields,
          callback: res => {
            if (res.code == 200) {
              this.setState({
                confirmLoading:false,
              })
              this.handleModalVisible()
              this.getContentList()
            }
          },
        });
      }
    }
    else{// update
      if(this.state.editType == 'type'){
        fields.id = this.state.editId
        dispatch({
          type: 'lib/type_add',
          payload:fields,
          callback: res => {
            if (res.code == 200) {
              this.setState({
                confirmLoading:false,
              })
              this.handleModalVisible()
              this.getTypeList()
            }
          },
        });
      }
      if(this.state.editType == 'target'){
        fields.id = this.state.editId
        fields.reference_id = this.state.typeId
        dispatch({
          type: 'lib/target_add',
          payload:fields,
          callback: res => {
            if (res.code == 200) {
              this.setState({
                confirmLoading:false,
              })
              this.handleModalVisible()
              this.getTargetList()
            }
          },
        });
      }
      if(this.state.editType == 'content'){
        fields.id = this.state.editId
        fields.reference_id = this.state.targetId
        dispatch({
          type: 'lib/content_add',
          payload:fields,
          callback: res => {
            if (res.code == 200) {
              this.setState({
                confirmLoading:false,
              })
              this.handleModalVisible()
              this.getContentList()
            }
          },
        });
      }
    }
  }

  // 列表
  getTypeList = () => {
    const loading = message.loading('加载中...', 0);
    const { dispatch } = this.props;
    dispatch({
      type: 'lib/type_list',
      callback: res => {
        if (res.code == 200) {
          setTimeout(loading, 0);
          this.setState({
            type_list:res.data.list
          })
        }
      },
    });
  }
  getTargetList = () => {
    const loading = message.loading('加载中...', 0);
    if(this.state.typeId){
      const { dispatch } = this.props;
      dispatch({
        type: 'lib/target_list',
        payload:this.state.typeId,
        callback: res => {
          if (res.code == 200) {
            setTimeout(loading, 0);
            this.setState({
              target_list:res.data.list
            })
          }
        },
      });
    }
  }
  getContentList = () => {
    const loading = message.loading('加载中...', 0);
    if(this.state.targetId){
      const { dispatch } = this.props;
      dispatch({
        type: 'lib/content_list',
        payload:this.state.targetId,
        callback: res => {
          if (res.code == 200) {
            setTimeout(loading, 0);
            this.setState({
              content_list:res.data.list
            })
          }
        },
      });
    }
  }

  // delete
  deleteType = (e,id) => {
    e.stopPropagation()
    Modal.confirm({
      content: '是否确定删除该类型？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const loading = message.loading('正在删除...', 0);
        this.props.dispatch({
          type: 'lib/type_del',
          payload:id,
          callback: res => {
            setTimeout(loading, 0);
            if (res.code == 200) {
              this.getTypeList()
            }else{
              message.error('删除失败')
            }
          },
        });
      },
    });
  }
  deleteTarget = (e,id) => {
    e.stopPropagation()
    Modal.confirm({
      content: '是否确定删除该锻炼目标？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const loading = message.loading('正在删除...', 0);
        this.props.dispatch({
          type: 'lib/target_del',
          payload:id,
          callback: res => {
            setTimeout(loading, 0);
            if (res.code == 200) {
              this.getTargetList()
            }else{
              message.error('删除失败')
            }
          },
        });
      },
    });
  }
  deleteContent = (e,id) => {
    e.stopPropagation()
    Modal.confirm({
      content: '是否确定删除该内容？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const loading = message.loading('正在删除...', 0);
        this.props.dispatch({
          type: 'lib/content_del',
          payload:id,
          callback: res => {
            setTimeout(loading, 0);
            if (res.code == 200) {
              this.getContentList()
            }else{
              message.error('删除失败')
            }
          },
        });
      },
    });
  }

  // edit
  editType = (e,record) => {
    e.stopPropagation()
    this.setState({
      editId:record.id,
      editType:'type',
      addType:null,
      modalVisible:true,
    },()=>{
      form_modal.setFieldsValue({
        name:record.name
      })
    })
  }
  editTarget = (e,record) => {
    e.stopPropagation()
    this.setState({
      editId:record.id,
      editType:'target',
      addType:null,
      modalVisible:true,
    },()=>{
      form_modal.setFieldsValue({
        name:record.name
      })
    })
  }
  editContent = (e,record) => {
    e.stopPropagation()
    this.setState({
      editId:record.id,
      editType:'content',
      addType:null,
      modalVisible:true,
    },()=>{
      form_modal.setFieldsValue({
        name:record.name
      })
    })
  }

  // 鼠标移入移出
  mouseEnterType = (id) => {
    let arr = this.state.type_list;
    arr.forEach((ele) => {
      if(ele.id == id){
        ele.mouseIn = true;
      }
    })
    this.setState({
      type_list:arr,
      a:'enter'+id
    })
  }
  mouseLeaveType = (id) => {
    let arr = this.state.type_list;
    arr.forEach((ele) => {
      if(ele.id == id){
        ele.mouseIn = false;
      }
    })
    this.setState({
      type_list:arr,
      a:'leave'+id
    })
  }
  mouseEnterTarget = id => {
    let arr = this.state.target_list;
    arr.forEach((ele) => {
      if(ele.id == id){
        ele.mouseIn = true;
      }
    })
    this.setState({
      target_list:arr,
      a:'enter'+id
    })
  }
  mouseLeaveTarget = id => {
    let arr = this.state.target_list;
    arr.forEach((ele) => {
      if(ele.id == id){
        ele.mouseIn = false;
      }
    })
    this.setState({
      target_list:arr,
      a:'leave'+id
    })
  }
  mouseEnterContent = id => {
    let arr = this.state.content_list;
    arr.forEach((ele) => {
      if(ele.id == id){
        ele.mouseIn = true;
      }
    })
    this.setState({
      content_list:arr,
      a:'enter'+id
    })
  }
  mouseLeaveContent = id => {
    let arr = this.state.content_list;
    arr.forEach((ele) => {
      if(ele.id == id){
        ele.mouseIn = false;
      }
    })
    this.setState({
      content_list:arr,
      a:'leave'+id
    })
  }

  // choose
  chooseType = id => {
    let arr = this.state.type_list;
    arr.forEach((ele) => {
      if(ele.id == id){
        ele.active = true;
      }else{
        ele.active = false;
      }
    })
    this.setState({
      type_list:arr,
      typeId:id,
      content_list:[],// 清空内容
      targetId:null,// 清空锻炼目标选择状态
    },() => {
      this.getTargetList()
    })
  }
  chooseTarget = id => {
    let arr = this.state.target_list;
    arr.forEach((ele) => {
      if(ele.id == id){
        ele.active = true;
      }else{
        ele.active = false;
      }
    })
    this.setState({
      target_list:arr,
      targetId:id
    },() => {
      this.getContentList()
    })
  }

  render() {
    const parentMethods = { 
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
      addType:this.state.addType,
      editType:this.state.editType,
    };

    return (
      <div style={{padding:24,background:'#fff'}} className={myStyles.container}>
            {/* type */}
            <div className={myStyles.content}>
              <div className={myStyles.title}><span>类型</span></div>
              <div className={myStyles.head}></div>
              <div className={myStyles.body}>
              {
                this.state.type_list.map((item) => (
                  <div
                    key={item.id}
                    style={item.active?{background:'#D9EBFC'}:{}}
                    onMouseEnter={() => this.mouseEnterType(item.id)} 
                    onMouseLeave={() => this.mouseLeaveType(item.id)} 
                    onClick={() => this.chooseType(item.id)} 
                    className={myStyles.items}
                  >{item.name}
                  {
                    item.mouseIn&&
                    <span className={myStyles.dosomething}>
                      <b onClick={(e) => this.editType(e,item)}>修改</b>
                      <b onClick={(e) => this.deleteType(e,item.id)}>删除</b>
                    </span>
                  }
                  </div>
                ))
              }
                <div 
                  onClick={() => this.addClick('type')} 
                  className={myStyles.add}
                >
                  + 新增
                </div>
              </div>
            </div>
            {/* target */}
            <div className={myStyles.content}>
              <div className={myStyles.title}><span>锻炼目标</span></div>
              <div className={myStyles.head}></div>
              <div className={myStyles.body}>
              {
                this.state.target_list.map((item) => (
                  <div
                    key={item.id}
                    style={item.active?{background:'#D9EBFC'}:{}}
                    onMouseEnter={() => this.mouseEnterTarget(item.id)} 
                    onMouseLeave={() => this.mouseLeaveTarget(item.id)} 
                    onClick={() => this.chooseTarget(item.id)} 
                    className={myStyles.items}
                  >{item.name}
                  {
                    item.mouseIn&&
                    <span className={myStyles.dosomething}>
                      <b onClick={(e) => this.editTarget(e,item)}>修改</b>
                      <b onClick={(e) => this.deleteTarget(e,item.id)}>删除</b>
                    </span>
                  }
                  </div>
                ))
              }
                <div 
                  onClick={() => this.addClick('target')} 
                  className={myStyles.add}
                >
                  + 新增
                </div>
              </div>
            </div>
            {/* content */}
            <div className={myStyles.content}>
              <div className={myStyles.title}><span>内容</span></div>
              <div className={myStyles.head}></div>
              <div className={myStyles.body}>
              {
                this.state.content_list.map((item) => (
                  <div
                    key={item.id}
                    style={item.active?{background:'#D9EBFC'}:{}}
                    onMouseEnter={() => this.mouseEnterContent(item.id)} 
                    onMouseLeave={() => this.mouseLeaveContent(item.id)} 
                    className={myStyles.items + ' ' + myStyles.contentItems}
                  >{item.name}
                  {
                    item.mouseIn&&
                    <span className={myStyles.dosomething}>
                      <b onClick={(e) => this.editContent(e,item)}>修改</b>
                      <b onClick={(e) => this.deleteContent(e,item.id)}>删除</b>
                    </span>
                  }
                  </div>
                ))
              }
                <div 
                  onClick={() => this.addClick('content')} 
                  className={myStyles.add}
                >
                  + 新增
                </div>
              </div>
            </div>
        <CreateForm {...parentMethods} {...parentStates} />
      </div>
    );
  }
}

export default guide;
