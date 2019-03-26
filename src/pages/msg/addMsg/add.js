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
import { rc,fileUrl } from '@/global';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
message.config({ top: 100 });

@connect(({ msg, loading }) => ({
  msg,
  loading: loading.models.msg,
}))
@Form.create()
class msg extends PureComponent {
  state = {
    editorState: BraftEditor.createEditorState(null),// 编辑器内容实例
  }

  submit = () => {
    const { dispatch, form } = this.props;
    form.setFieldsValue({
      msg: this.state.editorState.isEmpty()?'':this.state.editorState.toHTML(),
    });
    form.validateFieldsAndScroll((err, values) => {
      if (!err) { 
        this.add(values)
      }
    });
  }

  add = (values) => {
    this.setState({loading:true})

    this.props.dispatch({
      type: 'msg/add',
      payload: values,
      callback: res => {
        if(res.code == 200){
          this.setState({loading:false})
          message.success('发送成功,即将跳转至消息列表')
          setTimeout(() => {
            router.push(rc + '/msg/msgList')
          }, 1000);
        }
      },
    });
  }

  // 编辑器
  handleEditorChange = (editorState) => {
    this.setState({ 
      editorState:editorState
    })
  }
  upLoadFile = e => {
    this.props.dispatch({
      type: 'news/upload',
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

    const { editorState , loading } = this.state;

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
          <FormItem {...formItemLayout} label='消息标题'>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入(小于50个字符)', whitespace: true, max: 50 }],
            })(<Input placeholder='请输入'/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="消息类别">
            {getFieldDecorator('type',{
              rules: [{ required: true, message: '请选择'}],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option key='通知'>通知</Option>
                  <Option key='全体消息'>全体消息</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='发布人'>
            {getFieldDecorator('editUser', {
              rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
            })(<Input placeholder='请输入'/>)}
          </FormItem>
          <FormItem {...formItemLayout} label='消息内容'>
            {getFieldDecorator('msg', {
              rules: [{ required: true, message: '请输入'}],
            })(
              <div style={{border:'1px solid #CCCCCC'}}>
                <BraftEditor
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
              <Link to={`${rc}/msg/msgList/list`}>返回</Link>
            </Button>
            <Button onClick={() => this.submit()} type="primary" loading={loading}>发布</Button>
          </FormItem>
        </Form>
      </Card>
      </PageHeaderWrapper>
    );
  }
}

export default msg;