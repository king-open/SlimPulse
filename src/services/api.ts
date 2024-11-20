import axios from 'axios'
import { config } from '../config/env'
import { notificationService } from './notification'

const api = axios.create({
  timeout: 5000,
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token')
          window.location.href = '/login'
          notificationService.error('登录已过期', '请重新登录')
          break
        case 403:
          notificationService.error('权限不足', '请联系管理员')
          break
        case 404:
          notificationService.error('请求失败', '未找到相关资源')
          break
        case 500:
          notificationService.error('服务器错误', '请稍后重试')
          break
        default:
          notificationService.error('请求失败', error.response.data?.message || '未知错误')
      }
    } else if (error.request) {
      notificationService.error('网络错误', '请检查网络连接')
    } else {
      notificationService.error('请求错误', error.message)
    }
    return Promise.reject(error)
  }
)

export default api 
