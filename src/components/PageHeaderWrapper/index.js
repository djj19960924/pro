import React from 'react';
import { Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import PageHeader from '@/components/PageHeader';
import { connect } from 'dva';
import GridContent from './GridContent';
import styles from './index.less';
import MenuContext from '@/layouts/MenuContext';

const PageHeaderWrapper = ({ children, contentWidth, wrapperClassName, top, ...restProps }) => (
  // <div style={{ margin: '-24px -30px 0',position:'absolute',top:50,bottom:0,left:0,right:0 }} className={wrapperClassName}>
  <div 
    style={
      { 
        margin: '-24px -30px 0',
        display:'flex',
        flexDirection:'column',
        flexGrow:1
      }
    } className={wrapperClassName}>
    {top}
    <MenuContext.Consumer>
      {value => (
        <PageHeader
          wide={contentWidth === 'Fixed'}
          home={
            <span>
              <Icon type="home" /> <FormattedMessage id="menu.home" defaultMessage="Home" />
            </span>
          }
          {...value}
          key="pageheader"
          {...restProps}
          linkElement={Link}
          itemRender={item => {
            if (item.locale) {
              return <FormattedMessage id={item.locale} defaultMessage={item.name} />;
            }
            return item.name;
          }}
        />
      )}
    </MenuContext.Consumer>
    {children ? (
      <div 
        style={
          { 
            margin: '6px 14px 0',
            display:'flex',
            flexDirection:'column',
            flexGrow:1 
          }
        } 
        className={styles.content}>
        <GridContent>{children}</GridContent>
      </div>
    ) : null}
  </div>
);

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);
