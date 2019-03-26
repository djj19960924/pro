import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Avatar,
  Badge,
  Form,
  Input,
  Select,
  Button,
  Modal,
  Upload,
  message,
  Divider,
  DatePicker,
  Tabs,
  Spin,
  Menu,
  TreeSelect,
  Dropdown,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import UploadImg from '@/components/UploadImg';
import WxUserDetail from '@/components/WxUserDetail';
import Link from 'umi/link';

import styles from '@/less/TableList.less';
import myStyles from '@/less/guide.less';

import nodata from '@/assets/nodata.png';

import { checkData, getnyr, getfulltime, getPageQuery } from '@/utils/utils';
import { rc,requestUrl_kxjs } from '@/global';

const FormItem = Form.Item;
const { Option } = Select;
const TabPane = Tabs.TabPane;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

message.config({ top: 100 });


// 用户详情
const CreateWxUserDetail = Form.create()(props => {
  const {
    wxUserDetailModalVisible,
    handleWxUserDetailModalVisible,
    wxUserInfo,
  } = props;
  const footer = <div onClick={() => handleWxUserDetailModalVisible()} style={{textAlign:'center'}}><Button type='primary'>关闭</Button></div>
  return (
    <Modal
      destroyOnClose
      title="用户信息"
      width={860}
      visible={wxUserDetailModalVisible}
      onCancel={() => handleWxUserDetailModalVisible()}
      footer={footer}
      centered={true}
    >
      <WxUserDetail wxUserInfo={wxUserInfo}></WxUserDetail>
    </Modal>
  );
});

@connect(({ repeat, loading }) => ({
  repeat,
  loading: loading.models.repeat,
}))
@Form.create()
class guide extends PureComponent {
  state = {
    difftime:7, // 几天内数据
  };

  componentDidMount() {
    this.getList()
    this.setState({
      currentUser:getPageQuery().id
    })
    this.getChatList(getPageQuery().id)
  }

  
  handleWxUserDetailModalVisible = flag => {
    this.setState({
      wxUserDetailModalVisible: !!flag,
    });
  };

  // 获取用户列表
  getList = (searchstr) => {
    const loading = message.loading('加载中...', 0);
    let params = {}
    Number(this.state.difftime) && (params.difftime = this.state.difftime)
    searchstr && (params.searchstr = searchstr)
    const { dispatch } = this.props;
    dispatch({
      type: 'repeat/list',
      payload: params,
      callback: res => {
        setTimeout(loading, 0);
        if (res.code == 200) {
          this.setState({
            userList:res.data.list
          })
        }
      },
    });
  }

  // 切换天数
  changeDifftime = key => {
    this.setState({
      difftime:key,
      userList:[]
    },() => {
      this.getList()
    })
  }

  // 
  chooseUser = id => {
    let {userList} = this.state;
    userList.forEach((ele) => {
      if(ele.id == id){
        ele.active = true;
      }else{
        ele.active = false;
      }
    });
    this.setState({
      userList:userList,
      currentUser:id
    })
    this.getChatList(id,true)
  }

  // 生成用户列表
  userItems = arr => {
    if(arr.length == 0)
      return (
        <div className={myStyles.nodata}>
          <div>
            <img src={nodata}/><br/>
            <div>暂无数据</div>
          </div>
        </div>
      )
    else return(
      <div>
        {
          arr.map((item) => (
            <div onClick={() => this.chooseUser(item.id)} className={myStyles.userItem} style={item.active?{background:'#CEEAFF'}:{}}>
              {
                !item.isRead&&<span style={{ color: '#7E7E7E', fontSize:12}} className={myStyles.badge}>未读</span>
              }
              <div className={myStyles.line1}>
                <div className={myStyles.line1_user}><b>{item.uname}</b> <span style={item.sex==2?{background:'#ED414D'}:{}}>{item.sex==1?'男':item.sex==2?'女':'--'}</span></div>
                <div className={myStyles.line1_time}>{getfulltime(item.adviceTime,'hh:mm')}</div>
              </div>
              <div className={myStyles.line2}>
                <b>年龄: </b>
                <span>{item.age}</span>&nbsp;&nbsp;
                <b>身高: </b>
                <span>{item.sg}cm</span>&nbsp;&nbsp;
                <b>体重: </b>
                <span>{item.tz*2}斤</span>
              </div>
              <div className={myStyles.line3}>
                <b>咨询问题：</b>
                <span>{item.questions}</span>
              </div>
            </div>
          ))
        }
      </div>
    )
  }

  enterSearchStr = (e) => {
    if (e.keyCode == "13") {
      this.getList(e.target.value)
    }
  }

  // 获取聊天列表
  getChatList = (id,isLoading) => {
    let loading;
    if(isLoading)
      loading = message.loading('加载中...', 0);
    const { dispatch } = this.props;
    dispatch({
      type: 'repeat/chatList',
      payload: id,
      callback: res => {
        setTimeout(loading, 0);
        if (res.code == 200) {
          this.setState({
            chatList:res.data.list
          })
        }
      },
    });
  }

  // 查看用户
  seeWxUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'repeat/getWxUserDetail',
      payload:  this.state.currentUser,
      callback: res => {
        if (res.code == 200) {
          this.setState({
            wxUserInfo:res.data
          })
          this.handleWxUserDetailModalVisible(true)
        }
      },
    });
  }

  render() {
    const { userList , chatList } = this.state

    const { loading } = this.props;

    const parentMethods = { 
      // 传递方法
      handleWxUserDetailModalVisible:this.handleWxUserDetailModalVisible,
    };
    const parentStates = {
      // 传递状态
      wxUserDetailModalVisible:this.state.wxUserDetailModalVisible,
      wxUserInfo:this.state.wxUserInfo,
    };

    return (
      <div className={myStyles.container_repeat}>
        <div className={myStyles.heightFixed}>
          {/* 左边 */}
          <div className={myStyles.userList}>
            <div><input onKeyDown={(e) => this.enterSearchStr(e)} placeholder='搜索名称、问题内容'/></div>
            <Tabs size='small' defaultActiveKey="1" onChange={this.changeDifftime}>
              <TabPane tab="最近咨询" key="7">{userList && this.userItems(userList)}</TabPane>
              <TabPane tab="三个月内" key="90">{userList && this.userItems(userList)}</TabPane>
              <TabPane tab="全部" key="0">{userList && this.userItems(userList)}</TabPane>
            </Tabs>
          </div>
          {/* 右边 */}
          <div className={myStyles.chat}>
            <div className={myStyles.chatTitle}>咨询问题</div>
            <div className={myStyles.chatContent}>
            {
              chatList && chatList.map(item => (
                <div>
                  {item.name && item.adviceTime && item.questions &&
                    <div>
                      <div className={myStyles.recordName}>
                        <b>用户名：{item.name}</b>
                        <span>{getfulltime(item.adviceTime,'hh:mm')}</span>
                      </div>
                      <div className={myStyles.question}>
                        {item.questions}
                      </div>
                    </div>
                  }
                  {item.expertName && item.reponse_time && item.expert_reponse &&
                    <div>
                      <div className={myStyles.recordName}>
                        <b>专家：{item.expertName}</b>
                        <span>{getfulltime(item.reponse_time,'hh:mm')}</span>
                      </div>
                      <div className={myStyles.response}>
                        {item.expert_reponse}
                      </div>
                    </div>
                  }
                </div>
              ))
            }
            </div>
          </div>
        </div>
        {/* 输入框 */}
        <div className={myStyles.myInput_p}>
          <div className={myStyles.myInput}>
            <textarea placeholder='请输入要发送的内容'></textarea>
            <div style={{textAlign:'right'}}>
              <Button loading={loading} onClick={this.seeWxUser} size='small' type='default'>用户信息</Button>&nbsp;&nbsp;&nbsp;
              <Button size='small' type='primary'>发送</Button>&nbsp;&nbsp;&nbsp;
            </div>
          </div>
        </div>
      
        <CreateWxUserDetail {...parentMethods} {...parentStates} />
      </div>
    );
  }
}

export default guide;
