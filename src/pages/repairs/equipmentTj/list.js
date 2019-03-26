import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  TreeSelect,
  Avatar,
  Form,
  Input,
  Divider,
  Select,
  Cascader,
  Button,
  Modal,
  message,
  Spin,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { Map , Markers } from 'react-amap';
import UploadImg from '@/components/UploadImg';
import FourCards from '@/components/FourCards';
import Link from 'umi/link';

import styles from '@/less/TableList.less';

import { checkData } from '@/utils/utils';
import { rc,mapKey,fileUrl } from '@/global';
import a1 from './images/1.png'
import a2 from './images/2.png'
import a3 from './images/3.png'
import a4 from './images/4.png'

const FormItem = Form.Item;

const defaultImg = 'http://webmap0.bdimg.com/client/services/thumbnails?width=132&height=104&align=center,center&quality=100&src=http%3A%2F%2Fhiphotos.baidu.com%2Fspace%2Fpic%2Fitem%2F4afbfbedab64034ff0749211a7c379310a551d6f.jpg'

@connect(({ villageListTj, loading }) => ({
  villageListTj,
  loading: loading.models.villageListTj,
}))
@Form.create()
class repairs extends PureComponent {
  state = {
    formValues: {}, // 筛选表单中的值

    organizeId:63,

    tjData:[
      {
        icon:a1,
        key:'健身站点数量',
        value:0
      },
      {
        icon:a2,
        key:'体育设施数量',
        value:0
      },
      {
        icon:a3,
        key:'设施类型数量',
        value:0
      },
      {
        icon:a4,
        key:'设施品牌数量',
        value:0
      },
    ]
  };

  columns = [
    {
      title: '序列',
      render: (text, record, index) => <div>{index+1}</div>,
    },
    {
      title: '站点图片',
      dataIndex: 'img_urls',
      render: val => {
        return (
          <Avatar shape="square" size={40} src={val?(fileUrl + val):defaultImg}/>
        )
      }
    },
    {
      title: '站点名称',
      dataIndex: 'name',
    },
    {
      title: '设施数量',
      dataIndex: 'equipmentSum',
      render: val => {
        return (
          <div>{val}</div>
        )
      }
    },
    {
      title: '设施类型数量',
      dataIndex: 'equipmentTypeSum',
      render: val => {
        return (
          <div>{val}</div>
        )
      }
    },
    {
      title: '设施品牌数量',
      dataIndex: 'equipmentBrandTypeSum',
      render: val => {
        return (
          <div>{val}</div>
        )
      }
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Link to={rc + "/repairs/equipmentTj/detail?id=" + record.id}>详情</Link>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.getList();
  }

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
        },
        function() {
          this.getList(fieldsValue);
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
      },
      () => {
        this.getList();
      }
    );
  };

  // list
  getList = (fields) => {
    console.log(fields)
    const { dispatch } = this.props;
    dispatch({
      type: 'villageListTj/list',
      payload: {id:this.state.organizeId},
      callback:(res) => {
        this.setState({
          tjData:[
            {
              icon:a1,
              key:'健身站点数量',
              value:res.data.top_sumVillageCount
            },
            {
              icon:a2,
              key:'体育设施数量',
              value:res.data.top_sumEquipmentCount
            },
            {
              icon:a3,
              key:'设施类型数量',
              value:res.data.top_sumEquipmentTypeCount
            },
            {
              icon:a4,
              key:'设施品牌数量',
              value:res.data.top_sumEquipmentBrandCount
            },
          ]
        })
      }
    });
  };  

  // 筛选表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="所属区域">
              {getFieldDecorator('area')(
                <Cascader options={JSON.parse(localStorage.getItem('areaTree'))} placeholder="请选择" showSearch />
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
      villageListTj: { data },
      loading,
    } = this.props;

    if (checkData(data)) {
      return (
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <FourCards data={this.state.tjData}></FourCards>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <StandardTable
                selectedRows={[]}
                showRowSelect="none"
                loading={loading}
                data={{list:data}}
                columns={this.columns}
                onChange={this.handleStandardTableChange}
                total={data.length}
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

export default repairs;