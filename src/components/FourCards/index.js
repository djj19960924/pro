import { Upload, Icon, Modal } from 'antd';
import React, { PureComponent } from 'react';
import styles from './index.less';
import bg from './bg.png'

class FourCards extends PureComponent {
  render() {
    const { data } = this.props;
    return (
      <div className={styles.container}>
          {
            data.map(ele => (
              <div className={styles.itemP}>
                <div style={{backgroundImage:`url('${bg}')`}} className={styles.item}>
                  <img src={ele.icon}/>
                  <div className={styles.item_right}>
                    <div className={styles.item_right_t}>{ele.value}</div>
                    <div className={styles.item_right_b}>{ele.key}</div>
                  </div>
                </div>
              </div>
            ))
          }
      </div>
    );
  }
}
export default FourCards;