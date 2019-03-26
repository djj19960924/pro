import React, { PureComponent } from 'react';
import {
  Card,
  Icon
} from 'antd';
import { Map , Markers , InfoWindow } from 'react-amap';
import { connect } from 'dva';
import { mapKey,fileUrl } from '@/global'
import styles from './map.less'

const defaultImg = 'http://webmap0.bdimg.com/client/services/thumbnails?width=132&height=104&align=center,center&quality=100&src=http%3A%2F%2Fhiphotos.baidu.com%2Fspace%2Fpic%2Fitem%2F4afbfbedab64034ff0749211a7c379310a551d6f.jpg'

@connect(({ villageList, loading }) => ({
  villageList,
  loading: loading.models.villageList,
}))


export default class repairs extends PureComponent {
  constructor(){
    super();
    this.state = {
      center:{longitude:122.487084, latitude:37.16599},
      organizeId:63,
      markers: [],
      pointInfo:{}
    };
    // marker事件
    this.markerEvents = {
      click: (e) => {
        if(!e){
          this.closeWindow()
          return;
        }
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
    //获取标注
    dispatch({
      type: 'villageList/list',
      payload: {id:this.state.organizeId},
      callback:(res) => {       
        var list = [];
        var data = res.data.list;
        for(let i=0;i<data.length;i++){
          if(data[i].longitude&&data[i].latitude){
            list.push({
              position:{longitude: parseFloat(data[i].longitude), latitude: parseFloat(data[i].latitude)},
              title:data[i].name,
              img_urls:data[i].img_urls,
              longitude:data[i].longitude,
              latitude:data[i].latitude,
            })
          }
        }        
        this.setState({
          markers:list
        })
      },
    });
  }
  // 关闭信息窗体
  closeWindow(){
    this.setState({
      InfoWindowVisible:false
    })
  }
 

  render(){
    const {pointInfo} = this.state
    return (
      <Card bordered={false}>
        <div style={{width:'100%',height:`${document.body.clientHeight-260}px`}}>
          <Map
            plugins={['ToolBar']}
            center={this.state.center}
            zoom={10}
            amapkey={mapKey}
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
              <div className={styles.title}>{pointInfo.title}
                <span onClick={() => {this.closeWindow()}} className={styles.close}><Icon type="close" /></span>
              </div>
              <div className={styles.content}>
                <div className={styles.content_left}>
                  <img src={pointInfo.img_urls ? fileUrl + pointInfo.img_urls : defaultImg}/>
                </div>
                <div className={styles.content_right}>
                  <div className={styles.address}><span>经度：</span>{pointInfo.longitude}</div>
                  <div className={styles.tel}><span>纬度：</span>{pointInfo.latitude}</div>
                </div>
              </div>
            </InfoWindow>
          </Map>
        </div>
      </Card>
    )
  }
}

