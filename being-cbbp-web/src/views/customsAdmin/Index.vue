<template>
  <div class="admin-page">
    <div class="title" align="center">
      <span>{{ $t('admin.create') }}</span>
    </div>
    <div class="content">
      <p class="con-title">{{ $t('admin.account.information') }}</p>
      <a-row>
        <a-form :form="form" layout="vertical" @submit="handleSubmit">
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
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('admin.employee.id')">
              <a-input
                maxlength="6"
                v-decorator="[
                  'employeeId',
                  {
                    rules: [
                      { required: true, message: $t('admin.validate.employee.id') },
                      { pattern: /^\d{6}$/, message: $t('admin.employee.id.tip') }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('admin.email.adddress')">
              <a-input
                v-decorator="['email', { rules: [{ required: true, message: $t('admin.validate.email.address') }] }]"
              />
              <P v-if="show" style="color:red;">{{ $t('admin.email.exist.tip') }}</P>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('admin.customs.zone')">
              <a-select
                :placeholder="$t('common.step.select')"
                @change="handleSelect"
                v-decorator="['zone', { rules: [{ required: true, message: $t('admin.validate.customs.zone') }] }]"
              >
                <a-select-option value="AA">A* - {{ $t('admin.Keelung') }}</a-select-option>
                <a-select-option value="BA">B* - {{ $t('admin.Kaoshiung') }}</a-select-option>
                <a-select-option value="CA">C* - {{ $t('admin.Taipei') }}</a-select-option>
                <a-select-option value="DA">D* - {{ $t('admin.Taichung') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24"></a-col>
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('admin.assign.user.role')">
              <a-select
                :placeholder="$t('common.step.select')"
                @change="handleSelect"
                v-decorator="['userRole', { rules: [{ required: true, message: $t('admin.validate.assign.user') }] }]"
              >
                <a-select-option value="ADMIN">{{ $t('userRoles')['ADMIN'] }}</a-select-option>
                <a-select-option value="BASIC">{{ $t('userRoles')['BASIC'] }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24" align="center">
            <a-form-item>
              <a-checkbox
                v-decorator="['confirm', { rules: [{ required: true, message: $t('admin.validate.confirm.data') }] }]"
              >
                {{ $t('comfirm.information') }}
              </a-checkbox>
            </a-form-item>
          </a-col>
          <a-col :span="24" align="center">
            <a-button @click="cancelBtn()">
              {{ $t('comfirm.cancel') }}
            </a-button>
            <a-button style="margin-left: 58px;" type="primary" @click="createAccount()">
              {{ $t('comfirm.create.account') }}
            </a-button>
          </a-col>
        </a-form>
      </a-row>
    </div>
  </div>
</template>

<script>
import { defaultLang } from '@/locales'
import Vue from 'vue'
import { mapState } from 'vuex'
export default {
  name: 'Admin',
  data () {
    return {
      form: this.$form.createForm(this),
      labelCol: { lg: { span: 14 }, sm: { span: 14 } },
      wrapperCol: { lg: { span: 14, offset: 5 }, sm: { span: 14, offset: 5 } },
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
    createAccount () {
      this.handleSubmit()
    },
    handleSubmit () {
      const {
        form: { validateFields }
      } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          values.language = Vue.ls.get('lang') ? Vue.ls.get('lang') : defaultLang
          values.role = 'CUSTOMS'
          delete values.confirm
          console.log('Received values of form: ', values)
          this.$store
            .dispatch('adminInviteUser', values)
            .then(() => {
              this.$message.info('Invitation Sent.')
              this.$router.push({ name: 'dashboard' })
            })
            .catch(err => {
              if (err.data.message === 'EMAIL_FOUND') {
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
    },
    cancelBtn () {
      this.$router.push({ name: 'dashboard' })
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
    margin-top: 50px;
    .con-title {
      border-bottom: 1px solid #ddd;
      color: #000;
      padding-left: 20px;
      padding-bottom: 20px;
    }
  }
  .ant-form-vertical .ant-form-item-label {
    margin-left: 20.83333333%;
  }
}
</style>
