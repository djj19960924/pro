import React from "react";
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
import DataSet from "@antv/data-set";
const colorList = [
    '#5D6DFF',
    '#E25169',
    '#67B030',
    '#CA6228',
    '#FDB81D', 
    '#2092E2',
    '#5242D5',
  ]
  const rgbList = [
    'rgba(93,109,255,0.3)',
    'rgba(226,81,105,0.3)',
    'rgba(103,176,48,0.3)',
    'rgba(202,98,40,0.3)',
    'rgba(253,184,29,0.3)',
    'rgba(32,146,226,0.3)',
    'rgba(82,66,213,0.3)',
    ]

class Basic extends React.Component {
  render() {
    const { DataView } = DataSet;
    const venueInfoMap = this.props.venueInfoMap.data
    
    let data = {"肺活量":{},"握力":{},"稳定性":{},"俯卧撑":{},"反应时":{},"身高体重":{},"台阶测试":{},"仰卧起坐":{},"纵跳高度":{},"坐位体前屈":{}}
    let json = {}

    for(let key in venueInfoMap){
        json[key] = 0
    }
    json = JSON.stringify(json)

    for(let key in data){
        data[key] = JSON.parse(json)
        data[key].item = key
    }

    for(let key in venueInfoMap){
        venueInfoMap[key].forEach(element => {
            data[element.name][key] = element.avg
        })
    }

    let items = []
    for(let key in data){
        let item = data[key]
        items.push(item)
    }
    data = items
    // data.forEach(ele =>{
    //   pro.forEach(projectName => {
    //     if(ele.item == projectName){
    //       for(var key in venueInfoMap){
    //         fields.push(key)
    //         let obj = venueInfoMap[key]
    //         for(var k in obj){
    //           if(k == projectName){
    //             ele[key] = obj[k]
    //           }else{
    //             ele[key] =0
    //           }
    //         }
    //       }
    //     }
    //   })
    // })
    // console.log("data:",data)
    var fields = ["荣成中医院","荣成人民医院","石岛人民医院","荣成妇幼医院"]
 
    const dv = new DataView().source(data);
    dv.transform({
      type: "fold",
      fields: fields,
      // 展开字段集
      key: "user",
      // key字段
      value: "score" // value字段
    });
    const cols = {
      a:{
        type:'cat',
        alias:'体测点1'
      },
      score: {
        min: 0,
        max: 5
      }
    };
    return (
      <div>
        <Chart
          height={250}
          data={dv}
          padding={[0,0,0,90]}
          scale={cols}
          forceFit
        >
          <Coord type="polar" radius={0.8} />
          <Axis
            name="item"
            line={null}
            tickLine={null}
            grid={{
              lineStyle: {
                lineDash: null,
                stroke:'#27436F'
              },
              hideFirstLine: false
            }}
            label={{
              textStyle:{
                fill:'#CECFD1'
              }
            }}
          />
          <Tooltip />
          <Axis
            name="score"
            line={null}
            tickLine={null}
            grid={{
              type: "polygon",
              lineStyle: {
                stroke:'#27436F',
                lineDash: null
              },
              alternateColor: "rgba(0, 0, 0, 0.04)"
            }}
            label={{
              textStyle:{
                fill:'#32517C'
              }
            }}
          />
          <Legend 
            name="user" 
            marker="circle" 
            position='left-top' 
            offsetX={10} 
            offsetY={20}
            textStyle={{
              fill:'#CECFD1'
            }}
          />
          <Geom type="area" position="item*score" color={['user',rgbList]}/>
          <Geom type="line" position="item*score" color={['user',rgbList]} size={1} />
          <Geom
            type="point"
            position="item*score"
            color={['user',colorList]}
            shape="circle"
            size={3}
            style={{
              stroke: "#fff",
              lineWidth: 0,
              fillOpacity: 1
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default Basic;