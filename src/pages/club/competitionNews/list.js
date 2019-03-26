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
  Upload
} from "antd";
import StandardTable from "@/components/StandardTable";
import UploadImg from "@/components/UploadImg";
import Link from "umi/link";

import styles from "@/less/TableList.less";

import { checkData, getnyr } from "@/utils/utils";
import { rc, requestUrl_luo } from "@/global";
import router from "umi/router";

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");
const type = [
  { id: 0, name: "马拉松" },
  { id: 1, name: "。。。" },
  { id: 2, name: "。。。。。。" }
];
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

const props_upload = {
  action: `${requestUrl_luo}/match/upload/single`,
  listType: "picture",
  defaultFileList: [...fileList],
  name: "file",
  headers: {
    authorization: "authorization-text"
  },
  beforeUpload(file) {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJPG) {
      message.error("只能上传 jpg 或者 png 格式的文件");
      fileCanNotUpload = true;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过 2 M");
      fileCanNotUpload = true;
    }
    const isSingle = fileListLen < 1;
    if (!isSingle) {
      message.error("已上传图片，请先删除！");
      fileCanNotUpload = true;
      uploadedFile = true;
    }
    return isJPG && isLt2M && isSingle;
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      //console.log(info);
    }
    if (fileCanNotUpload) {
      if (uploadedFile) {
        info.fileList.splice(1, info.fileList.length);
        uploadedFile = false;
      } else {
        info.fileList.splice(0, info.fileList.length);
      }
      fileCanNotUpload = false;
    } else {
      backInfo = info;
    }
    //console.log("------ back info ");
    //console.log(backInfo);
    fileListLen = info.fileList.length;

    if (info.file.status === "done") {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} 文件上传失败`);
    }
  },
  onRemove() {
    //todo 移除之后出现backInfo 没有移除 bug
    //console.log("--- remove ");
    uploadedFile = false;
    backInfo = null;
  }
};



@connect(({ competitionNews, loading }) => ({
  competitionNews,
  loading: loading.models.competitionNews
}))
@Form.create()
class system extends PureComponent {
  state = {
    confirmLoading: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    editId: null,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据

    organizeId: 63
  };

  columns = [
    {
      title: "序列",
      render(val, record, index) {
        return <div>{index + 1}</div>;
      }
    },
    {
      title: "新闻标题",
      dataIndex: "title"
    },
    {
      title: "新闻类型",
      dataIndex: "newsType",
      render(val) {
        return <div>{val == 1 ? "赛事" : ""}</div>;
      }
    },
    {
      title: "新闻内容",
      dataIndex: "content"
    },
    {
      title: "发布人",
      dataIndex: "adminName"
    },
    {
      title: "申请时间",
      dataIndex: "createTime",
      render(val) {
        return getnyr(val);
      }
    },
    {
      title: "发布时间",
      dataIndex: "showTime",
      render(val) {
        return getnyr(val);
      }
    },
    {
      title: "状态",
      dataIndex: "status",
      render(val) {
        return <div>{val == 2 ? "审核通过" : "审核中"}</div>
      }
    },
    {
      title: "备注",
      dataIndex: "note"
    },
    {
      title: "操作",
      render: (text, record) => (
        <Fragment>
          <a
          onClick={() => router.push(rc + "/club/competitionNewsCheck/list?"
            + record.newsId)}            
            className="ant-dropdown-link"
          >
            审核
          </a>
          <Divider type="vertical" />
          {/* <a
            className="ant-dropdown-link">
            编辑
          </a> */}
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    let params = {
      page: this.state.currentPage,
      size: this.state.pageSize
    };
    this.getList(params);
  }


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
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf()
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
            param: values,
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

    //console.log(params)

    let payload = {
      page: params.page - 1,
      size: params.size,
      param: params.param
    };
    //console.log('list param ')
    //console.log(payload)
    const { dispatch } = this.props;
    dispatch({
      type: "competitionNews/list",
      payload: payload,
      callback: res => {
        //console.log(res);
        if (res.meta.success) {
          this.setState({
            currentDataNum: res.data.data.length,
            selectedRows: []
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
        ids.push(this.state.selectedRows[i].newsId);
      }
      //console.log(ids);
    }
    Modal.confirm({
      content: "是否确定删除记录？",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        this.props.dispatch({
          type: "competitionNews/delete",
          payload: ids,
          callback: res => {
            //console.log(res);
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

  // 编辑
  edit = function(e, id) {
    if (e.key == 1) {
      const { dispatch } = this.props;
      dispatch({
        type: "competition/get",
        payload: id,
        callback: res => {
          if (res.code == 200) {
            this.setState({
              editId: res.data.id
            });
            form_modal.setFieldsValue({
              name: res.data.name,
              type: res.data.type
            });
          }
        }
      });
    } else if (e.key == 2) {
      this.delete([id]);
    }
  };

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 2, xl: 18 }}>
          <Col md={6} sm={18}>
            <FormItem label="新闻标题">
              {getFieldDecorator("infoName")(
                <Input placeholder="请输入标题名称" />
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={18}>
            <FormItem label="新闻内容">
              {getFieldDecorator("infoContent")(
                <Input placeholder="请输入新闻内容" />
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={18}>
            <FormItem label="发布人">
              {getFieldDecorator("infoAdminId")(
                <Input placeholder="姓名" />
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={18}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              {/* <Button
                style={{ marginLeft: 13 }}
                type="primary"
                htmlType="submit"
              >
                高级搜索
              </Button> */}
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
      competitionNews: { data },
      loading
    } = this.props;
    const { selectedRows } = this.state;

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button
                  type="primary"
                  onClick={() =>
                    router.push(rc + "/club/competitionNewsRelease")
                  }
                >
                  发布新闻
                </Button>
                <Button type="danger" onClick={() => this.delete()}>
                  删除
                </Button>
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
                // total={data.pagination.total}
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
