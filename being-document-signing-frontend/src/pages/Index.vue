<template>
  <v-flex>
    <v-toolbar height="56"
               class="b-toolbar"
               app>
      <v-flex xs2>
        <v-btn class="b-toolbar-icon left"
               icon
               :ripple="false"
               @click="toggleStatus = !toggleStatus">
          <v-icon class="b-text">view_headline</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs8>
        <v-toolbar-title @click="goto('/')"> <div v-text="$t('common.app_name')">簽署王</div></v-toolbar-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container>
      <v-layout>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <v-content>
            <LetterList />
          </v-content>
          <SignBtn />
        </v-flex>
      </v-layout>
    </v-container>
    <!-- right navigation -->
    <v-navigation-drawer v-model="toggleStatus"
                         absolute
                         disable-resize-watcher
                         touchless
                         temporary>
      <v-list class="email">
        <div class="user_info"><span v-text="companyName"></span> <v-icon light @click="openSelectCompanyRoleModal">expand_more</v-icon></div>
        <div class="user_info menu-pdd" >
          <span>{{ userData.name }}</span>
        </div>
        <div id="user_mail" class="menu-pdd">{{ userData.email }}</div>
        <div class="user_info menu-pdd loginlasttime">
          <span v-text="$t('common.user.last_login_time')"></span>
          <span>{{ showTime(userData.lastLoginTime) }}</span>
        </div>
      </v-list>

      <v-list class="pt-0 menu_list"
              dense>
        <v-divider />

        <v-list-tile v-if="false">
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('index.data.left_menu.real_name_auth')" />
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click.prevent="goto('/client/AccountInfo')">
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('index.data.left_menu.account_info')" />
          </v-list-tile-content>
        </v-list-tile>

        <!-- <v-list-tile @click.prevent="goto('/client/ChangePassword')"
                     v-if="!inDingDing">
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('index.data.left_menu.change_password')" />
          </v-list-tile-content>
        </v-list-tile> -->

        <!-- <v-list-tile @click.prevent="goto('/client/AuthCode')">
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('index.data.left_menu.set_cert_password')" />
          </v-list-tile-content>
        </v-list-tile> -->

        <!-- <v-list-tile @click.prevent="goto('/client/ContactPerson')">
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('index.data.left_menu.set_contact')" />
          </v-list-tile-content>
        </v-list-tile> -->

        <!-- <v-list-tile @click.prevent="goto('/client/SetTags')">
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('index.data.left_menu.set_tags')" />
          </v-list-tile-content>
        </v-list-tile> -->

        <v-list-tile v-if="false">
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('index.data.left_menu.real_name_com_auth')" />
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click.prevent="goto('/client/Purchase')">
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('index.data.left_menu.purchase')" />
          </v-list-tile-content>
        </v-list-tile>
        <!-- <v-list-tile @click.prevent="goto('/client/SetLanguages')">
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('set_languages.title.text')" />
          </v-list-tile-content>
        </v-list-tile> -->
        <v-list-tile @click.prevent="goto('/client/CheckFile')">
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('check_file.title.text')" />
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click.prevent="goto('/admin/ManagementIndex')"
                     v-if="showCMS">
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('index.data.left_menu.admin')" />
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile class="other-list"
                     v-if="!inDingDing"
                     @click="logout(false)">
          <v-list-tile-title v-text="$t('common.logout')" />
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-flex>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { actions, mutations, getters } from './../store/type.js';

const LetterList = () => import('./../components/LetterList.vue');
const SignBtn = () => import('./../components/SignBtn.vue');

export default {
  components: {
    LetterList,
    SignBtn
  },
  data() {
    return {
      toggleStatus: false,
      showCMS: false,
      companyId: 0,
      intervalTimer: null
    };
  },
  computed: {
    ...mapGetters({
      inDingDing: getters.DING_DING_STATUS,
      userData: getters.USER_DATA,
      TAG_LIST: getters.TAG_LIST,
      CONTACT: getters.CONTACT,
      LOGIN_STATUS: getters.LOGIN_STATUS,
      DING_DING_STATUS: getters.DING_DING_STATUS,
      userEntity: getters.USER_ENTITY
    }),
    companyName() {
      const getCompanyName = id => {
        let companyName;
        const { companyList } = this.userData;
        for (let i = 0, c; (c = companyList[i]); i++) {
          if (c.id === id) {
            companyName = c.name;
            // this.SET_SIGNATURE_STATUS({ companyName });

            break;
          }
        }
        return companyName || this.$t('common.person');
      };
      const removeCompanyName = () => {
        // this.SET_SIGNATURE_STATUS({ companyName: '' });
        return this.$t('common.person');
      };
      return this.companyId === 0 ? removeCompanyName() : getCompanyName(this.companyId);
    }
  },
  created() {
    if (!this.LOGIN_STATUS) {
      this.DING_DING_STATUS ? this.$router.push({ name: 'WelcomePage' }) : this.$router.push({ name: 'Login' });
      return;
    }
    this.GET_LETTER_STATUS().then(res => {
      this.UPDATE_LETTER_DATA(res);
    });
    this.GET_SIGNING_CORPS({ role: 'admin', token: this.userData.token }).then(({ companyList }) => {
      this.showCMS = companyList.length > 0;
    });
    this.Time();
    this.companyId = this.userEntity;
  },
  destroyed() {
    clearInterval(this.intervalTimer);
  },
  methods: {
    ...mapActions({
      POST_AUTH_LOGOUT: actions.POST_AUTH_LOGOUT,
      GET_SIGNING_CORPS: actions.GET_SIGNING_CORPS,
      GET_LETTER_STATUS: actions.GET_LETTER_STATUS
    }),
    ...mapMutations({
      UPDATE_LOGIN_STATUS: mutations.UPDATE_LOGIN_STATUS,
      UPDATE_LETTER_DATA: mutations.UPDATE_LETTER_DATA,
      SET_USER_ENTITY: mutations.SET_USER_ENTITY
    }),
    async logout() {
      await this.POST_AUTH_LOGOUT();
      this.UPDATE_LOGIN_STATUS(false);
    },
    goto(router) {
      this.$router.push(router);
    },
    openSelectCompanyRoleModal() {
      this.modal.show({
        componentName: 'ChangeCompanyRole',
        onConfirm: companyId => {
          this.companyId = companyId;
          this.SET_USER_ENTITY(this.companyId);
        }
      });
    },
    Time() {
      this.intervalTimer = setInterval(() => {
        this.showTime();
      }, 10000);
    },
    showTime(date) {
      let dateStr = new Date(date).getTime();
      let nowdate = new Date();
      nowdate.setHours(0);
      nowdate.setMinutes(0);
      nowdate.setSeconds(0);
      nowdate.setMilliseconds(0);
      let offset = dateStr - nowdate.getTime();
      let isToday = offset / 1000 / 60 / 60;
      if (isToday > 0 && isToday <= 24) {
        return '今天';
      } else if (isToday < 0 && isToday >= -24) {
        return '昨天';
      } else {
        return moment(date).format('MM') + '月' + moment(date).format('DD') + '日';
      }
    }
  }
};
</script>

<style lang="scss">
// .theme--light.v-list .v-list__tile--link:hover {
//   background: #666666 !important;
// }

.menu_list {
  height: calc(100vh - 47px - 56px);
  background-color: #404040 !important;
  .v-list__tile.v-list__tile--link.theme--light {
    height: 56px;
  }
  .v-list__tile.v-list__tile--link.theme--light:hover {
    background: #565656 !important;
  }
  .v-list__tile__title {
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
  }
}
.other-list {
  border-top: 1px solid rgba(25, 31, 37, 0.08);
}
.email {
  height: 120px;
  background-color: #13c3ea !important;
  text-align-last: left;
  padding-left: 16px;
  color: #ffffff !important;
  .user_info {
    margin-bottom: 1px;
    line-height: 24px;
    font-size: 14px;
    font-weight: bold;
  }
  #user_mail {
    line-height: 30px;
    font-size: 12px;
    text-align-last: left;
    // margin-left: 16px;
    font-weight: 500;
    letter-spacing: 0.3px;
    // color: #13c3ea;
  }
  .loginlasttime {
    font-style: italic;
    font-size: 10px;
    color: #9cdcec;
    font-weight: 100;
  }
  .theme--light.v-icon {
    color: #ffffff;
  }
}

.theme--light.v-navigation-drawer:not(.v-navigation-drawer--floating) .v-navigation-drawer__border {
  background: none;
}
.v-navigation-drawer {
  max-height: 100vh;
}
.v-navigation-drawer::-webkit-scrollbar {
  display: none;
}
.v-overlay:before {
  background-color: #000000 !important;
}
.v-overlay--active:before {
  opacity: 0.6 !important;
}
.menu-pdd {
  margin-left: 4.2rem;
}
</style>
