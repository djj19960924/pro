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
  Cascader,
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
import mystyles from './specialist.less';

import zhuanjiahead from '@/assets/zhuanjiahead.png'

import { checkData, getnyr, getFullArea } from '@/utils/utils';
import { rc,fileUrl, requestUrl_kxjs, requestUrl_upload } from '@/global';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

message.config({ top: 100 });
const messageInfo = <div style={{ display: 'none' }} />;

// 对话框
let form_modal = null;
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    confirmLoading,
    roleTree,
    editId,
    beforeUpload,
    handleChange,
    headimg,
    handleChangeQualifications,
    qualifications,
    qualifications_name,
    serviceType,
    positionType
  } = props;
  form_modal = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新增/修改专家"
      width={720}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
      centered={true}
    >
      <div className={mystyles.modalContainer}>
        <div className={mystyles.title}>用户信息</div>
        <div className={mystyles.itemContainer}>
          <Row>
            <Col span={12}>
              <div className={mystyles.headContainer}>
                <div className={mystyles.headImg}>
                  {
                    headimg?
                    <img className={mystyles.headimg} src={ fileUrl + '/' + headimg}/>:
                    <img src={zhuanjiahead}/>
                  }
                </div>
                <div className={mystyles.headRight}>
                  <h4>请上传蓝底证件照</h4>
                  <div>大小：</div>
                  <div>1M 以内</div>
                  <div>
                    <Upload
                      showUploadList={false}
                      action={`${requestUrl_upload}/upload/start`}
                      data={file => {
                        return { file: file };
                      }}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      headers = {{
                        authorization: localStorage.getItem("token"),
                        id: localStorage.getItem("identityId")
                      }}
                    >
                      <Button style={{width:100}} type='primary' size='small'>上传照片</Button>
                    </Upload>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="姓名">
                {form.getFieldDecorator('name', {
                  rules: [{ required: true, message:messageInfo, whitespace: true, max: 20 }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="性别">
                {form.getFieldDecorator('sex', {
                  rules: [{ required: true, message: messageInfo}],
                })(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="1">男</Option>
                    <Option value="2">女</Option>
                  </Select>
                  )}
              </FormItem>
              <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="联系方式">
                {form.getFieldDecorator('phone', {
                  rules: [{ required: true, message: messageInfo, whitespace: true, max: 20 }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="出生年月">
                {form.getFieldDecorator('birthday', {
                  rules: [{ required: true, message: messageInfo}],
                })(<DatePicker style={{width:'100%'}} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="籍贯">
                {form.getFieldDecorator('origo', {
                  rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="电子邮箱">
                {form.getFieldDecorator('email', {
                  rules: [{ required: true, message: '请输入(小于50个字符)', whitespace: true, max: 50 }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="所在地区">
                {form.getFieldDecorator('deptid', {
                  rules: [{ required: true, message: '请输入(小于20个字符)'}],
                })(
                  <Cascader options={JSON.parse(localStorage.getItem('areaTree'))} placeholder="请选择" showSearch />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="服务类别">
                {form.getFieldDecorator('sevicetypeid', {
                  rules: [{ required: true, message: '请输入(小于20个字符)'}],
                })(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                  {
                    serviceType && serviceType.map(ele => (
                      <Option key={ele.id}>{ele.name}</Option>
                    ))
                  }
                  </Select>
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem style={{marginBottom:8}} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="工作单位">
                {form.getFieldDecorator('workunit', {
                  rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
        </div>

      
        <div className={mystyles.title}>专业背景</div>
        <div className={mystyles.itemContainer}>
          <Row>
              <Col span={12}>
                <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="从事专业">
                  {form.getFieldDecorator('specialty', {
                    rules: [{ required: false, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="最高学历">
                  {form.getFieldDecorator('education', {
                    rules: [{ required: false, message: '请输入(小于20个字符)'}],
                  })(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      <Option value="2">中专</Option>
                      <Option value="3">高中</Option>
                      <Option value="4">大专</Option>
                      <Option value="5">本科</Option>
                      <Option value="6">研究生</Option>
                      <Option value="7">博士</Option>
                      <Option value="8">其他</Option>
                    </Select>
                    )}
                </FormItem>
              </Col>
            </Row>
          <Row>
              <Col span={12}>
                <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="毕业院校">
                  {form.getFieldDecorator('universities', {
                    rules: [{ required: false, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="是否留学">
                  {form.getFieldDecorator('abroadstudy', {
                    rules: [{ required: false, message: '请输入(小于20个字符)'}],
                  })(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      <Option value="1">是</Option>
                      <Option value="0">否</Option>
                    </Select>
                    )}
                </FormItem>
              </Col>
            </Row>
        </div>
      
        <div className={mystyles.title}>职业信息</div>
        <div className={mystyles.itemContainer}>
          <Row>
              <Col span={12}>
                <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="所在院/部门">
                  {form.getFieldDecorator('department', {
                    rules: [{ required: false, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="职务/头衔">
                  {form.getFieldDecorator('positionid', {
                    rules: [{ required: false, message: '请输入(小于20个字符)'}],
                  })(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                    {
                      positionType && positionType.map(ele => (
                        <Option key={ele.id}>{ele.name}</Option>
                      ))
                    }
                    </Select>
                    )}
                </FormItem>
              </Col>
            </Row>
          <Row>
              <Col span={12}>
                <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="技术职称">
                  {form.getFieldDecorator('professional_titles', {
                    rules: [{ required: false, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem style={{marginBottom:8}} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="社会学术任职">
                  {form.getFieldDecorator('society_titles', {
                    rules: [{ required: false, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
        </div>
      
        <div className={mystyles.title}>个人简介</div>
        <FormItem style={{marginBottom:8}} labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="">
          {form.getFieldDecorator('introduction', {
            rules: [{ required: false, message: '请输入(小于500个字符)', whitespace: true, max: 500 }],
          })(<textarea className={mystyles.textarea}></textarea>)}
        </FormItem>

        <div>
          <span>请上传本人相关证件、证书等，保证内容真实有效，清晰可见（1M 以内）</span>
          <Upload
            showUploadList={false}
            action={`${requestUrl_upload}/upload/start`}
            data={file => {
              return { file: file };
            }}
            beforeUpload={beforeUpload}
            onChange={handleChangeQualifications}
            headers = {{
              authorization: localStorage.getItem("token"),
              id: localStorage.getItem("identityId")
            }}
          >
            <Button type='primary' size='small'>上传</Button>
          </Upload>
          {
            qualifications&&<div><a>{qualifications_name}</a></div>
          }
          <div style={{height:50}}></div>
        </div>

      </div>
    </Modal>
  );
});

// 专家详情
const CreateSpecialDetail = Form.create()(props => {
  const {
    specialDetailModalVisible,
    handleSpecialDetailModalVisible,
    specialInfo,
  } = props;
  const footer = <div onClick={() => handleSpecialDetailModalVisible()} style={{textAlign:'center'}}><Button type='primary'>关闭</Button></div>
  return (
    <Modal
      destroyOnClose
      title="专家详情"
      width={860}
      visible={specialDetailModalVisible}
      onCancel={() => handleSpecialDetailModalVisible()}
      footer={footer}
      centered={true}
    >
      <SpacialDetail specialInfo={specialInfo}></SpacialDetail>
    </Modal>
  );
});

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
      title: '出生日期',
      dataIndex: 'birthday',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
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
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.seeSpecial(record.user_id)}>详情</a>
          <Divider type="vertical" />
          <Dropdown overlay={this.menu(record)} trigger={['click']}>
            <a className="ant-dropdown-link">
              编辑 <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      ),
    },
  ];

  menu = record => {
    return (
      <Menu onClick={e => this.edit(e, record)}>
        <Menu.Item key="1">修改</Menu.Item>
        <Menu.Item key="2">删除</Menu.Item>
      </Menu>
    );
  };

  componentDidMount() {
    let params = {
      pn: this.state.currentPage,
      ps: this.state.pageSize,
    };
    this.getList(params);
    this.getServiceType();
    this.getPositionType();
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      editId: null,
      headimg:null,
      qualifications:null,
      qualifications_name:null
    });

    form_modal.resetFields();
  };
  handleSpecialDetailModalVisible = flag => {
    this.setState({
      specialDetailModalVisible: !!flag,
    });
  };

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

  // add or update
  handleAdd = fields => {
    // 头像
    if(this.state.headimg){
      fields.headimg = this.state.headimg
    }else{
      message.error('请上传头像')
      return;
    }
    // 区域地址id
    fields.deptid = fields.deptid[1]

    // 证书
    this.state.qualifications && (fields.qualifications = this.state.qualifications)

    fields.birthday = getnyr(fields.birthday);
    this.setState({ confirmLoading: true });
    if(this.state.editId){
      fields.id = this.state.editId
      fields.user_id = this.state.editId_user_id
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'specialist/add',
      payload: fields,
      callback: res => {
        this.setState({ confirmLoading: false });
        if (res.code == 200) {
          this.handleModalVisible();
          form_modal.resetFields();
          this.getList({
            pn: this.state.currentPage,
            ps: this.state.pageSize,
            ...this.state.formValues,
          });
          if (fields.id) {
            message.success('修改成功');
          } else {
            message.success('添加成功');
          }
        }
      },
    });
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

  // delete
  delete = idList => {
    let ids = [];
    if (idList) {
      ids = idList;
    } else {
      if (this.state.selectedRows.length == 0) {
        Modal.warning({
          title: '提示',
          content: '您还没有选择任何用户',
        });
        return;
      }
      for (let i = 0; i < this.state.selectedRows.length; i++) {
        ids.push(this.state.selectedRows[i].id);
      }
    }
    Modal.confirm({
      content: '是否确定删除记录？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'specialist/del',
          payload: ids,
          callback: res => {
            if (res.code == 200) {
              let current = this.state.currentPage;
              if (this.state.currentDataNum == ids.length && this.state.currentPage > 1) {
                current = this.state.currentPage - 1;
                this.setState({
                  currentPage: current,
                });
              }
              this.getList({ pn: current, ps: this.state.pageSize, ...this.state.formValues });
            }
          },
        });
      },
    });
  };

  // 编辑
  edit = function(e, record) {
    if (e.key == 1) {
      const { dispatch } = this.props;
      dispatch({
        type: 'specialist/get',
        payload: record.user_id,
        callback: res => {
          if (res.code == 200) {
            this.setState({
              modalVisible: true,
              editId: res.data.id,
              editId_user_id:res.data.user_id,
              headimg:res.data.headimg,
              qualifications:res.data.qualifications,
              qualifications_name:res.data.qualifications
            });
            form_modal.setFieldsValue({
              birthday:moment(res.data.birthday),
              deptid:getFullArea(res.data.deptid),
              email:res.data.email,
              name:res.data.name,
              phone:res.data.phone,
              sex:res.data.sex,
              department:res.data.department,
              introduction:res.data.introduction,
              origo:res.data.origo,
              persontype:res.data.persontype,
              sevicetypeid:res.data.sevicetypeid + '',
              professional_titles:res.data.professional_titles,
              society_titles:res.data.society_titles,
              specialty:res.data.specialty,
              universities:res.data.universities,
              workunit:res.data.workunit
            });
            // if(res.data.positionid){
              form_modal.setFieldsValue({
                positionid:res.data.positionid+'',
              });
            // }
            if(res.data.education){
              form_modal.setFieldsValue({
                education:res.data.education+'',
              });
            }
            // if(res.data.abroadstudy){
              form_modal.setFieldsValue({
                abroadstudy:res.data.abroadstudy+'',
                // abroadstudy: '0',
              });
            // }
          }
        },
      });
    } else if (e.key == 2) {
      this.delete([record.id]);
    }
  };

  // 查看专家
  seeSpecial = (id) => {
    const { dispatch } = this.props;
      dispatch({
        type: 'specialist/get',
        payload: id,
        callback: res => {
          if (res.code == 200) {
            this.setState({
              specialInfo:res.data
            })
            this.handleSpecialDetailModalVisible(true)
          }
        },
      });
  }

  // 上传文件限制
  beforeUpload = file => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJPG) {
      message.error('只能上传 jpg 或者 png 格式的文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('图片大小不能超过 1 M');
    }
    return isJPG && isLt2M;
  };
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ headloading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({ 
        headloading: false ,
        headimg:info.file.response.data.finalFileName
      });
    }
  };
  handleChangeQualifications = info => {
    if (info.file.status === 'uploading') {
      this.setState({ qualificationsloading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({ 
        qualificationsloading: false ,
        qualifications:info.file.response.data.finalFileName,
        qualifications_name:info.file.name
      });
    }
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
          {/* <Col md={6} sm={24}>
            <FormItem label="联系方式">
              {getFieldDecorator('a_tel')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col> */}
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
          {/* <Col md={6} sm={24}>
            <FormItem label="所在机构">
              {getFieldDecorator('a_department')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col> */}
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* <Col md={6} sm={24}>
            <FormItem label="技术职称">
              {getFieldDecorator('a_sevicetype')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="专家认证时间">
              {getFieldDecorator('a_throughdate')(<DatePicker/>)}
            </FormItem>
          </Col> */}
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

    const parentMethods = { 
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleSpecialDetailModalVisible:this.handleSpecialDetailModalVisible,
      beforeUpload:this.beforeUpload,
      handleChange:this.handleChange,
      handleChangeQualifications:this.handleChangeQualifications
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      specialDetailModalVisible:this.state.specialDetailModalVisible,
      specialInfo:this.state.specialInfo,
      confirmLoading: this.state.confirmLoading,
      roleTree: this.state.roleTree,
      editId: this.state.editId,
      headimg:this.state.headimg,
      qualifications:this.state.qualifications,
      qualifications_name:this.state.qualifications_name,
      serviceType:this.state.serviceType,
      positionType:this.state.positionType
    };

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增
                </Button>
                <Button type="danger" onClick={() => this.delete()}>
                  删除
                </Button>
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
          <CreateForm {...parentMethods} {...parentStates} />
          <CreateSpecialDetail {...parentMethods} {...parentStates} />
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
