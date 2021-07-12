<template>
  <div class="account-step1">
    <div class="title" align="center">{{ $t('activate.role.step1.title') }}</div>
    <div class="account-content">
      <p style="color: #3b6088">{{ $t('activate.role.step1') }}</p>
      <p>{{ $t('activate.role.step1.tip.label') }}：{{ $t('entityRoles')[inviteRecord.role] }}</p>
      <a-row style="margin-top: 80px;">
        <a-form :form="form" layout="vertical">
          <a-col :span="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('user.username')">
              <a-input
                :disabled="true"
                v-decorator="[
                  'username',
                  {
                    initialValue: inviteRecord.username,
                    rules: [{ required: true, message: 'Username' }]
                  }
                ]"
                :style="{ disabled: this.form.getFieldsValue().username ? true : false }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('activate.password')">
              <a-input
                @blur="handleConfirmBlur"
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
              />
            </a-form-item>
          </a-col>

          <a-col :span="24" align="center">
            <a-button type="primary" @click="handleSubmit()">{{ $t('activate.role.step1.btn.confirm') }}</a-button>
          </a-col>
        </a-form>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getUrlParameters } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { validateUser } from '@/api/login'
import { entityRolesDataSource } from '@/const/systemData'
export default {
  name: 'CreateRoleStep1',
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
    handleSubmit () {
      const {
        form: { validateFields }
      } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          /**
           * TO DO
           * 驗證賬號密碼
           */
          console.log('values', values)
          validateUser({
            name: values.username,
            password: values.password
          })
            .then(res => {
              this.$message.info(this.$t('activate.role.step1.validate.result.success'))
              this.confirmNext()
              this.$store.commit('createAccountStep1', values)
            })
            .catch(err => {
              console.log('err', err)
              this.$message.error(this.$t(err.data.code))
              this.errHandler(err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less"></style>
