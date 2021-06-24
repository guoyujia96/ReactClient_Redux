import {Modal } from 'antd'
import React, { Component } from 'react'
import "./index.css"
import memoryUtils from "../../utils/memoryUtils"
import storageUtils from "../../utils/storageUtils"
import { withRouter } from 'react-router'
import menuList from "../../config/menuConfig"
import {formateDate} from "../../utils/dateUtils"
import {reqWeather} from '../../api'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LinkButton from "../Link-button"

import {connect} from "react-redux"
import {logout} from '../../redux/actions'

const { confirm } = Modal;



class Header extends Component {
    state = {
        currentTime:formateDate(Date.now()),
        province:'',
        city:'',
        weather:'',
        temperature:''
    }

    componentDidMount(){
        this.timer = setInterval(() => {
            this.setState({currentTime:formateDate(Date.now())})
        }, 1000);

        this.getWeather()
    }
    componentWillUnmount(){
        clearInterval(this.timer)
    }

    getWeather = async () => {
        const {province,city,weather,temperature} = await reqWeather("110101")
        // console.log(province,city,weather,temperature)
        this.setState({province,city,weather,temperature})
    }

    getTitle = () =>{
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key===path) {
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem => cItem.key===path)
                if(cItem){
                    title = cItem.title
                }
            }
        })

        return title
    }
    logout = () => {
        confirm({
            title: '确定退出吗？',
            icon: <ExclamationCircleOutlined />,
           
            onOk: ()=> {
            //   console.log('确定');
                // 删除保存的数据
                // memoryUtils.user = {}
                // storageUtils.removeUser()
                this.props.logout()
                //跳转到登录页面
                // this.props.history.replace('/login')
  
            },
            
          });
    }

    render() {
        const {currentTime,province,city,weather,temperature} = this.state
        // const {username} = memoryUtils.user
        const username = this.props.user.username
        // const title = this.getTitle()
        const title = this.props.headTitle
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎, {username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span> 
                        &nbsp;                
                        <span>{province+","+city+","+weather+","+temperature+"℃"}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(
    state => ({headTitle:state.headTitle,user:state.user}),
    {logout}
)(withRouter(Header))