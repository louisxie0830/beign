<template>
  <div class="step3">
    <div style="overflow: hidden;">
      <div class="step-title">{{ $t('step3.title') }}</div>
      <p align="center">{{ $t('step3.title.info') }}</p>
      <div class="table-list">
        <a-table :columns="getColumns()" :dataSource="paginationData" bordered :pagination="false">
          <template slot="fileName" slot-scope="text, record">
            <span> {{ record.fileName }}.{{ record.showType }} </span>
          </template>
          <template slot="documentType" slot-scope="text, record">
            <span> {{ lang === 'zh-TW' ? documentTypeMap[record.documentType] : record.documentType }} </span>
          </template>
          <template slot="status" slot-scope="text, record">
            <a-icon style="color: green;" type="check" v-if="record.status === 'verified'" />
            <a-icon style="color: red;" type="warning" v-if="record.status === 'failed'" />
            <span v-if="record.status === 'finish'">N/A</span>
          </template>
        </a-table>
        <a-pagination
          style="margin-top: 20px; text-align: right;"
          size="small"
          v-model="current"
          :defaultPageSize="10"
          :total="totalPage"
        />
      </div>
    </div>
    <div class="next-step">
      <a-button @click="cancal" style="margin-right: 20px;">{{ $t('list.modal.cancel') }}</a-button>
      <a-button @click="prevStep" style="margin-right: 20px;">{{ $t('back.to.step2') }}</a-button>
      <a-button type="primary" style="margin-right: 20px;" @click="confirmSave()">{{ $t('personal.save') }}</a-button>
      <a-button @click="nextStep">
        <i style="color:#68b310" class="demo-icon">&#xe808;</i>
        {{ $t('transmit.to.cb') }}
      </a-button>
    </div>
    <a-modal
      :title="$t('step3.broker')"
      :okText="$t('list.modal.confirm')"
      :cancelText="$t('list.modal.cancel')"
      v-model="customsBrokerVisible"
      @ok="customsBrokerHandleOk"
      @cancel="customsBrokerHandleCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="form" style="max-width: 90%;">
        <a-form-item :label="$t('step3.broker')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            :placeholder="$t('common.step.select.customsBroker')"
            @change="handleSelectChange"
            v-decorator="['customsBroker', { rules: [{ required: true, message: $t('step3.broker') }] }]"
          >
            <!-- <a-select-option v-for="(item, index) in customsBroker" :key="index" :value="item.companyId"> -->
            <a-select-option v-for="(item, index) in customsBrokerList" :key="index" :value="item.companyId">
              {{ item.companyName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-divider />
    <save-modal @showResult="showResult" @handleCancelSave="handleCancelSave" :saveVisible="saveVisible" />
    <a-modal
      :title="msgTitle"
      :closable="false"
      :maskClosable="false"
      :cancelText="$t('step3.modal.cancel')"
      :okText="$t('step3.modal.ok')"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p>{{ msgContent }}</p>
      <p>{{ $t('step3.time') }}：{{ time }}</p>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import { groupArray } from '@/utils/util'
import SaveModal from './components/SaveModal'
export default {
  name: 'Step3',
  data () {
    return {
      documentTypeMap: {
        Invoice: '發票',
        INVOICE: '發票',
        Other: '其他',
        'C/O': '原產地證明',
        PackingList: '裝箱單',
        MSDS: 'MSDS'
      },
      current: 1,
      customsBrokerVisible: false,
      time: '',
      labelCol: { lg: { span: 10 }, sm: { span: 12 } },
      wrapperCol: { lg: { span: 14 }, sm: { span: 12 } },
      visible: false,
      msgTitle: '',
      msgContent: '',
      selectCustomsBroker: '',
      form: this.$form.createForm(this),
      consignee: 'consignee',
      newShipmentNo: '',
      confirmLoading: false,
      saveBtn: false,
      saveVisible: false
    }
  },
  components: {
    SaveModal
  },
  computed: {
    ...mapState({
      fileListIsOTB: state => state.create.fileListIsOTB,
      fileListIsNotOTB: state => state.create.fileListIsNotOTB,
      customsBroker: state => state.create.customsBroker,
      selectExporter: state => state.create.selectExporter,
      step1FileList: state => state.create.step1FileList,
      step2FileList: state => state.create.step2FileList,
      consigneeList: state => state.create.consigneeList,
      userInfo: state => state.user.info,
      lang: state => state.i18n.lang
    }),
    paginationData () {
      const list = this.files.map(file => {
        return {
          ...file
        }
      })
      return groupArray(list, 10)[this.current - 1]
    },
    totalPage () {
      return this.files.length
    },
    files () {
      return this.step1FileList.concat(this.step2FileList)
    },
    fileList () {
      return this.fileListIsOTB.concat(this.fileListIsNotOTB).map(item => {
        item['userId'] = this.userInfo.id
        item['role'] = this.userInfo.role.code
        item['companyId'] = this.userInfo.companyId
        return item
      })
    },
    customsBrokerList () {
      return this.$systemData().filterEntities(this.userInfo, 'CUSTOMS_BROKER', this.customsBroker)
    }
  },
  created () {
    this.requestCustomsBroker()
    this.requestConsignee('CONSIGNEE')
  },
  methods: {
    ...mapActions([
      'submitCreateShipment',
      'errHandler',
      'clearShipment',
      'requestCustomsBroker',
      'requestConsignee',
      'signDocument',
      'signShipment'
    ]),
    getColumns () {
      return [
        {
          title: this.$t('Index.file.name'),
          dataIndex: 'fileName',
          scopedSlots: { customRender: 'fileName' }
        },
        {
          title: this.$t('Index.file.type'),
          dataIndex: 'documentType',
          scopedSlots: { customRender: 'documentType' }
        },
        {
          title: this.$t('step3.status'),
          scopedSlots: { customRender: 'status' }
        }
      ]
    },
    showResult (result) {
      this.visible = true
      this.$forceUpdate()
      this.time = moment(result.createdAt).format('YYYY-MM-DD HH:mm')
      this.newShipmentNo = result.shipmentNo
      this.msgTitle = this.$t('step3.save.result.title')
      this.msgContent = this.$t('step3.save.success')
    },
    handleCancelSave () {
      this.saveVisible = false
    },
    customsBrokerHandleOk () {
      const {
        form: { validateFields }
      } = this
      const options = {
        fileList: this.fileList,
        exporter: this.selectExporter,
        importer: this.userInfo.companyId,
        customsBroker: this.selectCustomsBroker,
        consignee: this.consignee
      }
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.$store
            .dispatch('handleWeb3Decrypt')
            .then(() => {
              return this.submitCreateShipment(options)
            })
            .then(({ data }) => {
              this.time = moment(data.createdAt).format('YYYY-MM-DD HH:mm')
              this.newShipmentNo = data.shipmentNo
              this.msgTitle = this.$t('step3.transmit.result.title')
              this.msgContent = this.$t('step3.transmit.success')
              this.visible = true
              this.clearShipment()
              this.$forceUpdate()
              data.documents = options.fileList.map(item => {
                item.fileHash = item.hash
                return item
              })
              this.$store.dispatch('signAll', { action: 'create', shipmentList: [data] })
            })
            .catch(err => {
              this.errHandler(err)
            })
            .finally(() => {
              this.confirmLoading = false
              this.customsBrokerHandleCancel()
            })
        }
      })
    },
    confirmSave () {
      this.saveVisible = true
    },
    customsBrokerHandleCancel () {
      this.customsBrokerVisible = false
    },
    handleSelectChange (value) {
      this.selectCustomsBroker = value
    },
    handleSelectConsignee (value) {
      this.consignee = value
    },
    handleOk (e) {
      console.log(e)
      this.$emit('finish')
      this.visible = false
      // this.$router.push({ name: 'dashboard' })
      this.$router.push({ name: 'ProfileBasic', query: { shipmentNo: this.newShipmentNo } })
    },
    cancal () {
      this.$router.push({ name: 'dashboard' })
    },
    handleCancel () {
      this.$emit('finish')
    },
    prevStep () {
      this.$emit('prevStep')
    },
    nextStep () {
      this.customsBrokerVisible = true
    }
  }
}
</script>

<style lang="less">
.step3 {
  .next-step {
    margin-top: 30px;
    text-align: center;
  }
  .ant-upload-list {
    display: none !important;
  }
  h4 {
    margin: 0;
  }
  .ant-table-body {
    min-width: auto;
  }
  .table-list {
    max-width: 650px;
    width: 100%;
    margin: 70px auto 40px;
  }
}
</style>
