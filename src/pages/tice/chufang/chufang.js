import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message, Button } from 'antd';
import { Radar, Bar, ChartCard } from '@/components/Charts';

import styles from './chufang.less';

import { getPageQuery, getnyr } from '@/utils/utils';
import { fileUrl } from '@/global';
import running from '@/assets/running.gif';
import logo from '@/assets/logo_1.png';
import rrlx from '@/assets/rrlx.png';
import qsll from '@/assets/qsll.png';
import yyyd from '@/assets/yyyd.png';
import jrgndl from '@/assets/jrgndl.png';
import phlx from '@/assets/phlx.png';
import phxl from '@/assets/phxl.png';
import qclx from '@/assets/qclx.png';
import rrxl from '@/assets/rrxl.png';
import sdlx from '@/assets/sdlx.png';
import szll from '@/assets/szll.png';
import xxhd from '@/assets/xxhd.png';
import xzll from '@/assets/xzll.png';
import nodata from '@/assets/nodata.png';
import zhuanjiahead from '@/assets/zhuanjiahead.png'

message.config({ top: 100 });

@connect(({ tice_all, loading }) => ({
  tice_all,
  loading: loading.models.tice_all,
}))
class chufang extends PureComponent {
  state = {
    guidanceData:{}
  };

  print = () => {
    window.print();
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tice_all/getGuidance',
      payload: getPageQuery().id,
      callback: res => {
        if (res.code == 200) {
          if(res.data.scienceAdvice == '' && res.data.sportReport == ''){
            this.setState({
              noChufang:true
            })
          }
          else{
            var user = {
              openId:res.data.sportReport.openId,
              name:res.data.sportReport.name,
              sex:res.data.sportReport.sex,
              birthDay:res.data.sportReport.birthDay,
              phone:res.data.sportReport.phone,
              groupName:'成年人',
            }
            var guidanceData = {}
            guidanceData.report = JSON.parse(res.data.sportReport.tcProjectInfoJson)
            guidanceData.sportFrequency = res.data.sportRecommends.splice(0,3)
            this.setState({
              guidanceData: guidanceData,
              user:user,
              scienceAdvice:res.data.scienceAdvice,
              sportReportId:res.data.sportReport.id
            });
          }
        }
      },
    });
  }

  render() {
    const { guidanceData , user , scienceAdvice } = this.state;

    const { loading } = this.props;

    if (loading) {
      return (
        <div className={styles.running}>
          <div>
            <img src={running} />
            <div>正在努力加载处方...</div>
          </div>
        </div>
      );
    }
    else if(this.state.noChufang){
      return  <div className={styles.nodata}>
                <div>
                  <img src={nodata}/><br/>
                  <div>暂无处方</div>
                </div>
              </div>
    }
    else {
      let barData = [],radarData=[];
      if(guidanceData && guidanceData.report && JSON.stringify(guidanceData.report) != '{}'){
        let grades = guidanceData.report;
        for(let key in grades){
          if(key == 'fhl'){
            barData.push({x:'肺活量',y:JSON.parse(grades[key]).grade})
          } 
          if(key == 'fwc') barData.push({x:'俯卧撑',y:JSON.parse(grades[key]).grade})
          if(key == 'fys') barData.push({x:'反应时',y:JSON.parse(grades[key]).grade})
          if(key == 'sgtz') barData.push({x:'身高体重',y:JSON.parse(grades[key]).grade})
          if(key == 'tjcs') barData.push({x:'台阶测试',y:JSON.parse(grades[key]).grade})
          if(key == 'wdx') barData.push({x:'稳定性',y:JSON.parse(grades[key]).grade})
          if(key == 'wl') barData.push({x:'握力',y:JSON.parse(grades[key]).grade})
          if(key == 'ztgd') barData.push({x:'纵跳',y:JSON.parse(grades[key]).grade})
          if(key == 'zwtqq') barData.push({x:'坐位体前屈',y:JSON.parse(grades[key]).grade})
          if(key == 'ywqz') barData.push({x:'仰卧起坐',y:JSON.parse(grades[key]).grade})
        }
        guidanceData.sportFrequency.forEach((ele,i) => {
          ele.activeType == '全身力量' && (guidanceData.sportFrequency[i].icon = qsll)
          ele.activeType == '有氧运动' && (guidanceData.sportFrequency[i].icon = yyyd)
          ele.activeType == '肌肉功能锻炼' && (guidanceData.sportFrequency[i].icon = jrgndl)
          ele.activeType == '平衡练习' && (guidanceData.sportFrequency[i].icon = phlx)
          ele.activeType == '平衡训练' && (guidanceData.sportFrequency[i].icon = phxl)
          ele.activeType == '拳操练习' && (guidanceData.sportFrequency[i].icon = qclx)
          ele.activeType == '柔韧练习' && (guidanceData.sportFrequency[i].icon = rrlx)
          ele.activeType == '柔韧训练' && (guidanceData.sportFrequency[i].icon = rrxl)
          ele.activeType == '上肢力量' && (guidanceData.sportFrequency[i].icon = szll)
          ele.activeType == '速度练习' && (guidanceData.sportFrequency[i].icon = sdlx)
          ele.activeType == '下肢力量' && (guidanceData.sportFrequency[i].icon = xzll)
          ele.activeType == '休闲活动' && (guidanceData.sportFrequency[i].icon = xxhd)
        })
        barData.forEach(ele => {
          radarData.push({
            name: '测试得分',
            label: ele.x,
            value: ele.y,
          })
        })
      }

      return (
        <div className={styles.page}>
          <div className={styles.container}>
            {/* 头 */}
            {
              guidanceData.report &&
              <div className={styles.header}>
                <div>
                  <img className={styles.logo_print} style={{ width: 128 }} src={logo} />
                  <h2>科学指导建议</h2>
                </div>
                <div className={styles.header_table_p}>
                  <table className={styles.header_table}>
                    <tbody>
                      <tr>
                        <td>姓名：{user.name || '--'}</td>
                        <td>性别：{user.sex == 1 ? '男' : user.sex == 2 ? '女' :'--'}</td>
                        <td>出生日期：{user.birthDay || '--'}</td>
                        <td>手机号：{user.phone || '--'}</td>
                      </tr>
                      <tr>
                        <td>组别：{user.groupName || '--'}</td>
                        <td>总分：{guidanceData.report.totalGrade || '--'}</td>
                        <td colSpan="2">工作单位：{guidanceData.report.workunit || '--'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            }

            {/* charts */}
            <div className={styles.charts}>
              <div className={styles.chartsItem}>
                <Bar height={260} data={barData} />
                <div className={styles.chartsTitle}>基础评测图</div>
              </div>
              <div className={styles.chartsItem}>
                <Radar height={260} data={radarData} colors={['#FF343E']}/>
                <div className={styles.chartsTitle}>基础评测图</div>
              </div>
            </div>

            {/* 营养建议 */}
            <div style={{margin:'28px 0 10px 0'}}><b>营养建议</b></div>
            <div className={styles.foodAdvice}>
              <table>
                <thead>
                  <tr>
                    <th>营养建议</th>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <b>{scienceAdvice}</b>
                      </p>
                      <div>1. 在保证蛋白质供给的基础上适当增加优质蛋白的供应,如禽畜肉、鱼、奶、豆类等；碳水化合物应占全日总能量的55%-65%，主食不宜过精过细。适当摄入脂肪，但要限制摄入动物脂肪，植物脂肪也不应太多，脂肪总量以不超过全日总能量的25%为宜。胆固醇的摄入量不超过300mg。</div>
                      <div>2. 适量多摄入富含维生素C的食物，如橘子、卷心菜、土豆、红薯以及绿色、黄色蔬菜和富含维生素B2的食物，如蛋奶类、鱼虾类、绿叶蔬菜等，以提高运动能力，延缓运动疲劳的发生和增强肌肉收缩力。</div>
                      <div>3. 适量多摄入一些含蛋氨酸丰富的食物，如牛奶、奶酪、牛、羊肉等，促进肝内脂肪的代谢。</div>
                      <div>4. 适量多摄入一些瘦肉、鱼类、绿叶菜等含铁丰富的食物，防止发生缺铁性贫血。</div>
                      <div>5. 注意水的补充，尽量不要补充纯净水和高浓度的果汁，最好补充口感好的运动饮料；不要等到口渴时再补充，要采取少量多次的办法在运动前、中、后补充。</div>
                      <div>6. 控制油脂每天25g左右，减少动物油，限制饱和脂肪酸和胆固醇的摄入，盐最好平均每天在6g以下。</div>
                    </td>
                  </tr>
                </thead>
              </table>
            </div>

            {/* 运动建议 */}
            <div style={{margin:'28px 0 10px 0'}}><b>运动建议</b></div>
            {
              (guidanceData.sportFrequency && guidanceData.sportFrequency.length) ?
              <div className={styles.sportAdvice}>
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '10%' }}>项目</th>
                      {
                        guidanceData.sportFrequency && guidanceData.sportFrequency.map((ele,index) => (
                          <th style={{ width: '30%' }} key={index} >{ele.activeType}</th>
                        ))
                      }
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>项目名称</td>
                      {
                        guidanceData.sportFrequency && guidanceData.sportFrequency.map((ele,index) => (
                          <td key={index}><img src={ele.icon} />{ele.exerciseName}</td>
                        ))
                      }
                    </tr>
                    <tr>
                      <td>锻炼要点</td>
                      {
                        guidanceData.sportFrequency && guidanceData.sportFrequency.map((ele,index) => (
                          <td key={index}>
                            <div>{ele.exercisePoint}</div>
                            <div><span>注意事项：</span>{ele.exerciseNotice}</div>
                          </td>
                        ))
                      }
                    </tr>
                    <tr>
                      <td>锻炼强度</td>
                      {
                        guidanceData.sportFrequency && guidanceData.sportFrequency.map((ele,index) => (
                          <td key={index}>{ele.intensity}</td>
                        ))
                      }
                    </tr>
                    <tr>
                      <td>锻炼频率时间</td>
                      {
                        guidanceData.sportFrequency && guidanceData.sportFrequency.map((ele,index) => (
                          <td key={index}>
                            <div>{`每周${ele.frequencyL}-${ele.frequencyH}次`}</div>
                            {/* <div>{`每次${ele.timeL}-${ele.timeH}分钟`}</div> */}
                            <div>{ele.suggestTimes}</div>
                            <div>
                              <span>注意：</span>{ele.notice}</div>
                          </td>
                        ))
                      }
                    </tr>
                  </tbody>
                </table>
              </div>:
              <div></div>
            }
            
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

export default chufang;
