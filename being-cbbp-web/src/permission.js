import Vue from 'vue'
import router from './router'
import store from './store'
import config from '@/config/defaultSettings'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { entityRolesDataSource } from '@/const/systemData'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = [
  'login',
  'adminlogin',
  'loginImporter',
  'loginCustoms',
  'loginCb',
  'loginExporter',
  'createAccount',
  'forgetPassword',
  'resetPassword',
  'success',
  'resetSuccess',
  'invalidInviteCode',
  'userEmailExist'
] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta &&
    (typeof to.meta.title !== 'undefined' && setDocumentTitle(window.app.$i18n.t(to.meta.title) + ` - ${domTitle}`))
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    Vue.ls.set(ACCESS_TOKEN, token, config.sessionExpiredTime)
    console.log('router.beforeEach to', to)
    /* has token */
    if (to.path && to.path.indexOf('login') !== -1) {
      const currentRoleData = entityRolesDataSource.find(item => item.loginPath === to.path)
      if (currentRoleData) {
        next({ name: currentRoleData.routerNameHome })
      } else {
        next({ path: '/' })
      }
    } else {
      // console.log('store.getters.roles', JSON.stringify(store.getters.roles))
      if (JSON.stringify(store.getters.roles) === '{}') {
        store
          .dispatch('GetInfo')
          .then(() => {
            store.dispatch('GenerateRoutes', store.getters.userInfo).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              // console.log("router.beforeEach store.getters.addRouters", store.getters.addRouters)
              // console.log("router.beforeEach to", to)
              // console.log("router.beforeEach from", from)
              // console.log("router.beforeEach redirect", redirect)

              if (to.path === redirect) {
                if (to.path === '/') {
                  const roleData = entityRolesDataSource.find(item => {
                    return item.role === store.getters.roles.code
                  })
                  // console.log("admin roleData", roleData)
                  next({ name: roleData.routerNameHome })
                } else {
                  // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                  next({ ...to, replace: true })
                }
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(err => {
            console.error('GetUserInfo found error:', err)
            notification.error({
              message: 'Error',
              description: 'Login again please'
            })
            store.dispatch('Logout').then(() => {
              next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
      } else {
        // const redirect = decodeURIComponent(from.query.redirect || to.path)
        // console.log("router.beforeEach2 store.getters.addRouters", store.getters.addRouters)
        // console.log("router.beforeEach2 from", from)
        // console.log("router.beforeEach2 to.path", to.path)
        // console.log("router.beforeEach2 redirect", redirect)
        if (from.name && from.name.indexOf('login') === 0) {
          notification.success({
            message: 'Welcome',
            description: `Hi ${store.getters.userInfo.firstName}，welcome back to CBBP.`
          })
        }
        if (to.path === '/') {
          const roleData = entityRolesDataSource.find(item => {
            return item.role === store.getters.roles.code
          })
          // console.log("admin roleData", roleData)
          next({ name: roleData.routerNameHome })
        } else {
          next()
        }
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
