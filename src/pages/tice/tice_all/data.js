import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router'
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  Badge,
  Avatar,
  DatePicker,
  Spin,
  Table,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import Link from 'umi/link';

import styles from '@/less/TableList.less';

import { checkData, getnyr } from '@/utils/utils';
import { rc } from '@/global';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const level = ['', '不合格', '合格', '良好', '优秀'];
const levelColor = ['', '#EB0000', '#EA7120', '#40D34D', '#018FD9'];

message.config({ top: 100 });

@connect(({ tice_all, loading }) => ({
  tice_all,
  loading: loading.models.tice_all,
}))
@Form.create()
class tice extends PureComponent {
  state = {
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据
  };

  columns = [
    {
      title: '序列',
      align: 'center',
      width: '4%',
      render: val => <Badge status="success" />,
    },
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
      width: '5%',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: '4%',
      render: val => (val == 1 ? '男' :val == 2 ? '女' : '--')
    },
    {
      title: '出生日期',
      dataIndex: 'bthDate',
      width: '5%',
      render: val => <div>{val ? val.substring(0,10) : '--'}</div>,
    },
    {
      title: '组别',
      dataIndex: 'groupName',
      width: '5%',
      render: val => <div>{val || '--'}</div>,
    },
    {
      title: '身高/体重',
      dataIndex: 'bmi',
      width: '6%',
      render: val => (this.parseProject(val)),
    },
    {
      title: '肺活量',
      dataIndex: 'fhl',
      width: '5%',
      render: val => (this.parseProject(val)),
    },
    {
      title: '俯卧撑',
      dataIndex: 'fwc',
      width: '5%',
      render: val => (this.parseProject(val)),
    },
    {
      title: '仰卧起坐',
      dataIndex: 'ywqz',
      width: '5%',
      render: val => (this.parseProject(val)),
    },
    {
      title: '台阶测试',
      dataIndex: 'tjcs',
      width: '5%',
      render: val => (this.parseProject(val)),
    },
    {
      title: '握力',
      dataIndex: 'wl',
      width: '5%',
      render: val => (this.parseProject(val)),
    },
    {
      title: '纵跳',
      dataIndex: 'ztgd',
      width: '5%',
      render: val => (this.parseProject(val)),
    },
    {
      title: '反应时',
      dataIndex: 'fys',
      width: '5%',
      render: val => (this.parseProject(val)),
    },
    {
      title: '稳定性',
      dataIndex: 'wdx',
      width: '5%',
      render: val => (this.parseProject(val)),
    },
    {
      title: '坐位体前屈',
      dataIndex: 'zwtqq',
      width: '6%',
      render: val => (this.parseProject(val)),
    },
    {
      title: '总分成绩',
      dataIndex: 'score',
      width: '5%',
    },
    {
      title: '等级',
      dataIndex: 'level',
      width: '4%',
      render: val => <div style={{ color: levelColor[val] }}>{level[val]}</div>,
    },
    {
      title: '体测时间',
      dataIndex: 'createTime',
      width: '6%',
      render: val => <div>{val.substring(0,10)}</div>,
    },
    {
      title: '体测报告',
      align: 'center',
      width: '5%',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.toReport(record)}>查看</a>
        </Fragment>
      ),
    },
    {
      title: '运动处方',
      align: 'center',
      width: '5%',
      render: (text, record) => (
        <Fragment>
          <Link to={`${rc}/tice/all/chufang?id=${record.reportcode}`}>查看</Link>
        </Fragment>
      ),
    },
  ];

  // 解析单项体测项目
  parseProject = json => {
    if(!json)
      return '--'
    else if(JSON.parse(json).note)
      return JSON.parse(json).note + ' ' + JSON.parse(json).danWei
    else
      return JSON.parse(json).score + ' ' + JSON.parse(json).danWei
  }

  // 查看报告
  toReport = record => {
    localStorage.setItem('reportRecord',JSON.stringify(record))
    router.push(`${rc}/tice/all/report`);
  }

  componentDidMount() {
    let params = {
      pn: this.state.currentPage,
      ps: this.state.pageSize,
    };
    this.getList(params);
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

      fieldsValue.reportTime && (fieldsValue.reportTime = getnyr(fieldsValue.reportTime));

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
      type: 'tice_all/list',
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

  // 展开表格
  expandedRowRender = record => {
    const columns = [
      {
        colSpan: 0,
        align: 'center',
        width: '4%',
        render: val => <Badge status="warning" />,
      },
      {
        colSpan: 0,
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
        colSpan: 0,
        dataIndex: 'name',
        width: '5%',
      },
      {
        colSpan: 0,
        dataIndex: 'sex',
        width: '4%',
        render: val => (val == 1 ? '男' :val == 2 ? '女' : '--')
      },
      {
        colSpan: 0,
        dataIndex: 'bthDate',
        width: '5%',
        render: val => <div>{val ? val.substring(0,10) : '--'}</div>,
      },
      {
        colSpan: 0,
        dataIndex: 'groupName',
        width: '5%',
        render: val => <div>{val || '--'}</div>,
      },
      {
        colSpan: 0,
        dataIndex: 'bmi',
        width: '6%',
        render: val => (this.parseProject(val)),
      },
      {
        colSpan: 0,
        dataIndex: 'fhl',
        width: '5%',
        render: val => (this.parseProject(val)),
      },
      {
        colSpan: 0,
        dataIndex: 'fwc',
        width: '5%',
        render: val => (this.parseProject(val)),
      },
      {
        colSpan: 0,
        dataIndex: 'ywqz',
        width: '5%',
        render: val => (this.parseProject(val)),
      },
      {
        colSpan: 0,
        dataIndex: 'tjcs',
        width: '5%',
        render: val => (this.parseProject(val)),
      },
      {
        colSpan: 0,
        dataIndex: 'wl',
        width: '5%',
        render: val => (this.parseProject(val)),
      },
      {
        colSpan: 0,
        dataIndex: 'ztgd',
        width: '5%',
        render: val => (this.parseProject(val)),
      },
      {
        colSpan: 0,
        dataIndex: 'fys',
        width: '5%',
        render: val => (this.parseProject(val)),
      },
      {
        colSpan: 0,
        dataIndex: 'wdx',
        width: '5%',
        render: val => (this.parseProject(val)),
      },
      {
        colSpan: 0,
        dataIndex: 'zwtqq',
        width: '6%',
        render: val => (this.parseProject(val)),
      },
      {
        colSpan: 0,
        dataIndex: 'score',
        width: '5%',
      },
      {
        colSpan: 0,
        dataIndex: 'level',
        width: '4%',
        render: val => <div style={{ color: levelColor[val] }}>{level[val]}</div>,
      },
      {
        colSpan: 0,
        dataIndex: 'createTime',
        width: '6%',
        render: val => <div>{val.substring(0,10)}</div>,
      },
      {
        colSpan: 0,
        align: 'center',
        width: '5%',
        render: (text, record) => (
          <Fragment>
          <a onClick={() => this.toReport(record)}>查看</a>
          </Fragment>
        ),
      },
      {
        colSpan: 0,
        align: 'center',
        width: '5%',
        render: (text, record) => (
          <Fragment>
            <Link to={`${rc}/tice/all/chufang?id=${record.reportcode}`}>查看</Link>
          </Fragment>
        ),
      },
    ];

    if (record.reportList && record.reportList.length > 0) {
      return (
        <div>
          <Table
            style={{ width: '100%' }}
            rowKey="id"
            dataSource={record.reportList}
            columns={columns}
            pagination={false}
            size="middle"
          />
          <div className={styles.moreRecord}>
            <Link
              to={`${rc}/tice/all/moreData?openId=${record.openid}`}
              style={{ width: '100%', display: 'inline-block' }}
            >
              查看更多记录
            </Link>
          </div>
        </div>
      );
    } else {
      return <div className={styles.nomoreRecord}>没有更多记录了</div>;
    }
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
            <FormItem label="等级">
              {getFieldDecorator('level')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option key="4">优秀</Option>
                  <Option key="3">良好</Option>
                  <Option key="2">合格</Option>
                  <Option key="1">不合格</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="体测时间">{getFieldDecorator('reportTime')(<DatePicker />)}</FormItem>
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
      tice_all: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    let data_d = {
      list:[]
    }
    if(data.data){
      data_d.list = data.data
      data_d.pagination = data.pagination;
      data_d.pagination.total = data.total;
    }

    if (checkData(data)) {
      return (
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data_d}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              showRowSelect="none"
              expandedRowRender={this.expandedRowRender}
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
