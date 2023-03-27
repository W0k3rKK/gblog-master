import axios from 'axios';
import config from './config';
import Cookies from "js-cookie";
import router from '@/router'

export default function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      method: config.method,
      baseURL: config.baseUrl,
      headers: config.headers,
      timeout: config.timeout,
      withCredentials: config.withCredentials
    })

    // request 拦截器
    instance.interceptors.request.use(
      config => {
        let token = Cookies.get('token')
        if (!token) {
          // 重定向到登录页面
          if (config.url !== 'login') {
            router.push('/login').catch(() => {})
          }
        }
        return config
      },
      error => {
        // 请求错误时
        console.log('request:', error)
        // 1. 判断请求超时
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
          console.log('timeout请求超时')
        }
        // 2. 需要重定向到错误页面
        const errorInfo = error.response
        if (errorInfo) {
          error = errorInfo.data  // 页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
          const errorStatus = errorInfo.status; // 404 403 500 ...
          router.push({
            path: `/error/${errorStatus}`
          })
        }
        
        return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    )

    // response 拦截器
    instance.interceptors.response.use(
      response => {
        if (response.headers['content-type'] === "application/octet-stream") {
          return response;
        } else if (response.data) {
          if (response.data.code === '302') {
            window.location.href = response.data.message;
            return {};
          }
          return response.data
        } else {
          return JSON.parse(response.request.responseText)
        }
      },
      err => {
        if (err && err.response && err.response.status) {
          switch (err.response.status) {
            case 400:
              err.message = '请求错误'
              break
            case 401:
              err.message = '未登录或登录超时，请重新登录'
              break
            case 403:
              err.message = '权限不足，请与管理员联系'
              break
            case 404:
              err.message = `请求地址不存在: ${err.response.config.url}`
              break
            case 408:
              err.message = '请求超时'
              break
            case 500:
              err.message = '服务器内部错误'
              break
            case 501:
              err.message = '服务未实现'
              break
            case 502:
              err.message = '网关错误'
              break
            case 503:
              err.message = '服务不可用'
              break
            case 504:
              err.message = '服务请求超时'
              break
            case 505:
              err.message = 'HTTP版本不受支持'
              break
            default:
          }
        }
        console.log(err)
        if (err.message && err.message.indexOf('timeout') >= 0) {
          err.message = '服务请求超时'
        }
        if (err.response && err.response.status === 401) {
          sessionStorage.clear()
          Cookies.remove("token")
          location.reload();
          
          //router.push('/login').catch(() => {})
        } else if(err.message === '路由跳转取消请求') {
          console.error('cancel err: ', err)
          return Promise.reject({message: '页面跳转取消加载原页面数据'});
        } else {
          console.error('catch err: ', err)
          return Promise.reject(err) // 返回接口返回的错误信息
        }
      }
    )

    // 请求处理
    instance(options).then(res => {
      resolve(res)
      return false
    }).catch(error => {
      reject(error)
    })
  })
}