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

import { checkData, getnyr, cutStr } from "@/utils/utils";
import { rc, requestUrl_luo } from "@/global";
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


// 对话框
let form_modal = null;
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    confirmLoading,
    competition_add,
    // base
  } = props;
  form_modal = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //console.log(fieldsValue)
      handleAdd(fieldsValue);
    });
  };
  
  const handleChange = () => {

  }

  return (
    <Modal
      destroyOnClose
      title="新增报名"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
      width="800px"
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="赛事名称"
      >
        {(<Input disabled value={
          null == competition_add
          ? '' : competition_add.competitionName}
          placeholder="" />)}
      </FormItem>
 
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }} label="开始时间">
          {form.getFieldDecorator("infoStartTime",
          {
            rules: [
              {required: true, message: "要求"}
            ]
          })(<DatePicker />)}
      </FormItem>
          
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }} label="截止时间">
        {form.getFieldDecorator("infoEndTime", {
          rules: [
            {required: true, message: "要求"}
          ]
        })(<DatePicker />)}
      </FormItem>
          
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="报名要求"
      >
        {form.getFieldDecorator("infoRequire", {
          rules: [
            { required: true, message: "请输入报名要求" },
            { max: 500, message: "简介最大为500个字符！" }
          ]
        })(<TextArea rows={4} 
          
        placeholder="报名要求" />)}
      </FormItem>

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="联系方式"
      >
        {form.getFieldDecorator("infoItem", {
          rules: [
            { required: true, message: "请选择报名必选项" }
          ]
        })(
          <Checkbox.Group style={{ width: '100%' }}>
          <Row>
            <Col span={8}><Checkbox value="1">姓名</Checkbox></Col>
            <Col span={8}><Checkbox value="2">性别</Checkbox></Col>
            <Col span={8}><Checkbox value="3">年龄</Checkbox></Col>
            <Col span={8}><Checkbox value="4">联系方式</Checkbox></Col>
            <Col span={8}><Checkbox value="5">身份证号</Checkbox></Col>
            <Col span={8}><Checkbox value="6">工作单位</Checkbox></Col>
          </Row>
        </Checkbox.Group>
        
      )}
      </FormItem>
    </Modal>
  );
});

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
      title: "序列",
      render(val, record, index) {
        return <div>{index + 1}</div>;
      }
    },
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
      title: "所属社团",
      dataIndex: "matchEventName"
    },
    {
      title: "状态",
      dataIndex: "status",
      render(val) {
        return <div>{val == 1 ? "审核中" : "已审核"}</div>;
      }
    },
    {
      title: "备注",
      dataIndex: "note",
      render(val){
        return <div>{cutStr(val,12)}</div>
      }
    },
    {
      title: "详情",
      render: (text, record) => (
        <Fragment>
          <Link to={`${rc}/club/competitionManageFirst/competitionDetail?competitionId=`+record.competitionId}>
            查看
          </Link>
        </Fragment>
      )
    },
    {
      title: "操作",
      render: (text, record) => (
        <Fragment>
          {
            (() => {
              switch (record.status) {
                case 3:
                  return <div style={{color:'gray'}}>已报名</div>;
                  break;
                case 8:
                  return <div></div>;
                  break;
                case 1:
                  return <div></div>;
                  break;
                case 2:
                  return <a className = "ant-dropdown-link"
                  onClick = {
                    () => {
                      this.setState({
                        competition_add: record
                      })
                      this.handleModalVisible(true)
                    }
                  } >新增报名</a>;
                  break;
                default:
                  break;
              }
            })()
          }
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


  // 添加报名
  handleAdd = fields => {
    this.setState({ confirmLoading: true });
    let payload = {};
    payload.competitionId = this.state.competition_add.competitionId;
    payload.registrationDeadline = new Date(fields.infoEndTime._d).getTime();
    payload.registrationStartTime = new Date(fields.infoStartTime._d).getTime();
    payload.registrationRequire = fields.infoRequire;
    
    // 组合注册必选项
    let item_send = "";
    let item = fields.infoItem;
    for (let i = 1; i < 7; i ++) {
       // 选中了就为0
      if (item.includes(i.toString())) {
        item_send = "1" + item_send;
      } else {
        item_send = "0" + item_send;
      }
    }
    //console.log(item_send);
    // 转为二进制 
    payload.registrationItem = item_send;
    
    console.log(payload);

    const { dispatch } = this.props;
    dispatch({
      type: "competition/add_registration",
      payload: payload,
      callback: res => {
        this.setState({ confirmLoading: false });
        if (res.meta.success) {
          this.handleModalVisible();
          form_modal.resetFields();
          // this.getList({
          //   page: this.state.currentPage,
          //   size: this.state.pageSize,
          //   ...this.state.formValues
          // });
          message.success("添加成功");
          this.getList({
            page: this.state.currentPage,
            size: this.state.pageSize
          })
        }
      }
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
      param: params.param
    };

    const { dispatch } = this.props;
    dispatch({
      type: "competition/list",
      payload: payload,
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
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

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
      competition: { data },
      loading
    } = this.props;
    const { selectedRows } = this.state;


    if (!data) {
      return;
    }

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
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
                <Button
                  type="primary"
                  onClick={() =>
                    router.push(rc + "/club/competitionManageRelease")
                  }
                >
                  新增赛事
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
                total={data.pagination.total}
              />
            </div>
            <CreateForm {...parentMethods} {...parentStates} />
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
