<template>
  <a-layout class="basic-index">
    <a-layout-header style="background:#fff;height:auto;padding:0 0px;position:fixed;z-index:1;width:96.44%;">
      <div style="padding:0 24px;">
        <a-row>
          <a-col :sm="{ span: 12 }" :lg="{ span: 12 }">
            <h2 class="h2">
              <span>{{ this.info.shipmentCustomsNo ? $t('Index.declaration') : $t('Index.shipmentNo') }}</span>
              <span style="font-size:20px">{{
                this.info.shipmentCustomsNo ? this.info.shipmentCustomsNo : this.info.shipmentNo
              }}</span>
            </h2>
          </a-col>
          <a-col :sm="{ span: 12 }" :lg="{ span: 12 }" style="text-align:right;">
            <template>
              <h2 class="h2">
                <span>{{ $t('Index.status') }}</span>
                <span
                  v-for="item in statusColor"
                  v-show="item.status === info.status"
                  :style="{ color: item.status === info.status ? item.color : '' }"
                  :key="item.status"
                >{{ $t('shipment.status')[item.status] }}</span
                >
              </h2>
            </template>
          </a-col>
        </a-row>
        <shipment-update :roles="roles" :number="number" :no="info.shipmentCustomsNo" :shipmentno="shipmentNo" />
      </div>
    </a-layout-header>
    <a-layout-content style="background:#fff;padding:20px 0px;">
      <div>
        <shipment-partner :info="info"></shipment-partner>
        <template>
          <div style="padding:0 24px;">
            <h3>{{ $t('Index.shipment.document.journey') }}</h3>
            <a-steps :current="number">
              <a-step>
                <!-- <span slot="title">Finished</span> -->
                <template slot="title">{{ $t('Index.importers') }}</template>
                <span slot="description"></span>
              </a-step>
              <a-step :title="$t('Index.Customs.broker')" description />
              <a-step :title="$t('Index.customs')" description />
              <a-step :title="$t('Index.completed')" description />
            </a-steps>
          </div>
        </template>
        <a-divider style="margin-bottom: 0px" />
      </div>
      <a-modal
        :title="$t('list.return.reason')"
        v-model="showReturnModal"
        :confirmLoading="confirmLoading"
        :footer="null"
      >
        <p style="color: #c00606; margin: 50px 0;" align="center">{{ $t('list.modal.description4') }}</p>
        <p>{{ $t('list.return.comments') }}</p>
        <p>
          <a-input v-model="returnContent" :placeholder="$t('list.return.message')" />
        </p>
        <div align="center">
          <a-button @click="openReturnConfirmModal">{{ $t('list.modal.confirm') }}</a-button>
          <a-button @click="openHandleCancel" type="primary" style="margin-left: 80px">
            {{ $t('list.modal.cancel') }}
          </a-button>
        </div>
      </a-modal>

      <a-modal
        :title="$t('Index.action.comfirmation')"
        v-model="confirmModal"
        :confirmLoading="confirmLoading"
        :footer="null"
      >
        <p style="text-align:center;">
          <img src="@/assets/shipmentbg/picture-book-star.png" />
        </p>
        <p style="color: #c00606; margin: 50px 0;" align="center">{{ $t('Index.confirm.tip.information') }}</p>
        <div align="center">
          <a-button @click="confirmReturn">{{ $t('list.modal.confirm') }}</a-button>
          <a-button @click="confirmCancel" type="primary" style="margin-left: 80px">
            {{ $t('list.modal.cancel') }}
          </a-button>
        </div>
      </a-modal>

      <a-modal
        :title="$t('Index.action.comfirmation')"
        v-model="withdrawModal"
        :confirmLoading="confirmLoading"
        :footer="null"
      >
        <p style="text-align:center;">
          <img src="@/assets/shipmentbg/picture-book-star.png" />
        </p>
        <p style="color: #c00606; margin: 50px 0;" align="center">{{ $t('Index.withdrawn.tip.information') }}</p>
        <div align="center">
          <a-button @click="withdrawOk">{{ $t('list.modal.confirm') }}</a-button>
          <a-button @click="withdrawCancel" type="primary" style="margin-left: 80px">
            {{ $t('list.modal.cancel') }}
          </a-button>
        </div>
      </a-modal>
      <a-modal
        :title="$t('Index.action.comfirmation')"
        v-model="deleteModal"
        :confirmLoading="confirmLoading"
        :footer="null"
      >
        <p style="text-align:center;">
          <img src="@/assets/shipmentbg/picture-book-star.png" />
        </p>
        <p style="color: #c00606; margin: 50px 0;" align="center">{{ $t('Index.delete.tip.information') }}</p>
        <div align="center">
          <a-button @click="deleteOk">{{ $t('list.modal.confirm') }}</a-button>
          <a-button @click="deleteCancel" type="primary" style="margin-left: 80px">
            {{ $t('list.modal.cancel') }}
          </a-button>
        </div>
      </a-modal>
      <a-modal
        :title="$t('Index.action.comfirmation')"
        v-model="undoModal"
        :confirmLoading="confirmLoading"
        :footer="null"
      >
        <p style="text-align:center;">
          <img src="@/assets/shipmentbg/picture-book-star.png" />
        </p>
        <p v-if="roles.name === 'CUSTOMS' && number === 3" style="color: #c00606; margin: 50px 0;" align="center">
          {{ $t('Index.customs.undo.review') }}
        </p>
        <p v-if="roles.name === 'CUSTOMS' && number === 0" style="color: #c00606; margin: 50px 0;" align="center">
          {{ $t('Index.customs.undo.return') }}
        </p>
        <div align="center">
          <a-button @click="undoOk">{{ $t('list.modal.confirm') }}</a-button>
          <a-button @click="undoCancel" type="primary" style="margin-left: 80px">
            {{ $t('list.modal.cancel') }}
          </a-button>
        </div>
      </a-modal>
      <a-modal
        :title="$t('Index.action.comfirmation')"
        v-model="approveModal"
        :confirmLoading="confirmLoading"
        :footer="null"
      >
        <p style="text-align:center;">
          <img src="@/assets/shipmentbg/picture-book-star.png" />
        </p>
        <p v-if="roles.name === 'IMPORTER'" style="color: #c00606; margin: 50px 0;" align="center">
          {{ $t('Index.to.cb.tip.information') }}
        </p>
        <p v-if="roles.name === 'CUSTOMS_BROKER'" style="color: #c00606; margin: 50px 0;" align="center">
          {{ $t('Index.to.c.tip.information') }}
        </p>
        <p v-if="roles.name === 'CUSTOMS'" style="color: #c00606; margin: 50px 0;" align="center">
          {{ $t('Index.customs.tip.review.complete') }}
        </p>
        <div align="center">
          <a-button @click="approveOk">{{ $t('list.modal.confirm') }}</a-button>
          <a-button @click="approveCancel" type="primary" style="margin-left: 80px">
            {{ $t('list.modal.cancel') }}
          </a-button>
        </div>
      </a-modal>
      <a-row style="padding:0 24px">
        <a-col :lg="24" :xl="24">
          <div>
            <div class="title">
              <span style="min-width:200px">{{ $t('Index.shipment.file') }}</span>
            </div>
            <file-list
              :list="fileList"
              :number="number"
              :importer="info.importer && info.importer.companyName"
              @openPdfModal="openPdfModal"
              @closePdfModal="closePdfModal"
              @getDetailInfo="getDetailInfo"
              @printPdf="printPdf"
            ></file-list>
          </div>
          <template>
            <div style="text-align:center;">
              <div style="margin-right: 4px;">
                <a-select v-model="company" v-if="userListSelectBtn" style="width:150px;margin-right:10px;">
                  <a-select-option v-for="item in companyList" :value="item.companyId" :key="item.companyId">
                    {{ item.companyName }}
                  </a-select-option>
                </a-select>
                <a-button
                  v-if="approveBtn"
                  :style="{ borderColor: info.status === 'IN_REVIEW' ? '#68b310' : '' }"
                  @click="operationBehavior('approve')"
                >
                  <i
                    style="color:#68b310"
                    v-show="roles.name === 'IMPORTER' || roles.name === 'CUSTOMS_BROKER'"
                    class="demo-icon"
                  >&#xe808;</i
                  >
                  <i style="color:#68b310" v-if="roles.name === 'CUSTOMS'" class="demo-icon">&#xe801;</i>
                  {{ $t(approveBtnText) }}
                </a-button>
                <a-button
                  v-if="undoBtn"
                  class="hoverorange"
                  style="border-color:#f5a623;margin-left: 5px;"
                  @click="importerUndo()"
                >
                  <i style="color:#f5a623" class="demo-icon">&#xe804;</i>
                  {{ $t('list.in.undo.reviewed') }}
                </a-button>
                <a-button
                  v-if="undoReturnBtn"
                  class="hoverorange"
                  style="border-color:#f5a623;margin-left: 5px;"
                  @click="importerUndo()"
                >
                  <i style="color:#f5a623" class="demo-icon">&#xe804;</i>
                  {{ $t('list.in.undo.returned') }}
                </a-button>
                <!-- <a-button style="margin-left: 5px;" v-if="doneBtn" @click="importerDone()">Done</a-button> -->
                <a-button
                  class="hoverred"
                  v-if="returnBtn"
                  style="border-color:#d0021b;margin-left: 5px;"
                  @click="openReturn()"
                >
                  <i style="color:#d0021b" class="demo-icon">&#xe804;</i>
                  {{ $t('Index.return.to.importer') }}
                </a-button>
                <a-button v-if="withdrawBtn" style="border-color:#f5a623;margin-left: 5px;" @click="importerWithdraw()">
                  <i style="color:#f5a623" class="demo-icon">&#xe80c;</i>
                  {{ $t('Index.withdraw') }}
                </a-button>
                <span style="display:inline-block;margin: 0px 10px;">
                  <upload-modal
                    v-if="(roles.name === 'IMPORTER' || roles.name === 'EXPORTER') && (number === 0 || number === 1)"
                    @reLoadInfo="reLoadInfo"
                  ></upload-modal>
                </span>
                <a-button v-if="delBtn" class="hoverred1" @click="importerDelete()">
                  <i style="color:#d0021b" class="demo-icon">&#xe80b;</i>
                  {{ $t('Index.delete') }} Shipment
                </a-button>
                <a-button @click="gotoList()">
                  <i style="color:#68b310" class="demo-icon">&#xe803;</i>
                  {{ $t('Index.home') }}
                </a-button>
              </div>
            </div>
          </template>
        </a-col>
      </a-row>
      <a-divider style="margin: 10px 0px" />
      <a-row style="padding:0 24px">
        <a-col :lg="24" :xl="24">
          <div class="title" style="padding-top:10px;">{{ $t('Index.history.record') }}</div>
          <template>
            <a-row>
              <a-col :xs="0" :sm="2" :md="5" :lg="6" :xl="7"></a-col>
              <a-col :xs="24" :sm="20" :md="15" :lg="12" :xl="10">
                <a-timeline pending=" " mode="left">
                  <a-timeline-item v-for="item in history" :key="item.id">
                    <time-line-dot-icon :style="{ fontSize: '20px' }" slot="dot" />
                    <div :class="showWhatStyle(item.action)">
                      <p>{{ item.createdAt }}</p>
                      <p>{{ item.name }}&nbsp;&nbsp;{{ item.actionContent }}</p>
                    </div>
                  </a-timeline-item>
                  <time-line-end-dot-icon :style="{ fontSize: '20px' }" slot="pendingDot" />
                </a-timeline>
              </a-col>
              <a-col :xs="0" :sm="2" :md="4" :lg="6" :xl="7"></a-col>
            </a-row>
          </template>
          <div v-show="pdfShowModal" class="pdf-modal">
            <div class="icon-list">
              <a-icon class="icon-icon" @click="closePdfModal()" type="close" />
              <a-icon class="icon-icon" @click="downLoadPdf()" type="cloud-download" />
              <a-icon class="icon-icon" @click="printPdf()" type="printer" />
            </div>
            <div class="pdf-modal-content">
              <Pdf
                :fileSize="fileSize"
                :fileHash="fileHash"
                :isLeft="true"
                :fullHeight="true"
                v-if="pdfShow"
                :border="false"
                :source="pdfUrl"
                type="detail"
                @handleError="handleError"
              />
            </div>
          </div>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { STable } from '@/components'
import { PageView } from '@/layouts'
// import DetailList from '@/components/tools/DetailList'
import { getUrlParameters, getAction } from '@/utils/util'
import Pdf from '@/components/PDF/index'
import printJS from 'print-js'
import fileList from './components/FileList'
import {
  getShipmentInfo,
  shipmentUndo,
  shipmentReturn,
  shipmentApprove,
  shipmentWithdraw,
  shipmentDelete
} from '@/api/manage'
import { getRole } from '@/api/document'
import UploadModal from './components/UploadModal'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import { TimeLineDotIcon, TimeLineEndDotIcon } from '@/core/icons'
import ShipmentUpdate from './components/ShipmentNoUpdate'
import ShipmentPartner from './components/ShipmentPartner'
// import TimeLine from './components/TimeLine'

// const DetailListItem = DetailList.Item

export default {
  components: {
    // DetailList,
    // DetailListItem,
    STable,
    PageView,
    Pdf,
    UploadModal,
    TimeLineDotIcon,
    TimeLineEndDotIcon,
    fileList,
    ShipmentUpdate,
    ShipmentPartner
  },
  data () {
    return {
      returnContent: '',
      confirmLoading: false,
      withdrawModal: false,
      deleteModal: false,
      undoModal: false,
      approveModal: false,
      pdfShowModal: false,
      showReturnModal: false,
      confirmModal: false,
      returnType: '',
      queryParam: {},
      customsBrokerNo: '',
      pdfShow: false,
      pdfUrl: '',
      shipmentNo: '',
      company: '',
      companyList: [],
      number: 0,
      nextLevelCompanyId: null,
      form: this.$form.createForm(this),
      record: {},
      info: {
        documents: [],
        users: [],
        companies: []
      },
      fileName: '',
      historyColumns: [
        {
          title: 'User',
          dataIndex: 'userId',
          key: 'userId'
        },
        {
          title: 'Activity',
          dataIndex: 'action',
          key: 'action'
        },
        {
          title: 'Upload Time',
          dataIndex: 'createdAt',
          key: 'createdAt'
        }
      ],
      commentColumns: [
        {
          title: 'userId',
          dataIndex: 'userId',
          key: 'userId'
        },
        {
          title: 'username',
          dataIndex: 'user.name',
          key: 'user.name'
        },
        {
          title: 'content',
          dataIndex: 'content',
          key: 'content'
        },
        {
          title: 'addtime',
          dataIndex: 'createdAt',
          key: 'createdAt'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      fileList: [],
      fileSize: 0,
      historyList: [],
      // commentsList: [],
      statusColor: [
        {
          status: 'PREPARING',
          color: '#5d81db'
        },
        {
          status: 'IN_CB',
          color: '#5d81db'
        },
        {
          status: 'IN_REVIEW',
          color: '#5d81db'
        },
        {
          status: 'REVIEWED',
          color: '#68b310'
        },
        {
          status: 'RETURN',
          color: '#f4092c'
        },
        {
          status: 'WITHDRAWN',
          color: '#f5a623'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      roles: state => state.user.roles,
      userInfo: state => state.user.info,
      lang: state => state.i18n.lang
    }),
    userListSelectBtn () {
      return this.approveBtn && this.number === 0 && this.roles.name === 'IMPORTER'
    },
    title () {
      return this.$route.meta.title
    },
    withdrawBtn () {
      console.log('this.number=====' + this.number)
      return (
        (this.roles.name === 'IMPORTER' && this.number === 2) ||
        (this.roles.name === 'IMPORTER' && this.number === 0 && this.info.status === 'RETURN') ||
        (this.roles.name === 'CUSTOMS_BROKER' && this.number === 2) ||
        (this.roles.name === 'CUSTOMS_BROKER' &&
          this.number === 0 &&
          (this.info.status !== 'WITHDRAWN' && this.info.status !== 'PREPARING'))
      )
    },
    undoBtn () {
      return this.roles.name === 'CUSTOMS' && this.info.status === 'REVIEWED'
    },
    delBtn () {
      return (
        this.roles.name === 'IMPORTER' &&
        (this.info.status === 'PREPARING' || this.info.status === 'WITHDRAWN' || this.info.status === 'IN_CB')
      )
    },
    undoReturnBtn () {
      return this.roles.name === 'CUSTOMS' && this.info.status === 'RETURN'
    },
    returnBtn () {
      return (
        (this.roles.name === 'CUSTOMS' && this.number === 2) ||
        (this.roles.name === 'CUSTOMS_BROKER' && this.info.status === 'IN_CB')
      )
    },
    isCustomsLevel () {
      return this.info.currentLevel === 'CUSTOMS'
    },
    approveBtnText () {
      const name = this.roles.name
      let str = ''
      if (name === 'IMPORTER' && this.number === 0) {
        str = 'Index.transmitToCB'
      } else if (
        (name === 'CUSTOMS_BROKER' && this.number === 1) ||
        (name === 'CUSTOMS_BROKER' && this.number === 0 && this.info.status === 'WITHDRAWN')
      ) {
        str = 'Index.submit'
      } else if (name === 'CUSTOMS' && this.number === 2) {
        str = 'Index.ok'
      }
      return str
    },
    approveBtn () {
      const name = this.roles.name
      return (
        (name === 'IMPORTER' && this.number === 0) ||
        (name === 'CUSTOMS_BROKER' && this.number === 1) ||
        (name === 'CUSTOMS_BROKER' && this.number === 0 && this.info.status === 'WITHDRAWN') ||
        (name === 'CUSTOMS' && this.number === 2)
      )
    },
    history () {
      return this.historyList.map(item => {
        let companyName = ''
        if (item.role !== 'CUSTOMS') {
          companyName = item.company.companyName + '(' + this.$t('entityRoles')[item.role] + ')'
        } else {
          companyName = 'Customs(' + this.$t('entityRoles')[item.role] + ') ' + item.user.employeeId
        }
        item.name = companyName
        let actionCode = item.action.split(':')[0]
        actionCode =
          actionCode === 'CREATE_SHIPMENT' && item.role === 'IMPORTER' ? 'CREATE_SHIPMENT_BY_IMPORTER' : actionCode
        item.actionContent =
          this.$t('shipmentHistory.actions')[actionCode] +
          (item.action.split(':')[1] ? '[' + item.action.split(':')[1] + ']' : '')
        return item
      })
    }
  },
  created () {
    this.getDetailInfo()
    // 监听键盘按键事件
    window.document.onkeypress = function (event) {
      const code = event.keyCode ? event.keyCode : event.which
      // console.log(code)
      if (code === 27) {
        this.closePdfModal()
      }
    }
  },
  watch: {
    lang: {
      handler () {
        this.getDetailInfo()
      }
    }
  },
  methods: {
    ...mapActions(['errHandler']),
    closePdfModal () {
      this.pdfShowModal = false
      this.pdfShow = false
    },
    printPdf (item) {
      const fileKey = item ? item.fileKey : this.pdfUrl
      const baseUrl = process.env.VUE_APP_API_BASE_URL
      const token = this.token.replace('JWT ', '')
      const url = `${baseUrl}/document/preview?fileKey=${fileKey}&accessToken=${token}&isCreated=true`
      printJS({ printable: url, type: 'pdf', showModal: true })
    },
    // 获取数据
    getDetailInfo () {
      this.shipmentNo = getUrlParameters('shipmentNo').toString()
      // 获取详情
      getShipmentInfo(this.shipmentNo)
        .then(res => {
          this.historyList = res.data.shipmentHistories.map(item => {
            item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
            return item
          })
          // this.commentsList = res.data.comments.map(item => {
          //   item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
          //   return item
          // })
          this.info = res.data
          this.info.createdAt = moment(this.info.createdAt).format('YYYY-MM-DD HH:mm:ss')
          this.info.submitedAt = moment(this.info.submitedAt).format('YYYY-MM-DD HH:mm:ss')
          this.currentLevel = res.data.currentLevel
          console.log('this.currentLevel====' + this.currentLevel)
          if (this.currentLevel === 'CUSTOMS_BROKER') {
            this.number = 1
            this.getCompanyList('CUSTOMS')
          } else if (this.currentLevel === 'CUSTOMS' && this.info.status === 'IN_REVIEW') {
            this.number = 2
          } else if (
            this.currentLevel === 'CUSTOMS' &&
            (this.info.status === 'REVIEWED' || this.info.status === 'OK')
          ) {
            this.number = 3
          } else if (
            this.roles.name === 'CUSTOMS_BROKER' &&
            this.currentLevel === 'IMPORTER' &&
            this.info.status === 'WITHDRAWN' &&
            this.info.customsBrokerNo !== null
          ) {
            this.getCompanyList('CUSTOMS')
            this.number = 0
          } else {
            this.getCompanyList('CUSTOMS_BROKER')
            this.number = 0
          }
          this.fileList = res.data.documents.map(item => {
            item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
            // item.name = res.data.importer.name
            item.importerName = this.info.importer.companyName
            if (this.lang === 'zh-TW') {
              const mapType = {
                Invoice: '發票',
                INVOICE: '發票',
                Other: '其他',
                'C/O': '原產地證明',
                PackingList: '裝箱單'
              }

              item.documentType = mapType[item.documentType] || item.documentType
            }
            return item
          })
        })
        .catch(err => {
          console.error('shipment info error', err)
          if (err.data.code === '21405' || err.data.code === '214030' || err.data.code === '214031') {
            this.$router.push({ name: 'dashboard' })
          }
          this.errHandler(err)
        })
    },
    openHandleCancel () {
      this.showReturnModal = false
    },
    confirmCancel () {
      this.confirmModal = false
    },
    withdrawCancel () {
      this.withdrawModal = false
    },
    deleteCancel () {
      this.deleteModal = false
    },
    undoCancel () {
      this.undoModal = false
    },
    approveCancel () {
      this.approveModal = false
    },
    getCompanyList (type) {
      // console.log('role type=' + type)
      getRole({ type })
        .then(({ data }) => {
          // this.companyList = data
          this.companyList = this.$systemData().filterEntities(this.userInfo, 'CUSTOMS_BROKER', data)
          this.company = this.companyList[0].companyId
          // console.log('role company=' + this.company)
        })
        .catch(err => {
          console.log(err)
        })
    },
    async signShipment (type) {
      const action = getAction(type)
      const t = Date.now()
      console.log('signDocumentListSpecifyAction...')
      this.$store.commit('setWeb3Loading', true) // 上链开始
      await this.$store
        .dispatch('signDocumentListSpecifyAction', {
          documents: this.info.documents,
          action: action,
          t: t
        })
        .then(async res => {
          console.log('resSignDocumentList.result:', res)
          const resSignShipment = await this.$store.dispatch('signShipment', {
            shipmentNo: this.shipmentNo,
            action: action,
            t: t
          })
          console.log('resSignShipment.transactionHash:', resSignShipment.transactionHash)
          this.$store.commit('setWeb3Loading', false) // 上链结束
        })
        .catch(res => {
          console.log('resSignDocumentList.error:', res)
          this.$store.commit('setWeb3Loading', false) // 上链结束
        })
    },
    operationBehavior (type, message) {
      this.$store
        .dispatch('handleWeb3Decrypt')
        .then(() => {
          if (type === 'approve') {
            this.approveModal = true
            // this.postOperationBehavior(type, message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    approveOk () {
      this.confirmLoading = true
      this.postOperationBehavior('approve')
    },
    postOperationBehavior (type, message) {
      const options = {
        shipmentNo: this.shipmentNo
      }
      if (type === 'approve') {
        options.nextLevelCompanyId = this.number > 0 ? null : this.company
        shipmentApprove(options)
          .then(res => {
            if (this.roles.name === 'IMPORTER') {
              this.$message.info(this.$t('button.ImporterTransmittedTip'))
            }
            if (this.roles.name === 'CUSTOMS_BORKER') {
              this.$message.info(this.$t('button.CbTransmittedTip'))
            }
            if (this.roles.name === 'CUSTOMS') {
              this.$message.info(this.$t('button.CustomsTransmittedTip'))
            }
            this.getDetailInfo()
            let actions = ''
            if (this.roles.name === 'IMPORTER') {
              actions = 'transmit_to_cb'
            } else if (this.roles.name === 'CUSTOMS_BROKER') {
              actions = 'submit'
            } else {
              actions = 'review_complete'
            }
            this.signShipment(actions)
          })
          .catch(err => {
            this.errHandler(err)
          })
          .finally(() => {
            this.approveModal = false
            this.confirmLoading = false
          })
      } else {
        // options.message = message
        // shipmentReject(options)
        //   .then(res => {
        //     this.$message.info('Reject success')
        //     this.getDetailInfo()
        //     this.signShipment('reject')
        //   })
        //   .catch(err => {
        //     this.errHandler(err)
        //   })
        //   .finally(() => {
        //     this.rejectMessage = ''
        //     this.confirmLoading = false
        //   })
      }
    },
    // 查看pdf文件
    openPdfModal (record) {
      this.$store
        .dispatch('handleWeb3Decrypt')
        .then(() => {
          this.record = record
          this.pdfShowModal = true
          this.pdfUrl = record.fileKey
          this.fileHash = record.fileHash
          this.fileSize = record.fileSize
          this.fileName = record.documentName
          this.pdfShow = true
        })
        .catch(err => {
          if (err) {
          }
        })
    },
    openReturnConfirmModal () {
      this.returnType = 'return'
      this.openConfirmModal()
    },
    openConfirmModal (e) {
      console.log('openConfirmModal====' + JSON.stringify(e))
      // return ;
      this.confirmModal = true
    },
    confirmReturn () {
      if (this.returnType === 'return') {
        this.returnOk()
        this.confirmModal = false
      }
    },
    openReturn () {
      this.$store
        .dispatch('handleWeb3Decrypt')
        .then(() => {
          this.showReturnModal = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    returnOk () {
      this.confirmLoading = true
      this.importerReturn()
    },
    showWhatStyle (action) {
      if (action.indexOf('REJECT_SHIPMENT:') === 0 || action.indexOf('RETURN_SHIPMENT:') === 0) {
        return 'timeline-box-danger'
      } else if (action === 'WITHDRAW_SHIPMENT') {
        return 'timeline-box-warn'
      } else if (action === 'WITHDRAW_SHIPMENT') {
        return 'timeline-box-warn'
      } else {
        return 'timeline-box'
      }
    },
    importerUndo () {
      this.$store
        .dispatch('handleWeb3Decrypt')
        .then(() => {
          this.undoModal = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    undoOk () {
      this.confirmLoading = true
      shipmentUndo({ shipmentNo: this.shipmentNo })
        .then(res => {
          if (this.roles.name === 'CUSTOMS' && this.info.status === 'REVIEWED') {
            this.$message.info(this.$t('button.CustomsUndoOKTip'))
          }
          if (this.roles.name === 'CUSTOMS' && this.info.status === 'RETURN') {
            this.$message.info(this.$t('button.CustomsUndoTip'))
          }
          this.getDetailInfo()
          this.signShipment('undo_review')
        })
        .catch(err => {
          this.errHandler(err)
        })
        .finally(() => {
          this.undoModal = false
          this.confirmLoading = false
        })
    },
    importerReturn () {
      shipmentReturn({ shipmentNo: this.shipmentNo, content: this.returnContent })
        .then(res => {
          if (this.roles.name === 'CUSTOMS_BORKER') {
            this.$message.info(this.$t('button.CbReturnTip'))
          }
          if (this.roles.name === 'CUSTOMS') {
            this.$message.info(this.$t('button.CustomsReturnTip'))
          }
          this.getDetailInfo()
          this.signShipment('return')
        })
        .catch(err => {
          this.errHandler(err)
        })
        .finally(() => {
          this.returnContent = ''
          this.showReturnModal = false
          this.confirmLoading = false
        })
    },
    importerWithdraw () {
      this.$store
        .dispatch('handleWeb3Decrypt')
        .then(() => {
          this.withdrawModal = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    withdrawOk () {
      this.confirmLoading = true
      shipmentWithdraw({ shipmentNo: this.shipmentNo })
        .then(res => {
          if (this.roles.name === 'CUSTOMS' && this.info.status === 'REVIEWED') {
            this.$message.info(this.$t('button.ImporterWithdrawndTip'))
          }
          if (this.roles.name === 'CUSTOMS_BORKER') {
            this.$message.info(this.$t('button.CbWithdrawnTip'))
          }
          this.getDetailInfo()
          this.signShipment('withdraw')
        })
        .catch(err => {
          this.errHandler(err)
        })
        .finally(() => {
          this.withdrawModal = false
          this.confirmLoading = false
        })
    },
    importerDelete () {
      this.$store
        .dispatch('handleWeb3Decrypt')
        .then(() => {
          this.deleteModal = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteOk () {
      this.confirmLoading = true
      shipmentDelete({ shipmentNo: this.shipmentNo })
        .then(res => {
          this.$message.info(this.$t('button.ImporterDeleteTip'))
          this.$router.push({ name: 'dashboard' })
          // this.getDetailInfo()
          // this.signShipment('withdraw')
        })
        .catch(err => {
          this.errHandler(err)
        })
        .finally(() => {
          this.deleteModal = false
          this.confirmLoading = false
        })
    },
    gotoList () {
      this.$router.push({ name: 'index' })
    },
    reLoadInfo (fileHash) {
      this.getDetailInfo()
    },
    handleError (err) {
      this.errHandler(err)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.pdfShow = false
        this.pdfShowModal = false
      }, 1000)
    },
    downLoadPdf () {
      this.downItem(this.record)
    },
    downItem (record) {
      const baseUrl = process.env.VUE_APP_API_BASE_URL
      const token = this.token.replace('JWT ', '')
      window.open(`${baseUrl}/document/download?fileKey=${record.fileKey}&accessToken=${token}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/css/detail.less';
.timeline-box {
  width: inherit;
}
.timeline-box-warn {
  width: inherit;
}
.timeline-box-danger {
  width: inherit;
}
.timeline-box-warn p {
  margin-top: 0;
  margin-bottom: 0.2em;
}
.timeline-box-danger p {
  margin-top: 0;
  margin-bottom: 0.2em;
}
</style>
