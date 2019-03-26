import React, { PureComponent, Fragment } from "react";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { connect } from "dva";
import { Card, Form, Input, Button, message } from "antd";
import UploadImg from "@/components/UploadImg";
import Loading from "@/components/Loading";

import styles from "./params.less";

const FormItem = Form.Item;

message.config({ top: 100 });

@connect(({ params, loading }) => ({
  params,
  loading: loading.models.params
}))
@Form.create()
class system extends PureComponent {
  state = {
    systemLog: "", // 平台logo url
    confirmLoading: false
  };

  componentDidMount() {
    this.getInfo();
  }

  getInfo = () => {
    const { dispatch, form } = this.props;
    dispatch({
      type: "params/get",
      callback: res => {
        if (res.meta.code == 200) {
          this.setState({ systemLog: res.data.data.systemLog });
          form.setFieldsValue({
            systemLog: res.data.data.systemLog,
            systemName: res.data.data.systemName,
            systemPassword: res.data.data.systemPassword,
            systemIdentification: res.data.data.systemIdentification
          });
        }
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { form, dispatch } = this.props;

    form.setFieldsValue({
      systemLog: this.state.systemLog
    });

    form.validateFields((err, fields) => {
      if (err) return;

      this.setState({ confirmLoading: true });
      // 更新设置
      dispatch({
        type: "params/set",
        payload: fields,
        callback: res => {
          let webParams = {
            systemLog: fields.systemLog,
            systemName: fields.systemName,
            systemIdentification: fields.systemIdentification
          }
          localStorage.setItem('webParams',JSON.stringify(webParams))
          if (res.meta.code == 200) {
            message.success("设置成功");
          }
          this.setState({ confirmLoading: false });
        }
      });
    });
  };

  getImgUrl = url => {
    this.setState({ systemLog: url });
  };

  createForm() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="平台logo：">
          {getFieldDecorator("systemLog", {
            rules: [{ required: true, message: "请上传平台logo!" }]
          })(
            <UploadImg
              getImgUrl={this.getImgUrl} // 获取上传文件的地址
              imgUrl={this.state.systemLog}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="平台系统名称：" hasFeedback>
          {getFieldDecorator("systemName", {
            rules: [
              {
                required: true,
                message: "请输入平台系统名称(20字符以内)",
                max: 20
              }
            ]
          })(<Input placeholder="请输入平台系统名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="平台初始密码：" hasFeedback>
          {getFieldDecorator("systemPassword", {
            rules: [
              {
                required: true,
                message: "请输入平台初始密码(6-16个数字和字母组合)",
                pattern: /[\d]/
              }
            ]
          })(<Input placeholder="请输入平台初始密码" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="平台底部标识：" hasFeedback>
          {getFieldDecorator("systemIdentification", {
            rules: [
              {
                required: true,
                message: "请输入平台底部标识(20字符以内)",
                max: 20
              }
            ]
          })(<Input placeholder="请输入平台底部标识" />)}
        </FormItem>
        <FormItem
          style={{ textAlign: "center" }}
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button
            loading={this.state.confirmLoading}
            type="primary"
            htmlType="submit"
          >
            更新设置
          </Button>
        </FormItem>
      </Form>
    );
  }

  render() {
    const { loading } = this.props;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.container}>
            <h1>系统基本信息设置</h1>
            <div className={styles.content}>{this.createForm()}</div>
          </div>
        </Card>
        <Loading loading={loading} />
      </PageHeaderWrapper>
    );
  }
}
export default system;
