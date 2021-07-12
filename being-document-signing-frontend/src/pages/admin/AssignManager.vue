<template>
  <v-flex>
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('edit_manager.toolbar_title_main.text')"></header-title>
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
                  <p class="b-label">Email</p>
                </v-flex>
                <v-text-field outline
                              required
                              class="b-input"
                              v-model.trim="mailto"
                              :rules="rules.email"
                              validate-on-blur
                              :placeholder="$t('common.email_rules.input_email')" />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.verify_code')">驗證碼</p>
                </v-flex>
                <v-flex xs12
                        sm12
                        d-flex>
                  <v-text-field outline
                                required
                                class="b-input"
                                v-model="authCode"
                                validate-on-blur
                                :rules="rules.authCode"
                                type="password"
                                maxlength="6"
                                :placeholder="$t('common.verify_code_placeholder')" />
                  <auth-code-btn @clickAuthCodeBtn="clickAuthCodeBtn"
                                 :user-email="mailto"
                                 :manual="true" />
                </v-flex>

              </v-form>
            </v-card-text>
          </v-card>
          <v-flex xs12
                  sm12
                  d-flex
                  class="b-btn-area">
            <v-btn round
                   large
                   class="b-btn mt-3"
                   @click="submit"
                   :disabled="!authCodeBtnStatus"
                   v-text="$t('set_mail.binding.text')" />
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>
<script>
import AuthCodeBtn from './../../components/AuthCodeBtn';
import rulesMixin from './../../mixins/Rules.js';
import { actions, mutations } from './../../store/type';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { getters } from './../../store/type.js';

export default {
  components: {
    AuthCodeBtn
  },
  mixins: [rulesMixin],
  data() {
    return {
      valid: false,
      verifyCode: '',
      authCode: '',
      mailto: ''
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA
    })
  },
  methods: {
    ...mapActions({
      transferManager: actions.POST_SIGNING_ADMIN_TRANSFER,
      errHandler: 'errHandler'
    }),
    ...mapMutations({
      UPDATE_LOAD_STATUS: mutations.UPDATE_LOAD_STATUS
    }),
    submit() {
      this.modal.show({
        componentName: 'ConfirmCerPassword',
        onConfirm: async pwd => {
          this.UPDATE_LOAD_STATUS(true);
          const params = {
            corpId: this.$route.params.companyId,
            email: this.mailto,
            emailCode: this.authCode,
            pwd
          };
          try {
            await this.transferManager(params);
            this.modal.show({
              title: this.$t('common.confirm'),
              content: this.$t('common.transfer_success'),
              showIcon: false,
              showCancel: false
            });
            this.mailto = '';
            this.authCode = '';
            this.$router.push({ name: 'Index' });
          } catch (error) {
            this.errHandler(error);
          }
        }
      });
    }
  }
};
</script>
<style lang="scss">
</style>
