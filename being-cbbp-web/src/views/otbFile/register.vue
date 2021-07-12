<template>
  <div style="display: flex; justify-content: center;">
    <a-card title="Register file infomation to OTB" :bordered="true" style="margin-top:15px; width: 450px">
      <a-form :form="form">
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
                multiple
                @change="inputFileUpload"
              /><!-- multiple accept=".pdf,application/pdf" -->
            </a-button>
          </a-form-item>

          <a-form-item :label="$t('Index.edit.filename')" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              :disabled="true"
              @change="handleInputName"
              v-decorator="['fileName', { rules: [{ required: true, message: 'Please input the name' }] }]"
            />
          </a-form-item>

          <a-form-item :label="'registrar'" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              @change="handleInputName"
              v-decorator="[
                'registrar',
                { initialValue: 'Fortune Pte Ltd.', rules: [{ required: false, message: 'Please input the name' }] }
              ]"
            />
          </a-form-item>

          <a-form-item :label="'doc_ref_no'" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              @change="handleInputName"
              v-decorator="[
                'docRefNo',
                { initialValue: 'INVOICEWIN-77298463', rules: [{ required: false, message: 'Please input the name' }] }
              ]"
            />
          </a-form-item>

          <a-form-item :label="'doc_desc'" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              @change="handleInputName"
              v-decorator="[
                'docDesc',
                {
                  initialValue: 'Registered with TIFFA',
                  rules: [{ required: false, message: 'Please input the name' }]
                }
              ]"
            />
          </a-form-item>

          <a-form-item :label="'doc_type'" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              @change="handleInputName"
              v-decorator="[
                'docType',
                { initialValue: 'INVOICE', rules: [{ required: false, message: 'Please input the name' }] }
              ]"
            />
          </a-form-item>

          <a-col :span="24" align="center">
            <a-button type="primary" @click="sendToOTB()">
              Send to OTB
            </a-button>
          </a-col>
        </div>
      </a-form>
    </a-card>

    <a-table :columns="columns" :dataSource="fileList" bordered style="margin-top:15px; width: 600px">
      <template slot="name" slot-scope="text">
        <a href="javascript:;">{{ text }}</a>
      </template>
    </a-table>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
// import { getUrlParameters } from '@/utils/util'
export default {
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      labelCol: { lg: { span: 8 }, sm: { span: 10 } },
      wrapperCol: { lg: { span: 16 }, sm: { span: 14 } },
      fileName: '',
      files: [],
      fileList: [],
      columns: []
    }
  },
  computed: {
    // ...mapState({
    //   fileList: state => state.detail.fileList
    // })
  },
  created () {
    this.$store.commit('detailClearData')
    this.columns = [
      {
        title: 'File Name',
        dataIndex: 'name',
        scopedSlots: { customRender: 'name' }
      },
      {
        title: 'File Type',
        dataIndex: 'fileType'
      },
      {
        title: 'Document Type',
        dataIndex: 'documentType'
      }
    ]
  },
  methods: {
    ...mapActions(['snedFileToOTB', 'errHandler', 'detailAddDocument']),
    handleInputName (e) {
      const name = e.target.value.replace('.', '')
      this.form.setFieldsValue({
        fileName: name
      })
      this.fileName = name
    },
    sendToOTB (e) {
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
          this.submitData(values)
          this.visible = true
        }
      })
    },
    addFile () {
      this.$refs.files.click()
    },
    clearData () {
      this.form.setFieldsValue({
        fileName: ''
      })
      this.fileName = ''
      this.files = []
    },
    inputFileUpload () {
      this.files = []
      const uploadedFiles = this.$refs.files.files
      for (let i = 0, len = uploadedFiles.length; i < len; i++) {
        const name = uploadedFiles[i].name
        uploadedFiles[i].showType = name.substr(name.lastIndexOf('.') + 1, name.length)
        this.form.setFieldsValue({
          fileName: this.fileName ? this.fileName : name.substr(0, name.lastIndexOf('.'))
        })
        this.files.push(uploadedFiles[i])
      }
      this.$refs.files.value = ''
    },
    submitData (values) {
      this.$store.commit('detailClearData')
      this.confirmLoading = true
      const fetchAll = []
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].status !== 'finish' && this.files[i].status !== 'fail') {
          const formData = new FormData()
          formData.append('registrar', values.registrar)
          formData.append('docRefNo', values.docRefNo)
          formData.append('docDesc', values.docDesc)
          formData.append('docType', values.docType)
          formData.append('file', this.files[i])
          fetchAll.push(
            this.snedFileToOTB(formData).then(({ data }) => {
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
                documentType: values.docType
              }
              this.files[i].name && this.fileList.unshift(newFile)
              this.$forceUpdate()
            })
          )
        }
      }
      Promise.all(fetchAll)
        .then(() => {
          // return this.detailAddDocument({ fileList: this.fileList, shipmentNo })
        })
        .then(() => {
          this.$emit('reLoadInfo', this.fileList[0].hash)
          this.visible = false
          this.$message.info('uploaded file')
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
