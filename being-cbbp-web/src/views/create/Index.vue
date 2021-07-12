<template>
  <a-card :bordered="false">
    <a-steps class="steps" size="small" :current="currentTab">
      <a-step :title="$t('common.step1.text')" />
      <a-step :title="$t('common.step2.text')" />
      <a-step :title="$t('common.step3.text')" />
    </a-steps>
    <div class="step-content">
      <step1 v-if="currentTab === 0" @nextStep="nextStep" />
      <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep" @finish="finish" />
      <step3 v-if="currentTab === 2" @prevStep="prevStep" @finish="finish" />
    </div>
  </a-card>
</template>

<script>
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

export default {
  name: 'CreateShipment',
  components: {
    Step1,
    Step2,
    Step3
  },
  data () {
    return {
      description: '描述',
      currentTab: 0,

      // form
      form: null
    }
  },
  destroyed () {
    this.$store.commit('clearShipmentData')
  },
  mounted () {
    this.$store.commit('clearShipmentData')
  },
  methods: {
    // handler
    nextStep () {
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish () {
      this.currentTab = 0
    }
  }
}
</script>

<style lang="less">
.steps {
  max-width: 865px;
  // margin-top: 16px;
  // margin-bottom: 16px;
  // margin-left: 14%;
  margin: 16px auto;
}
.step-content {
  .step-title {
    color: #249c9f;
    font-size: 28px;
    text-align: center;
    margin: 20px 0;
  }
}
</style>
