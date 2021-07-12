<template>
  <v-flex>
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
      <v-layout row
                wrap>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3>

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
                              v-model.trim="mailto"
                              single-line
                              outline
                              validate-on-blur
                              :placeholder="$t('common.mail_placeholder')"
                              :rules="rules.email"
                              required />
              </v-flex>

              <v-dialog v-model="resultDialog"
                        max-width="290">
                <v-card>
                  <v-card-title class="b-dialog-title"
                                v-text="$t('common.auth_success')" />
                  <v-card-text>
                    <v-flex xs12
                            sm12
                            d-flex>
                      <p>已經在區塊鏈產生一份XX公司授權於OOO簽署的授權證書</p>
                    </v-flex>
                    <v-flex xs12
                            sm12
                            d-flex>
                      <p>描述相關法律責任...</p>
                    </v-flex>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn round
                           color="info"
                           @click="resultDialog = false"
                           v-text="$t('common.confirm')" />
                  </v-card-actions>
                </v-card>
              </v-dialog>

            </v-card-text>
          </v-card>
          <v-flex xs12
                  sm12
                  d-flex
                  class="b-btn-area">
            <v-btn round
                   large
                   class="b-btn mt-3"
                   @click.stop="confirmCer()"
                   v-text="$t('common.add')" />
          </v-flex>

        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { actions, mutations, getters } from './../../store/type.js';
import rulesMixin from './../../mixins/Rules.js';

export default {
  name: 'CreateAuth',
  mixins: [rulesMixin],
  data() {
    return {
      pageTitle: '',
      dialogStatus: false,
      resultDialog: false,
      mailto: '',
      signPassword: ''
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA
    })
  },
  mounted() {
    this.pageTitle = this.$t('create_auth.toolbar_title.text');
  },
  methods: {
    ...mapActions({
      addAuthPerson: actions.POST_SIGNING_USER_ADD,
      errHandler: 'errHandler'
    }),
    ...mapMutations({
      UPDATE_LOAD_STATUS: mutations.UPDATE_LOAD_STATUS
    }),
    confirmCer() {
      if (this.$refs.input.validate()) {
        this.modal.show({
          componentName: 'ConfirmCerPassword',
          onConfirm: password => {
            this.UPDATE_LOAD_STATUS(true);
            this.addAuth(password);
          }
        });
      }
    },
    async addAuth(pwd) {
      const params = {
        corpId: this.$route.params.type,
        email: this.mailto,
        role: 3,
        pwd
      };
      try {
        let res = await this.addAuthPerson(params);
        this.modal.show({
          title: this.$t('common.confirm'),
          content: this.$t('common.add_success'),
          showIcon: false,
          showCancel: false
        });
        this.mailto = '';
        this.$refs.input.resetValidation();
      } catch (error) {
        this.errHandler(error);
      }
    }
  }
};
</script>

<style lang="scss">
.v-toolbar__title:not(:first-child) {
  margin: 0;
}
</style>
