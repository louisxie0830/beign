<template>
  <div>
    <v-card class="b-card two">
      <v-card-text>
        <v-list>
          <v-list-tile :class="{'selected':item.selected, 'un-selected': !item.selected}"
                       @click.prevent="selectStore(item)"
                       v-for="item in storeList"
                       :key="item.value">
            <v-list-tile-action>
              <img :src="item.iconPath">
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                <v-flex xs12>{{ item.name }}</v-flex>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-flex xs12
                class="result">
          <span v-text="$t('purchase.amount.text')" />
          <span class="pa-1">{{ price }} {{ unit }}</span>
        </v-flex>
      </v-card-text>
    </v-card>
    <v-flex xs12
            class="b-btn-area">
      <v-container pa-0>
        <v-layout row
                  wrap>
          <v-flex xs6
                  pr-1
                  pl-1>
            <v-btn round
                   large
                   block
                   class="b-btn white"
                   @click="goStep('prev')"
                   v-text="$t('common.pre_step')">上一步</v-btn>
          </v-flex>
          <v-flex xs6
                  pr-1
                  pl-1>
            <v-btn round
                   large
                   block
                   class="b-btn"
                   :disabled="!payment"
                   @click.prevent="purchasePackage()">{{ $t('common.confirm_purchase') }}</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
    <!-- NewebPay -->
    <form :action="payUrlAction" method="post" name="form_one" id="form_one" ref="form_one">
      <input type="hidden" :value="orderInfo.amt" name="Amt">
      <input type="hidden" :value="orderInfo.merchantID" name="MerchantID">
      <input type="hidden" :value="orderInfo.merchantOrderNo" name="MerchantOrderNo">
      <input type="hidden" :value="orderInfo.timeStamp" name="TimeStamp">
      <input type="hidden" :value="1.2" name="Version">
      <input type="hidden" value="JSON" name="RespondType">
      <input type="hidden" :value="invoiceData.email" name="Email">
      <input type="hidden" :value="orderInfo.checkValue" name="CheckValue">
      <input type="hidden" value="簽署王個人簽署次數" name="ItemDesc">
      <input type="hidden" value="0" name="LoginType">
      <!-- <button id="submitBtn"/> -->
    </form>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import type, { actions, mutations } from './../store/type.js';
import SHA256 from 'crypto-js/sha256';

export default {
  props: {
    price: {
      type: Number,
      default: () => {}
    },
    unit: {
      type: String,
      default: () => {}
    },
    orderData: {
      type: Object,
      default: () => {}
    },
    invoiceData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      storeList: [
        {
          name: '信用卡付款',
          value: 'newebpay',
          selected: false,
          iconPath: '/static/credit_card.png'
        },
        {
          name: '支付樂',
          selected: true,
          value: 'happypay',
          iconPath: '/static/happy-pay-icon.png'
        },
        {
          name: '支付宝',
          value: 'alipay',
          selected: false,
          iconPath: '/static/ali-pay-icon.png'
        }
      ],
      payment: null,
      methods: [], // 可用的支付方式
      orderInfo: {
        amt: null,
        merchantID: '',
        merchantOrderNo: null,
        timeStamp: null,
        hashKey: '',
        hashIV: ''
      },
      submitBtn: null
    };
  },
  computed: {
    payUrlAction() {
      return this.orderInfo.newebPayUrl;
    },
    tagClass() {
      switch (1) {
        case 0:
          return 'default';
        case 20:
          return 'danger';
        default:
          return 'normal';
      }
    }
  },
  async mounted() {
    this.methods = await this.paymentMethods();
    // console.log(this.methods);
    this.storeList = this.storeList.filter(item => {
      return this.methods.includes(item.value);
    });
    // 默认选中第一个
    if (this.storeList.length > 0) {
      this.$set(this.storeList[0], 'selected', true);
      this.payment = this.storeList[0].value;
    }
  },
  methods: {
    ...mapActions({
      createOrder: actions.POST_PAYMENT_CREATE,
      paymentMethods: actions.POST_PAYMENT_METHODS
    }),
    ...mapMutations({
      SET_PAYMENT_INFO: mutations.SET_PAYMENT_INFO
    }),
    selectStore(item) {
      this.storeList.forEach(obj => {
        obj.selected = false;
      });
      item.selected = true;
      this.payment = item.value;
    },
    async purchasePackage() {
      let opt = {
        ...this.orderData,
        invoice: {
          ...this.invoiceData
        },
        method: this.payment
      };
      let addressUrl = '';
      if (this.payment !== 'newebpay') {
        opt = {
          ...this.orderData,
          method: this.payment
        };
        addressUrl = await this.createOrder(opt);
        // 跳轉支付樂
        location.href = addressUrl;
      } else if (this.payment === 'newebpay') {
        this.createOrder(opt).then(res => {
          this.orderInfo = JSON.parse(res);
          this.$nextTick(() => this.$refs.form_one.submit());
        });
      }
    },
    goStep(step) {
      this.$emit('goStep', step);
    }
  }
};
</script>
<style lang="scss">
@import './../assets/scss/_variables.scss';
.b-card.two {
  .v-list__tile {
    padding: 12px;
    height: 48px;
    border-radius: 8px;
  }
  .selected {
    border: 1px solid $aqua;
    border-radius: 8px;
  }
  .un-selected {
    border: 1px solid #fff;
    border-radius: 8px;
  }
  .result {
    text-align: right;
    span {
      font-size: 13px;
    }
    span:last-child {
      font-size: 16px;
      color: #eb421c;
    }
  }
}
</style>
