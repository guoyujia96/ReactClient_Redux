import React, { Component } from 'react'
import { Button, Card, Table, Modal, message } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import LinkButton from "../../component/Link-button"
import { reqCategorys,reqUpdateCategory,reqAddCategory } from "../../api/index"
import AddForm from "./add-form"
import UpdateForm from "./update-form"
import "./category.less"




export default class Category extends Component {

    state = {
        loading: false, //是否正在获取数据中
        categorys: [],//一级分类列表
        subCategorys: [],//二级分类列表
        parentId: '0',//当前需要显示的分类列表的父分类ID
        parentName: '',//当前需要显示的分类列表的父分类名称
        showStatus: 0 //标识添加/更新的确认框是否显示，0：都不显示，1：显示添加 2：显示更新
    }
   
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',//显示对应属性名的数据
                key: 'name',
            },
            {
                title: '操作',
                width: 300,
                dataIndex: '',
                key: 'age',
                //   返回需要显示的界面标签
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {/* 如何向事件回调函数传递参数：先定义一个匿名函数，在函数体中调用处理函数并传入参数 */}
                        {
                            this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton> : null
                        }
                    </span>
                )
            },

        ]
    }


    // 异步获取一级/二级列表展示
    getCategory = async () => {

        // 发请求前显示loading
        this.setState({ loading: true })

        // console.log("1   " + this.state.parentId)
        // 发异步ajax请求获取数据
        const result = await reqCategorys(this.state.parentId)
        // console.log(result.data)

        if (result.status === 0) {
            // 取出分类数据，可能是一级也可能是二级
            const categorys = result.data
            // 更新一级分类的状态
            if (this.state.parentId === '0') {
                this.setState({ categorys, loading: false })
            } else {
                // 更新二级分类的状态
                this.setState({ subCategorys: categorys, loading: false })
            }
        }

    }


    // 显示当前一级列表对应的二级列表
    showSubCategorys = (category) => {

        // setState()是异步更新状态，setState完不能立即读取更新后的状态
        //先更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            // 在状态更新且重新render()后执行 
            // 获取二级分类列表
            this.getCategory()
        })


    }

    // 点击按钮显示一级分类列表
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }

    // 添加按钮的点击事件  显示添加的确认框
    showAdd = () => {
        this.setState({ showStatus: 1 })
    }

    // 修改按钮点击事件：显示修改分类的确认框
    showUpdate = (category) => {
        // 保存分类对象
        this.category = category
        // console.log(category.name)
        this.setState({
            showStatus: 2
        })
    }

    // 点击确定按钮添加category
    addCategory = () => {
        this.form.validateFields().then(async values => {
            const { categorys } = this.state
        // 隐藏确定框
        this.setState({
            showStatus: 0
        })

        // 搜集数据
        const {categoryName,parentId} = values;
        // const categoryName = this.form.getFieldValue("categoryName")
        // const parentId = this.form.getFieldValue("parentId") || '0'
        console.log(parentId, categoryName,values)
        // 清除输入的数据
        this.form.resetFields()
        const result = await reqAddCategory(categoryName, parentId)
        if(result.status===0) {

          // 添加的分类就是当前分类列表下的分类
          if(parentId===this.state.parentId) {
            // 重新获取当前分类列表显示
            this.getCategory()
          } else if (parentId==='0'){ // 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要显示一级列表
            this.getCategory('0')
          }
        }
        })
        
    }
    // 确认更新分类的回调
    updateCategory =() => {

        //进行表单验证，只有通过了才处理
        this.form.validateFields()
            .then(async values => {
                // 隐藏确定框
                this.setState({
                    showStatus: 0
                })

                const categoryId = this.category._id
                // console.log(categoryId)
                // 获取确认框输入的字段：如果没有输入则保持原来的值
                const categoryName = this.form.getFieldValue(this.category.name) || this.category.name
                // const categoryName = this.form.getFieldValue("categoryName") 

                // console.log(categoryName)//
                //发送请求更新分类
                const result = await reqUpdateCategory({categoryId,categoryName})

                if (result.status===0) {
                    // 3. 重新显示列表
                    this.getCategory()
                  }
              



                // 清除输入的数据
                this.form.resetFields()
            })


    }
    // 显示/隐藏添加分类提示框
    handleCancel = () => {
        // 清除输入的数据
        this.form.resetFields()
        this.setState({ showStatus: 0 })
    }

    componentWillMount() {
        this.initColumns();
    }
    // 显示分类列表
    componentDidMount() {
        this.getCategory()
    }
    setForm = (form) => {
        this.form = form
        // console.log(form)
    }

    render() {
        // 读取对应分类
        // category是在showUpdate中才保存的，第一次render的时候是undefined
        const category = this.category || {} // 如果还没有指定一个空对象

        const { categorys, loading, parentId, parentName, subCategorys, showStatus } = this.state
        // card的左侧
        const title = parentId === '0' ? "一级分类列表" : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton><ArrowRightOutlined style={{ marginRight: 5 }} />
                <span>{parentName}</span>
            </span>
        )
        // card的右侧
        const extra = (
            <Button onClick={this.showAdd} type="primary"><PlusOutlined />添加</Button>
        )
        return (
            <Card title={title} extra={extra} >
                {/* 一级分类parentId='0'， */}
                <Table
                    rowKey="_id"
                    bordered
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    pagination={{ showQuickJumper: true, defaultPageSize: 5 }}
                    loading={loading} />;

                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    // confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <AddForm categorys={categorys} parentId={parentId} setForm={this.setForm} parentName={parentName} />
                </Modal>
                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    // confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    {/* 将二级分类对应的一级分类传递给form表单 */}
                    <UpdateForm categoryName={category.name} setForm={this.setForm} />
                </Modal>
            </Card>
        )
    }
}
