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
  Checkbox
} from "antd";
import StandardTable from "@/components/StandardTable";
import UploadImg from "@/components/UploadImg";
import Link from "umi/link";

import styles from "@/less/TableList.less";

import { checkData, getnyr, cutStr ,getPageQuery } from "@/utils/utils";
import { rc, requestUrl_luo } from "@/global";
import router from "umi/router";
import ExportJsonExcel from "js-export-excel";

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");
const type = [{ id: 1, name: "赛事" }, { id: 2, name: "活动" }];
const types = type.map(data => (
  <Option value={data.id} key={data.id}>
    {data.name}
  </Option>
));

const { MonthPicker } = DatePicker;
const { TextArea } = Input;

message.config({ top: 100 });

const fileList = [];
let backInfo;


@connect(({ competition, loading }) => ({
  competition,
  loading: loading.models.competition
}))
@Form.create()
class system extends PureComponent {
  state = {
    modalVisible: false,

    confirmLoading: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    editId: null,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据

    organizeId: 63,
    competition_add: null,
  };

  columns = [
    {
      title: "赛事活动名称",
      dataIndex: "competitionName",
      render(val){
        return <div>{cutStr(val)}</div>
      }
    },
    {
      title: "类型",
      dataIndex: "competitionType",
      render(val) {
        return <div>{val == 1 ? "赛事" : "活动"}</div>;
      }
    },
    {
      title: "内容",
      dataIndex: "competitionContent",
      render(val){
        return <div>{cutStr(val,12)}</div>
      }
    },
    {
      title: "赛事活动对象",
      dataIndex: "matchObject"
    },
    {
      title: "主办单位",
      dataIndex: "organizer"
    },
    {
      title: "举办时间",
      dataIndex: "startTime",
      render(val) {
        return getnyr(val);
      }
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      render(val) {
        return getnyr(val);
      }
    },
    {
      title: "发起人",
      dataIndex: "adminName"
    },
    {
      title: "联系方式",
      dataIndex: "contactInfo"
    },
    {
      title: "备注",
      dataIndex: "note",
      render(val){
        return <div>{cutStr(val,12)}</div>
      }
    },
    
  ];

  componentDidMount() {
    let params = {
      page: this.state.currentPage,
      size: this.state.pageSize
    };
    this.getList(params);
  }

  downloadExcel = () => {
    const data = this.state.excelData ? this.state.excelData : ""; //表格数据
    var option = {};
    let dataTable = [];
    if (data) {
      for (let i in data) {
        var startTime1=data[i].startTime;
        var startTime2=new Date();
        var startTime = startTime.getFullYear() +"-" +(startTime.getMonth()+1) +"-" +startTime.getDate()
        if (data[i].status==2) {
          let obj = {
            赛事活动名称: data[i].competitionName,
            类型: data[i].competitionType == 1 ? "赛事" : "活动",
            内容: data[i].competitionContent,
            赛事活动对象: data[i].matchObject,
            主办单位: data[i].organizer,
            举办时间: startTime,
            结束时间: data[i].endTime,
            发起人:data[i].adminName,
            备注: data[i].note, 
          };
          dataTable.push(obj);
        }
      }
    }
    option.fileName = "社团赛事活动表";
    option.datas = [
      {
        sheetData: dataTable,
        sheetName: "sheet",
        sheetFilter: ["赛事活动名称","类型","内容","赛事活动对象","主办单位","举办时间","结束时间","发起人","备注"],
        sheetHeader: ["赛事活动名称","类型","内容","赛事活动对象","主办单位","举办时间","结束时间","发起人","备注"]
      }
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };


  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      // editId: null
    });

    form_modal.resetFields();
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
      //console.log(values);

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
    //console.log(params.param);

    let payload = {
      page: params.page - 1,
      size: params.size,
      param: params.param,
      matchEventId:getPageQuery().matchEventId
    };

    const { dispatch } = this.props;
    dispatch({
      type: "competition/list",
      payload:payload,
      callback: res => {
        if (res.meta.success) {
          this.setState({
            currentDataNum: res.data.data.length,
            selectedRows: [],
          });
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
      for (let i = 0; i < this.state.selectedRows.length; i++) {
        ids.push(this.state.selectedRows[i].competitionId);
      }
    }
    Modal.confirm({
      content: "是否确定删除记录？",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        this.props.dispatch({
          type: "competition/delete",
          payload: ids,
          callback: res => {
            if (res.meta.success) {
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
            <FormItem label="赛事活动名称">
              {getFieldDecorator("infoName")(
                <Input placeholder="请输入赛事活动名称" />
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={18}>
            <FormItem label="类型">
              {getFieldDecorator("infoType")(
                <Select placeholder="请选择类型">
                  <Option value="1">赛事</Option>
                  <Option value="2">活动</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={18}>
            <FormItem label="主办单位">
              {getFieldDecorator("infoOrganizer")(
                <Input placeholder="请输入主办单位" />
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={18}>
            <FormItem label="发起人">
              {getFieldDecorator("infoAdminName")(
                <Input placeholder="请输入姓名" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={18}>
            <FormItem label="赛事举办时间">
              {getFieldDecorator("infoTime")(<DatePicker />)}
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
      competition: { data },
      loading
    } = this.props;
    const { selectedRows } = this.state;


    if (!data) {
      return;
    }

    const parentMethods = {
      // 传递方法

      handleModalVisible: this.handleModalVisible,
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
      competition_add: this.state.competition_add,

    };


    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={this.downloadExcel}>导出赛事活动表</Button>
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
