import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import { Card, Form, Input, Button, message, Icon } from 'antd';
import UploadImg from '@/components/UploadImg';
import Loading from '@/components/Loading';

import styles from './index.less';

const FormItem = Form.Item;

message.config({ top: 100 });

@connect(({ params, loading }) => ({
  params,
  loading: loading.models.params,
}))
@Form.create()
class system extends PureComponent {
  state = {
    confirmLoading: false,
    formItem: ['', '', ''],
  };

  componentDidMount() {
    this.setFormItem();
  }

  handleSubmit = e => {
    e.preventDefault();

    const { form, dispatch } = this.props;

    form.validateFields((err, fields) => {
      if (err) return;
      this.setState({ confirmLoading: true });

      // 更新设置
    });
  };

  addFormItem = index => {
    let { formItem } = this.state;
    formItem.splice(index + 1, 0, '');
    this.setState(
      {
        formItem: formItem,
        a: formItem.join(),
      },
      () => {
        this.setFormItem();
      }
    );
  };
  removeFormItem = index => {
    let { formItem } = this.state;
    formItem.splice(index, 1);
    this.setState(
      {
        formItem: formItem,
        a: formItem.join(),
      },
      () => {
        this.setFormItem();
      }
    );
  };

  setFormItem = () => {
    const { form, dispatch } = this.props;

    this.state.formItem.forEach((ele, index) => {
      let obj = {};
      obj[`hlptype_${index}`] = ele;
      form.setFieldsValue(obj);
    });
  };

  changeState = (e, index) => {
    let formItem = this.state.formItem;
    formItem[index] = e.target.value;
    this.setState({
      formItem: formItem,
    });
  };

  createForm() {
    const { getFieldDecorator } = this.props.form;
    const { formItem } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 20, offset: 0 },
        sm: { span: 16, offset: 4 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        {formItem.map((ele, index) => (
          <FormItem
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? '专家服务类别：' : ''}
          >
            <div className={styles.valueP}>
              {getFieldDecorator(`hlptype_${index}`, {
                rules: [{ required: true, message: '请输入(20字符以内)', max: 20 }],
              })(
                <Input
                  onChange={e => this.changeState(e, index)}
                  className={styles.addInput}
                  placeholder="请输入专家服务类别"
                />
              )}
              <Icon
                onClick={() => this.addFormItem(index)}
                className={styles.addIcon}
                type="plus-circle"
              />
              {index ? (
                <Icon
                  onClick={() => this.removeFormItem(index)}
                  className={styles.removeIcon}
                  type="minus-circle"
                />
              ) : (
                <Icon className={styles.removeIcon_} type="minus-circle" />
              )}
            </div>
          </FormItem>
        ))}
        <FormItem style={{ textAlign: 'center' }} wrapperCol={{ span: 12, offset: 6 }}>
          <Button loading={this.state.confirmLoading} type="primary" htmlType="submit">
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
            <h1>科学健身设置</h1>
            <div className={styles.content}>{this.createForm()}</div>
          </div>
        </Card>
        <Loading loading={loading} />
      </PageHeaderWrapper>
    );
  }
}
export default system;
