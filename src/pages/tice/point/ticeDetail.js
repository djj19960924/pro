import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  Avatar,
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

import styles from '../../../less/TableList.less';

import { checkData, getPageQuery, getnyr } from '../../../utils/utils';
import { rc } from '../../../global';
let project = [];
project = JSON.parse(localStorage.getItem("allProject"))

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

message.config({ top: 100 });

@connect(({ tice_one, loading }) => ({
  tice_one,
  loading: loading.models.tice_one,
}))
@Form.create()
class tice extends PureComponent {
  state = {
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据

    allpoint: [],
  };

  columns = [
    {
      title: '头像',
      render:(val,record) => {
        return record.headImage ? (
          <Avatar src={record.headImage}/>
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
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: val => <div>{val == 1 ? '男' : val == 2 ? '女' : '--'}</div>,
    },
    // {
    //   title: '年龄',
    //   dataIndex: 'age',
    // },
    {
      title: '出生日期',
      dataIndex: 'bthDate',
      render: val => <div>{val ? val : '--'}</div>,
    },
    // {
    //   title: '人群类别',
    //   dataIndex: 'groupName',
    //   render: val => <div>{val ? val : '--'}</div>,
    // },
    {
      title: '手机号',
      dataIndex: 'tel',
      render: val => <div>{val ? val : '--'}</div>,
    },
    {
      title: '体测项目',
      dataIndex: 'tcTypeName',
      render: val => <div>{val ? val : '--'}</div>,
    },
    {
      title: '体测结果',
      dataIndex: 'score',
      render: val => <div>{val ? val : '--'}</div>,
    },
    {
      title: '体测得分',
      dataIndex: 'grade',
      render: val => <div>{val ? val : '--'}</div>,
    },
    {
      title: '体测时间',
      dataIndex: 'createTime',
      render: val => <div>{val ? val.substring(0,10) : '--'}</div>,
    },
    {
      title: '体测点',
      dataIndex: 'venueName',
      render: val => <div>{val ? val : '--'}</div>,
    },
    {
      title: '设备编号',
      dataIndex: 'deviceNo',
      render: val => <div>{val ? val : '--'}</div>,
    },
  ];

  componentDidMount() {
    let params = {
      pn: this.state.currentPage,
      ps: this.state.pageSize,
    };
    this.getList(params);

    const { dispatch } = this.props;
    dispatch({
      type: 'tice_device/getallpoint',
      payload: null, // 区域id
      callback: res => {
        if (res.meta.code == 200) {
          this.setState({
            allpoint: res.data.data,
          });
        }
      },
    });
  }

  // 多选
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

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
    params.venueId = getPageQuery().pointId
    const { dispatch } = this.props;
    dispatch({
      type: 'tice_one/list',
      payload: params,
      callback: res => {
        if (res.meta.code == 200) {
          this.setState({
            currentDataNum: res.data.data.length,
            selectedRows: [],
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
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('usname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('tel')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="体测项目">
              {getFieldDecorator('projectNo')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {project.map(item => {
                    return <Option key={item.tcType}>{item.name}</Option>;
                  })}
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
      tice_one: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
console.log(data)
    let data_d = {
      list:[]
    }
    if(data.data){
      data_d.list = data.data;
      data_d.pagination = data.pagination;
      data_d.pagination.total = data.total;
    }

    if (checkData(data)) {
      return (
        // <Card bodyStyle={{padding:'16px 20px'}} bordered={false}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
            </div>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data_d}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              total={data.total}
            />
          </div>
        </Card>
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

export default tice;
