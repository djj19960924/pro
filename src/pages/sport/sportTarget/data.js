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
import Link from 'umi/link';

import styles from '@/less/TableList.less';
import myStyles from '@/less/guide.less';

import zhuanjiahead from '@/assets/zhuanjiahead.png'

import { checkData, getnyr } from '@/utils/utils';
import { rc,requestUrl_kxjs } from '@/global';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

message.config({ top: 100 });

// 对话框
const CreateForm_food = Form.create()(props => {
  const {
    form,
    modalVisible_food,
    handleModalVisible_food,
    foodRecordList,
    date,
    preDay,
    nextDay,
    loading,
  } = props;
  const footer = <div onClick={() => handleModalVisible_food()} style={{textAlign:'center'}}><Button type='primary'>关闭</Button></div>
  return (
    <Modal
      destroyOnClose
      title="饮食记录"
      visible={modalVisible_food}
      onCancel={() => handleModalVisible_food()}
      footer={footer}
    >
      <div style={{position:'relative'}}>
        { foodRecordList && foodRecordList.length > 0 &&
          <div>
            <div className={myStyles.changeDate}>
              <span onClick={() => preDay('food')}><Icon type="caret-left" /></span>
              {date}
              <span onClick={() => nextDay('food')}><Icon type="caret-right" /></span>
            </div>
            <div className={myStyles.foodContainer}>
              {/* <div>(建议摄入量503-603千卡)</div> */}
              {
                foodRecordList.map((item,index) => (
                  <div className={myStyles.foodItem} key={index}>
                    <div className={myStyles.foodImg}>
                      <img style={{width:'100%',height:'100%'}} src={item.eatTypeDto.foodIcon}/>
                    </div>
                    <div className={myStyles.foodRight}>
                      <div className={myStyles.foodName}>{item.eatTypeDto.foodName}</div>
                      <div className={myStyles.foodInfo}>
                      {`${item.eatRecordDto.eatFoodGram} 克 ---------------------------------------------------------- ${item.eatRecordDto.eatFoodCal} 千卡`}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        }
        {
          (!foodRecordList || foodRecordList.length == 0) &&
          <div>
            <div className={myStyles.changeDate}>
              <span onClick={() => preDay('food')}><Icon type="caret-left" /></span>
              {date}
              <span onClick={() => nextDay('food')}><Icon type="caret-right" /></span>
            </div>
            <div style={{textAlign:'center'}}>暂无饮食记录</div>
          </div>
        }
        {
          loading && <div className={myStyles.sportModalLoading}>
            <span><Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} /></span>
          </div>
        }
      </div>
    </Modal>
  );
});
const CreateForm_sport = Form.create()(props => {
  const {
    form,
    modalVisible_sport,
    handleModalVisible_sport,
    sportRecordList,
    date,
    preDay,
    nextDay,
    loading,
  } = props;
  const footer = <div onClick={() => handleModalVisible_sport()} style={{textAlign:'center'}}><Button type='primary'>关闭</Button></div>
  return (
    <Modal
      destroyOnClose
      title="运动记录"
      visible={modalVisible_sport}
      onCancel={() => handleModalVisible_sport()}
      footer={footer}
    >
      <div style={{position:'relative'}}>
        { sportRecordList && sportRecordList.length > 0 &&
          <div>
            <div className={myStyles.changeDate}>
              <span onClick={() => preDay('sport')}><Icon type="caret-left" /></span>
              {date}
              <span onClick={() => nextDay('sport')}><Icon type="caret-right" /></span>
            </div>
            <div className={myStyles.foodContainer}>
              {
                sportRecordList.map((item,index) => (
                  <div className={myStyles.foodItem} key={index}>
                    <div style={{background:'#fff'}} className={myStyles.foodImg}>
                      <img style={{width:'100%',height:'100%'}} src={'http://jiangda.paobapaoba.cn/' + item.sportTypeDto.sportIcon + '.png'}/>
                    </div>
                    <div className={myStyles.foodRight}>
                      <div className={myStyles.foodName}>{item.sportTypeDto.sportName}</div>
                      <div className={myStyles.foodInfo}>
                      {`${item.sportRecordDto.sportDuration} 分钟 ---------------------------------------------------- ${item.sportRecordDto.sportConsumeCal} 千卡`}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        }
        {
          (!sportRecordList || sportRecordList.length == 0) &&
          <div>
            <div className={myStyles.changeDate}>
              <span onClick={() => preDay('sport')}><Icon type="caret-left" /></span>
              {date}
              <span onClick={() => nextDay('sport')}><Icon type="caret-right" /></span>
            </div>
            <div style={{textAlign:'center'}}>暂无运动记录</div>
          </div>
        }
        {
          loading && <div className={myStyles.sportModalLoading}>
            <span><Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} /></span>
          </div>
        }
      </div>
    </Modal>
  );
});
const CreateForm_advice = Form.create()(props => {
  const {
    form,
    modalVisible_advice,
    handleModalVisible_advice,
    adviceRecordList,
    date,
    preDay,
    nextDay,
    loading,
  } = props;
  const footer = <div onClick={() => handleModalVisible_advice()} style={{textAlign:'center'}}><Button type='primary'>关闭</Button></div>
  return (
    <Modal
      destroyOnClose
      title="科学建议"
      visible={modalVisible_advice}
      onCancel={() => handleModalVisible_advice()}
      footer={footer}
    >
      <div style={{position:'relative'}}>
        { adviceRecordList &&
          <div>
              <div style={{color:'#030303',fontSize:14,marginBottom:8}}>{adviceRecordList}</div>
              <div style={{color:'#919191',fontSize:13,marginBottom:6}}>1. 在保证蛋白质供给的基础上适当增加优质蛋白的供应,如禽畜肉、鱼、奶、豆类等；碳水化合物应占全日总能量的55%-65%，主食不宜过精过细。适当摄入脂肪，但要限制摄入动物脂肪，植物脂肪也不应太多，脂肪总量以不超过全日总能量的25%为宜。胆固醇的摄入量不超过300mg。</div>
              <div style={{color:'#919191',fontSize:13,marginBottom:6}}>2. 适量多摄入富含维生素C的食物，如橘子、卷心菜、土豆、红薯以及绿色、黄色蔬菜和富含维生素B2的食物，如蛋奶类、鱼虾类、绿叶蔬菜等，以提高运动能力，延缓运动疲劳的发生和增强肌肉收缩力。</div>
              <div style={{color:'#919191',fontSize:13,marginBottom:6}}>3. 适量多摄入一些含蛋氨酸丰富的食物，如牛奶、奶酪、牛、羊肉等，促进肝内脂肪的代谢。</div>
              <div style={{color:'#919191',fontSize:13,marginBottom:6}}>4. 适量多摄入一些瘦肉、鱼类、绿叶菜等含铁丰富的食物，防止发生缺铁性贫血。</div>
              <div style={{color:'#919191',fontSize:13,marginBottom:6}}>5. 注意水的补充，尽量不要补充纯净水和高浓度的果汁，最好补充口感好的运动饮料；不要等到口渴时再补充，要采取少量多次的办法在运动前、中、后补充。</div>
              <div style={{color:'#919191',fontSize:13,marginBottom:6}}>6. 控制油脂每天25g左右，减少动物油，限制饱和脂肪酸和胆固醇的摄入，盐最好平均每天在6g以下。</div>
          </div>
        }
        {
          !adviceRecordList &&
          <div>
            <div style={{textAlign:'center'}}>暂无建议</div>
          </div>
        }
        {
          loading && <div className={myStyles.sportModalLoading}>
            <span><Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} /></span>
          </div>
        }
      </div>
    </Modal>
  );
});

@connect(({ guide_sport_target, loading }) => ({
  guide_sport_target,
  loading: loading.models.guide_sport_target,
}))
@Form.create()
class guide extends PureComponent {
  state = {
    modalVisible_food: false,
    selectedRows: [], // 当前选择
    formValues: {}, // 筛选表单中的值

    currentPage: 1,
    pageSize: 10,

    currentDataNum: null, // 当前列表条数，用于判断当前页是否只有一条数据

    // date:'2018-12-04'
    date:getnyr(new Date())
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
      render:(val,record) => {
        return record.wxUserDto.headImg ? (
          <Avatar src={record.wxUserDto.headImg}/>
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
      render:(val,record) => {
        return <div>{record.wxUserDto.nickName?record.wxUserDto.nickName:'--'}</div>
      }
    },
    {
      title: '性别',
      render:(val,record) => {
        return <div>{record.wxUserDto.sex==1?'男':record.wxUserDto.sex==2?'女':'--'}</div>
      }
    },
    {
      title: '出生日期',
      render:(val,record) => {
        return <div>{record.wxUserDto.birthday?record.wxUserDto.birthday.substring(0,10):'--'}</div>
      }
    },
    {
      title: '身高',
      render:(val,record) => {
        return <div>{record.wxUserDto.height?(record.wxUserDto.height + '(cm)'):'--'}</div>
      }
    },
    {
      title: '体重',
      render:(val,record) => {
        return <div>{record.wxUserDto.weight?(record.wxUserDto.weight + '(kg)'):'--'}</div>
      }
    },
    {
      title: 'BMI',
      render:(val,record) => {
        return <div>{record.wxUserDto.bmi?record.wxUserDto.bmi:'--'}</div>
      }
    },
    {
      title: '每周运动计划',
      render:(val,record) => {
        return <div>{record.sportTargetStepNum?record.sportTargetStepNum:'--'}</div>
      }
    },
    {
      title: '饮食记录',
      render:(val,record) => {
        return <a onClick={() => this.foodRecord(record.wxUserDto.loginWeixinOpenid)}>查看</a>
      }
    },
    {
      title: '运动记录',
      render:(val,record) => {
        return <a onClick={() => this.sportRecord(record.wxUserDto.loginWeixinOpenid)}>查看</a>
      }
    },
    {
      title: '科学建议',
      render:(val,record) => {
        return <a onClick={() => this.adviceRecord(record.sportScienceAdviceDto.scienceAdvice)}>查看</a>
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
  handleModalVisible_food = flag => {
    this.setState({
      modalVisible_food: !!flag,
    });
  };
  handleModalVisible_sport = flag => {
    this.setState({
      modalVisible_sport: !!flag,
    });
  };
  handleModalVisible_advice = flag => {
    this.setState({
      modalVisible_advice: !!flag,
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
    this.setState({
      "ageH": '',
      "ageL": '',
      "bmih": '',
      "bmil": '',
      "heightH": '',
      "heightL": '',
      "weightH": '',
      "weightL": ''
    })
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
      type: 'guide_sport_target/targetList',
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

  // 查看饮食记录
  foodRecord = id => {
    const { dispatch } = this.props;
    this.setState({
      date:getnyr(new Date())
    },() => {
      dispatch({
        type: 'guide_sport_target/eatRecords',
        payload: {
          openId:id,
          date:this.state.date
        },
        callback: res => {
          if (res.code == 200) {
            this.setState({
              openId:id,
              modalVisible_food:true,
              foodRecordList:res.data.list
            })
          }
        },
      });
    })
  }
  // 查看运动记录
  sportRecord = id => {
    const { dispatch } = this.props;
    this.setState({
      date:getnyr(new Date())
    },() => {
      dispatch({
        type: 'guide_sport_target/sportRecords',
        payload: {
          openId:id,
          date:this.state.date
        }, 
        callback: res => {
          if (res.code == 200) {
            this.setState({
              openId:id,
              modalVisible_sport:true,
              sportRecordList:res.data?res.data.list:[]
            })
          }
        },
      });
    })
  }
  // 查看科学建议
  adviceRecord = content => {
    this.setState({
      modalVisible_advice:true,
      adviceRecordList:content
    })
  }

  // 选择日期
  preDay = (type) => {
    let s = this.state.date;
    let date = new Date(Date.parse(s.replace(/-/g,'/')));      
    date.setDate(date.getDate() - 1);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    if (m < 10) m = '0' + m;
    if (d < 10) d = '0' + d;
    let result = y + '-' + m + '-' + d;
    this.setState({
      date:result
    },() => {
      this.getRecords(type)
    })
  }
  nextDay = (type) => {
    let s = this.state.date;
    let date = new Date(Date.parse(s.replace(/-/g,'/')));      
    date.setDate(date.getDate() + 1);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    if (m < 10) m = '0' + m;
    if (d < 10) d = '0' + d;
    let result = y + '-' + m + '-' + d;
    if(result > getnyr(new Date())){
      return;
    }
    this.setState({
      date:result
    },() => {
      this.getRecords(type)
    })
  }
  getRecords = (type) => {
    const { dispatch } = this.props;
    if(type == 'food'){
      dispatch({
        type: 'guide_sport_target/eatRecords',
        payload: {
          openId:this.state.openId,
          date:this.state.date
        },
        callback: res => {
          if (res.code == 200) {
            this.setState({
              foodRecordList:res.data.list
            })
          }
        },
      })
    }
    if(type == 'sport'){
      dispatch({
        type: 'guide_sport_target/sportRecords',
        payload: {
          openId:this.state.openId,
          date:this.state.date
        },
        callback: res => {
          if (res.code == 200) {
            this.setState({
              sportRecordList:res.data.list
            })
          }
        },
      });
    }
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
              {getFieldDecorator('a_usname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {/* <Col md={6} sm={24}>
            <FormItem label="年龄">
              <div style={{display:'flex'}}>
                {getFieldDecorator('ageL')(
                  <span>
                    <InputNumber value={this.state.ageL} onChange={(val) => onchange('ageL',val)} placeholder="最小值" />
                  </span>
                )}
                <span style={{padding:'0 5px'}}>-</span>
                {getFieldDecorator('ageH')(
                  <span>
                    <InputNumber value={this.state.ageH} onChange={(val) => onchange('ageH',val)} placeholder="最大值" />
                  </span>
                )}
              </div>
            </FormItem>
          </Col> */}
          <Col md={6} sm={24}>
            <FormItem label="身高">
              <div style={{display:'flex'}}>
                {getFieldDecorator('heightL')(
                  <span>
                    <InputNumber value={this.state.heightL} onChange={(val) => onchange('heightL',val)} placeholder="最小值cm" />
                  </span>
                )}
                <span style={{padding:'0 5px'}}>-</span>
                {getFieldDecorator('heightH')(
                  <span>
                    <InputNumber value={this.state.heightH} onChange={(val) => onchange('heightH',val)} placeholder="最大值cm" />
                  </span>
                )}
              </div>
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="体重">
              <div style={{display:'flex'}}>
                {getFieldDecorator('weightL')(
                  <span>
                    <InputNumber value={this.state.weightL} onChange={(val) => onchange('weightL',val)} placeholder="最小值kg" />
                  </span>
                )}
                <span style={{padding:'0 5px'}}>-</span>
                {getFieldDecorator('weightH')(
                  <span>
                    <InputNumber value={this.state.weightH} onChange={(val) => onchange('weightH',val)} placeholder="最大值kg" />
                  </span>
                )}
              </div>
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* <Col md={6} sm={24}>
            <FormItem label="BMI">
              <div style={{display:'flex'}}>
                {getFieldDecorator('bmil')(
                  <span>
                    <InputNumber value={this.state.bmil} onChange={(val) => onchange('bmil',val)} step={0.1} placeholder="最小值" />
                  </span>
                )}
                <span style={{padding:'0 5px'}}>-</span>
                {getFieldDecorator('bmih')(
                  <span>
                    <InputNumber value={this.state.bmih} onChange={(val) => onchange('bmih',val)} step={0.1} placeholder="最大值" />
                  </span>
                )}
              </div>
            </FormItem>
          </Col> */}
        </Row>
      </Form>
    );
  }

  render() {
    const {
      guide_sport_target: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const parentMethods = { 
      // 传递方法
      handleModalVisible_food: this.handleModalVisible_food,
      handleModalVisible_sport: this.handleModalVisible_sport,
      handleModalVisible_advice: this.handleModalVisible_advice,
      preDay:this.preDay,
      nextDay:this.nextDay,
    };
    const parentStates = {
      // 传递状态
      modalVisible_food: this.state.modalVisible_food,
      modalVisible_sport: this.state.modalVisible_sport,
      modalVisible_advice: this.state.modalVisible_advice,
      foodRecordList:this.state.foodRecordList,
      sportRecordList:this.state.sportRecordList,
      adviceRecordList:this.state.adviceRecordList,
      date:this.state.date,
      loading:loading
    };

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
          <CreateForm_food {...parentMethods} {...parentStates} />
          <CreateForm_sport {...parentMethods} {...parentStates} />
          <CreateForm_advice {...parentMethods} {...parentStates} />
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
