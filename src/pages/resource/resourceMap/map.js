import React, { PureComponent } from 'react';
import {
  Card,
  Icon
} from 'antd';
import { Map , Markers , InfoWindow } from 'react-amap';
import { connect } from 'dva';
import { mapKey , fileUrl} from '@/global'
import styles from './map.less'
import { format } from 'path';
import other from '../images/other.png'
import badminton from '../images/badminton.png'
import fitness from '../images/fitness.png'
import kart from '../images/kart.png'
import pingpang from '../images/pingpang.png'
import soccer from '../images/soccer.png'
import swim from '../images/swim.png'
import tennis from '../images/tennis.png'
import yoga from '../images/yoga.png'
import basketball from '../images/basketball.png'

const w = '32px'
const h = '40px'
const defaultImg = 'http://webmap0.bdimg.com/client/services/thumbnails?width=132&height=104&align=center,center&quality=100&src=http%3A%2F%2Fhiphotos.baidu.com%2Fspace%2Fpic%2Fitem%2F35a85edf8db1cb137b926c04d554564e92584b29.jpg'

function a(c){
  const b ={
    background: `url('${c}')`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: w,
    height: h,
    color: '#000',
    textAlign: 'center',
    lineHeight: '40px'
  }
  return b
}

@connect(({ resource, loading }) => ({
  resource,
  loading: loading.models.resource,
}))
export default class repairs extends PureComponent {
  constructor(){
    super();
    this.state = {
      center:{longitude:122.487084, latitude:37.16599},
      markers: [],
      InfoWindowPosition:{},
      InfoWindowVisible:false,
      gymInfo:{},
      price:null
    };
    
    // marker事件
    this.markerEvents = {
      click: (e) => {
        this.setState({
          InfoWindowPosition:e.target.Pg.extData.position,
          // center:e.target.Pg.extData.position,
          InfoWindowVisible:true,
          gymInfo:e.target.Pg.extData
        })
      },
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    //获取标注
    dispatch({
      type: 'resource/list',
      payload: {},
      callback: res => {
        if (res.code == 200) {
          let list = [];
          for(let i=0;i<res.data.list.length;i++){
            if(res.data.list[i].longitude){
              if(res.data.list[i].type_name.indexOf(',')!==-1){
                res.data.list[i].type_name = res.data.list[i].type_name.split(',')[0]
              }
              list.push({
                position:{longitude: res.data.list[i].longitude, latitude: res.data.list[i].latitude},
                title:res.data.list[i].gym_name,
                address:res.data.list[i].address,
                gym_img:fileUrl + res.data.list[i].gym_img,
                tel:res.data.list[i].connect_user_tel,
                price:res.data.list[i].price,
                type: res.data.list[i].type_name
              })
            }
          }
          this.setState({markers:list})
        }
      },
    });
  }

  // 关闭信息窗体
  closeWindow(){
    this.setState({
      InfoWindowVisible:false
    })
  }

  renderMarkerLayout(extData) {
    console.log("1111111111:", extData)
    switch(extData.type){
      case "健身": 
        return <div style = {a(fitness)}></div>
        break;
      case "游泳":
        return <div style = {a(swim)}></div>
        break;
      case "卡丁车":
        return <div style = {a(kart)}></div>
        break;
      case "羽毛球":
        return <div style = {a(badminton)}></div>
        break;
      case "足球":
        return <div style = {a(soccer)}></div>
        break;
      case "篮球":
        return <div style = {a(basketball)}></div>
        break;
      case "瑜伽":
        return <div style = {a(yoga)}></div>
        break;
      case "网球":
        return <div style = {a(tennis)}></div>
        break;
      case "乒乓球":
        return <div style = {a(pingpang)}></div>
        break;
      default:
        return <div style = {a(other)}></div>
        break;
    }
  }

  render(){
    
    const {gymInfo} = this.state
    return (
      <Card bordered={false}>
        <div style={{width:'100%',height:`${document.body.clientHeight-260}px`}}>
          
          
          <Map
            plugins={['ToolBar']}
            center={this.state.center}
            zoom={14}
            amapkey={mapKey}
          >
            <Markers
              markers={this.state.markers}
              events={this.markerEvents}
              render = {this.renderMarkerLayout}
            />
            <InfoWindow
              position={this.state.InfoWindowPosition}
              visible={this.state.InfoWindowVisible}
              isCustom
              offset={[0,-22]}
            >
              <div className={styles.title}>{gymInfo.title}
                <span onClick={() => {this.closeWindow()}} className={styles.close}><Icon type="close" /></span>
              </div>
              <div className={styles.content}>
                <div className={styles.content_left}>
                  <img src={gymInfo.gym_img || defaultImg}/>
                </div>
                <div className={styles.content_right}>
                  <div className={styles.address}><span>地址：</span>{gymInfo.address}</div>
                  <div className={styles.tel}><span>联系电话：</span>{gymInfo.tel || '暂无'}</div>
                  {
                    gymInfo.price == 0 ?(<div></div>):(<div className={styles.tel}><span>费用：</span>{gymInfo.price}￥</div>)
                  }
                  
                </div>
              </div>
            </InfoWindow>
          </Map>
        </div>
      </Card>
    )
  }
}

