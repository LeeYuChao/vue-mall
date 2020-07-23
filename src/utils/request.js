import axios from 'axios'

// 创建实例时设置配置的默认值 创建axios，赋给变量service 地址 https://some-domain.com/api/  
const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi'
const service = axios.create({
    baseURL: BASEURL,
    timeout: 1000
});

// console.log(process.env.NODE_ENV)  查看环境 development
// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

/**
 * 使用 export default时，但不能同时存在多个 default
 * 文件 import 不需要使用花括号
 */
export default service;

