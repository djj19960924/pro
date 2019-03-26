import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './GridContent.less';

class GridContent extends PureComponent {
  render() {
    const { contentWidth, children } = this.props;
    let className = `${styles.main}`;
    if (contentWidth === 'Fixed') {
      className = `${styles.main} ${styles.wide}`;
    }
    return <div style={{display:'flex',flexDirection:'column',flexGrow:1}} className={className}>{children}</div>;
  }
}

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(GridContent);
