<template>
  <v-flex>
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('index.data.left_menu.set_cert_password')"></header-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-3>
      <v-layout>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <v-card>
            <v-card-text>
              <v-form ref="form"
                      lazy-validation
                      v-model="valid">
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.cert_password')" />
                </v-flex>
                <v-text-field class="b-input"
                              v-model.trim="password"
                              v-disable-paste
                              validate-on-blur
                              :rules="rules.password"
                              type="password"
                              :placeholder="$t('common.cert_code_placeholder')"
                              outline
                              required />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.cert_code_again_confirm')" />
                </v-flex>
                <v-text-field class="b-input"
                              v-model.trim="confirmPassword"
                              v-disable-paste
                              type="password"
                              validate-on-blur
                              :rules="rules.confirmCertCode(password)"
                              :placeholder="$t('common.cert_code_again_placeholder')"
                              outline
                              required />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.verify_code')" />
                </v-flex>
                <v-flex xs12
                        sm12
                        d-flex>
                  <v-text-field class="b-input"
                                v-model.trim="authCode"
                                validate-on-blur
                                :rules="rules.authCode"
                                maxlength="6"
                                type="password"
                                :placeholder="$t('common.verify_code_placeholder')"
                                outline
                                required />
                  <auth-code-btn @clickAuthCodeBtn="clickAuthCodeBtn"
                                 :api-type="2" />
                </v-flex>
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('auth_code.verify_code.intro')" />
                </v-flex>

              </v-form>
            </v-card-text>
          </v-card>
          <v-flex xs12
                  sm12
                  mt-3
                  d-flex
                  class="b-btn-area">
            <v-btn round
                   large=""
                   class="b-btn"
                   @click="submit"
                   :disabled="!authCodeBtnStatus"
                   v-text="$t('common.set_up')" />
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>
<script>
const AuthCodeBtn = () => import('./../../components/AuthCodeBtn.vue');

import rulesMixin from './../../mixins/Rules.js';
import EncryptionFactory from './../../utils/EncryptionFactory.js';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { actions, mutations, getters } from './../../store/type';
export default {
  components: {
    AuthCodeBtn
  },
  mixins: [rulesMixin],
  data() {
    return {
      valid: false,
      authCode: '',
      password: '',
      confirmPassword: ''
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA
    })
  },
  methods: {
    ...mapActions({
      POST_AUTH_SIGN_PASSWORD: actions.POST_AUTH_SIGN_PASSWORD,
      POST_ERROR_REPORT: actions.POST_ERROR_REPORT
    }),
    ...mapMutations({
      UPDATE_LOAD_STATUS: mutations.UPDATE_LOAD_STATUS
    }),
    async submit() {
      if (this.$refs.form.validate()) {
        this.UPDATE_LOAD_STATUS(true);
        try {
          // Encryption
          const privateKey = await EncryptionFactory.privateKey(this.USER_DATA.email);
          const secretKey = await EncryptionFactory.secretKey(this.USER_DATA.email, this.password);
          const cerPwd = await EncryptionFactory.cerPwd(privateKey, secretKey);

          const signPasswordRes = await this.POST_AUTH_SIGN_PASSWORD({
            password: cerPwd,
            passwordConfirm: cerPwd,
            code: this.authCode
          });
          if (signPasswordRes && signPasswordRes.data.code === 200) {
            this.toast.show({
              icon: 'done',
              content: this.$t('common.change_success'),
              onHide: () => {
                this.$router.push({ name: 'Index' });
              }
            });
          }
        } catch (err) {
          this.password = '';
          this.confirmPassword = '';
          this.authCode = '';
          this.$refs.form.resetValidation();

          this.POST_ERROR_REPORT({
            errorMsg:
              JSON.stringify(err) +
              JSON.stringify({
                password: cerPwd,
                passwordConfirm: cerPwd,
                code: this.authCode
              }),
            uri: location.href
          });
        } finally {
          this.UPDATE_LOAD_STATUS(false);
        }
      }
    }
  }
};
</script>
<style lang="scss">
.set_auth_code {
  margin-top: 24px;
}
</style>
