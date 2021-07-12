<template>
  <div class="admin-page">
    <div class="title" align="center">
      <span>{{ $t('find.account') }}</span>
    </div>
    <p style="height:1px;width:100%;background-color:#ddd;margin:10px 0px;"></p>
    <div class="content">
      <p style="color: #000;text-align:center">{{ $t('account.email.tip') }}</p>
      <a-form :form="form">
        <a-form-item class="formtem">
          <a-input
            class="inp"
            v-decorator="['email', { rules: [{ required: true, message: $t('forget.input.validate.email') }] }]"
            :placeholder="$t('email.address')"
          >
          </a-input>
          <P v-if="show" style="color:red;">{{ $t('forget.account.noregister') }}</P>
        </a-form-item>
        <a-row style="text-align:center;">
          <a-button style="border-color:#68b310" @click="handleSubmit()">
            {{ $t('continue') }}
          </a-button>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script>
import { defaultLang } from '@/locales'
import { forgetPassword } from '@/api/account'
import Vue from 'vue'
import { mapState } from 'vuex'
export default {
  name: 'ForgetPassword',
  data () {
    return {
      form: this.$form.createForm(this),
      show: false
    }
  },
  computed: {
    ...mapState({
      lang: state => state.i18n.lang
    })
  },
  methods: {
    handleSelect () {},
    handleSubmit (e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.language = Vue.ls.get('lang') ? Vue.ls.get('lang') : defaultLang
          delete values.confirm
          console.log('Received values of form: ', values)
          forgetPassword(values)
            .then(res => {
              this.$message.success('success')
              this.show = false
              this.$router.push({ name: 'success' })
              console.log('success', res)
            })
            .catch(err => {
              // console.log('err',err.data.message)
              if (err.data.message === 'NOT_FOUND_USER') {
                this.show = true
                setTimeout(() => {
                  this.show = false
                }, 4000)
              } else {
                this.$store.dispatch('errHandler', err)
              }
            })
        }
      })
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
      margin-bottom: 12px;
      .inp {
        width: 30%;
      }
      p {
        margin-bottom: 0em;
        height: 20px;
        line-height: 20px;
      }
    }
  }
  .ant-form-vertical .ant-form-item-label {
    margin-left: 20.83333333%;
  }
}
</style>
