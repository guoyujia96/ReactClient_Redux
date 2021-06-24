import React, { Component } from 'react'
import { Card, Input, Cascader, Upload, Form, Button, message } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import LinkButton from "../../component/Link-button"
import { reqCategorys ,reqAddOrUpdateProduct} from "../../api/index"
import PicturesWall from "./pictures-wall"
import RichTextEditor from "./rich-text-editor"

const Item = Form.Item;
// Input下的TextArea组件，多行输入框
const { TextArea } = Input;

export default class AddUpdate extends Component {

    state = {
        options: []
    }

    // 创建一个容器
    myRef = React.createRef()
    editor = React.createRef()
    onFinish =async (values) => {
        //提交表单且数据验证成功后回调事件
        // console.log(value)
        // message.success("成功")
        // alert("添加成功，" + value.name +","+ value.price+","+value.desc)
        
        // 1. 收集数据, 并封装成product对象
        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length===1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.myRef.current.getImgs()
        const detail = this.editor.current.getDetail()

        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}

        console.log(product)
        // 如果是更新, 需要添加_id
        if(this.isUpdate) {
            product._id = this.product._id
          }
  
          // 2. 调用接口请求函数去添加/更新
          const result = await reqAddOrUpdateProduct(product)
  
          console.log(result)
          // 3. 根据结果提示
          if (result.status===0) {
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
            this.props.history.goBack()
          } else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
          }
        // console.log(detail)
        // message.success(this.isUpdate? "更新商品信息成功":"添加商品信息成功")

    }

    /*
       加载下一级列表的回调函数
   */
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;

        // 根据选中的分类, 请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        // load options lazily

        // 二级分类数组有数据
        if (subCategorys && subCategorys.length > 0) {
            // 生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            // 关联到当前option上
            targetOption.children = childOptions
        } else { // 当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
        targetOption.loading = false;

        this.setState({
            options: [...this.state.options]
        });
    };


    // async函数的返回值是一个promise对象，promise的结果喝值由async的结果觉得
    getCategorys = async (parentId) => {
        // console.log("1   " + this.state.parentId)
        // 发异步ajax请求获取数据
        const result = await reqCategorys(parentId)
        // console.log(result.data)

        // debugger
        // 取出分类数据，可能是一级也可能是二级
        const categorys = result.data
        // 更新一级分类的状态
        if (parentId === '0') {
            this.initOptions(categorys);
        } else {
            return categorys  // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys

        }
    }

    initOptions = async(categorys) => {
        // 根据categorys数组生成options数组
        // 返回对象的话就得放到小括号里
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        // 如果是一个二级分类商品的更新
    const {isUpdate, product} = this
    const {pCategoryId} = product
    if(isUpdate && pCategoryId!=='0') {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value===pCategoryId)

      // 关联对应的一级option上
      targetOption.children = childOptions
    }


        // 更新options状态
        this.setState({ options })
    }

    componentDidMount() {
        this.getCategorys('0');
    }
    componentWillMount(){
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}
    }

    render() {
        const {isUpdate,product} = this
 
        const {pCategoryId, categoryId, imgs, detail} = product
    // 用来接收级联分类ID的数组
    const categoryIds = []
    if(isUpdate) {
      // 商品是一个一级分类的商品
      if(pCategoryId==='0') {
        categoryIds.push(categoryId)
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 },  // 左侧label的宽度
            wrapperCol: { span: 8 }, // 右侧包裹的宽度
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}><ArrowLeftOutlined style={{ fontSize: 20 }} /></LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        return (
            <Card title={title}>
                <Form {...formItemLayout} onFinish={this.onFinish}>
                    <Item initialValue={product.name} label="商品名称" name="name" rules={[{ required: true ,message:"必须输入商品名称"}]}>
                        <Input placeholder='请输入商品名称' />
                    </Item>
                    <Item initialValue={product.desc} label="商品描述" name="desc" rules={[{ required: true ,message:"必须输入商品描述"}]}>
                        <TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6 }} />
                    </Item>
                    <Item initialValue={product.price} label="商品价格" name="price"
                        rules={[
                            { required: true,message:"必须输入商品价格" },
                            // 自定义验证价格的函数
                            {
                                validator(_, value) {
                                    if (value * 1 > 0) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('输入的价格必须为正数'));
                                },
                            }
                        ]}>
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
                    </Item>
                    <Item label="商品分类" name="categoryIds" initialValue={categoryIds} rules={[{ required: true ,message:"必须输入商品分类"}]}>
                        {/* cascader：级联选择 */}
                        <Cascader
                            placeholder='请指定商品分类'
                            options={this.state.options}  /*需要显示的列表数据数组*/
                            loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                        />
                    </Item>
                    <Item label="商品图片" name="image">
                        <PicturesWall ref={this.myRef} imgs={imgs} />
                    </Item>
                    <Item label="商品详情" name='detail' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item>
                        <Button type='primary' htmlType="submit">提交</Button>
                    </Item>
                </Form>
            </Card>

        )
    }
}
