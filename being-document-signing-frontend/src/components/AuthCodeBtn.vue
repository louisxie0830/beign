<template>
  <v-btn id="auth-code"
         class="b-btn"
         round
         color="info"
         :flat="true"
         @click="getAuthCode"
         :disabled="btnDisable">{{ btnText }}</v-btn>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { actions, getters } from './../store/type.js';
export default {
  props: {
    userEmail: {
      type: String,
      default: ''
    },
    requirePhone: {
      type: Boolean,
      default: false
    },
    userPhone: {
      type: String,
      default: ''
    },
    apiType: {
      type: [Number, String],
      default: null
    },
    manual: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timeNum: 60,
      btnText: this.$t('common.get_verify_code'),
      btnDisable: false,
      intervalTimer: null
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA
    })
  },
  destroyed() {
    if (this.intervalTimer) clearInterval(this.intervalTimer);
  },
  methods: {
    ...mapActions({
      emailSend: actions.POST_EMAIL_SEND
    }),
    getAuthTimer() {
      if (this.intervalTimer) clearInterval(this.intervalTimer);
      this.btnDisable = true;
      this.timeNum = 60;
      this.btnText = `${this.timeNum} (s)`;
      this.intervalTimer = setInterval(() => {
        if (this.timeNum <= 0) {
          this.btnText = this.$t('common.get_verify_code');
          this.btnDisable = false;
          return;
        }
        this.timeNum--;
        this.btnText = `${this.timeNum} (s)`;
      }, 1000);
    },
    getAuthCode() {
      if (this.manual) {
        if (this.requirePhone && !this.userPhone) {
          this.toast.show({
            icon: 'info',
            content: this.$t('common.mail_phone_placeholder')
          });
          return;
        } else if (!this.userEmail) {
          this.toast.show({
            icon: 'info',
            content: this.$t('common.mail_placeholder')
          });
          return;
        }
      } else {
        if (!this.userEmail && !this.USER_DATA.email) {
          this.toast.show({
            icon: 'info',
            content: this.$t('common.mail_placeholder')
          });
          return;
        }
      }

      let params = {
        email: this.userEmail || this.USER_DATA.email
      };
      if (this.apiType) {
        params = { ...params, type: +this.apiType };
      }
      if (this.requirePhone) {
        params = { ...params, phone: this.userPhone };
      }
      this.emailSend(params);
      this.getAuthTimer();
      this.$emit('clickAuthCodeBtn', true);
    }
  }
};
</script>
<style lang="scss">
#auth-code {
  margin: 0 0 0 10px;
  border: 1px solid #95dded !important;
  height: 40px;
  border-radius: 22px;
  background-color: #fff !important;
  font-family: PingFangTC;
  font-size: 1rem;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 20px;
  letter-spacing: normal;
  text-align: center;
  color: #10acce !important;
}
</style>
