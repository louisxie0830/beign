<template>
  <div>
    <a-modal
      :title="$t('step3.save.confirm.title')"
      :cancelText="$t('list.modal.cancel')"
      :okText="$t('list.modal.confirm')"
      :confirmLoading="saveBtn"
      :visible="saveVisible"
      @ok="handleOkSave"
      @cancel="handleCancel"
    >
      <p>{{ $t('step3.save.confirm.content1') }}</p>
      <p>{{ $t('step3.save.confirm.content2') }}</p>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { userInfo } from 'os'
export default {
  name: 'SavaModal',
  props: {
    saveVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      saveBtn: false,
      result: {}
    }
  },
  computed: {
    ...mapState({
      fileListIsNotOTB: state => state.create.fileListIsNotOTB,
      fileListIsOTB: state => state.create.fileListIsOTB,
      selectExporter: state => state.create.selectExporter,
      loginUser: state => state.user.info
    }),
    fileList () {
      return this.fileListIsOTB.concat(this.fileListIsNotOTB).map(item => {
        item['userId'] = this.loginUser.id
        item['role'] = this.loginUser.role.code
        item['companyId'] = this.loginUser.companyId
        return item
      })
    }
  },
  methods: {
    handleCancel () {
      this.$emit('handleCancelSave')
    },
    handleOkSave () {
      this.Save()
    },
    Save () {
      this.saveBtn = true
      const options = {
        fileList: this.fileList,
        exporter: this.selectExporter,
        importer: this.loginUser.companyId,
        customsBroker: null,
        consignee: 'consignee'
      }
      this.$store
        .dispatch('handleWeb3Decrypt')
        .then(() => {
          return this.$store.dispatch('submitCreateShipment', options)
        })
        .then(({ data }) => {
          data.documents = options.fileList.map(item => {
            item.fileHash = item.hash
            return item
          })
          this.$store.dispatch('clearShipment')
          this.$store.dispatch('signAll', { action: 'create', shipmentList: [data] })
          this.saveBtn = false
          this.handleCancel()
          this.$emit('showResult', data)
        })
        .catch(err => {
          this.saveBtn = false
          this.handleCancel()
          this.$store.dispatch('errHandler', err)
        })
    }
  }
}
</script>

<style></style>
