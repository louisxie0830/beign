<template>
  <a-card :bordered="false">
    <p class="title">{{ roles.name !== 'IMPORTER' ? 'TO-DO' : '' }} {{ $t('list.head.title') }}</p>
    <a-row class="name-time" align="middle">
      <a-col :span="12" align="left">
        <p v-if="roles.name === 'CUSTOMS'">
          {{ $t('list.customs.office') }}: {{ info.region && regionsLangMap[info.region] }}
        </p>
        <p v-if="roles.name === 'CUSTOMS'">{{ $t('list.office.id') }}: {{ info.employeeId }}</p>
        <p v-if="roles.name === 'CUSTOMS'">{{ $t('list.customs.id') }}: {{ info.region }}</p>
        <p v-if="roles.name !== 'CUSTOMS'">{{ $t('list.head.info') }}: {{ info.name }}</p>
      </a-col>
      <a-col :span="12" align="right" :style="{ marginTop: roles.name === 'CUSTOMS' ? '21px' : '0' }">
        <Time />
      </a-col>
    </a-row>
    <div class="table-page-search-wrapper">
      <a-row style="margin-bottom: 30px;">
        <a-menu mode="horizontal" v-if="roles.name === 'IMPORTER'" v-model="current">
          <a-menu-item key="PREPARING">
            <a-icon type="profile" />
            {{ $t('list.type.prepare') }}
          </a-menu-item>
          <a-menu-item key="IN_CB">
            <a-icon type="clock-circle" />
            {{ $t('list.type.InCB') }}
          </a-menu-item>
          <a-menu-item key="IN_REVIEW">
            <a-icon type="eye" />
            {{ $t('list.type.InReview') }}
          </a-menu-item>
          <a-menu-item key="REVIEWED">
            <a-icon type="check" />
            {{ $t('list.type.Completed') }}
          </a-menu-item>
          <a-menu-item key="RETURN">
            <a-icon type="redo" />
            {{ $t('list.type.Return') }}
          </a-menu-item>
          <a-menu-item key="WITHDRAWN">
            <a-icon type="eye-invisible" />
            {{ $t('list.type.withdrawn') }}
          </a-menu-item>
          <a-menu-item key>
            <a-icon type="hdd" />
            {{ $t('list.type.all') }}
          </a-menu-item>
        </a-menu>
        <a-menu mode="horizontal" v-if="roles.name === 'CUSTOMS_BROKER'" v-model="current">
          <a-menu-item key="IN_CB">
            <a-icon type="clock-circle" />
            TO-DO({{ $t('list.type.InCB') }})
          </a-menu-item>
          <a-menu-item key="PREPARING">
            <a-icon type="profile" />
            {{ $t('list.type.prepare') }}
          </a-menu-item>
          <a-menu-item key="IN_REVIEW">
            <a-icon type="eye" />
            {{ $t('list.type.InReview') }}
          </a-menu-item>
          <a-menu-item key="REVIEWED">
            <a-icon type="check" />
            {{ $t('list.type.Completed') }}
          </a-menu-item>
          <a-menu-item key="RETURN">
            <a-icon type="redo" />
            {{ $t('list.type.Return') }}
          </a-menu-item>
          <a-menu-item key="WITHDRAWN">
            <a-icon type="eye-invisible" />
            {{ $t('list.type.withdrawn') }}
          </a-menu-item>
          <a-menu-item key>
            <a-icon type="hdd" />
            {{ $t('list.type.all') }}
          </a-menu-item>
        </a-menu>
        <a-menu mode="horizontal" v-if="roles.name === 'CUSTOMS'" v-model="current">
          <a-menu-item key="IN_REVIEW">
            <a-icon type="eye" />
            TO-DO({{ $t('list.type.InReview') }})
          </a-menu-item>
          <a-menu-item key="REVIEWED">
            <a-icon type="check" />
            {{ $t('list.type.Completed') }}
          </a-menu-item>
          <a-menu-item key="RETURN">
            <a-icon type="redo" />
            {{ $t('list.type.Return') }}
          </a-menu-item>
          <a-menu-item key>
            <a-icon type="hdd" />
            {{ $t('list.type.all') }}
          </a-menu-item>
        </a-menu>
      </a-row>
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="10" :sm="24">
            <a-input ref="keyword" v-model="searchTerms" :placeholder="$t('list.search.keyword')" />
          </a-col>
          <a-col :md="4" :sm="12">
            <span class="table-page-search-submitButtons">
              <a-button @click="searchData()">
                <a-icon type="search" />
                {{ $t('list.research.query') }}
              </a-button>
              <a-button style="margin-left:10px;background:#2f54eb;color:#fff" @click="reset()">{{
                $t('list.research.reset')
              }}</a-button>
            </span>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item>
              <a-button type="primary" v-if="roles.name === 'IMPORTER'" @click="createShipment()">{{
                $t('list.create')
              }}</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- <div class="table-oper">
      <span class="menu-btn">
        <i class="icon-menu"></i>
        <div class="menu-wrapper">
          <template v-for="(column, index) in customColumns">
            <vxe-checkbox
              v-if="column.property"
              class="checkbox-item"
              v-model="column.visible"
              :key="index"
              @change="$refs.xTable.refreshColumn()"
            >{{ column.title }}</vxe-checkbox
            >
          </template>
        </div>
      </span>
    </div> -->
    <a-spin tip="Loading..." size="large" :spinning="loading">
      <vxe-grid
        class="sortable-column-demo"
        column-key
        resizable
        border
        :data="paginationData"
        ref="xTable"
        :customs.sync="customColumns"
        :columns.sync="getTableColumns"
        @select-change="selectChangeEvent"
        :toolbar="toolbar"
        :sort-config="{ trigger: 'cell' }"
        @sort-change="sortChangeEvent"
        @select-all="selectAllEvent"
      ></vxe-grid>
    </a-spin>
    <vxe-pager
      :page-sizes="[1, 10, 25, 50]"
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :total="tablePage.total"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'Sizes']"
      @page-change="handlePageChange"
    ></vxe-pager>

    <div align="center" class="operation-icon" v-show="updateRecords.length > 0 && btnList.length > 0">
      <a-button
        :class="{ 'btn-last': index === 1 }"
        :style="{ borderColor: item.color }"
        v-for="(item, index) in btnList"
        :key="index"
        @click="operationShipment(item.operation, index)"
      >
        <i :style="{ color: item.color }" v-show="item.icon === '&#xe808;'" class="demo-icon">&#xe808;</i>
        <i :style="{ color: item.color }" v-show="item.icon === '&#xe80c;'" class="demo-icon">&#xe80c;</i>
        <i :style="{ color: item.color }" v-show="item.icon === '&#xe801;'" class="demo-icon">&#xe801;</i>
        <i :style="{ color: item.color }" v-show="item.icon === '&#xe807;'" class="demo-icon">&#xe807;</i>
        <i :style="{ color: item.color }" v-show="item.icon === '&#xe804;'" class="demo-icon">&#xe804;</i>
        <i :style="{ color: item.color }" v-show="item.icon === '&#xe80b;'" class="demo-icon">&#xe80b;</i>
        {{ item.name }}
      </a-button>
    </div>
    <a-modal
      :title="
        (roles.name === 'CUSTOMS' || roles.name === 'CUSTOMS_BROKER') && currOperation === 'operationReturnToImporter'
          ? $t('list.return.reason')
          : $t('list.modal.title1')
      "
      :footer="null"
      :maskClosable="false"
      v-model="comfirmOperation"
      :width="600"
    >
      <p v-if="currOperation === 'operationReturnToImporter'" style="color: #c00606; margin: 50px 0;" align="center">
        {{ $t('list.modal.description4') }}
      </p>
      <p v-if="currOperation === 'operationReturnToImporter'">{{ $t('list.return.comments') }}</p>
      <a-input
        style="margin-bottom: 50px;"
        type="text"
        v-if="currOperation === 'operationReturnToImporter'"
        v-model="returnText"
      />
      <div align="center">
        <a-select
          v-model="company"
          v-if="currOperation === 'operationTransmitToCB'"
          style="width:150px;margin-right:10px;"
        >
          <a-select-option v-for="item in companyList" :value="item.companyId" :key="item.companyId">{{
            item.companyName
          }}</a-select-option>
        </a-select>
      </div>
      <p
        v-if="roles.name === 'CUSTOMS' && currOperation !== 'operationReturnToImporter'"
        style="text-align:center;margin:1em 0;"
      >
        <img src="@/assets/shipmentbg/picture-book-star.png" />
      </p>
      <p v-show="currOperation !== 'operationReturnToImporter'" style="color: #c00606; margin: 50px 0;" align="center">
        {{ currDescription }}
      </p>
      <div align="center">
        <a-button :loading="confirmLoading" @click="confirmOperation">{{ $t('list.modal.confirm') }}</a-button>
        <a-button @click="cancelOperation" type="primary" style="margin-left: 80px">
          {{ $t('list.modal.cancel') }}
        </a-button>
      </div>
    </a-modal>
    <a-modal
      :title="$t('list.modal.title2')"
      :maskClosable="false"
      v-model="operationStatusModal"
      @ok="operationStatusModalOK"
      @cancel="operationStatusModalOK"
    >
      <p v-for="(value, key) in shipmentStatusMap" :key="key">{{ key }} {{ value }}</p>
    </a-modal>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import { getShipmentList } from '@/api/manage'
import { mapState } from 'vuex'
import Time from './Time'
import { getRole } from '@/api/document'
import Sortable from 'sortablejs'
import zhTWLocat from 'vxe-table/lib/locale/lang/zh-TW'
import enLocat from 'vxe-table/lib/locale/lang/en'
import { VXETable } from 'vxe-table'

export default {
  name: 'Workplace',
  components: {
    STable,
    Time
  },
  data () {
    return {
      current: [''],
      loading: false,
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      toolbar: {
        id: 'shipment-list-show',
        setting: {
          trigger: 'hover',
          immediate: true,
          storage: true
        }
      },
      paginationData: [],
      customColumns: [],
      pageSize: 10,
      pageNo: 1,
      searchTerms: '',
      // 查询参数
      queryParam: {
        type: ''
      },
      company: '',
      companyList: [],
      shipmentStatus: '',
      returnText: '',
      // 表头
      columns: [],
      tableData: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const limit = parameter.pageSize
        const offset = (parameter.pageNo - 1) * limit
        const order = parameter.sortOrder === 'ascend' ? 'ASC' : 'DESC'
        const orderBy = parameter.sortField || 'createdAt'
        return getShipmentList(Object.assign({ offset, limit, order, orderBy }, this.queryParam))
          .then(res => {
            res.data.rows = res.data.rows.map(item => {
              item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
              item.submitedAt = moment(item.submitedAt).format('YYYY-MM-DD HH:mm:ss')
              item.returnedAt = item.returnedAt ? moment(item.returnedAt).format('YYYY-MM-DD HH:mm:ss') : ''
              item.finalizeAt = item.finalizeAt ? moment(item.finalizeAt).format('YYYY-MM-DD HH:mm:ss') : ''
              item.lockUntil = item.lockUntil ? moment(item.lockUntil).format('YYYY-MM-DD HH:mm:ss') : ''
              item.customsUser = item.customsUser === 'unknown' ? '' : item.customsUser
              item.submitedAt = item.submitedAt === 'Invalid date' ? '' : item.submitedAt
              return item
            })
            this.tableData = res.data
            return this.tableData
          })
          .catch(err => {
            console.log(err)
          })
      },
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false,
      comfirmOperation: false,
      confirmLoading: false,
      currOperation: '',
      shipmentNoList: [],
      shipmentCustomsNoList: [],
      operationStatusModal: false,
      shipmentStatusMap: {},
      operationSatus: {},
      currOperationIndex: 0,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      timer: null,
      signLength: 0,
      actionMap: {
        operationReviewCompleted: 'review_complete',
        operationTransmitToCB: 'transmit_to_cb',
        operationWithdraw: 'withdraw',
        operationReturnToImporter: 'return',
        operationSubmitToCustoms: 'submit',
        operationUndoReviewed: 'undo_review',
        operationUndoReturned: 'undo_return'
      },
      updateRecords: [],
      originData: []
    }
  },
  computed: {
    ...mapState({
      roles: state => state.user.roles,
      info: state => state.user.info,
      lang: state => state.i18n.lang
    }),
    btnList () {
      return (
        (this.operationSatusMap[this.roles.name] && this.operationSatusMap[this.roles.name][this.shipmentStatus]) || []
      )
    },
    currDescription () {
      return (
        (this.operationSatusMap[this.roles.name] &&
          this.operationSatusMap[this.roles.name][this.shipmentStatus] &&
          this.operationSatusMap[this.roles.name][this.shipmentStatus][this.currOperationIndex]['description']) ||
        ''
      )
    },
    regionsLangMap () {
      return {
        AA: '' + this.$t('admin.Keelung'),
        BA: '' + this.$t('admin.Kaoshiung'),
        CA: '' + this.$t('admin.Taipei'),
        DA: '' + this.$t('admin.Taichung')
      }
    },
    operationSatusMap () {
      return this.getBtnInfo
    },
    statusLangMap () {
      return {
        PREPARING: this.$t('list.status.text1'),
        IN_CB: this.$t('list.status.text2'),
        IN_REVIEW: this.$t('list.status.text3'),
        RETURN: this.$t('list.status.text4'),
        WITHDRAWN: this.$t('list.status.text5'),
        REVIEWED: this.$t('list.status.text6')
      }
    },
    getBtnInfo () {
      return {
        IMPORTER: {
          PREPARING: [
            {
              color: '#68b310',
              icon: '&#xe808;',
              operation: 'operationTransmitToCB',
              name: this.$t('transmit.to.cb'),
              description: this.$t('list.modal.description1')
            },
            {
              color: '#d0021b',
              icon: '&#xe80b;',
              operation: 'operationDelete',
              name: this.$t('Index.delete'),
              description: this.$t('list.modal.description8')
            }
          ],
          WITHDRAWN: [
            {
              color: '#68b310',
              icon: '&#xe808;',
              operation: 'operationTransmitToCB',
              name: this.$t('transmit.to.cb'),
              description: this.$t('list.modal.description1')
            },
            {
              color: '#d0021b',
              icon: '&#xe80b;',
              operation: 'operationDelete',
              name: this.$t('Index.delete'),
              description: this.$t('list.modal.description8')
            }
          ],
          IN_CB: [
            {
              color: '#d0021b',
              icon: '&#xe80b;',
              operation: 'operationDelete',
              name: this.$t('Index.delete'),
              description: this.$t('list.modal.description8')
            }
          ],
          IN_REVIEW: [
            {
              color: '#f5a623',
              icon: '&#xe80c;',
              operation: 'operationWithdraw',
              name: this.$t('Index.withdraw'),
              description: this.$t('list.modal.description2')
            }
          ],
          RETURN: [
            {
              color: '#68b310',
              icon: '&#xe808;',
              operation: 'operationTransmitToCB',
              name: this.$t('transmit.to.cb'),
              description: this.$t('list.modal.description1')
            },
            {
              color: '#f5a623',
              icon: '&#xe80c;',
              operation: 'operationWithdraw',
              name: this.$t('Index.withdraw'),
              description: this.$t('list.modal.description2')
            }
          ]
        },
        CUSTOMS_BROKER: {
          IN_CB: [
            {
              color: '#68b310',
              icon: '&#xe808;',
              operation: 'operationSubmitToCustoms',
              name: this.$t('list.operation.submitTo'),
              description: this.$t('list.modal.description3')
            },
            {
              color: '#d0021b',
              icon: '&#xe807;',
              operation: 'operationReturnToImporter',
              name: this.$t('list.operation.returnTo'),
              description: this.$t('list.modal.description4')
            }
          ],
          IN_REVIEW: [
            {
              color: '#f5a623',
              icon: '&#xe80c;',
              operation: 'operationWithdraw',
              name: this.$t('Index.withdraw'),
              description: this.$t('list.modal.description2')
            }
          ],
          RETURN: [
            {
              color: '#f5a623',
              icon: '&#xe80c;',
              operation: 'operationWithdraw',
              name: this.$t('Index.withdraw'),
              description: this.$t('list.modal.description2')
            }
          ],
          WITHDRAWN: [
            {
              color: '#68b310',
              icon: '&#xe808;',
              operation: 'operationSubmitToCustoms',
              name: this.$t('list.operation.submitTo'),
              description: this.$t('list.modal.description3')
            }
          ]
        },
        CUSTOMS: {
          IN_REVIEW: [
            {
              color: '#68b310',
              icon: '&#xe801;',
              operation: 'operationReviewCompleted',
              name: this.$t('list.customs.type.Completed'),
              description: this.$t('Index.customs.tip.review.complete')
            },
            {
              color: '#d0021b',
              icon: '&#xe807;',
              operation: 'operationReturnToImporter',
              name: this.$t('list.operation.returnTo'),
              description: this.$t('list.modal.description4')
            }
          ],
          REVIEWED: [
            {
              color: '#f5a623',
              icon: '&#xe804;',
              operation: 'operationUndoReviewed',
              name: this.$t('list.operation.undoReview'),
              description: this.$t('Index.customs.undo.review')
            }
          ],
          RETURN: [
            {
              color: '#f5a623',
              icon: '&#xe804;',
              operation: 'operationUndoReturned',
              name: this.$t('list.operation.undoReturn'),
              description: this.$t('Index.customs.undo.return')
            }
          ]
        }
      }
    },
    getTableColumns () {
      const checkBox = {
        width: 50,
        type: 'checkbox'
      }
      const cShipmentNumber = {
        title: this.$t('list.shipment.number'),
        field: 'shipmentNo',
        sortable: true,
        slots: {
          default: ({ row, column }) => {
            return [<a onClick={() => this.handleLook(row)}>{row.shipmentNo}</a>]
          }
        }
      }
      const cDeclaration = {
        title: this.$t('list.shipment.declaration'),
        field: 'shipmentCustomsNo',
        sortable: true,
        slots: {
          default: ({ row, column }) => {
            return [<a onClick={() => this.handleLook(row)}>{row.shipmentCustomsNo}</a>]
          }
        }
      }
      const cExporter = {
        title: this.$t('list.exporter'),
        sortable: true,
        field: 'exporter'
      }
      const cImporter = {
        title: this.$t('list.importer'),
        sortable: true,
        field: 'importer'
      }
      const cCustomsBroker = {
        title: this.$t('list.customsBroker'),
        sortable: true,
        field: 'customsBroker'
      }
      // const cConsignee = {
      //   title: this.$t('list.consignee'),
      //   sortable: true,
      //   field: 'consignee'
      // }
      const cSubmitedAt = {
        title: this.$t('list.shipment.submittal'),
        sortable: true,
        field: 'submitedAt'
      }
      const cReturnedAt = {
        title: this.$t('list.shipment.returntime'),
        sortable: true,
        field: 'returnedAt'
      }
      const cFinalizeAt = {
        title: this.$t('list.shipment.completetime'),
        sortable: true,
        field: 'finalizeAt'
      }
      const cCustoms = {
        title: this.$t('list.shipment.comtomsofficer'),
        sortable: true,
        field: 'customsUser'
      }
      const cStatus = {
        title: this.$t('list.shipment.status'),
        sortable: true,
        field: 'status',
        slots: {
          default: ({ row, column }) => {
            return [this.statusLangMap[row.status]]
          }
        }
      }
      const cImporterTaxId = {
        title: this.$t('list.shipment.importer.number'),
        sortable: true,
        field: 'importerTaxId'
      }
      const columns = []
      if (this.roles.name === 'IMPORTER') {
        columns.push(
          checkBox,
          cShipmentNumber,
          cDeclaration,
          cExporter,
          cImporter,
          cCustomsBroker,
          cSubmitedAt,
          cReturnedAt,
          cFinalizeAt,
          cStatus,
          cCustoms
        )
      } else if (this.roles.name === 'CUSTOMS_BROKER') {
        columns.push(
          checkBox,
          cShipmentNumber,
          cDeclaration,
          cExporter,
          cImporter,
          cSubmitedAt,
          cReturnedAt,
          cFinalizeAt,
          cStatus,
          cCustoms
        )
      } else if (this.roles.name === 'CUSTOMS') {
        columns.push(
          checkBox,
          cDeclaration,
          cExporter,
          cImporter,
          cImporterTaxId,
          cSubmitedAt,
          cFinalizeAt,
          cStatus,
          cCustoms
        )
      }
      return columns
    }
  },
  watch: {
    current: {
      handler (e) {
        if (e[0] && e[0] !== this.queryParam.type) {
          this.tablePage.currentPage = 1
        }
        this.queryParam.type = e[0]
        this.queryParam.terms = this.searchTerms
      }
    },
    queryParam: {
      handler () {
        window.scrollTo(0, 0)
        this.getInitListData()
        // this.$refs.table.refresh(true)
        // this.$refs.table.clearSelected()
      },
      deep: true
    },
    lang: {
      handler () {
        // this.operationSatus = this.getBtnInfo()
        this.listStatusMap = this.getListStatusMap()
        this.formatTableData()
        this.changeVexTableLang()
      }
    }
  },
  created () {
    this.tableOption()
    // this.operationSatus = this.getBtnInfo()
    if (this.roles.name === 'CUSTOMS') {
      this.queryParam.type = 'IN_REVIEW'
      this.current = ['IN_REVIEW']
    } else if (this.roles.name === 'CUSTOMS_BROKER') {
      this.queryParam.type = 'IN_CB'
      this.current = ['IN_CB']
    } else {
      this.queryParam.type = 'PREPARING'
      this.current = ['PREPARING']
    }
    this.getUrerList()
    this.$store.dispatch('handleWeb3Decrypt').catch(err => {
      if (err) {
      }
    })
    this.getInitListData()
    this.columnDrop()
    // this.$store.dispatch('handleWeb3Decrypt').catch(err => {})
    this.changeVexTableLang()
  },
  methods: {
    changeVexTableLang () {
      // vexTable i18n
      const showLocal = this.lang === 'zh-TW' ? zhTWLocat : enLocat
      VXETable.setup({
        i18n: (key, value) => VXETable.t(showLocal, key)
      })
    },
    columnDrop () {
      this.$nextTick(() => {
        const xTable = this.$refs.xTable
        this.sortable = Sortable.create(
          xTable.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'),
          {
            handle: '.vxe-header--column',
            onEnd: ({ item, newIndex, oldIndex }) => {
              // const currRow = this.getTableColumns.splice(oldIndex, 1)[0]
              // this.getTableColumns.splice(newIndex, 0, currRow)
              const { fullColumn, tableColumn } = xTable.getTableColumn()
              const targetThElem = item
              const wrapperElem = targetThElem.parentNode
              const newColumn = fullColumn[newIndex]
              const oldColumn = fullColumn[oldIndex]
              if (newColumn.fixed || oldColumn.fixed) {
                // 错误的移动
                if (newIndex > oldIndex) {
                  wrapperElem.insertBefore(targetThElem, wrapperElem.children[oldIndex])
                } else {
                  wrapperElem.insertBefore(wrapperElem.children[oldIndex], targetThElem)
                }
                return this.$message.warn(this.$t('list.column.drag.fixed.error'))
              }
              // 转换真实索引
              const oldColumnIndex = xTable.getColumnIndex(tableColumn[oldIndex])
              const newColumnIndex = xTable.getColumnIndex(tableColumn[newIndex])
              // 移动到目标列
              const currRow = fullColumn.splice(oldColumnIndex, 1)[0]
              fullColumn.splice(newColumnIndex, 0, currRow)
              xTable.loadColumn(fullColumn)
            }
          }
        )
      })
    },
    selectChangeEvent ({ checked, row }) {
      const updateRecords = this.$refs.xTable.getSelectRecords()
      this.updateRecords = updateRecords
      let shipmentStatus = ''
      let shipmentNoList = ''
      let shipmentCustomsNoList = ''
      const shipmentStatusMap = {}
      if (updateRecords.length === 1) {
        shipmentNoList = [
          {
            shipmentNo: updateRecords[0].shipmentNo,
            documents: updateRecords[0].documents
          }
        ]
        shipmentStatus = updateRecords[0].status
        shipmentCustomsNoList = [updateRecords[0].shipmentCustomsNo]
        shipmentStatusMap[updateRecords[0].shipmentNo] = '......'
      }
      if (updateRecords.length > 1) {
        shipmentNoList = []
        shipmentCustomsNoList = []
        shipmentStatus = updateRecords[0].status
        updateRecords.map(item => {
          shipmentNoList.push({
            shipmentNo: item.shipmentNo,
            documents: item.documents
          })
          shipmentCustomsNoList.push(item.shipmentCustomsNo)
          shipmentStatusMap[item.shipmentNo] = '......'
        })
        const list = updateRecords.filter(item => item.status !== shipmentStatus)
        shipmentStatus = list.length === 0 && shipmentStatus
      }
      this.shipmentStatus = shipmentStatus
      this.shipmentNoList = shipmentNoList
      this.shipmentCustomsNoList = shipmentCustomsNoList
      this.shipmentStatusMap = shipmentStatusMap
      console.log(updateRecords, this.btnList, shipmentCustomsNoList, shipmentNoList)
    },
    selectAllEvent ({ checked }) {
      // const updateRecords = this.$refs.xTable.getSelectRecords()
      console.log(checked ? '所有勾选事件' : '所有取消事件')
      this.selectChangeEvent({ checked })
    },
    sortChangeEvent ({ column, property, order }) {
      // console.log(column, property, order)
      const orderBy = property
      this.queryParam.orderBy = orderBy
      this.queryParam.order = order
    },
    handlePageChange ({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.getInitListData()
    },
    getInitListData () {
      this.loading = true
      const limit = this.tablePage.pageSize
      const offset = (this.tablePage.currentPage - 1) * limit
      getShipmentList(Object.assign({ offset, limit }, this.queryParam))
        .then(res => {
          this.originData = res.data
          this.formatTableData()
        })
        .finally(() => {
          this.loading = false
        })
    },
    formatTableData () {
      console.log('origin', this.originData)
      this.tablePage.total = this.originData.total
      const list = this.originData.rows.map(item => {
        item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        item.submitedAt = moment(item.submitedAt).format('YYYY-MM-DD HH:mm:ss')
        item.returnedAt = item.returnedAt ? moment(item.returnedAt).format('YYYY-MM-DD HH:mm:ss') : ''
        item.finalizeAt = item.finalizeAt ? moment(item.finalizeAt).format('YYYY-MM-DD HH:mm:ss') : ''
        item.lockUntil = item.lockUntil ? moment(item.lockUntil).format('YYYY-MM-DD HH:mm:ss') : ''
        if (
          (item.status === 'IN_REVIEW' && this.isLocked(item)) ||
          item.status === 'RETURN' ||
          item.status === 'REVIEWED'
        ) {
          item.customsUser = item.customsUser === 'unknown' ? '' : item.customsUser
        } else {
          item.customsUser = ''
        }
        item.submitedAt = item.submitedAt === 'Invalid date' ? '' : item.submitedAt
        // item.status = this.listStatusMap[item.status]
        return item
      })
      this.paginationData = list
      console.log('this.paginationData', this.paginationData)
    },
    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
            }
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },
    searchData () {
      window.scrollTo(0, 0)
      this.queryParam.terms = this.searchTerms
      this.getInitListData()
      // this.$refs.table.refresh(true)
    },
    onCellChange (key, dataIndex, value) {
      console.log('key', key, dataIndex, value)
    },
    reset () {
      window.scrollTo(0, 0)
      this.searchTerms = ''
      this.queryParam.terms = ''
      this.$refs.keyword.focus()
      this.getInitListData()
      // this.$refs.table.refresh(true)
    },
    operationShipment (name, index) {
      this.$store
        .dispatch('handleWeb3Decrypt')
        .then(() => {
          this.comfirmOperation = true
          this.currOperation = name
          this.currOperationIndex = index
        })
        .catch(err => {
          if (err) {
          }
        })
    },
    cancelOperation () {
      this.comfirmOperation = false
    },
    operationStatusModalOK () {
      this.operationStatusModal = false
      // this.$refs.table.refresh(true)
      this.getInitListData()
      this.shipmentStatusMap = {}
      this.updateRecords = []
      this.$refs.xTable.clearSelection()
    },
    getUrerList (type) {
      getRole({ type: 'CUSTOMS_BROKER' })
        .then(({ data }) => {
          // this.companyList = data
          this.companyList = this.$systemData().filterEntities(this.info, 'CUSTOMS_BROKER', data)
          this.company = this.companyList[0].companyId
        })
        .catch(err => {
          console.log(err)
        })
    },
    confirmOperation () {
      this.comfirmOperation = false
      this.operationStatusModal = true
      this.shipmentNoList.map((item, index) => {
        const opt = {}
        if (this.currOperation === 'operationReturnToImporter') {
          opt.content = this.returnText
        }
        if (
          this.currOperation === 'operationTransmitToCB' ||
          this.currOperation === 'operationReviewCompleted' ||
          this.currOperation === 'operationSubmitToCustoms'
        ) {
          opt.nextLevelCompanyId = this.company
        }
        console.log('item', item)
        opt.shipmentNo = item.shipmentNo
        this.$store
          .dispatch(this.currOperation, opt)
          .then(() => {
            this.shipmentStatusMap[item.shipmentNo] = '...... ok'
          })
          .catch(err => {
            console.log('err', err)
            if (err.error) {
              this.shipmentStatusMap[item.shipmentNo] = '...... fail'
            } else {
              this.shipmentStatusMap[item.shipmentNo] = '...... fail'
            }
          })
          .finally(() => {
            this.signLength++
            this.signShipmentList()
          })
      })
    },
    signShipmentList () {
      if (this.shipmentNoList.length === this.signLength) {
        const list = []
        for (const key in this.shipmentStatusMap) {
          if (this.shipmentStatusMap.hasOwnProperty(key)) {
            const element = this.shipmentStatusMap[key]
            if (element === '...... ok') {
              let documents = null
              this.shipmentNoList.map(item => {
                if (item.shipmentNo === key) {
                  documents = item.documents
                }
              })
              list.push({
                shipmentNo: key,
                documents: documents
              })
            }
          }
        }
        console.log('22 list 22:', list)
        if (list.length > 0) {
          this.$store
            .dispatch('signAll', { action: this.actionMap[this.currOperation], shipmentList: list })
            .then(() => {
              console.log('all sign success')
            })
            .catch(err => {
              console.log('上链失败', err)
            })
        }
      }
    },
    getListStatusMap () {
      return {
        PREPARING: this.$t('list.status.text1'),
        IN_CB: this.$t('list.status.text2'),
        IN_REVIEW: this.$t('list.status.text3'),
        RETURN: this.$t('list.status.text4'),
        WITHDRAWN: this.$t('list.status.text5'),
        REVIEWED: this.$t('list.status.text6')
      }
    },
    handleLook (record) {
      this.$router.push({ name: 'ProfileBasic', query: { shipmentNo: record.shipmentNo } })
    },
    createShipment () {
      this.$router.push({ name: 'create' })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      let shipmentStatus = ''
      let shipmentNoList = ''
      let shipmentCustomsNoList = ''
      const shipmentStatusMap = {}
      if (selectedRows.length === 1) {
        shipmentStatus = selectedRows[0].status
        shipmentNoList = [
          {
            shipmentNo: selectedRows[0].shipmentNo,
            documents: selectedRows[0].documents
          }
        ]
        shipmentCustomsNoList = [selectedRows[0].shipmentCustomsNo]
        shipmentStatusMap[selectedRows[0].shipmentNo] = '......'
      }
      if (selectedRows.length > 1) {
        shipmentNoList = []
        shipmentCustomsNoList = []
        shipmentStatus = selectedRows[0].status
        selectedRows.map(item => {
          shipmentNoList.push({
            shipmentNo: item.shipmentNo,
            documents: item.documents
          })
          shipmentCustomsNoList.push(item.shipmentCustomsNo)
          shipmentStatusMap[item.shipmentNo] = '......'
        })
        const list = selectedRows.filter(item => item.status !== shipmentStatus)
        shipmentStatus = list.length === 0 && shipmentStatus
      }
      // console.log('onChange123123', shipmentStatus, shipmentNoList, shipmentStatusMap)
      this.shipmentStatus = shipmentStatus
      this.shipmentNoList = shipmentNoList
      this.shipmentCustomsNoList = shipmentCustomsNoList
      this.shipmentStatusMap = shipmentStatusMap
    },
    isLocked (record) {
      const lockUntil = moment(record.lockUntil)
      if (record.lock === 'LOCKED' && lockUntil > new Date()) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  font-size: 24px;
  color: #000;
}
.name-time {
  background: #eaedf3;
  color: #000;
  margin-bottom: 40px;
  padding: 30px;
  p {
    margin: 0;
  }
}
.operation-icon {
  i {
    font-size: 16px;
    margin-right: 3px;
  }
}
.btn-last {
  margin-left: 20px;
}

.editable-add-btn {
  margin-bottom: 8px;
}

.hovercolor /deep/ .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
  background: #fff;
}
.table-oper {
  height: 20px;
  width: 100%;
}
.menu-btn {
  position: relative;
  width: 20px;
  height: 20px;
  float: right;
  &:hover {
    .menu-wrapper {
      display: block;
    }
  }
}
.menu-wrapper {
  display: none;
  position: absolute;
  top: 16px;
  right: 0;
  z-index: 9;
  width: 140px;
  background-color: #fff;
  font-size: 14px;
  padding: 4px 5px;
  user-select: none;
  border: 1px solid #e8eaec;
  .checkbox-item {
    display: block;
    margin: 4px 0;
  }
}
.icon-menu {
  width: 16px;
  height: 0px;
  display: inline-block;
  margin-bottom: 16px;
  box-shadow: 0 6px 0 2px #606266, 0 0 0 2px #606266, 0 12px 0 2px #606266;
}
.sortable-column-demo .vxe-header--row .vxe-header--column.sortable-ghost,
.sortable-column-demo .vxe-header--row .vxe-header--column.sortable-chosen {
  background-color: #dfecfb;
}
/deep/ .vxe-sort-wrapper {
  float: right;
}
</style>
