<template>
  <div class="admin-page">
    <div class="title" align="center">
      <span>{{ $t('user.email.exist.title') }}</span>
    </div>
    <p style="height:1px;width:100%;background-color:#ddd;margin:10px 0px;"></p>
    <div class="content">
      <p style="color: #000;text-align:center">
        {{ $t('user.email.exist.tip.header')
        }}<router-link class="catenation" :to="{ name: 'login' }">{{
          $t('user.email.exist.title.sign.in')
        }}</router-link>
        {{ $t('user.email.exist.tip.footer')
        }}<router-link class="catenation" :to="{ name: 'forgetPassword' }">{{
          $t('user.emil.forget.password.tip')
        }}</router-link>
        {{ $t('user.emil.page.tip') }}
      </p>
      <a-row style="text-align:center;">
        <a-button type="primary" style="border-color:#68b310" @click="sign()">
          {{ $t('reset.sign.button') }}
        </a-button>
      </a-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'UserEmailExist',
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  computed: {
    ...mapState({
      lang: state => state.i18n.lang
    })
  },
  methods: {
    sign () {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style lang="less">
.admin-page {
  width: 100%;
  max-width: 1000px;
  margin: 40px auto;
  .title {
    font-size: 18px;
    color: #000;
  }
  .content {
    margin-top: 20px;
    .con-title {
      border-bottom: 1px solid #ddd;
      color: #000;
      padding-left: 20px;
      padding-bottom: 20px;
    }
    .formtem {
      text-align: center;
      .inp {
        width: 30%;
      }
    }
    .catenation {
      color: #4a90e2;
      text-decoration: underline;
    }
  }
}
</style>
