<template>
  <div>
    <form action="https://ccore.spgateway.com/MPG/mpg_gateway" method="post" name="form_one" id="form_one">
      <input type="hidden" :value="40" name="Amt">
      <input type="hidden" value="MS36207085" name="MerchantID">
      <input type="hidden" :value="1558940018" name="MerchantOrderNo">
      <input type="hidden" :value="1558940018" name="TimeStamp">
      <input type="hidden" :value="1.2" name="Version">
      <input type="hidden" value="JSON" name="RespondType">
      <input type="hidden" value="chris@gmail.com" name="Email">
      <input type="hidden" value="976318FA492B762AA75906D07148E1728A313986A714249DE99A6B34D29D79A6" name="CheckValue">
      <input type="hidden" value="簽署王個人簽署次數" name="ItemDesc">
      <input type="hidden" value="0" name="LoginType">
      <button ref="submitBtn">123 GO</button>
    </form>
    <div v-html="nativeHtml"></div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { actions, getters } from './../../store/type';
export default {
  data() {
    return {
      nativeHtml: `<div>hey 123</div>`
    };
  },
  computed: {
    ...mapGetters({
      paymentInfo: getters.PAYMENT_INFO
    })
  },
  created() {
    //   const FormData = require('form-data');
    //   const _axios = require('axios');
    //   let formData = new FormData();
    //     let axRes = null;
    //     formData.append('Amt', 100);
    //     formData.append('MerchantID', 'MS36207085');
    //     formData.append('MerchantOrderNo', 1558507444);
    //     formData.append('TimeStamp', 1558507444);
    //     formData.append('Version', 1.2);
    //     formData.append('RespondType', 'JSON');
    //     formData.append('Email', 'chris@gmail.com');
    //     formData.append('CheckValue', '1B8E66AE756C502AC66D9D6B09718928F05FE116E076A7B5C5C930888700895B');
    //     formData.append('ItemDesc', '簽署王個人簽署次數');
    //     formData.append('LoginType', 0);
    //     _axios.post('https://ccore.spgateway.com/MPG/mpg_gateway',formData).then(res=>{
    //         console.log(res)
    //     });
    // this.createOrder(this.paymentInfo).then(res => {
    //   console.log(res);
    //   this.nativeHtml = res;
    // });
  },
  methods: {
    ...mapActions({
      createOrder: actions.POST_PAYMENT_CREATE
    })
  }
};
</script>
