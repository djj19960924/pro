import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import { connect } from 'dva';
import styles from './UserLayout.less';
import {fileUrl} from '@/global'

const links = [
  {
    key: 'help',
    title: '帮助',
    href: '',
  },
  {
    key: 'privacy',
    title: '官网',
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 荣成智慧健身大数据平台
  </Fragment>
);
@connect(({ global, loading }) => ({
  global,
  loading: loading.models.global,
}))
class UserLayout extends React.PureComponent {
  state = {}
  componentDidMount() {
    let webParams = localStorage.getItem('webParams')
    if(webParams){
      this.setState(JSON.parse(webParams))
    }else{
      this.props.dispatch({
        type: "global/getParams",
        callback: res => {
          if (res.meta.code == 200) {
            var obj = {
              systemLog: res.data.data.systemLog,
              systemName: res.data.data.systemName,
              systemIdentification: res.data.data.systemIdentification
            }
            this.setState(obj)
            localStorage.setItem('webParams',JSON.stringify(obj))
          } 
        }
      });
    }
  }
  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.header}></div>
        <div style={{backgroundImage:`url('${fileUrl + this.state.systemLog}')`}} className={styles.content}>
          <div className={styles.title1}>自由呼吸 自在荣成</div>
          <div className={styles.title2}>{this.state.systemName}</div>
          <div className={styles.loginContent}>
            {children}
          </div>
        </div>
        <div className={styles.footer}></div>
        {/* <GlobalFooter links={links} copyright={copyright} /> */}
      </div>
    );
  }
}

export default UserLayout;
