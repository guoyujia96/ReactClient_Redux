import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'

import "./index.less"
import logo from "../../assets/image/logo.png"
import memoryUtils from "../../utils/memoryUtils"
import { Redirect } from 'react-router'
import { regLogin } from "../../api/index"
import storageUtils from "../../utils/storageUtils"
import { connect } from "react-redux"
import { login } from "../../redux/actions"

import cookie from "react-cookies"

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
        const { username, password } = values;
        // console.log(username,password)
        // 调用分发异步action的函数
        this.props.login(username, password)
        
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
        // // console.log(user)
        // if (user && user._id) {
        //     return <Redirect to="/home" />
        // }
        const userInfo =cookie.load('userInfo') 
        console.log(userInfo)
        if(userInfo){

            var name = JSON.parse(userInfo.slice(2,userInfo.lebgth)).username
            if(name === user.username){
                return <Redirect to="/home" />
            }
            return <Redirect to="/login" />
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
                                    whitespace: true
                                },
                                {
                                    max: 12, message: "用户名最多12位"
                                },
                                {
                                    min: 4, message: "用户名最少4位"
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数组或下划线组成'
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
    state => ({ user: state.user }),
    { login }
)(Login)
/*
1. 高阶函数
    1). 一类特别的函数（满足一点即可）
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */


/*
1. 前台表单验证
2. 收集表单输入数据
*/

/*
async和await
1. 作用?
   简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
   以同步编码(没有回调函数了)方式实现异步流程
2. 哪里写await?
    在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
3. 哪里写async?
    await所在函数(最近的)定义的左侧写async
 */

