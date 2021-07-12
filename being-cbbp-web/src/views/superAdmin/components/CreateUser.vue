<template>
  <div>
    <a-modal
      :title="$t('superadmin.create.new.user')"
      :width="800"
      :visible="createUserModal"
      @cancel="cancel"
      :footer="false"
      @ok="ok"
      class="create-new-user"
    >
      <a-spin tip="Loading..." size="large" :spinning="loading">
        <a-row>
          <a-form :form="form" layout="vertical">
            <a-col :span="12">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('admin.last.name')">
                <a-input
                  v-decorator="['lastName', { rules: [{ required: true, message: $t('admin.validate.last.name') }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('admin.first.name')">
                <a-input
                  v-decorator="['firstName', { rules: [{ required: true, message: $t('admin.validate.first.name') }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('customsUser.employeeId')">
                <a-input
                  v-decorator="[
                    'employeeId',
                    {
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
                    { rules: [{ required: true, message: $t('admin.validate.email.address') }] },
                    { pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message: $t('superadmin.email.reg.tip') }
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('superadmin.assign.entity.role')">
                <a-select
                  :placeholder="$t('superadmin.assign.entity.role')"
                  @change="handleSelect"
                  v-decorator="['role', { rules: [{ required: true, message: $t('superadmin.assign.entity.role') }] }]"
                >
                  <a-select-option v-for="item in entityRoles" :key="item.key" :value="item.role">{{
                    $t('entityRoles')[item.role]
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('superadmin.assign.user.role')">
                <a-select
                  :placeholder="$t('superadmin.assign.user.role')"
                  @change="handleSelect"
                  v-decorator="[
                    'userRole',
                    { rules: [{ required: true, message: $t('superadmin.assign.user.role') }] }
                  ]"
                >
                  <a-select-option value="ADMIN">{{ $t('userRoles')['ADMIN'] }}</a-select-option>
                  <a-select-option value="BASIC">{{ $t('userRoles')['BASIC'] }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24" align="center">
              <confirm-checkbox />
            </a-col>
            <a-col :span="24" align="center">
              <a-button style="margin-right: 58px;" type="primary" @click="createAccount()">
                {{ $t('comfirm.create.account') }}
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
    createUserModal: {
      type: Boolean,
      default: false
    },
    selectedRows: {
      type: Array,
      default: () => []
    },
    companyId: {
      type: Number,
      default: 0
    }
  },
  components: {
    confirmCheckbox
  },
  computed: {
    ...mapState({
      lang: state => state.i18n.lang
    }),
    entityRoles () {
      return this.selectedRows
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
    createAccount () {
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
          opt.language = this.lang
          opt.companyId = this.companyId
          this.$store
            .dispatch('userInvitePost', opt)
            .then(() => {
              this.cancel()
              this.$emit('initData')
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
.create-new-user {
  max-width: 90%;
  .ant-form-vertical .ant-form-item-label {
    margin-left: 20.83333333%;
  }
}
</style>
