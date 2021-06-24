/*
    进行local数据存储管理的工具模块

    原生语法localstorage有些浏览器不兼容，所以引入一个库store
*/

import store from 'store'

const USER_KEY = "user_key"
export default{
    // 保存user
    saveUser(user){
        store.set(USER_KEY,user)
    },
    // 读取
    getUser(){
        return store.get(USER_KEY )|| {}
    },
    // 删除
    removeUser(){
        store.remove(USER_KEY)
    }
}