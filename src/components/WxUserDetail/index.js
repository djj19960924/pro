import {  } from 'antd';
import React, { PureComponent } from 'react';
import styles from './index.less';
import Area from '@/components/Charts/Area';
import { fileUrl } from '@/global';

class WxUserDetail extends PureComponent {
  state = {
    
  };

  render() {
    const wxUserInfo = this.props.wxUserInfo;

    let stepInfoList = [];

    wxUserInfo && 
    wxUserInfo.stepInfoList.forEach(ele => {
      stepInfoList.push({
        key:ele.timestamp,
        value:Number(ele.step)
      })
    });

    return <div>
    {
      wxUserInfo ? (
        <div className={styles.table}>
          <table>
            <tbody>
              <tr>
                <td className={styles.title} colSpan={8}>
                  职业信息
                </td>
              </tr>
              <tr>
                <td className={styles.label}>用户名</td>
                <td className={styles.value}>{wxUserInfo.name || '--'}</td>
                <td className={styles.label}>性别</td>
                <td className={styles.value}>{wxUserInfo.sex == 1 ? '男' : wxUserInfo.sex == 2 ? '女' : '--'}</td>
                <td className={styles.label} >年龄</td>
                <td className={styles.value}>{wxUserInfo.age || '--'}</td>
                <td className={styles.label} >人群类别</td>
                <td className={styles.value}>{wxUserInfo.groupName || '--'}</td>
              </tr>
              <tr>
                <td className={styles.label}>身高</td>
                <td className={styles.value}>{wxUserInfo.score || '--'} cm</td>
                <td className={styles.label}>体重</td>
                <td className={styles.value}>{wxUserInfo.tz || '--'} kg</td>
                <td colSpan={4}></td>
              </tr>
              <tr>
                <td className={styles.title} colSpan={8}>
                  体测数据
                </td>
              </tr>
              <tr>
                <td className={styles.label}>肺活量</td>
                <td className={styles.value}>{wxUserInfo.fhl && (wxUserInfo.fhl + ' ml') || '--'}</td>
                <td className={styles.label}>俯卧撑</td>
                <td className={styles.value}>{wxUserInfo.fwc && (wxUserInfo.fwc + ' 个') || '--'}</td>
                <td className={styles.label} >仰卧起坐</td>
                <td className={styles.value}>{wxUserInfo.ywqz && (wxUserInfo.ywqz + ' 个') || '--'}</td>
                <td className={styles.label} >台阶测试</td>
                <td className={styles.value}>{(wxUserInfo.tjcs) || '--'}</td>
              </tr>
              <tr>
                <td className={styles.label}>握力</td>
                <td className={styles.value}>{wxUserInfo.wl && (wxUserInfo.wl + ' kg') || '--'}</td>
                <td className={styles.label}>纵跳</td>
                <td className={styles.value}>{wxUserInfo.ztgd && (wxUserInfo.ztgd + ' cm') || '--'}</td>
                <td className={styles.label} >反应时</td>
                <td className={styles.value}>{wxUserInfo.fysj && (wxUserInfo.fysj + ' 秒') || '--'}</td>
                <td className={styles.label} >稳定性</td>
                <td className={styles.value}>{wxUserInfo.wdx && (wxUserInfo.wdx + ' 秒') || '--'}</td>
              </tr>
              <tr>
                <td className={styles.label}>坐位体前屈</td>
                <td className={styles.value}>{wxUserInfo.zwtqq && (wxUserInfo.zwtqq + ' cm') || '--'}</td>
                <td colSpan={6}></td>
              </tr>
              <tr>
                <td className={styles.title} colSpan={8}>
                  运动数据(步数)
                </td>
              </tr>
              <tr>
                <td style={{height:200}} colSpan={8}>
                  <Area
                    line
                    height={100}
                    data={stepInfoList}
                    alias='步数'
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ):<div style={{textAlign:'center'}}>暂无信息</div>
    }
    </div>
    
  }
}

export default WxUserDetail;
