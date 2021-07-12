import Vue from 'vue';
import axios from 'axios';
import $store from './../store';
import ApplyLoading from './ApplyLoading';

const axiosIns = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 600000
});

axiosIns.interceptors.request.use(
  config => {
    if (ApplyLoading.isShowLoading(config.url)) {
      ApplyLoading.show();
    }
    const LOGIN_STATUS = $store.getters['LOGIN_STATUS'];

    if (config.hasOwnProperty('headers')) {
      config.headers['x-being-area'] = $store.getters['COUNTRY_CODE'].toLowerCase() || 'tw';

      if (!!LOGIN_STATUS) {
        const { token, lang } = $store.getters['USER_DATA'];
        config.headers['authorization'] = 'Bearer' + ' ' + token;
        config.headers['accept-language'] = lang.replace('_', '-');
      }
    }

    return config;
  },
  err => {
    ApplyLoading.hide();
    return Promise.reject(err);
  }
);
axiosIns.interceptors.response.use(
  response => {
    ApplyLoading.hide();
    switch (response.data.code) {
      case 200:
        return response;
      default:
        return Promise.reject(response);
    }
  },
  error => {
    ApplyLoading.hide();
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue._http = axiosIns;
  window._http = axiosIns;
  Object.defineProperties(Vue.prototype, {
    _http: {
      get() {
        return axiosIns;
      }
    },
    $http: {
      get() {
        return axiosIns;
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;
