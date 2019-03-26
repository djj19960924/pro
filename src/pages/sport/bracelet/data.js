import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  InputNumber,
  Card,
  Avatar,
  Form,
  Input,
  Select,
  Button,
  Modal,
  Upload,
  message,
  Alert,
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
import Area from '@/components/Charts/Area';
import Link from 'umi/link';

import styles from '@/less/TableList.less';
import myStyles from '@/less/guide.less';

import zhuanjiahead from '@/assets/zhuanjiahead.png'

import { checkData, getnyr } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

message.config({ top: 100 });

// 对话框
const CreateForm = Form.create()(props => {
  const {
    form,
    modalVisible,
    handleModalVisible,
    stepInfoList
  } = props;
  const footer = <div onClick={() => handleModalVisible()} style={{textAlign:'center'}}><Button type='primary'>关闭</Button></div>
  let data = []
  stepInfoList && stepInfoList.forEach(element => {
    data.push({
      key:getnyr(element.stepNumberDate * 1000),
      value:Number(element.stepNumber),
    })
  });
  return (
    <Modal
      destroyOnClose
      title="运动趋势"
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={footer}
      width={800}
    >
      <div style={{padding:20,margin:20}}>
        <Area
          line
          color="#cceafe"
          height={250}
          data={data}
          alias='步数'
        />
      </div>
    </Modal>
  );
});

@connect(({ guide_sport, loading }) => ({
  guide_sport,
  loading: loading.models.guide_sport,
}))
@Form.create()
class guide extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据
  };

  columns = [
    {
      title: '序列',
      render:(val,record,index) => {
        return <div>{index+1}</div>
      }
    },
    {
      title: '头像',
      dataIndex: 'headImg',
      render: (val) => {
        return val ? (
          <Avatar src={val}/>
        ) : (
          <Avatar
            style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
            icon="user"
          />
        );
      }
    },
    {
      title: '用户名',
      dataIndex: 'nickName',
      render:(val) => {
        return <div>{val?val:'--'}</div>
      }
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
      render:(val) => {
        return <div>{val?val.substring(0,10):'--'}</div>
      }
    },
    {
      title: '人群类别',
      dataIndex: 'personClass',
      render:(val) => {
        return <div>{val==1?'青少年':val==2?'青年人':val==3?'中年人':val==4?'老年人':'--'}</div>
      }
    },
    {
      title: '手环编号',
      align:'center',
      render:(val,record) => {
        return <div>无</div>
      }
    },
    {
      title: '今日步数',
      align:'center',
      render:(val,record) => {
        return <div>无</div>
      }
    },
    {
      title: '里程',
      align:'center',
      render:(val,record) => {
        return <div>无</div>
      }
    },
    {
      title: '消耗',
      align:'center',
      render:(val,record) => {
        return <div>无</div>
      }
    },
    {
      title: '平均心率',
      align:'center',
      render:(val,record) => {
        return <div>无</div>
      }
    },
    {
      title: '最高心率',
      align:'center',
      render:(val,record) => {
        return <div>无</div>
      }
    },
    {
      title: '睡眠时间',
      align:'center',
      render:(val,record) => {
        return <div>无</div>
      }
    },
    {
      title: '睡眠质量',
      align:'center',
      render:(val,record) => {
        return <div>无</div>
      }
    },
  ];

  componentDidMount() {
    let params = {
      pn: this.state.currentPage,
      ps: this.state.pageSize,
    };
    this.getList(params);
  }

  // 对话框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  // 多选
  handleSelectRows = rows => {
    this.state.selectedRows[this.state.currentPage - 1] = rows;
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
      type: 'guide_sport/dataList',
      payload: params,
      callback: res => {
        if (res.code == 200) {
          this.setState({
            currentDataNum: res.data.list.length,
          });
        }
      },
    });
  };

  // 查看运动趋势
  stepCharts = (record) => {
    this.setState({
      stepInfoList:record.sportStepNumDtoList,
      modalVisible:true,
    })
  }

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator,setFieldsValue },
    } = this.props;
    const onchange = (key,val) => {
      let obj = {}
      obj[key] = val
      setFieldsValue(obj)
      this.setState(obj)
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('usname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="人群类别">
              {getFieldDecorator('groupName')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">青年</Option>
                  <Option value="2">中老年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          {/* <Col md={6} sm={24}>
            <FormItem label="运动时间">
              {getFieldDecorator('sport_time')(<DatePicker/>)}
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
      </Form>
    );
  }

  render() {
    const {
      guide_sport: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = { 
      // 传递方法
      handleModalVisible: this.handleModalVisible,
    };
    const parentStates = {
      // 传递状态
      modalVisible: this.state.modalVisible,
      stepInfoList:this.state.stepInfoList
    };

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Alert
                  message="注明："
                  description="手环数据对接功能页面，下载数据对接协议进行查看！"
                  type="warning"
                  showIcon
                  closable
                />
              </div>
              <div className={styles.tableListOperator}>
                <Button type="primary">
                  <a href='http://jiangda.paobapaoba.cn/iOS.zip' download>下载IOS版本</a>
                </Button>
                <Button type="primary">
                  <a href='http://jiangda.paobapaoba.cn/Android.rar' download>下载Android版本</a>
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

export default guide;
