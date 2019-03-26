import React, { PureComponent, Fragment } from "react";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { connect } from "dva";
import { Card, Form, Input, Button, message } from "antd";
import UploadImg from "@/components/UploadImg";
import Loading from "@/components/Loading";
import {fileUrl} from "@/global"

import styles from "./params.less";

import a1 from "./images/1.png";
import a2 from "./images/2.png";
import a3 from "./images/3.png";
import a4 from "./images/4.png";
import a5 from "./images/5.png";
import a6 from "./images/6.png";
import b1 from "./images/11.png";
import b2 from "./images/22.png";

const FormItem = Form.Item;

message.config({ top: 100 });

@connect(({ params, loading }) => ({
  params,
  loading: loading.models.params
}))
@Form.create()
class system extends PureComponent {
  state = {
    iconList:[
      {
        src:a1,
        text:"系统设置"
      },
      {
        src:a2,
        text:"数据分析"
      },
      {
        src:a3,
        text:"区域管理"
      },
      {
        src:a4,
        text:"体测维护"
      },
      {
        src:a5,
        text:"角色权限"
      },
      {
        src:a6,
        text:"用户管理"
      },
    ]
  };

  componentDidMount() {
    this.props.dispatch({
      type: "params/get",
      callback: res => {
        if (res.meta.code == 200) {
          this.setState({
            systemLog: res.data.data.systemLog,
            systemName: res.data.data.systemName,
            systemPassword: res.data.data.systemPassword,
            systemIdentification: res.data.data.systemIdentification
          });
        } 
      }
    });
  }

  render() {
    const { loading } = this.props;
    const { iconList } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.container}>
            <div className={styles.title}><span>系统基础信息展示</span></div>
            <div className={styles.iconContainer}>
              {
                iconList.map(ele => (
                  <div className={styles.icons}>
                    <img src={ele.src}/>
                    <div>{ele.text}</div>
                  </div>
                ))
              }
            </div>
            <div className={styles.container1}>
              <div className={styles.cardItem}>
                <img src={b1}/>
                <div>平台系统名称：{this.state.systemName}</div>
              </div>
              <div style={{background:'#EAF0FC',border:0}} className={styles.cardItem}>
                <div>平台Logo：<img className={styles.logo} src={fileUrl + this.state.systemLog}/></div>
                <div>平台初始密码：{this.state.systemPassword}</div>
              </div>
              <div className={styles.cardItem}>
                <img src={b2}/>
                <div>平台底部标识：{this.state.systemIdentification}</div>
              </div>
            </div>
          </div>
        </Card>
        <Loading loading={loading} />
      </PageHeaderWrapper>
    );
  }
}
export default system;
