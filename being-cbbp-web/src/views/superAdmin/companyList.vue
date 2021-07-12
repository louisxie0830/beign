<template>
  <div class="page-admin">
    <div class="content">
      <h2 class="h2-title">{{ $t('superadmin.company.list') }}</h2>
      <a-row>
        <a-col :span="14" align="center">
          <a-input-search
            class="inp"
            :placeholder="$t('superadmin.keyword.search')"
            v-model.trim="searchVal"
            ref="keyword"
            @search="onSearch"
          />
          <a-select :placeholder="$t('superadmin.select.entity.role')" style="width: 160px" @change="handleChange">
            <a-select-option value>{{ $t('superadmin.all.entity') }}</a-select-option>
            <a-select-option value="IMPORTER">{{ $t('superadmin.importer') }}</a-select-option>
            <a-select-option value="EXPORTER">{{ $t('superadmin.exporter') }}</a-select-option>
            <a-select-option value="CUSTOMS_BROKER">{{ $t('superadmin.customsbroker') }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="10" align="center">
          <a-button type="primary" style="border-color:#68b310" @click="sign()">{{
            $t('superadmin.create.entity')
          }}</a-button>
        </a-col>
      </a-row>
      <a-divider style="margin:20px 0px;" />
    </div>
    <div>
      <a-spin tip="Loading..." size="large" :spinning="loading">
        <vxe-grid
          border
          highlight-hover-row
          resizable
          align="center"
          :data="tableData"
          :columns.sync="getTableColumns"
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import zhTWLocat from 'vxe-table/lib/locale/lang/zh-TW'
import enLocat from 'vxe-table/lib/locale/lang/en'
import { VXETable } from 'vxe-table'
import { companyList } from '@/api/account'
export default {
  name: 'SuperAdmin',
  data () {
    return {
      loading: false,
      queryParam: {
        entityRole: '',
        terms: ''
      },
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      searchVal: '',
      tableData: []
      // tableData: [
      //   { companyname: '关辉', taxid: 111, role: 'importer' },
      //   { companyname: '旭日', taxid: 222, role: 'importer customsbroker' },
      //   { companyname: 'zero', taxid: 555, role: 'importer' },
      //   { companyname: 'lous', taxid: 333, role: 'customsbroker' },
      //   { companyname: 'rose', taxid: 444, role: 'importer' }
      // ]
    }
  },
  computed: {
    ...mapState({
      lang: state => state.i18n.lang
    }),
    getTableColumns () {
      return [
        {
          field: 'companyName',
          title: this.$t('superadmin.company.name'),
          // sortable: true,
          slots: {
            default: ({ row, column }) => {
              return [<a onClick={() => this.handleLook(row)}>{row.companyName}</a>]
            }
          }
        },
        {
          field: 'taxId',
          title: this.$t('Index.taxId')
          // sortable: true
        },
        {
          field: 'roles',
          title: this.$t('superadmin.entity.roles'),
          // sortable: true,
          slots: {
            default: ({ row, column }) => {
              return [<span>{this.transformEntityRole(row.roles)}</span>]
            }
          }
        }
      ]
    }
  },
  watch: {
    lang: {
      handler () {
        this.changeVexTableLang()
        // this.getCompanyListData()
      }
    }
  },
  created () {
    this.getCompanyListData()
  },
  methods: {
    resetPage () {
      this.tablePage = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    },
    changeVexTableLang () {
      // vexTable i18n
      const showLocal = this.lang === 'zh-TW' ? zhTWLocat : enLocat
      VXETable.setup({
        i18n: (key, value) => VXETable.t(showLocal, key)
      })
    },
    transformEntityRole (arr) {
      return arr
        .map(item => {
          return this.$t('entityRoles')[item]
        })
        .join()
    },
    onSearch () {
      // console.log(this.searchVal)
      this.$refs.keyword.focus()
      this.queryParam.terms = this.searchVal
      this.resetPage()
      this.getCompanyListData()
      console.log('type', this.queryParam)
      window.scrollTo(0, 0)
    },
    handleChange (value) {
      // console.log(`${value}`)
      this.queryParam.entityRole = value
      console.log('type', this.queryParam)
      this.getCompanyListData()
    },
    // 点击进入公司编辑页面
    handleLook (record) {
      this.$router.push({ name: 'companyEdit', query: { companyId: record.id } })
    },
    // 点击进入创建实体页面
    sign () {
      this.$router.push({ name: 'companyCreate' })
    },
    // 页数选择
    handlePageChange ({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.tableData = this.getCompanyListData()
      console.log(currentPage, pageSize)
    },
    getCompanyListData () {
      this.loading = true
      const limit = this.tablePage.pageSize
      const offset = (this.tablePage.currentPage - 1) * limit
      companyList(Object.assign({ offset, limit }, this.queryParam))
        .then(res => {
          console.log('res', res)
          const listData = res.data.rows
          listData.map(item => {
            var Role = item.roles.map(i => i.role)
            item.roles = Role
            return item
          })
          this.tableData = res.data.rows
          this.tablePage.total = res.data.total
        })
        .catch(err => {
          this.$store.dispatch('errHandler', err)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less">
.page-admin {
  width: 100%;
  max-width: 1000px;
  margin: 40px auto;
  .content {
    margin: 40px auto 20px;
    .h2-title {
      text-align: center;
      font-size: 18px;
      margin-bottom: 1em;
    }
    .inp {
      width: 328px;
      margin-right: 20px;
      border-radius: 20px;
      .ant-input {
        border-radius: 1em;
      }
      .ant-input-search-icon {
        font-size: 18px;
      }
    }
  }
}
</style>
