import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  message,
  Card,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import UploadImgs from '@/components/UploadImgs'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '@/less/form.less';
import Link from 'umi/link';

import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import {getPageQuery} from '@/utils/utils'
import { rc,fileUrl ,news001Id} from '@/global';
import { get } from 'https';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ news001, loading }) => ({
  news001,
  loading: loading.models.news001,
}))
@Form.create()
class news extends PureComponent {
  state = {
    imgList:[],
    editorState: BraftEditor.createEditorState(null),// 编辑器内容实例
    newsInfo:{},// 要修改的新闻详情
  }
  
  componentDidMount() {
    this.getType()

    if(getPageQuery().disabled === 't'){
      this.setState({
        isDisabled:true
      })
    }else{
      this.setState({
        isDisabled:false
      })
    }

    // update赋值
    if(getPageQuery().id 
       && localStorage.getItem('newsInfo') 
       && getPageQuery().id == JSON.parse(localStorage.getItem('newsInfo')).id
      ){
      let newsInfo = JSON.parse(localStorage.getItem('newsInfo'))
      this.setState({
        newsInfo:newsInfo
      })
      this.props.form.setFieldsValue({
        title:newsInfo.title,
        type_id:newsInfo.type_id + '',
        hot_status:(newsInfo.hot_status == 100)?'-1':newsInfo.hot_status + '',
        edit_user:newsInfo.edit_user,
        photo_user:newsInfo.photo_user,
      })

      // 获取HTML字符串
      const htmlString = newsInfo.content
      // 将HTML字符串转换为编辑器所需要的EditorState实例
      const editorState = BraftEditor.createEditorState(htmlString)
      this.setState({
        editorState:editorState,
      })

      // 封面
      let arr = []
      newsInfo.img_urls.split(',').forEach(ele => {
        let xxx = ele.split('/')
        arr.push({
          uid:xxx[xxx.length-1].substring(0,xxx[xxx.length-1].length - 4),
          url:ele,
          name:xxx[xxx.length-1],
        })
      })
      this.setState({
        imgList:arr,
      })
    }

  }

  submit = (t) => {
    const { dispatch, form } = this.props;
    if(this.state.imgList.length > 0){
      let list = []
      this.state.imgList.forEach(ele => {
        list.push(ele.url)
      })
      form.setFieldsValue({
        img_urls: list.join(),
      });
    }else{
      form.setFieldsValue({
        img_urls: null,
      });
    }
    form.setFieldsValue({
      content: this.state.editorState.isEmpty()?'':this.state.editorState.toHTML(),
    });
    form.validateFieldsAndScroll((err, values) => {
      if (!err) { 
        this.add(values , t)
      }
    });
  }

  add = (field , t) => {
    if(t == 'save') this.setState({loading1:true})
    if(t == 'public') this.setState({loading2:true})
    if(t == 'update') this.setState({loading3:true})

    // update
    if(getPageQuery().id && getPageQuery().id == this.state.newsInfo.id){
      field.id = getPageQuery().id
    }
    
    let params = {}
    params.img_urls = field.img_urls;
    params.title = field.title;
    params.type_id = news001Id;
    // (field.hot_status && field.hot_status > -1) && (params.hot_status = field.hot_status);
    params.edit_user = field.edit_user;// 赛事名称
    // params.photo_user = field.photo_user;
    params.content = field.content;

    field.id && (params.id = field.id);
    if(t == 'public') params.status = '1'
    if(t == 'save') params.status = '0'
    if(t == 'update') params.status = this.state.newsInfo.status

    this.props.dispatch({
      type: 'news001/add',
      payload: params,
      callback: res => {
        this.setState({loading1:false,loading2:false,loading3:false})
        if(res.code == 200){
          if(t == 'save'){
            message.success('保存成功')
            this.init()
          }
          if(t == 'public'){
            message.success('发布成功')
            this.init()
          }
          if(t == 'update'){
            message.success('修改成功')
          }
        }
      },
    });
  }

  getType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'news001/typeList',
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

  init = () => {
    this.setState({
      imgList:[],
      editorState: BraftEditor.createEditorState(null),
    })
    this.props.form.setFieldsValue({
      title:'',
      type_id:'',
      hot_status:'',
      edit_user:'',
      photo_user:'',
    })
  }

  // 封面图片
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

  // 编辑器
  handleEditorChange = (editorState) => {
    this.setState({ 
      editorState:editorState
    })
  }
  upLoadFile = e => {
    this.props.dispatch({
      type: 'news001/upload',
      payload: e.file,
      callback: res => {
        if (res.code == 200) {
          e.success({
            url: `${fileUrl}/${res.data.finalFileName}`,
            meta: {
              id: e.id,
              title: e.file.name,
              alt: e.file.name,
            }
          })
        }else{
          e.error({
            msg: '上传失败'
          })
        }
      },
    });
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const {typeList,imgList,editorState,loading1,loading2,loading3,isDisabled} = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 16 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 4 },
      },
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label='精彩封面'>
              {getFieldDecorator('img_urls', {
                rules: [{ required: true, message: '请上传图片'}],
              })(
                <UploadImgs 
                  getImgList={this.getImgList} 
                  imgList={imgList}
                  type='picture-card'
                  max={3}
                >
                </UploadImgs>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='标题'>
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入(小于50个字符)', whitespace: true, max: 50 }],
              })(<Input disabled={isDisabled} placeholder='请输入'/>)}
            </FormItem>
            {/* <FormItem {...formItemLayout} label="新闻类别">
              {getFieldDecorator('type_id',{
                rules: [{ required: true, message: '请选择'}],
              })(
                <Select disabled={isDisabled} placeholder="请选择" style={{ width: '100%' }}>
                {
                  typeList && typeList.map(item => (
                    <Option key={item.id}>{item.type_name}</Option>
                  ))
                }
                </Select>
              )}
            </FormItem> */}
            <FormItem {...formItemLayout} label='相关赛事名称'>
              {getFieldDecorator('edit_user', {
                rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
              })(<Input placeholder='请输入' disabled={isDisabled}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label='具体内容'>
              {getFieldDecorator('content', {
                rules: [{ required: true, message: '请输入'}],
              })(
                <div style={{border:'1px solid #CCCCCC'}}>
                  <BraftEditor
                      disabled={isDisabled}
                      value={editorState}
                      onChange={this.handleEditorChange}
                      media={{
                        uploadFn:this.upLoadFile,
                        accepts:{
                          image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
                          video: 'video/mp4',
                          audio: 'audio/mp3'
                        }
                      }}
                  />
                </div>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button style={{ marginRight: 8 }}>
                <Link to={`${rc}/jcsj/index`}>返回</Link>
              </Button>
              {
                (!getPageQuery().id || (localStorage.getItem('newsInfo') && getPageQuery().id != JSON.parse(localStorage.getItem('newsInfo')).id))&&
                !isDisabled &&
                <span>
                  {/* <Button style={{ marginRight: 8 }} type="primary" onClick={() => this.submit('save')} loading={loading1}>保存</Button> */}
                  <Button type="primary" onClick={() => this.submit('public')} loading={loading2}>发布</Button>
                </span>
              }
              {
                (getPageQuery().id 
                && localStorage.getItem('newsInfo') 
                && getPageQuery().id == JSON.parse(localStorage.getItem('newsInfo')).id
                && !isDisabled
              )&&<Button type="primary" onClick={() => this.submit('update')} loading={loading3}>修改</Button>
              }
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default news;