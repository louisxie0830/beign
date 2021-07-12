<template>
  <div class="account-step1">
    <div class="title" align="center">{{ $t('activate.title') }}</div>
    <div class="account-content">
      <p style="color: #3b6088">{{ $t('activate.step1') }}</p>
      <p>{{ $t('activate.password.information') }}</p>
      <a-row style="margin-top: 80px;">
        <a-form :form="form" layout="vertical">
          <a-col :span="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="inviteRecord.role === 'CUSTOMS' ? $t('activate.username') : $t('user.username')"
            >
              <a-input
                :disabled="this.inviteRecord.role === 'CUSTOMS' && this.inviteRecord.employeeId ? true : false"
                :placeholder="$t('activate.validate.username')"
                v-decorator="[
                  'username',
                  {
                    initialValue: this.inviteRecord.role === 'CUSTOMS' ? this.inviteRecord.employeeId : '',
                    validateTrigger: 'blur',
                    rules: [{ required: true, message: $t('activate.validate.username') }, { validator: checkUsername }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('activate.password')">
              <a-input
                @blur="handleConfirmBlur"
                type="password"
                :placeholder="$t('activate.validate.password')"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      { required: true, message: $t('activate.validate.password') },
                      { validator: validateToNextPassword }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('activate.confirm.password')">
              <a-input
                type="password"
                :placeholder="$t('activate.validate.password.confirm')"
                v-decorator="[
                  'comfirmPassword',
                  {
                    rules: [
                      { required: true, message: $t('activate.validate.password.confirm') },
                      { validator: compareToFirstPassword }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-form>
        <a-col :span="24" align="center">
          <a-button type="primary" @click="handleSubmit">{{ $t('activate.confirm') }}</a-button>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getUrlParameters } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { checkUsernameIsExist } from '@/api/account'
import { entityRolesDataSource } from '@/const/systemData'
export default {
  name: 'CreateAccountStep1',
  props: {
    inviteRecord: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      code: '',
      confirmDirty: false,
      labelCol: { lg: { span: 10 }, sm: { span: 10 } },
      wrapperCol: { lg: { span: 10, offset: 7 }, sm: { span: 10, offset: 7 } }
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      loginRole: state => state.user.roles
    })
  },
  created () {
    this.code = getUrlParameters('code')
    if (this.token || !this.code) {
      const roleData = entityRolesDataSource.find(item => item.role === this.loginRole.code)
      let home = 'index'
      if (roleData) {
        home = roleData.routerNameHome
      }
      this.$router.push({ name: home }, () => {
        this.$notification.warn({
          message: 'Warning',
          description: `You have logined as a member!`
        })
      })
    }
  },
  methods: {
    ...mapActions(['errHandler']),
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    confirmNext () {
      this.$emit('nextStep')
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback(this.$t('activate.validate.tow.password'))
      } else {
        callback()
      }
    },
    validateToNextPassword (rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['comfirmPassword'], { force: true })
      }
      callback()
    },
    checkUsername (rule, value, callback) {
      if (value) {
        return checkUsernameIsExist({ username: value })
          .then(res => {
            callback()
          })
          .catch(err => {
            this.$store.dispatch('errHandler', err)
            callback(this.$t('activate.validate.username.repeated'))
          })
      }
      callback()
    },
    handleSubmit (e) {
      const {
        form: { validateFields }
      } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.confirmNext()
          this.$store.commit('createAccountStep1', values)
        }
      })
    }
  }
}
</script>

<style lang="less"></style>
