import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon,Radio, } from 'antd';
import styles from './Analysis.less';
import bg from './images/bg.jpg'
import header from './images/header.png';
import charts from './images/charts.png';
import a1 from './images/1.png';
import a2 from './images/2.png';
import bigman from './images/bigman.png';
import smallman from './images/smallman.png';
import down from './images/down.png';
import up from './images/up.png';

import Duidie from '../cptCharts/Duidie'
import Zhexian from '../cptCharts/Zhexian'
import Yibiao from '../cptCharts/Yibiao'
import Huan from '../cptCharts/Huan'
import Leida from '../cptCharts/Leida'

import { Map , Markers,InfoWindow } from 'react-amap';
import { mapKey,fileUrl } from '@/global'
import { connect } from 'dva';
const defaultImg = 'http://webmap0.bdimg.com/client/services/thumbnails?width=132&height=104&align=center,center&quality=100&src=http%3A%2F%2Fhiphotos.baidu.com%2Fspace%2Fpic%2Fitem%2F4afbfbedab64034ff0749211a7c379310a551d6f.jpg'

@connect(({ analysis, loading }) => ({
  analysis,
  loading: loading.models.analysis,
}))
class UserLayout extends React.PureComponent {
  constructor(){
    super();
    this.state = {
      organizeId:63,
      markers: [],
      society:{},
      center:{longitude:122.487084, latitude:37.16599},
      userInfo:{wxUserSum:'0'},//用户大数据模块
      competitionAndSocietyMap:{},
      sexAgeRatioMap:{},
      sportsData:{},
      sportsTime:[],
      sportResourcesInfo:{},
      venueInfoMap:{},
      tcUserInfo:{},
      tcPersonClassMap:{},
      tcScoreRatioMap:{},
      matchInfo:{joinCompetitionAndSocietyMap:{}},
      joinCompetitionAndSocietyMap:{},
      joinCompetitionSexAndAgeRatioMap:{},
      matchRatioMap:{},
      newCompetitions:[],
      personClassMap:{},
      pointInfo:{}
    };
    // marker事件
    this.markerEvents = {
      click: (e) => {
        if(!e){
          this.closeWindow()
          return;
        }
        console.log(e)
        this.setState({
          InfoWindowPosition:e.target.Pg.extData.position,
          // center:e.target.Pg.extData.position,
          InfoWindowVisible:true,
          pointInfo:e.target.Pg.extData
        })
      },
    }
  }
  
  componentDidMount() {
    const { dispatch } = this.props;
    //获取体育设施数据标注
    dispatch({
      type: 'analysis/list',
      payload: {id:this.state.organizeId},
      callback:(res) => {
        let list = [];
        for(let i=0;i<res.data.length;i++){
          if(res.data[i].longitude&&res.data[i].latitude){
            let data = res.data
            list.push({
              position:{longitude: parseFloat(data[i].longitude), latitude: parseFloat(data[i].latitude)},
              title:data[i].name,
              img_urls:data[i].img_urls,
              longitude:data[i].longitude,
              latitude:data[i].latitude,
            })
          }
        }
        this.setState({markers:list})
      },
    });
    //获取用户图表
    dispatch({
      type:'analysis/queryUserInfoModel',
      callback:(res)=>{
        this.setState({
          userInfo:res.data,
          competitionAndSocietyMap:res.data.competitionAndSocietyMap.data,
          sexAgeRatioMap:res.data.sexAgeRatioMap
        })
      }
    })
    //获取运动数据图表
    dispatch({
      type:'analysis/querySportInfoModel',
      callback:(res)=>{
        this.setState({
          sportsData:res.data,
          sportsTime:res.data.sportDateMap
        })
      }
    })
    //获取体测数据图表
    dispatch({
      type:'analysis/queryTcUserInfoModel',
      callback:(res)=>{
        this.setState({
          tcUserInfo:res.data,
          tcPersonClassMap:res.data.tcPersonClassMap,
          tcScoreRatioMap:res.data.tcScoreRatioMap
        })
      }
    })

    //获取赛事社团数据图表
    dispatch({
      type:'analysis/queryMatchInfoModel',
      callback:(res)=>{
        console.log("1111:",res)
        this.setState({
          matchInfo:res.data,
          joinCompetitionAndSocietyMap:res.data.joinCompetitionAndSocietyMap,
          joinCompetitionSexAndAgeRatioMap:res.data.joinCompetitionSexAndAgeRatioMap,
          matchRatioMap:res.data.matchRatioMap,
          newCompetitions:res.data.newCompetitions,
          personClassMap:res.data.personClassMap
        })
      }
    })
    //获取体测点数据图表
    dispatch({
      type:'analysis/queryTcBodyPointInfoModel',
      callback:(res)=>{
        this.setState({
          venueInfoMap:res
        })
      }
    })
    //获取体测资源数据图表
    dispatch({
      type:'analysis/querySportResourcesInfoModel',
      callback:(res)=>{
        this.setState({
          sportResourcesInfo:res.data
        })
      }
    })
  }
  prefixInteger(num,length){
    return (Array(length).join('0') + num).slice(-length);
  }
  percentage(a,sum,index){
    if(index){
      if(index==1){
        return (Math.round(a/sum*10000)/100.00)
      }else{
        return (0-(Math.round(a/sum*10000)/100.00*0.63+25))
      }
      
    }else{
      var result = Math.round(a/sum*10000)/100.00
      return (isNaN(result)?'25%':result+"%")
    }
    
  }
  // 关闭信息窗体
  closeWindow(){
    this.setState({
      InfoWindowVisible:false
    })
  }

  render() {
    const { } = this.props;
    const {
      userInfo,
      competitionAndSocietyMap,
      sexAgeRatioMap,
      sportsData,
      sportsTime,
      sportResourcesInfo,
      venueInfoMap,
      tcUserInfo,
      tcPersonClassMap,
      tcScoreRatioMap,
      matchInfo,
      joinCompetitionAndSocietyMap,
      newCompetitions,
      joinCompetitionSexAndAgeRatioMap,
      matchRatioMap,
      personClassMap
    } =this.state

    var sumMiddle = this.state.tcPersonClassMap.sumMiddle
    var sumOld = this.state.tcPersonClassMap.sumOld
    var sumYoung=this.state.tcPersonClassMap.sumYoung
    var sumYouth=this.state.tcPersonClassMap.sumYouth
    var sum=sumMiddle+sumOld+sumYoung+sumYouth
    var sumMiddlePercentage=this.percentage(sumMiddle,sum)
    var sumOldPercentage=this.percentage(sumOld,sum)
    var sumYoungPercentage=this.percentage(sumYoung,sum)
    var sumYouthPercentage=this.percentage(sumYouth,sum)

    var sumJoinMan = this.state.joinCompetitionSexAndAgeRatioMap.sumJoinCompetitionAndSocietyMan
    var sumJoinWoman = this.state.joinCompetitionSexAndAgeRatioMap.sumJoinCompetitionAndSocietyWoman
    var sum1 = sumJoinMan + sumJoinWoman
    var sumJoinManPercentage = this.percentage(sumJoinMan,sum1)
    var sumJoinWomanPercentage = this.percentage(sumJoinWoman,sum1)

    var xiehui = {}
    var julebu = {}
    var tuantihui = {}
    var obj1 = this.state.matchRatioMap
    for(let key in obj1){
      if(!obj1["1"]){
        xiehui.value = 0
      }else{
        xiehui.value = obj1["1"]
      }
      if(!obj1["2"]){
        julebu.value = 0
      }else{
        julebu.value = obj1["2"]
      }
      if(!obj1["3"]){
        tuantihui.value = 0
      }else{
        tuantihui.value = obj1["3"]
      }
    }
    var sum2 = xiehui.value+julebu.value+tuantihui.value
    var xiehuiPercentage = this.percentage(xiehui.value,sum2,1)
    var julebuPercentage = this.percentage(julebu.value,sum2,1)
    var tuantihuiPercentage = this.percentage(tuantihui.value,sum2,1)

    var youthPeople = {}
    var youngPeople = {}
    var middlePeople = {}
    var oldPeople = {}
    var obj2 = this.state.personClassMap

    for(let key in obj2){
      if(!obj2["1"]){
        youthPeople.value = 0
      }else{
        youthPeople.value = obj2["1"]
      }
      if(!obj2["2"]){
        youngPeople.value = 0
      }else{
        youngPeople.value = obj2["2"]
      }
      if(!obj2["3"]){
        middlePeople.value = 0
      }else{
        middlePeople.value = obj2["3"]
      }
      if(!obj2["4"]){
        oldPeople.value = 0
      }else{
        oldPeople.value = obj2["4"]
      }
    }

    var sum3 = youthPeople.value + youngPeople.value + middlePeople.value + oldPeople.value
    var youthPeoplePercentage = this.percentage(youthPeople.value,sum3)
    var youngPeoplePercentage = this.percentage(youngPeople.value,sum3)
    var middlePeoplePercentage = this.percentage(middlePeople.value,sum3)
    var oldPeoplePercentage = this.percentage(oldPeople.value,sum3)

    var obj3 = this.state.tcScoreRatioMap
    var excellent = {}
    var good = {} 
    var qualified = {}
    var failed = {}

    for(let key in obj3){
      if(!obj3["4"]){
        excellent.value = 0
      }else{
        excellent.value = obj3["4"]
      }
      if(!obj3["3"]){
        good.value = 0
      }else{
        good.value = obj3["3"]
      }
      if(!obj3["2"]){
        qualified.value = 0
      }else{
        qualified.value = obj3["2"]
      }
      if(!obj3["1"]){
        failed.value = 0
      }else{
        failed.value = obj3["1"]
      }
    }

    var sum4 = excellent.value + good.value + qualified.value + failed.value
    var excellentPercentage = this.percentage(excellent.value,sum4,2)
    var goodPercentage = this.percentage(good.value,sum4,2)
    var qualifiedPercentage = this.percentage(qualified.value,sum4,2)
    var failedPercentage = this.percentage(failed.value,sum4,2)

    return (
      <div style={{background:`url(${bg})`,backgroundPosition:'0 -200px',backgroundRepeat:'no-repeat',height:1200,backgroundColor:'#0C122C'}} className={styles.container}>
        {/* header */}
        <div className={styles.header}>
          <img src={header}/>
        </div>

        {/* body */}
        <div className={styles.body}>
          <div className={styles.firstFloor}>
            {/* 用户情况 */}
            <div className={styles.card + ' ' + styles.card1}>
              <div className={styles.cardTitleOut}>
                <div className={styles.cardTitle}>用户情况<div></div><div></div><div></div><div></div></div>
              </div>
              {/* ************ */}
              <div className={styles.cardBody}>
                <div className={styles.userNum}>当前平台用户数：<span>{userInfo.wxUserSum}</span></div>
                <div className={styles.totalUser}>
                  {
                    this.prefixInteger(userInfo.wxUserSum,8).split('').map(ele => (<div>{ele}</div>))
                  }
                </div>
                <div className={styles.threeNum}>
                  <div>
                    <div style={{color:'#49C4E5'}} >{userInfo.recentlyUserSum}</div>
                    <div>近期活跃数</div> 
                  </div>
                  <b></b>
                  <div>
                    <div style={{color:'#DCD520'}}>{competitionAndSocietyMap.sumRegistration}</div>
                    <div>参与赛事活动人数</div>
                  </div>
                  <b></b>
                  <div>
                    <div style={{color:'#AD5938'}}>{competitionAndSocietyMap.sumSociety}</div>
                    <div>社团总人数</div>
                  </div>
                </div>
                <div className={styles.sexTitle}>
                  <div>男女不同阶段性别比例</div>
                  <div className={styles.sexTitle_right}>
                    <div>男</div>
                    <div className={styles.sexTitle_right_man}></div>
                    <div>女</div>
                    <div className={styles.sexTitle_right_woman}></div>
                  </div>
                </div>
                <div className={styles.duidie}>
                  <Duidie sexAgeRatioMap={sexAgeRatioMap}></Duidie>
                </div>
              </div>
            </div>
            
            {/* 运动数据 */}
            <div className={styles.card + ' ' + styles.card2}>
              <div className={styles.cardTitleOut}>
                <div className={styles.cardTitle}>运动数据<div></div><div></div><div></div><div></div></div>
              </div>
              {/* ************ */}
              <div className={styles.cardBody}>
                  <div className={styles.tongji_p}>
                    <div style={{borderLeft:'5px solid #3DD8FE'}} className={styles.tongji}>
                      <div className={styles.tongji_title}>近七日平台运动总步数</div>
                      <div className={styles.tongji_value}><span>{sportsData.sportStepSum}</span><span> 步</span></div>
                    </div>
                    <div style={{borderLeft:'5px solid #FEA533'}} className={styles.tongji}>
                      <div className={styles.tongji_title}>近七日平台运动总里程数</div>
                      <div className={styles.tongji_value}><span>{sportsData.sportStepSumkm}</span><span> 公里</span></div>
                    </div>
                    <div style={{borderLeft:'5px solid #FF4543'}} className={styles.tongji}>
                      <div className={styles.tongji_title}>累计平台参与科学健身人数</div>
                      <div className={styles.tongji_value}><span>{sportsData.sportTargetSum}</span><span> 人</span></div>
                    </div>
                  </div>
                  <div className={styles.charts_p}>
                    <div className={styles.charts_left}>
                      <div className={styles.charts_title}>运动时间(小时/月)</div>
                      <div>
                        <Zhexian sportsTime={sportsTime}></Zhexian>
                      </div>
                    </div>
                    <div className={styles.charts_right}>
                      <div className={styles.charts_title}>消耗
                      </div>
                      <div className={styles.charts4}>
                        <div className={styles.charts4_i}>
                          <div className={styles.charts4_left}><img src={charts}/></div>
                          <div className={styles.charts4_right}>
                            <div className={styles.charts4_right_top}>总消耗</div>
                            <div style={{color:'#ECBE1E'}} className={styles.charts4_right_bottom}>{sportsData.sportSumConsumeCal}<span> 大卡</span></div>
                          </div>
                        </div>
                        <div className={styles.charts4_i}>
                          <div className={styles.charts4_left}><img src={charts}/></div>
                          <div className={styles.charts4_right}>
                            <div className={styles.charts4_right_top}>总时间</div>
                            <div style={{color:'#E99731'}} className={styles.charts4_right_bottom}>{sportsData.sportSumDurationTime}<span> 小时</span></div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.charts4}>
                        <div className={styles.charts4_i}>
                          <div className={styles.charts4_left}><img src={charts}/></div>
                          <div className={styles.charts4_right}>
                            <div className={styles.charts4_right_top}>平均消耗</div>
                            <div style={{color:'#ED5132'}} className={styles.charts4_right_bottom}>{sportsData.sportAvgConsumCal}<span> 大卡</span></div>
                          </div>
                        </div>
                        <div className={styles.charts4_i}>
                          <div className={styles.charts4_left}><img src={charts}/></div>
                          <div className={styles.charts4_right}>
                            <div className={styles.charts4_right_top}>平均时间</div>
                            <div style={{color:'#64A633'}} className={styles.charts4_right_bottom}>{sportsData.sportAvgSportTime}<span> 小时</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            {/* 体测数据 */}
            <div className={styles.card + ' ' + styles.card3}>
              <div className={styles.cardTitleOut}>
                <div className={styles.cardTitle}>体测数据<div></div><div></div><div></div><div></div></div>
              </div>
              {/* ************ */}
              <div className={styles.cardBody}>
                  <div className={styles.tice_top}>
                    <div className={styles.tice_top_left}>
                      <img src={bigman}/>
                    </div>
                    <div className={styles.tice_top_cutline}></div>
                    <div className={styles.tice_top_right}>
                      <div className={styles.tcdata_top}>
                        <div className={styles.tcdata_top_left}><img src={smallman}/></div>
                        <div className={styles.tcdata_top_right}>
                          <div className={styles.tcdata_t_r_t}>累计体测人数</div>
                          <div className={styles.tcdata_t_r_b}>{tcUserInfo.tcSumUser}</div>
                        </div>
                      </div>
                      <div className={styles.tcdata_center}>
                        <div>参与体测的合格率</div>
                        <div className={styles.tice_good}>
                          <div className={styles.tice_good_1}>
                            <div style={{width:`${tcUserInfo.tcGrade+'%'}`}} className={styles.tice_good_2}></div>
                          </div>
                          <div className={styles.tice_good_percent}>{(tcUserInfo.tcGrade||0)+'%'}</div>
                        </div>
                      </div>
                      <div className={styles.tcdata_bottom}>
                        <div>参与体测的年龄比例</div>
                        <div className={styles.tcdata_age}>
                          {
                            sumYouthPercentage == '0%' ?(<div></div>):(<div style={{width:`${sumYouthPercentage}`}} className={styles.tcdata_age_item}>
                            <div style={{background:'#0495E3'}} className={styles.tcdata_age_item_top}>{sumYouthPercentage}</div>
                            <div className={styles.tcdata_age_item_bottom}>青少年</div></div>)
                          }
                          {
                            sumYoungPercentage =='0%'?(<div></div>):(<div style={{width:`${sumYoungPercentage}`}} className={styles.tcdata_age_item}>
                            <div style={{background:'#6DB535'}} className={styles.tcdata_age_item_top}>{sumYoungPercentage}</div>
                            <div className={styles.tcdata_age_item_bottom}>青年人</div></div>)
                          }
                          {
                            sumMiddlePercentage =='0%'?(<div></div>):(<div style={{width:`${sumMiddlePercentage}`}} className={styles.tcdata_age_item}>
                            <div style={{background:'#C8863D'}} className={styles.tcdata_age_item_top}>{sumMiddlePercentage}</div>
                            <div className={styles.tcdata_age_item_bottom}>中年人</div></div>)
                          }
                          {
                            sumOldPercentage == '0%'?(<div></div>):(<div style={{width:`${sumOldPercentage}`}} className={styles.tcdata_age_item}>
                            <div style={{background:'#E25169'}} className={styles.tcdata_age_item_top}>{sumOldPercentage}</div>
                            <div className={styles.tcdata_age_item_bottom}>老年人</div></div>)
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.tice_bottom}>
                    <div>体测成绩比例</div>
                    <div className={styles.waterContainer}>
                      <div className={styles.waterItem}>
                        <div style={{top:excellentPercentage}} className={styles.waterBefore}></div>
                        <div className={styles.water + " " + styles.water1}></div>
                        <div style={{top:excellentPercentage}} className={styles.waterAfter}></div>
                        <div className={styles.level}>优秀</div>
                      </div>
                      <div className={styles.waterItem}>
                        <div style={{top:goodPercentage}} className={styles.waterBefore}></div>
                        <div className={styles.water + " " + styles.water2}></div>
                        <div style={{top:goodPercentage}} className={styles.waterAfter}></div>
                        <div className={styles.level}>良好</div>
                      </div>
                      <div className={styles.waterItem}>
                        <div style={{top:qualifiedPercentage}} className={styles.waterBefore}></div>
                        <div className={styles.water + " " + styles.water3}></div>
                        <div style={{top:qualifiedPercentage}} className={styles.waterAfter}></div>
                        <div className={styles.level}>合格</div>
                      </div>
                      <div className={styles.waterItem}>
                        <div style={{top:failedPercentage}} className={styles.waterBefore}></div>
                        <div className={styles.water + " " + styles.water4}></div>
                        <div style={{top:failedPercentage}} className={styles.waterAfter}></div>
                        <div className={styles.level}>不合格</div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
                  
          <div className={styles.secondFloor}>
            <div className={styles.s1}>
              {/* 赛事活动数据 */}
              <div className={styles.card + ' ' + styles.card_small + ' ' + styles.card4}>
                <div className={styles.cardTitleOut}>
                  <div className={styles.cardTitle}>赛事活动数据<div></div><div></div><div></div><div></div></div>
                </div>
                {/* ************ */}
                <div className={styles.cardBody}>
                  <div className={styles.game}>
                    <div className={styles.game_left}>
                      <img src={a1}/>
                      <p>当前累计总活动数</p>
                      <div>{matchInfo.sumCompetition}<span> 个</span></div>
                    </div>
                    <div className={styles.game_left}>
                      <img src={a2}/>
                      <p>参与赛事活动人数</p>
                      <div>{joinCompetitionAndSocietyMap.sumRegistration}<span> 人</span></div>
                    </div>
                    <div className={styles.game_right}>
                      <div className={styles.tcdata_bottom}>
                        <div style={{fontSize:14}}>参与活动的年龄比例</div>
                        <div className={styles.tcdata_age}>
                          {
                            youthPeoplePercentage == '0%' ? (<div></div>):(<div style={{width:`${youthPeoplePercentage}`}} className={styles.tcdata_age_item}>
                            <div style={{background:'#0495E3'}} className={styles.tcdata_age_item_top}>{youthPeoplePercentage}</div>
                            <div className={styles.tcdata_age_item_bottom}>青少年</div></div>)
                          
                          }

                          {
                            youngPeoplePercentage == '0%' ? (<div></div>):(<div style={{width:`${youngPeoplePercentage}`}} className={styles.tcdata_age_item}>
                            <div style={{background:'#6DB535'}} className={styles.tcdata_age_item_top}>{youngPeoplePercentage}</div>
                            <div className={styles.tcdata_age_item_bottom}>青年人</div></div>)
                          }
                          {
                            middlePeoplePercentage == '0%' ? (<div></div>):(<div style={{width:`${middlePeoplePercentage}`}} className={styles.tcdata_age_item}>
                            <div style={{background:'#C8863D'}} className={styles.tcdata_age_item_top}>{middlePeoplePercentage}</div>
                            <div className={styles.tcdata_age_item_bottom}>中年人</div></div>)
                          }
                          {
                            oldPeoplePercentage == '0%' ? (<div></div>):(<div style={{width:`${oldPeoplePercentage}`}} className={styles.tcdata_age_item}>
                            <div style={{background:'#E25169'}} className={styles.tcdata_age_item_top}>{oldPeoplePercentage}</div>
                            <div className={styles.tcdata_age_item_bottom}>老年人</div></div>)
                          } 
                        </div>
                      </div>
                      <div className={styles.game_sex}>
                        <div style={{fontSize:14}}>参与活动男女比例</div>
                        <div className={styles.game_sex_i}>
                          <div className={styles.game_sex1}>男</div>
                          <div className={styles.game_sex2}>
                            <div style={{width:`${sumJoinManPercentage}`}} className={styles.game_sex2_man}></div>
                          </div>
                          <div className={styles.game_sex3}>{sumJoinManPercentage}</div>
                        </div>
                        <div className={styles.game_sex_i}>
                          <div className={styles.game_sex1}>女</div>
                          <div className={styles.game_sex2}>
                            <div style={{width:`${sumJoinWomanPercentage}`}} className={styles.game_sex2_woman}></div>
                          </div>
                          <div className={styles.game_sex3}>{sumJoinWomanPercentage}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.saishi}>
                    <div>最新赛事活动</div>
                    {
                      newCompetitions.map((ele,index)=>{
                        return(
                          <div className={styles.saishi_i}>
                            <div className={styles.saishi_left}>
                              <div className={styles.saishi_left1}>{index+1}</div>
                              <div className={styles.saishi_left2}>{ele.matchEventName}协会</div>
                              <div className={styles.saishi_left3}>{ele.competitionName}</div>
                            </div>
                            <div className={styles.saishi_right}><span>{ele.count}</span> 人已报名</div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
              {/* 社团数据 */}
              <div className={styles.card + ' ' + styles.card_small + ' ' + styles.card5}>
                <div className={styles.cardTitleOut}>
                  <div className={styles.cardTitle}>社团数据<div></div><div></div><div></div><div></div></div>
                </div>
                {/* ************ */}
                <div className={styles.cardBody}>
                  <div className={styles.club}>
                    <div className={styles.club_i}>
                      <div className={styles.club_i_top}>
                        <span>{matchInfo.sumMatchEvent}</span>
                        {/* <img src={down}/> */}
                        {/* <b>2.5%</b> */}
                      </div>
                      <div className={styles.club_i_bottom}>
                        <span>社团总数</span>
                      </div>
                    </div>
                    <div className={styles.club_i}>
                      <div className={styles.club_i_top}>
                        <span>{matchInfo.joinCompetitionAndSocietyMap.sumSociety}</span>
                        {/* <img src={down}/> */}
                        {/* <b>2.5%</b> */}
                      </div>
                      <div className={styles.club_i_bottom}>
                        <span>参与社团人数</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.yibiao}>
                    <div className={styles.yibiao_i}>
                      <Yibiao
                        percent={xiehuiPercentage}
                        value={xiehui.value}
                      ></Yibiao>
                      <div className={styles.yibiao_txt}>
                        <div className={styles.yibiao_txt1}>占比<span className={styles.yibiao_s1}> {`${xiehuiPercentage}`+"%"}</span></div>
                        <div className={styles.yibiao_txt2}>协会</div>
                      </div>
                    </div>
                    <div className={styles.yibiao_i}>
                      <Yibiao
                        color='#C2CC3C'
                        rgbColor='rgba(198,214,26, 0.2)'
                        percent={julebuPercentage}
                        value={julebu.value}
                      ></Yibiao>
                      <div className={styles.yibiao_txt}>
                        <div className={styles.yibiao_txt1}>占比<span className={styles.yibiao_s2}> {`${julebuPercentage}`+"%"}</span></div>
                        <div className={styles.yibiao_txt2}>俱乐部</div>
                      </div>
                    </div>
                    <div className={styles.yibiao_i}>
                      <Yibiao
                        color='#D56626'
                        rgbColor='rgba(213,102,38, 0.2)'
                        percent={tuantihuiPercentage}
                        value={tuantihui.value}
                      ></Yibiao>
                      <div className={styles.yibiao_txt}>
                        <div className={styles.yibiao_txt1}>占比<span className={styles.yibiao_s3}> {`${tuantihuiPercentage}`+"%"}</span></div>
                        <div className={styles.yibiao_txt2}>团体会</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.s2}>
              {/* 体育设施数据 */}
              <div className={styles.card + ' ' + styles.card_big + ' ' + styles.card6}>
                <div className={styles.cardTitleOut}>
                  <div className={styles.cardTitle}>体育设施数据<div></div><div></div><div></div><div></div></div>
                </div>
                {/* ************ */}
                <div className={styles.cardBody}>
                  <Map
                    plugins={['ToolBar']}
                    center={this.state.center}
                    zoom={14}
                    amapkey={mapKey}
                    mapStyle='amap://styles/360482e1f6603d8ccdd345ab2a9425cc'//设置地图的显示样式
                  >
                    <Markers
                      markers={this.state.markers}
                      useCluster={true}
                      events={this.markerEvents}
                    />
                    <InfoWindow
                      position={this.state.InfoWindowPosition}
                      visible={this.state.InfoWindowVisible}
                      isCustom
                      offset={[0,-22]}
                    >
                      <div className={styles.title}>{this.state.pointInfo.title}
                        <span onClick={() => {this.closeWindow()}} className={styles.close}><Icon type="close" /></span>
                      </div>
                      <div className={styles.content}>
                        <div className={styles.content_left}>
                          <img src={this.state.pointInfo.img_urls ? fileUrl + this.state.pointInfo.img_urls : defaultImg}/>
                        </div>
                        <div className={styles.content_right}>
                          <div className={styles.address}><span>经度：</span>{this.state.pointInfo.longitude}</div>
                          <div className={styles.tel}><span>纬度：</span>{this.state.pointInfo.latitude}</div>
                        </div>
                      </div>
                    </InfoWindow>
                  </Map>
                </div>
              </div>
            </div>
            <div className={styles.s3}>
              {/* 体测点数据 */}
              <div className={styles.card + ' ' + styles.card_small + ' ' + styles.card7}>
                <div className={styles.cardTitleOut}>
                  <div className={styles.cardTitle}>体测点数据<div></div><div></div><div></div><div></div></div>
                </div>
                {/* ************ */}
                <div className={styles.cardBody}>
                  <Leida venueInfoMap={venueInfoMap}></Leida>
                </div>
              </div>
              {/* 体测资源数据 */}
              <div className={styles.card + ' ' + styles.card_small + ' ' + styles.card8}>
                <div className={styles.cardTitleOut}>
                  <div className={styles.cardTitle}>体育资源数据<div></div><div></div><div></div><div></div></div>
                </div>
                {/* ************ */}
                <div className={styles.cardBody}>
                  <Huan sportResourcesInfo={sportResourcesInfo}></Huan>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      </div>
    );
  }
}

export default UserLayout;