<template>
  <div>
    <a-modal
      :title="$t('page.title.inviteNewUserInfo')"
      :width="800"
      :visible="editInviteUserModal"
      @cancel="cancel"
      :footer="false"
      @ok="ok"
      class="edit-user"
    >
      <a-spin tip="Loading..." size="large" :spinning="loading">
        <a-row>
          <a-form :form="form" layout="vertical">
            <a-form-item style="display:none;">
              <a-input
                type="hidden"
                v-decorator="[
                  'tmpId',
                  {
                    initialValue: formData.tmpId,
                    rules: [{ required: true }]
                  }
                ]"
              ></a-input>
            </a-form-item>
            <a-col :span="12">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('admin.last.name')">
                <a-input
                  v-decorator="[
                    'lastName',
                    {
                      initialValue: formData.lastName,
                      rules: [{ required: true, message: $t('admin.validate.last.name') }]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('admin.first.name')">
                <a-input
                  v-decorator="[
                    'firstName',
                    {
                      initialValue: formData.firstName,
                      rules: [{ required: true, message: $t('admin.validate.first.name') }]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('customsUser.employeeId')">
                <a-input
                  maxlength="30"
                  v-decorator="[
                    'employeeId',
                    {
                      initialValue: formData.employeeId,
                      rules: [
                        { required: true, message: $t('superadmin.employeeid.reg.required') },
                        { pattern: /^[0-9a-zA-Z-_]{1,30}$/, message: $t('superadmin.employeeid.reg.tip') }
                      ]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('admin.email.adddress')">
                <a-input
                  v-decorator="[
                    'emailAddress',
                    {
                      initialValue: formData.emailAddress,
                      validateTrigger: 'blur',
                      rules: [
                        { required: true, message: $t('admin.validate.email.address') },
                        { pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message: $t('superadmin.email.reg.tip') },
                        { validator: checkEmailExist }
                      ]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('superadmin.entity.roles')">
                <a-select
                  v-decorator="[
                    'entityRole',
                    {
                      initialValue: formData.entityRole,
                      rules: [{ required: true, message: $t('superadmin.please.select.entityRole') }]
                    }
                  ]"
                >
                  <a-select-option v-for="item in entityRoleList" :key="item.key" :value="item.role">
                    {{ $t('entityRoles')[item.role] }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('superadmin.user.role')">
                <a-select
                  v-decorator="[
                    'userRole',
                    {
                      initialValue: formData.userRole,
                      rules: [{ required: true, message: $t('superadmin.please.select.user.permission') }]
                    }
                  ]"
                >
                  <a-select-option value="ADMIN">{{ $t('userRoles.ADMIN') }}</a-select-option>
                  <a-select-option value="BASIC">{{ $t('userRoles.BASIC') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24" align="center">
              <confirm-checkbox />
            </a-col>
            <a-col :span="24" align="center">
              <a-button style="margin-right: 58px;" type="primary" @click="editAccount()">
                {{ $t('comfirm.ok') }}
              </a-button>
              <a-button @click="cancelBtn()">
                {{ $t('comfirm.cancel') }}
              </a-button>
            </a-col>
          </a-form>
        </a-row>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import confirmCheckbox from './ConfirmCheckbox'
import { checkEmailIsExist } from '@/api/account'
export default {
  props: {
    editInviteUserModal: {
      type: Boolean,
      default: false
    },
    entityRoleList: {
      type: Array,
      default: () => []
    },
    dataSourceUser: {
      type: Array,
      default: () => []
    },
    selectEditUser: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    confirmCheckbox
  },
  computed: {
    formData () {
      console.log('EditUser.vue this.selectEditUser', this.selectEditUser)
      return this.selectEditUser
    }
  },
  data () {
    return {
      loading: false,
      form: this.$form.createForm(this),
      labelCol: { lg: { span: 14 }, sm: { span: 14 } },
      wrapperCol: { lg: { span: 14, offset: 5 }, sm: { span: 14, offset: 5 } }
    }
  },
  methods: {
    checkEmailExist (rule, value, callback) {
      if (value) {
        const result = this.checkEmailRepeatedInvite(value, this.formData.tmpId)
        if (!result) {
          return checkEmailIsExist({ email: value })
            .then(res => {
              callback()
            })
            .catch(err => {
              // this.$store.dispatch('errHandler', err)
              console.log('checkEmailIsExist error', err)
              callback(this.$t('superadmin.invite.user.email.repeated'))
            })
        } else {
          callback(this.$t('superadmin.invite.user.tip'))
        }
      }
      callback()
    },
    checkEmailRepeatedInvite (email, key) {
      const result = this.dataSourceUser.find(item => {
        if (item.emailAddress === email && item.tmpId !== key) {
          return item
        }
      })
      return !!result
    },
    cancel () {
      this.form.resetFields()
      this.$emit('hideModal')
    },
    ok () {},
    editAccount () {
      const {
        form: { validateFields }
      } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.loading = true
          console.log('values', values)
          const opt = { ...values }
          delete opt.confirm
          this.cancel()
          this.$emit('saveInviteUser', opt)
          this.loading = false
        }
      })
    },
    cancelBtn () {
      this.cancel()
    },
    handleSelect () {}
  }
}
</script>

<style lang="less">
.edit-user {
  max-width: 90%;
  .ant-form-vertical .ant-form-item-label {
    margin-left: 20.83333333%;
  }
}
</style>
