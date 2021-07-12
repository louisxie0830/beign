import Vue from 'vue';
// import Vuex from 'vuex';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.DEPLOY_ENV !== 'prod',
  plugins: [
    createPersistedState({
      key: 'singing',
      storage: window.sessionStorage ? window.sessionStorage : window.localStorage,
      reducer: state => ({
        loginStatus: state.loginStatus,
        document: state.document,
        userData: state.userData,
        paymentInfo: state.paymentInfo
      })
    })
  ],
  state,
  getters,
  mutations,
  actions
});
