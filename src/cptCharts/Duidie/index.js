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

class Duidie extends React.PureComponent {
  render() {
    const {
        // data,
        height,
        colorList,
    } = this.props;

    const sexAgeRatioMap = this.props.sexAgeRatioMap

    const data = [
      {
        State: "老年人(60岁以上)",
        "男": sexAgeRatioMap.oldMan,
        "女": sexAgeRatioMap.oldWoman
      },
      {
        State: "中年人(40~59岁)",
        "男": sexAgeRatioMap.middleMan,
        "女": sexAgeRatioMap.middleWoman
      },
      {
        State: "青年人(20~39岁)",
        "男": sexAgeRatioMap.youngMan,
        "女": sexAgeRatioMap.youngWoman
      },
      {
        State: "青少年(20岁以下)",
        "男": sexAgeRatioMap.youthMan,
        "女": sexAgeRatioMap.youthWoman
      },
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields: [ "男", "女"],
      // 展开字段集
      key: "年龄段",
      // key字段
      value: "人口数量",
      // value字段
      retains: ["State"] // 保留字段集，默认为除fields以外的所有字段
    });

    return (
      <Chart padding={[0, 0, 0, 112]} height={100} data={dv} forceFit>
        <Legend />
        <Coord transpose />
        <Tooltip />
        <Axis
          name="State"
          label={{
            offset: 12,
            textStyle:{
              fill:'#CECFD1'
            }
          }}
          tickLine={null}
          line={null}
        />
        <Axis name="人口数量" visible={false}/>
        <Geom
          type="intervalStack"
          position="State*人口数量"
          color={['年龄段', ['#04A4E6', '#F34A7F']]}
        />
      </Chart>
    );
  }
}

export default Duidie;