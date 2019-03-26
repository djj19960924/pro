// data-set 可以按需引入，除此之外不要引入别的包
import React from 'react';
import { Chart, Axis, Coord, Geom, Guide, View } from 'bizcharts';

const { Text } = Guide;

// 下面的代码会被作为 cdn script 注入 注释勿删
// CDN START


const cols = {
  type: {
    range: [0, 1],
  },
  value: {
    sync: true,
  },
};

const colsView2 = {
  type: {
    tickCount: 3,
  },
};

class Yibiao extends React.Component {
  render() {
    const { color , rgbColor , percent , value ,matchRatioMap } = this.props;
    console.log('matchRatioMap:',matchRatioMap)
    // 构造数据
    const data1 = [];
    for (let i = 0; i < 50; i++) {
      const item = {};
      item.type = `${i}`;
      item.value = 10;
      data1.push(item);
    }
    
    const data2 = [];
    for (let i = 0; i < 50; i++) {
      const item = {};
      item.type = `${i}`;
      item.value = 10;
      if (i > (percent/2).toFixed(0)) {
        item.value = 0;
      }
      data2.push(item);
    }
    return (
      <Chart height={100} data={[1]} scale={cols} padding={[0, 0, 0, 0]} forceFit>
        <View data={data1}>
          <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.8} innerRadius={0.75} />
          <Geom type="interval" position="type*value" color={rgbColor || "rgba(59,220,244, 0.2)"} size={2} />
        </View>
        <View data={data1} scale={colsView2}>
          <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.55} innerRadius={0.95} />
          <Geom type="interval" position="type*value" color={rgbColor || "rgba(59,220,244, 0.2)"} size={6} />
          <Axis
            name="type"
            grid={null}
            line={null}
            tickLine={null}
            label={null}
          />
          <Axis name="value" visible={false} />
        </View>
        <View data={data2} >
          <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.8} innerRadius={0.75} />
          <Geom type="interval" position="type*value" color={['value', color || '#33BCD6']} opacity={1} size={2} />
          <Guide>
            <Text
              position={['50%', '65%']}
              content={value||'0'}
              style={{
                fill: color || '#33BCD6',
                fontSize: 16,
                textAlign: 'center',
                textBaseline: 'middle',
              }}
            />
          </Guide>
        </View>
      </Chart>
    );
  }
}

// CDN END
export default Yibiao;