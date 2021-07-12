<template>
  <v-flex xs12
          sm8
          md6
          offset-sm2
          offset-md3
          id="purchase">
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
        <header-title :title="$t('index.data.left_menu.purchase')"></header-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-0>
      <v-layout row
                wrap>
        <v-flex xs12>
          <v-stepper alt-labels
                     v-model="purchaseStep">
            <v-stepper-header v-if="COUNTRY_CODE !== 'CN'">
              <v-stepper-step :color="themeColor"
                              :complete="purchaseStep > 1"
                              step="1">{{ $t('purchase.step.one.text') }}</v-stepper-step>
              <v-divider />
              <v-stepper-step :color="themeColor"
                              :complete="purchaseStep > 2"
                              step="2">{{ $t('purchase.step.two.text') }}</v-stepper-step>
              <v-divider />
              <v-stepper-step :color="themeColor"
                              step="3">{{ $t('purchase.step.three.text') }}</v-stepper-step>
            </v-stepper-header>
            <v-stepper-header v-if="COUNTRY_CODE === 'CN'">
              <v-stepper-step :color="themeColor"
                              :complete="purchaseStep > 1"
                              step="1">{{ $t('purchase.step.one.text') }}</v-stepper-step>
              <v-divider />
              <v-stepper-step :color="themeColor"
                              step="2">{{ $t('purchase.step.three.text') }}</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items v-if="COUNTRY_CODE !== 'CN'">
              <v-stepper-content step="1">
                <step-one @goStep="goStep"
                          @stepInfo="setData" />
              </v-stepper-content>

              <v-stepper-content step="2">
                <step-two @goStep="goStep"
                          @setInvoiceData="setInvoiceData"
                          @stepInfo="setData" />
              </v-stepper-content>

              <v-stepper-content step="3">
                <step-three @goStep="goStep"
                            :order-data="orderData"
                            :price="price"
                            :unit="unit"
                            :invoice-data="invoiceData" />
              </v-stepper-content>
            </v-stepper-items>
            <v-stepper-items v-if="COUNTRY_CODE === 'CN'">
              <v-stepper-content step="1">
                <step-one @goStep="goStep"
                          @stepInfo="setData" />
              </v-stepper-content>

              <v-stepper-content step="2">
                <step-three @goStep="goStep"
                            :order-data="orderData"
                            :price="price"
                            :unit="unit" />
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>
<script>
import rulesMixin from './../../mixins/Rules.js';

import StepOne from './../../components/PurchaseStepOne.vue';
const StepTwo = () => import('./../../components/PurchaseStepTwo.vue');
const StepThree = () => import('./../../components/PurchaseStepThree.vue');
import { mapGetters } from 'vuex';
import { getters } from './../../store/type';

export default {
  components: { StepOne, StepTwo, StepThree },
  mixins: [rulesMixin],
  data() {
    return {
      themeColor: '#13c3ea',
      purchaseStep: 1,
      orderData: {}, // 订单明细
      invoiceData: {}, // 发票详细
      price: 0,
      unit: ''
    };
  },
  computed: {
    ...mapGetters({
      COUNTRY_CODE: getters.COUNTRY_CODE // 台湾地区要显示第2步，开发票 大陆地区只有1、3两步
    })
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'Index' });
    },
    goStep(step) {
      this.purchaseStep = step === 'next' ? this.purchaseStep + 1 : this.purchaseStep - 1;

      window.scrollTo(0, 0);
    },
    setData(obj, price, unit) {
      this.orderData = { ...this.orderData, ...obj };
      this.price = price;
      this.unit = unit;
    },
    setInvoiceData(obj) {
      this.invoiceData = { ...this.invoiceData, ...obj };
    }
  }
};
</script>
<style lang="scss">
@import './../../assets/scss/_variables.scss';
#purchase {
  .v-stepper,
  .v-stepper__header {
    box-shadow: none;
    background-color: $white-bgc;
  }
  .v-stepper__step__step {
    width: 36px;
    height: 36px;
  }
  .v-stepper__label {
    display: flex;
  }
  .v-stepper--alt-labels .v-stepper__step {
    padding: 16px;
    flex-basis: 110px;
  }
  .v-stepper__content {
    padding: 0 6px;
  }
  .v-stepper__step--complete > .v-stepper__step__step {
    background-color: $robin-egg-blue !important;
  }
  .theme--light.v-stepper
    .v-stepper__step:not(.v-stepper__step--active):not(.v-stepper__step--complete):not(.v-stepper__step--error)
    .v-stepper__step__step {
    background: #d8d8d8;
  }
  .v-divider {
    margin-top: 34px;
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
  .b-btn-area {
    // position: fixed;
    // width: 100%;
    bottom: 0;
    padding: 8px;
    margin-top: 24px;
    //background-color: #fff;
    .b-btn.full {
      width: 95%;
    }
  }
  .b-count-area {
    line-height: 30px;
    .b-label {
      display: flex;
    }
    p {
      text-align: right;
      font-size: 17px;
      margin-bottom: 0;
    }
  }
  .b-card {
    box-shadow: none;
    -webkit-box-shadow: none;
  }
  .v-list {
    .v-list__tile__action {
      min-width: 40px;
    }
  }
}
</style>
