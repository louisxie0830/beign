<template>
  <v-flex id="register">
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <v-toolbar-title v-text="$t('register.toolbar_title.text')" />
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
                  <p class="b-label">{{ $t('common.name') }}</p>
                </v-flex>
                <v-text-field class="b-input"
                              v-model.trim="param.name"
                              :rules="rules.name"
                              :placeholder="$t('add_contact.data.name_rules.input_name')"
                              validate-on-blur
                              single-line
                              outline
                              required />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.phone')" />
                </v-flex>
                <v-layout row>
                  <v-flex xs5>
                    <v-autocomplete class="b-input"
                                    v-model.trim="param.code"
                                    :rules="rules.countryCodes"
                                    :items="param.countryCodes"
                                    item-text="code"
                                    item-value="code"
                                    :placeholder="$t('common.country_code')"
                                    hide-selected
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
                                  v-model.trim="param.phone"
                                  :rules="rules.phone(param.currentCountryIso2)"
                                  :placeholder="$t('common.phone_placeholder')"
                                  hide-no-data
                                  validate-on-blur
                                  single-line
                                  outline
                                  required />
                  </v-flex>
                </v-layout>
                <v-flex xs12>
                  <p class="b-label">Email</p>
                </v-flex>
                <v-text-field outline
                              required
                              class="b-input"
                              v-model.trim="param.email"
                              validate-on-blur
                              :rules="rules.email"
                              :placeholder="$t('common.email_rules.input_email')" />
                <v-flex xs12>
                  <p class="b-label text-align-l">{{ $t('common.password') }} {{ $t('common.cre_password_rule_message') }}</p>
                </v-flex>
                <v-text-field outline
                              required
                              class="b-input"
                              v-model.trim="param.password"
                              v-disable-paste
                              :rules="rules.password"
                              validate-on-blur
                              type="password"
                              :placeholder="$t('common.password_rules.input_password')" />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.confirm_password')" />
                </v-flex>
                <v-text-field outline
                              required
                              class="b-input"
                              v-model.trim="param.confirmPassword"
                              v-disable-paste
                              validate-on-blur
                              :rules="rules.confirmPassword(param.password)"
                              type="password"
                              :placeholder="$t('common.password_rules.input_password_again')" />
                <v-flex xs12>
                  <p class="b-label">
                    {{ $t('common.cert_password') }}
                    <v-tooltip top
                               max-width="198">
                      <v-icon slot="activator"
                              class="b-icon">help</v-icon>
                      <span class="b-tooltip-content"
                            v-text="$t('register.icon.text')" />
                    </v-tooltip>
                    <span class="b-tooltip-content"
                          v-text="$t('common.cre_password_rule_message')" />
                  </p>
                </v-flex>
                <v-text-field outline
                              required
                              class="b-input"
                              v-model.trim="param.cerPassword"
                              v-disable-paste
                              :rules="rules.password"
                              validate-on-blur
                              type="password"
                              :placeholder="$t('common.cert_code_placeholder')" />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.confirm_cer_password')" />
                </v-flex>
                <v-text-field outline
                              required
                              class="b-input"
                              v-model.trim="param.confirmCerPassword"
                              v-disable-paste
                              validate-on-blur
                              :rules="rules.confirmPassword(param.cerPassword)"
                              type="password"
                              :placeholder="$t('common.cert_code_again_placeholder')" />
                <v-flex xs12>
                  <p class="b-label">
                    {{ $t('common.verify_code') }}
                    <v-tooltip top max-width="180">
                      <v-icon slot="activator" class="b-icon">help</v-icon>
                      <span class="b-tooltip-content" v-text="$t('register.icon.auth.text')" />
                    </v-tooltip>
                  </p>
                </v-flex>
                <v-flex xs12
                        sm12
                        d-flex>
                  <v-text-field outline
                                required
                                class="b-input"
                                v-model.trim="param.authCode"
                                :rules="rules.authCode"
                                validate-on-blur
                                maxlength="6"
                                type="password"
                                :placeholder="$t('common.verify_code_placeholder')" />
                  <auth-code-btn :user-email="param.email"
                                 :require-phone="true"
                                 :user-phone="param.phone" 
                                 :manual="true"
                                 @clickAuthCodeBtn="clickAuthCodeBtn" />
                </v-flex>
                <v-checkbox v-model="param.useTerms">
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
          <v-flex xs12
                  sm12
                  mt-3
                  d-flex
                  class="b-btn-area">
            <v-btn class="b-btn"
                   round
                   large
                   :disabled="isDisableRegButton"
                   @click="submit"
                   v-text="$t('common.register')" />
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>
<script>
const AuthCodeBtn = () => import('./../../components/AuthCodeBtn.vue');
import rulesMixin from './../../mixins/Rules.js';
import { actions, mutations, getters } from './../../store/type';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import EncryptionFactory from './../../utils/EncryptionFactory.js';
import { countryCodes } from './../../utils/status.js';

export default {
  components: {
    AuthCodeBtn
  },
  mixins: [rulesMixin],
  beforeRouteEnter: (to, from, next) => {
    let getCacheRegData;
    next(vm => {
      if (from.name === 'Policy' || from.name === 'Privacy') {
        if (sessionStorage.getItem('cache-reg-data')) {
          getCacheRegData = JSON.parse(sessionStorage.getItem('cache-reg-data'));
        }
        vm.param = {
          authCode: getCacheRegData.authCode || null,
          confirmPassword: getCacheRegData.confirmPassword || null,
          cerPassword: getCacheRegData.cerPassword || null,
          confirmCerPassword: getCacheRegData.confirmCerPassword || null,
          email: getCacheRegData.email || null,
          authCodeBtnStatus: getCacheRegData.authCodeBtnStatus || null,
          useTerms: getCacheRegData.useTerms || null,
          code: getCacheRegData.code || null,
          name: getCacheRegData.name || null,
          phone: getCacheRegData.phone || null,
          countryCodes: getCacheRegData.countryCodes || []
        };
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'Policy' || to.name === 'Privacy') {
      const {
        authCode,
        password,
        confirmPassword,
        cerPassword,
        confirmCerPassword,
        email,
        authCodeBtnStatus,
        useTerms,
        code,
        phone,
        name,
        countryCodes
      } = this.param;

      const cacheRegData = {
        authCode: authCode || null,
        password: password || null,
        confirmPassword: confirmPassword || null,
        cerPassword: cerPassword || null,
        confirmCerPassword: confirmCerPassword || null,
        email: email || null,
        authCodeBtnStatus: authCodeBtnStatus || null,
        useTerms: useTerms || null,
        code: code || null,
        name: name || null,
        phone: phone || null,
        countryCodes: countryCodes || []
      };

      sessionStorage.setItem('cache-reg-data', JSON.stringify(cacheRegData));
    } else {
      sessionStorage.getItem('cache-reg-data') && sessionStorage.removeItem('cache-reg-data');
    }
    next();
  },
  data() {
    return {
      valid: false,
      param: {
        useTerms: false,
        authCode: null,
        password: null,
        confirmPassword: null,
        cerPassword: null,
        confirmCerPassword: null,
        name: null,
        email: null,
        phone: null,
        countryCodes: [],
        code: null,
        currentCountryIso2: null
      }
    };
  },
  computed: {
    ...mapGetters({
      COUNTRY_CODE: getters.COUNTRY_CODE
    }),
    isDisableRegButton() {
      return !this.param.useTerms || !this.authCodeBtnStatus;
    }
  },
  watch: {
    'param.code': function(val) {
      let iso2;
      for (let i = 0, len = this.param.countryCodes.length; i < len; i++) {
        if (this.param.countryCodes[i].code === this.param.code) {
          iso2 = this.param.countryCodes[i].iso2;
          break;
        }
      }
      this.param.currentCountryIso2 = iso2 ? iso2 : 'TW';
    }
  },
  created() {
    this.RESET_STORE();

    for (const key in countryCodes) {
      if (key === 'TW' || key === 'CN' || key === 'KR' || key === 'SG' || key === 'JP' || key === 'HK') {
        this.param.countryCodes.push(countryCodes[key]);
        this.param.countryCodes.sort((a, b) => {
          if (a.iso2 > b.iso2) {
            return -1;
          }
          return 0;
        });
      }
    }
  },
  methods: {
    ...mapActions({
      AUTH_REGISTER: actions.AUTH_REGISTER
    }),
    ...mapMutations({
      RESET_STORE: mutations.RESET_STORE
    }),
    clickAuthCodeBtn(status) {
      this.authCodeBtnStatus = status;
    },
    async submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      let { name, email, password, confirmPassword, phone, currentCountryIso2, authCode, code } = this.param;
      email = email.toLowerCase();
      const privateKey = await EncryptionFactory.privateKey(this.param.email);
      const secretKey = await EncryptionFactory.secretKey(this.param.email, this.param.cerPassword);
      const cerPwd = await EncryptionFactory.cerPwd(privateKey, secretKey);
      const regParam = {
        name,
        email,
        password: password,
        passwordConfirm: confirmPassword,
        mobile: `${code}${this.formatPhoneNumber(phone, currentCountryIso2)}`,
        authCode: cerPwd,
        authCodeConfirm: cerPwd,
        code: authCode,
        agreeTerms: true
      };
      this.AUTH_REGISTER(regParam);
    },
    jumpToPrivacy() {
      this.$router.push('Privacy');
    },
    jumpToPolicy() {
      this.$router.push('Policy');
    }
  }
};
</script>
<style lang="scss">
@import './../../assets/scss/_variables.scss';
#register {
  .b-icon {
    font-size: 18px;
    color: $aqua;
  }
}
.v-tooltip__content {
  background: $aqua !important;
}
</style>
