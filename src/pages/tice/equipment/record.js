import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Select, Button, Modal, message, DatePicker, Spin } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from '@/less/TableList.less';

import { checkData, getPageQuery, getnyr } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

message.config({ top: 100 });

@connect(({ tice_record, loading }) => ({
  tice_record,
  loading: loading.models.tice_record,
}))
@Form.create()
class tice extends PureComponent {
  state = {
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据

    deviceId: null, // 设备id
    allpoint: [],
  };

  columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      render: (val) => (
        <div>{ val + '测试仪' }</div>
      ),
    },
    {
      title: '设备编号',
      dataIndex: 'deviceNo',
    },
    {
      title: '使用日期',
      render: (text, record) => (
        <div>{`${getnyr(record.startTime)} ~ ${getnyr(record.endTime)}`}</div>
      ),
    },
    {
      title: '使用体测点',
      dataIndex: 'venueName',
    },
    // {
    //   title: '操作',
    //   width: '20%',
    //   render: (text, record) => (
    //     <Fragment>
    //       <a onClick={() => this.delete([record.id])}>删除</a>
    //     </Fragment>
    //   ),
    // },
  ];

  componentDidMount() {
    this.setState({ deviceId: getPageQuery().id }, () => {
      let params = {
        pn: this.state.currentPage,
        ps: this.state.pageSize,
      };
      this.getList(params);
    });
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
    params.deviceId = this.state.deviceId;
    params.devcuseTime && (params.devcuseTime = getnyr(params.devcuseTime));

    const { dispatch } = this.props;
    dispatch({
      type: 'tice_record/list',
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

  //delete
  delete = idList => {
    let ids = [];
    if (idList) {
      ids = idList;
    } else {
      if (this.state.selectedRows.length == 0) {
        Modal.warning({
          title: '提示',
          content: '您还没有选择任何调用记录',
        });
        return;
      }
      for (let i = 0; i < this.state.selectedRows.length; i++) {
        ids.push(this.state.selectedRows[i].id);
      }
    }
    Modal.confirm({
      content: '是否确定删除记录？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'tice_record/delete',
          payload: ids,
          callback: res => {
            if (res.meta.code == 200) {
              let current = this.state.currentPage;
              if (this.state.currentDataNum == ids.length && this.state.currentPage > 1) {
                current = this.state.currentPage - 1;
                this.setState({
                  currentPage: current,
                });
              }
              this.getList({ pn: current, ps: this.state.pageSize, ...this.state.formValues });
            }
          },
        });
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
            <FormItem label="使用体测点">
              {getFieldDecorator('venueId')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {this.state.allpoint.map(item => {
                    return <Option key={item.id}>{item.name}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="使用日期">{getFieldDecorator('devcuseTime')(<DatePicker />)}</FormItem>
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
      tice_record: { data },
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
