<template>
  <v-flex>
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="companyName"></header-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-layout>
      <v-flex xs12
              sm8
              offset-sm2
              class="b-checklist">
        <div class="b-content">
          <v-flex xs12
                  sm12
                  d-flex>
            <v-tabs slot="extension"
                    v-model="tabs"
                    centered
                    grow>
              <v-tab v-for="item in titleList"
                     :key="item.value"
                     @click.native="getActiveTab(item.value)">
                {{ item.title }}
              </v-tab>
              <v-tab-item v-show="activeTab === 0">
                <v-list two-line>
                  <template v-for="(item, index) in listItems">
                    <v-list-tile :key="item.title"
                                 @click="jumpToUserInfo(item)"
                                 avatar
                                 ripple>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ item.name }}
                          <v-icon color="yellow darken-2"
                                  v-if="item.role === 1">
                            star
                          </v-icon>
                        </v-list-tile-title>
                        <v-list-tile-sub-title>{{ item.email }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action v-if="item.role != 1">
                        <v-btn round
                               icon
                               @click.stop="choiceUser(item.id)">
                          <v-icon
                          color="rgba(25, 31, 37, 0.28)">
                            delete_forever
                          </v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider :key="index" />
                  </template>
                </v-list>
              </v-tab-item>
              <v-tab-item v-show="activeTab === 1">
                <v-list two-line>
                  <template v-for="(item, index) in authListItems">
                    <v-list-tile :key="item.name"
                                 @click="jumpToUserInfo(item)"
                                 avatar
                                 ripple>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ item.name }}
                          <v-icon color="yellow darken-2"
                                  v-if="item.role === 1">
                            star
                          </v-icon>
                        </v-list-tile-title>
                        <v-list-tile-sub-title>{{ item.email }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action v-if="item.role != 1">
                        <v-btn round
                               icon
                               @click.stop="choiceUser(item.id)">
                          <v-icon
                          color="rgba(25, 31, 37, 0.28)">
                            delete_forever
                          </v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider :key="index" />
                  </template>
                </v-list>
              </v-tab-item>
              <v-tab-item v-show="activeTab === 2">
                <v-list two-line>
                  <template v-for="(item, index) in stampListItems">
                    <v-list-tile :key="item.name"
                                 @click="jumpToUserInfo(item)"
                                 avatar
                                 ripple>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ item.name }}
                          <v-icon color="yellow darken-2"
                                  v-if="item.role === 1">
                            star
                          </v-icon>
                        </v-list-tile-title>
                        <v-list-tile-sub-title>{{ item.email }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action v-if="item.role != 1">
                        <v-btn round
                               icon
                               @click.stop="choiceUser(item.id)">
                          <v-icon
                          color="rgba(25, 31, 37, 0.28)">
                            delete_forever
                          </v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider :key="index" />
                  </template>
                </v-list>
              </v-tab-item>
            </v-tabs>
          </v-flex>
        </div>
        <v-flex xs12
                v-if="authListItems.length === 0 && activeTab === 1">
          <v-flex xs12>
            <v-icon class="b-icon-add"
                    color="rgba(25, 31, 37, 0.28)">person_add</v-icon>
            <p class="b-context"
               v-text="$t('checklist.plz_add_singer.title')">請新增簽署人</p>
          </v-flex>
          <v-flex xs10
                  offset-xs1>
            <v-btn round
                   color="info"
                   block
                   large
                   @click.stop="goPage()"
                   v-text="$t('create_auth.toolbar_title.text')">
              授權新簽署人
            </v-btn>
          </v-flex>
        </v-flex>
      </v-flex>
      <AddBtn :call-back="addMemberCallBack" />
    </v-layout>
  </v-flex>
</template>

<script>
import CryptoJS from 'crypto-js';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { actions, mutations, getters } from './../../store/type.js';
const AddBtn = () => import('../../components/AddBtn.vue');
export default {
  name: 'ManagementIndex',
  components: {
    AddBtn
  },
  data() {
    return {
      tabs: null,
      activeTab: 0,
      openDialog: false,
      titleList: [
        {
          title: this.$t('checklist.management_list.title'),
          value: 0
        },
        {
          title: this.$t('checklist.auth_list.title'),
          value: 1
        },
        {
          title: this.$t('checklist.stamp_list.title'),
          value: 2
        }
      ],
      listItems: [],
      authListItems: [],
      deleteId: null,
      companyName: ''
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA
    })
  },
  created() {
    this.getActiveTab(this.activeTab);
    const { companyList } = this.USER_DATA;
    this.companyName = companyList.find(item => {
      return item.id === Number(this.$route.params.id);
    }).name;
  },
  methods: {
    ...mapActions({
      GET_SIGNING_USERS: actions.GET_SIGNING_USERS,
      POST_SINGING_USERS_DELETE: actions.POST_SINGING_USERS_DELETE,
      errHandler: 'errHandler'
    }),
    ...mapMutations({
      UPDATE_LOAD_STATUS: mutations.UPDATE_LOAD_STATUS
    }),
    goPage() {
      this.$router.push('CreateAuth');
    },
    addMemberCallBack() {
      switch (this.activeTab) {
        case 0:
          return this.$router.push({
            name: 'EditManager',
            params: { type: 'AddManager', id: this.$route.params.id }
          });

        case 1:
          return this.$router.push({
            name: 'CreateAuth',
            params: { type: this.$route.params.id }
          });
      }
    },

    async getActiveTab(value) {
      const params = {
        corpId: this.$route.params.id,
        role: value === 0 ? 'admin' : value === 1 ? 'user' : 'signature'
      };

      if (value === 0) {
        let signingUsers = await this.GET_SIGNING_USERS(params);
        this.listItems = [...signingUsers];
        this.listItems = this.listItems.sort(m => {
          if (m.role === 1) {
            return -1;
          } else {
            return 1;
          }
        });
      } else if (value === 1) {
        let signingUsers = await this.GET_SIGNING_USERS(params);
        this.authListItems = [...signingUsers];
      } else {
        let signingUsers = await this.GET_SIGNING_USERS(params);
        this.stampListItems = [...signingUsers];
      }
      this.activeTab = value;
    },
    choiceUser(id) {
      this.modal.show({
        componentName: 'ConfirmCerPassword',
        onConfirm: password => {
          this.UPDATE_LOAD_STATUS(true);
          this.deleteUser(id, password);
        }
      });
    },
    async deleteUser(id, pwd) {
      const params = {
        corpId: this.$route.params.id,
        userId: id,
        role: this.activeTab === 0 ? 2 : 3,
        pwd
      };

      try {
        let res = await this.POST_SINGING_USERS_DELETE(params);
        this.modal.show({
          title: this.$t('common.confirm'),
          content: this.$t('common.del_success'),
          showIcon: false,
          showCancel: false
        });
        this.getActiveTab(this.activeTab);
      } catch (error) {
        this.errHandler(error);
      }
    },

    jumpToUserInfo(userData) {
      this.$router.push({ name: 'UserInfo', params: { companyId: this.$route.params.id, userId: userData.id } });
    }
  }
};
</script>

<style lang="scss">
@import './../../assets/scss/_variables.scss';
.b-checklist {
  .accent {
    background-color: $turquoise-blue !important;
    border-color: $turquoise-blue !important;
  }
  .container {
    padding-bottom: 0;
  }
  .b-content {
    background-color: #fff;
  }
  .b-icon-add {
    font-size: 80px;
  }
  .v-tabs__bar.theme--light {
    margin: 0 16px;
    border-bottom: 1px solid $divider;
  }
  .v-list {
    padding-bottom: 0;
  }
  .yellow--text.text--darken-2 {
    padding-left: 9px;
  }
}
</style>
