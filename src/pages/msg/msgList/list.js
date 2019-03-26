import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Avatar,
  Input,
  TreeSelect,
  Badge,
  Select,
  Button,
  Modal,
  message,
  Divider,
  DatePicker,
  Spin,
  Menu,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import Link from 'umi/link';

import styles from '@/less/TableList.less';

import { checkData,getnyr ,cutStr} from '@/utils/utils';
import { rc,fileUrl } from '@/global';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>Object.keys(obj).map(key => obj[key]).join(',');

message.config({ top: 100 });

@connect(({ msg, loading }) => ({
  msg,
  loading: loading.models.msg,
}))
@Form.create()
class msg extends PureComponent {
  state = {
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据
  };
  columns = [
    {
      title: '消息标题',
      width:'25%',
      dataIndex: 'title'
    },
    {
      title: '消息类别',
      dataIndex: 'type',
    },
    {
      title: '发布人',
      dataIndex: 'editUser'
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      render(val) {
        return (val?(getnyr(val)):'--')
      }
    },
    // {
    //   title: '操作',
    //   render: (text, record) => (
    //     <Fragment>
    //       <a>详情</a>
    //     </Fragment>
    //   ),
    // },
  ];

  componentDidMount() {
    let params = {
      pn: this.state.currentPage,
      ps: this.state.pageSize,
    };
    this.getList(params);
  }

  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    this.setState({
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    });
    const params = {
      pn: pagination.current,
      ps: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.getList(params);
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
          currentPage: 1,
        },
        function() {
          this.getList({ pn: this.state.currentPage, ps: this.state.pageSize, ...fieldsValue });
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
        currentPage: 1,
      },
      () => {
        this.getList({ pn: this.state.currentPage, ps: this.state.pageSize });
      }
    );
  };

  // list
  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'msg/list',
      payload: params,
      callback: res => {
        if (res.code == 200) {
          this.setState({
            currentDataNum: res.data.list.length,
          });
        }
      },
    });
  };

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {typeList} = [1];
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="消息类别">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option key='通知'>通知</Option>
                  <Option key='全体消息'>全体消息</Option>
                </Select>
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
      msg: { data },
      loading,
    } = this.props;

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button type="primary"><Link to={`${rc}/msg/add`}>发布消息</Link></Button>
              </div>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <StandardTable
                selectedRows={[]}
                showRowSelect="none"
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                total={data.itemCount}
              />
            </div>
          </Card>
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

export default msg;
