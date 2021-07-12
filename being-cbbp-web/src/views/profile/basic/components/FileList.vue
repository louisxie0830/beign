<template>
  <div style="position: relative;">
    <a
      v-show="roles.name === 'IMPORTER' && number < 2 && selectedRowKeys.length > 0"
      @click="deleteList()"
      class="delete-file"
    >
      <a-icon type="delete" />delete
    </a>
    <!-- <s-table
    style="margin-bottom: 24px"
    row-key="id"
    :columns="fileColumns()"
    :pagination="false"
    :data="loadData"
    :pageSizeOptions="['10', '25', '50']"
    showPagination="auto"
    bordered
    ref="table">
    <span slot="action" slot-scope="text, item">
      <template>
        <a style="margin-right:5px;" @click="handleFile (item)"><i class="demo-icon">&#xe805;</i></a>
        <a style="margin-right:5px;" @click="downItem (item)"><i class="demo-icon">&#xf02e;</i></a>
        <a style="margin-right:5px;" v-if="item.fileType === 'application/pdf'" @click="printItem (item)"><i class="demo-icon">&#xe80d;</i></a>
        <a v-if="roles.name === 'IMPORTER' && number < 2" @click="deleteItem (item)"><i class="demo-icon">&#xe80b;</i></a>
      </template>
    </span>
  </s-table>-->

    <vxe-grid
      class="sortable-column-demo"
      column-key
      border
      :data="paginationData"
      ref="xTable"
      :customs.sync="customColumns"
      :columns.sync="getTableColumns"
      :toolbar="toolbar"
      :sort-config="{ trigger: 'cell' }"
      :show-header="true"
      @sort-change="sortChangeEvent"
    >
      <vxe-table-column field="action" :title="$t('Index.file.action')">
        <template v-slot="{ row }">
          <a style="margin-right:5px;" @click="handleFile(row)">
            <i class="demo-icon">&#xe805;</i>
          </a>
          <a style="margin-right:5px;" @click="downItem(row)">
            <i class="demo-icon">&#xf02e;</i>
          </a>
          <a style="margin-right:5px;" v-if="row.fileType === 'application/pdf'" @click="printItem(row)">
            <i class="demo-icon">&#xe80d;</i>
          </a>
          <a v-if="roles.name === 'IMPORTER' && number < 2" @click="deleteItem(row)">
            <i class="demo-icon">&#xe80b;</i>
          </a>
        </template>
      </vxe-table-column>
    </vxe-grid>
    <vxe-pager
      :loading="loading"
      :page-sizes="[10, 25, 50]"
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :total="fileList.length"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'Sizes']"
      @page-change="handlePageChange"
    ></vxe-pager>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { STable } from '@/components'
import { shipmentRemoveDoc } from '@/api/manage'
import { groupArray } from '@/utils/util'
import Sortable from 'sortablejs'
import zhTWLocat from 'vxe-table/lib/locale/lang/zh-TW'
import enLocat from 'vxe-table/lib/locale/lang/en'
import { VXETable } from 'vxe-table'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    number: {
      type: Number,
      default: 0
    }
  },
  components: {
    STable
  },
  watch: {
    list: {
      handler (oldVal, newVal) {
        if (oldVal !== newVal) {
          this.fileList = this.list
          // this.$refs.table.refresh(true)
        }
      }
    },
    lang: {
      handler () {
        // this.tableColumns = this.getTableColumns
        this.changeVexTableLang()
      }
    }
  },
  data () {
    return {
      loading: false,
      tablePage: {
        currentPage: 1,
        pageSize: 10
      },
      customColumns: [],
      // tableColumns: [],
      toolbar: {
        id: 'shipment-detail-show',
        setting: {
          trigger: 'hover',
          immediate: true,
          storage: true
        }
      },
      fileList: [],
      // loadData: param => {
      //   return new Promise((resolve, reject) => {
      //     console.log('param:,', param)
      //     const sortField = param.sortField || 'createdAt'
      //     const myList = this.fileList.sort(function (a, b) {
      //       console.log('abbb,', a, b)
      //       const nameA = a[sortField] // ignore upper and lowercase
      //       const nameB = b[sortField] // ignore upper and lowercase
      //       if (nameA < nameB) {
      //         return param.sortOrder === 'ascend' ? -1 : 1
      //       }
      //       if (nameA > nameB) {
      //         return param.sortOrder === 'ascend' ? 1 : -1
      //       }
      //       return 0
      //     })
      //     resolve({
      //       rows: myList,
      //       total: myList.length
      //     })
      //   })
      // },
      options: {
        alert: {
          show: false,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      roles: state => state.user.roles,
      lang: state => state.i18n.lang
    }),
    group () {
      return groupArray(this.fileList, this.tablePage.pageSize)
    },
    paginationData () {
      return this.group[this.tablePage.currentPage - 1]
    },
    getTableColumns () {
      const cFileName = {
        title: this.$t('Index.file.name'),
        sortable: true,
        resizable: true,
        field: 'documentName',
        visible: true
      }
      const cFileType = {
        title: this.$t('Index.file.type'),
        sortable: true,
        resizable: true,
        field: 'documentType',
        visible: true
      }
      const cUploader = {
        title: this.$t('Index.file.uploader'),
        sortable: true,
        resizable: true,
        field: 'importerName',
        visible: true
      }
      const cUploadTime = {
        title: this.$t('Index.file.upload.time'),
        sortable: true,
        resizable: true,
        field: 'createdAt',
        visible: true
      }
      const cAction = {
        title: this.$t('Index.file.action'),
        sortable: false,
        resizable: true,
        field: 'action',
        visible: true,
        slots: {
          default: ({ row, column }) => {
            // const thatRow = row
            const btnPreview = (
              <a style="margin-right:5px;" onClick={() => this.handleFile(row)}>
                <i class="demo-icon">&#xe805;</i>
              </a>
            )
            const btnDownload = (
              <a style="margin-right:5px;" onClick={() => this.downItem(row)}>
                <i class="demo-icon">&#xf02e;</i>
              </a>
            )
            let btnPrint
            if (row.fileType === 'application/pdf') {
              btnPrint = (
                <a style="margin-right:5px;" onClick={() => this.printItem(row)}>
                  <i class="demo-icon">&#xe80d;</i>
                </a>
              )
            }

            let btnDelete
            if (this.roles.name === 'IMPORTER' && this.number < 2) {
              btnDelete = (
                <a onClick={() => this.deleteItem(row)}>
                  <i class="demo-icon">&#xe80b;</i>
                </a>
              )
            }

            return [btnPreview, btnDownload, btnPrint, btnDelete]
          }
        }
      }
      const columns = []
      columns.push(cFileName, cFileType, cUploader, cUploadTime, cAction)
      return columns
    }
  },
  beforeDestroy () {
    if (this.sortable) {
      this.sortable.destroy()
    }
  },
  created () {
    this.fileList = this.list
    this.columnDrop()
    this.changeVexTableLang()
    // this.tableColumns = this.getTableColumns
  },
  methods: {
    changeVexTableLang () {
      // vexTable i18n
      const showLocal = this.lang === 'zh-TW' ? zhTWLocat : enLocat
      VXETable.setup({
        i18n: (key, value) => VXETable.t(showLocal, key)
      })
    },
    sortChangeEvent ({ column, property, order }) {
      console.log(column, property, order)
    },
    handlePageChange ({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
    },
    sortNameMethod (type) {
      // 例如：名称不区分大小写的排序
      return (a, b) => {
        const v1 = (a[type] || '').toLowerCase()
        const v2 = (b[type] || '').toLowerCase()
        return v1 < v2 ? -1 : v1 > v2 ? 1 : 0
      }
    },
    columnDrop () {
      this.$nextTick(() => {
        const xTable = this.$refs.xTable
        this.sortable = Sortable.create(
          xTable.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'),
          {
            group: 'shipment-detail-sort',
            handle: '.vxe-header--column',
            dataIdAttr: 'data-colid',
            onEnd: ({ item, newIndex, oldIndex }) => {
              // const currRow = this.tableColumns.splice(oldIndex, 1)[0]
              // this.tableColumns.splice(newIndex, 0, currRow)
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
            },
            store: {
              /**
               * Get the order of elements. Called once during initialization.
               * @param   {Sortable}  sortable
               * @returns {Array}
               */
              get: function (sortable) {
                const order = localStorage.getItem(sortable.options.group.name)
                return order ? order.split('|') : []
              },
              /**
               * Save the order of elements. Called onEnd (when the item is dropped).
               * @param {Sortable}  sortable
               */
              set: function (sortable) {
                const order = sortable.toArray()
                localStorage.setItem(sortable.options.group.name, order.join('|'))
              }
            }
          }
        )
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      console.log('onSelectChange', selectedRowKeys, selectedRows)
    },
    printItem (item) {
      this.$emit('printPdf', item)
    },
    handleFile (record) {
      console.log('查看文件Name: ', record)
      // this.record = record
      if (record.fileType !== 'application/pdf') {
        // this.$message.warn('暂不支持此种文件预览')
        this.$message.warn('can not support this file type')
        // this.pdfShow = false
        this.$emit('closePdfModal', record)
        return
      }
      this.$emit('openPdfModal', record)
      // this.pdfShowModal = true
      // this.pdfUrl = record.fileKey
      // this.fileName = record.documentName
      // this.pdfShow = true
    },
    downItem (record) {
      const baseUrl = process.env.VUE_APP_API_BASE_URL
      const token = this.token.replace('JWT ', '')
      window.open(`${baseUrl}/document/download?fileKey=${record.fileKey}&accessToken=${token}`)
    },
    deleteList (item) {
      this.$confirm({
        title: `${this.$t('common.modal.title.delete.file')}`,
        content: `${this.$t('common.modal.content.tip')}`,
        onOk: () => {
          const delList = this.selectedRows.map(file => {
            const options = {
              shipmentNo: file.shipmentNo,
              fileKey: file.fileKey
            }
            shipmentRemoveDoc(options).then(res => {
              // this.$emit('getDetailInfo')
            })
          })
          Promise.all(delList).then(() => {
            this.$emit('getDetailInfo')
            this.$refs.table.clearSelected()
          })
        },
        onCancel () {}
      })
    },
    deleteItem (item) {
      this.$emit('getDetailInfo')
      // this.$refs.table.clearSelected()
      this.$confirm({
        title: `${this.$t('common.modal.title.delete.file')}`,
        content: `${this.$t('common.modal.content.tip.delete.file')}`,
        onOk: () => {
          const options = {
            shipmentNo: item.shipmentNo,
            fileKey: item.fileKey
          }
          shipmentRemoveDoc(options).then(res => {
            // this.$emit('getDetailInfo')
            this.$emit('getDetailInfo')
            // this.$refs.table.clearSelected()
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>

<style scoped lang="less">
.delete-file {
  position: absolute;
  left: 200px;
  top: 9px;
  z-index: 99;
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
  background-color: #fff;
  font-size: 14px;
  padding: 4px 5px;
  width: 140px;
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
