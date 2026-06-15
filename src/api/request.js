import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: process.env.VUE_APP_API_BASE || 'http://localhost:3001',
  timeout: 8000
})

request.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || error.message || '接口请求失败'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default request
