import React from 'react';
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

class Zhexian extends React.PureComponent {
  render() {
    const sportsTime = this.props.sportsTime
    var data=[]
    for(let i=0;i<sportsTime.length;i++){
      var obj = {}
      if(sportsTime[i].time.split('-')[1].length==2){
        obj.month = sportsTime[i].time.split('-')[1].substr(1)+"月"
      }else{
        obj.month = sportsTime[i].time.split('-')[1]+"月"
      }
      obj.value = sportsTime[i].sumDate
      data.push(obj)
    }
    const cols = {
      value: {
        min: 0
      },
      month: {
        range: [0, 1]
      }
    };

    return (
      <Chart height={180} padding={[10, 12, 30, 40]} data={data} scale={cols} forceFit>
        <Axis 
          name="month" 
          tickLine={null}
          line={{
            fill: '#4A78B2',
            lineWidth: 1
          }}
          label={{
            textStyle:{
              fill:'#4A78B2'
            }
          }}
        />
        <Axis 
          name="value" 
          line={{
            fill: '#4A78B2',
            lineWidth: 1
          }}
          label={{
            textStyle:{
              fill:'#4A78B2'
            }
          }}
          grid={{
            type:'line',
            lineStyle:{
              stroke:'#122039'
            }
          }}
        />
        <Tooltip
          crosshairs={{
            type: "y"
          }}
        />
        <Geom type="line" position="month*value" size={1} color='#9599A1' />
        <Geom
          type="point"
          position="month*value"
          color={['month', ['#A0E242']]}
          size={3}
          shape={"circle"}
          style={{
            stroke: "#fff",
            lineWidth: 1
          }}
        />
      </Chart>
    );
  }
}

export default Zhexian;