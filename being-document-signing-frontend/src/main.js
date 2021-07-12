// import 'babel-polyfill';
// import Vue from 'vue';
// import Vuetify from 'vuetify';
import VueSanitize from 'vue-sanitize';
import './assets/scss/style.scss';

import * as plugins from './plugins/BeingPlugins';
import './components/BeingComponent';
import './directives/BeingDirective';
import './filters/BeingFilter';
import './plugins/axios';

import i18n from './plugins/i18n';
import store from './store';
import App from './App';
import router from './router';

import './registerServiceWorker';

Vue.config.productionTip = false;

console.log('process.env.DEPLOY_ENV: ', process.env.DEPLOY_ENV);

const isProdMode = () => {
  return process.env.DEPLOY_ENV === 'prod';
};

const isDevMode = () => {
  return process.env.DEPLOY_ENV === 'development';
};

Vue.use(Vuetify);
Vue.use(plugins.BusPlugin);
Vue.use(plugins.ToastPlugin);
Vue.use(plugins.AlertPlugin);
Vue.use(plugins.DatePickerPlugin);
Vue.use(plugins.ModalPlugin);
Vue.use(plugins.DateRangePickerPlugin);
Vue.use(plugins.DingTalkPlugin);
Vue.use(VueSanitize);

Vue.prototype.isProdMode = isProdMode;
Vue.prototype.isDevMode = isDevMode;

Vue.config.errorHandler = (err, vm, info) => {
  console.log('[ERROR CATCH]: ', err);
  console.log('[ERROR COMPONENT]: ', vm);
  console.log('[ERROR INFO]: ', info);
};

const app = new Vue({
  el: '#app',
  i18n,
  store,
  router,
  components: { App },
  template: '<App/>'
});

window.app = app;
