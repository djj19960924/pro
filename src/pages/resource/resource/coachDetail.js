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
  Radio,
  Divider,
  Cascader,
  Spin,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import UploadImg from '@/components/UploadImg';
import UploadImgs from '@/components/UploadImgs'
import Link from 'umi/link';
import { Map,Markers } from 'react-amap';

import styles from '@/less/TableList.less';
import myStyles from '@/less/coachDetail.less';

import { checkData } from '@/utils/utils';
import { rc,fileUrl,mapKey,requestUrl_upload } from '@/global';
import { cutStr , getFullArea , getPageQuery} from '@/utils/utils'

const { TextArea } = Input;
const RadioGroup = Radio.Group;
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
  const { modalVisible, form, handleAdd, handleModalVisible, confirmLoading,getImgUrl,infoImg,getImgList,imgList } = props;
  form_modal = form;
  const okHandle = () => {
    let list = []
    imgList.forEach(ele => {
      list.push(ele.name)
    })
    form.setFieldsValue({
      headImage:infoImg,
      videoUrls:list.join()
    })
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新增/修改教练"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
      width={800}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="教练头像">
        {form.getFieldDecorator('headImage', {
          rules: [{ required: true, message: '请上传头像',}],
        })(
          <UploadImg
            getImgUrl={getImgUrl} // 获取上传文件的地址
            imgUrl={infoImg} // 获取上传文件的地址
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="教练姓名">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
        {form.getFieldDecorator('sex', {
          rules: [{ required: true, message: '请选择'}],
        })(
          <RadioGroup>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="年龄">
        {form.getFieldDecorator('age', {
          rules: [{ required: true, message: '请输入' }],
        })(<Input type='number' placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系方式">
        {form.getFieldDecorator('tel', {
          rules: [{ required: true, message: '请输入', whitespace: true, max: 11,min:11 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="教授专业">
        {form.getFieldDecorator('profession', {
          rules: [{ required: true, message: '请输入(小于8个字符)', whitespace: true, max: 8 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="教练简介">
        {form.getFieldDecorator('introduction', {
          rules: [{ required: false, message: '请输入(小于100个字符)', whitespace: true, max: 100 }],
        })(<TextArea rows={4} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="教学视频">
        {form.getFieldDecorator('videoUrls', {
          rules: [{ required: false}],
        })(
          <UploadImgs 
            getImgList={getImgList} 
            imgList={imgList}
            type='text'
            max={5}
            fileType='video'
          >
          </UploadImgs>
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ coach, loading }) => ({
  coach,
  loading: loading.models.coach,
}))
@Form.create()
class resource extends PureComponent {
  state = {
    modalVisible:false,
    editId:null,
    imgList:[],
    coachList:[]
  };
  
  componentDidMount() {
    this.getall()
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      editId: null,
    });

    form_modal.resetFields();
  };

  // add
  handleAdd = fields => {
    this.setState({
      confirmLoading:true
    })
    console.log(fields)
    fields.gymId = getPageQuery().gymId
    const { dispatch } = this.props;
    dispatch({
      type: 'coach/add',
      payload: fields,
      callback: res => {
        if(res.code == 200){
          this.handleModalVisible()
          this.setState({
            confirmLoading:true
          })
          this.getall()
        }
      },
    });
  };

  // all
  getall = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'coach/list',
      payload:{
        pn:0,
        ps:1000,
        gymId:getPageQuery().gymId
      },
      callback: res => {
        this.setState({
          coachList:res.data.list,
        })
      },
    });
  }
  
  // 图片
  getImgUrl = url => {
    this.setState({ infoImg: url });
  };
  // 视频
  getImgList = (e , type) => {
    let arr = this.state.imgList;
    if(type == 'done'){
      let xxx = e.data.finalFileName.split('/')
      arr.push({
        uid:xxx[xxx.length-1].substring(0,xxx[xxx.length-1].length - 4),
        url:e.data.finalFileName,
        name:xxx[xxx.length-1],
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

  render() {
    const { coachList } = this.state
    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      getImgUrl:this.getImgUrl,
      getImgList:this.getImgList
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
      infoImg:this.state.infoImg,
      imgList:this.state.imgList,
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                新增教练
              </Button>
            </div>
          </div>
          <div className={myStyles.container}>
          {
            coachList.map(item => {
              return <div className={myStyles.item}>
                <div className={myStyles.top}>
                  <div className={myStyles.topLeft}>
                    <div className={myStyles.topLeft_l}>
                      <img src={fileUrl + item.headImage}/>
                    </div>
                    <div className={myStyles.topLeft_r}>
                      <div>姓名：{item.name}</div>
                      <div>性别：{item.sex == 1?'男':'女'}</div>
                      <div>年龄：{item.age}</div>
                      <div>授权专业：{item.profession}</div>
                      <div>联系方式：{item.tel}</div>
                    </div>
                  </div>
                  <div className={myStyles.topRight}>
                    <div className={myStyles.topRight_title}>教练简介：</div>
                    <div className={myStyles.topRight_content}>{item.introduction}</div>
                  </div>
                </div>
                <div className={myStyles.bottom}>
                  <div className={myStyles.bottom_title}>相关视频</div>
                  <div className={myStyles.bottom1}>
                  {
                    item.videoUrls ? item.videoUrls.split(',').map(ele => {
                      return <div className={myStyles.bottom1_item}>
                        <a target='_blank' href={fileUrl + ele}></a>
                        <video width="100%" height="100%" controls>
                          <source src={fileUrl + ele} type="video/mp4"/>
                          <source src={fileUrl + ele} type="video/ogg"/>
                        </video>
                      </div>
                    }):
                    <div className={myStyles.noVideo}>暂无视频</div>
                  }
                  </div>
                </div>
              </div>
            })
          }
          </div>
        </Card>
        <CreateForm {...parentMethods} {...parentStates} />
      </div>
    )
  }
}

export default resource;
