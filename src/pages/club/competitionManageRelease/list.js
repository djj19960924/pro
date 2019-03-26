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
import { Map, Markers } from "react-amap";

import styles from "@/less/TableList.less";

import { checkData, getnyr } from "@/utils/utils";
import { rc, requestUrl_luo, mapKey } from "@/global";

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

// 定位地图
const CreateForm_local = Form.create()(props => {
  const {
    modalVisible_local,
    form,
    handleModalVisible_local,
    clickMap,
    okaddlongandlat,
    locationInfo
  } = props;
  const markers = [
    {
      position: {
        longitude: locationInfo && locationInfo.longitude,
        latitude: locationInfo && locationInfo.latitude
      },
      title: locationInfo && locationInfo.name
    }
  ];

  const okHandle = () => {
    okaddlongandlat(locationInfo);
  };
  const events = {
    click: e => {
      clickMap(e);
    }
  };
  return (
    <Modal
      title="定位"
      width="800px"
      height="400px"
      visible={modalVisible_local}
      onOk={okHandle}
      onCancel={() => handleModalVisible_local()}
    >
      <div style={{ position: "relative", bottom: 10 }}>
        经度 ：{locationInfo && locationInfo.longitude} &nbsp;纬度 ：
        {locationInfo && locationInfo.latitude}
      </div>
      <div style={{ height: "500px", width: "100%" }}>
        <Map
          plugins={["ToolBar"]}
          zoom={14}
          amapkey={mapKey}
          events={events}
          center={{longitude:122.487084, latitude:37.16599}}
        >
          <Markers markers={markers} />
        </Map>
      </div>
    </Modal>
  );
});

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
    modalVisible: false,
    adminModalVisible: false,
    confirmLoading: false,
    formValues: {} // 筛选表单中的值
  };

  componentDidMount() {
    let params = {
      page: this.state.currentPage,
      size: this.state.pageSize
    };
    this.getAdminList(params);
    this.getMatchList(params);
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
      if (undefined != fieldsValue.infoContactInfo) {
        payload.cost = fieldsValue.infoCost;
      }
      payload.competitionContent = fieldsValue.infoContent;
      payload.startTime = new Date(fieldsValue.infoStartTime._d).getTime();
      payload.endTime = new Date(fieldsValue.infoEndTime._d).getTime();
      payload.location = fieldsValue.infoLocation;
      payload.organizer = fieldsValue.infoOrganizer;
      payload.matchObject = fieldsValue.infoObject;
      payload.note = fieldsValue.infoNote;
      payload.contactInfo = fieldsValue.infoContactInfo;
      payload.competitionType = fieldsValue.infoType;
      payload.competitionName = fieldsValue.infoName;
      payload.adminId = fieldsValue.infoPrincipal;
      payload.matchEventId = fieldsValue.infoMatch;
      payload.competitionImg = backInfo.file.response.data.file;

      //console.log(payload);

      const { dispatch } = this.props;
      dispatch({
        type: "competition/add",
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

  handleModalVisible_local = flag => {
    this.setState({
      modalVisible_local: !!flag
    });
  };
  clickMap = e => {
    let locationInfo = this.state.locationInfo;
    locationInfo.longitude = e.lnglat.lng;
    locationInfo.latitude = e.lnglat.lat;
    this.setState({
      longitude: e.lnglat.lng,
      latitude: e.lnglat.lat,
      locationInfo: locationInfo
    });
  };
  okaddlongandlat = locationInfo => {
    this.setState({ confirmLoading: true });
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'competition/add',
    //   payload: {
    //     id:locationInfo.id,
    //     latitude:locationInfo.latitude,
    //     longitude:locationInfo.longitude,
    //   },
    //   callback: res => {
    //     this.setState({ confirmLoading: false });
    //     if (res.code == 200) {
    //       this.handleModalVisible_local();
    //       this.getList({
    //         pn: this.state.currentPage,
    //         ps: this.state.pageSize,
    //         ...this.state.formValues,
    //       });
    //       message.success('定位成功');
    //     }
    //   },
    // });
  };
  // 定位
  setLocation = () => {
    this.setState({
      modalVisible_local: true,
      locationInfo: {
        longitude: "",
        latitude: ""
        // name:record.gym_name,
        // id:record.id,
      }
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
      type: "competition/admin_list_get",
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

  // 获取社团列表
  getMatchList = params => {
    let payload = {
      page: 0,
      size: 10000
    };
    const { dispatch } = this.props;

    // 获取社团列表
    dispatch({
      type: "competition/match_list_get",
      payload: payload,
      callback: res => {
        //console.log(res);
        if (res.meta.success) {
          //console.log(res);
          match_list = res.data.data.map(data => (
            <Option value={data.matchEventId} key={data.matchEventId}>
              {data.eventName}
            </Option>
          ));
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
      <Form onSubmit={this.handleAdd}>
        <FormItem {...formItemLayout} label="赛事活动名称">
          {getFieldDecorator("infoName", {
            rules: [{ required: true, message: "赛事名称必须" }]
          })(<Input placeholder="请输入赛事活动名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="类型">
          {getFieldDecorator("infoType", {
            rules: [{ required: true, message: "选择类型" }]
          })(
            <Select placeholder="请选择类型">
              <Option value="1">赛事</Option>
              <Option value="2">活动</Option>
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="赛事活动对象">
          {getFieldDecorator("infoObject", {
            rules: [
              { required: true, message: "活动对象必选!" },
              { max: 8, message: "最大长度不能超过8个字符!" }
            ]
          })(<Input placeholder="赛事活动对象" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="主办单位">
          {getFieldDecorator("infoOrganizer", {
            rules: [{ required: true, message: "要求" }]
          })(<Input placeholder="请输入主办单位" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="举办时间">
          {getFieldDecorator("infoStartTime", {
            rules: [{ required: true, message: "要求" }]
          })(<DatePicker />)}
        </FormItem>

        <FormItem {...formItemLayout} label="结束时间">
          {getFieldDecorator("infoEndTime", {
            rules: [{ required: true, message: "要求" }]
          })(<DatePicker />)}
        </FormItem>

        <FormItem {...formItemLayout} label="费用">
          {getFieldDecorator("infoCost")(<Input placeholder="免费" disabled />)}
        </FormItem>

        <FormItem {...formItemLayout} label="地点">
          {getFieldDecorator("infoLocation", {
            rules: [{ required: true, message: "要求" }]
          })(
            <Input placeholder="赛事举办地点"/>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="注意事项">
          {getFieldDecorator("infoNote", {
            rules: [{ required: true, message: "要求" }]
          })(<Input placeholder="注意事项" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="所属社团">
          {getFieldDecorator("infoMatch", {
            rules: [{ required: true, message: "要求" }]
          })(
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="请指定社团"
              optionFilterProp="children"
              notFoundContent="无法找到"
            >
              {match_list}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="发起人">
          {getFieldDecorator("infoPrincipal", {
            rules: [{ required: true, message: "要求" }]
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

        <FormItem {...formItemLayout} label="联系方式">
          {getFieldDecorator("infoContactInfo", {
            rules: [
              { required: false, message: "请输入联系方式" },
              {
                pattern: "(\\(\\d{3,4}\\)|\\d{3,4}-|\\s)?\\d{7,14}",
                message: "请输入正确的电话号码"
              }
            ]
          })(<Input placeholder="请输入联系方式" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="赛事活动封面">
          {getFieldDecorator("infoLogo", {
            rules: [{ required: true, message: "赛事活动封面要求!" }]
          })(
            <Upload {...props_upload}>
              <Button type="primary">
                <Icon type="upload" />
                上传
              </Button>
            </Upload>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="内容">
          {getFieldDecorator("infoContent", {
            rules: [{ required: true, message: "要求" }]
          })(<TextArea placeholder="赛事活动内容" />)}
        </FormItem>

        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <span className={styles.submitButtons}>
            {/* 取消返回前一页*/}
            <Button>取消</Button>
            <Button style={{ marginLeft: 13 }} type="primary" htmlType="submit">
              确定
            </Button>
          </span>
        </FormItem>
      </Form>
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
      okaddlongandlat: this.okaddlongandlat,
      clickMap: this.clickMap
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
      adminModalVisible: this.state.adminModalVisible,

      // map
      modalVisible_local: this.state.modalVisible_local,
      locationInfo: this.state.locationInfo
    };

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            {this.renderSimpleForm()}
          </Card>
          <CreateForm_local {...parentMethods} {...parentStates} />
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
