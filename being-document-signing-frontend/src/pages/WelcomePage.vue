<template>
  <v-flex xs12
          sm8
          md6
          offset-sm2
          offset-md3
          id="welcome_page">

    <v-container fluid>
      <v-carousel flat="true"
                  hide-controls
                  style="box-shadow:none;background-size:cover;overflow:visible !important;overflow-x:hidden !important;"
                  height="460"
                  @change="changeCarouselItem"
                  max="450">
        <div style="heignt: 460px">
          <v-carousel-item style="#333"
                           v-for="(item,i) in items"
                           :key="i"
                           :src="item.src">
            <div style="margin-top: 300px;">
              <div class="welcome_title"
                   v-text="items[currentIndex].title" />
              <div class="welcome_content" v-html="$sanitize(items[currentIndex].text)" />
            </div>
          </v-carousel-item>
        </div>
      </v-carousel>

      <v-flex class="b-footer"
              xs12
              sm12
              d-flex>
        <v-btn v-show="!isDingTalk"
               round
               large
               class="b-btn white"
               to="/client/Register"
               v-text="$t('common.register')" />
        <v-btn v-show="!isDingTalk"
               round
               large
               class="b-btn"
               to="/Login"
               v-text="$t('common.login')" />

        <v-btn v-if="isDingTalk"
               round
               large
               class="b-btn"
               :disabled="!dingConfig"
               @click="checkBindEmail"
               v-text="$t('common.start')" />
      </v-flex>
    </v-container>
  </v-flex>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { actions, getters } from './../store/type.js';
const step1 = require('./../assets/image/01@2x.png');
const step2 = require('./../assets/image/02@2x.png');
const step3 = require('./../assets/image/03@2x.png');
const step4 = require('./../assets/image/04@2x.png');

export default {
  name: 'WelcomePage',
  data() {
    return {
      currentIndex: 0,
      items: [
        {
          src: step1,
          title: this.$t('welcom_page.step1.title'),
          text: this.$t('welcom_page.step1.content')
        },
        {
          src: step2,
          title: this.$t('welcom_page.step2.title'),
          text: this.$t('welcom_page.step2.content')
        },
        {
          src: step3,
          title: this.$t('welcom_page.step3.title'),
          text: this.$t('welcom_page.step3.content')
        },
        {
          src: step4,
          title: this.$t('welcom_page.step4.title'),
          text: this.$t('welcom_page.step4.content')
        }
      ],
      token: null
    };
  },
  computed: {
    ...mapGetters({
      isDingTalk: getters.DING_DING_STATUS,
      dingConfig: getters.DING_CONFIG,
      LOGIN_STATUS: getters.LOGIN_STATUS
    })
  },
  created() {
    if (!!this.LOGIN_STATUS) {
      this.$router.push({ name: 'Index' });
      return;
    }
  },
  methods: {
    ...mapActions({
      UNAUTHORIZED_LOGIN: actions.UNAUTHORIZED_LOGIN
    }),
    changeCarouselItem(idx) {
      this.currentIndex = idx;
    },
    async checkBindEmail() {
      await this.UNAUTHORIZED_LOGIN();
    }
  }
};
</script>

<style lang="scss">
@import './../assets/scss/_variables.scss';

#welcome_page {
  .v-btn--active {
    color: $aqua !important;
  }
  .theme--dark.v-btn {
    color: rgba(0, 0, 0, 0.22);
  }
  .welcome_title {
    margin-top: 24px;
    font-size: 20px;
  }
  .welcome_content {
    margin-top: 8px;
    height: 80px;
    color: $dark-56;
    font-size: 14px;
  }
  .v-image__image {
    height: 320px;
  }
  .v-image__image--cover {
    background-size: contain;
  }
  .v-btn--icon.v-btn--small {
    width: 20px;
    height: 20px;
    margin: 4px !important;
  }
}
</style>
