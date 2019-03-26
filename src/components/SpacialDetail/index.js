import {  } from 'antd';
import React, { PureComponent } from 'react';
import styles from './index.less';
import { fileUrl } from '@/global';

class SpacialDetail extends PureComponent {
  state = {
    
  };

  render() {
    const specialInfo = this.props.specialInfo;

    return <div>
    {
      specialInfo ? (
        <div className={styles.table}>
          <table>
            <tbody>
              <tr>
                <td style={{padding:5}} rowSpan={4} colSpan={2}>
                  <div className={styles.head}>
                    <img src={`${fileUrl}/${specialInfo.headimg}`}/>
                  </div>
                </td>
                <td className={styles.label}>姓名</td>
                <td className={styles.value}>{specialInfo.name?specialInfo.name:'--'}</td>
                <td className={styles.label}>性别</td>
                <td className={styles.value}>{specialInfo.sex==1?'男':specialInfo.sex==2?'女':'--'}</td>
                <td className={styles.label}>联系方式</td>
                <td className={styles.value}>{specialInfo.phone?specialInfo.phone:'--'}</td>
              </tr>
              <tr>
                <td className={styles.label}>出生年月</td>
                <td className={styles.value}>{specialInfo.birthday?specialInfo.birthday:'--'}</td>
                <td className={styles.label}>籍贯</td>
                <td className={styles.value}>{specialInfo.origo?specialInfo.origo:'--'}</td>
                <td className={styles.label}>电子邮箱</td>
                <td className={styles.value}>{specialInfo.email?specialInfo.email:'--'}</td>
              </tr>
              <tr>
                <td className={styles.label}>所在地区</td>
                <td className={styles.value}>{specialInfo.fullname?specialInfo.fullname:'--'}</td>
                <td className={styles.label}>服务类别</td>
                <td className={styles.value} colSpan={3}>{specialInfo.servicetypename?specialInfo.servicetypename:'--'}</td>
              </tr>
              <tr>
                <td className={styles.label}>工作单位</td>
                <td className={styles.value} colSpan={5}>{specialInfo.workunit?specialInfo.workunit:'--'}</td>
              </tr>
              
              {/* 专业背景 */}
              <tr>
                <td className={styles.title} colSpan={8}>
                  <div>
                    <b>专业背景</b>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{minWidth:0}} className={styles.label}>从事专业</td>
                <td style={{minWidth:0}} className={styles.value}>{specialInfo.specialty?specialInfo.specialty:'--'}</td>
                <td className={styles.label}>最高学历</td>
                <td className={styles.value}>{
                  specialInfo.education==2?'中专':
                  specialInfo.education==3?'高中':
                  specialInfo.education==4?'大专':
                  specialInfo.education==5?'本科':
                  specialInfo.education==6?'研究生':
                  specialInfo.education==7?'博士':
                  specialInfo.education==8?'其他':
                  '--'}</td>
                <td className={styles.label}>毕业院校</td>
                <td className={styles.value}>{specialInfo.universities?specialInfo.universities:'--'}</td>
                <td className={styles.label}>是否留学</td>
                <td className={styles.value}>{specialInfo.abroadstudy?'是':'否'}</td>
              </tr>
  
              {/* 职业信息 */}
              <tr>
                <td className={styles.title} colSpan={8}>
                  <div>
                      <b>职业信息</b>
                  </div>
                </td>
              </tr>
              <tr>
                <td className={styles.label} colSpan={2}>所在院/部门</td>
                <td className={styles.value} colSpan={2}>{specialInfo.department?specialInfo.department:'--'}</td>
                <td className={styles.label} colSpan={2}>职务/头衔</td>
                <td className={styles.value} colSpan={2}>{specialInfo.postionname?specialInfo.postionname:'--'}</td>
              </tr>
              <tr>
                <td className={styles.label} colSpan={2}>技术职称</td>
                <td className={styles.value} colSpan={2}>{specialInfo.professional_titles?specialInfo.professional_titles:'--'}</td>
                <td className={styles.label} colSpan={2}>社会学术任职</td>
                <td className={styles.value} colSpan={2}>{specialInfo.society_titles?specialInfo.society_titles:'--'}</td>
              </tr>
  
              {/* 个人简介 */}
              <tr>
                <td className={styles.title} colSpan={8}>
                  <div>
                      <b>个人简介</b>
                  </div>
                </td>
              </tr>
              <tr>
                <td className={styles.value} colSpan={8}>{specialInfo.introduction?specialInfo.introduction:'--'}</td>
              </tr>
              <tr>
                <td className={styles.label} colSpan={2}>个人证件</td>
                <td colSpan={6}>
                  {
                    specialInfo.qualifications?
                    <a target='_blank' href={`${fileUrl}/${specialInfo.qualifications}`}>查看</a>:'无'
                  }
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

export default SpacialDetail;
