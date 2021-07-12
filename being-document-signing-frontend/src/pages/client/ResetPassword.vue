<template>
  <v-flex>
    <v-toolbar height="56"
               app>
      <v-flex xs2 />
      <v-flex xs8>
        <v-toolbar-title v-text="$t('reset_password.toolbar_title.text')">重設密碼</v-toolbar-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-layout>
      <v-flex xs12
              sm8
              md6
              offset-sm2
              offset-md3>
        <v-container pa-3>
          <v-card>
            <v-card-text>
              <v-form ref="form"
                      v-model="valid">
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.password')">密碼</p>
                </v-flex>
                <v-text-field class="b-input"
                              v-model.trim="password"
                              type="password"
                              validate-on-blur
                              :rules="rules.password"
                              :placeholder="$t('common.password_rules.input_password_with_length')"
                              outline
                              required />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.confirm_password')">確認密碼</p>
                </v-flex>
                <v-text-field class="b-input"
                              v-model.trim="confirmPassword"
                              type="password"
                              validate-on-blur
                              :rules="rules.confirmPassword(password)"
                              :placeholder="$t('common.password_rules.input_confrim_password')"
                              outline
                              required />

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
                   v-text="$t('reset_password.toolbar_title.text')">
              重設密碼
            </v-btn>
          </v-flex>
        </v-container>
      </v-flex>
    </v-layout>
  </v-flex>
</template>
<script>
import rulesMixin from './../../mixins/Rules.js';
import { mapActions } from 'vuex';
import { actions } from './../../store/type.js';

export default {
  mixins: [rulesMixin],
  data() {
    return {
      valid: false,
      password: '',
      confirmPassword: ''
    };
  },
  methods: {
    ...mapActions({
      resetPassword: actions.POST_AUTH_PASSWORD_FORGET_RESET,
      errHandler: 'errHandler'
    }),
    async submit() {
      const code = this.$route.query.hash;
      if (!!this.$refs.form.validate() && code) {
        let params = {
          password: this.password,
          passwordConfirm: this.confirmPassword,
          hash: code
        };
        try {
          await this.resetPassword(params);
        } catch (error) {
          this.errHandler(error);
        }
      }
    }
  }
};
</script>
<style lang="scss">
</style>
