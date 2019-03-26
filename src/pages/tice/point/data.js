import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  TreeSelect,
  Select,
  Cascader,
  Button,
  Modal,
  message,
  Divider,
  Spin,
  Menu,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import Link from 'umi/link';

import styles from '@/less/TableList.less';

import { checkData } from '@/utils/utils';
import { rc } from '@/global';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

message.config({ top: 100 });

@connect(({ tice_point, loading }) => ({
  tice_point,
  loading: loading.models.tice_point,
}))
@Form.create()
class tice extends PureComponent {
  state = {
    areaTree: JSON.parse(localStorage.getItem('areaTree')),
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 6,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据
  };

  columns = [
    {
      title: '体测点',
      dataIndex: 'name',
    },
    {
      title: '详细地址',
      dataIndex: 'addr',
    },
    {
      title: '设备数量',
      dataIndex: 'deviceCount',
    },
    {
      title: '体测人数',
      dataIndex: 'userCount',
    },
    {
      title: '体测合格率',
      dataIndex: 'passRate',
      render: (text, record) => (
        <div>{text}%</div>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Link to={`${rc}/tice/point/detail?pointId=${record.id}`}>查看体测数据</Link>
        </Fragment>
      ),
    },
  ];

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

      fieldsValue.areaId&&(fieldsValue.areaId = fieldsValue.areaId[1])

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
      type: 'tice_point/list',
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
            <FormItem label="体测点名称">
              {getFieldDecorator('venueName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属区域">
              {getFieldDecorator('areaId')(
                <Cascader options={JSON.parse(localStorage.getItem('areaTree'))} placeholder="请选择" showSearch />,
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
      tice_point: { data },
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
        <div>
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
                total={data.total}
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

export default tice;
