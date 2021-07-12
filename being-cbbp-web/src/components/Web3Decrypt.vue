<template>
  <div class="web3-decrypt">
    <a-modal
      :title="$t('list.password.modal')"
      @ok="handleOk"
      :okText="$t('list.modal.confirm')"
      :cancelText="$t('list.modal.cancel')"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :visible="showWeb3PasswordModal"
    >
      <p>
        <a-input v-model="password" type="password" :placeholder="$t('list.password.modal')" />
      </p>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Web3Decrypt',
  data () {
    return {
      password: '',
      confirmLoading: false
    }
  },
  computed: {
    ...mapState({
      showWeb3PasswordModal: state => state.web3.showWeb3PasswordModal,
      keyStore: state => state.user.info.privateKey
    })
  },
  methods: {
    handleCancel () {
      this.$store.dispatch('closeDecryptModal')
    },
    handleOk () {
      const keyStore = this.keyStore
      const password = this.password
      this.$store
        .dispatch('decrypt', { keyStore, password })
        .then(() => {
          this.$message.success(this.$t('button.DecryptCorrectTip'))
          this.$store.dispatch('closeDecryptModal')
        })
        .catch(err => {
          if (err) {
            console.log(err)
          }
          this.$message.warn(this.$t('button.DecryptFailTip'))
        })
        .finally(() => {
          this.password = ''
        })
    }
  }
}
</script>

<style lang="less" scoped></style>
