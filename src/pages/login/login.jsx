import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'

import "./index.less"
import logo from "../../assets/image/logo.png"
import memoryUtils from "../../utils/memoryUtils"
import { Redirect } from 'react-router'
import {regLogin} from "../../api/index"
import storageUtils from "../../utils/storageUtils"
import {connect} from "react-redux"
import { login} from "../../redux/actions"

const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };
   class Login extends Component {
  
     onFinish = (values) => {
        // console.log('Success:', values);
        const {username,password} = values;
        // console.log(username,password)
        // 调用分发异步action的函数
        this.props.login(username,password)
        // regLogin(username,password).then(response => {
        //     console.log("成功了",response.data)//返回的数据包含status和data
        //     const result = response.data
        //     if(result.status === 0){
        //         // 登陆成功
        //         message.success("登录成功")
        //         console.log(result.data)
        //         // 跳转之前保存数据到内存中
        //         memoryUtils.user = result.data//id username password
        //         storageUtils.saveUser(result.data)//id username password
        //         // 跳转到管理界面:因为不需要回退，所以不要push()用replace()
        //         this.props.history.replace('/home')
        //     }else{
        //         // 登录失败，提示错误信息
        //         message.error(result.msg)
        //     }
        // }).catch(error => {
        //     console.log("失败了",error)
        // }); // alt + <= 回退
      };
    
       onFinishFailed = (errorInfo) => {
        console.log('校验Failed:', errorInfo);
      };

    render() {

        // 如果已经登录，自动跳转到管理页面
        // const user = memoryUtils.user
        const user = this.props.user
        if(user && user._id){
            return <Redirect to="/home"/>
        }
        
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className="login-content">
                <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
                    <h2>用户登录</h2>
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        className="login-form"
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            // 直接声明式
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名',
                                },
                                {
                                    max:12,message:"用户名最多12位"
                                },
                                {
                                    min:4,message:"用户名最少4位"
                                },
                                {
                                    pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是英文、数组或下划线组成'
                                }
        
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                    
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit" >
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {login}
)(Login)