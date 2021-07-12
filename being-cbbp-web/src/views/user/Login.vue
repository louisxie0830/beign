<template>
  <div class="main">
    <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" :tab="$t('login.title.text')">
          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="loginErrorMsg" />
          <a-form-item class="select-menu">
            <a-select
              :placeholder="$t('login.select.entity.role')"
              size="large"
              @change="handleSelect"
              v-decorator="['role', { rules: [{ required: true, message: $t('admin.validate.assign.user') }] }]"
            >
              <roles-icon slot="suffixIcon" :style="{ fontSize: '14px' }" />
              <a-select-option value="EXPORTER">{{ $t('superadmin.exporter') }}</a-select-option>
              <a-select-option value="IMPORTER">{{ $t('superadmin.importer') }}</a-select-option>
              <a-select-option value="CUSTOMS_BROKER">{{ $t('superadmin.customsbroker') }}</a-select-option>
              <a-select-option value="CUSTOMS">{{ $t('Index.customs') }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              type="text"
              :placeholder="$t('login.input.username')"
              v-decorator="[
                'username',
                {
                  rules: [
                    { required: true, message: $t('login.input.username.error') },
                    { validator: handleUsernameOrEmail }
                  ],
                  validateTrigger: 'change'
                }
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="password"
              autocomplete="false"
              :placeholder="$t('login.input.password')"
              v-decorator="[
                'password',
                { rules: [{ required: true, message: $t('login.input.password.error') }], validateTrigger: 'blur' }
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>
        </a-tab-pane>
        <!-- <a-tab-pane key="tab2" tab="手机号登录">
          <a-form-item>
            <a-input size="large" type="text" placeholder="手机号" v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]">
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input size="large" type="text" placeholder="验证码" v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
              ></a-button>
            </a-col>
          </a-row>
        </a-tab-pane> -->
      </a-tabs>
      <p style="margin-bottom:0em;text-align:right;text-decoration:underline">
        <router-link :to="{ name: 'forgetPassword' }">{{ $t('forget.reset') }}</router-link>
      </p>
      <!-- <a-form-item>
        <a-checkbox v-decorator="['rememberMe']">自动登录</a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa'} }"
          class="forge-password"
          style="float: right;"
        >忘記密碼</router-link>
      </a-form-item> -->

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >{{ $t('login.button.submit') }}</a-button
        >
      </a-form-item>

      <!-- <div class="user-login-other">
        <span>其他登录方式</span>
        <a>
          <a-icon class="item-icon" type="alipay-circle"></a-icon>
        </a>
        <a>
          <a-icon class="item-icon" type="taobao-circle"></a-icon>
        </a>
        <a>
          <a-icon class="item-icon" type="weibo-circle"></a-icon>
        </a>
        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>
      </div> -->
    </a-form>

    <!-- <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha> -->
  </div>
</template>

<script>
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { getSmsCaptcha } from '@/api/login'
import { RolesIcon } from '@/core/icons'

export default {
  components: {
    TwoStepCaptcha,
    RolesIcon
  },
  data () {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      loginErrorMsg: '',
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  mounted () {
    // get2step({ })
    //   .then(res => {
    //     this.requiredTwoStepCaptcha = res.result.stepCode
    //   })
    //   .catch(() => {
    //     this.requiredTwoStepCaptcha = false
    //   })
    // this.requiredTwoStepCaptcha = true
    const url = window.location.pathname
    // console.log(url)
    if (url === '/user/login_importer') {
      this.form.setFieldsValue({
        role: 'IMPORTER'
      })
    }
    if (url === '/user/login_customs') {
      this.form.setFieldsValue({
        role: 'CUSTOMS'
      })
    }
    if (url === '/user/login_cb') {
      this.form.setFieldsValue({
        role: 'CUSTOMS_BROKER'
      })
    }
  },
  methods: {
    handleSelect (value) {
      if (value === 'IMPORTER') {
        this.$router.replace({ name: 'loginImporter' })
      }
      if (value === 'CUSTOMS') {
        this.$router.replace({ name: 'loginCustoms' })
      }
      if (value === 'CUSTOMS_BROKER') {
        this.$router.replace({ name: 'loginCb' })
      }
      if (value === 'EXPORTER') {
        this.$router.replace({ name: 'loginExporter' })
      }
    },
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick (key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['role', 'username', 'password'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          console.log('login form', values)
          const loginParams = { ...values }
          delete loginParams.username
          // loginParams[!state.loginType ? 'email' : 'name'] = values.username
          loginParams.name = values.username
          loginParams.password = values.password
          Login(loginParams)
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    getCaptcha (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state
      } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          getSmsCaptcha({ mobile: values.mobile })
            .then(res => {
              setTimeout(hide, 2500)
              this.$notification['success']({
                message: '提示',
                description: '验证码获取成功，您的验证码为：' + res.result.captcha,
                duration: 8
              })
            })
            .catch(err => {
              setTimeout(hide, 1)
              clearInterval(interval)
              state.time = 60
              state.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    },
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess (res) {
      console.log(res)
      this.$router.push({ path: '/' })
      this.isLoginError = false
    },
    requestFailed (err) {
      console.log('err: ', err)
      this.isLoginError = true
      if (err && err.data && err.data.code === '01403') {
        this.loginErrorMsg = this.$t('login.input.error.permission.denied')
      } else if (err && err.data && err.data.message === '01402') {
        this.loginErrorMsg = this.$t('login.invalid.role')
      } else {
        this.loginErrorMsg = this.$t('login.input.error')
      }
      this.$notification['error']({
        message: 'Error',
        description: this.$t(((err || {}).data || {}).code) || 'Request error',
        duration: 3
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/css/login.less';
</style>
