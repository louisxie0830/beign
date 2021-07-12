<template>
  <div id="letterList" v-cloak>
    <v-flex xs12
            sm12>
      <v-btn color="#fff"
             round
             large
             @click="jumpToPage(sourceStatus.AWAITING_SIGNATURE)">
        <div class="count"
             v-show="LETTER_DATA.pending">{{ LETTER_DATA.pending > 99 ? '99+' : LETTER_DATA.pending }}</div>
        <v-container>
          <v-layout row
                    wrap>
            <v-flex xs12>
              <v-icon>query_builder</v-icon>
            </v-flex>
            <v-flex xs12>
              <div class="content">{{ $t('common.wait_signature') }}</div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-btn>
      <v-btn color="#fff"
             round
             large
             @click="jumpToPage(sourceStatus.MY_STARTED_SIGNATURE)">
        <v-container>
          <v-layout row
                    wrap>
            <v-flex xs12>
              <v-icon>border_color</v-icon>
            </v-flex>
            <v-flex xs12>
              <div class="content">{{ $t('common.my_launch') }}</div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-btn>
    </v-flex>
    <v-flex xs12
            sm12>
      <v-btn color="#fff"
             round
             large
             @click="jumpToPage(sourceStatus.ACCEPTED_COPY)">
        <v-container>
          <v-layout row
                    wrap>
            <div class="count"
                 v-show="LETTER_DATA.sendToMe">{{ LETTER_DATA.sendToMe > 99 ? '99+' : LETTER_DATA.sendToMe }}</div>
            <v-flex xs12>
              <v-icon>file_copy</v-icon>
            </v-flex>
            <v-flex xs12>
              <div class="content">{{ $t('common.accepted_copy') }}</div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-btn>
      <v-btn color="#fff"
             round
             large
             @click="jumpToPage(sourceStatus.HISTORIES)">
        <v-container>
          <v-layout row
                    wrap>
            <v-flex xs12>
              <div class="all_file">{{ LETTER_DATA.myOwn || 0 }}</div>
            </v-flex>
            <v-flex xs12>
              <div class="content">{{ $t('common.all_file') }}</div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-btn>
      <v-btn to="/client/SetMail"
             v-if="false" />
    </v-flex>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getters } from './../store/type.js';
import status from './../utils/status.js';
export default {
  data() {
    return {
      letterStatus: {
        pending: 0,
        myOwn: 0,
        sendToMe: 0,
        all: 0
      },
      sourceStatus: status.SOURCE_STATUS
    };
  },
  computed: {
    ...mapGetters({
      LETTER_DATA: getters.LETTER_DATA
    })
  },
  created() {
    // pending (number): 待签署数量 ,
    // myOwn (number): 我发起签署数量 ,
    // sendToMe (number): 接收副本
  },
  methods: {
    jumpToPage(status) {
      this.$router.push({
        name: 'SignDocuments',
        params: { type: status }
      });
    }
  }
};
</script>

<style lang="scss">
@import './../assets/scss/_variables.scss';
$dev-small: 320px;
$dev-middle: 600px;
$dev-large: 1280px;

#letterList {
  .v-btn__content {
    position: unset !important;
    .all_file {
      align-items: center;
      justify-content: center;
      line-height: 1;
      vertical-align: text-bottom;
      font-size: 48px;
      color: $aqua;
    }
    .count {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 24px;
      height: 24px;
      font-size: 12px;
      line-height: 22px;
      color: #fff;
      background-color: $aqua;
      border-radius: 50%;
    }
    i {
      display: block;
      font-size: 48px;
      width: 100%;
    }
    .content {
      margin-top: 16px;
      width: 100%;
    }
  }
  .v-btn--round {
    border-radius: 8px;
  }
  .v-btn {
    @media screen and (max-width: $dev-large) {
      width: 180px;
      height: 180px;
    }
    @media screen and (max-width: $dev-middle) {
      width: 140px;
      height: 150px;
    }
    @media screen and (max-width: $dev-small) {
      width: 124px;
      height: 132px;
    }

    width: 163px;
    height: 163px;
    font-size: 14px;
    box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.04), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 1px 0 rgba(0, 0, 0, 0.14);
  }
  .theme--light.v-icon {
    color: $aqua;
  }
}
</style>
