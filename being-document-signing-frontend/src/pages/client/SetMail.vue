<template>
  <v-flex>
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <v-btn class="b-toolbar-icon left" icon :ripple="false" @click="goBack">
          <v-icon class="b-text">arrow_back_ios</v-icon>
          <span class="b-text" v-text="$t('common.back')">返回</span>
        </v-btn>
      </v-flex>
      <v-flex xs8>
        <v-toolbar-title v-text="$t('set_mail.toolbar_title.text')" />
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-3>
      <v-layout row
                wrap>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <v-card>
            <v-card-text>
              <v-form ref="form"
                      v-model="valid">
                <v-flex xs12>
                  <p class="b-label">Email</p>
                </v-flex>
                <v-text-field outline
                              required
                              class="b-input"
                              v-model.trim="email"
                              validate-on-blur
                              :rules="rules.email"
                              :placeholder="$t('common.email_rules.input_email')" />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.phone')" />
                </v-flex>
                <v-layout row>
                  <v-flex xs5>
                    <v-autocomplete class="b-input"
                                    v-model.trim="code"
                                    :items="countryCodes"
                                    item-text="code"
                                    item-value="code"
                                    :placeholder="$t('common.country_code')"
                                    cache-items
                                    flat
                                    solo>
                      <template slot="item"
                                slot-scope="{ item }">
                        <template>
                          <v-list-tile-content>
                            <v-list-tile-title> {{ item.iso2 }}: {{ item.code }}</v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs8
                          ml-1>
                    <v-text-field class="b-input"
                                  v-model.trim="phone"
                                  :rules="rules.phone(currentCountryIso2)"
                                  :placeholder="$t('common.phone_placeholder')"
                                  hide-no-data
                                  validate-on-blur
                                  single-line
                                  outline
                                  required />
                  </v-flex>
                </v-layout>
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.cert_password')" />
                </v-flex>
                <v-text-field outline
                              required
                              class="b-input"
                              v-model.trim="cerPassword"
                              v-disable-paste
                              :rules="rules.password"
                              validate-on-blur
                              type="password"
                              :placeholder="$t('common.password_rules.input_password_with_length')" />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.confirm_cer_password')" />
                </v-flex>
                <v-text-field outline
                              required
                              class="b-input"
                              v-model.trim="confirmCerPassword"
                              v-disable-paste
                              validate-on-blur
                              :rules="rules.confirmPassword(cerPassword)"
                              type="password"
                              :placeholder="$t('common.password_rules.input_password_again')" />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.verify_code')" />
                </v-flex>
                <v-flex xs12
                        sm12
                        d-flex>
                  <v-text-field outline
                                required
                                class="b-input"
                                v-model.trim="authCode"
                                :rules="rules.authCode"
                                validate-on-blur
                                maxlength="6"
                                type="password"
                                :placeholder="$t('common.verify_code_placeholder')" />
                  <auth-code-btn :user-email="email.toLowerCase()"
                                 :api-type="3"
                                 :manual="true"
                                 @clickAuthCodeBtn="clickAuthCodeBtn" />
                </v-flex>
                <v-checkbox v-model="useTerms">
                  <div slot="label">
                    <span v-text="$t('register.read_and_agree.text')" />
                    <strong slot="activator"
                            class="b-text"
                            @click.stop="jumpToPolicy"
                            v-text="$t('register.user_policy.text')" /> 和
                    <strong slot="activator"
                            class="b-text"
                            @click.stop="jumpToPrivacy"
                            v-text="$t('register.user_privacy.text')" />
                  </div>
                </v-checkbox>

              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3
                mt-3
                d-flex
                class="b-btn-area">
          <v-btn round
                 class="b-btn"
                 large
                 @click="submit"
                 :disabled="!useTerms || !authCodeBtnStatus"
                 v-text="$t('set_mail.binding.text')" />
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>
<script>
const AuthCodeBtn = () => import('./../../components/AuthCodeBtn.vue');

import rulesMixin from './../../mixins/Rules.js';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { actions, getters } from './../../store/type.js';
import EncryptionFactory from './../../utils/EncryptionFactory.js';
import DingClient from './../../plugins/DingTalk.js';
import { countryCodes } from './../../utils/status.js';

export default {
  components: {
    AuthCodeBtn
  },
  mixins: [rulesMixin],
  beforeRouteEnter: (to, from, next) => {
    let getCacheSetMail;
    next(vm => {
      if (from.name === 'Policy' || from.name === 'Privacy') {
        if (sessionStorage.getItem('cache-set-mail')) {
          getCacheSetMail = JSON.parse(sessionStorage.getItem('cache-set-mail'));
        }
        vm.authCode = getCacheSetMail.authCode || '';
        vm.email = getCacheSetMail.email || '';
        vm.cerPassword = getCacheSetMail.cerPassword || '';
        vm.confirmCerPassword = getCacheSetMail.confirmCerPassword || '';
        vm.useTerms = getCacheSetMail.useTerms || false;
        (vm.code = getCacheSetMail.code || null),
          (vm.name = getCacheSetMail.name || null),
          (vm.phone = getCacheSetMail.phone || null);
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'Policy' || to.name === 'Privacy') {
      let cacheSetMail = {
        authCode: this.authCode || '',
        email: this.email || '',
        cerPassword: this.cerPassword || '',
        confirmCerPassword: this.confirmCerPassword || '',
        useTerms: this.useTerms || false,
        code: this.code || null,
        name: this.name || null,
        phone: this.phone || null
      };

      sessionStorage.setItem('cache-set-mail', JSON.stringify(cacheSetMail));
    } else {
      sessionStorage.getItem('cache-set-mail') && sessionStorage.removeItem('cache-set-mail');
    }
    next();
  },
  data() {
    return {
      valid: false,
      useTerms: false,
      cerPassword: '',
      confirmCerPassword: '',
      authCode: '',
      email: '',
      phone: null,
      countryCodes: [],
      code: null
    };
  },
  computed: {
    ...mapGetters({
      LANG: getters.LANG,
      COUNTRY_CODE: getters.COUNTRY_CODE,
      DING_DING_STATUS: getters.DING_DING_STATUS
    }),
    currentCountryIso2() {
      if (!this.code) return '';
      return this.countryCodes.find(c => {
        return c.code === this.code;
      }).iso2;
    }
  },
  created() {
    for (const key in countryCodes) {
      if (key === 'TW' || key === 'CN' || key === 'KR' || key === 'SG' || key === 'JP' || key === 'HK') {
        this.countryCodes.push(countryCodes[key]);
        this.param.countryCodes.sort((a, b) => {
          if (a.iso2 > b.iso2) {
            return -1;
          }
          return 0;
        });
      }
    }
    this.code = this.countryCodes.find(c => c.iso2 === this.COUNTRY_CODE).code;
  },
  methods: {
    ...mapActions({
      POST_EMAIL_BIND: actions.POST_EMAIL_BIND,
      GET_CONTACT_LIST: actions.GET_CONTACT_LIST,
      GET_TAG_LIST: actions.GET_TAG_LIST,
      errHandler: 'errHandler'
    }),
    ...mapMutations({
      UPDATE_USER_EMAIL: 'UPDATE_USER_EMAIL'
    }),
    async submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        this.email = this.email.toLowerCase();
        const privateKey = await EncryptionFactory.privateKey(this.email);
        const secretKey = await EncryptionFactory.secretKey(this.email, this.cerPassword);
        const cerPwd = await EncryptionFactory.cerPwd(privateKey, secretKey);

        const param = {
          email: this.email,
          authCode: cerPwd,
          authCodeConfirm: cerPwd,
          code: this.authCode,
          mobile: `${this.code}${this.formatPhoneNumber(this.phone, this.currentCountryIso2)}`
        };

        await this.POST_EMAIL_BIND(param);
        await this.GET_TAG_LIST({ start: 0, limit: 20 });
        await this.GET_CONTACT_LIST({ start: 0, limit: Number.MAX_SAFE_INTEGER });

        this.$router.push({ path: '/Index' });
      } catch (error) {
        this.email = '';
        this.authCode = '';
        this.cerPassword = '';
        this.confirmCerPassword = '';
        this.$refs.form.resetValidation();
        this.errHandler(error);
      }
    },
    async jumpToPrivacy() {
      if (dd.env.platform !== 'notInDingTalk') {
        let lang = null;
        switch (this.LANG) {
          case 'zh-cn':
            lang = 'zh-cn';
            break;
          default:
            lang = 'zh-tw';
            break;
        }
        const domain = 'https://frontend-signing-test.beingtech.org';
        const url = domain + '/static/privacy/' + lang + '.html';
        await DingClient.openLink(url);
      } else {
        this.$router.push('Privacy');
      }
    },
    async jumpToPolicy() {
      if (dd.env.platform !== 'notInDingTalk') {
        let lang = null;
        switch (this.LANG) {
          case 'zh-cn':
            lang = 'zh-cn';
            break;
          default:
            lang = 'zh-tw';
            break;
        }
        const domain = 'https://frontend-signing-test.beingtech.org';
        const url = domain + '/static/policy/' + lang + '.html';
        await DingClient.openLink(url);
      } else {
        this.$router.push('Policy');
      }
    },
    goBack() {
      if (this.DING_DING_STATUS) {
        this.$router.push({ name: 'WelcomePage' });
      } else {
        this.$router.push({ name: 'Login' });
      }
    }
  }
};
</script>
