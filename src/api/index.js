// 包含应用中所以接口请求函数的文件
// 每个函数的返回值都是promise

import ajax from "./ajax"
import jsonp from "jsonp"
import { message } from "antd"
import "../assets/data/categorys.json"


// export function regLogin(){
//     return ajax("/login",{username,password},"POST")
// }
// 登录
// export const regLogin = (username, password) => ajax("https://3c78cf85-716c-4f10-8496-8dfb511b10ff.mock.pstmn.io/login", { username, password }, "POST")
export const regLogin = (username, password) => ajax("/login", { username, password }, "POST")
// 添加用户
export const reqAddUser = user => ajax('/manage/user/add', user, "POST")
// 获取分类列表
export const reqCategorys = (parentId) => ajax("https://3c78cf85-716c-4f10-8496-8dfb511b10ff.mock.pstmn.io/category/list",{parentId},"GET")
// 添加分类
export const reqAddCategory = (parentId,categoryName) => ajax("../assets/data/categorys.json",{parentId,categoryName}, "POST")
// 更新分类
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax("../assets/data/categorys.json",{categoryId,categoryName}, "POST")
// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('https://3c78cf85-716c-4f10-8496-8dfb511b10ff.mock.pstmn.io/product/list', {pageNum, pageSize})

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')

// 获取所有角色的列表
export const reqRoles = () => ajax('https://3c78cf85-716c-4f10-8496-8dfb511b10ff.mock.pstmn.io/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')
// 添加角色
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')
// 获取所有用户的列表
// export const reqUsers = () => ajax('/manage/user/list')
export const reqUsers = () => ajax('https://3c78cf85-716c-4f10-8496-8dfb511b10ff.mock.pstmn.io/user/list')

// 删除指定用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', {userId}, 'POST')
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')


// jsonp请求的接口请求函数
// 北京 110101
// 高德地图api
// https://lbs.amap.com/api/webservice/guide/api/weatherinfo
export const reqWeather = (adcode) => {
    return new Promise((resolve, reject) => {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=a3f5a7fbf82c25bba38de755afb0ba44&city=${adcode}`
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
            // console.log(err, data)
            if(!err && data.status==='1'){
                const {province,city,weather,temperature} = data.lives[0]
                // console.log(province,city,weather,temperature)
                // 参数放到对象里
                resolve({province,city,weather,temperature})
            }else{
                message.error("请求天气数据出错")
            }
        })
    })

}

// reqCategorys('0')