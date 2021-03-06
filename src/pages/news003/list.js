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

import { checkData,getnyr } from '@/utils/utils';
import { rc,fileUrl,news003Id } from '@/global';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>Object.keys(obj).map(key => obj[key]).join(',');

message.config({ top: 100 });

@connect(({ news003, loading }) => ({
  news003,
  loading: loading.models.news003,
}))
@Form.create()
class news extends PureComponent {
  state = {
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据
  };
  columns = [
    {
      title: '封面',
      render(val,record) {
        return (
          record.img_urls?
          <Avatar shape="square" size={40} src={fileUrl+'/'+record.img_urls.split(",")[0]}/>:
          <Avatar shape="square" size={40} src={fileUrl+'/'+record.img_urls}/>
        )
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '类别',
      dataIndex: 'type_name',
    },
    {
      title: '发布人',
      dataIndex: 'edit_user',
    },
    {
      title: '发布时间',
      dataIndex: 'create_time',
      render(val) {
        return (val?(val):'--')
      }
    },
    {
      title: '点击数',
      dataIndex: 'click_counts',
      render(val) {
        return (val?val:'--')
      }
    },
    {
      title: '操作',
      width: '20%',
      render: (text, record) => (
        <Fragment>
          <Link onClick={() => this.setNewsInfo(record)} to={`${rc}/xsjszs/add/index?id=${record.id}&disabled=t`}>详情</Link>
          <Divider type="vertical" />
          <Dropdown overlay={this.menu(record)} trigger={['click']}>
            <a className="ant-dropdown-link">
              编辑 <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      ),
    },
  ];

  setNewsInfo = function(record){
    localStorage.setItem('newsInfo',JSON.stringify(record))
  };

  menu = record => {
    return (
      <Menu onClick={e => this.edit(e, record)}>
      {
        record && !record.status && <Menu.Item key="3">发布</Menu.Item>
      }
        <Menu.Item key="1">
          <Link to={`${rc}/xsjszs/add/index?id=${record.id}`}>修改</Link>
        </Menu.Item>
        <Menu.Item key="2">删除</Menu.Item>
      </Menu>
    );
  };

  componentDidMount() {
    let params = {
      pn: this.state.currentPage,
      ps: this.state.pageSize,
    };
    this.getList(params);
    this.getType()
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
    params.type_id = news003Id;
    const { dispatch } = this.props;
    dispatch({
      type: 'news003/list',
      payload: params,
      callback: res => {
        if (res.code == 200) {
          this.setState({
            currentDataNum: res.data.list.length,
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
          content: '您还没有选择任何记录',
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
          type: 'news003/del',
          payload: ids,
          callback: res => {
            if (res.code == 200) {
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

  // 编辑
  edit = function(e, record) {
    if (e.key == 1) {
      localStorage.setItem('newsInfo',JSON.stringify(record))
    }
    if (e.key == 2) {
      this.delete([record.id]);
    }
    if (e.key == 3) {
      Modal.confirm({
        content: '是否确定发布？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.props.dispatch({
            type: 'news003/add',
            payload: {
              id:record.id,
              status:1
            },
            callback: res => {
              if(res.code == 200){
                message.success('发布成功')
                this.getList({
                  pn: this.state.currentPage,
                  ps: this.state.pageSize,
                  ...this.state.formValues,
                });
              }
            },
          });
        },
      });
    }
  };
  
  // 获取分类
  getType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'news003/typeList',
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

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {typeList} = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="精彩瞬间标题">
              {getFieldDecorator('a_title')(<Input placeholder="请输入" />)}
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
      news003: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button type="danger" onClick={() => this.delete()}>
                  删除
                </Button>
              </div>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <StandardTable
                selectedRows={selectedRows}
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

export default news;
