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
  Util } from 'bizcharts';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
class MiniArea extends React.PureComponent {
  render() {
    const {
      data,
      height,
      forceFit = true,
      color,
      borderColor,
      borderWidth = 2,
      line,
      xAxis,
      alias,
      scaleType,
      yAxis,
      animate = true,
    } = this.props;
    let dv = new DataSet.View().source(data);
    dv.transform({
      type: "fold",
      fields: ["value"],
      key: "type",
      value: "value"
    });
    const scale = {
      value: {
        type:scaleType || "linear",
        alias: alias,
        formatter: function(val) { 
          return val;
        }
      },
      key: {
        range: [0, 1]
      }
    }; 
    const chartHeight = height + 54;
    return (
      <div className={styles.miniChart} style={{ height }}>
        <div className={styles.chartContent}>
          {height > 0 && (
            <Chart
              height={chartHeight}
              data={dv}
              padding={"auto"}
              scale={scale}
              forceFit
            >
              <Tooltip  showTitle={true} crosshairs={false} />
              <Axis />
              <Geom 
                type="area" 
                position="key*value" 
                color={color?color:'rgba(24, 144, 255, 0.2)'} 
                shape="smooth" 
                tooltip={false}
              />
              <Geom
                type="line"
                position="key*value"
                color={borderColor?borderColor:'#1089ff'}
                shape="smooth"
                size={2}
              />
            </Chart>
          )}
        </div>
      </div>
    );
  }
}

export default MiniArea;