<template>
  <div class="account-step1">
    <div class="title" align="center">
      啟用您的新角色
    </div>
    <div class="account-content">
      <p style="color: #3b6088">步驟2：给新角色创建認證密鑰</p>
      <p>
        您的新角色是：[<b>{{ $t('entityRoles')[inviteRecord.role] }}</b
        >], 您需要創建「加密密碼」來保護您新角色的認證密鑰
      </p>
      <p>
        <a-icon class="warning" type="exclamation" />
        請注意!!!以下設置的「加密密碼」不是您的帳號登入密碼，而是用於保護您新角色
        “認證密鑰“的密碼。請妥善保存「加密密碼」，如果您不慎遺失“加密密碼”，系統將無法協助您找回或重置，您將無法存取以前的資料。
      </p>
      <a-row style="margin-top: 80px;" v-if="!isCreated">
        <a-form :form="form" layout="vertical">
          <a-col :span="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('activate.encrytion.password')">
              <a-input
                @blur="handleConfirmBlur"
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      { required: true, message: $t('activate.validate.encryption.password') },
                      { validator: validateToNextPassword }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('activate.confirm.encrytion.password')"
            >
              <a-input
                type="password"
                v-decorator="[
                  'confirmPassword',
                  {
                    rules: [
                      { required: true, message: $t('activate.validate.encryption.password.confirm') },
                      { validator: compareToFirstPassword }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24" align="center">
            <a-button type="primary" @click="handleSubmit()" :loading="submitLoading">
              {{ $t('activate.generate.keys') }}
            </a-button>
          </a-col>
        </a-form>
      </a-row>
      <a-row style="margin-top: 80px;" v-if="isCreated">
        <a-col :span="8" align="center"></a-col>
        <a-col :span="8" align="center">{{ $t('activate.role.create.success') }}</a-col>
        <a-col :span="8" align="center"></a-col>
      </a-row>
      <a-row style="margin-top: 80px;" v-if="isCreated">
        <a-col :span="8" align="center"></a-col>
        <a-col :span="8" align="center">
          <a-button type="primary" @click="gotoLogin()">{{ $t('activate.login.btn.text') }}</a-button>
        </a-col>
        <a-col :span="8" align="center"></a-col>
      </a-row>
      <a-modal v-model="visible" :title="$t('activate.modal.title')" onOk="handleOk" :width="600">
        <template slot="footer">
          <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
            {{ $t('activate.modal.button.download.key') }}
          </a-button>
        </template>
        <p class="modal-title">{{ $t('activate.modal.content') }}</p>
        <div style="overflow: hidden;">
          <div class="qr-code">
            <img :src="url1" />
          </div>
          <div class="key-value">
            <p>{{ $t('activate.public.keys') }}</p>
            <p>{{ address }}</p>
          </div>
        </div>
        <div style="overflow: hidden; margin-top: 10px;">
          <div class="qr-code">
            <img :src="url2" />
          </div>
          <div class="key-value">
            <p>{{ $t('activate.private.keys') }}</p>
            <p>{{ privateKey }}</p>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
import QRCode from 'qrcode'
import { mapState } from 'vuex'
import { getUrlParameters } from '@/utils/util'
import { entityRolesDataSource } from '@/const/systemData'
export default {
  name: 'CreateRoleStep2',
  props: {
    inviteRecord: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      loading: false,
      labelCol: { lg: { span: 10 }, sm: { span: 10 } },
      wrapperCol: { lg: { span: 10, offset: 7 }, sm: { span: 10, offset: 7 } },
      url1: '',
      url2: '',
      submitLoading: false,
      isCreated: false
    }
  },
  computed: {
    ...mapState({
      username: state => state.account.step1.username,
      password: state => state.account.step1.password,
      privateKey: state => state.web3.privateKey,
      address: state => state.web3.address,
      encrypt: state => state.web3.encrypt
    })
  },
  methods: {
    confirmNext () {
      this.visible = true
      this.isCreated = true
      // this.$emit('finish')
      QRCode.toDataURL(this.address)
        .then(url => {
          this.url1 = url
        })
        .catch(err => {
          console.error(err)
        })
      QRCode.toDataURL(this.privateKey)
        .then(url => {
          this.url2 = url
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
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
    handleOk () {
      this.visible = false
      const str = JSON.stringify(this.encrypt)
      var blob = new Blob([str], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, 'encrypt.json')
    },
    handleSubmit () {
      this.submitLoading = true
      const {
        form: { validateFields }
      } = this
      const code = getUrlParameters('code')
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.$store
            .dispatch('generateKeys', {
              username: this.username,
              password: this.password,
              keyPassword: values.password,
              code,
              role: this.inviteRecord.role,
              isCreateAccount: false
            })
            .then(res => {
              this.confirmNext()
              this.submitLoading = false
            })
            .catch(err => {
              this.submitLoading = false
              this.$store.dispatch('errHandler', err)
            })
        }
      })
    },
    gotoLogin () {
      const loginPath = entityRolesDataSource.find(item => {
        if (item.role === this.inviteRecord.role) {
          return item
        }
      }).loginPath
      this.$router.push({ path: loginPath || '/user/login' })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-modal-footer {
  text-align: center;
}
.modal-title {
  color: #f0081a;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.key-value {
  float: left;
  width: 50%;
  p:last-child {
    border-bottom: 1px solid #ddd;
    color: #ccc;
  }
}
.key-value:last-child {
  margin-top: 20px;
}
.qr-code {
  width: 35%;
  float: left;
  text-align: center;
}
.warning {
  background: red;
  color: #fff;
  border-radius: 5px;
  font-size: 30px;
  float: left;
  margin: 6px 10px 0 0;
}
</style>
