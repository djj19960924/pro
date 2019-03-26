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
import ExportJsonExcel from "js-export-excel";

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

const { MonthPicker } = DatePicker;
const { TextArea } = Input;

message.config({ top: 100 });

const fileList = [
 
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

@connect(({ competitionRegistration, loading }) => ({
    competitionRegistration,
  loading: loading.models.competitionRegistration
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
      title: "姓名",
      dataIndex: "name"
    },
    {
      title: "性别",
      dataIndex: "sex",
      render(val) {
        return <div>{val == 1 ? "女" : "男"}</div>;
      }
    },
    {
      title: "年龄",
      dataIndex: "age",
      render(val) {
        return <div>{val + '岁'}</div>
      }
    },
    {
      title: "联系方式",
      dataIndex: "phone"
    },
    {
      title: "身份证号",
      dataIndex: "cardId"
    },
    {
      title: "工作单位",
      dataIndex: "workPosition"
    },
    {
      title: "状态",
      dataIndex: "status",
      render:(val)=>{
        return <Fragment>
          {
            (()=>{
              switch (val){
                case 1:
                  return <div>审核中</div>;
                  break;
                case 2:
                  return <div style={{color:'green'}}>通过审核</div>;
                  break;
                case 8:
                  return <div style={{color:'red'}}>未通过审核</div>
                  break;
                default:
                break;
              }
            })()
          }
        </Fragment>
      }
    },
    // {
    //   title: "操作",
    //   render: (text, record) => (
    //     <Fragment>
    //       <Dropdown overlay={this.menu(record)} trigger={['click']}>
    //         <a className="ant-dropdown-link">
    //           审核 <Icon type="down" />
    //         </a>
    //       </Dropdown>
    //     </Fragment>
    //   )
    // }
    {
      title: "操作",
      render: (text, record) => (
        <Fragment>
          {
            record.status==1 ? 
            <Dropdown overlay={this.menu(record)} trigger={['click']}>
            <a className="ant-dropdown-link">
              审核<Icon type="down"/>
            </a>
           </Dropdown>:<div>已审核</div>
          }    
        </Fragment>
      )
    }
  ];

  menu = record =>{
    return(
      <Menu onClick={e => this.getById(e, record)}>
        <Menu.Item key="1">同意</Menu.Item>
        <Menu.Item key="0">不同意</Menu.Item>
      </Menu>
    )
  };
  getById = (e,record) =>{
    if(e.key==1){
      Modal.confirm({
        title: '提示',
        content: `确定同意“${record.name}”加入吗`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.setState({
            modalVisible: true,
          });
          const {dispatch} = this.props;
          dispatch({
            type: "competitionRegistration/user_pass",
            payload: {
              registration_id: record.registrationId,
              passed: e.key
            },
            callback: res => {
              this.getList({
                page: this.state.currentPage,
                size: this.state.pageSize
              }) 
            }
          })
        },
      });
    }else{
      Modal.confirm({
        title: '提示',
        content: `确定不同意“${record.name}”加入吗`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          const {dispatch} = this.props;
          this.setState({
            modalVisible: true,
          });
          dispatch({
            type: "competitionRegistration/user_pass",
            payload: {
              registration_id: record.registrationId,
              passed: e.key
            },
            callback: res => {
              this.getList({
                page: this.state.currentPage,
                size: this.state.pageSize
              })
            }
          })
        },
      });
    }
    
  }

  //审核
  // review = (e,record)=>{
  //   const {dispatch} = this.props;
  //   console.log('record:',record)
  //   dispatch({
  //     type: "competitionRegistration/user_pass",
  //     payload: {
  //       registration_id: record.registrationId,
  //       passed: e.key
  //     },
  //     callback: res => {
  //       this.getList({
  //         page: this.state.currentPage,
  //         size: this.state.pageSize
  //       })
  //     }
  //   })
  // }

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
        if (data[i].status==2) {
          let obj = {
            用户Id: data[i].userId,
            序列: i + 1,
            姓名: data[i].name,
            性别: data[i].sex?'男':'女',
            年龄: data[i].age,
            出生年月: data[i].birthday,
            联系方式: data[i].phone,
            身份证号:data[i].cardId,
            工作单位: data[i].workPosition,
            
          };
          dataTable.push(obj);
        }
      }
    }
    option.fileName = "赛事报名表";
    option.datas = [
      {
        sheetData: dataTable,
        sheetName: "sheet",
        sheetFilter: [
          "用户Id",
          "序列",
          "姓名",
          "性别",
          "年龄",
          "联系方式",
          "身份证号",
          "工作单位",
          "赛事",
          "成绩",
          "名次"
        ],
        sheetHeader: [
          "用户Id",
          "序列",
          "姓名",
          "性别",
          "年龄",
          "联系方式",
          "身份证号",
          "工作单位",
          "赛事",
          "成绩",
          "名次"
        ]
      }
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      editId: null
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
            ...fieldsValue
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
    const competitionId = location.href.split("?")[1].split("=")[1];

    let payload = {
      page: params.page - 1,
      size: params.size,
      competition_id: competitionId,
      name: params.infoName,
    };
    
   const { dispatch } = this.props;
    dispatch({
      type: "competitionRegistration/list_user",
      payload: payload,
      callback: res => {
        if (res.meta.success) {
          console.log(res)
          this.setState({
            currentDataNum: res.data.data.length,
            selectedRows: [],
            excelData: res.data.data
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
        <Row gutter={{ md: 8, lg: 2, xl: 18 }}>
           
          <Col md={8} sm={18}>
            <FormItem label="姓名">
              {getFieldDecorator("infoName")(
                <Input placeholder="请输入姓名" />
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={18}>
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
      competitionRegistration: { data },
      loading
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = {
      // 传递方法
      handleModalVisible: this.handleModalVisible
     
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
    };

    if (checkData(data)) {
      
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={this.downloadExcel}>导出赛事报名表</Button>
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
