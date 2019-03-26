import React, { PureComponent } from 'react';
import { FormattedMessage, setLocale, getLocale } from 'umi/locale';
import { Spin, Menu, Icon, Dropdown, Avatar, Tooltip } from 'antd';
import styles from './index.less';
import { fileUrl } from '../../global';
import Link from 'umi/link'

export default class GlobalHeaderRight extends PureComponent {
  changLang = () => {
    const locale = getLocale();
    if (!locale || locale === 'zh-CN') {
      setLocale('en-US');
    } else {
      setLocale('zh-CN');
    }
  };

  render() {
    const { currentUser, onMenuClick, theme, isPingtai, changeMenu } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {currentUser.name ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
            {
              currentUser.headimg ? 
              <Avatar
                size="small"
                className={styles.avatar}
                src={fileUrl + '/' + currentUser.headimg} 
                alt="avatar"
              />:
              <Avatar
                size="small"
                className={styles.avatar}
                // src={fileUrl + '/' + currentUser.headimg} 
                alt="avatar"
                icon="user"
              />
            }
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin
            size="small"
            style={{
              marginLeft: 8,
              marginRight: 8,
              background: '#fff',
              width: 18,
              height: 18,
              borderRadius: 50,
            }}
          />
        )}
        <Tooltip placement="bottomRight" title="大数据分析">
            <span style={{padding:0,width:52,textAlign:'center'}} className={styles.ptSetting}>
              <Link style={{color:'#fff'}} target="blank" to="/rc/Analysis">
                <span style={{display:'inline-block',height:'100%',width:'100%'}}>
                    <Icon type="area-chart"/>
                </span>
              </Link>
            </span>
        </Tooltip>
        <Tooltip onClick={changeMenu} placement="bottomRight" title={isPingtai?'主页':'平台管理'}>
            {
              isPingtai?
              <span className={styles.ptSetting}>
                <Icon type="home"/>
              </span>:
              <span className={styles.ptSetting}>
                <Icon type="setting"/>
              </span>
            }
        </Tooltip>
      </div>
    );
  }
}
