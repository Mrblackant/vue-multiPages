import axios from 'axios'
// import router from '@/router' // 用于在判断错误时的重定向页面，例如404页面等
import {Message, Loading} from 'element-ui'
import {LogDiogFun} from '@/utils/index'
// import qs from 'qs'
// 全局loadding
var loadingInstance
// const baseURL = 'http://kflx.cg.shinyway.org'
// const baseURL = '/proxyapi/'
const baseURL = process.env.BASE_API
// axiso的一些基础参数配置,
const $http = axios.create({
  // baseURL: 'http://kflx.cg.shinyway.org', // 配置在config/prod.env里的baseurl
//  baseURL: 'http://lx.test.org',
  baseURL: baseURL,
  timeout: 30000, // 超时时间,
  withCredentials: true, // 默认的
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded',
    // 'Accept': 'application/json',
    // 'Access-Control-Allow-Credentials': true,
    'X-Requested-With': 'XMLHttpRequest'
  }
})
// 传参拦截器
$http.interceptors.request.use(
  config => {
    // 打开loadding
    loadingInstance = Loading.service({
      lock: true,
      text: '数据加载中，请稍后...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    // 判断为post请求，序列化传来的参数
    // if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
    //   config.data = qs.stringify(config.data)
    // }
    // if (sessionStorage.getItem('MENUCODE')) {
    //   config.headers['menu-code'] = sessionStorage.getItem('MENUCODE')
    // }
    return config
  }, error => {
    // 处理错误信息
    loadingInstance.close()
    Message.error('请求错误')
    return Promise.reject(error)
  })
// 响应拦截器
$http.interceptors.response.use(res => {
  // 请求成功时要做的处理,例如判空等
  loadingInstance.close()
  //   1.判空
  if (res.data === '' || res.data.length === 0 || res.data === 'undefined' || res.data === undefined) {
    Message.error('后台传来的data为空/为undefined')
  }
  return res.data
}, error => {
  // 请求错误时做些事(接口错误、超时等)
  // 关闭loadding
  loadingInstance.close()
  // console.log(error) // 打开控制台，可以看到error包含了几个对象:message, config, code, request, response,可以拿来请求超时等问题
  //  1.判断请求超时
  if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    // Message.error('根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案')
    Message.error('请求网络超时，请查看您网络是否正常！')
    // return $http.request(originalRequest);//例如再重复请求一次
  }
  //  2.需要重定向到错误页面
  const errorInfo = error.response
  // Message.error('程序错误')
  LogDiogFun(errorInfo)
//	return errorInfo
  // 在调用的那边可以拿到(catch)你想返回的错误信息
  return Promise.reject(error)
})

function getUrl(url) {
  if (url) {
    let uri = url.substr(0, url.indexOf('#'))
    return uri
  }
}

export default $http
