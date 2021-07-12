import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import i18n from './modules/i18n'
import create from './modules/create'
import detail from './modules/detail'
import web3 from './modules/web3'
import permission from './modules/permission'
import account from './modules/account'
import superAdmin from './modules/superAdmin'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    i18n,
    permission,
    create,
    detail,
    account,
    web3,
    superAdmin
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})
