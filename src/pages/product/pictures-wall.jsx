import React from 'react'

import { Upload, Icon, Modal, message } from 'antd'
import {reqDeleteImg} from "../../api/index"


// function getBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   });
// }
/*
用于图片上传的组件
 */
export default class PicturesWall extends React.Component {

  
  state = {
    previewVisible: false, //标识是否显示大图晕染
    previewImage: '', // 大图的url
    fileList: []
  };

  // 获取img名称数组的函数，数组在表单提交时使用
  getImgs = ()=>{
    return this.state.fileList.map(file => file.name)
  }
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    // 显示指定的file对应的大图
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj);
    // }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  // 监视图片的status 所以上传过程中会调用不只一次
  handleChange = async({file,fileList} ) => {
    console.log("handlechange",file.status,fileList.length,file)
    // 一旦上传成功，就对当前上传的文件进行修正 name url
    if(file.status ==='done'){
      const result = file.response
      if(result.status ===0){
        message.success("上传图片成功!")
        const {name,url} = result.data
        file = fileList[fileList.length -1]
        file.name = name;
        file.url = url;
      }else{
        message.error("上传图片失败")
      }

    }else if(file.status === "removed"){//只是在页面上(前台)删除图片
      console.log("remove")
      const result = await reqDeleteImg(file.name)
      console.log(result)
      if(result.data.status === 0){
        message.success("删除图片成功!")
      }else(
        message.error("删除图片失败")
      )
    }

    this.setState({ fileList })
  };


  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload" // 上传图片的地址
          // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          accept="image/*" // 只接受图片格式
          name="image" //请求参数名，就是接口请求时的需要传递的参数名
          listType="picture-card"
          fileList={fileList} //已上传文件列表
          onPreview={this.handlePreview} //
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}