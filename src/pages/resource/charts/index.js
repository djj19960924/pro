import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import styles from './charts.less';
import bg from '@/assets/charts_changguan.png'

class Charts extends React.PureComponent {
  render() {
    const {  } = this.props;
    return (
      <div className={styles.container}>
        <img className={styles.bg} src={bg}/>
      </div>
    );
  }
}

export default Charts;