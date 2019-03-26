import { Spin } from 'antd';
import React, { PureComponent } from 'react';
import styles from './index.less';

class Loading extends PureComponent {
  render() {
    const loading = this.props.loading;
    return (
      <div style={loading ? {} : { display: 'none' }} className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }
}

export default Loading;
