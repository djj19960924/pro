import { Upload, Icon, Modal,message } from 'antd';
import React, { PureComponent } from 'react';
import { requestUrl_upload, fileUrl } from '@/global.js';
import styles from './index.less';

class UploadImg extends PureComponent {
  state = {
    loading: false,
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

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      let imgUrl = fileUrl + '/' + info.file.response.data.finalFileName;
      this.setState({ imgUrl,loading:false });
      this.props.getImgUrl(info.file.response.data.finalFileName);
    }
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const imgUrl = this.state.imgUrl || (fileUrl + '/' + this.props.imgUrl);

    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={`${requestUrl_upload}/upload/start`}
        data={file => {
          return { file: file };
        }}
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
        headers = {{
          authorization: localStorage.getItem("token"),
          id: localStorage.getItem("identityId")
        }}
      >
        {(this.props.imgUrl && !this.state.loading) ? <img className={styles.previewImg} src={imgUrl} alt="avatar" /> : uploadButton}
      </Upload>
    );
  }
}

export default UploadImg;
