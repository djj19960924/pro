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
class Pie1 extends React.PureComponent {
  render() {
    const {
        data,
        total,
        height,
        colorList,
    } = this.props;
    const { DataView } = DataSet;
    const { Html } = Guide;
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
          height={height?height:260}
          data={dv}
          scale={cols}
          padding={[20, 20, 20, 20]}
          forceFit
        >
          <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
          <Axis name="percent" />
          {/* <Legend
            position="right"
            offsetY={-window.innerHeight / 2 + 120}
            offsetX={-100}
          /> */}
          <Tooltip
            showTitle={false}
            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
          />
          <Guide>
            <Html
              position={["50%", "50%"]}
              html={`<div style='color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em'>${total.value}<br><span style='color:#3AA1FF;font-size:0.9em'>${total.name}</span></div>`}
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
                percent = (percent * 100).toFixed(2) + "%";
                return {
                  name: item,
                  value: percent
                };
              }
            ]}
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
          >
            <Label
              content="percent"
              formatter={(val, item) => {
                return item.point.item + " : " + Number(val.substring(0,val.length-1)).toFixed(2) + '%';
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default Pie1;