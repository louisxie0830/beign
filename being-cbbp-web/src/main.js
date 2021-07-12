// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import i18n from './locales'
import './assets/font.css'
import 'xe-utils'
import './utils/vex-table'
import { mixinData } from '@/utils/mixin'

Vue.config.productionTip = false

Vue.mixin(mixinData)

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

const app = new Vue({
  i18n,
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')

window.app = app
