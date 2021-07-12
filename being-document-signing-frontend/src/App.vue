<template>
  <v-app>
    <v-content>
      <v-container pa-0>
        <v-layout row
                  wrap
                  v-touch="{
                    left: () => handelSwipe('Left'),
                    right: () => handelSwipe('Right'),
        }">
          <transition name="fade"
                      mode="out-in">
            <keep-alive v-if="$route.meta.keepAlive">
              <router-view />
            </keep-alive>
            <router-view />
          </transition>
        </v-layout>
        <ReportMessage/>
      </v-container>
    </v-content>
    <Loading :show="loadStatus" />
  </v-app>
</template>

<script>
import DingClient from './plugins/DingTalk.js';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { actions, getters, mutations } from './store/type.js';

const Loading = () => import('./components/Loading');
const ReportMessage = () => import('./components/ReportMessage.vue');

export default {
  name: 'App',
  components: {
    Loading,
    ReportMessage
  },
  computed: {
    ...mapGetters({
      corpId: getters.CORP_ID,
      loadStatus: getters.LOAD_STATUS,
      USER_DATA: getters.USER_DATA,
      LOGIN_STATUS: getters.LOGIN_STATUS,
      LANG: getters.LANG
    }),
    watch: {
      USER_DATA: function(val) {
        if (val.name) {
          this.sendMessage.username = val.name;
        }
        if (val.email) {
          this.sendMessage.email = val.email;
        }
      }
    }
  },
  created() {
    this.SET_COUNTRY_CODE(location.href);
    this.dingTalkLogin();
    if (!!this.LOGIN_STATUS && this.USER_DATA && JSON.stringify(this.USER_DATA) !== '{}') {
      this.GET_TAG_LIST({ start: 0, limit: 20 });
      this.GET_CONTACT_LIST({ start: 0, limit: Number.MAX_SAFE_INTEGER });
      this.SET_CITY(this.USER_DATA.lang);
      this.SET_REGION(this.USER_DATA.lang);
      this.UPDATE_LANG(this.USER_DATA.lang);
    }
    window.addEventListener('offline', this.handleConnectionChange);
  },
  mounted() {
    this.$bus.$on('modal-on-show', () => {
      this.alert.hide();
      this.toast.hide();
    });
    this.$watch(
      () => {
        return this.$route.name;
      },
      val => {
        this.modal.hide();
        this.datePicker.hide();
      }
    );
  },
  beforeDestroy() {
    window.removeEventListener('offline', this.handleConnectionChange);
  },
  methods: {
    ...mapActions({
      GET_DING_CONFIG: actions.GET_DING_CONFIG,
      POST_DING_LOGIN: actions.POST_DING_LOGIN,
      GET_TAG_LIST: actions.GET_TAG_LIST,
      GET_CONTACT_LIST: actions.GET_CONTACT_LIST,
      reportAssert: 'reportAssert',
      errHandler: 'errHandler'
    }),
    ...mapMutations({
      UPDATE_DING_DING_STATUS: mutations.UPDATE_DING_DING_STATUS,
      SET_AUTHORIZATION: mutations.SET_AUTHORIZATION,
      UPDATE_CORP_ID: mutations.UPDATE_CORP_ID,
      UPDATE_DING_CONFIG: mutations.UPDATE_DING_CONFIG,
      UPDATE_LOAD_STATUS: mutations.UPDATE_LOAD_STATUS,
      SET_COUNTRY_CODE: mutations.SET_COUNTRY_CODE,
      UPDATE_LANG: mutations.UPDATE_LANG,
      UPDATE_USER_DATA: mutations.UPDATE_USER_DATA,
      SET_CITY: mutations.SET_CITY,
      SET_REGION: mutations.SET_REGION
    }),
    handleConnectionChange(event) {
      if (event.type === 'offline') {
        this.alert.show({
          content: 'You lost connection.',
          position: 'middle'
        });
      }
    },
    async dingTalkLogin() {
      if (dd && dd.env.platform !== 'notInDingTalk') {
        if (!dd.pc) {
          // toggel dingTalk navbar
          this.$watch(
            () => {
              return this.$route.name;
            },
            val => {
              dd.biz.navigation.hideBar({
                hidden: val !== 'WelcomePage'
              });
            }
          );
        }
        if (dd.ios) {
          // close web view bounce
          dd.ui.webViewBounce.disable();
        }
        const urlCorpId = DingClient.getUrlParameter('corpId') || this.USER_DATA.corpId || '';

        if (!urlCorpId) {
          this.UPDATE_DING_DING_STATUS(false);
          this.UPDATE_LOAD_STATUS(false);
          return;
        }

        this.UPDATE_LOAD_STATUS(true);
        this.UPDATE_DING_DING_STATUS(true);

        try {
          const { agentId, corpId, nonceStr, signature, timeStamp } = await this.getDingTalkAuth(
            window.location.href,
            urlCorpId
          );

          const { result } = await this.regDingTalk(agentId, corpId, timeStamp, nonceStr, signature);

          const { data } = await this.loginDingTalk(result.code, corpId);

          this.UPDATE_DING_CONFIG({
            agentId,
            corpId,
            nonceStr,
            signature,
            timeStamp
          });
          console.log('corpId: ', corpId);
          if (data.lang !== 'zh-tw' && data.lang !== 'zh-cn') {
            data.lang = 'zh-tw';
          }
          this.UPDATE_LANG(data.lang);
          this.UPDATE_USER_DATA({ lang: data.lang, token: data.token, corpId: corpId });
        } catch (error) {
          if (error.data.code == 99002) {
            const getStackTrace = function() {
              var obj = {};
              Error.captureStackTrace(obj, getStackTrace);
              return obj.stack;
            };
            const errorMessage = `tried to set invalid corpId!!! corpId:${corpId}`;
            this.reportAssert({
              fileName: '-1',
              errorLine: -1,
              errorCode: '99002',
              errorMsg: errorMessage,
              uri: location.href,
              stackTrace: getStackTrace()
            });
          }
          this.errHandler(error);
        } finally {
          this.UPDATE_LOAD_STATUS(false);
        }
      }
    },
    async getDingTalkAuth(url, corpId) {
      try {
        let {
          data: { data }
        } = await this.GET_DING_CONFIG({ url, corpId });
        return data;
      } catch (error) {
        throw error;
      }
    },
    async regDingTalk(agentId, corpId, timeStamp, nonceStr, signature) {
      const regDingTalkData = DingClient.regDingTalkData(agentId, corpId, timeStamp, nonceStr, signature);
      try {
        await DingClient.ddConfig(regDingTalkData);
        await DingClient.getUserInfo(corpId);
        const { data } = await DingClient.authLogin(corpId);

        return data;
      } catch (error) {
        throw error;
      }
    },
    async loginDingTalk(code, corpId) {
      try {
        return await this.POST_DING_LOGIN({ code, corpId });
      } catch (error) {
        throw error;
      }
    },
    handelSwipe(direction) {}
  }
};
</script>

<style lang="scss">
@import './assets/scss/_mixin.scss';
@import './assets/scss/_variables.scss';
@import url(https://fonts.googleapis.com/earlyaccess/cwtexyen.css);
#app {
  text-align: center;
  color: #2c3e50;
  background-image: url('./assets/image/bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: center 0;
  .v-toolbar + .layout {
    margin-top: 58px; //優化後預計刪除
  }
  .v-toolbar + .container {
    margin-top: 58px;
  }
}
.logo-box {
  display: inline-block;
  background-image: linear-gradient(to top right, #006a96, #009ad9, #00b8ff);
  background-image: -webkit-linear-gradient(bottom left, #006a96, #009ad9, #00b8ff);
  width: 26px;
  height: 26px;
  border-radius: 13px;
}
.logo-image {
  background-image: url('./assets/image/logo-beingsign.png');
  background-size: 20px 20px;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-top: 3px;
}
.logo-title {
  vertical-align: text-bottom;
  .logo-content {
    display: inline-block;
  }
}
</style>
