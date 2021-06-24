/*
能发送异步ajax请求的函数模块
封装axios库
函数的返回值是promise对象
1. 优化1: 统一处理请求异常?
    在外层包一个自己创建的promise对象
    在请求出错时, 不reject(error), 而是显示错误提示
2. 优化2: 异步得到不是reponse, 而是response.data
   在请求成功resolve时: resolve(response.data)
 */

import ajax from "./ajax"
import jsonp from "jsonp"
import { message } from "antd"
import "../assets/data/categorys.json"

const BASE = ''
// 登录
export const regLogin = (username, password) => ajax("/login", { username, password }, "POST")
// 添加用户
export const reqAddUser = user => ajax('/manage/user/add', user, "POST")
// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId})

// export const reqCategorys = (parentId) => ajax("https://3c78cf85-716c-4f10-8496-8dfb511b10ff.mock.pstmn.io/category/list",{parentId},"GET")

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax('/manage/category/add', {categoryName, parentId}, 'POST')

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST')

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})
// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')

/*
搜索商品分页列表 (根据商品名称/商品描述)
searchType: 搜索的类型, productName/productDesc
 */
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName,
  })

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST')


// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')
// 添加角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')
// 删除指定用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')




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
export const reqIP = () => {
    return new Promise((resolve, reject) => {
        const url = `https://restapi.amap.com/v3/ip?key=a3f5a7fbf82c25bba38de755afb0ba44`
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
            // console.log(err, data)
            if(!err && data.status==='1'){
                const adcode = data.adcode
                // console.log(adcode)
                // 参数放到对象里
                resolve({adcode})
            }else{
                message.error("请求IP地址出错")
            }
        })
    })

}

/*
jsonp解决ajax跨域的原理
  1). jsonp只能解决GET类型的ajax请求跨域问题
  2). jsonp请求不是ajax请求, 而是一般的get请求
  3). 基本原理
   浏览器端:
      动态生成<script>来请求后台接口(src就是接口的url)
      定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
   服务器端:
      接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
   浏览器端:
      收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据
 */

