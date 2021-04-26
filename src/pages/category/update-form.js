import React, { Component } from 'react'
import PropTypes from "prop-types"
import { Form, Input } from "antd"


// 添加分类的form组件

const Item = Form.Item

export default class UpdateForm extends Component {
    
    formRef = React.createRef()
   

    static propTypes = {
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }

   
    componentDidMount() {
        const form = this.formRef.current
        this.props.setForm(form)
        
      }
      
    render() {
        
        const {categoryName} = this.props 
        // console.log(categoryName)  
        // this.props.setForm(Form.useForm())       
        return (

            
            <Form
                ref={this.formRef}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                
            
            >
                <Item
                    // initialValue={categoryName}
                    name={categoryName}
                    // name="categoryName"
                    rules={[
                        {
                            required: true,
                            message: '请输入分类名称',
                        },
                    ]}
                ><Input defaultValue={categoryName} placeholder="请输入分类名称"/></Item>
            </Form>
        )
    }
}
