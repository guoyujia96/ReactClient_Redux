import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { Layout } from 'antd';
import memoryUtils from "../../utils/memoryUtils"
import Header from "../../component/Header"
import LeftNav from "../../component/Left-nav"


import Home from "../home/home"
import Category from "../category/category"
import Product from "../product/product"
import User from "../user/user"
import Role from "../role/role"
import Bar from "../charts/bar"
import Line from "../charts/line"
import Pie from "../charts/pie"
import  NotFound from "../not-found/not-found"

import {connect} from "react-redux"


const { Footer, Sider, Content } = Layout;
class Admin extends Component {
    render() {


        // const user = memoryUtils.user
        const user = this.props.user
  
        // 如果内存中没有user ===> 用户未登录
        if (!user || !user._id) {
            // 在render中实现自动跳转到login
            return <Redirect to="/login" />
        }
        return (
            <Layout style={{minHeight:"100%"}}>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content style={{margin:20,backgroundColor:"#fff"}}>
                            <Switch>
                                <Redirect exact from="/" to="/home"/>
                                <Route path="/home" component={Home}/>
                                <Route path="/category" component={Category}/>
                                <Route path="/product" component={Product}/>
                                <Route path="/user" component={User}/>
                                <Route path="/role" component={Role}/>
                                <Route path="/chart/pie" component={Pie}/>
                                <Route path="/chart/line" component={Line}/>
                                <Route path="/chart/bar" component={Bar}/>
                                <Route component={NotFound}/>
                            </Switch>
                        </Content>
                        <Footer style={{textAlign:'center',color:"#ccc"}}>推荐使用谷歌浏览器，获得更加页面操作体验</Footer>
                    </Layout>
                </Layout>
        )
    }
}

export default connect(
    state => ({user:state.user}),
    {}
)(Admin)