import i18n from './../plugins/i18n';
import router from './../router';
import qs from 'qs';
import EncryptionFactory from './../utils/EncryptionFactory';

import * as type from './type';

const showMessage = (icon, content) => {
  window.app.toast.show({
    icon,
    content
  });
};

export default {
  async setHeaders({ dispatch, state }, parameters) {
    const { token, email } = state.userData;
    const privateKey = await EncryptionFactory.privateKey(email);
    const address = await EncryptionFactory.address(privateKey);
    const getServerTime = await dispatch(type.actions.GET_AUTH_CURRENT_TIME);
    const timestamp = getServerTime.data.timestamp;
    const authorization = 'Bearer' + ' ' + token;
    const signature = await EncryptionFactory.signature(`${JSON.stringify(parameters)}@${timestamp}`, privateKey);

    return {
      timestamp: timestamp,
      address: address,
      authorization: authorization,
      signature: signature
    };
  },
  async getHeaders({ dispatch, state }, parameters) {
    const { token, email } = state.userData;
    try {
      const cerPwd = await dispatch(type.actions.GET_USER_CER_PASSWORD);
      const secretKey = await EncryptionFactory.secretKey(email, parameters.pwd);
      const privateKey = await EncryptionFactory.decrypted(cerPwd, secretKey);

      delete parameters.pwd;

      const address = await EncryptionFactory.address(privateKey);
      const getServerTime = await dispatch(type.actions.GET_AUTH_CURRENT_TIME);
      const timestamp = getServerTime.data.timestamp;
      const authorization = 'Bearer' + ' ' + token;
      const signature = await EncryptionFactory.signature(`${JSON.stringify(parameters)}@${timestamp}`, privateKey);

      return {
        timestamp: timestamp,
        address: address,
        authorization: authorization,
        signature: signature
      };
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_DING_CONFIG]({ dispatch }, parameters) {
    const params = parameters;
    try {
      return await _http.get('/ding/config', { params });
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_USER_STATUS]({ dispatch, commit, state }, param) {
    try {
      const headers = {
        authorization: 'Bearer' + ' ' + param.token
      };
      const {
        data: { data }
      } = await _http.get(`user/status?${qs.stringify(param.corpId ? { corpId: param.corpId } : '')}`, {
        headers
      });
      commit(type.mutations.UPDATE_USER_DATA, { ...state.userData, ...data });
      return {
        address: data.address,
        email: data.email,
        type: data.type,
        userId: data.userId,
        limit: data.limit,
        limit_duration: data.limit_duration,
        remain: data.remain,
        lastLoginTime: data.lastLoginTime
      };
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_DING_LOGIN]({ dispatch }, parameters) {
    try {
      return await _http.post('/ding/login', parameters);
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_AUTH_REGISTER]({ dispatch }, parameters) {
    try {
      const privateKey = await EncryptionFactory.privateKey(parameters.email);
      const address = await EncryptionFactory.address(privateKey);
      const headers = {
        address
      };
      const { data } = await _http.post('/auth/register', parameters, { headers });

      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_AUTH_LOGIN]({ dispatch, state }, parameters) {
    try {
      const { data } = await _http.post('/auth/login', parameters, {
        headers: {
          'accept-language': state.lang
        }
      });
      return { token: data.token, lang: data.lang, name: data.name };
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_AUTH_LOGOUT]({ dispatch }) {
    try {
      return await _http.post('/auth/logout');
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_EMAIL_SEND]({ dispatch }, parameters) {
    try {
      const emailSendResponse = parameters.hasOwnProperty('type')
        ? await _http.post('/email/afterLogin', parameters)
        : await _http.post('/email/send', parameters);
      emailSendResponse && showMessage('check', i18n.t('forget_password.sent_verify_mail.title'));
    } catch (error) {
      dispatch('errHandler', error);
    }
  },
  async [type.actions.POST_EMAIL_VERIFY]({ dispatch }, parameters) {
    try {
      const { data } = await _http.post('/email/verify', parameters);
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_USER_CER_PASSWORD]({ dispatch, state }) {
    try {
      const headers = {
        authorization: 'Bearer ' + state.userData.token
      };
      const res = await _http.get('/user/cerPassword', headers);
      return res.data.data.password;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async transferCerPassword({ dispatch, commit, state }, pwd) {
    const secretKey = await EncryptionFactory.secretKey(state.userData.email, pwd);
    const cerPwd = await dispatch(type.actions.GET_USER_CER_PASSWORD);
    const privateKey = await EncryptionFactory.decrypted(cerPwd, secretKey);
    commit('SET_USER_ADDRESS', await EncryptionFactory.address(privateKey));
    return await EncryptionFactory.address(privateKey);
  },
  async [type.actions.POST_AUTH_PASSWORD_FORGER]({ dispatch }, parameters) {
    try {
      const { data } = await _http.post('/auth/password/forget', parameters);
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_CONTACT_LIST]({ dispatch, commit }, parameters) {
    const params = parameters;
    try {
      const {
        data: { data }
      } = await _http.get('/contact/list', {
        params
      });

      commit(type.mutations.UPDATE_CONTACT_LIST, {
        type: '',
        data: data
      });

      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_LETTER_STATUS]({ dispatch }) {
    try {
      const {
        data: { data }
      } = await _http.get('letter/status');
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  ///letter/withdraw
  async [type.actions.POST_LETTER_WITHDRAW]({ dispatch }, parameters) {
    try {
      const headers = await dispatch('getHeaders', parameters);

      if (!parameters.letterId) {
        throw 'letterId must have a value';
      }

      return await _http.post('/letter/withdraw', parameters, { headers });
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  ///letter/sign
  async [type.actions.POST_LETTER_SIGN]({ dispatch }, parameters) {
    try {
      const headers = await dispatch('getHeaders', parameters);
      if (!parameters.letterId) {
        throw 'letterId must have a value';
      }
      return await _http.post('/letter/sign', parameters, { headers });
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  ///letter/decline
  async [type.actions.POST_LETTER_DECLINE]({ dispatch }, parameters) {
    try {
      const headers = await dispatch('getHeaders', parameters);
      if (!parameters.letterId) {
        throw 'letterId must have a value';
      }

      return await _http.post('/letter/decline', parameters, { headers });
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  ///letter/detail
  async [type.actions.GET_LETTER_DETAIL]({ dispatch }, parameters) {
    try {
      if (!parameters.letterId) {
        throw 'letterId must have a value';
      }
      const {
        data: { data }
      } = await _http.get('/letter/detail', { params: parameters });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_LETTER_LIST]({ dispatch }, parameters) {
    try {
      if (!parameters.type) {
        throw 'type must have a value';
      }
      if (typeof parameters.start != 'number') {
        throw 'start must have a Number';
      }
      if (typeof parameters.limit != 'number') {
        throw 'limit must have a Number';
      }
      const {
        data: { data }
      } = await _http.get('/letter/list', { params: parameters });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_ADD_CONTACT]({ dispatch, state, commit }, parameters) {
    try {
      const {
        data: { data }
      } = await _http.post('/contact/add', parameters);
      commit(type.mutations.UPDATE_CONTACT_LIST, {
        type: 'add',
        data: data
      });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_CONTACT_DELETE]({ dispatch, commit, state }, parameters) {
    try {
      const { data } = await _http.post('/contact/delete', parameters);
      const contact = state.contact.filter(c => c.id !== parameters.contractId);
      commit(type.mutations.UPDATE_CONTACT_LIST, {
        type: 'del',
        data: contact
      });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_AUTH_CURRENT_TIME]({ dispatch }) {
    try {
      return await _http.get('/auth/currentTime');
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_AUTH_SIGN_PASSWORD]({ dispatch }, parameters) {
    try {
      const headers = await dispatch('setHeaders', parameters);
      return await _http.post(
        '/auth/sign/password',
        {
          password: parameters.password,
          passwordConfirm: parameters.passwordConfirm,
          code: parameters.code
        },
        {
          headers
        }
      );
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_AUTH_PASSWORD_RESET]({ state }, parameters) {
    try {
      const headers = {
        authorization: 'Bearer ' + state.userData.token
      };
      const res = await _http.post('auth/password/reset', parameters, { headers });
      if (res) {
        window.app.toast.show({
          content: i18n.t('common.change_success'),
          icon: 'check',
          onHide: () => {
            router.push({ path: '/Index' });
          }
        });
      }
    } catch (error) {
      showMessage('info', i18n.t('common.change_fail'));
      throw error;
    }
  },
  async [type.actions.POST_AUTH_PASSWORD_FORGET_RESET]({ dispatch }, parameters) {
    try {
      const res = await _http.post('auth/password/forget/reset', parameters);
      if (res) {
        window.app.toast.show({
          content: i18n.t('common.change_success'),
          icon: 'check',
          onHide: () => {
            router.push({ path: '/Index' });
          }
        });
      }
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_LETTER_UPLOAD]({ dispatch }, parameters) {
    try {
      const headers = {
        'Content-Type': 'multipart/form-data'
      };
      const { data } = await _http.post('/letter/upload', parameters.formData, parameters.config, parameters.version, {
        headers
      });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_LETTER_VERIFY]({ dispatch }, parameters) {
    try {
      const headers = {
        'Content-Type': 'multipart/form-data'
      };
      const { data } = await _http.post('/letter/verify', parameters.formData, parameters.config, { headers });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_SIGNING_CORPS]({ dispatch, commit, state }, param) {
    try {
      const headers = {
        authorization: 'Bearer ' + param.token
      };
      const {
        data: { data }
      } = await _http.get('/signing/corps?' + qs.stringify({ role: param.role }), {
        headers
      });
      let resData = { companyList: [], companyId: '', role: '' };
      if (data.length > 0) {
        resData = {
          companyList: data,
          companyId: data[0].id,
          role: data[0] && data[0].role ? data[0].role : null
        };
      }
      commit(type.mutations.UPDATE_USER_DATA, { ...state.userData, ...resData });
      return resData;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_SINGER_COMPANY_LIST]({ dispatch, state }, parameters) {
    try {
      const headers = { authorization: 'Bearer ' + state.userData.token };
      const {
        data: { data }
      } = await _http.get('/contact/signingCrops?' + qs.stringify(parameters), {
        headers
      });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_SIGNING_USER_ADD]({ dispatch }, parameters) {
    try {
      let headers = await dispatch('getHeaders', parameters);
      let addAuthResponse = await _http.post('/signing/users/add', parameters, {
        headers
      });
      return addAuthResponse.data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_SIGNING_USERS]({ dispatch, state }, parameters) {
    try {
      const headers = { authorization: 'Bearer ' + state.userData.token };
      const {
        data: { data }
      } = await _http.get('/signing/users?' + qs.stringify(parameters), {
        headers
      });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_LETTER_CREATE]({ dispatch }, parameters) {
    try {
      const headers = await dispatch('getHeaders', parameters);

      return await _http.post('/letter/create', parameters, { headers });
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_LETTER_DRAFT]({ dispatch, state }) {
    try {
      const headers = { authorization: 'Bearer ' + state.userData.token };
      const {
        data: { data }
      } = await _http.get('/letter/draft', {
        headers
      });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_LETTER_CREATE_DRAFT]({ dispatch, state }, param) {
    try {
      const { data } = await _http.post('/letter/createDraft', param);
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_SINGING_USERS_DELETE]({ dispatch }, parameters) {
    try {
      const headers = await dispatch('getHeaders', parameters);
      return await _http.post('/signing/users/delete', parameters, { headers });
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_EMAIL_BIND]({ dispatch, commit, state }, parameters) {
    try {
      const privateKey = await EncryptionFactory.privateKey(parameters.email);
      const address = await EncryptionFactory.address(privateKey);

      const headers = {
        address
      };

      const res = await _http.post('/email/bind', parameters, {
        headers
      });
      commit(type.mutations.UPDATE_USER_DATA, { ...state.userData, ...{ email: parameters.email } });
      return res;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_SIGNING_ADMIN_TRANSFER]({ dispatch }, parameters) {
    try {
      const headers = await dispatch('getHeaders', parameters);
      return await _http.post('/signing/admin/transfer', parameters, {
        headers
      });
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.AUTH_LOGIN]({ dispatch }, parameters) {
    try {
      const resLogin = await dispatch(type.actions.POST_AUTH_LOGIN, parameters);
      const resCorps = await dispatch(type.actions.GET_SIGNING_CORPS, { role: 'admin', token: resLogin.token });
      const resUserStatus = await dispatch(type.actions.GET_USER_STATUS, {
        corpId: resCorps.companyId,
        token: resLogin.token
      });
      const userData = { ...resLogin, ...resCorps, ...resUserStatus };
      dispatch(type.actions.CHECK_USER_DATA, userData);
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.AUTH_REGISTER]({ dispatch }, param) {
    try {
      const resRegData = await dispatch(type.actions.POST_AUTH_REGISTER, param);
      const resCorps = await dispatch(type.actions.GET_SIGNING_CORPS, { role: 'admin', token: resRegData.token });
      const resUserStatus = await dispatch(type.actions.GET_USER_STATUS, {
        corpId: resCorps.companyId,
        token: resRegData.token
      });
      const userData = { ...resRegData, ...resCorps, ...resUserStatus, lang: i18n.locale };
      dispatch(type.actions.CHECK_USER_DATA, userData);
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.UNAUTHORIZED_LOGIN]({ dispatch, state }) {
    const { token } = state.userData;
    try {
      const resCorps = await dispatch(type.actions.GET_SIGNING_CORPS, { role: 'admin', token: token });
      const resUserStatus = await dispatch(type.actions.GET_USER_STATUS, {
        corpId: resCorps.companyId,
        token: token
      });
      dispatch(type.actions.CHECK_USER_DATA, { ...state.userData, ...resCorps, ...resUserStatus });
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_TAG_ADD_OR_UPDATE]({ dispatch, commit }, params) {
    try {
      const {
        data: { data }
      } = await _http.post('/tag/addOrUpdate', params);

      commit(type.mutations.UPDATE_TAG_LIST, { type: 'add', data: data });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_TAG_DEL]({ dispatch, commit }, params) {
    try {
      const {
        data: { data }
      } = await _http.post('/tag/del', params);

      commit(type.mutations.UPDATE_TAG_LIST, {
        type: 'del',
        data: {
          id: params.tagId
        }
      });

      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_TAG_LIST]({ dispatch, commit }, params) {
    try {
      const {
        data: { data }
      } = await _http.get('/tag/list', { params });
      commit(type.mutations.UPDATE_TAG_LIST, { type: 'default', data: data });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.CHECK_USER_DATA]({ dispatch, commit }, userData) {
    userData.lang = userData.lang.replace('_', '-');
    if (userData.lang !== 'zh-tw' && userData.lang !== 'zh-cn') {
      userData.lang = 'zh-tw';
    }
    commit(type.mutations.UPDATE_LANG, userData.lang);
    commit(type.mutations.SET_REGION, userData.lang);
    commit(type.mutations.SET_CITY, userData.lang);
    commit(type.mutations.UPDATE_LOGIN_STATUS, true);

    if (!userData.email) {
      window.app.modal.show({
        title: i18n.t('login.not_verified_email.text'),
        content: i18n.t('login.not_verified_email_message.text'),
        confirmText: i18n.t('common.go_to_verify'),
        showIcon: false,
        showCancel: false,
        onConfirm: () => {
          router.push({ path: '/client/SetMail' });
        }
      });
      return;
    }
    if (!userData.address) {
      window.app.modal.show({
        title: i18n.t('login.not_setting_address.text'),
        content: [i18n.t('login.not_setting_address_message.text'), i18n.t('common.private_key_info')],
        confirmText: i18n.t('common.go_to_setting'),
        showIcon: false,
        showCancel: false,
        onConfirm: () => {
          router.push({ path: '/client/AuthCode' });
        }
      });
      return;
    }
    commit(type.mutations.UPDATE_USER_DATA, userData);
    dispatch(type.actions.GET_TAG_LIST, { start: 0, limit: 20 });
    dispatch(type.actions.GET_CONTACT_LIST, { start: 0, limit: Number.MAX_SAFE_INTEGER });

    router.push({ path: '/Index' });
  },
  async [type.actions.POST_TAG_DETAIL_UPDATE]({ dispatch }, param) {
    try {
      let {
        data: { data }
      } = await _http.post('/tag/detail/update', param);
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_PAYMENT_PACKAGES]({ dispatch, state }) {
    try {
      let headers = {
        authorization: 'Bearer' + ' ' + state.userData.token
      };
      let {
        data: { data }
      } = await _http.get(`/payment/packages`, { headers });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_PAYMENT_CREATE]({ dispatch }, params) {
    try {
      let {
        data: { data }
      } = await _http.post('/payment/create', params);
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_PAYMENT_STATUS]({ dispatch, state }, params) {
    try {
      let headers = {
        authorization: 'Bearer' + ' ' + state.userData.token
      };
      let {
        data: { data }
      } = await _http.get('/payment/status?orderNo=' + params, { headers });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_PAYMENT_METHODS]({ dispatch, state }, params) {
    try {
      let headers = {
        authorization: 'Bearer' + ' ' + state.userData.token
      };
      let {
        data: { data }
      } = await _http.get('/payment/methods', { headers });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_USER_LANG]({ dispatch, commit }, param) {
    try {
      let langRes = await _http.post('/user/lang', param);
      commit(type.mutations.UPDATE_LANG, param.lang);
      commit(type.mutations.SET_REGION, param.lang);
      commit(type.mutations.SET_CITY, param.lang);
      return langRes;
    } catch (error) {
      dispatch('errHandler', error);
    }
  },
  async [type.actions.GET_ORGANIZATION_DEPARTMENTS]({ dispatch }, param) {
    try {
      const res = await _http.get(`/organization/departments?${qs.stringify(param)}`);
      return res.data.data;
    } catch (error) {
      dispatch('errHandler', error);
    }
  },
  async [type.actions.POST_ORGANIZATION_DEPARTMENT_CREATE]({ dispatch }, parameters) {
    try {
      const res = await _http.post('/organization/department/create', parameters);
      return res;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_ORGANIZATION_DEPARTMENTS_DELETE]({ dispatch }, parameters) {
    try {
      const res = await _http.post('/organization/department/delete', parameters);
      return res;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_ORGANIZATION_DEPARTMENT_QUERY]({ dispatch }, parameters) {
    try {
      const res = await _http.get(`/organization/department/query?${qs.stringify(parameters)}`);
      return res.data.data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_USER_USERINFO_QUERY]({ dispatch }, param) {
    try {
      const res = await _http.get(`/user/userinfo/query?${qs.stringify(param)}`);
      return res.data.data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },

  async [type.actions.POST_USER_USER_INFO_UPDATE_OR_CREATE]({ dispatch }, data) {
    try {
      const res = await _http.post('/user/userinfo/updateOrCreate', data);
      return res.data.data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },

  async [type.actions.GET_CERTIFICATION_LIST]({ dispatch }, param) {
    try {
      const res = await _http.get(`/certification/list?${qs.stringify(param)}`);
      return res.data.data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },

  async [type.actions.POST_ERROR_REPORT]({}, data) {
    const param = {
      ...{
        fileName: '',
        errorLine: '',
        errorCode: '',
        errorMsg: '',
        uri: '',
        stackTrace: ''
      },
      ...data
    };
    try {
      return await _http.post('/error/report', param);
    } catch (error) {}
  },
  async [type.actions.POST_INVITED_MAIL_SEND]({ dispatch }, parameters) {
    try {
      let res = await _http.post('/invite/create', parameters);
      if (res && res.data.code === 200) {
        window.app.toast.show({
          content: i18n.t('common.invite_mail_send.text'),
          icon: 'check',
          onHide: () => {
            router.push({ path: '/admin/ManagementIndex' });
          }
        });
      }
      return res;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_ADD_STAMP]({ dispatch }, data) {
    try {
      const res = await _http.post('/signing/crops/signature', data);
      return res.data.data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_COMPANY_SIGNATURE]({ dispatch }, parameters) {
    try {
      let res = await _http.get('/signing/crops/signature?companyId=' + parameters.companyId);
      return res;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.GET_INVITED_INFO]({ dispatch }, parameters) {
    try {
      let res = await _http.get('/invite/info?inviteCode=' + parameters);
      return res;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  async [type.actions.POST_INVITE_CREATE_MULTIPLE]({ dispatch }, parameters) {
    try {
      const headers = {
        'Content-Type': 'multipart/form-data'
      };
      const { data } = await _http.post('/invite/createMultiple', parameters.formData, {
        headers
      });
      return data;
    } catch (error) {
      dispatch('errHandler', error);
      throw error;
    }
  },
  errHandler({ commit }, res) {
    function getErrorMessage(exception) {
      const checkI18n = code => {
        return isNaN(Number(i18n.t(String(code))));
      };
      if (exception) {
        if (exception.code === 401 && exception.message) {
          return i18n.t('common.cert_code_fail');
        } else if (exception.code === 500 && exception.message) {
          return exception.message;
        } else if (exception.code && checkI18n(exception.code)) {
          return i18n.t(String(exception.code));
        } else if (exception.message) {
          return exception.message;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
    function showError(exception) {
      let errorMessage = getErrorMessage(exception);
      if (errorMessage) {
        const textLength = errorMessage.length;
        if (textLength > 20) {
          window.app.modal.show({
            title: i18n.t('common.error'),
            content: errorMessage,
            showIcon: false,
            showCancel: false
          });
        } else if (textLength <= 20 && textLength >= 8) {
          window.app.alert.show({
            content: errorMessage,
            position: 'middle'
          });
        } else {
          window.app.toast.show({
            icon: 'info',
            content: errorMessage
          });
        }
      }
    }
    if (!res) {
      return;
    }
    let code = null;
    let data = null;
    if (res.status && res.data) {
      code = res.status;
      data = res.data;
    } else if (res.response.status && res.response.data) {
      code = res.response.status;
      data = res.response.data;
    } else {
      return;
    }

    switch (code) {
      case 500:
        showError(data);
        break;
      case 401:
        if (data.message === 'Bad token') {
          commit(type.mutations.UPDATE_LOGIN_STATUS, false);
        } else {
          showError(data);
        }
        break;
      case 200:
        if (data.message === 'Bad token') {
          commit(type.mutations.UPDATE_LOGIN_STATUS, false);
        } else if (data.code == 91012) {
          window.app.modal.show({
            title: i18n.t('common.error'),
            content: i18n.t('91012'),
            confirmText: i18n.t('common.confirm'),
            showIcon: false,
            showCancel: false,
            onConfirm: () => {
              router.push({ path: '/client/ForgetPassword' });
            }
          });
        } else {
          showError(data);
        }
        break;
    }
  }
};
