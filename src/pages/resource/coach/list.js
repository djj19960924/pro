import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  TreeSelect,
  Avatar,
  Select,
  Button,
  Modal,
  Radio,
  message,
  Divider,
  Spin,
  Menu,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import UploadImg from '@/components/UploadImg';
import UploadImgs from '@/components/UploadImgs'
import Link from 'umi/link';

import styles from '@/less/TableList.less';

import { checkData , cutStr } from '@/utils/utils';
import { rc,fileUrl } from '@/global';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

message.config({ top: 100 });

// 对话框
let form_modal = null;
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, confirmLoading,getImgUrl,infoImg,getImgList,imgList } = props;
  form_modal = form;
  const okHandle = () => {
    let list = []
    imgList.forEach(ele => {
      list.push(ele.name)
    })
    form.setFieldsValue({
      headImage:infoImg,
      videoUrls:list.join()
    })
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新增/修改教练"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={confirmLoading}
      width={800}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="教练头像">
        {form.getFieldDecorator('headImage', {
          rules: [{ required: true, message: '请上传头像',}],
        })(
          <UploadImg
            getImgUrl={getImgUrl} // 获取上传文件的地址
            imgUrl={infoImg} // 获取上传文件的地址
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="教练姓名">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入(小于20个字符)', whitespace: true, max: 20 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
        {form.getFieldDecorator('sex', {
          rules: [{ required: true, message: '请选择'}],
        })(
          <RadioGroup>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="年龄">
        {form.getFieldDecorator('age', {
          rules: [{ required: true, message: '请输入' }],
        })(<Input type='number' placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系方式">
        {form.getFieldDecorator('tel', {
          rules: [{ required: true, message: '请输入', whitespace: true, max: 11,min:11 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="教授专业">
        {form.getFieldDecorator('profession', {
          rules: [{ required: true, message: '请输入(小于8个字符)', whitespace: true, max: 8 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="教练简介">
        {form.getFieldDecorator('introduction', {
          rules: [{ required: false, message: '请输入(小于100个字符)', whitespace: true, max: 100 }],
        })(<TextArea rows={4} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="教学视频">
        {form.getFieldDecorator('videoUrls', {
          rules: [{ required: false}],
        })(
          <UploadImgs 
            getImgList={getImgList} 
            imgList={imgList}
            type='text'
            max={5}
            fileType='video'
          >
          </UploadImgs>
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ coach, loading }) => ({
  coach,
  loading: loading.models.coach,
}))
@Form.create()
class resource extends PureComponent {
  state = {
    modalVisible: false,
    confirmLoading: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    editId: null,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据
  };

  columns = [
    {
      title: "序列",
      render(val, record, index) {
        return <div>{index + 1}</div>;
      }
    },
    {
      title: '头像',
      dataIndex: 'headImage',
      render(val) {
        return (
          <Avatar shape="square" size={40} src={fileUrl+val}/>
        )
      }
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render(val) {
        return (
          <div>{val == 1 ? '男' : '女'}</div>
        )
      }
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '联系方式',
      dataIndex: 'tel',
    },
    {
      title: '教授专业',
      dataIndex: 'profession',
    },
    {
      title: '所属场馆',
      dataIndex: 'type_name1',
    },
    {
      title: '简介',
      dataIndex: 'introduction',
      width:'18%',
      render(val) {
        return (
          <div>{cutStr(val,20)}</div>
        )
      }
    },
    {
      title: '操作',
      width: '20%',
      render: (text, record) => (
        <Fragment>
          {/* <Link to={`${rc}/tice/equipment/device?pointId=${record.id}`}>详情</Link> */}
          <a onClick={() => this.edit({key:1},record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.edit({key:2},record.id)}>删除</a>
          {/* <Dropdown overlay={this.menu(record.id)} trigger={['click']}>
            <a className="ant-dropdown-link">
              编辑 <Icon type="down" />
            </a>
          </Dropdown> */}
        </Fragment>
      ),
    },
  ];

  menu = id => {
    return (
      <Menu onClick={e => this.edit(e, id)}>
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
    this.getGymList()
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      editId: null,
    });

    form_modal.resetFields();
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

  // add
  handleAdd = fields => {
    this.setState({
      confirmLoading:true
    })
    console.log(fields)
    return;
    fields.gymId = getPageQuery().gymId
    const { dispatch } = this.props;
    dispatch({
      type: 'coach/add',
      payload: fields,
      callback: res => {
        if(res.code == 200){
          this.handleModalVisible()
          this.setState({
            confirmLoading:true
          })
          this.getList({
            pn: this.state.currentPage,
            ps: this.state.pageSize,
          })
        }
      },
    });
  };

  // list
  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'coach/list',
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

  getGymList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'coach/gymList',
      payload: {pn:0,ps:10000},
      callback: res => {
        if (res.code == 200) {
          console.log(res)
        }
      },
    });
  }

  //delete
  delete = idList => {
    let ids = [];
    if (idList) {
      ids = idList;
    } else {
      if (this.state.selectedRows.length == 0) {
        Modal.warning({
          title: '提示',
          content: '您还没有选择任何记录',
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
          type: 'coach/del',
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
  edit = function(e, id) {
    if (e.key == 1) {
      this.setState({
        modalVisible: true,
        editId: id.id,
      });
      form_modal.setFieldsValue({
        name: id.type_name,
      });
    } else {
      this.delete([id]);
    }
  };

  // 图片
  getImgUrl = url => {
    this.setState({ infoImg: url });
  };
  // 视频
  getImgList = (e , type) => {
    let arr = this.state.imgList;
    if(type == 'done'){
      let xxx = e.data.finalFileName.split('/')
      arr.push({
        uid:xxx[xxx.length-1].substring(0,xxx[xxx.length-1].length - 4),
        url:e.data.finalFileName,
        name:xxx[xxx.length-1],
      })
    }
    if(type == 'removed'){
      arr.forEach((ele,index) => {
        if(ele.uid == e.file.uid){
          arr.splice(index,1)
        }
      })
    }
    this.setState({imgList:arr})
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
            <FormItem label="体育资源分类名称">
              {getFieldDecorator('a_type_name')(<Input placeholder="请输入" />)}
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
      coach: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = {
      // 传递方法
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      // 图片视频
      getImgUrl:this.getImgUrl,
      getImgList:this.getImgList
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      confirmLoading: this.state.confirmLoading,
      // 图片视频
      infoImg:this.state.infoImg,
      imgList:this.state.imgList,
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

export default resource;