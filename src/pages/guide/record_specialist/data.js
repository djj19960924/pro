// import React, { PureComponent, Fragment } from 'react';
// import { connect } from 'dva';
// import moment from 'moment';
// import {
//   Row,
//   Col,
//   Card,
//   Avatar,
//   Form,
//   Input,
//   Select,
//   Button,
//   Modal,
//   Upload,
//   message,
//   Divider,
//   DatePicker,
//   Spin,
//   Menu,
//   TreeSelect,
//   Dropdown,
//   Icon,
// } from 'antd';
// import StandardTable from '@/components/StandardTable';
// import UploadImg from '@/components/UploadImg';
// import SpacialDetail from '@/components/SpacialDetail';
// import WxUserDetail from '@/components/WxUserDetail';
// import Link from 'umi/link';

// import styles from '@/less/TableList.less';
// import mystyles from '@/less/guide.less';

// import zhuanjiahead from '@/assets/zhuanjiahead.png'

// import { checkData, getnyr, cutStr } from '@/utils/utils';
// import { rc,requestUrl_kxjs } from '@/global';

// const FormItem = Form.Item;
// const { Option } = Select;
// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');

// message.config({ top: 100 });

// // 对话框
// const CreateForm = Form.create()(props => {
//   const {
//     modalVisible,
//     form,
//     handleModalVisible,
//     recordList
//   } = props;
//   const footer = <div onClick={() => handleModalVisible()} style={{textAlign:'center'}}><Button type='primary'>关闭</Button></div>
//   return (
//     <Modal
//       destroyOnClose
//       title="指导记录"
//       visible={modalVisible}
//       onCancel={() => handleModalVisible()}
//       footer={footer}
//     >
//     <div style={{maxHeight:300,overflowY:'scroll'}}>
//     {
//       recordList && recordList.map((item) => (
//         <div>
//           {item.name && item.adviceTime && item.questions &&
//             <div>
//               <div className={mystyles.recordName}>
//                 <b>用户名：{item.name}</b>
//                 <span>{item.adviceTime}</span>
//               </div>
//               <div className={mystyles.question}>
//                 {item.questions}
//               </div>
//             </div>
//           }
//           {item.expertName && item.reponse_time && item.expert_reponse &&
//             <div>
//               <div className={mystyles.recordName}>
//                 <b>专家：{item.expertName}</b>
//                 <span>{item.reponse_time}</span>
//               </div>
//               <div className={mystyles.response}>
//                 {item.expert_reponse}
//               </div>
//             </div>
//           }
//         </div>
//       ))
//     }
//     </div>
//     </Modal>
//   );
// });
// // 专家详情
// const CreateSpecialDetail = Form.create()(props => {
//   const {
//     specialDetailModalVisible,
//     handleSpecialDetailModalVisible,
//     specialInfo,
//   } = props;
//   const footer = <div onClick={() => handleSpecialDetailModalVisible()} style={{textAlign:'center'}}><Button type='primary'>关闭</Button></div>
//   return (
//     <Modal
//       destroyOnClose
//       title="专家详情"
//       width={860}
//       visible={specialDetailModalVisible}
//       onCancel={() => handleSpecialDetailModalVisible()}
//       footer={footer}
//       centered={true}
//     >
//       <SpacialDetail specialInfo={specialInfo}></SpacialDetail>
//     </Modal>
//   );
// });
// // 用户详情
// const CreateWxUserDetail = Form.create()(props => {
//   const {
//     wxUserDetailModalVisible,
//     handleWxUserDetailModalVisible,
//     wxUserInfo,
//   } = props;
//   const footer = <div onClick={() => handleWxUserDetailModalVisible()} style={{textAlign:'center'}}><Button type='primary'>关闭</Button></div>
//   return (
//     <Modal
//       destroyOnClose
//       title="用户信息"
//       width={860}
//       visible={wxUserDetailModalVisible}
//       onCancel={() => handleWxUserDetailModalVisible()}
//       footer={footer}
//       centered={true}
//     >
//       <WxUserDetail wxUserInfo={wxUserInfo}></WxUserDetail>
//     </Modal>
//   );
// });

// @connect(({ guidance, loading }) => ({
//   guidance,
//   loading: loading.models.guidance,
// }))
// @Form.create()
// class guide extends PureComponent {
//   state = {
//     modalVisible: false,
//     confirmLoading: false,
//     selectedRows: [], // 当前选择
//     formValues: {}, // 筛选表单中的值

//     currentPage: 1,
//     pageSize: 10,

//     currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据
//   };

//   columns = [
//     {
//       title: '序列',
//       render:(val,record,index) => {
//         return <div>{index+1}</div>
//       }
//     },
//     {
//       title: '用户名',
//       dataIndex: 'name',
//       editable: true,
//       // render:(val,record) => {
//       //   return <div>{val?<a onClick={() => this.seeWxUser(record.id)}>{val}</a>:'--'}</div>
//       // }
//     },
//     {
//       title: '性别',
//       dataIndex: 'sex',
//       render:(val) => {
//         return <div>{val==1?'男':val==2?'女':'--'}</div>
//       }
//     },
//     {
//       title: '年龄',
//       dataIndex: 'age',
//       render:(val) => {
//         return <div>{val?val:'--'}</div>
//       }
//     },
//     {
//       title: '人群类别',
//       dataIndex: 'groupName',
//       render:(val) => {
//         return <div>{val?val:'--'}</div>
//       }
//     },
//     {
//       title: '身高',
//       dataIndex: 'score',
//       render:(val) => {
//         return <div>{val?val:'--'}</div>
//       }
//     },
//     {
//       title: '体重',
//       dataIndex: 'tz',
//       render:(val) => {
//         return <div>{val?val:'--'}</div>
//       }
//     },
//     {
//       title: '体测评分',
//       dataIndex: 'totalscore',
//       render:(val) => {
//         return <div>{val?val:'--'}</div>
//       }
//     },
//     {
//       title: '用户问题',
//       dataIndex: 'questions',
//       render:(val) => {
//         return cutStr(val)
//       }
//     },
//     {
//       title: '咨询时间',
//       dataIndex: 'adviceTime',
//       render:(val) => {
//         return <div>{val?getnyr(val):'--'}</div>
//       }
//     },
//     {
//       title: '指导专家',
//       dataIndex: 'expertname',
//       render:(val,record) => {
//         return <div>{val?<a onClick={() => this.seeSpecial(record.expertid)}>{val}</a>:'--'}</div>
//       }
//     },
//     {
//       title: '最近回复时间',
//       dataIndex: 'reponse_time',
//       render:(val) => {
//         return <div>{val?getnyr(val):'--'}</div>
//       }
//     },
//     {
//       title: '运动处方',
//       render:(val,record) => {
//         // return <Link to={`${rc}/guide/chufang?id=${record.id}`}>查看</Link>
//         return <a>查看</a>
//       }
//     },
//     {
//       title: '操作',
//       render: (text, record) => (
//         <Fragment>
//           {/* <a onClick={() => this.detail(record.id)}>详情</a> */}
//           <a>详情</a>
          
//         </Fragment>
//       ),
//     },
//   ];

//   componentDidMount() {
//     let params = {
//       pn: this.state.currentPage,
//       ps: this.state.pageSize,
//     };
//     this.getList(params);
//   }

//   // 对话框
//   handleModalVisible = flag => {
//     this.setState({
//       modalVisible: !!flag,
//       editId:null
//     });
//   };
//   handleSpecialDetailModalVisible = flag => {
//     this.setState({
//       specialDetailModalVisible: !!flag,
//     });
//   };
//   handleWxUserDetailModalVisible = flag => {
//     this.setState({
//       wxUserDetailModalVisible: !!flag,
//     });
//   };

//   // 多选
//   handleSelectRows = rows => {
//     this.state.selectedRows[this.state.currentPage - 1] = rows;
//   };

//   // 分页
//   handleStandardTableChange = (pagination, filtersArg, sorter) => {
//     const { formValues } = this.state;

//     const filters = Object.keys(filtersArg).reduce((obj, key) => {
//       const newObj = { ...obj };
//       newObj[key] = getValue(filtersArg[key]);
//       return newObj;
//     }, {});

//     this.setState({
//       currentPage: pagination.current,
//       pageSize: pagination.pageSize,
//     });
//     const params = {
//       pn: pagination.current,
//       ps: pagination.pageSize,
//       ...formValues,
//       ...filters,
//     };
//     if (sorter.field) {
//       params.sorter = `${sorter.field}_${sorter.order}`;
//     }

//     this.getList(params);
//   };

//   // 查询
//   handleSearch = e => {
//     e.preventDefault();

//     const { form } = this.props;

//     form.validateFields((err, fieldsValue) => {
//       if (err) return;

//       const values = {
//         ...fieldsValue,
//         updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
//       };

//       this.setState(
//         {
//           formValues: values,
//           currentPage: 1,
//         },
//         function() {
//           this.getList({ pn: this.state.currentPage, ps: this.state.pageSize, ...fieldsValue });
//         }
//       );
//     });
//   };

//   // 重置
//   handleFormReset = () => {
//     const { form } = this.props;
//     form.resetFields();
//     this.setState(
//       {
//         formValues: {},
//         currentPage: 1,
//       },
//       () => {
//         this.getList({ pn: this.state.currentPage, ps: this.state.pageSize });
//       }
//     );
//   };

//   // list
//   getList = params => {
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'guidance/specialist_list',
//       payload: params,
//       callback: res => {
//         if (res.code == 200) {
//           this.setState({
//             currentDataNum: res.data.list.length,
//             // selectedRows: [],
//           });
//         }
//       },
//     });
//   };

//   // 详情
//   detail = (id) => {// id为userid
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'guidance/specialist_detail',
//       payload: id,
//       callback: res => {
//         if (res.code == 200) {
//           if(res.data.list.length == 0){
//             Modal.warning({
//               title: '提示',
//               content: '该用户还没有指导记录',
//             });
//             return;
//           }
//           this.setState({
//             modalVisible:true,
//             recordList:res.data.list
//           });
//         }
//       },
//     });
//   }

//   // 查看专家
//   seeSpecial = (id) => {
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'guidance/getSpecialDetail',
//       payload: id,
//       callback: res => {
//         if (res.code == 200) {
//           this.setState({
//             specialInfo:res.data
//           })
//           this.handleSpecialDetailModalVisible(true)
//         }
//       },
//     });
//   }

//   // 查看用户
//   seeWxUser = id => {
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'guidance/getWxUserDetail',
//       payload: id,
//       callback: res => {
//         if (res.code == 200) {
//           this.setState({
//             wxUserInfo:res.data
//           })
//           this.handleWxUserDetailModalVisible(true)
//         }
//       },
//     });
//   }
  
//   // 筛选表单
//   renderSimpleForm() {
//     const {
//       form: { getFieldDecorator },
//     } = this.props;
//     return (
//       <Form onSubmit={this.handleSearch} layout="inline">
//         <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
//           <Col md={6} sm={24}>
//             <FormItem label="用户名">
//               {getFieldDecorator('a_usname')(<Input placeholder="请输入" />)}
//             </FormItem>
//           </Col>
//           <Col md={6} sm={24}>
//             <FormItem label="性别">
//               {getFieldDecorator('a_sex')(
//                 <Select placeholder="请选择" style={{ width: '100%' }}>
//                   <Option value="1">男</Option>
//                   <Option value="2">女</Option>
//                 </Select>
//               )}
//             </FormItem>
//           </Col>
//           <Col md={6} sm={24}>
//             <FormItem label="人群类别">
//               {getFieldDecorator('a_groupName')(
//                 <Select placeholder="请选择" style={{ width: '100%' }}>
//                   <Option value="1">青年</Option>
//                   <Option value="2">中老年</Option>
//                 </Select>
//               )}
//             </FormItem>
//           </Col>
//         </Row>
//         <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
//           <Col md={6} sm={24}>
//             <FormItem label="咨询时间">
//               {getFieldDecorator('a_adviceTime')(<DatePicker/>)}
//             </FormItem>
//           </Col>
//           <Col md={6} sm={24}>
//             <FormItem label="指导专家">
//               {getFieldDecorator('a_expert_name')(<Input placeholder="请输入" />)}
//             </FormItem>
//           </Col>
//           <Col md={6} sm={24}>
//             <span className={styles.submitButtons}>
//               <Button type="primary" htmlType="submit">
//                 查询
//               </Button>
//               <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
//                 重置
//               </Button>
//             </span>
//           </Col>
//         </Row>
//       </Form>
//     );
//   }

//   render() {
//     const {
//       guidance: { data },
//       loading,
//     } = this.props;
//     const { selectedRows } = this.state;

//     const parentMethods = { 
//       // 传递方法
//       handleModalVisible: this.handleModalVisible,
//       handleSpecialDetailModalVisible:this.handleSpecialDetailModalVisible,
//       handleWxUserDetailModalVisible:this.handleWxUserDetailModalVisible,
//     };
//     const parentStates = {
//       // 传递状态
//       modalVisible: this.state.modalVisible,
//       specialDetailModalVisible:this.state.specialDetailModalVisible,
//       specialInfo:this.state.specialInfo,
//       wxUserDetailModalVisible:this.state.wxUserDetailModalVisible,
//       wxUserInfo:this.state.wxUserInfo,
//       confirmLoading: this.state.confirmLoading,
//       recordList:this.state.recordList
//     };

//     if (checkData(data)) {
//       return (
//         <div>
//           <Card bordered={false}>
//             <div className={styles.tableList}>
//               <div className={styles.tableListOperator}>
//               </div>
//               <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
//               <StandardTable
//                 selectedRows={selectedRows}
//                 loading={loading}
//                 data={data}
//                 columns={this.columns}
//                 onSelectRow={this.handleSelectRows}
//                 onChange={this.handleStandardTableChange}
//                 total={data.itemCount}
//               />
//             </div>
//           </Card>
//           <CreateForm {...parentMethods} {...parentStates} />
//           <CreateSpecialDetail {...parentMethods} {...parentStates} />
//           <CreateWxUserDetail {...parentMethods} {...parentStates} />
//         </div>
//       );
//     } else {
//       return (
//         <Spin
//           style={{ position: 'absolute', top: 140, left: 0, right: 0 }}
//           size="large"
//           tip="Loading..."
//         />
//       );
//     }
//   }
// }

// export default guide;
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
  Upload,
  message,
  Divider,
  DatePicker,
  Spin,
  Menu,
  TreeSelect,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import UploadImg from '@/components/UploadImg';
import SpacialDetail from '@/components/SpacialDetail';
import Link from 'umi/link';

import styles from '@/less/TableList.less';

import zhuanjiahead from '@/assets/zhuanjiahead.png'

import { checkData, getnyr } from '@/utils/utils';
import { rc,fileUrl, requestUrl_kxjs, requestUrl_upload } from '@/global';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

message.config({ top: 100 });
const messageInfo = <div style={{ display: 'none' }} />;

@connect(({ specialist, loading }) => ({
  specialist,
  loading: loading.models.specialist,
}))
@Form.create()
class guide extends PureComponent {
  state = {
    roleTree: JSON.parse(localStorage.getItem('roleTree')),

    modalVisible: false,
    confirmLoading: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 0,
    pageSize: 10,

    editId: null,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据

    serviceType:[]
  };

  columns = [
    {
      title: '专家头像',
      render:(val,record) => {
        return record.headimg ? (
          <Avatar src={fileUrl + '/' + record.headimg}/>
        ) : (
          <Avatar
            style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
            icon="user"
          />
        );
      }
    },
    {
      title: '专家姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render:(val) => {
        return <div>{val==1?'男':val==2?'女':'--'}</div>
      }
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '服务类别',
      dataIndex: 'servicetypename',
    },
    {
      title: '所在机构',
      dataIndex: 'department',
      render:(val) => {
        return <div>{val?val:'--'}</div>
      }
    },
    {
      title: '职务',
      dataIndex: 'postionname',
      render:(val) => {
        return <div>{val?val:'--'}</div>
      }
    },
    {
      title: '技术职称',
      dataIndex: 'society_titles',
      render:(val) => {
        return <div>{val?val:'--'}</div>
      }
    },
    {
      title: '专家认证时间',
      dataIndex: 'createtime',
      render:(val) => (
        <div>{val?val.substring(0,10):'--'}</div>
      )
    },
    {
      title: '指导记录',
      render: (text, record) => (
        <Fragment>
          <Link to={`${rc}/guide/record_specialist/detail?id=${record.user_id}`}>查看</Link>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    let params = {
      pn: this.state.currentPage,
      ps: this.state.pageSize,
    };
    this.getList(params);
    this.getServiceType();
    this.getPositionType();
  }

  // 多选
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
      pageSize: pagination.pageSize,
    });
    const params = {
      pn: pagination.current,
      ps: pagination.pageSize,
      ...formValues,
      ...filters,
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
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState(
        {
          formValues: values,
          currentPage: 1,
        },
        function() {
          this.getList({ pn: this.state.currentPage, ps: this.state.pageSize, ...fieldsValue });
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
        currentPage: 1,
      },
      () => {
        this.getList({ pn: this.state.currentPage, ps: this.state.pageSize });
      }
    );
  };

  // list
  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'specialist/list',
      payload: params,
      callback: res => {
        if (res.code == 200) {
          this.setState({
            currentDataNum: res.data.list.length,
            selectedRows: [],
          });
        }
      },
    });
  };

  // 获取服务类别
  getServiceType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'specialist/allType',
      payload: {},
      callback: res => {
        if (res.code == 200) {
          this.setState({
            serviceType: res.data.list,
          });
        }
      },
    });
  }
  // 获取职务头衔
  getPositionType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'specialist/allPostion',
      payload: {},
      callback: res => {
        if (res.code == 200) {
          this.setState({
            positionType: res.data.list,
          });
        }
      },
    });
  }

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="专家姓名">
              {getFieldDecorator('a_name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="服务类别">
              {getFieldDecorator('a_sevicetypeid')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {
                    this.state.serviceType.map(ele => (
                      <Option key={ele.id}>{ele.name}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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

  render() {
    const {
      specialist: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
              </div>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                total={data.itemCount}
              />
            </div>
          </Card>
        </div>
      );
    } else {
      return (
        <Spin
          style={{ position: 'absolute', top: 140, left: 0, right: 0 }}
          size="large"
          tip="Loading..."
        />
      );
    }
  }
}

export default guide;
