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
import { rc, requestUrl_luo, mapKey, fileUrl } from "@/global";

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
    formValues: {}, // 筛选表单中的值
    competition_id: null,
  };

  componentDidMount() {

    let key = location.search;
    key = key.substr(1, key.length);
    //console.log(key);
    let params = {
      id: key
    };
    this.setState({
      competition_id: key
    });

    this.getCompetitionDetail(params);
  }

  // pass
  handleAdd = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      //console.log("--- ");
      //console.log(fieldsValue);

      this.setState({ confirmLoading: true });
      let payload = {};
      payload.competition_id = this.state.competition_id;
      
      //console.log(payload);

      const { dispatch } = this.props;
      dispatch({
        type: "competition/pass",
        payload: payload,
        callback: res => {
          this.setState({ confirmLoading: false });

          //console.log("--- add result ");
          //console.log(res);
          if (res.meta.success) {
            message.success("审核成功");
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

  // 获取赛事详情
  getCompetitionDetail = params => {
    var that = this;
    let payload = {
      id: params.id
    };
    const { dispatch } = this.props;
    dispatch({
      type: "competition/get",
      payload: payload,
      callback: res => {
        //console.log(res);
        if (res.meta.success) {
          console.log(res);
          that.setState({
            data:res.data
          })
        }
      }
    });
  };

  renderLabel(data) {
    
    if (!data) {
      return;
    }

    let start = new Date(data.startTime);
    let end = new Date(data.endTime);
    
    let startTime = start.getFullYear() + '-' + 
    (start.getMonth()+1) + '-' + start.getDate();
    let endTime = end.getFullYear() + '-' +
    (end.getMonth()+1) + '-' + end.getDate();

    //console.log(data)
    //console.log(start);

    const {
      form: { getFieldDecorator }
    } = this.props;

    return <Form  onSubmit={this.handleAdd}>

    <FormItem {...formItemLayout} label="赛事活动名称">
    {(<Input disabled value={data.competitionName} />)}
  </FormItem>

  <FormItem {...formItemLayout} label="类型">
    {(
    <Input disabled value={data.competitionType == 1 ? "赛事" : "活动"} /> 
    )}
  </FormItem>

  <FormItem {...formItemLayout} label="赛事活动对象">
    { (<Input disabled  value={data.matchObject} />)}
  </FormItem>

  <FormItem {...formItemLayout} label="主办单位">
    { (<Input disabled value={data.organizer} />)}
  </FormItem>

  <FormItem {...formItemLayout} label="举办时间">
    { ( 
      <Input disabled  value={startTime}/>
    )}
  </FormItem>

  <FormItem {...formItemLayout} label="结束时间">
    { ( 
      <Input disabled value={endTime} />
    )}
  </FormItem>

  <FormItem {...formItemLayout} label="费用">
    { (
    <Input disabled value="免费" disabled />)}
  </FormItem>

  {/* <FormItem {...formItemLayout} label="定位">
    {getFieldDecorator("infoLocation")(
      <a onClick={() => this.setLocation()}>定位</a>
    )}
  </FormItem> */}

  <FormItem {...formItemLayout} label="注意事项">
    { (<Input disabled value={data.note} />)}
  </FormItem>

  <FormItem {...formItemLayout} label="所属社团">
    { (
      <Input disabled value={data.matchEventName} />
    )}
  </FormItem>

  <FormItem {...formItemLayout} label="发起人">
    { (
      <Input disabled value={data.adminName} />
    )}
  </FormItem>

  <FormItem {...formItemLayout} label="联系方式">
    { (<Input disabled value={data.contactInfo} />)}
  </FormItem>

  <FormItem {...formItemLayout} label="赛事活动封面">
    { (
    <Avatar src={fileUrl + "/" + data.competitionImg} />
    )}
  </FormItem>

 <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator("infoNote", {
            rules: [{ required: false, message: "要求" }]
          })(<Input disabled placeholder="备注" />)}
        </FormItem>

  <FormItem {...formItemLayout} label="内容">
    { (<TextArea disabled value={data.competitionContent} />)}
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

  }

  render() {
    const {
      loading
    } = this.props;
    const {data} = this.state;

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
                {this.renderLabel(data.data)}
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
