<template>
  <v-flex xs12
          sm8
          md6
          offset-sm2
          offset-md3
          id="purchaseResult">
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <v-btn class="b-toolbar-icon left"
               icon
               @click="goBack">
          <v-icon class="b-text">arrow_back_ios</v-icon>
          <span class="b-text"
                v-text="$t('common.index')" />
        </v-btn>
      </v-flex>
      <v-flex xs8>
        <v-toolbar-title v-text="$t('index.data.left_menu.purchase')" />
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-0>
      <v-layout row
                wrap>
        <v-flex xs12>
          <v-flex justify-center
                  xs12
                  class="response-message-layout">
            <div v-if="purchase === '2'"
                 class="response-message">
              <v-icon size="32"
                      color="#13c3ea"
                      dark
                      class="pr-3">check_circle</v-icon>
              {{ $t('purchase_result.completed_success.text') }}
            </div>
            <div v-if="purchase === '1'">{{ $t('purchase_result.isPaying.text') }}</div>
            <div v-if="purchase === '3'"
                 class="response-message">
              <v-icon size="32"
                      color="#13c3ea"
                      dark
                      class="pr-3">error</v-icon>{{ $t('purchase_result.buyError.text') }}
            </div>
          </v-flex>
          <div v-if="purchase === '2'"
               style=" margin-bottom: 16px;">{{ $t("purchase_result.completed_msg_success.text") }}</div>
          <div v-if="purchase === '3'"
               style=" margin-bottom: 16px;"> {{ $t('purchase_result.buyFail.text1') }}
            <br>{{ $t('purchase_result.buyFail.text2') }}
          </div>
          <v-card class="mb-1"
                  style="margin:6px"
                  v-if="purchase === '2'">
            <v-card-text>
              <v-flex xs12>
                <p class="b-label">{{ $t('sign_document_info.sign_identify.text') }}</p>
              </v-flex>
              <v-flex xs12>
                <div style="text-align:left; font-size:14px">{{ companyName }}</div>
              </v-flex>
              <v-flex xs12
                      mt-2>
                <v-flex xs12
                        class="b-label">{{ $t('purchase.info.text') }}</v-flex>
              </v-flex>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex style="margin:24px 6px 0px 6px; "
                xs12>
          <v-btn round
                 large
                 class="b-btn full"
                 @click="gotoSign()"
                 block
                 v-if="purchase === '2'">{{ $t('common.lauch_signature') }}</v-btn>
          <v-btn round
                 large
                 class="b-btn full"
                 @click="gotoPurchase()"
                 block
                 v-if="purchase === '3'">{{ $t('purchase_result.goBackBuy.text') }}</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>
<script>
import rulesMixin from './../../mixins/Rules.js';
import { mapActions } from 'vuex';
import { actions } from './../../store/type.js';

export default {
  mixins: [rulesMixin],
  data() {
    return {
      e1: 0,
      stepColor: '#13c3ea',
      stepHeight: {
        one: '61vh',
        two: '61vh',
        three: '61vh'
      },
      purchase: '1', // 1等待结果，2支付成功，3支付失败
      orderId: '', // 订单编号
      role: '',
      status: 0,
      companyName: '',
      request: false
    };
  },
  created() {
    this.orderId = this.$route.params.orderId;
    this.getStatus();

    this.timer = setInterval(() => {
      if (this.status !== 1 && this.status !== 2 && this.request) {
        this.request = false;
        this.getStatus();
      }
    }, 1500);
  },
  methods: {
    ...mapActions({
      getOrderStatus: actions.POST_PAYMENT_STATUS
    }),
    goBack() {
      this.$router.push({ name: 'Index' });
    },
    gotoPurchase() {
      this.$router.push({ name: 'Purchase' });
    },
    gotoSign() {
      this.$router.push({ name: 'Signing' });
    },
    getStatus() {
      this.getOrderStatus(this.orderId)
        .then(res => {
          console.log('res', res);
          this.status = res.status;
          this.companyName = res.companyName;
          // 失败
          if (this.status === 2) {
            clearInterval(this.timer);
            this.purchase = '3';
            return;
          }
          // 成功
          if (this.status === 1) {
            clearInterval(this.timer);
            this.purchase = '2';
            return;
          }
          this.request = true;
        })
        .catch(e => {
          clearInterval(this.timer);
          this.status = 2;
          this.purchase = '3';
        });
    },
    selectRole() {}
  }
};
</script>
<style lang="scss">
@import './../../assets/scss/_mixin.scss';
#purchaseResult {
  .response-message-layout {
    margin-top: 48px;
    margin-bottom: 20px;
  }
  .response-message {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .b-btn-area {
    padding-top: 2px;
    .b-btn.full {
      width: 95%;
    }
  }
  .v-text-field {
    padding-top: 0;
    .v-input__control > .v-input__slot {
      margin-bottom: 0;
      &:before {
        border-style: none;
      }
    }
  }
  .theme--light.v-select .v-select__selections {
    padding: 0 8px;
  }
}
</style>
