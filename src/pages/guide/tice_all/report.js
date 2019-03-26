import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message, Button ,Icon } from 'antd';
import { Radar, Bar, ChartCard} from '@/components/Charts';

import styles from './report.less';

import { getPageQuery, getnyr } from '@/utils/utils';
import running from '@/assets/running.gif';
import logo from '@/assets/logo_1.png';
import food from '@/assets/food.png';
import totalScore from '@/assets/totalScore.png';
import zhuanjiahead from '@/assets/zhuanjiahead.png'
import { fileUrl } from '@/global';

message.config({ top: 100 });

@connect(({ guide_tice_all, loading }) => ({
  guide_tice_all,
  loading: loading.models.guide_tice_all,
}))
class report extends PureComponent {
  state = {
    loading:true,
    user:{}, 
    report:{}, 
    projectList:[], 
    levelList:[],
    guidence:''
  };

  print = () => {
    window.print();
  };

  componentDidMount() {
    console.log(this.props.location.query)
    let query = JSON.parse(localStorage.getItem('reportRecord')),
    report,
    user,
    levelList=[],
    projectList=[]; 

    // 用户信息
    user = {
      bthDate:query.bthDate || '--',
      groupName:query.groupName || '成年人',
      name:query.name || '--',
      sex:query.sex==1?'男':query==2?'女':'--',
      tel:query.tel || '--',
      workunit:query.workunit || '--',
      openid:query.openid
    }
    // 报告
    let projects = {      
      sgtz:query.bmi,
      fhl:query.fhl,
      fwc:query.fwc,
      fys:query.fys,
      tjcs:query.tjcs,
      wdx:query.wdx,
      wl:query.wl,
      ywqz:query.ywqz,
      ztgd:query.ztgd,
      zwtqq:query.zwtqq,
    }
    report = {
      id:query.id,
      createTime:query.createTime,
      reportcode:query.reportcode,
      targetgrade:query.targetScore,
      total_grade:query.score,
      level:query.level,
      levelName:
        query.level == 1
          ? '不合格'
          : query.level == 2
            ? '合格'
            : query.level == 3
              ? '良好'
              : '优秀',
      levelColor:
        query.level == 1
          ? '#EB0000'
          : query.level == 2
            ? '#EA7120'
            : query.level == 3
              ? '#40D34D'
              : '#018FD9',
      ...projects
    }
    // projectList
    for(var key in projects){
      if(projects[key]){
        var obj = JSON.parse(projects[key]);
        if(obj.isMust){
          projectList.push(obj)
        }
      }
    }
    // 评测标准
    this.props.dispatch({
      type: 'guide_tice_all/getTiceSetting', 
      callback: res => {
        if(res.meta.code == 200){
          var levelObj = res.data.levelList;
          levelList = [
            {
              ages:"20-39",
              sex:1,
              scoresobj:{
                level_1: `${levelObj['20'][0].scoreLower}-${levelObj['20'][0].scoreUp}`,
                level_2: `${levelObj['20'][1].scoreLower}-${levelObj['20'][1].scoreUp}`,
                level_3: `${levelObj['20'][2].scoreLower}-${levelObj['20'][2].scoreUp}`,
                level_4: `${levelObj['20'][3].scoreLower}-${levelObj['20'][3].scoreUp}`
              }
            },
            {
              ages:"20-39",
              sex:2,
              scoresobj:{
                level_1: `${levelObj['20'][4].scoreLower}-${levelObj['20'][4].scoreUp}`,
                level_2: `${levelObj['20'][5].scoreLower}-${levelObj['20'][5].scoreUp}`,
                level_3: `${levelObj['20'][6].scoreLower}-${levelObj['20'][6].scoreUp}`,
                level_4: `${levelObj['20'][7].scoreLower}-${levelObj['20'][7].scoreUp}`
              }
            },
            {
              ages:"40-59",
              sex:1,
              scoresobj:{
                level_1: `${levelObj['40'][0].scoreLower}-${levelObj['40'][0].scoreUp}`,
                level_2: `${levelObj['40'][1].scoreLower}-${levelObj['40'][1].scoreUp}`,
                level_3: `${levelObj['40'][2].scoreLower}-${levelObj['40'][2].scoreUp}`,
                level_4: `${levelObj['40'][3].scoreLower}-${levelObj['40'][3].scoreUp}`
              }
            },
            {
              ages:"40-59",
              sex:2,
              scoresobj:{
                level_1: `${levelObj['40'][4].scoreLower}-${levelObj['40'][4].scoreUp}`,
                level_2: `${levelObj['40'][5].scoreLower}-${levelObj['40'][5].scoreUp}`,
                level_3: `${levelObj['40'][6].scoreLower}-${levelObj['40'][6].scoreUp}`,
                level_4: `${levelObj['40'][7].scoreLower}-${levelObj['40'][7].scoreUp}`
              }
            },
          ]
        
          this.setState({
            report: report,
            user: user,
            projectList: projectList,
            levelList:levelList,
            loading:false
          },function(){
            this.getGuide()
          });
        }
      },
    });
  }

  // 监听专家指导内容
  watchTextarea(e) {
    this.setState({
      guidence:e.target.value
    })
  }
  // 查询专家指导内容
  getGuide(){
    this.props.dispatch({
      type: 'guide_tice_all/tice_guide_search',
      payload: {
        tc_reportId:this.state.report.id,
        openId:this.state.user.openid
      },
      callback: res => {
        if(res.code == 200){
          if(res.data.specialReport != ''){
            var specialReport = res.data.specialReport
            this.setState({
              specialInfo:res.data.specialInfo,
              guideId:specialReport.id,
              guidence:specialReport.msg,
              newResponseTime:specialReport.newResponseTime.substring(0,10),
            })
          }
        }
      },
    });
  }
  // 保存
  handleOKGuide = () => {
    this.setState({
      guideLoading:true
    })
    let params = {
      id:this.state.guideId || 0,
      msg:this.state.guidence,
      tc_reportId:this.state.report.id,
      speciaId:localStorage.getItem('identityId'),
      openId:this.state.user.openid
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'guide_tice_all/tice_guide',
      payload: params,
      callback: res => {
        if(res.code == 200){
          this.setState({
            guideLoading:false
          })
          message.success('操作成功')
          this.getGuide()
        }
      },
    });
  }

  render() {
    const { user, report, projectList, levelList } = this.state;

    let barData = [],
      radarData = [];
    for (let i = 0; i < projectList.length; i++) {
      if (projectList[i]) { // 必测项测过，有数据
        barData.push({
          x: projectList[i].projectName,
          y: projectList[i].grade,
        });
        radarData.push({
          name: '测试得分',
          label: projectList[i].projectName,
          value: projectList[i].grade,
        });
      }
      else{ // 必测项无数据，0分

      }
    }

    if (this.state.loading) {
      return (
        <div className={styles.running}>
          <div>
            <img src={running} />
            <div>正在努力生成报告...</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.page}>
          <div className={styles.container}>
            {/* 头 */}
            <div className={styles.header}>
              <div>
                <img className={styles.logo_print} style={{ width: 128 }} src={logo} />
                <h3>体质评估报告</h3>
                <p>
                  报告编号：
                  {report.reportcode}
                </p>
              </div>
              <div className={styles.header_table_p}>
                <table className={styles.header_table}>
                  <tbody>
                    <tr>
                      <td>
                        姓名：
                        {user.name}
                      </td>
                      <td>
                        性别：
                        {user.sex}
                      </td>
                      <td>
                        出生日期：
                        {user.bthDate}
                      </td>
                      <td>
                        手机号：
                        {user.tel}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        组别：
                        {user.groupName}
                      </td>
                      <td>
                        评测时间：
                        {report.createTime ? report.createTime.substring(0,10) : '--'}
                      </td>
                      <td colSpan="2">
                        工作单位：
                        {user.workunit}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* line */}
            <div className={styles.cutline} />
            {/* 基础评测 */}
            <div style={{ marginBottom: 20 }}>
              <p className={styles.itemTitle}>基础评测</p>
              <div className={styles.cardContainer}>
                <div className={styles.itemCard}>
                  <Bar height={260} data={barData} />
                  <div className={styles.chartsTitle}>基础评测图</div>
                </div>
                <div className={styles.itemCard + ' ' + styles.table}>
                  <table>
                    <thead>
                      <tr>
                        <th className={styles.border_r}>测试项目</th>
                        <th className={styles.border_r}>测试结果</th>
                        <th>单项得分</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectList.map(
                        (item, i) =>
                          item && (
                            <tr key={i}>
                              <td className={styles.border_rb}>{item.projectName}</td>
                              <td className={styles.border_rb}>{item.score}</td>
                              <td className={styles.border_b}>
                                <span style={{ color: '#1F8BF7' }}>{item.grade}</span>
                                <span style={{ color: '#666' }}>（满分5）</span>
                              </td>
                            </tr>
                          )
                      )}
                      <tr>
                        <td colSpan={3}>
                          <b>
                            总评分（满分
                            {report.targetgrade}）
                          </b>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          <span style={{ color: report.levelColor }}>{report.levelName}</span>
                          <span style={{ color: '#666' }}>
                            （{report.total_grade}
                            分）
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* line */}
            <div className={styles.cutline} />
            {/* 综合评测 */}
            <div style={{ marginBottom: 20 }}>
              <p className={styles.itemTitle}>综合评测</p>
              <div className={styles.cardContainer}>
                <div style={{ height: 330 }} className={styles.itemCard}>
                  <div className={styles.zonghe}>
                    <div>
                      <i>
                        <span className={styles.high}>{report.targetgrade}</span>
                        <span className={styles.low}>0</span>
                      </i>
                      <img src={totalScore} />
                    </div>
                    <div className={styles.radar}>
                      <Radar height={290} data={radarData} />
                    </div>
                  </div>
                  <div className={styles.chartsTitle}>综合评测图</div>
                </div>
                <div style={{ height: 330 }} className={styles.itemCard + ' ' + styles.table}>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ padding: '16px 0' }} colSpan="2">
                          <b>
                            综合评价为
                            <span style={{ color: report.levelColor, fontSize: 20 }}>
                              {' '}
                              {report.total_grade}{' '}
                            </span>
                            分，
                            <span style={{ color: report.levelColor }}>{report.levelName}</span>
                          </b>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className={styles.border_r + ' ' + styles.food}>
                          <img src={food} />
                        </td>
                        <td style={{ textAlign: 'left', padding: 8, paddingTop: 0 }}>
                          <div style={{ color: '#3F99EE', margin: '8px 0' }}>
                            <b>饮食建议</b>
                          </div>
                          多吃蔬菜水果和薯类。推荐我国成年人吃蔬菜300g-500g,水果200g-400g。并注意增加薯类的摄入。每天吃奶类，大豆或其他制品。建议每人每天饮奶300ml，摄入30g-50g大豆或相当量的豆制品。常吃适量的鱼、禽、蛋和瘦肉。每日摄入鱼禽肉类50-75g，鱼虾类50g-100g,蛋类25-50g。减少烹饪油用量，吃清淡少盐膳食。推荐每日油25-30g，盐不多于6g。食不过量，天天运动，保持健康体重。三餐分配要合理，零食要适当。每天足量饮水，合理选择饮料。如饮酒应限量。吃新鲜卫生的食物。
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* line */}
            <div className={styles.cutline} />
            {/* 评测标准 */}
            <div style={{ marginBottom: 20 }}>
              <p className={styles.itemTitle}>评测标准</p>
              <div className={styles.cardContainer}>
                <div style={{ height: 340 }} className={styles.itemCard}>
                  <div className={styles.biaozhun}>
                      {
                        levelList.map((ele,i) => (
                          <div key={i} className={styles.biaozhunItem}>
                            <div className={styles.biaozhunItem_title}>{ele.ages}岁 {ele.sex==1?'男':'女'}：</div>
                            <div className={styles.biaozhunItem_content}>
                              <div className={styles.sItem}>
                                <div style={ele.sex==1?{color:'#2F77EE'}:{color:'#EA7120'}} className={styles.sItem_icon}><Icon type="environment" theme="filled" /></div>
                                <div className={styles.sItem_top}>
                                  <div>一级(优秀)</div>
                                  <span>{ele.scoresobj.level_4} 分</span>
                                </div>
                                <div style={ele.sex==1?{background:'#2F77EE'}:{background:'#EA7120'}} className={styles.sItem_bottom}></div>
                              </div>
                              <div className={styles.sItem}>
                                <div style={ele.sex==1?{color:'#388AEE'}:{color:'#EB8744'}} className={styles.sItem_icon}><Icon type="environment" theme="filled" /></div>
                                <div className={styles.sItem_top}>
                                  <div>二级(良好)</div>
                                  <span>{ele.scoresobj.level_3} 分</span>
                                </div>
                                <div style={ele.sex==1?{background:'#388AEE'}:{background:'#EB8744'}} className={styles.sItem_bottom}></div>
                              </div>
                              <div className={styles.sItem}>
                                <div style={ele.sex==1?{color:'#43A0DD'}:{color:'#E49662'}} className={styles.sItem_icon}><Icon type="environment" theme="filled" /></div>
                                <div className={styles.sItem_top}>
                                  <div>三级(合格)</div>
                                  <span>{ele.scoresobj.level_2} 分</span>
                                </div>
                                <div style={ele.sex==1?{background:'#43A0DD'}:{background:'#E49662'}} className={styles.sItem_bottom}></div>
                              </div>
                              <div className={styles.sItem}>
                                <div style={ele.sex==1?{color:'#79C0EE'}:{color:'#E8BDA1'}} className={styles.sItem_icon}><Icon type="environment" theme="filled" /></div>
                                <div className={styles.sItem_top}>
                                  <div>四级(不合格)</div>
                                  <span>{ele.scoresobj.level_1} 分</span>
                                </div>
                                <div style={ele.sex==1?{background:'#79C0EE'}:{background:'#E8BDA1'}} className={styles.sItem_bottom}></div>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                  </div>
                </div>
                <div style={{ height: 340 }} className={styles.itemCard + ' ' + styles.table}>
                  <table>
                    <tbody>
                      <tr>
                        <td
                          style={{ background: '#D9EDFC' }}
                          className={styles.border_b + ' ' + styles.thbg_print}
                        >
                          <b>类别</b>
                        </td>
                        <td className={styles.border_rb}>
                          <b>20-30岁</b>
                        </td>
                        <td className={styles.border_b}>
                          <b>40-59岁</b>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ background: '#D9EDFC' }}
                          className={styles.border_b + ' ' + styles.thbg_print}
                        >
                          <b>形态</b>
                        </td>
                        <td className={styles.border_rb}>身高/体重</td>
                        <td className={styles.border_b}>身高/体重</td>
                      </tr>
                      <tr>
                        <td
                          style={{ background: '#D9EDFC' }}
                          className={styles.border_b + ' ' + styles.thbg_print}
                        >
                          <b>机能</b>
                        </td>
                        <td className={styles.border_rb}>肺活量/台阶测试</td>
                        <td className={styles.border_b}>肺活量/台阶测试</td>
                      </tr>
                      <tr>
                        <td
                          rowSpan="7"
                          style={{ background: '#D9EDFC' }}
                          className={styles.thbg_print}
                        >
                          <b>素质</b>
                        </td>
                        <td className={styles.border_rb}>握力</td>
                        <td className={styles.border_b}>握力</td>
                      </tr>
                      <tr>
                        <td className={styles.border_rb}>俯卧撑（男）</td>
                        <td className={styles.border_b}>/</td>
                      </tr>
                      <tr>
                        <td className={styles.border_rb}>仰卧起坐（女）</td>
                        <td className={styles.border_b}>/</td>
                      </tr>
                      <tr>
                        <td className={styles.border_rb}>纵跳</td>
                        <td className={styles.border_b}>纵跳</td>
                      </tr>
                      <tr>
                        <td className={styles.border_rb}>坐位体前屈</td>
                        <td className={styles.border_b}>坐位体前屈</td>
                      </tr>
                      <tr>
                        <td className={styles.border_rb}>反应时</td>
                        <td className={styles.border_b}>反应时</td>
                      </tr>
                      <tr>
                        <td className={styles.border_r}>稳定性</td>
                        <td>稳定性</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* line */}
            <div className={styles.cutline} />
            {/* 评测结果和建议 */}
            <div style={{ marginBottom: 20 }}>
              <p className={styles.itemTitle}>评测结果和建议</p>
              <div className={styles.cardContainer}>
                <div className={styles.advice}>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: '20%' }} className={styles.border_r}>
                          测试项目
                        </th>
                        <th style={{ width: '20%' }} className={styles.border_r}>
                          测试结果
                        </th>
                        <th style={{ width: '60%' }}>处方建议</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectList.map(
                        (item, i) =>
                          item && (item.grade > 0 || item.advice) && (
                            <tr key={i}>
                              <td className={styles.border_rb}>{item.projectName}</td>
                              <td
                                style={
                                  item.grade <= 1 || item.grade == 2
                                    ? { color: '#EB0000' }
                                    : item.grade == 3
                                      ? { color: '#F0C431' }
                                      : item.grade > 3
                                        ? { color: '#018FD9' }
                                        : { color: '#666' }
                                }
                                className={styles.border_rb}
                              >
                                <b>
                                  {item.grade <= 1 || item.grade == 2
                                    ? '较差'
                                    : item.grade == 3
                                      ? '一般'
                                      : item.grade > 3
                                        ? '较好'
                                        : '--'}
                                </b>
                              </td>
                              <td className={styles.border_b}>{item.advice}</td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* line */}
            <div className={styles.cutline} />
            {/* 专家指导意见 */}
            <div style={{ marginBottom: 20 }}>
              <p className={styles.itemTitle}>专家指导意见</p>
                <div className={styles.advice}>
                  <table>
                    <tbody>
                      <tr>
                        <td className={styles.guideL}>
                          <div className={styles.guideL_head}>
                          {
                            this.state.specialInfo ?
                            <img src={fileUrl + this.state.specialInfo.headimg}/> :
                            <img src={zhuanjiahead}/>
                          }
                          </div>
                          {
                            this.state.specialInfo&&
                            <div>
                              <div className={styles.guideL_name}><b>{this.state.specialInfo.name}</b></div>
                              <div>{this.state.specialInfo.specialty}</div>
                            </div>
                          }
                        </td>
                        <td className={styles.guideR}>
                          <textarea value={this.state.guidence} onChange={ (e) => this.watchTextarea(e)} placeholder="请输入处方建议"></textarea>
                          <div className={styles.guideR_time}>
                            {
                              this.state.newResponseTime &&
                              <span><b>指导时间：</b>{this.state.newResponseTime}</span>
                            }
                            <div onClick={this.handleOKGuide} className={styles.guideR_ok}>
                              <Button type="primary" size="small" loading={this.state.guideLoading}>
                                确认
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
          {/* <div className={styles.print}>
            <Button
              onClick={this.print}
              style={{ padding: '0 20px', marginTop: 14 }}
              type="primary"
            >
              打印
            </Button>
            <Button style={{ padding: '0 20px', marginTop: 10 }} type="primary">
              保存
            </Button>
          </div> */}
        </div>
      );
    }
  }
}

export default report;
