<template>
  <v-flex>
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('forget_password.toolbar_title.text')"></header-title>
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
                              v-model.trim="email"
                              validate-on-blur
                              :rules="rules.email"
                              :placeholder="$t('common.mail_placeholder')"
                              onkeypress="if (event.keyCode == 13) {return false;}"
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
            <v-btn class="b-btn"
                   round
                   large
                   @click.stop="submit"
                   v-text="$t('forget_password.send_verify_code')" />
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
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
      response: null,
      valid: false,
      email: ''
    };
  },
  methods: {
    ...mapActions({
      POST_AUTH_PASSWORD_FORGER: actions.POST_AUTH_PASSWORD_FORGER
    }),
    async submit() {
      if (this.response) {
        this.alert.show({
          content: this.$t('forget_password.sent_time'),
          position: 'middle'
        });
        return;
      }
      if (this.$refs.form.validate()) {
        try {
          this.response = await this.POST_AUTH_PASSWORD_FORGER({
            email: this.email
          });
          this.modal.show({
            title: this.$t('forget_password.sent_verify_mail.title'),
            content: this.$t('forget_password.sent_verify_mail.content'),
            showCancel: false
          });
          this.response &&
            setTimeout(() => {
              this.response = null;
            }, 60000);
        } catch (error) {}
      }
    }
  }
};
</script>
