import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import configSettings from '@/config/defaultSettings'
import { entityRolesDataSource } from '@/const/systemData'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // 'http://localhost:8080', // , // api base_url
  timeout: 1000 * 60 * 5 // 请求超时时间
})

const err = error => {
  console.log('request error', error)
  if (error.response) {
    const data = error.response.data
    // const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 500) {
      notification.error({
        message: 'Server Error',
        description: data.message
      })
    }
    if (error.response.status === 400) {
      notification.error({
        message: 'bad request',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      store.dispatch('Logout').then(() => {
        setTimeout(() => {
          const loginRoleStr = localStorage.getItem('loginRole')
          if (loginRoleStr && loginRoleStr !== '{}') {
            const loginRole = JSON.parse(loginRoleStr)
            const roleData = entityRolesDataSource.find(item => item.role === loginRole.code)
            if (roleData) {
              window.location.href = roleData.loginPath
            } else {
              window.location.reload()
            }
          } else {
            window.location.reload()
          }
        }, 1500)
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  const language = Vue.ls.get('lang') ? Vue.ls.get('lang') : 'zh-TW'
  if (token) {
    console.log('store.getters.roles.code ===', store.getters.roles)
    config.headers['authorization'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    config.headers['language'] = language
    Vue.ls.set(ACCESS_TOKEN, token, configSettings.sessionExpiredTime)
  }
  console.log('config: ', config)
  return config
}, err)

// response interceptor
service.interceptors.response.use(response => {
  console.log('response', response)
  const code = response.data.code || response.data.data.code
  console.log('code: ', code)
  if (code === 200 || code === '200') {
    return response.data
  }
  return Promise.reject(response)
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export { installer as VueAxios, service as axios }
