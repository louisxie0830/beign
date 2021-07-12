<template>
  <v-flex>
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <v-toolbar-title @click="$router.push('/')"><div class="logo-title"><div class="logo-box"><span class="logo-image"></span></div><div class="logo-content" v-text="$t('common.app_name')">簽署王</div></div></v-toolbar-title>
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
                      v-model="valid"
                      lazy-validation>
                <v-flex xs12>
                  <p class="b-label">Email</p>
                </v-flex>
                <v-text-field class="b-input"
                              validate-on-blur
                              v-model.trim="email"
                              :rules="rules.email"
                              :placeholder="$t('common.mail_placeholder')"
                              single-line
                              outline
                              required />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.password')" />
                </v-flex>
                <v-text-field class="b-input"
                              validate-on-blur
                              v-model.trim="password"
                              v-disable-paste
                              :rules="rules.password"
                              :placeholder="$t('common.password_placeholder')"
                              type="password"
                              single-line
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
                   class="b-btn"
                   large
                   @click="submit"
                   v-text="$t('common.login')" />
          </v-flex>
          <v-flex xs12
                  sm12
                  mt-3
                  d-flex
                  class="b-btn-area">
            <v-btn :flat="true"
                   round
                   class="login-text"
                   large
                   to="client/ForgetPassword"
                   v-text="$t('common.forget_password')" />
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>
 
<script>
import rulesMixin from './../mixins/Rules.js';
import { mapActions } from 'vuex';
import { actions } from './../store/type.js';

export default {
  mixins: [rulesMixin],
  data() {
    return {
      valid: false,
      password: '',
      email: ''
    };
  },
  methods: {
    ...mapActions({
      AUTH_LOGIN: actions.AUTH_LOGIN
    }),
    async submit() {
      if (!this.$refs.form.validate()) {
        return;
      }

      await this.AUTH_LOGIN({
        email: this.email,
        password: this.password
      });
    }
  }
};
</script>
