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
  Cascader,
  Spin,
  Menu,
  TreeSelect,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import UploadImg from '@/components/UploadImg';
import Link from 'umi/link';
import SpacialDetail from '@/components/SpacialDetail';
import WxUserDetail from '@/components/WxUserDetail';

import styles from '@/less/TableList.less';

import zhuanjiahead from '@/assets/zhuanjiahead.png'

import { getPageQuery,checkData, getnyr } from '@/utils/utils';
import { rc,requestUrl_kxjs } from '@/global';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

message.config({ top: 100 });

@connect(({ team, loading }) => ({
  team,
  loading: loading.models.team,
}))
@Form.create()
class guide extends PureComponent {
  state = {
    modalVisible: false,
    confirmLoading: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据
  };
 
  columns = [
    {
      title: '头像',
      render:(val,record) => {
        return record.headImg ? (
          <Avatar src={record.headImg}/>
        ) : (
          <Avatar
            style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
            icon="user"
          />
        );
      }
    },
    {
      title: '用户名',
      dataIndex: 'nickName',
      // render:(val,record) => {
      //   return <div>{val?<a onClick={() => this.seeWxUser(record.id)}>{val}</a>:'--'}</div>
      // }
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render:(val) => {
        return <div>{val==1?'男':val==2?'女':'--'}</div>
      }
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      render:(val) => {
        return <div>{val?val.substring(0,10):'--'}</div>
      }
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      render:(val) => {
        return <div>{val?val:'--'}</div>
      }
    },
    {
      title: '人群类别',
      dataIndex: 'personClass',
      render:(val) => {
        return <div>{val==1?'青年':val==2?'中老年':'--'}</div>
      }
    },
    {
      title: '身高(cm)',
      dataIndex: 'height',
      render:(val) => {
        return <div>{val?(val + ' cm'):'--'}</div>
      }
    },
    {
      title: '体重(kg)',
      dataIndex: 'weight',
      render:(val) => {
        return <div>{val?(val + ' kg'):'--'}</div>
      }
    },
    // {
    //   title: '体测评分',
    //   dataIndex: 'tcGrade',
    //   render:(val) => {
    //     return <div>{val?val:'--'}</div>
    //   }
    // },
    {
      title: '体测报告历史',
      render: (text, record) => (
        <Fragment>
          <Link to={`${rc}/guide/record_team/moreData?openId=${record.loginWeixinOpenid}`}>
            查看
          </Link>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.getList();
  }

  // 查看历史报告
  reportRecord = record => {
    console.log(record.loginWeixinOpenid)
  }

  // 多选
  handleSelectRows = rows => {
    this.state.selectedRows[this.state.currentPage - 1] = rows;
  };

  // 查询
  handleSearch1 = e => {
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
  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'team/getUserList',
      payload: getPageQuery().id,
      callback: res => {
        if (res.code == 200) {
          this.setState({
            currentDataNum: res.data.list.length,
            selectedRows:[]
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
    return (
      <Form onSubmit={this.handleSearch1} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('a_usname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="性别">
              {getFieldDecorator('a_sex')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">男</Option>
                  <Option value="2">女</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="人群类别">
              {getFieldDecorator('a_groupName')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">青年</Option>
                  <Option value="2">中老年</Option>
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
      team: { data },
      loading, 
    } = this.props;
    const { selectedRows } = this.state;

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
              </div>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data.list?{list:data.list}:{list:[]}}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
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

export default guide;
