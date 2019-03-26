
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

import { checkData, getnyr } from "@/utils/utils";
import { rc, requestUrl_luo, fileUrl } from "@/global";
import { Label } from "bizcharts";
import ExportJsonExcel from "js-export-excel";

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
      title: "头像",
      dataIndex: "headImg",
      render(val) {
        return <Avatar src={val} />;
      }
    },
    {
      title: "用户名",
      dataIndex: "name"
    },
    {
      title: "性别",
      dataIndex: "sex",
      render(val) {
        return <div>{val == 1 ? "男" : "女"}</div>;
      }
    },
    {
      title: "出生年月",
      dataIndex: "birthday",
      render(val) {
        return getnyr(val);
      }
    },
    {
      title: "联系方式",
      dataIndex: "contactInfo"
    },
    {
      title: "加入时间",
      dataIndex: "createTime",
      render(val) {
        return getnyr(val);
      }
    },
    {
      title: "状态",
      dataIndex: "status",
      render(val) {
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
    // },
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
        content: `确定同意“${record.name}”加入社团吗`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.setState({
            modalVisible: true,
          });
          const {dispatch} = this.props;
          dispatch({
            type:'community/pass_user',
            payload: {
              societyId: record.societyId,
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
        content: `确定不同意“${record.name}”加入社团吗`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          const {dispatch} = this.props;
          this.setState({
            modalVisible: true,
          });
          dispatch({
            type:'community/pass_user',
            payload: {
              societyId: record.societyId,
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


  // menu = record =>{
  //   return (
  //     <Menu onClick={e => this.review(e, record)}>
  //       <Menu.Item key="1">同意</Menu.Item>
  //       <Menu.Item key="0">不同意</Menu.Item>
  //     </Menu>
  //   )
  // }

  //审核 /match/event/pass_user
  // review = (e,record)=>{
  //   const {dispatch} = this.props;
  //   dispatch({
  //     type:'community/pass_user',
  //     payload: {
  //       societyId: record.societyId,
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

 

  // 多选
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows
    });
  };

  //导出报名表
  // downloadExcel = () => {
  //   const data = this.state.excelData ? this.state.excelData : ""; //表格数据
  //   var option = {};
  //   let dataTable = [];
  //   if (data) {
  //     for (let i in data) {
  //       if (data) {
  //         if (data[i].sex) {
  //           data[i].sex = "女";
  //         } else {
  //           data[i].sex = "男";
  //         }
  //         let obj = {
  //           序列: i + 1,
  //           用户名: data[i].name,
  //           性别: data[i].sex,
  //           出生年月: data[i].birthday,
  //           联系方式: data[i].contactInfo,
  //           所属社团: data[i].matchEventName,
  //           加入时间: data[i].updateTime
  //         };
  //         dataTable.push(obj);
  //       }
  //     }
  //   }
  //   option.fileName = "赛事报名表";
  //   option.datas = [
  //     {
  //       sheetData: dataTable,
  //       sheetName: "sheet",
  //       sheetFilter: [
  //         "序列",
  //         "用户名",
  //         "性别",
  //         "出生年月",
  //         "联系方式",
  //         "所属社团",
  //         "加入时间"
  //       ],
  //       sheetHeader: [
  //         "序列",
  //         "用户名",
  //         "性别",
  //         "出生年月",
  //         "联系方式",
  //         "所属社团",
  //         "加入时间"
  //       ]
  //     }
  //   ];
  //   var toExcel = new ExportJsonExcel(option);
  //   toExcel.saveExcel();
  // };

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

      console.log("---");
      console.log(values);
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
    console.log("--- " + location.href);
    const matchId = location.href.split("?")[1].split("=")[1];
    console.log("--- matchId " + matchId);
    let payload = {
      page: params.page - 1,
      size: params.size,
      matchId: matchId,
      infoName: params.infoName,
      infoContactInfo: params.infoContactInfo
    };
    const { dispatch } = this.props;

    dispatch({
      type: "community/user_list_get",
      payload: payload,
      callback: res => {
        if (res.meta.success) {
          console.log(res);
          this.setState({
            currentDataNum: res.data.data.length,
            selectedRows: [],
            excelData: res.data.data
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
      Modal.warning({
        title: "提示",
        content: "暂不支持批量删除"
      });
      return;
      if (this.state.selectedRows.length == 0) {
        Modal.warning({
          title: "提示",
          content: "您还没有选择任何用户"
        });
        return;
      }
      for (let i = 0; i < this.state.selectedRows.length; i++) {
        ids.push(this.state.selectedRows[i].id);
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
            if (res.code == 200) {
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
            <FormItem label="用户名">
              {getFieldDecorator("infoName")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={6} sm={18}>
            <FormItem label="联系方式">
              {getFieldDecorator("infoContactInfo")(
                <Input placeholder="请输入" />
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
      community: { data },
      loading
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = {
      // 传递方法
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
