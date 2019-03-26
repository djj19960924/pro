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
import {Radar,Bar} from '@/components/Charts';
import Area from '@/components/Charts/Area';
import Pie from '@/components/Charts/Pie';
import Pie1 from '@/components/Charts/Pie1';
import myStyles from './charts.less';
import { getnyr } from '@/utils/utils';
import { rc } from '@/global';

import img11 from './images/11.png'
import img22 from './images/22.png'
import img33 from './images/33.png'
import img44 from './images/44.png'
import img1 from './images/1.png'
import img2 from './images/2.png'
import img3 from './images/3.png'
import img4 from './images/4.png'
import img5 from './images/5.png'
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";

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

var imageMap = {
  level1: img1,
  level2: img2,
  level3: img3,
  level4: img4,
  level5: img5
};

message.config({ top: 100 });

@connect(({ tice_charts, loading }) => ({
  tice_charts,
  loading: loading.models.tice_charts,
}))
class Charts extends PureComponent {
  state = {
    fourTag:[
      {img:img11,title:'今日体测人数',value:0,color:'#3F99EE'},
      {img:img22,title:'今日体测合格率',value:'0%',color:'#FF9C48'},
      {img:img33,title:'累计体测人数',value:0,color:'#6C75E0'},
      {img:img44,title:'累计体测合格率',value:'0%',color:'#14C0B1'},
    ],

    expertRanking:[],
    resourceCount:[],
    repairsList:[],
    radarData:[],
    bardata : [],
    sexdata : []
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // top
    dispatch({
      type:'tice_charts/tcCount',
      callback:(res)=>{
        this.state.fourTag[0].value = res.data.data.userCountToday
        this.state.fourTag[1].value = res.data.data.passRateToday + '%'
        this.state.fourTag[2].value = res.data.data.userCount
        this.state.fourTag[3].value = res.data.data.passRate + '%'
      }
    })

    // 用户年龄阶段比例
    dispatch({
      type:'tice_charts/tcAgeRatio',
      callback:(res)=>{
        var data = res.data.data,resourceCount=[];
        resourceCount = [
          {
            item: '20岁以下',
            count: data['1'],
          },
          {
            item: '20~39岁',
            count: data['2'],
          },
          {
            item: '40~59岁',
            count: data['3'],
          },
          {
            item: '60岁以上',
            count: data['4'],
          },
        ]
        resourceCount.forEach((ele,index) => {
          if(ele.count == 0){
            resourceCount.splice(index,1)
          }
        })
        this.setState({
          resourceCount:resourceCount
        })
      }
    })

    // 不同阶段性别比例
    dispatch({
      type:'tice_charts/tcSex',
      callback:(res)=>{
        var sexdata = [];
        var data = res.data.data;
        for(var key in data){
          sexdata.push({
            month:key*1 + 1 + '月',
            man:data[key]['1'],
            woman:data[key]['2'],
          })
          this.setState({
            sexdata:sexdata
          })
        }
      }
    })
    
    // 每日合格人数
    dispatch({
      type:'tice_charts/okCount',
      callback:(res)=>{
        var repairsList = []
        var data = res.data.data;
        for(var key in data){
          repairsList.push({
            key:key.substring(5,10),
            value:data[key]
          })
        }
        this.setState({
          repairsList:repairsList
        })
      }
    })

    // 体测点排行
    dispatch({
      type:'tice_charts/tice_point_list',
      callback:(res)=>{
        this.setState({
          expertRanking:res.data.data
        })
      }
    })

    // bmi
    dispatch({
      type:'tice_charts/bmi_level',
      callback:(res)=>{
        var data = [
          {
            name: "偏瘦",
            key:"level1",
            vote: res.data.data['0']
          },
          {
            name: "标准",
            key:"level2",
            vote: res.data.data['1']
          },
          {
            name: "超重",
            key:"level3",
            vote: res.data.data['2']
          },
          {
            name: "严重肥胖",
            key:"level4",
            vote: res.data.data['3']
          }
        ]
        this.setState({
          bardata:data
        })
      }
    })

    // 体测点排行
    dispatch({
      type:'tice_charts/project_avg',
      callback:(res)=>{
        var data = [
          {
            name: '平均得分',
            label: '肺活量',
            value: res.data.data['1'].toFixed(1)
          },
          {
            name: '平均得分',
            label: '握力',
            value: res.data.data['1'].toFixed(1)
          },
          {
            name: '平均得分',
            label: '仰卧起坐',
            value: res.data.data['9'].toFixed(1)
          },
          {
            name: '平均得分',
            label: '纵跳',
            value: res.data.data['10'].toFixed(1)
          },
          {
            name: '平均得分',
            label: '台阶测试',
            value: res.data.data['7'].toFixed(1)
          },
          {
            name: '平均得分',
            label: '坐位体前屈',
            value: res.data.data['11'].toFixed(1)
          },
          {
            name: '平均得分',
            label: '身高体重',
            value: res.data.data['6'].toFixed(1)
          },
          {
            name: '平均得分',
            label: '反应时',
            value: res.data.data['5'].toFixed(1)
          },
          {
            name: '平均得分',
            label: '稳定性',
            value: res.data.data['3'].toFixed(1)
          },
        ]
        this.setState({
          radarData:data
        })
      }
    })
  }

  render() {
    const { fourTag , expertRanking , resourceCount , repairsList , radarData , bardata , sexdata } = this.state;
    const ds = new DataSet();
    const dv = ds.createView().source(sexdata);
    dv.transform({
      type: "fold",
      fields: ["man", "woman"],
      // 展开字段集
      key: "city",
      // key字段
      value: "count" // value字段
    });
    const cols = {
      month: {
        range: [0, 1],
      },
      man: {
        alias: '男'
      },
      woman: {
        alias: '女'
      }
    };
    return (
      <div className={myStyles.container}>
        {/* line-1 */}
        <div className={myStyles.line_1}>
        {
          fourTag.map(ele => (
            <div className={myStyles.line_1_container}>
              <img src={ele.img}/>
              <div className={myStyles.line_1_right}>
                <div className={myStyles.line_1_right_top}>{ele.title}</div>
                <div style={{color:ele.color}} className={myStyles.line_1_right_bottom}>{ele.value}</div>
              </div>
            </div>
          ))
        }
        </div>
      
        {/* line-2 */}
        <div className={myStyles.line_2}>
          <div className={myStyles.line_2_2}>
            <div className={myStyles.cardTitle}>
              <div className={myStyles.cardTitleLeft}>用户年龄阶段比例</div>
            </div>
            <div>
              <Pie1 
                data={resourceCount}
                total={{name:'',value:''}}
                colorList={colorList}
                height={300}
              />
            </div>
          </div>
          <div className={myStyles.line_2_1}>
            <div style={{marginBottom:20}} className={myStyles.cardTitle}>
              <div className={myStyles.cardTitleLeft}>不同阶段性别比例</div>
              <div className={myStyles.cardTitleRight}>月份/人数</div>
            </div>
            <div>
              <Chart height={320} data={dv} scale={cols} forceFit>
                <Legend
                  
                />
                <Axis name="month" />
                <Axis
                  name="count"
                  label={{
                    formatter: val => `${val}`
                  }}
                />
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
                <Geom
                  type="line"
                  position="month*count"
                  size={2}
                  color={['city', ['#3F99EE', '#F95889']]}
                />
                <Geom
                  type="point"
                  position="month*count"
                  size={4}
                  shape={"circle"}
                  color={['city', ['#3F99EE', '#F95889']]}
                  style={{
                    stroke: "#fff",
                    lineWidth: 1
                  }}
                />
              </Chart>
            </div>
            <div>
              
            </div>
          </div>
          <div className={myStyles.line_2_3}>
            <div className={myStyles.cardTitle}>
              <div className={myStyles.cardTitleLeft}>BMI指数</div>
              <div>
                <Chart
                  height={300}
                  data={bardata}
                  padding={[60, 20, 40, 60]}
                  scale={{
                    vote: {
                      min: 0
                    }
                  }}
                  forceFit
                >
                  <Axis
                    name="vote"
                    labels={null}
                    title={null}
                    line={null}
                    tickLine={null}
                  />
                  <Geom
                    type="interval"
                    position="name*vote"
                    color={["name", ["#7f8da9", "#fec514", "#db4c3c", "#C9EAFF","#959DFF"]]}
                  />
                  <Tooltip />
                  <Geom
                    type="point"
                    position="name*vote"
                    size={60}
                    shape={[
                      "key",
                      function(key) {
                        return ["image", imageMap[key]];
                      }
                    ]}
                  />
                </Chart>
              </div>
            </div>
            
          </div>
        </div>
      
        {/* line-3 */}
        <div className={myStyles.line_3}>
          <div className={myStyles.line_3_0}>
            <div className={myStyles.cardTitle}>
              <div className={myStyles.cardTitleLeft}>体测点测试排行</div>
              {/* <div style={{top:-4}} className={myStyles.cardTitleRight}>
                <RadioGroup defaultValue="1" size="small" buttonStyle="solid">
                  <RadioButton value="1">今日</RadioButton>
                  <RadioButton value="2">本周</RadioButton>
                  <RadioButton value="3">本月</RadioButton>
                </RadioGroup>
              </div> */}
            </div>
            <ul>
                <li className={myStyles.title}>
                  <div>排名</div>
                  <div>体测点</div>
                  <div>地址</div>
                  <div>体测人数</div>
                  <div>合格率</div>
                </li>
                {
                  expertRanking && expertRanking.map((ele,index) => (
                    <li key={index} className={myStyles.item}>
                      <div><span style={index==0?{background:'#F61610'}:index==1?{background:'#FF9946'}:index==2?{background:'#FFC970'}:{}}>{index + 1}</span></div>
                      <div>{ele.name}</div>
                      <div>{ele.addr}</div>
                      <div>{ele.userCount}</div>
                      <div>{ele.passRate + '%'}</div>
                    </li>
                  ))
                }
            </ul>
          </div>
          <div className={myStyles.line_3_1}>
            <div className={myStyles.cardTitle}>
              <div className={myStyles.cardTitleLeft}>每日合格人数</div>
              <div className={myStyles.cardTitleRight}>合格人数/时间</div>
            </div>
            <div className={myStyles.line_3_1_content}>
              <Area
                line
                color="#AFB4F2"
                borderColor='#5862ED'
                height={210}
                data={repairsList}
                alias='今日合格人数'
              />
            </div>
          </div>
          <div className={myStyles.line_3_2}>
            <div className={myStyles.cardTitle}>
              <div className={myStyles.cardTitleLeft}>体测综合数据</div>
              <div className={myStyles.line_3_2_content}>
                <Radar height={310} data={radarData} colors='#F95C58'/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Charts;