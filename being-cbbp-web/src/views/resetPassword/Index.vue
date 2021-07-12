<template>
  <div class="admin-page">
    <div class="title" align="center">
      <span>{{ $t('reset.password.title') }}</span>
    </div>
    <p style="height:1px;width:100%;background-color:#ddd;margin:10px 0px;"></p>
    <div class="content">
      <p style="color: #000;text-align:center">{{ $t('password.tip') }}</p>
      <a-form :form="form">
        <a-row>
          <a-col :span="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('reset.password')">
              <a-input
                @blur="handleConfirmBlur"
                class="inp"
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      { required: true, message: $t('activate.validate.password') },
                      { validator: validateToNextPassword }
                    ]
                  }
                ]"
                :placeholder="$t('reset.password.placeholder')"
              >
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('reset.confirm.password')">
          <a-input
            class="inp"
            type="password"
            v-decorator="[
              'comfirmPassword',
              {
                rules: [
                  { required: true, message: $t('activate.validate.password.confirm') },
                  { validator: compareToFirstPassword }
                ]
              }
            ]"
            :placeholder="$t('reset.password.repeate.placeholder')"
          >
          </a-input>
        </a-form-item>
        <a-row style="text-align:center;">
          <a-button type="primary" style="border-color:#68b310" @click="handleSubmit()">
            {{ $t('reset.password.button') }}
          </a-button>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script>
// import { defaultLang } from '@/locales'
import { resetPassword } from '@/api/account'
import { getUrlParameters } from '@/utils/util'
// import Vue from 'vue'
import { mapState } from 'vuex'
export default {
  name: 'ResetPassword',
  data () {
    return {
      form: this.$form.createForm(this),
      confirmDirty: false,
      labelCol: { lg: { span: 24 }, sm: { span: 24 } },
      wrapperCol: { lg: { span: 12, offset: 7 }, sm: { span: 14, offset: 7 } }
    }
  },
  computed: {
    ...mapState({
      lang: state => state.i18n.lang
    })
  },
  methods: {
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    handleSelect () {},
    compareToFirstPassword (rule, value, cb) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        // eslint-disable-next-line standard/no-callback-literal
        cb(this.$t('activate.validate.tow.password'))
      } else {
        // eslint-disable-next-line standard/no-callback-literal
        cb()
      }
    },
    validateToNextPassword (rule, value, cb) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      // eslint-disable-next-line standard/no-callback-literal
      cb()
    },
    handleSubmit (e) {
      const code = getUrlParameters('code')
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          resetPassword({ code: code, password: values.password })
            .then(res => {
              console.log('success', res)
              this.$message.success('success')
              this.$router.push({ name: 'resetSuccess' })
            })
            .catch(err => {
              this.$store.dispatch('errHandler', err)
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
      .inp {
        width: 50%;
      }
    }
    /deep/ .ant-form-item-label {
      text-align: left;
      margin-left: 29%;
    }
  }
}
</style>
