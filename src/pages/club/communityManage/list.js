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

import styles from "@/less/TableList.less";

import { checkData, getnyr, cutStr } from "@/utils/utils";
import { rc, requestUrl_luo, fileUrl } from "@/global";
import { Label } from "bizcharts";
import router from "umi/router";
import { change_admin } from "@/services/clubs";

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

const fileList = [
  // {
  //   uid: "-1",
  //   name: "xxx.png",
  //   status: "done",
  //   url:
  //     "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  //   thumbUrl:
  //     "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
  // }
];
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

// 对话框
let form_modal = null;
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    confirmLoading
    // base
  } = props;
  form_modal = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };

  const handleChange = () => {
    //console.log(`selected ${value}`);
  };

  return (
    <Modal
      destroyOnClose
      title="新增社团"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
      width="800px"
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="社团logo"
      >
        {form.getFieldDecorator("infoLogo", {
          rules: [{ required: true, message: "请输入社团logo" }]
        })(
          <Upload {...props_upload}>
            <Button type="primary">
              <Icon type="upload" />
              上传
            </Button>
          </Upload>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="社团名称"
      >
        {form.getFieldDecorator("infoName", {
          rules: [{ required: true, message: "请输入社团名称" }]
        })(<Input placeholder="请输入社团名称" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="社团分类"
      >
        <Col span={8}>
          <FormItem>
            {form.getFieldDecorator("typeId", {
              rules: [{ required: true, message: "请选择..." }]
            })(
              <Select placeholder="社团类型" style={{ width: "90%" }}>
                {types}
              </Select>
            )}
          </FormItem>
        </Col>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="社团简介"
      >
        {form.getFieldDecorator("infoDescription", {
          rules: [
            { required: true, message: "请输入社团简介" },
            { max: 500, message: "简介最大为500个字符！" }
          ]
        })(<TextArea rows={4} placeholder="请输入社团简介" />)}
      </FormItem>

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="请选择管理员"
      >
        {form.getFieldDecorator("infoAdmin", {
          rules: [{ required: true, message: "管理员必须!" }]
        })(
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="请指定管理员"
            optionFilterProp="children"
            notFoundContent="无法找到"
            onChange={() => handleChange}
          >
            {admin_list}
          </Select>
        )}
      </FormItem>

      {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="负责人">
        {form.getFieldDecorator("infoPrincipal", {
          rules: [
            { required: true, message: "请输入负责人姓名" },
            { max: 8, message: "姓名最大为8个字符！" }
          ]
        })(<Input placeholder="请输入负责人姓名" />)}
      </FormItem> */}

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="联系方式"
      >
        {form.getFieldDecorator("infoContactInfo", {
          rules: [
            { required: false, message: "请输入负责人联系方式" },
            {
              pattern: "(\\(\\d{3,4}\\)|\\d{3,4}-|\\s)?\\d{7,14}",
              message: "请输入正确的电话号码"
            }
          ]
        })(<Input placeholder="请输入负责人联系方式" />)}
      </FormItem>
    </Modal>
  );
});

let admin_form_modal = null;
const AdminCreateForm = Form.create()(props => {
  const {
    adminModalVisible,
    form,
    handleAdminChange,
    handleAdminModalVisible,
    confirmLoading
    // base
  } = props;
  admin_form_modal = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdminChange(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="修改管理员"
      visible={adminModalVisible}
      onOk={okHandle}
      onCancel={() => handleAdminModalVisible()}
      confirmLoading={confirmLoading}
      width="800px"
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="请选择管理员"
      >
        {form.getFieldDecorator("infoAdmin", {
          rules: [{ required: true, message: "管理员必须!" }]
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

      {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator("adminPrincipal", {
          rules: [
            { required: true, message: "请输入负责人姓名" },
            { max: 8, message: "姓名最大为8个字符！" }
          ]
        })(<Input placeholder="请输入负责人姓名" />)}
      </FormItem> */}
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="联系方式"
      >
        {form.getFieldDecorator("adminContactInfo", {
          rules: [
            { required: true, message: "请输入负责人联系方式" },
            {
              pattern: "(\\(\\d{3,4}\\)|\\d{3,4}-|\\s)?\\d{7,14}",
              message: "请输入正确的电话号码"
            }
          ]
        })(<Input placeholder="请输入负责人联系方式" />)}
      </FormItem>
    </Modal>
  );
});

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
      title: "社团logo",
      dataIndex: "eventImg",
      render(val) {
        return <Avatar src={fileUrl + "/" + val} />;
      }
    },
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
      title: "社团简介",
      dataIndex: "matchDescription",
      render(val) {
        return <div>{cutStr(val, 10)}</div>;
      }
    },
    {
      title: "管理员",
      dataIndex: "adminName"
    },
    {
      title: "联系方式",
      dataIndex: "contactInfo"
    },
    {
      title: "报名人数",
      dataIndex: "memberCount"
    },
    {
      title: "申请人员",
      render: (text, record) => (
        <Fragment>
          <a
            // onClick={e => this.edit({ key: 1 }, record.id)}
            onClick={() =>
              router.push(
                rc +
                  "/club/communityDetail/list?matchEventId=" +
                  record.matchEventId
              )
            }
            className="ant-dropdown-link"
          >
            查看
          </a>
        </Fragment>
      )
    },
    // {
    //   title: "操作",
    //   render: (text, record) => (
    //     <Fragment>
    //       <a
    //         onClick={() => this.handleAdminModalVisible(true, record)}
    //         className="ant-dropdown-link"
    //       >
    //         修改管理员
    //       </a>
    //     </Fragment>
    //   )
    // }
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
      editId: null
    });

    form_modal.resetFields();
    this.getAdminList({
      page: 1,
      size: 10
    });
  };

  // 添加管理员对话框
  handleAdminModalVisible = (flag, record) => {
    //console.log("--- admin model ");
    //console.log(!!flag);
    if (undefined != flag || flag) {
      this.setState({
        adminModalVisible: !!flag,
        editId: record.matchEventId
      });
    } else {
      this.setState({
        adminModalVisible: !!flag
      });
    }
    admin_form_modal.resetFields();

    //console.log(record);

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

      //console.log('--- form values');
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

  // add
  handleAdd = fields => {
    this.setState({ confirmLoading: true });
    //console.log(fields);
    // fields.organizeId = this.state.organizeId;
    let payload = {};
    // payload.principal = fields.infoPrincipal;
    payload.contactInfo = fields.infoContactInfo;
    payload.matchDescription = fields.infoDescription;
    payload.eventImg = backInfo.file.response.data.file;
    payload.matchType = fields.typeId;
    payload.eventName = fields.infoName;
    payload.adminId = fields.infoAdmin;

    console.log(payload);

    this.state.editId && (fields.adminId = this.state.editId);
    const { dispatch } = this.props;
    dispatch({
      type: "community/add",
      payload: payload,
      callback: res => {
        this.setState({ confirmLoading: false });
        if (res.meta.success) {
          this.handleModalVisible();
          form_modal.resetFields();
          this.getList({
            page: this.state.currentPage,
            size: this.state.pageSize,
            ...this.state.formValues
          });
          message.success("添加成功");
        }
      }
    });
    this.setState({
      editId: null
    });
  };

  // 修改管理员
  handleAdminChange = fields => {
    this.setState({ confirmLoading: true });
    //console.log(fields);

    let payload = {};
    payload.contactInfo = fields.adminContactInfo;
    payload.adminId = fields.infoAdmin;
    payload.matchId = this.state.editId;

    //console.log(payload);

    this.state.editId && undefined != this.state.editId;
    const { dispatch } = this.props;
    dispatch({
      type: "community/change_admin_post",
      payload: payload,
      callback: res => {
        //console.log('sdfghjk');
        this.setState({ confirmLoading: false });
        //console.log(res.code);
        if (res.meta.success) {
          //console.log('--- ');
          this.handleAdminModalVisible();
          admin_form_modal.resetFields();
          this.getList({
            page: this.state.currentPage,
            size: this.state.pageSize,
            ...this.state.formValues
          });
          message.success("修改成功");
        }
      }
    });
    this.setState({
      editId: null
    });
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

  // 编辑
  edit = function(e, id) {
    if (e.key == 1) {
      const { dispatch } = this.props;
      dispatch({
        type: "community/get",
        payload: id,
        callback: res => {
          if (res.code == 200) {
            this.setState({
              modalVisible: true,
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
          {/* <Col md={6} sm={18}>
            <FormItem label="联系方式">
              {getFieldDecorator("contactInfo")(
                <Input placeholder="请输入社团名称" />
              )}
            </FormItem>
          </Col> */}

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
      community: { data },
      loading
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleAdminChange: this.handleAdminChange,
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
              <div className={styles.tableListOperator}>
                <Button
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  新增社团
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
          </Card>
          <CreateForm {...parentMethods} {...parentStates} />
          <AdminCreateForm {...parentMethods} {...parentStates} />
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
