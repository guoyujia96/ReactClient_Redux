import React, { Component } from 'react'
import { Form, Select, Input } from "antd"
import PropTypes from "prop-types"

// 添加分类的form组件

const Item = Form.Item
const Option = Select.Option
export default class AddForm extends Component {

    formRef = React.createRef()

    static propTypes = {
        categorys: PropTypes.array.isRequired,//一级分类数组
        parentId: PropTypes.string.isRequired,//父分类id
        setForm: PropTypes.func.isRequired
    }

    componentDidMount() {
        const form = this.formRef.current
        console.log(form)
        this.props.setForm(form)

    }

    render() {
        // 第一步：取出父类传递过来的参数
        const { categorys, parentId ,parentName} = this.props
        console.log( "addForm.render" ,categorys ,parentId,parentName)
        return (
            <Form
                ref={this.formRef}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
            >
                <Item name="parentId">
                    
                    <Select defaultValue={parentId} style={{ width: "100%" }}>
                        <Option value="0">一级分类</Option>
                        {
                            categorys.map(c => <Option value={c._id}>{c.name}</Option>
                            )
                        }
                    </Select>
                </Item>

                <Item
                    // label="categoryName"
                    name="categoryName"
                    rules={[
                        {
                            required: true,
                            message: '请输入分类名称',
                        },
                    ]} 
                ><Input placeholder="请输入分类名称"></Input></Item>
            </Form>
        )
    }
}
