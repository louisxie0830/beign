<template>
  <div class="step1">
    <h2 class="htitle">{{ $t('step1.instruction.title') }}</h2>
    <div class="content1">
      <div>
        <p>{{ $t('step1.stepinstruction') }}</p>
        <p>1.&nbsp;{{ $t('step1.instruction1') }}</p>
        <p>2.&nbsp;{{ $t('step1.instruction2') }}</p>
        <p>3.&nbsp;{{ $t('step1.instruction3') }}</p>
        <p>4.&nbsp;{{ $t('step1.instruction4') }}</p>
        <p>5.&nbsp;{{ $t('step1.instruction5') }}</p>
        <p>6.&nbsp;{{ $t('step1.instruction6') }}</p>
        <p>7.&nbsp;{{ $t('step1.instruction7') }}</p>
      </div>
    </div>
    <a-form :form="form" style="max-width: 90%; margin: 40px auto 0;">
      <div style="overflow: hidden;">
        <div style="width: 50%; float: left; padding: 10px;">
          <a-form-item :label="$t('step1.exporter')" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select
              :placeholder="$t('common.step.select')"
              @change="handleSelectExporter"
              v-decorator="['exporterUserName', { rules: [{ required: true, message: $t('step1.tip.exporter') }] }]"
            >
              <a-select-option v-for="(item, index) in exporters" :key="index" :value="item.companyId">{{
                item.companyName
              }}</a-select-option>
            </a-select>
          </a-form-item>
          <p class="p_label">
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
          </p>
          <a-form-item :label="$t('step1.file.type')" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select
              :disabled="modify"
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

          <a-form-item :label="$t('step.edit.file.name')" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              :disabled="modify"
              @change="handleInputName"
              v-decorator="['fileName', { rules: [{ required: true, message: $t('file.name.input.validate') }] }]"
            />
          </a-form-item>
          <Pdf @getBigger="getBigger" v-if="pdfShow" :source="pdfUrl" @handleError="handleError" type="create" />
        </div>
        <div style="width: 50%; float: right; padding: 10px;">
          <a-list size="large" bordered :dataSource="paginationData" :locale="{ emptyText: $t('common.no.data') }">
            <a-list-item slot="renderItem" slot-scope="item, index">
              <a-list-item-meta>
                <a
                  @click="fileDetail(item, index)"
                  :class="{ active: index === currentIndex }"
                  slot="title"
                >{{ index + 1 }}. {{ item.fileName }}.{{ item.showType }}</a
                >
              </a-list-item-meta>
              <div>
                <a @click="deleteItem(item)"><a-icon type="close"/></a>
              </div>
            </a-list-item>
          </a-list>
          <a-pagination
            style="margin-top: 20px"
            size="small"
            v-model="current"
            :defaultPageSize="10"
            :total="totalPage"
          />
        </div>
      </div>
      <img v-if="imgShow" :src="pdfUrl" />
      <a-form-item class="next-step">
        <a-button type="primary" @click="nextStep">{{ $t('step1.upload') }}</a-button>
      </a-form-item>
    </a-form>
    <a-divider />
    <a-modal
      :title="$t('step.result')"
      :closable="false"
      :maskClosable="false"
      :cancelText="$t('step.cancel.text')"
      :okText="$t('step.ok.text')"
      :confirmLoading="confirmLoading"
      v-model="visible"
      :width="600"
      @ok="handleOk"
    >
      <p v-for="(m, index) in files" :key="m.name + index">
        {{ m.fileName }}.{{ m.showType }} ... {{ lang === 'en-US' ? m.status : statusMap[m.status] }}
        <a-icon v-if="m.status === 'uploading...'" type="loading" />
        <a-icon style="color: green;" v-if="m.status === 'verified'" type="check" />
        <a-icon v-if="m.status === 'failed'" style="color: red;" type="warning" />
      </p>
    </a-modal>
    <div v-show="pdfShowModal" class="pdf-modal">
      <div class="icon-list">
        <a-icon class="icon-icon" @click="closePdfModal()" type="close" />
        <!-- <a-icon class="icon-icon" @click="downLoadPdf()"  type="cloud-download" /> -->
        <!-- <a-icon class="icon-icon" @click="printPdf()" type="printer" /> -->
      </div>
      <div class="pdf-modal-content">
        <Pdf
          ref="pdfDetail"
          :fullHeight="true"
          v-if="pdfShow"
          :border="false"
          :source="pdfUrl"
          type="detail"
          @handleError="handleError"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Pdf from '@/components/PDF/index'
import { mapState, mapActions } from 'vuex'
import { groupArray } from '@/utils/util'
export default {
  name: 'Step1',
  data () {
    return {
      statusMap: {
        'uploading...': '驗證中...',
        failed: '驗證失敗',
        verified: '驗證成功'
      },
      labelCol: { lg: { span: 10 }, sm: { span: 12 } },
      wrapperCol: { lg: { span: 14 }, sm: { span: 12 } },
      visible: false,
      pdfShow: false,
      imgShow: false,
      pdfShowModal: false,
      fileName: '',
      documentType: 'Invoice',
      form: this.$form.createForm(this),
      files: [], // 未上传，未开始校验的文件列表
      updateFileList: [], // 校验后的文件列表
      pdfUrl: '',
      imgData: '',
      isImg: false,
      active: 'active',
      confirmLoading: false,
      currentIndex: 0,
      current: 1,
      modify: false
    }
  },
  computed: {
    ...mapState({
      fileListIsOTB: state => state.create.fileListIsOTB,
      exporterData: state => state.create.exporter,
      selectExporter: state => state.create.selectExporter,
      step1FileList: state => state.create.step1FileList,
      loginUserInfo: state => state.user.info,
      lang: state => state.i18n.lang
    }),
    group () {
      return groupArray(this.files, 10)
    },
    paginationData () {
      return this.group[this.current - 1]
    },
    totalPage () {
      return this.files.length
    },
    exporters () {
      return this.$systemData().filterEntities(this.loginUserInfo, 'EXPORTER', this.exporterData)
      // if (this.loginUserInfo & (this.loginUserInfo.company.id === 16)) {
      //   return [
      //     {
      //       id: 30,
      //       companyId: 21,
      //       role: 'EXPORTER',
      //       createdAt: '2020-02-05T03:38:46.000Z',
      //       updatedAt: '2020-02-05T03:41:04.000Z',
      //       companyName: '3M Singapore Pte. Ltd.'
      //     },
      //     {
      //       id: 31,
      //       companyId: 20,
      //       role: 'EXPORTER',
      //       createdAt: '2020-02-05T03:35:36.000Z',
      //       updatedAt: '2020-02-05T03:41:16.000Z',
      //       companyName: '3M Innovation Singapore Pte. Ltd.'
      //     },
      //     {
      //       id: 24,
      //       companyId: 19,
      //       role: 'EXPORTER',
      //       createdAt: '2020-01-20T06:01:43.000Z',
      //       updatedAt: '2020-01-20T06:01:43.000Z',
      //       companyName: 'APAC Trade Compliance'
      //     }
      //   ]
      // } else if (this.loginUserInfo && this.loginUserInfo.company.id === 13) {
      //   return [
      //     {
      //       id: 19,
      //       companyId: 15,
      //       role: 'EXPORTER',
      //       createdAt: '2020-01-17T07:18:56.000Z',
      //       updatedAt: '2020-01-17T07:18:56.000Z',
      //       companyName: 'FUJI OIL ASIA PTE.LTD'
      //     }
      //   ]
      // } else {
      //   return this.exporterData
      // }
    }
  },
  created () {
    this.requestExporter()
    this.files = this.step1FileList
    this.files.length > 0 &&
      this.$nextTick(() => {
        this.form.setFieldsValue({
          exporterUserName: this.selectExporter,
          fileName: this.files[0].fileName
        })
        if (this.files[0].status !== 'uploading...') {
          this.modify = true
        }
      })
  },
  components: {
    Pdf
  },
  methods: {
    ...mapActions(['uploadFile', 'errHandler', 'requestExporter', 'setSelectExporter']),
    handleSelectChange (value) {
      this.documentType = value
      this.files[this.currentIndex] && this.$set(this.files[this.currentIndex], 'documentType', value)
      this.files[this.currentIndex] && this.$set(this.files[this.currentIndex], 'status', 'uploading...')
    },
    closePdfModal () {
      this.pdfShowModal = false
      // this.pdfShow = false
    },
    getBigger () {
      this.pdfShowModal = true
      this.pdfShow = true
    },
    handleInputName (e) {
      const name = e.target.value.replace('.', '')
      this.files = this.files.map((item, index) => {
        if (index === this.currentIndex) {
          item.fileName = name
          item.status = 'uploading...'
        }
        return item
      })
    },
    handleSelectExporter (value) {
      this.setSelectExporter(value)
    },
    addFile () {
      // if (!this.documentType) {
      //   this.$message.info('please select a document type')
      //   return
      // }
      this.$refs.files.click()
    },
    handleError (err) {
      this.errHandler(err)
      this.pdfShow = false
      // this.imgShow = false
    },
    isExistFile (name) {
      if (this.step1FileList.length > 0) {
        for (let i = 0, len = this.step1FileList.length; i < len; i++) {
          if (this.step1FileList[i].name === name) {
            return true
          }
        }
      }
      return false
    },
    inputFileUpload () {
      // 上传文件
      const uploadedFiles = this.$refs.files.files
      for (let i = 0, len = uploadedFiles.length; i < len; i++) {
        const name = uploadedFiles[i].name
        // if (this.isExistFile(name)) {
        //   // 名字已经存在， 替换
        //   uploadedFiles[i].status = 'uploading...'
        //   uploadedFiles[i].documentType = this.documentType
        //   this.files[i] = uploadedFiles[i]
        // }
        if (!this.isExistFile(name)) {
          uploadedFiles[i].status = 'uploading...' // this.$t('common.verfy.uploading')
          uploadedFiles[i].documentType = this.documentType
          uploadedFiles[i].fileName = name.substr(0, name.lastIndexOf('.'))
          uploadedFiles[i].showType = name.substr(name.lastIndexOf('.') + 1, name.length)
          this.setFieldsValue(name, uploadedFiles[i].documentType)
          this.files.push(uploadedFiles[i])
        }
      }
      this.$refs.files.value = ''
      this.currentIndex = this.files.length - 1
      this.modify = false
      // console.log(this.files)
    },
    setFieldsValue (name, type) {
      this.form.setFieldsValue({
        fileName: name.lastIndexOf('.') > -1 ? name.substr(0, name.lastIndexOf('.')) : name,
        documentType: type
      })
    },
    submitUpload () {
      const fetchAll = []
      this.confirmLoading = true
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].status !== 'verified' && this.files[i].status !== 'failed') {
          const formData = new FormData()
          formData.append('isOTB', true)
          // formData.append('documentType', this.files[i].documentType)
          formData.append('file', this.files[i])
          fetchAll.push(
            this.uploadFile(formData)
              .then(({ data }) => {
                // console.log('data', data)
                this.files[i].status = 'verified' // this.$t('common.verfy.success')
                this.files[i] = { ...this.files[i], ...data }
                // this.files[i].fileName = this.files[i].name
                this.files[i].name &&
                  this.$store.commit('updateFileListIsOTB', {
                    name: this.files[i].fileName + '.' + this.files[i].showType,
                    fileType: this.files[i].type,
                    otbVerifyTime: this.files[i].otbVerifyTime,
                    // status: this.files[i].status,
                    hash: this.files[i].hash,
                    size: this.files[i].size,
                    key: this.files[i].key,
                    documentType: this.files[i].documentType
                  })
                this.$forceUpdate()
              })
              .catch(err => {
                this.$forceUpdate()
                this.files[i].status = 'failed' // this.$t('common.verfy.failed')
                this.errHandler(err)
                console.log('upload', err)
              })
          )
        }
      }
      Promise.all(fetchAll).finally(() => {
        if (this.$refs.files.value) {
          this.$refs.files.value = ''
        }
        this.confirmLoading = false
        this.modify = true
        this.$forceUpdate()
      })
    },
    fileDetail (item, index) {
      console.log(item)
      this.currentIndex = index
      this.setFieldsValue(item.fileName, item.documentType)
      if (item.status !== 'uploading...') {
        this.modify = true
      } else {
        this.modify = false
      }
      if (item.type !== 'application/pdf') {
        // this.$message.warn('暂不支持此种文件预览')
        this.$message.warn('can not support this file type')
        this.pdfShow = false
        return
      }
      // this.pdfShow = true
      this.loadPreview(item)
      // this.pdfUrl = item.data
    },
    loadPreview (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (file.type) {
          if (this.isImg) {
            this.imgData = reader.result
            // this.imgShow = true
          } else {
            this.pdfUrl = new Uint8Array(reader.result)
            this.pdfShow = true
          }
          // this.pdfUrl = reader.result
          // this.file.type = type
        } else {
          this.pdfShow = false
          // this.imgShow = false
        }
      }
      reader.readAsArrayBuffer(file)
    },
    deleteItem (item) {
      this.$confirm({
        title: 'Delete File',
        content: `${this.$t('common.modal.content.tip')}`,
        onOk: () => {
          this.files = this.files.filter(file => file.name !== item.name)
          this.$store.commit('deleteFileIsOTB', item)
        },
        onCancel () {}
      })
    },
    handleOk (e) {
      // 把需要渲染的数据存入vuex
      if (this.files.some(item => item.status === 'verified')) {
        this.$store.commit('step1FileList', this.files)
        this.$emit('nextStep')
        this.visible = false
      } else {
        this.$message.info(this.$t('step1.upload.otb.tip'))
      }
    },
    nextStep () {
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
    }
  }
}
</script>

<style lang="less">
.step1 {
  .htitle {
    color: #249c9f;
    text-align: center;
    margin: 49px 0;
  }
  .content1 {
    max-width: 865px;
    // margin-top: 20px;
    // margin-left: 14%;
    margin: 20px auto 0px;
    p {
      color: #000;
    }
  }
  .next-step {
    margin-top: 30px;
    text-align: center;
  }
  .active {
    color: #13c2c2;
  }
  .ant-upload-list {
    display: none !important;
  }
  h4 {
    margin: 0;
  }
  .pdf-modal {
    height: 100vh;
    width: 100vw;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  .pdf-modal-content {
    overflow: auto;
    width: 90vw;
    height: 90vh;
    margin-top: 5vh;
    margin-left: 5vw;
    background: #fff;
  }
  .icon-list {
    position: fixed;
    left: 5vw;
    top: 0;
    height: 40px;
    width: 92vw;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
    .icon-icon {
      float: right;
      font-size: 30px;
      color: #fff;
      margin-left: 20px;
      cursor: pointer;
      margin-top: 6px;
    }
  }
  .p_label label::before {
    display: inline-block;
    margin-right: 4px;
    content: '*';
    font-family: SimSun;
    line-height: 1;
    font-size: 14px;
    color: #f5222d;
  }
}
</style>
