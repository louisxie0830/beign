<template>
  <div class="step2">
    <h2 class="htitle">{{ $t('step2.instruction.title') }}</h2>
    <div class="content1">
      <div>
        <p>{{ $t('step2.stepinstruction') }}</p>
        <p>1.&nbsp;{{ $t('step2.instruction1') }}</p>
        <p>2.&nbsp;{{ $t('step2.instruction2') }}</p>
        <p>3.&nbsp;{{ $t('step2.instruction3') }}</p>
        <p>4.&nbsp;{{ $t('step2.instruction4') }}</p>
        <p>5.&nbsp;{{ $t('step2.instruction5') }}</p>
      </div>
    </div>
    <a-form :form="form" style="max-width: 90%; margin: 40px auto 0;">
      <a-spin :spinning="spinning">
        <div style="overflow: hidden;">
          <div style="width: 50%; float: left; padding: 10px;">
            <p class="p_label">
              <a-form-item :label="$t('step.add.new.file')" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-button @click="addFile()">
                  <a-icon type="upload" />{{ $t('common.upload') }}
                  <input
                    style="display: none;"
                    id="files"
                    ref="files"
                    type="file"
                    name="inputFileUpload"
                    @change="inputFileUpload"
                  /><!-- multiple accept=".pdf,application/pdf"-->
                </a-button>
              </a-form-item>
            </p>
            <a-form-item :label="$t('step1.file.type')" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                @change="handleSelectChange"
                v-decorator="[
                  'documentType',
                  { rules: [{ required: true, message: $t('step1.file.type') }], initialValue: 'Other' }
                ]"
              >
                <a-select-option value="Other">{{ $t('step.file.type4') }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item :label="$t('step.edit.file.name')" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                @change="handleInputName"
                v-decorator="['fileName', { rules: [{ required: true, message: $t('file.name.input.validate') }] }]"
              />
            </a-form-item>
            <Pdf v-if="pdfShow" @getBigger="getBigger" :source="pdfUrl" @handleError="handleError" type="create" />
          </div>
          <div style="width: 50%; float: right; padding: 10px;">
            <a-list size="large" bordered :dataSource="paginationData" :locale="{ emptyText: $t('common.no.data') }">
              <a-list-item slot="renderItem" slot-scope="item, index">
                <a-list-item-meta>
                  <a @click="fileDetail(item, index)" :class="{ active: index === currentIndex }" slot="title">
                    {{ index + 1 }}. {{ item.fileName }}.{{ item.showType }}
                  </a>
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
        <a-form-item class="next-step">
          <a-button @click="prevStep" style="margin-right: 20px;">{{ $t('back.to.step1') }}</a-button>
          <a-button type="primary" style="margin-right: 20px;" @click="confirmSave()">
            {{ $t('personal.save') }}
          </a-button>
          <a-button type="primary" @click="uploadAndNextStep" style="margin-right: 20px;">
            {{ $t('step2.upload') }}
          </a-button>
          <a-button @click="nextStep">{{ $t('step2.next.step') }}</a-button>
        </a-form-item>
      </a-spin>
    </a-form>
    <a-divider />
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
    <save-modal @showResult="showResult" @handleCancelSave="handleCancelSave" :saveVisible="saveVisible" />
    <a-modal
      :title="$t('step3.save.result.title')"
      :closable="false"
      :maskClosable="false"
      :cancelText="$t('step3.modal.cancel')"
      :okText="$t('step3.modal.ok')"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p>{{ $t('step3.save.success') }}</p>
      <p>{{ $t('step3.time') }}：{{ time }}</p>
    </a-modal>
  </div>
</template>

<script>
import Pdf from '@/components/PDF/index'
import { mapState, mapActions } from 'vuex'
import { groupArray } from '@/utils/util'
import SaveModal from './components/SaveModal'
import moment from 'moment'
export default {
  name: 'Step2',
  data () {
    return {
      time: '',
      pdfShowModal: false,
      spinning: false,
      labelCol: { lg: { span: 10 }, sm: { span: 12 } },
      wrapperCol: { lg: { span: 14 }, sm: { span: 12 } },
      visible: false,
      pdfShow: false,
      imgShow: false,
      fileName: '',
      documentType: 'Other',
      form: this.$form.createForm(this),
      files: [], // 未上传，未开始校验的文件列表
      updateFileList: [], // 校验后的文件列表
      pdfUrl: '',
      imgData: '',
      isImg: false,
      active: 'active',
      currentIndex: 0,
      current: 1,
      saveBtn: false,
      saveVisible: false
    }
  },
  computed: {
    ...mapState({
      fileListIsNotOTB: state => state.create.fileListIsNotOTB,
      fileListIsOTB: state => state.create.fileListIsOTB,
      step2FileList: state => state.create.step2FileList,
      selectExporter: state => state.create.selectExporter
    }),
    group () {
      return groupArray(this.files, 10)
    },
    paginationData () {
      return this.group[this.current - 1]
    },
    totalPage () {
      return this.files.length
    }
  },
  created () {
    this.files = this.step2FileList
    this.files.length > 0 &&
      this.$nextTick(() => {
        this.form.setFieldsValue({
          fileName: this.files[0].fileName
        })
        if (this.files[0].status !== 'uploading...') {
          this.modify = true
        }
      })
  },
  components: {
    Pdf,
    SaveModal
  },
  methods: {
    ...mapActions(['uploadFile', 'errHandler', 'signShipment']),
    closePdfModal () {
      this.pdfShowModal = false
      // this.pdfShow = false
    },
    confirmSave () {
      this.saveVisible = true
    },
    showResult (result) {
      this.visible = true
      this.$forceUpdate()
      this.time = moment(result.createdAt).format('YYYY-MM-DD HH:mm')
      this.newShipmentNo = result.shipmentNo
    },
    handleOk (e) {
      console.log(e)
      this.$emit('finish')
      this.visible = false
      // this.$router.push({ name: 'dashboard' })
      this.$router.push({ name: 'ProfileBasic', query: { shipmentNo: this.newShipmentNo } })
    },
    handleCancel () {
      this.$emit('finish')
      this.visible = false
    },
    handleCancelSave () {
      this.saveVisible = false
    },
    getBigger () {
      this.pdfShowModal = true
      this.pdfShow = true
    },
    handleSelectChange (value) {
      this.documentType = value
      this.files[this.currentIndex] && this.$set(this.files[this.currentIndex], 'documentType', value)
    },
    handleInputName (e) {
      const name = e.target.value.replace('.', '')
      this.files = this.files.map((item, index) => {
        if (index === this.currentIndex) {
          item.fileName = name
        }
        return item
      })
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
    },
    isExistFile (name) {
      if (this.fileListIsNotOTB.length > 0) {
        for (let i = 0, len = this.fileListIsNotOTB.length; i < len; i++) {
          if (this.fileListIsNotOTB[i].name === name) {
            return true
          }
        }
      }
      return false
    },
    inputFileUpload () {
      // 上传文件
      this.spinning = true
      const fetchAll = []
      const uploadedFiles = this.$refs.files.files
      for (let i = 0, len = uploadedFiles.length; i < len; i++) {
        const name = uploadedFiles[i].name
        if (!this.isExistFile(name)) {
          uploadedFiles[i].documentType = this.documentType
          uploadedFiles[i].fileName = name.substr(0, name.lastIndexOf('.'))
          uploadedFiles[i].showType = name.substr(name.lastIndexOf('.') + 1, name.length)
          this.setFieldsValue(name, uploadedFiles[i].documentType)
          this.files.push(uploadedFiles[i])
        }
      }
      this.$refs.files.value = ''
      this.currentIndex = this.files.length - 1
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].status !== 'finish' && this.files[i].status !== 'fail') {
          const formData = new FormData()
          formData.append('isOTB', false)
          // formData.append('documentType', this.files[i].documentType)
          formData.append('file', this.files[i])
          fetchAll.push(
            this.uploadFile(formData)
              .then(({ data }) => {
                console.log('data', data)
                this.files[i].status = 'finish'
                this.files[i] = { ...this.files[i], ...data }
                // this.fileName = this.files[i].name
                this.$forceUpdate()
              })
              .catch(err => {
                this.$forceUpdate()
                this.files[i].status = 'fail'
                console.log('upload', err)
              })
          )
        }
      }
      Promise.all(fetchAll).finally(() => {
        if (this.$refs.files && this.$refs.files.value) {
          this.$refs.files.value = ''
        }
        this.spinning = false
        this.$forceUpdate()
      })
    },
    setFieldsValue (name, type) {
      this.form.setFieldsValue({
        fileName: name.lastIndexOf('.') > -1 ? name.substr(0, name.lastIndexOf('.')) : name,
        documentType: type
      })
    },
    fileDetail (item, index) {
      this.currentIndex = index
      this.setFieldsValue(item.fileName, item.documentType)
      if (item.type !== 'application/pdf') {
        this.$message.warn('can not support this file type')
        // this.$message.warn('暂不支持此种文件预览')
        this.pdfShow = false
        return
      }
      this.loadPreview(item, index)
    },
    loadPreview (file, index) {
      this.pdfUrl = file.key || this.files[index].key
      this.pdfShow = true
      // const reader = new FileReader()
      // reader.onload = () => {
      //   if (file.type) {
      //     if (this.isImg) {
      //       this.imgData = reader.result
      //     } else {
      //       this.pdfUrl = new Uint8Array(reader.result)
      //       this.pdfShow = true
      //     }
      //   } else {
      //     this.pdfShow = false
      //   }
      // };
      // reader.readAsArrayBuffer(file);
    },
    deleteItem (item) {
      this.$confirm({
        title: 'Delete File',
        content: `${this.$t('common.modal.content.tip')}`,
        onOk: () => {
          this.files = this.files.filter(file => file.key !== item.key)
          this.$store.commit('deleteFileIsNotOTB', item)
        },
        onCancel () {}
      })
    },
    prevStep () {
      this.$emit('prevStep')
    },
    nextStep () {
      if (this.files.length > 0) {
        this.uploadAndNextStep()
      } else {
        this.$emit('nextStep')
      }
    },
    uploadAndNextStep () {
      for (let i = 0; i < this.files.length; i++) {
        this.$store.commit('updateFileListIsNotOTB', {
          name: this.files[i].fileName + '.' + this.files[i].showType,
          fileType: this.files[i].type,
          otbVerifyTime: this.files[i].otbVerifyTime,
          // status: this.files[i].status,
          hash: this.files[i].hash,
          size: this.files[i].size,
          key: this.files[i].key,
          documentType: this.files[i].documentType
        })
      }
      if (this.fileListIsNotOTB.length === 0) {
        this.$message.info('please upload files')
        return
      }
      const {
        form: { validateFields }
      } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          // 把需要渲染的数据存入vuex
          this.$store.commit('step2FileList', this.files)
          this.$emit('nextStep')
        }
      })
    }
  }
}
</script>

<style lang="less">
.step2 {
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
