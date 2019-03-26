import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import moment from "moment";
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
  message,
  Divider,
  DatePicker,
  Spin,
  Menu,
  TreeSelect,
  Dropdown,
  Icon,
  Upload,
  Switch
} from "antd";
import StandardTable from "@/components/StandardTable";
import UploadImg from "@/components/UploadImg";
import Link from "umi/link";
import FourCards from '@/components/FourCards';

import styles from "@/less/TableList.less";

import { checkData, getnyr, cutStr } from "@/utils/utils";
import { rc, requestUrl_luo, fileUrl } from "@/global";
import { Label } from "bizcharts";
import router from "umi/router";
import { change_admin } from "@/services/clubs";

import a1 from './images/1.png'
import a2 from './images/2.png'
import a3 from './images/3.png'
import a4 from './images/4.png'

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");
const type = [
  { id: 1, name: "俱乐部" },
  { id: 2, name: "协会" },
  { id: 3, name: "团体会" }
];
const types = type.map(data => (
  <Option value={data.id} key={data.id}>
    {data.name}
  </Option>
));

let admin_list;

const { MonthPicker } = DatePicker;
const { TextArea } = Input;

message.config({ top: 100 });

@connect(({ community, loading }) => ({
  community,
  loading: loading.models.community
}))
@Form.create()
class system extends PureComponent {
  state = {
    modalVisible: false,
    adminModalVisible: false,
    confirmLoading: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    editId: null,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据

    organizeId: 63,
    history:{},
    stData:[]
  };

  columns = [
    {
      title: "社团名称",
      dataIndex: "eventName"
    },
    {
      title: "社团分类",
      dataIndex: "matchType",
      render(val) {
        return <div>{val == 1 ? "俱乐部" : val == 2 ? "协会" : "团体会"}</div>;
      }
    },
    {
      title: "活动数",
      dataIndex: "activeCount"
    },
    {
      title: "赛事数",
      dataIndex: "competitionCount"
     
    },
    {
      title: "操作",
      render: (text, record) => (
        <Fragment>
          <Link to={`${rc}/club/competitionHistory/detail?matchEventId=`+record.matchEventId}>
            详情
          </Link>
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    this.getHistory()
    let params = {
      page: this.state.currentPage,
      size: this.state.pageSize
    };
    this.getList(params);
  }

  getHistory = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: "community/history",
      callback: res => {
        var data = [
          {
            icon:a1,
            key:'当前社团数',
            value:res.match
          },
          {
            icon:a2,
            key:'社团赛事及活动',
            value:res.competitionAndActive
          },
          {
            icon:a3,
            key:'社团赛事数',
            value:res.competition
          },
          {
            icon:a4,
            key:'社团活动数',
            value:res.active
          },
        ]
        this.setState({
          stData : data
        })
      }
    });
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      editId: null
    });
    form_modal.resetFields();
    this.getAdminList({
      page: 1,
      size: 10
    });
  };

  // 多选
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows
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
      pageSize: pagination.pageSize
    });
    const params = {
      page: pagination.current,
      size: pagination.pageSize,
      ...formValues,
      ...filters
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
        ...fieldsValue
      };
      this.setState(
        {
          formValues: values,
          currentPage: 1
        },
        function() {
          this.getList({
            page: this.state.currentPage,
            size: this.state.pageSize,
            param: values
          });
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
        currentPage: 1
      },
      () => {
        this.getList({
          page: this.state.currentPage,
          size: this.state.pageSize
        });
      }
    );
  };

  // list
  getList = params => {
    console.log(params.param);

    let payload = {
      page: params.page - 1,
      size: params.size,
      param: params.param
    };

    const { dispatch } = this.props;
    dispatch({
      type: "community/list",
      payload: payload,
      callback: res => {
        if (res.meta.success) {
          this.setState({
            currentDataNum: res.data.data.length,
            selectedRows: []
          });
        }
      }
    });
  };

  // 获取admin列表 用于新建社团
  getAdminList = params => {
    let payload = {
      page: params.page - 1,
      size: params.size,
      key: ""
    };

    //console.log("--- get Admin List list.js ")
    const { dispatch } = this.props;

    dispatch({
      type: "community/admin_list_get",
      payload: payload,
      callback: res => {
        if (res.meta.success) {
          //console.log("--- success ")

          // this.setState({
          //   currentDataNum: res.data.data.length,
          //   selectedRows: []
          // });
          //console.log(res.data.data);
          admin_list = res.data.data.map(data => (
            <Option value={data.adminId} key={data.adminId}>
              {data.name}
            </Option>
          ));
        }
      }
    });
  };

  // delete
  delete = idList => {
    let ids = [];

    if (idList) {
      ids = idList;
    } else {
      // Modal.warning({
      //   title: "提示",
      //   content: "暂不支持批量删除"
      // });
      // return;
      if (this.state.selectedRows.length == 0) {
        Modal.warning({
          title: "提示",
          content: "您还没有选择任何用户"
        });
        return;
      }
      //console.log(this.state.selectedRows);
      for (let i = 0; i < this.state.selectedRows.length; i++) {
        //console.log('--- delete row ' + this.state.selectedRows[i].matchEventId);
        ids.push(this.state.selectedRows[i].matchEventId);
      }
    }
    Modal.confirm({
      content: "是否确定删除记录？",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        this.props.dispatch({
          type: "community/delete",
          payload: ids,
          callback: res => {
            //console.log(res)

            if (res.meta.success) {
              message.success("删除成功");
              let current = this.state.currentPage;
              if (
                this.state.currentDataNum == ids.length &&
                this.state.currentPage > 1
              ) {
                current = this.state.currentPage - 1;
                this.setState({
                  currentPage: current
                });
              }
              this.getList({
                page: current,
                size: this.state.pageSize,
                ...this.state.formValues
              });
            } else {
              message.error("删除失败!");
            }
          }
        });
      }
    });
  };

 

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={18}>
            <FormItem label="社团名称">
              {getFieldDecorator("eventName")(
                <Input placeholder="请输入社团名称" />
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={18}>
            <FormItem label="社团分类">
              {getFieldDecorator("matchType")(
                <Select placeholder="请选择">
                  <Option value="1">俱乐部</Option>
                  <Option value="2">协会</Option>
                  <Option value="3">团体会</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={18}>
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
      community: { data },
      loading
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = {
      // 传递方法
      handleModalVisible: this.handleModalVisible,
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
      adminModalVisible: this.state.adminModalVisible
    };

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <FourCards data={this.state.stData}></FourCards>
              </div>
              <div className={styles.tableListForm}>
                {this.renderSimpleForm()}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                total={data.pagination.total}
              />
            </div>
          </Card>
      
        </div>
      );
    } else {
      return (
        <Spin
          style={{ position: "absolute", top: 140, left: 0, right: 0 }}
          size="large"
          tip="Loading..."
        />
      );
    }
  }
}

export default system;
