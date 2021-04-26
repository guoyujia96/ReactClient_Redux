// 封装一个能发送ajax请求的函数模块
// 函数的返回值是promise对象
// 1.优化：统一处理请求异常
//         在外层包一个自己创建的promise对象，在请求出错时，不调用reject(error)，而是显示错误提示
// 2.优化：异步得到的直接是response.data，

import { message } from "antd"
import axios from "axios"

export default function ajax(url, data = {}, method = "GET") {
    // 这儿返回的promise对象不会出错，因为内部已经把错误处理掉了，所以外部直接处理数据即可
    return new Promise((resolve,reject) => {
        let promise
        //1.异步请求ajax
    if (method === "GET") {
        promise = axios.get(url, {
            params: data
        })
    }else{
        promise = axios.post(url,data)
    }

    //如果成功了，调用resolve
    promise.then(response => {
        resolve(response)
        // resolve(response.data)
    }).catch(error => {
        message.error("请求出错了" + error)
    })
    })
    
    // if(method ==='GET'){
    //     return axios.get(url,{
    //         params:data
    //     })
    // }else{
    //     return axios.post(url,data)
    // }
    
}