<template>
  <div>
    <a-modal
      :title="$t('superadmin.edit.user')"
      :width="800"
      :visible="editUserModal"
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
                  'userId',
                  {
                    initialValue: formData.id,
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
                        { required: true, message: $t('superadmin.employeeid.reg.tip') },
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
                    'email',
                    {
                      initialValue: formData.email,
                      rules: [
                        { required: true, message: $t('admin.validate.email.address') },
                        { pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message: $t('superadmin.email.reg.tip') }
                      ]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('user.status.name')">
                <a-select
                  style="margin: -5px 0; width: 110px;"
                  :disabled="loginUser.id === selectEditUser.id"
                  @change="handleSelect"
                  v-decorator="[
                    'status',
                    {
                      initialValue: formData.status,
                      rules: [{ required: true, message: 'Choose permission' }]
                    }
                  ]"
                >
                  <a-select-option :value="1">{{ $t('userPermissions.1') }}</a-select-option>
                  <a-select-option :value="2">{{ $t('userPermissions.2') }}</a-select-option>
                  <a-select-option v-if="loginRole.code === 'ADMIN'" :value="0">{{
                    $t('userPermissions.0')
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('user.companyNotification')">
                <a-select
                  style="margin: -5px 0; width: 110px;"
                  @change="handleSelect"
                  v-decorator="[
                    'companyNotification',
                    {
                      initialValue: formData.companyNotification,
                      rules: [{ required: true, message: 'Choose companyNotification' }]
                    }
                  ]"
                >
                  <a-select-option :value="0">{{ $t('emailNotification')['0'] }}</a-select-option>
                  <a-select-option :value="1">{{ $t('emailNotification')['1'] }}</a-select-option>
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
import { mapState } from 'vuex'
import confirmCheckbox from './ConfirmCheckbox'
export default {
  props: {
    editUserModal: {
      type: Boolean,
      default: false
    },
    // selectedRows: {
    //   type: Array,
    //   default: () => []
    // },
    selectEditUser: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    confirmCheckbox
  },
  computed: {
    ...mapState({
      lang: state => state.i18n.lang,
      loginUser: state => state.user.info,
      loginRole: state => state.user.roles
    }),
    // entityRoles () {
    //   return this.selectedRows
    // },
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
          this.$store
            .dispatch('userEditPost', opt)
            .then(() => {
              this.cancel()
              this.$emit('initData')
              if (this.loginUser.id === values.userId) {
                this.$store.commit('SET_NAME', { name: values.firstName + values.lastName, welcome: '' })
              }
            })
            .catch(err => {
              this.$store.dispatch('errHandler', err)
            })
            .finally(() => {
              this.loading = false
            })
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
