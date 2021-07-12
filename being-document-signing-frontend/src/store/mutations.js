import router from './../router';
import initialState from './state';
import i18n from './../plugins/i18n';
import * as type from './type';
import { countryCodes } from './../utils/status.js';
import { getCity, getRegion } from '../../static/config/area.js';

export default {
  [type.mutations.UPDATE_DING_DING_STATUS](state, status) {
    state.dingDingStatus = status;
  },
  [type.mutations.UPDATE_USER_EMAIL](state, email) {
    state.email = email;
  },
  [type.mutations.SET_AUTHORIZATION](state, token) {
    state.authorization = token;
  },
  [type.mutations.SET_DOCUMENT](state, payload) {
    state.document = payload;
  },
  [type.mutations.CLEAN_DOCUMENT](state) {
    state.document = null;
  },
  [type.mutations.RESET_STORE](state) {
    Object.keys(state).forEach(key => {
      state[key] = initialState[key];
    });
  },
  [type.mutations.UPDATE_LOGIN_STATUS](state, status) {
    if (!status) {
      this.commit('RESET_STORE');
      router.push({
        path: '/Login'
      });
    }
    state.loginStatus = status;
  },
  [type.mutations.SET_USER_COMPANY_LIST](state, list) {
    state.companyList = list;
  },
  [type.mutations.SET_USER_COMPANY_ID](state, id) {
    state.companyId = id;
  },
  [type.mutations.SET_USER_ROLE](state, status) {
    state.userRole = status;
  },
  [type.mutations.SET_USER_ADDRESS](state, value) {
    state.userAddress = value;
  },
  [type.mutations.UPDATE_LETTER_DATA](state, data) {
    state.letterData = data;
  },
  [type.mutations.UPDATE_CORP_ID](state, id) {
    state.corpId = id;
  },
  [type.mutations.UPDATE_LOAD_STATUS](state, status) {
    state.isLoading = status;
  },
  [type.mutations.UPDATE_DING_CONFIG](state, config) {
    state.dingConfig = config;
  },
  [type.mutations.UPDATE_TAG_LIST](state, param) {
    switch (param.type) {
      case 'add':
        state.tagList = [...state.tagList, ...[param.data]];
        break;
      case 'del':
        const tags = JSON.parse(JSON.stringify(state.tagList));
        state.tagList = tags.filter(t => {
          return t.id !== param.data.id;
        });
        break;
      default:
        state.tagList = param.data;
        break;
    }
  },
  [type.mutations.SET_COUNTRY_CODE](state, href) {
    const getCountryCode = url => url.replace(/(https?:\/\/)/gi, '');
    let matchHref = '';
    for (const key in countryCodes) {
      let regCountry = new RegExp(`^(https?)://${key.toLocaleLowerCase()}`);
      if (href.match(regCountry)) {
        matchHref = href.match(regCountry)[0];
        state.countryCode = getCountryCode(matchHref).toUpperCase();
        break;
      }
    }
  },
  [type.mutations.UPDATE_LANG](state, lang) {
    lang = lang.replace('_', '-');
    state.lang = lang;
    state.userData.lang = lang;
    i18n.locale = lang;
    localStorage.setItem('lang', lang);
  },
  [type.mutations.UPDATE_USER_NAME](state, name) {
    state.userName = name;
  },
  [type.mutations.UPDATE_USER_DATA](state, data) {
    state.userData = data;
  },
  [type.mutations.UPDATE_CONTACT_LIST](state, param) {
    switch (param.type) {
      case 'add':
        state.contact = [...state.contact, ...[param.data]];
        break;
      case 'del':
      default:
        state.contact = param.data;
        break;
    }
  },
  [type.mutations.SET_PAYMENT_INFO](state, data) {
    state.paymentInfo = data;
  },
  [type.mutations.SET_COMPANY_STAMP](state, data) {
    state.companyStamp = data;
  },
  [type.mutations.SET_CITY](state, lang) {
    state.city = getCity(lang);
  },
  [type.mutations.SET_REGION](state, lang) {
    state.region = getRegion(lang);
  },
  [type.mutations.UPDATE_SINATURE_INFO](state, info) {
    state.signatureInfo = Object.assign(state.signatureInfo, info);
  },
  [type.mutations.SET_SIGNATURE_STATUS](state, data) {
    state.signatureStatus = Object.assign(state.signatureStatus, data);
  },
  [type.mutations.IS_SHOW_FILE_TIPS](state, data) {
    state.isShowFileTips = data;
  },
  [type.mutations.SET_USER_ENTITY](state, companyId) {
    state.userEntity = companyId;
  }
};
