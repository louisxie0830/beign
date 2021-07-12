import Vue from 'vue'
import store from '@/store/'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'
import config from '@/config/defaultSettings'

export default function Initializer () {
  console.log(`API_URL: ${process.env.VUE_APP_API_BASE_URL}`)

  store.commit('SET_SIDEBAR_TYPE', true)
  store.commit('TOGGLE_THEME', config.navTheme)
  store.commit('TOGGLE_LAYOUT_MODE', config.layout)
  store.commit('TOGGLE_FIXED_HEADER', config.fixedHeader)
  store.commit('TOGGLE_FIXED_SIDERBAR', config.fixSiderbar)
  store.commit('TOGGLE_CONTENT_WIDTH', config.contentWidth)
  store.commit('TOGGLE_FIXED_HEADER_HIDDEN', config.autoHideHeader)
  store.commit('TOGGLE_WEAK', config.colorWeak)
  store.commit('TOGGLE_COLOR', config.primaryColor)
  store.commit('TOGGLE_MULTI_TAB', config.multiTab)
  store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))

  // last step
}
