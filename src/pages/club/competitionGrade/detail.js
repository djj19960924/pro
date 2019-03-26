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

import { checkData, getnyr, cutStr,getPageQuery } from "@/utils/utils";
import { rc, requestUrl_luo,fileUrl} from "@/global";
import router from "umi/router";

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
let fileListLen = 0;
let fileCanNotUpload = false;
let uploadedFile = false;
let backInfo;


@connect(({ competitionGrade, loading }) => ({
  competitionGrade,
  loading: loading.models.competitionGrade
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
      title: "名次",
      render(val,record,index) {
        return <div>{index+1}</div>;
      }
    },
    {
      title:"姓名",
      dataIndex:'name'
    },
    {
      title:'性别',
      dataIndex:'sex',
      render(val){
        return <div>{val==0 ?'女':'男'}</div>
      }
    },
    {
      title:'年龄',
      dataIndex:'age'
    },
    {
      title:'比赛项目',
      dataIndex:'competitionName'
    },
    {
      title:'比赛成绩',
      dataIndex:'grade'
    }
    
  ];

  componentDidMount() {
    let params = {
      page: this.state.currentPage,
      size: this.state.pageSize
    };
    this.getList(params);
  }


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

    this.getList({
      page: this.state.currentPage,
      size: this.state.pageSize,
      param: values
    });
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
    let payload = {
      page: params.page - 1,
      size: params.size,
      param: params.param,
    };
    const { dispatch } = this.props;
    dispatch({
      type: "competitionGrade/grade_list",
      payload: getPageQuery().competitionId,
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

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={18}>
            <FormItem label="姓名">
              {getFieldDecorator("infoName")(
                <Input placeholder="请输入姓名" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={18}>
            <FormItem label="名次">
              {getFieldDecorator("infoRank")(
                <Input placeholder="请选择名次" />
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

  //上传文件限制
  beforeUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 1;
    if(!isLt2M){
      message.error('文件大小不能超过1M');
    }
    return isLt2M;
  };

  handleChange = info =>{
    if(info.file.status === "uploading") {
      this.setState({fileloading:true});
      return
    }
    if(info.file.status === 'done'){
      this.setState({
        fileloading:false,
        file:info.file.response.data.finalFileName,
        file_name:info.file.name
      })
      this.getList({
        page: this.state.currentPage,
        size: this.state.pageSize
      });
    }
  }


  render() {
    const {
      competitionGrade: { data },
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
              
                <Button type="primary">
                  <a href={`https://tc.whtiyu.cn/match-s/grade/example?competitionId=${getPageQuery().competitionId}`} download>下载模板</a>
                </Button>
                <Upload
                 showUploadList={false}
                 action={`${requestUrl_luo}/grade/upload`}
                 data={file=>{
                   return {file:file};
                 }}
                 beforeUpload={this.beforeUpload}
                 onChange={this.handleChange}
                 headers={{
                  authorization: localStorage.getItem("token"),
                  id: localStorage.getItem("identityId")
                 }}
                >
                  <Button loading={this.fileloading} type='primary'>导入成绩表</Button>
                </Upload>
                

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
