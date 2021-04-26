import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input
} from 'antd'

const Item = Form.Item

/*
添加分类的form组件
 */
export default class AddForm extends Component {

  formRef = React.createRef();

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  componentDidMount() {
    const form = this.formRef.current
    this.props.setForm(form)

  }

  render() {
    // const { getFieldDecorator } = this.props.form
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form ref={this.formRef}>
        <Item
          label='角色名称'
          name="roleName"
          {...formItemLayout}
          initialValue=''
          rules={
            [
              { required: true, message: '角色名称必须输入' }
            ]
          }
        >
          <Input placeholder='请输入角色名称' />
        </Item>
      </Form>
    )
  }
}

