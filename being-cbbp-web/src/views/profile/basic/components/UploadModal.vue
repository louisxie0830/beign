<template>
  <div>
    <a-button
      @click="showModal"
    ><i style="color:#68b310" class="demo-icon">&#xe800;</i>{{ $t('Index.upload') }}</a-button
    >
    <a-modal
      :title="$t('Index.file.upload')"
      v-model="visible"
      :okText="$t('list.modal.confirm')"
      :cancelText="$t('list.modal.cancel')"
      :closable="false"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      width="720px"
    >
      <a-form :form="form" style="max-width: 800px; margin: 10px auto 0;">
        <div style="overflow: hidden;">
          <a-form-item :label="$t('step.add.new.file')" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-button @click="addFile()">
              <a-icon type="upload" /> {{ $t('common.upload') }}
              <input
                style="display: none;"
                id="files"
                ref="files"
                type="file"
                name="inputFileUpload"
                @change="inputFileUpload"
              /><!-- multiple accept=".pdf,application/pdf" -->
            </a-button>
          </a-form-item>
          <a-form-item :label="$t('Index.edit.filename')" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              @change="handleInputName"
              v-decorator="['fileName', { rules: [{ required: true, message: $t('file.name.input.validate') }] }]"
            />
          </a-form-item>
          <a-form-item :label="$t('step1.file.type')" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select
              @change="handleSelectChange"
              v-decorator="[
                'documentType',
                { rules: [{ required: true, message: $t('step1.file.type') }], initialValue: 'Invoice' }
              ]"
            >
              <a-select-option value="Invoice">{{ $t('step.file.type1') }}</a-select-option>
              <a-select-option value="PackingList">{{ $t('step.file.type2') }}</a-select-option>
              <a-select-option value="C/O">{{ $t('step.file.type3') }}</a-select-option>
              <a-select-option value="MSDS">MSDS</a-select-option>
              <a-select-option value="Other">{{ $t('step.file.type4') }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="this.$t('Index.otb.file')" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-radio-group v-decorator="['isOTB', { initialValue: '1' }]" @change="handleSelectRadio">
              <a-radio-button value="1">
                {{ this.$t('Index.file.yes') }}
              </a-radio-button>
              <a-radio-button value="2">
                {{ this.$t('Index.file.no') }}
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { getUrlParameters } from '@/utils/util'
export default {
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      labelCol: { lg: { span: 8 }, sm: { span: 10 } },
      wrapperCol: { lg: { span: 16 }, sm: { span: 14 } },
      fileName: '',
      idx: 1,
      isOTB: true,
      documentType: 'Invoice',
      files: [],
      selectedExporter: ''
    }
  },
  computed: {
    ...mapState({
      fileList: state => state.detail.fileList
    })
  },
  created () {
    this.$store.commit('detailClearData')
  },
  methods: {
    ...mapActions(['detailUploadFile', 'errHandler', 'detailAddDocument']),
    isExistFile (name) {
      if (this.fileList.length > 0) {
        for (let i = 0, len = this.fileList.length; i < len; i++) {
          if (this.fileList[i].name === name) {
            return true
          }
        }
      }
      return false
    },
    handleInputName (e) {
      const name = e.target.value.replace('.', '')
      this.form.setFieldsValue({
        fileName: name
      })
      this.fileName = name
    },
    showModal () {
      this.$store
        .dispatch('handleWeb3Decrypt')
        .then(() => {
          this.visible = true
        })
        .catch(err => {
          if (err) {
          }
        })
    },
    handleOk (e) {
      // console.log('this',this)
      if (this.files.length === 0) {
        this.$message.info(this.$t('step1.upload.tip'))
        return
      }
      const {
        form: { validateFields }
      } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.submitUpload()
          this.visible = true
        }
      })
    },
    handleSelectChange (value) {
      this.documentType = value
    },
    handleSelectRadio (e) {
      this.isOTB = e.target.value === '1'
      console.log('this.isOTB', this.isOTB)
    },
    handleSelectExporter (value) {
      this.selectedExporter = value
    },
    addFile () {
      if (!this.documentType) {
        this.$message.info('please select a document type')
        return
      }
      this.$refs.files.click()
    },
    clearData () {
      this.form.setFieldsValue({
        fileName: ''
      })
      this.fileName = ''
      this.documentType = 'Invoice'
      this.selectedExporter = ''
      this.files = []
    },
    inputFileUpload () {
      this.files = []
      const uploadedFiles = this.$refs.files.files
      for (let i = 0, len = uploadedFiles.length; i < len; i++) {
        const name = uploadedFiles[i].name
        if (!this.isExistFile(name)) {
          uploadedFiles[i].showType = name.substr(name.lastIndexOf('.') + 1, name.length)
          this.form.setFieldsValue({
            fileName: this.fileName ? this.fileName : name.substr(0, name.lastIndexOf('.'))
          })
          this.files.push(uploadedFiles[i])
        }
      }
      this.$refs.files.value = ''
    },
    submitUpload () {
      this.$store.commit('detailClearData')
      this.confirmLoading = true
      const shipmentNo = getUrlParameters('shipmentNo').toString()
      const fetchAll = []
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].status !== 'finish' && this.files[i].status !== 'fail') {
          const formData = new FormData()
          formData.append('isOTB', this.isOTB)
          // formData.append('documentType', this.documentType)
          formData.append('file', this.files[i])
          fetchAll.push(
            this.detailUploadFile(formData).then(({ data }) => {
              console.log('data', data)
              this.files[i].status = 'finish'
              this.files[i] = { ...this.files[i], ...data }
              // this.fileName = this.files[i].name
              const newFile = {
                name: this.fileName ? this.fileName + '.' + this.files[i].showType : this.files[i].name,
                fileType: this.files[i].type,
                // status: this.files[i].status,
                hash: this.files[i].hash,
                size: this.files[i].size,
                key: this.files[i].key,
                documentType: this.documentType
              }
              this.files[i].name && this.$store.commit('detailUpdateFileList', newFile)
              this.$forceUpdate()
            })
          )
        }
      }
      Promise.all(fetchAll)
        .then(() => {
          return this.detailAddDocument({ fileList: this.fileList, shipmentNo })
        })
        .then(() => {
          this.$emit('reLoadInfo', this.fileList[0].hash)
          this.visible = false
          this.$message.info(this.$t('button.ImporterUploadTip'))
          this.clearData()
        })
        .catch(err => {
          console.log('err', err)
          // this.$message.info('添加失败')
          // this.isClose = false
          // this.files[i].status = 'fail'
          this.errHandler(err)
        })
        .finally(() => {
          this.confirmLoading = false
          if (this.$refs.files.value) {
            this.$refs.files.value = ''
          }
          this.$forceUpdate()
        })
    }
  }
}
</script>
