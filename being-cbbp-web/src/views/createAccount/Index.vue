<template>
  <div class="account-content">
    <create-account-step1 v-if="currentTab === 0 && userId === 0" @nextStep="nextStep" :inviteRecord="inviteRecord" />
    <create-role-step1 v-if="currentTab === 0 && userId !== 0" @nextStep="nextStep" :inviteRecord="inviteRecord" />
    <create-account-step2
      v-if="currentTab === 1 && userId === 0"
      @nextStep="nextStep"
      @finish="finish"
      :inviteRecord="inviteRecord"
    />
    <create-role-step2
      v-if="currentTab === 1 && userId !== 0"
      @nextStep="nextStep"
      @finish="finish"
      :inviteRecord="inviteRecord"
    />
  </div>
</template>

<script>
import { getUrlParameters } from '@/utils/util'
import { getInviteRecord } from '@/api/account'
import CreateAccountStep1 from './CreateAccountStep1'
import CreateRoleStep1 from './CreateRoleStep1'
import CreateAccountStep2 from './CreateAccountStep2'
import CreateRoleStep2 from './CreateRoleStep2'

export default {
  name: 'CreateAccount',
  components: {
    CreateAccountStep1,
    CreateRoleStep1,
    CreateAccountStep2,
    CreateRoleStep2
  },
  data () {
    return {
      description: 'CreateAccount',
      currentTab: 0,
      inviteRecord: {},
      form: null,
      userId: null
    }
  },
  created () {
    const code = getUrlParameters('code')
    getInviteRecord({ code: code })
      .then(res => {
        this.inviteRecord = res.data
        this.userId = res.data.userId
      })
      .catch(err => {
        console.log('err', err)
        if (err.data.code === '14401') {
          this.$router.push({ name: 'invalidInviteCode' })
        } else if (err.data.code === '14404') {
          this.$router.push({ name: 'userEmailExist' })
        } else {
          this.errHandler(err)
          this.$router.push({ name: 'login' })
        }
      })
  },
  methods: {
    // handler
    nextStep () {
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
      window.scrollTo(0, 0)
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
      window.scrollTo(0, 0)
    },
    finish () {
      this.currentTab = 0
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="less">
.account-content {
  width: 100%;
  max-width: 1000px;
  margin: 40px auto;
  .account-step1 {
    .ant-form-vertical .ant-form-item-label {
      margin-left: 29.16666667%;
    }
    .title {
      font-size: 18px;
      border-bottom: 1px solid #ddd;
      color: #000;
      padding-bottom: 60px;
    }
  }
}
</style>
