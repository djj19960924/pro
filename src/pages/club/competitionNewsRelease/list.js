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
  { id: 0, name: "俱乐部" },
  { id: 1, name: "协会" },
  { id: 2, name: "团体会" }
];
const types = type.map(data => (
  <Option value={data.id} key={data.id}>
    {data.name}
  </Option>
));

let admin_list;
let competition_list;

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

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

@connect(({ competitionNews, loading }) => ({
  competitionNews,
  loading: loading.models.competitionNews
}))
@Form.create()
class system extends PureComponent {
  state = {
    modalVisible: false,
    adminModalVisible: false,
    confirmLoading: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 0,
    pageSize: 10,

    editId: null,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据

    organizeId: 63
  };

  componentDidMount() {
    let params = {
      page: this.state.currentPage,
      size: this.state.pageSize
    };

    this.getAdminList(params);
    this.getCompetitionList(params);
  }

  // add or update
  handleAdd = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      //console.log("--- ");
      //console.log(fieldsValue);

      this.setState({ confirmLoading: true });
      let payload = {};
      payload.content = fieldsValue.infoContent;
      payload.adminId = fieldsValue.infoPrincipal;
      payload.title = fieldsValue.infoName;
      payload.note = "";
      payload.competitionId = fieldsValue.infoCompetition;
      payload.coverImg = backInfo.file.response.data.file;
      payload.showTime = new Date().getTime();

      //console.log(payload);

      const { dispatch } = this.props;
      dispatch({
        type: "competitionNews/add",
        payload: payload,
        callback: res => {
          this.setState({ confirmLoading: false });

          //console.log("--- add result ");
          //console.log(res);
          if (res.meta.success) {

            message.success("添加成功");
          }
        }
      });

    });
  };


  // list
  getAdminList = params => {
    let payload = {
      page: 0,
      size: 10,
      key: ""
    };
    const { dispatch } = this.props;
    // 获取管理员列表
    dispatch({
      type: "competitionNews/admin_list_get",
      payload: payload,
      callback: res => {
        //console.log(res);
        if (res.meta.success) {
          admin_list = res.data.data.map(data => (
            <Option value={data.adminId} key={data.adminId}>
              {data.name}
            </Option>
          ));
        }
      }
    });
  };

  // 获取赛事列表
  getCompetitionList = params => {
    let payload = {
      page: 0,
      size: 10
    };
    const { dispatch } = this.props;

    dispatch({
      type: "competitionNews/competition_list_get",
      payload: payload,
      callback: res => {
        //console.log(res);
        if (res.meta.success) {
          //console.log(res);
          competition_list = res.data.data.map(data => (
            <Option value={data.competitionId} key={data.competitionId}>
              {data.competitionName}
            </Option>
          ));
        }
      }
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleAdd}>
        <FormItem {...formItemLayout} label="赛事活动新闻标题">
          {getFieldDecorator("infoName", {
            rules: [
              { required: true, message: "新闻标题必须" }
            ]
          })(
            <Input placeholder="请输入赛事活动新闻标题"/>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="所属赛事">
          {getFieldDecorator("infoCompetition", {
            rules: [
              {required: true, message: "要求"}
            ]
          })(
            <Select
            showSearch
            style={{ width: 200 }}
            placeholder="请指定赛事"
            optionFilterProp="children"
            notFoundContent="无法找到"
          >
            {competition_list}
          </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="发布人">
          {getFieldDecorator("infoPrincipal", {
            rules: [
              {required: true, message: "要求"}
            ]
          })(
               <Select
               showSearch
               style={{ width: 200 }}
               placeholder="请指定管理员"
               optionFilterProp="children"
               notFoundContent="无法找到"
             >
               {admin_list}
             </Select>
    )}
        </FormItem>



        <FormItem {...formItemLayout} label="赛事活动新闻封面">
          {getFieldDecorator("infoLogo", {
            rules: [{ required: true, message: "赛事活动封面要求!" }]
          })(
            <Upload {...props_upload}>
              <Button type="primary">
                <Icon type="upload"/>
                上传
              </Button>
            </Upload>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="内容">
          {getFieldDecorator("infoContent")(
            <TextArea placeholder="赛事活动内容"/>
          )}
        </FormItem>


        <Col md={4} sm={18}>
            <span className={styles.submitButtons}>
              {/* 取消返回前一页*/}
              <Button>
                取消
              </Button>
              <Button
                style={{ marginLeft: 13 }}
                type="primary"
                htmlType="submit"
              >
                确定
              </Button>
            </span>
        </Col>


      </Form>
    );
  }

  render() {
    const {
      competitionNews: { data },
      loading
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleAdminModalVisible: this.handleAdminModalVisible
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
              <div className={styles.tableListForm}>
                {this.renderSimpleForm()}
              </div>
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
