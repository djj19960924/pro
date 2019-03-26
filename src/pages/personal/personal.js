import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import UploadImgs from '@/components/UploadImgs'
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input, message, Tabs, Form, Button, Radio, DatePicker } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '@/less/personal.less';
import {fileUrl} from '@/global'

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;

message.config({ top: 100 });

@connect(({ personal, loading }) => ({
  personal,
  loading: loading.models.personal,
}))
@Form.create()
class Center extends PureComponent {
  state = {
    imgList:[],
  };

  componentDidMount() {
      this.setCurrentUser()
  }

  // 获取用户信息
  setCurrentUser = () => {
    let currentUser = JSON.parse(localStorage.getItem('currentUserObj'))
    console.log(currentUser)
    // if(!currentUser.headimg || currentUser.headimg == 'undefined'){
    //     currentUser.headimg = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552021146716&di=1c4ce7adb35e60ea52d0d971ec93cd34&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01786557e4a6fa0000018c1bf080ca.png'
    // }else{
        currentUser.headimg = fileUrl + '/' + currentUser.headimg
    // }
    this.setState({
        currentUser:currentUser
    })
  }

  getUser = () => {
    this.props.dispatch({
        type: 'personal/getUser',
        payload: this.state.currentUser.userId,
        callback:(res) => {
            localStorage.setItem('currentUserObj',JSON.stringify(res.data.data))
            this.setCurrentUser()
        }
    });
  }

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
    this.props.form.setFieldsValue({
        headimg:arr[0] ? arr[0].name : ''
    })
  }

  changeInfo = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
        if (err) return;

        console.log(fieldsValue)

        let params = {}

        fieldsValue.name && (params.name = fieldsValue.name)
        fieldsValue.email && (params.email = fieldsValue.email)
        fieldsValue.headimg && (params.headimg = fieldsValue.headimg)
        fieldsValue.birthday && (params.birthday = fieldsValue.birthday)
        fieldsValue.phone && (params.phone = fieldsValue.phone)
        fieldsValue.sex && (params.sex = fieldsValue.sex)
        fieldsValue.remark && (params.remark = fieldsValue.remark)

        if(JSON.stringify(params) === '{}'){
            message.warning('您还没有输入')
            return;
        }

        params.userId = this.state.currentUser.userId

        console.log(params);

        const { dispatch } = this.props;
        dispatch({
            type: 'personal/user_update',
            payload: params,
            callback: res => {
                if (res.meta.code == 200) {
                    message.success('修改成功')
                    this.getUser()
                }
            },
        });
    });
  }

  changePwd = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if(!fieldsValue.oldPassword){
        message.warning('请输入原密码');
        return;
      }
      if(!fieldsValue.newPassword){
        message.warning('请输入新密码');
        return;
      }
      if(!fieldsValue.password){
        message.warning('请确认密码');
        return;
      }
      if(fieldsValue.password !== fieldsValue.newPassword){
        message.warning('新密码与旧密码不一样，请重新输入');
        return;
      }

      let params = {
          oldPassword:fieldsValue.oldPassword,
          newPassword:fieldsValue.newPassword,
          userId:this.state.currentUser.userId
      }
      console.log(params)
      this.props.dispatch({
          type: 'personal/changePwd',
          payload: params,
          callback:(res) => {
              if(res.meta.code == 200){
                message.success('密码修改成功');
              }
          }
      });
    });
  }

  render() {
    const { imgList , currentUser } = this.state;
    const {
        loading,
        form: { getFieldDecorator, getFieldValue, setFieldsValue },
    } = this.props;
    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
          md: { span: 18 },
        },
    };
  
    const submitFormLayout = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 10, offset: 2 },
        },
    };
    const resetUserInfo = () => {
        setFieldsValue({
            name:'',
            sex:'',
            birthday:'',
            phone:'',
            email:'',
            remark:'',
        })
    }
    const resetPwd = () => {
        setFieldsValue({
            oldPassword:'',
            newPassword:'',
            password:'',
        })
    }
    return ( currentUser ?
      <GridContent className={styles.userCenter}>
        <div className={styles.container}>
            <Card bordered={false} style={{ marginBottom: 24,width:350 }} loading={false}>
                <div>
                    <div className={styles.avatarHolder}>
                        <div style={{width:104,height:104,textAlign:'center',borderRadius:'50%',overflow:'hidden',margin:'0 auto',background: '#D8E5F0'}}>
                            <img style={{width:'auto',height:'100%'}} src={currentUser.headimg} />
                        </div>
                        <div style={{margin:'8px 0'}} className={styles.name}>{currentUser.name}</div>
                        <div>生命不息，运动不止</div>
                    </div>
                    <div className={styles.detail}>
                        <div className={styles.tagsTitle}>账号信息</div>
                        <p><Icon type="contacts" />
                            <span style={{paddingLeft:8}}>账号名称 : {currentUser.userName}</span>
                        </p>
                        <p><Icon type="lock" />
                            <span style={{paddingLeft:8}}>密码 : ****************</span>
                        </p>
                        <Divider dashed />
                        <div className={styles.tagsTitle}>系统身份信息</div>
                        <p><Icon type="user" />
                            <span style={{paddingLeft:8}}>角色 : {currentUser.roleName || '--'}</span>
                        </p>
                        <p><Icon type="environment" />
                            <span style={{paddingLeft:8}}>所属区域 : {currentUser.deptName || '--'}</span>
                        </p>
                        <Divider dashed />
                        <div className={styles.tagsTitle}>用户基本信息</div>
                        <p><Icon type="edit" />
                            <span style={{paddingLeft:8}}>用户名 : {currentUser.name || '--'}</span>
                        </p>
                        <p><Icon type="man" />
                            <span style={{paddingLeft:8}}>性别 : {currentUser.sex == 1 ? '男':currentUser.sex == 2 ? '女':'--'}</span>
                        </p>
                        <p><Icon type="cloud" />
                            <span style={{paddingLeft:8}}>出生年月 : {currentUser.birthday || '--'}</span>
                        </p>
                        <p><Icon type="phone" />
                            <span style={{paddingLeft:8}}>联系方式 : {currentUser.phone || '--'}</span>
                        </p>
                        {/* <p><Icon type="mail" />
                            <span style={{paddingLeft:8}}>邮箱 : {currentUser.email || '--'}</span>
                        </p>
                        <Divider dashed />
                        <div className={styles.tagsTitle}>备注信息</div>
                        <p>{currentUser.remark || '--'}</p> */}
                    </div>
                </div>
            </Card>
            <Card bordered={false} style={{ margin:'0 0 24px 24px',flexGrow:1}}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab={<span><Icon type="highlight" />修改个人信息</span>} key="1">
                        <Form onSubmit={this.changeInfo} style={{ marginTop: 8 }}>
                            <FormItem {...formItemLayout} label='头像'>
                                {getFieldDecorator('headimg', {
                                })(
                                <UploadImgs 
                                    getImgList={this.getImgList} 
                                    imgList={imgList}
                                    type='picture-card'
                                    max={1}
                                >
                                </UploadImgs>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label='用户名称'>
                                {getFieldDecorator('name', {
                                rules: [{ message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
                                })(<Input placeholder='请输入'/>)}
                            </FormItem>
                            <FormItem {...formItemLayout} label='性别'>
                                {getFieldDecorator('sex', {
                                rules: [{ message: '请选择'}],
                                })(
                                <Radio.Group>
                                    <Radio value="1">男</Radio>
                                    <Radio value="2">女</Radio>
                                </Radio.Group>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label='出生年月'>
                                {getFieldDecorator('birthday', {
                                })(<DatePicker/>)}
                            </FormItem>
                            <FormItem {...formItemLayout} label='联系方式'>
                                {getFieldDecorator('phone', {
                                rules: [{ message: '请输入手机号', whitespace: true, max: 11, min: 11 }],
                                })(<Input placeholder='请输入'/>)}
                            </FormItem>
                            {/* <FormItem {...formItemLayout} label='邮箱'>
                                {getFieldDecorator('email', {
                                rules: [{ message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
                                })(<Input placeholder='请输入'/>)}
                            </FormItem>
                            <FormItem {...formItemLayout} label='备注'>
                                {getFieldDecorator('remark', {
                                rules: [{ message: '请输入(小于200个字符)', whitespace: true, max: 200 }],
                                })(<TextArea rows={5} placeholder='请输入'/>)}
                            </FormItem> */}
                            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                                <Button loading={loading} htmlType='submit' type='primary' style={{ marginRight: 8 }}>确认修改</Button>
                                <Button onClick={() => resetUserInfo()}>重置</Button>
                            </FormItem>
                        </Form>
                    </TabPane>
                    <TabPane tab={<span><Icon type="lock" />修改密码</span>} key="2">
                        <Form onSubmit={this.changePwd} style={{ marginTop: 8 }}>
                            <FormItem {...formItemLayout} label='原密码'>
                                {getFieldDecorator('oldPassword', {
                                rules: [{ message: '密码必须在6~16字符之内', whitespace: true, min:6, max: 16 }],
                                })(<Input type='password' placeholder='请输入'/>)}
                            </FormItem>
                            <FormItem {...formItemLayout} label='新密码'>
                                {getFieldDecorator('newPassword', {
                                rules: [{ message: '密码必须在6~16字符之内', whitespace: true,min:6, max: 16 }],
                                })(<Input type='password' placeholder='请输入'/>)}
                            </FormItem>
                            <FormItem {...formItemLayout} label='确认密码'>
                                {getFieldDecorator('password', {
                                rules: [{ message: '密码必须在6~16字符之内', whitespace: true,min:6, max: 16 }],
                                })(<Input type='password' placeholder='请输入'/>)}
                            </FormItem>
                            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                                <Button loading={loading} htmlType='submit' type='primary' style={{ marginRight: 8 }}>确认修改</Button>
                                <Button onClick={() => resetPwd()}>重置</Button>
                            </FormItem>
                        </Form>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
      </GridContent>
      :
      <div></div>
    );
  }
}

export default Center;