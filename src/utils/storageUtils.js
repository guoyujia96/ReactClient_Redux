/*
    进行local数据存储管理的工具模块

    原生语法localstorage有些浏览器不兼容，所以引入一个库store
*/

import store from 'store'
// 为什么要user_key
const USER_KEY = "user_key"
export default{
    // 保存user
    saveUser(user){
        
        // localStorage.setItem(USER_KEY,JSON.stringify(user))
        // 第二个参数要传递的是string类型的数据
        // 对象的toString()方法返回的是[object Object]
        store.set(USER_KEY,user)
    },
    // 读取
    getUser(){
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY )|| {}
    },
    // 删除
    removeUser(){
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}