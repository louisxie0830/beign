<template>
  <v-flex>
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('index.data.left_menu.change_password')"></header-title>
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
                      v-model="valid">
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.password')" />
                </v-flex>
                <v-text-field class="b-input"
                              v-model.trim="password"
                              v-disable-paste
                              validate-on-blur
                              :rules="rules.password"
                              type="password"
                              :placeholder="$t('common.password_placeholder')"
                              outline
                              required />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.confirm_password')" />
                </v-flex>
                <v-text-field class="b-input"
                              v-model.trim="confirmPassword"
                              v-disable-paste
                              validate-on-blur
                              :rules="rules.confirmPassword(password)"
                              type="password"
                              :placeholder="$t('common.password_rules.input_password_again')"
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
                                validate-on-blur
                                v-model.trim="authCode"
                                :rules="rules.authCode"
                                maxlength="6"
                                type="password"
                                :placeholder="$t('common.verify_code_placeholder')"
                                outline
                                required />
                  <auth-code-btn @clickAuthCodeBtn="clickAuthCodeBtn"
                                 :api-type="1" />
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
                   large
                   class="b-btn"
                   @click="submit"
                   :disabled="!authCodeBtnStatus"
                   v-text="$t('common.change_password')" />
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>
<script>
const AuthCodeBtn = () => import('./../../components/AuthCodeBtn.vue');
import rulesMixin from './../../mixins/Rules.js';
import { mapActions, mapGetters } from 'vuex';
import { actions, getters } from './../../store/type.js';
export default {
  components: {
    AuthCodeBtn
  },
  mixins: [rulesMixin],
  data() {
    return {
      valid: false,
      password: '',
      confirmPassword: '',
      authCode: ''
    };
  },
  computed: {
    ...mapGetters({
      userData: getters.USER_DATA
    })
  },
  methods: {
    ...mapActions({
      POST_AUTH_PASSWORD_RESET: actions.POST_AUTH_PASSWORD_RESET
    }),
    submit() {
      if (this.$refs.form.validate()) {
        this.POST_AUTH_PASSWORD_RESET({
          password: this.password,
          passwordConfirm: this.confirmPassword,
          code: this.authCode
        });
        this.$refs.form.resetValidation();
      }
    }
  }
};
</script>
