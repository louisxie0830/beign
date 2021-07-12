<template>
  <v-flex xs12
          sm8
          offset-sm2
          class="b-editmanager">
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="pageTitle"></header-title> 
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-3>
      <v-layout>
        <v-flex xs12
                sm8
                md6
                offset-md3
                offset-sm2>

          <div v-if="$route.params.type === 'ChangeManager'">
            <v-card>
              <v-card-text>
                <v-flex xs12
                        sm12
                        d-flex>
                  <p v-text="$t('edit_manager.binding_description.text')" />
                </v-flex>
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.verify_code')" />
                </v-flex>
                <v-flex xs12
                        sm12
                        d-flex>
                  <v-text-field class="b-input"
                                v-model.trim="authCode"
                                single-line
                                outline
                                validate-on-blur
                                :rules="rules.authCode"
                                maxlength="6"
                                type="password"
                                :placeholder="$t('common.verify_code_placeholder')" />
                  <auth-code-btn />
                </v-flex>
              </v-card-text>
            </v-card>
            <v-flex xs12
                    sm12
                    d-flex
                    class="b-btn-area">
              <v-btn round
                     large
                     class="b-btn mt-3"
                     @click.stop="goPage()"
                     v-text="$t('common.next_step')">下一步</v-btn>
            </v-flex>
          </div>

          <div v-else>
            <v-card>
              <v-card-text>
                <v-flex xs12>
                  <p class="b-label">Email</p>
                </v-flex>
                <v-flex xs12
                        sm12
                        d-flex>
                  <v-text-field ref="input"
                                class="b-input"
                                single-line
                                outline
                                :placeholder="$t('common.mail_placeholder')"
                                validate-on-blur
                                :rules="rules.email"
                                v-model.trim="mailto"
                                required />
                </v-flex>
                <v-flex xs6
                        offset-xs3
                        v-if="false">
                  <div class="b-error-text">
                    <v-icon>cancel</v-icon>{{ $t('edit_manager.not_found_user.text') }}
                  </div>
                </v-flex>
              </v-card-text>
            </v-card>
            <v-flex xs12
                    sm12
                    d-flex
                    class="b-btn-area">
              <v-btn large
                     round
                     class="b-btn mt-3"
                     @click.stop="confirmCer()"
                     v-text="$t('common.add')" />
            </v-flex>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>

<script>
import AuthCodeBtn from './../../components/AuthCodeBtn';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { actions, mutations, getters } from './../../store/type';
import rulesMixin from './../../mixins/Rules.js';
export default {
  name: 'EditManager',
  components: { AuthCodeBtn },
  mixins: [rulesMixin],
  data() {
    return {
      pageTitle: '',
      authCode: '',
      mailto: '',
      changeStep: 1
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA
    })
  },
  mounted() {
    this.pageTitle =
      this.$route.params.type === 'ChangeManager'
        ? this.$t('management.index.change_manager')
        : this.$t('management.index.add_manager');
  },
  methods: {
    ...mapActions({
      POST_SIGNING_USER_ADD: actions.POST_SIGNING_USER_ADD,
      POST_EMAIL_VERIFY: actions.POST_EMAIL_VERIFY,
      errHandler: 'errHandler'
    }),
    ...mapMutations({
      UPDATE_LOAD_STATUS: mutations.UPDATE_LOAD_STATUS
    }),
    addSubManager() {
      this.toast.show({
        icon: 'done',
        height: 120,
        width: 120,
        content: this.$t('common.add_success')
      });
    },
    confirmCer() {
      this.modal.show({
        componentName: 'ConfirmCerPassword',
        onConfirm: password => {
          this.UPDATE_LOAD_STATUS(true);
          this.addAuth(password);
        }
      });
    },
    async addAuth(password) {
      const params = {
        corpId: this.$route.params.id,
        email: this.mailto,
        role: 2,
        pwd: password
      };

      try {
        let res = await this.POST_SIGNING_USER_ADD(params);
        this.modal.show({
          title: this.$t('common.confirm'),
          content: this.$t('common.add_success'),
          showIcon: false,
          showCancel: false
        });
      } finally {
        this.mailto = '';
        this.$refs.input.resetValidation();
      }
    },
    async goPage() {
      const params = {
        email: this.USER_DATA.email,
        code: this.authCode
      };
      const res = await this.POST_EMAIL_VERIFY(params);
      const companyId = this.$route.params.id;
      if (res.code === 200) {
        this.$router.push({ name: 'AssignManager', params: { companyId: companyId } });
      }
    }
  }
};
</script>

<style lang="scss">
.b-editmanager {
  p {
    text-align: left;
  }
  .v-toolbar__title:not(:first-child) {
    margin: 0;
  }
  .b-btn-full {
    border-radius: inherit !important;
    margin: 0 !important;
    width: 100% !important;
  }
  .b-error-text {
    display: flex;
    margin-top: 24px;
    justify-content: center;
    align-items: center;
    height: 36px;
    color: #f56c6c;
    border: 1px solid #fde2e3;
    border-radius: 4px;
    background-color: #feeff0;
    i {
      font-size: 20px;
      margin: 0 5px;
      color: #f56c6c !important;
    }
  }
}
</style>
