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
    '#21A4FF',
    '#FFA142',
    '#FF4543', 
    '#A0E242',
    '#474FD6',
    '#F64B88',
    '#8D59CD',
    '#8348AD',
    '#FF6D37',
    '#E6437B',
    '#FFB541',
    '#5E6FEF',
    '#00C3D4',
    '#FF3D66',
    '#82D13C',
  ]

class Huan extends React.Component {
  render() {
    const { DataView } = DataSet;
    const { Html } = Guide;
    const sportResourcesInfo = this.props.sportResourcesInfo
    var data = [],sumGym=0;
    for(let propName in sportResourcesInfo){
      var obj={}
      obj.item = propName
      obj.count = sportResourcesInfo[propName]
      if(propName != 'sumGym'){
        data.push(obj)
      }else{
        sumGym = sportResourcesInfo[propName]
      }
    }
    var sum = 0
    for(let i=0;i<data.length;i++){
      sum += data[i].count
    }
  
    const dv = new DataView();
    dv.source(data).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    };
    return (
      <div>
        <Chart
          height={250}
          data={dv}
          scale={cols}
          padding={[0,0,0,0]}
          forceFit
        >
          <Coord type={"theta"} radius={0.75} innerRadius={0.7} />
          <Axis name="percent" />
          <Legend
            position="right"
            offsetY={-window.innerHeight / 2 + 120}
            offsetX={-100}
          />
          <Tooltip
            showTitle={false}
            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
          />
          <Guide>
            <Html
              position={["50%", "50%"]}
              html={"<div style='font-size:1.2em;text-align: center;width: 10em;'>"+sumGym+"<br><span style='font-size:12px'>体育资源数量</span></div>"}
              alignX="middle"
              alignY="middle"
            />
          </Guide>
          <Geom
            type="intervalStack"
            position="percent"
            color={['item',colorList]}
            tooltip={[
              "item*percent",
              (item, percent) => {
                percent = percent * 100 + "%";
                return {
                  name: item,
                  value: percent
                };
              }
            ]}
            style={{
              lineWidth: 0,
              stroke: "#fff"
            }}
          >
            <Label
              content="percent"
              formatter={(val, item) => {
                return item.point.item + ": " + (item.point.percent*100).toFixed(1) + '%';
              }}
              textStyle={{
                fill: '#CECFD1'
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default Huan;