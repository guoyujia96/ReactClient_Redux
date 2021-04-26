import React, { Component } from 'react'
import {Route,Switch,Redirect} from "react-router-dom"
import ProductHome from "./home"
import ProductAddUpdate from "./add-update"
import ProductDetail from './detail'
//引入样式
import "./product.less"

export default class Product extends Component {
    render() {
        return (
            <Switch>
                {/* 路径完全匹配 */}
                <Route exact path="/product" component={ProductHome}></Route>
                <Route path="/product/addupdate" component={ProductAddUpdate}></Route>
                <Route path="/product/detail" component={ProductDetail}></Route>
                <Redirect to="/product"/>
            </Switch>

        )
    }
}
