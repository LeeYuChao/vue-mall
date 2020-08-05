import axios from 'axios'
import { Message } from 'element-ui';
// 创建实例时设置配置的默认值 创建axios，赋给变量service 地址 https://some-domain.com/api/  
const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/api'
const service = axios.create({
    baseURL: BASEURL,
    timeout: 10000
});
/**
 * 请求接口前，做一些数据处理（请求拦截器）  console.log(process.env.NODE_ENV)  查看环境 development
 */
service.interceptors.request.use(function (config) {
    //在发送请求之前做些什么
    //后台需要前端这边传相关的参数（在请求头添加参数）
    config.headers['Tokey'] = '111111';
    config.headers['userId'] = '12312312';
    console.log(config)
    return config;
}, function (error) {
    // 在请求错误后做些什么
    return Promise.reject(error);
});
/**
 * 请求接口后，返回数据进行拦截（响应拦截器）
 */
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    let data = response.data
    //返回的状态码为0才可以正常返回数据，否则将提示错误消息
    if(data.resCode !== 0){
        Message.error(data.message);
        //抛出异常，进入catch
        return Promise.reject(data);
    }else{
        //正确的数据
        return response;
        //进入 then
        return Promise.resolve;
    }
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
/**
 * 使用 export default时，但不能同时存在多个 default
 * 文件 import 不需要使用花括号
 */
export default service;

