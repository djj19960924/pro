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

import { checkData, getnyr,getPageQuery } from "@/utils/utils";
import { rc, requestUrl_luo, mapKey,fileUrl } from "@/global";

import router from "umi/router";

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");

const { MonthPicker } = DatePicker;
const { TextArea } = Input;

message.config({ top: 100 });

const fileList = [];
let fileListLen = 0;
let fileCanNotUpload = false;
let uploadedFile = false;
let backInfo;
let form_modal =null

let admin_list;
let match_list;

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
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
    md: { span: 16 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 4 },
  },
};

@connect(({ competition, loading }) => ({
  competition,
  loading: loading.models.competition
}))
@Form.create()
class system extends PureComponent {
  state = {
    confirmLoading: false,
    formValues: {},// 筛选表单中的值
    competition :{}

  };

  componentDidMount() {
    this.getCompetitionDetail();
  }

  // add or update
  handleAdd = e => {
    e.preventDefault();

    const { form } = this.props;
  };

  // 获取赛事详情
  getCompetitionDetail = () => {
    let payload = {
      id : getPageQuery().competitionId
    };
    const { dispatch } = this.props;
    // 获取赛事详情
    dispatch({
      type: "competition/get",
      payload: payload,
      callback: res => {
        console.log("111111:",res)
        this.setState({
          competition:res.data.data
        },()=>{
          form_modal.setFieldsValue({
            infoName:res.data.data.competitionName,
            infoType:res.data.data.competitionType==2?'活动':'赛事',
            infoObject:res.data.data.matchObject,
            infoOrganizer:res.data.data.organizer,
            infoStartTime:getnyr(res.data.data.startTime),
            infoEndTime:getnyr(res.data.data.endTime),
            infoCost:'免费',
            infoLocation:res.data.data.location,
            infoNote:res.data.data.note,
            infoMatch:res.data.data.matchEventName,
            infoPrincipal:res.data.data.adminName,
            infoContactInfo:res.data.data.contactInfo,
            infoContent:res.data.data.competitionContent
          })
        })

      }
    });
  };


  // 筛选表单
  
  renderSimpleForm() {
    form_modal = this.props.form;
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <div>
        <FormItem {...formItemLayout} label="赛事活动名称">
          {getFieldDecorator("infoName", {
            rules: [{ required: false}]
          })(<Input placeholder={'请输入赛事活动名称'}/>)}
        </FormItem>

        <FormItem {...formItemLayout} label="类型">
          {getFieldDecorator("infoType", {
            rules: [{ required: false}]
          })(<Input value="类型" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="赛事活动对象">
          {getFieldDecorator("infoObject", {
            rules: [{ required: false }]
          })(<Input placeholder="赛事活动对象" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="主办单位">
          {getFieldDecorator("infoOrganizer", {
            rules: [{ required: false}]
          })(<Input placeholder="请输入主办单位" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="举办时间">
          {getFieldDecorator("infoStartTime", {
            rules: [{ required: false}]
          })(<Input placeholder="请输入举办时间" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="结束时间">
          {getFieldDecorator("infoEndTime", {
            rules: [{ required: false}]
          })(<Input placeholder="请输入结束时间" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="费用">
          {getFieldDecorator("infoCost")(<Input placeholder="免费"/>)}
        </FormItem>

        <FormItem {...formItemLayout} label="地点">
          {getFieldDecorator("infoLocation", {
            rules: [{ required: false}]
          })(<Input placeholder="赛事举办地点"/>)}
        </FormItem>

        <FormItem {...formItemLayout} label="注意事项">
          {getFieldDecorator("infoNote", {
            rules: [{ required: false}]
          })(<Input placeholder="注意事项" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="所属社团">
          {getFieldDecorator("infoMatch", {
            rules: [{ required: false}]
          })(<Input placeholder="所属社团" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="发起人">
          {getFieldDecorator("infoPrincipal", {
            rules: [{ required: false }]
          })(<Input placeholder="发起人" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="联系方式">
          {getFieldDecorator("infoContactInfo", {
            rules: [{ required: false}]
          })(<Input placeholder="请输入联系方式" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="赛事活动封面">
          {getFieldDecorator("infoLogo", {
            rules: [{ required: false}]
          })(<img src={fileUrl+`${this.state.competition.competitionImg}`} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="内容">
          {getFieldDecorator("infoContent", {
            rules: [{ required: false}]
          })(<TextArea placeholder="赛事活动内容" />)}
        </FormItem>

        {/* <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <span className={styles.submitButtons}>
            <Button>取消</Button>
            <Button style={{ marginLeft: 13 }} type="primary" htmlType="submit">
              确定
            </Button>
          </span>
        </FormItem> */}
    </div>
    );
  }

  render() {
    const {
      competition: { data },
      loading
    } = this.props;

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleAdminModalVisible: this.handleAdminModalVisible,

      // map
      handleModalVisible_local: this.handleModalVisible_local,
    
      clickMap: this.clickMap
    };
    

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            {this.renderSimpleForm()}
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
