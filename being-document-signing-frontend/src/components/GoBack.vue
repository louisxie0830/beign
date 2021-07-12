<template>
  <v-btn class="b-toolbar-icon left"
         icon
         :ripple="false"
         @click="goBack">
    <v-icon class="b-text">arrow_back_ios</v-icon>
    <span class="b-text"
          v-text="$t('common.back')">返回</span>
          <!--<v-icon class="b-home-icon" @click="goHome">home</v-icon> -->
  </v-btn>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import { actions, mutations } from '../store/type.js';
export default {
  methods: {
    ...mapMutations({
      RESET_STORE: mutations.RESET_STORE
    }),
    goHome() {
      this.$router.push({ name: 'Index' });
    },
    goBack() {
      if (!this.$store.state.loginStatus) {
        switch (this.$route.name) {
          case 'Register':
          case 'Login':
            this.$router.push({ name: 'WelcomePage' });
            break;
          case 'Policy':
          case 'Privacy':
            this.$router.go(-1);
            break;
          default:
            this.RESET_STORE();
            this.$router.push({ name: 'Login' });
            break;
        }
      } else {
        switch (this.$route.name) {
          case 'Register':
          case 'Login':
            this.$router.push({ name: 'WelcomePage' });
            break;
          default:
            this.$router.go(-1);
            break;
        }
      }
    }
  }
};
</script>
