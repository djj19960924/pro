import { Upload, Icon, Modal, Button, message } from 'antd';
import React, { PureComponent } from 'react';
import { requestUrl_upload, fileUrl } from '@/global.js';
import styles from './index.less';
message.config({ top: 100 });

class UploadImgs extends PureComponent {
  state = {
    imgList:[]
  };

  beforeUpload = file => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJPG) {
      message.error('只能上传 jpg 或者 png 格式的文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('图片大小不能超过 1 M');
    }
    return isJPG && isLt2M;
  };
  beforeUpload_video = file => {
    const isJPG = file.type === 'video/mp4' || file.type === 'video/avi' || file.type === 'video/3gp';
    if (!isJPG) {
      message.error('只能上传视频格式的文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('视频大小不能超过 10 M');
    }
    return isJPG && isLt2M;
  };

  componentWillReceiveProps(newProps) {
    if(typeof newProps.imgList == 'string'){
      this.setState({imgList:[]})
    }else{
      this.setState({
        imgList:newProps.imgList,
      })
    }
  }

  handleChangeImg = (e) => { // 删除
    // 该版本upload组件使用fileList时onChange只执行一次，并且上传状态一直是uploading，用onSuccess代替done状态
    let arr = this.state.imgList;
    if(e.file.status == 'removed'){ 
      this.props.getImgList(e,'removed')
      arr.forEach((ele,index) => {
        if(ele.uid == e.file.uid){
          arr.splice(index,1)
        }
      })
    }
    this.setState({ imgList: [...arr] })
  }

  onSuccess = res => { // 上传
    let arr = this.state.imgList;
    if(res.code == 200){
      let xxx = res.data.finalFileName.split('/')
      arr.push({
        uid:xxx[xxx.length-1].substring(0,xxx[xxx.length-1].length - 4),
        url:res.data.finalFileName,
        name:xxx[xxx.length-1],
      })
      this.setState({ imgList: [...arr] })
    }else{
      message.error('上传失败')
    }
    this.props.getImgList(res , 'done')
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleCancel = () => this.setState({ previewVisible: false })

  render() {
    let imgList = this.state.imgList , fileList=[];
    if(typeof imgList[0] != 'string'){
      imgList.forEach((ele,index) => {
        // if(ele.url && ele.url.substring(0,4) !== 'http'){
          fileList.push({
            url:fileUrl + '/' + ele.url,
            name:ele.name,
            uid:ele.uid
          })
        // }
      })
    }else{
      fileList=[]
    }

    const { type, max, fileType } = this.props
 
    return (
      <div>
        <Upload
          action={`${requestUrl_upload}/upload/start`}
          data={file => {
            return { file: file };
          }}
          listType={type}
          onChange={this.handleChangeImg}
          fileList={fileList}
          onSuccess={this.onSuccess}
          onPreview={this.handlePreview}
          beforeUpload={fileType == 'video' ? this.beforeUpload_video : this.beforeUpload}
          headers = {{
            authorization: localStorage.getItem("token"),
            id: localStorage.getItem("identityId")
          }}
          loading = {true}
        >
          {
            fileList.length<max&&(
              type == 'picture'?
              <Button type='primary'>
                <Icon type="upload" />上传
              </Button>:
              <Button>
                <Icon type="upload" /> 上传
              </Button>
            )
          }
        </Upload>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    );
  }
}

export default UploadImgs;
