import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import {
  Row,
  Col,
  Button,
  Radio,
  message,
  Spin,
  Icon,
} from 'antd';
import {Bar} from '@/components/Charts';
import Area from '@/components/Charts/Area';
import Pie from '@/components/Charts/Pie';
import Pie1 from '@/components/Charts/Pie1';
import myStyles from '@/less/home.less';
import { getnyr } from '@/utils/utils';
import { rc , fileUrl} from '@/global';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const colorList = [
  '#F95C58',
  '#14C0B1',
  '#5F76DE',
  '#3F99EE',
  '#FF9C48',
  '#FFB848',
  '#487CFF',
  '#FF6396',
  '#8348AD',
  '#FF6D37',
  '#E6437B',
  '#FFB541',
  '#5E6FEF',
  '#00C3D4',
  '#FF3D66',
  '#82D13C',
]

message.config({ top: 100 });

@connect(({ home, loading }) => ({
  home,
  loading: loading.models.home,
}))
class home extends PureComponent {
  state = {
    top:{
      toDayRmsMap: {},
      toDayUpGymMap: {},
      toDayUpMatchEventMap: {data:{}},
      toDayUpTCUserMap: {},
      toDayUpUserMap: {},
    },

    ticeData:[],
    expertRanking:[],
    resourceCount:[],// 体育场馆
    repairsList:[],
    clubRanking:[]
  }

  componentDidMount() {

    // top
    this.props.dispatch({
      type: 'home/analysis_top',
      callback:(res) => {
        console.log(res.data)
        this.setState({
          top:res.data
        })
      }
    });

    // 体测
    this.props.dispatch({
      type: 'home/analysis_tice',
      callback:(res) => {
        if(res){
          this.setState({
            ticeData:res.data.avgLevelMap
          })
        }
      }
    });

    // 体育场馆
    this.props.dispatch({
      type: 'home/analysis_gym',
      callback:(res) => {
        var data = []
        for(let propName in res.data){
          var obj={}
          obj.item = propName
          obj.count = res.data[propName]
          if(propName != 'sumGym'){
            data.push(obj)
          }
        }
        this.setState({
          resourceCount:data
        })
      }
    });

    // 指导排行
    this.props.dispatch({
      type: 'home/analysis_guide',
      payload:'toMonth',
      callback:(res) => {
        var expertRanking = res.data.list
        this.setState({
          expertRanking:expertRanking
        })
      }
    });

    // rms
    this.props.dispatch({
      type: 'home/analysis_rms',
      callback:(res) => {
        var arr = res.data.list;
        var data = []
        arr.forEach(ele => {
          data.push({
            key:ele.dateTime,
            value:Number(ele.orderCount),
          })
        });
        this.setState({
          repairsList:data.reverse()
        })
      }
    });

    // 社团
    this.props.dispatch({
      type: 'home/analysis_club',
      callback:(res) => {
        this.setState({
          clubRanking:res.data.list
        })
      }
    });
  }

  chooseWeek = e => {
    var key = e.target.value
    this.props.dispatch({
      type: 'home/analysis_guide',
      payload:key==1?'toDay':key==2?'toWeek':key==3?'toMonth':'toDay',
      callback:(res) => {
        var expertRanking = res.data.list
        this.setState({
          expertRanking:expertRanking
        })
      }
    });
  }

  render() {
    const { top, ticeData , expertRanking , resourceCount , repairsList , clubRanking } = this.state;
    return (
      <div className={myStyles.container}>
        {/* line-1 */}
        <div className={myStyles.line_1}>
          <div className={myStyles.line_1_1}>
            <h3>今日体测用户</h3>
            <span>数量 :<span>{top.toDayUpTCUserMap.userCountToday}</span></span>
            <div>累计当前体测用户 : <span>{top.toDayUpTCUserMap.userCount}</span></div>
            <b><Link style={{color:'#fff'}} to={`${rc}/tice/one/data`}>详情 <Icon type="right" /></Link></b>
          </div>
          <div className={myStyles.line_1_2}>
            <h3>今日新增用户</h3>
            <span>数量 :<span>{top.toDayUpUserMap.toDayUpUserCount}</span></span>
            <div>累计当前用户数量 : <span>{top.toDayUpUserMap.sumUserCount}</span></div>
            <b><Link style={{color:'#fff'}} to={`${rc}/guide/wxUser/data`}>详情 <Icon type="right" /></Link></b>
          </div>
          <div className={myStyles.line_1_3}>
            <h3>今日新增社团</h3>
            <span>数量 :<span>{top.toDayUpMatchEventMap.data.toDayCount}</span></span>
            <div>累计当前社团数量 : <span>{top.toDayUpMatchEventMap.data.sumCount}</span></div>
            <b><Link style={{color:'#fff'}} to={`${rc}/club/communityManage/list`}>详情 <Icon type="right" /></Link></b>
          </div>
          <div className={myStyles.line_1_4}>
            <h3>今日新增场馆</h3>
            <span>数量 :<span>{top.toDayUpGymMap.toDayCount}</span></span>
            <div>累计当前场馆数量 : <span>{top.toDayUpGymMap.sumCount}</span></div>
            <b><Link style={{color:'#fff'}} to={`${rc}/resource/resource/list`}>详情 <Icon type="right" /></Link></b>
          </div>
          <div className={myStyles.line_1_5}>
            <h3>今日设施报修</h3>
            <span>数量 :<span>{top.toDayRmsMap.toDayCount}</span></span>
            <div>累计报修设施 : <span>{top.toDayRmsMap.sumCount}</span></div>
            <b><Link style={{color:'#fff'}} to={`${rc}/repairs/orderList/list`}>详情 <Icon type="right" /></Link></b>
          </div>
        </div>
      
        {/* line-2 */}
        <div className={myStyles.line_2}>
          <div className={myStyles.line_2_1}>
            <div style={{marginBottom:20}} className={myStyles.cardTitle}>
              <div className={myStyles.cardTitleLeft}>体测分析</div>
              <div className={myStyles.cardTitleRight}>综合分数/年龄段</div>
            </div>
            <div>
              <Bar height={260} data={ticeData} />
            </div>
          </div>
          <div className={myStyles.line_2_2}>
            <div className={myStyles.cardTitle}>
              <div className={myStyles.cardTitleLeft}>体育资源</div>
            </div>
            <div>
              <Pie1 
                data={resourceCount}
                total={{name:'场馆总数',value:top.toDayUpGymMap.sumCount || 0}}
                colorList={colorList}
              />
            </div>
          </div>
          <div className={myStyles.line_2_3}>
            <div className={myStyles.cardTitle}>
              <div className={myStyles.cardTitleLeft}>专家指导</div>
              <div style={{top:-4}} className={myStyles.cardTitleRight}>
                <RadioGroup onChange={this.chooseWeek} defaultValue="3" size="small" buttonStyle="solid">
                  <RadioButton value="1">日</RadioButton>
                  <RadioButton value="2">周</RadioButton>
                  <RadioButton value="3">月</RadioButton>
                </RadioGroup>
              </div>
            </div>
            <ul>
                <li className={myStyles.title}>
                  <div>排名</div>
                  <div>专家姓名</div>
                  <div>指导人数</div>
                </li>
                {
                  expertRanking && expertRanking.map((ele,index) => (
                    <li key={index} className={myStyles.item}>
                      <div><span style={index==0?{background:'#F61610'}:index==1?{background:'#FF9946'}:index==2?{background:'#FFC970'}:{}}>{index + 1}</span></div>
                      <div>{ele.name}</div>
                      <div>{ele.count}</div>
                    </li>
                  ))
                }
              </ul>
          </div>
        </div>
      
        {/* line-3 */}
        <div className={myStyles.line_3}>
          <div className={myStyles.line_3_1}>
            <div className={myStyles.cardTitle}>
              <div className={myStyles.cardTitleLeft}>体育设施维修</div>
              <div className={myStyles.cardTitleRight}>维修数/时间</div>
            </div>
            <div className={myStyles.line_3_1_content}>
              <Area
                line
                color="#ACC8F8"
                borderColor='#1868EB'
                height={210}
                data={repairsList}
                alias='今日维修数'
                scaleType='pow'
              />
            </div>
          </div>
          <div className={myStyles.line_3_2}>
            <div className={myStyles.cardTitle}>
              <div className={myStyles.cardTitleLeft}>社团赛事/活动</div>
              <div className={myStyles.line_3_2_content}>
              {
                clubRanking && clubRanking.map((ele,index) => (
                  <div key={index} className={myStyles.line_3_2_content_item}>
                    <div className={myStyles.line_3_2_content_line_1}><b>TOP 0{index + 1}</b></div>
                    <div className={myStyles.line_3_2_content_line_2}>
                      {/* <Pie total={100 + '%'} color='#3B90ED' percent={100} height={100} /> */}
                      <img style={{width:80,height:80}} src={fileUrl + ele.matchLogo}/>
                    </div>
                    <div className={myStyles.line_3_2_content_line_3}>{ele.name}</div>
                    <div className={myStyles.line_3_2_content_line_4}>
                      <div>社团人数 :{ele.memberCount}</div>
                      <div>发起赛事 :{ele.eventCount}</div>
                      <div>发起活动 :{ele.activeCount}</div>
                      {/* <div>发布新闻 :{ele.newsCount}</div> */}
                    </div>
                  </div>
                ))
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default home;