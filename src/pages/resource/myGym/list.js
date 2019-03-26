import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import UploadImg from '@/components/UploadImg'
import { Cascader, Upload, Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input, message, Tabs, Form, Button, Radio, DatePicker } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './gym.less';
import {fileUrl,requestUrl_upload} from '@/global'

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;
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

message.config({ top: 100 });

@connect(({ personal, loading }) => ({
  personal,
  loading: loading.models.personal,
}))
@Form.create()
class Center extends PureComponent {
  state = {
    installations:installations,
    typeList:[]
  };

  componentDidMount() {
    this.getType()
  }

  getImgUrl = url => {
    this.setState({ infoImg: url });
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
  // 上传视频限制
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
  // 选择类别
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
  // 选择设施
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
  // 确认修改
  okChange = () => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) { 
        console.log(values)
        console.log('图片',this.state.infoImg)
        console.log('视频',this.state.vedio)
        console.log('类别',this.state.typeList)
        console.log('设施',this.state.installations)
      }
    });
  }

  render() {
    const { typeList,vedioloading,vedio,vedio_name } = this.state;
    const {
        loading,
        form: { getFieldDecorator, getFieldValue, setFieldsValue },
    } = this.props;
    const { form } = this.props;
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
    return (
      <GridContent className={styles.userCenter}>
        <div className={styles.container}>
            <Card bordered={false} style={{ marginBottom: 24,width:350 }} loading={false}>
                <div>
                    <div className={styles.avatarHolder}>
                        <div style={{width:132,height:90,textAlign:'center',overflow:'hidden',margin:'0 auto',background: '#D8E5F0'}}>
                            <img style={{width:'auto',height:'100%'}} src={`${fileUrl}WechatIMG270.jpeg`} />
                        </div>
                        <div style={{margin:'8px 0'}} className={styles.name}>{'啊啊啊'}</div>
                    </div>
                    <div className={styles.detail}>
                        <div className={styles.tagsTitle}>场馆类别</div>
                        <p>
                            <span style={{paddingLeft:8}}>账号名称 : {'啊啊啊'}</span>
                        </p>
                        <Divider dashed />
                        <div className={styles.tagsTitle}>场馆信息</div>
                        <p>
                            <span style={{paddingLeft:8}}>场馆负责人 : {'啊啊啊'}</span>
                        </p>
                        <p>
                            <span style={{paddingLeft:8}}>所属区域 : {'啊啊啊'}</span>
                        </p>
                        <p>
                            <span style={{paddingLeft:8}}>场馆电话 : {'啊啊啊'}</span>
                        </p>
                        <p>
                            <span style={{paddingLeft:8}}>场馆地址 : {'啊啊啊'}</span>
                        </p>
                        <p>
                            <span style={{paddingLeft:8}}>费用 : {'啊啊啊'}</span>
                        </p>
                        <p>
                            <span style={{paddingLeft:8}}>营业时间 : {'啊啊啊'}</span>
                        </p>
                        <Divider dashed />
                        <div className={styles.tagsTitle}>场馆设施</div>
                        <p>{'啊啊啊'}</p>
                        <Divider dashed />
                        <div className={styles.tagsTitle}>场馆介绍</div>
                        <p>{'介绍介绍介绍介绍介绍介绍介绍介绍'}</p>
                        <p>
                            <span style={{paddingLeft:8}}>备注 : {'备注备注备注备注备注备注'}</span>
                        </p>
                    </div>
                </div>
            </Card>
            <Card bordered={false} style={{ margin:'0 0 24px 24px',flexGrow:1}}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab={<span>修改场馆信息</span>} key="1">
                        <Form style={{ marginTop: 8 }}>
                          <Row>
                            <Col span={24}>
                              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="场馆图片">
                                {form.getFieldDecorator('gym_img')(
                                  <UploadImg
                                    getImgUrl={this.getImgUrl} // 获取上传文件的地址
                                    imgUrl={this.state.infoImg} // 获取上传文件的地址
                                  />
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="场馆类型">
                                {form.getFieldDecorator('type_ids')(
                                  <div>
                                    {
                                      typeList && typeList.map(item => (
                                        <span 
                                          key={item.id}
                                          onClick={() => this.chooseType(item.id)} 
                                          className={styles.typeItem}
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
                                {form.getFieldDecorator('gym_video')(
                                  <div>
                                    <Upload
                                      showUploadList={false}
                                      action={`${requestUrl_upload}/upload/start`}
                                      data={file => {
                                        return { file: file };
                                      }}
                                      beforeUpload={this.beforeUpload}
                                      onChange={this.handleChange}
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
                                  rules: [{ message: '小于20个字符', whitespace: true, max: 20 }],
                                })(<Input placeholder="请输入" />)}
                              </FormItem>
                            </Col>
                            <Col span={12}>
                              <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="开放时间">
                                {form.getFieldDecorator('openTime', {
                                  rules: [{ message: '小于20个字符', whitespace: true, max: 20 }],
                                })(<Input placeholder="请输入" />)}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={12}>
                              <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="费用">
                                {form.getFieldDecorator('price', {
                                  rules: [{ message: '小于20个字符', whitespace: true, max: 20 }],
                                })(<Input type='number' placeholder="请输入" />)}
                              </FormItem>
                            </Col>
                            <Col span={12}>
                              <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="负责人">
                                {form.getFieldDecorator('connect_user', {
                                  rules: [{ message: '小于20个字符', whitespace: true, max: 20 }],
                                })(<Input placeholder="请输入" />)}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={12}>
                              <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="所属区域">
                                {form.getFieldDecorator('area_id')(
                                  <Cascader options={JSON.parse(localStorage.getItem('areaTree'))} placeholder="请选择" showSearch />,
                                )}
                              </FormItem>
                            </Col>
                            <Col span={12}>
                              <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="场馆电话">
                                {form.getFieldDecorator('connect_user_tel', {
                                  rules: [{ message: '小于20个字符', whitespace: true, max: 20 }],
                                })(<Input placeholder="请输入" />)}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <FormItem style={{marginBottom:8}} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="场馆地址">
                                {form.getFieldDecorator('address', {
                                  rules: [{ message: '小于50个字符', whitespace: true, max: 50 }],
                                })(<Input placeholder="请输入" />)}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="场馆设施">
                                {form.getFieldDecorator('installations_ids')(
                                  <div>
                                    {
                                      installations && installations.map(item => (
                                        <span 
                                          key={item.id}
                                          onClick={() => this.chooseInstallations(item.id)} 
                                          className={styles.typeItem}
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
                                  rules: [{ message: '小于200个字符', whitespace: true, max: 200 }],
                                })(<textarea className={styles.formtextarea} placeholder="请输入场馆介绍和荣誉展示"></textarea>)}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <FormItem style={{marginBottom:8}} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="备注">
                                {form.getFieldDecorator('remark', {
                                  rules: [{ message: '小于200个字符', whitespace: true, max: 200 }],
                                })(<Input placeholder="请输入" />)}
                              </FormItem>
                            </Col>
                          </Row>
                            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                                <Button onClick={this.okChange} type='primary' style={{ marginRight: 8 }}>确认修改</Button>
                                <Button>重置</Button>
                            </FormItem>
                        </Form>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
      </GridContent>
    );
  }
}

export default Center;