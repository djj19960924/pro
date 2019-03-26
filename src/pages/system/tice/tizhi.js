import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import { Card, Form, Row, Col, Input, Button, Checkbox, message, InputNumber } from 'antd';
import Loading from '@/components/Loading';

import styles from './tizhi.less';

const FormItem = Form.Item;
const gird = { xl: 4, lg: 6, sm: 8 };
const messageInfo = <div style={{ display: 'none' }} />;

let project_1 = [];
project_1 = JSON.parse(localStorage.getItem("allProject"))

message.config({ top: 100 });

@connect(({ ticeSetting, loading }) => ({
  ticeSetting,
  loading: loading.models.ticeSetting,
}))
@Form.create()
class system extends PureComponent {
  state = {
    testProjectList: [], // 项目
    levelList: [], // 等级
  };

  componentDidMount() {
    this.getInfo();
  }

  getInfo = () => {
    const { form, dispatch } = this.props;
    dispatch({
      type: 'ticeSetting/setting_all',
      callback: res => {
        if(res.meta.code != 200) return;
        // 项目选中的valuelist
        res.data.testProjectList.forEach((ele, index) => {
          let pp = JSON.parse(ele.projects);
          let projectArrays = []
          ele.ages = ele.ageLower + '-' + ele.ageUp
          pp.forEach(ele => {
            if(ele.name == '肺活量'){
              ele.must && projectArrays.push(ele.id)
            } 
            if(ele.name == '握力'){
              ele.must && projectArrays.push(ele.id)
            } 
            if(ele.name == '稳定性'){
              ele.must && projectArrays.push(ele.id)
            } 
            if(ele.name == '俯卧撑'){
              ele.must && projectArrays.push(ele.id)
            } 
            if(ele.name == '反应时'){
              ele.must && projectArrays.push(ele.id)
            } 
            if(ele.name == '身高体重'){
              ele.must && projectArrays.push(ele.id)
            } 
            if(ele.name == '台阶测试'){
              ele.must && projectArrays.push(ele.id)
            } 
            if(ele.name == '仰卧起坐'){
              ele.must && projectArrays.push(ele.id)
            } 
            if(ele.name == '纵跳高度'){
              ele.must && projectArrays.push(ele.id)
            } 
            if(ele.name == '坐位体前屈'){
              ele.must && projectArrays.push(ele.id)
            } 
          })
          ele.projectArrays = projectArrays;
          ele.projects = pp

          let arr = [];
          ele.projectArrays.forEach(item => {
            arr.push(ele.id + ',' + item);
          });
          ele.value = arr;
        });


        // level
        let levelList = this.upLevel(res.data.levelList);
        levelList.forEach((ele,index) => {
          // 计算总分
          ele.totalScore = res.data.testProjectList[index].projectArrays.length * 5
        })

        this.setState(
          {
            testProjectList: res.data.testProjectList,
            levelList: levelList,
          },
          () => {
            console.log(res.data.testProjectList)
            console.log(project_1)
            // set level
            let obj = {};
            this.state.levelList.forEach((ele, index) => {
              ele.scores.forEach(item => {
                obj[`level_${item.id}_lower`] = item.scoreLower;
                obj[`level_${item.id}_up`] = item.scoreUp;
              });
              obj[`timediff`] = ele.timediff + '';
            });
            form.setFieldsValue(obj);
          }
        );
      },
    });
  };

  // level 究极进化
  upLevel = (levelList) => {
    let timediff = levelList['20'][0].timediff
    let newList = [
      {
        ages:'20-39',
        sex:1,
        scores:[],
        timediff:timediff
      },
      {
        ages:'40-59',
        sex:1,
        scores:[],
        timediff:timediff
      },
      {
        ages:'20-39',
        sex:2,
        scores:[],
        timediff:timediff
      },
      {
        ages:'40-59',
        sex:2,
        scores:[],
        timediff:timediff
      },
    ]
    levelList['20'].forEach(ele => {
      if(ele.sex == 1){
        newList[0].scores.push(
          {
            id:ele.id,
            scoreLower:ele.scoreLower,
            scoreUp:ele.scoreUp
          }
        )
      }else{
        newList[2].scores.push(
          {
            id:ele.id,
            scoreLower:ele.scoreLower,
            scoreUp:ele.scoreUp
          }
        )
      }
    })
    levelList['40'].forEach(ele => {
      if(ele.sex == 1){
        newList[1].scores.push(
          {
            id:ele.id,
            scoreLower:ele.scoreLower,
            scoreUp:ele.scoreUp
          }
        )
      }else{
        newList[3].scores.push(
          {
            id:ele.id,
            scoreLower:ele.scoreLower,
            scoreUp:ele.scoreUp
          }
        )
      }
    })
    return newList
  }

  chooseProject = e => {
    let pId = e.target.value.split(',')[0];
    let cId = e.target.value.split(',')[1];
    let testProjectList = this.state.testProjectList;
    testProjectList.forEach(ele => {
      if (ele.id == pId) {
        if (e.target.checked) {
          ele.value.push(e.target.value);
        } else {
          let x = [];
          ele.value.forEach(item => {
            if (item != e.target.value) {
              x.push(item);
            }
          });
          ele.value = x;
        }
      }
    });
    this.setState({
      testProjectList: testProjectList,
      a: e.target.value + e.target.checked,
    });
  };

  // 保存项目
  saveProject = () => {
    const { dispatch } = this.props;
    let arr = [];
    // console.log(this.state.testProjectList);
    this.state.testProjectList.forEach(ele => {
      let projects = [];
      ele.value.forEach(item => {
        projects.push(item.split(',')[1]);
      });
      projects = projects.join(',');
      arr.push({
        id: ele.id,// 项目组id
        projects: projects,// 项目id列表
      });
    });
    // console.log(arr);return;

    arr.forEach((ele, index) => {
      // console.log(ele)
      dispatch({
        type: 'ticeSetting/saveProjects',
        payload: ele,
        callback: res => {
          if (res.meta.code == 200 && index == 3) {
            message.success('修改成功');
            this.getInfo();
          }
        },
      });
    });
  };

  // 保存级别
  saveLevel = e => {
    e.preventDefault();

    const { form, dispatch } = this.props;

    form.validateFields((err, fields) => {
      if (err) return;
      var params = [];

      var count = 0;
      var index = 0;
      var obj = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];

      for(var key in fields){
        if(key == 'timediff'){

        }else{
          var id = key.split('_')[1];
          if(count === 0){
            obj[index/2].id = id;
            obj[index/2].scoreLower = fields[key]
          }
          if(count === 1){
            obj[(index-1)/2].scoreUp = fields[key]
            params.push(obj[(index-1)/2]);
          }
          index++;
          count++;
          count > 1 && (count = 0)
          count > 1 && (obj = {})
        }
      }
      
      dispatch({
        type: 'ticeSetting/saveLevels',
        payload: params,
        callback: res => {
          if (res.meta.code == 200) {
            message.success('修改成功');
          }
        },
      });
    });
  };

  render() {
    const { loading } = this.props;
    const { testProjectList, levelList } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.container}>
            {/* ****** */}
            <Row>
              <div style={{ marginTop: 0 }} className={styles.title}>
                国民体质测试项目(成人)
                <Button
                  onClick={this.saveProject}
                  style={{ marginLeft: 10 }}
                  size="small"
                  type="primary"
                >
                  保存
                </Button>
              </div>
            </Row>
            <Row>
              <Col span={24}>
                <div className={styles.testProjectList}>
                  <p />
                  {testProjectList.map(ele => {
                    return (
                      <div key={ele.id} className={styles.item}>
                        <Row>
                          <Col span={4}>
                            <b>
                              <span>{ele.sex == '1' ? '男' : '女'} </span>
                              <span>{ele.ages}：</span>
                            </b>
                          </Col>
                          <Col span={20}>
                            <Checkbox.Group value={ele.value} style={{ width: '100%' }}>
                              <Row>
                                {project_1.map(item => (
                                  <Col key={item.id} {...gird}>
                                    <Checkbox
                                      onChange={e => this.chooseProject(e)}
                                      value={ele.id + ',' + item.id}// 项目组id + 项目id
                                    >
                                      {item.name}
                                    </Checkbox>
                                  </Col>
                                ))}
                              </Row>
                            </Checkbox.Group>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
            {/* ****** */}
            <Form onSubmit={this.saveLevel}>
              <Row>
                <div className={styles.title}>
                  体测评分设置
                  <Button htmlType="submit" style={{ marginLeft: 10 }} size="small" type="primary">
                    保存
                  </Button>
                </div>
              </Row>
              {/* <Row>
                <Col style={{display:'flex',flexDirection:'row'}} className={styles.levelLeft} span={24}>
                  <span>时间维度：</span>
                  <FormItem className={styles.levelFormItem}>
                    {getFieldDecorator(`timediff`, {
                      rules: [{ required: true, message: messageInfo }],
                    })(<InputNumber size="small" max={1000} />)}
                    <span> 天</span>
                  </FormItem>
                </Col>
              </Row> */}
              <Row className={styles.levelListRow}>
                {levelList.map((item,index) => {
                  return (
                    <Col key={index} xxl={6} xl={12} className={styles.levelListCol}>
                      <div className={styles.levelList}>
                        <p />
                        <h3>
                          {item.sex == '1' ? '男' : '女'} {item.ages}
                        </h3>
                        <Row>
                          <Col className={styles.levelLeft} span={6}>
                            <span>综合总分：</span>
                          </Col>
                          <Col style={{ textAlign: 'left' }} className={styles.levelRight} span={6}>
                            <span style={{ color: '#429BEE', fontWeight: 900 }}>{item.totalScore}</span>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                          <Col className={styles.levelLeft} span={6}>
                            <span>分数等级：</span>
                          </Col>
                          <Col className={styles.levelRight} span={18}>
                            <Row className={styles.levelItem}>
                              <Col className={styles.levelLeft} span={6}>
                                <span>不合格：</span>
                              </Col>
                              <Col className={styles.levelRight} span={7}>
                                <FormItem className={styles.levelFormItem}>
                                  {getFieldDecorator(`level_${item.scores[0].id}_lower`, {
                                    rules: [{ required: true, message: messageInfo }],
                                  })(<InputNumber size="small" />)}
                                </FormItem>
                              </Col>
                              <Col className={styles.levelRight} span={2}>
                                -
                              </Col>
                              <Col className={styles.levelRight} span={7}>
                                <FormItem className={styles.levelFormItem}>
                                  {getFieldDecorator(`level_${item.scores[0].id}_up`, {
                                    rules: [{ required: true, message: messageInfo }],
                                  })(<InputNumber size="small" />)}
                                </FormItem>
                              </Col>
                            </Row>
                            <Row className={styles.levelItem}>
                              <Col className={styles.levelLeft} span={6}>
                                <span>合格：</span>
                              </Col>
                              <Col className={styles.levelRight} span={7}>
                                <FormItem className={styles.levelFormItem}>
                                  {getFieldDecorator(`level_${item.scores[1].id}_lower`, {
                                    rules: [{ required: true, message: messageInfo }],
                                  })(<InputNumber size="small" />)}
                                </FormItem>
                              </Col>
                              <Col className={styles.levelRight} span={2}>
                                -
                              </Col>
                              <Col className={styles.levelRight} span={7}>
                                <FormItem className={styles.levelFormItem}>
                                  {getFieldDecorator(`level_${item.scores[1].id}_up`, {
                                    rules: [{ required: true, message: messageInfo }],
                                  })(<InputNumber size="small" />)}
                                </FormItem>
                              </Col>
                            </Row>
                            <Row className={styles.levelItem}>
                              <Col className={styles.levelLeft} span={6}>
                                <span>良好：</span>
                              </Col>
                              <Col className={styles.levelRight} span={7}>
                                <FormItem className={styles.levelFormItem}>
                                  {getFieldDecorator(`level_${item.scores[2].id}_lower`, {
                                    rules: [{ required: true, message: messageInfo }],
                                  })(<InputNumber size="small" />)}
                                </FormItem>
                              </Col>
                              <Col className={styles.levelRight} span={2}>
                                -
                              </Col>
                              <Col className={styles.levelRight} span={7}>
                                <FormItem className={styles.levelFormItem}>
                                  {getFieldDecorator(`level_${item.scores[2].id}_up`, {
                                    rules: [{ required: true, message: messageInfo }],
                                  })(<InputNumber size="small" />)}
                                </FormItem>
                              </Col>
                            </Row>
                            <Row className={styles.levelItem}>
                              <Col className={styles.levelLeft} span={6}>
                                <span>优秀：</span>
                              </Col>
                              <Col className={styles.levelRight} span={7}>
                                <FormItem className={styles.levelFormItem}>
                                  {getFieldDecorator(`level_${item.scores[3].id}_lower`, {
                                    rules: [{ required: true, message: messageInfo }],
                                  })(<InputNumber size="small" />)}
                                </FormItem>
                              </Col>
                              <Col className={styles.levelRight} span={2}>
                                -
                              </Col>
                              <Col className={styles.levelRight} span={7}>
                                <FormItem className={styles.levelFormItem}>
                                  {getFieldDecorator(`level_${item.scores[3].id}_up`, {
                                    rules: [{ required: true, message: messageInfo }],
                                  })(<InputNumber size="small" />)}
                                </FormItem>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Form>
            {/* ****** */}
            {/* <Row>
              <div className={styles.title}>体测标准</div>
            </Row> */}
            <Row />
          </div>
        </Card>
        <Loading loading={loading} />
      </PageHeaderWrapper>
    );
  }
}
export default system;
