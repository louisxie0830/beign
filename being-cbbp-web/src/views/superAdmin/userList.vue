<template>
  <div class="page-admin">
    <div class="content">
      <h2 class="h2-title">{{ $t('page.title.userList') }}</h2>
      <a-row>
        <a-col :span="14" align="center">
          <a-input-search
            class="inp"
            :placeholder="$t('user.actions.search.tip')"
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
        <!-- <a-col :span="10" align="center">
          <a-button type="primary" style="border-color:#68b310" @click="sign()">
            {{ $t('user.actions.add') }}
          </a-button>
        </a-col>-->
      </a-row>
      <a-divider style="margin:20px 0px;" />
    </div>
    <div>
      <a-spin tip="Loading..." size="large" :spinning="loading">
        <vxe-grid border highlight-hover-row resizable :data="tableData">
          <vxe-table-column title="ID" type="text" width="80" show-overflow>
            <template v-slot="{ row, seq }">{{ row.id }}</template>
          </vxe-table-column>
          <vxe-table-column :title="$t('user.username')" type="text" show-overflow>
            <template v-slot="{ row, seq }">
              <a type="text" @click="handleLook(row)">{{ row.username }}</a>
            </template>
          </vxe-table-column>
          <vxe-table-column :title="$t('user.companyName')" type="text" show-overflow>
            <template v-slot="{ row, seq }">{{ row.company.companyName }}</template>
          </vxe-table-column>
          <vxe-table-column :title="$t('user.roleName')" type="text">
            <template v-slot="{ row, seq }">
              <span style="display:block;" v-for="(item, i) in row.roles" color="blue" :key="i">
                {{ $t('entityRoles')[item.role] }}
                <a-tag :color="item.isAdmin ? 'red' : 'green'">{{ transformUserRole(item.isAdmin) }}</a-tag>
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column :title="$t('user.status.name')" type="text" width="90" show-overflow>
            <template v-slot="{ row, seq }">{{ $t('userPermissions')[row.status] }}</template>
          </vxe-table-column>
          <vxe-table-column :title="$t('user.createdAt')" type="text" width="150" show-overflow>
            <template v-slot="{ row, seq }">{{ formatTime(row.createdAt) }}</template>
          </vxe-table-column>
        </vxe-grid>
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

    <view-user
      @openEditUserModal="openEditUserModal"
      @hideModal="hideModal"
      :viewUserModal="viewUserModal"
      :selectedUserId="selectedUserId"
    />
    <edit-user
      @initData="getUserListData"
      @hideModal="hideModal"
      :editUserModal="editUserModal"
      :selectEditUser="selectEditUser"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import zhTWLocat from 'vxe-table/lib/locale/lang/zh-TW'
import enLocat from 'vxe-table/lib/locale/lang/en'
import { VXETable } from 'vxe-table'
import { userList } from '@/api/account'
import viewUser from './components/ViewUser'
import editUser from './components/EditUser'
import moment from 'moment'
import { permissionsLevelData } from '@/const/systemData'

export default {
  name: 'SuperAdminUserList',
  data () {
    return {
      loading: false,
      viewUserModal: false,
      editUserModal: false,
      selectedUserId: 0,
      queryParam: {
        userRole: '',
        terms: ''
      },
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      searchVal: '',
      tableData: [],
      selectEditUser: {}
    }
  },
  computed: {
    ...mapState({
      lang: state => state.i18n.lang
    }),
    transformUserRole () {
      return isAdmin => {
        const key = isAdmin ? 1 : 0
        const p = permissionsLevelData.find(i => i.key === key)
        if (p) {
          const level = p.level
          return this.$t('userRoles')[level]
        } else {
          return isAdmin
        }
      }
    }
  },
  components: {
    viewUser,
    editUser
  },
  watch: {
    lang: {
      handler () {
        this.changeVexTableLang()
      }
    }
  },
  created () {
    this.getUserListData()
  },
  methods: {
    resetPage () {
      this.tablePage = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    },
    formatIsAdmin (a) {
      return this.transformUserRole(a)
    },
    formatTime (t) {
      return moment(t).format('YYYY-MM-DD HH:mm')
    },
    changeVexTableLang () {
      // vexTable i18n
      const showLocal = this.lang === 'zh-TW' ? zhTWLocat : enLocat
      VXETable.setup({
        i18n: (key, value) => VXETable.t(showLocal, key)
      })
    },
    onSearch () {
      // console.log(this.searchVal)
      this.$refs.keyword.focus()
      this.queryParam.terms = this.searchVal
      this.resetPage()
      this.getUserListData()
      console.log('type', this.queryParam)
      window.scrollTo(0, 0)
    },
    handleChange (value) {
      // console.log(`${value}`)
      this.queryParam.userRole = value
      console.log('type', this.queryParam)
      this.getUserListData()
    },
    // 点击进入公司编辑页面
    handleLook (record) {
      this.selectedUserId = record.id
      this.selectEditUser = this.tableData.find(item => {
        return item.id === record.id
      })
      this.viewUserModal = true
    },
    openEditUserModal () {
      this.editUserModal = true
    },
    hideModal () {
      this.viewUserModal = false
      this.editUserModal = false
    },
    // 点击进入创建实体页面
    sign () {
      this.$router.push({ name: 'companyList' })
    },
    // 页数选择
    handlePageChange ({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.tableData = this.getUserListData()
      console.log(currentPage, pageSize)
    },
    getUserListData () {
      this.loading = true
      const limit = this.tablePage.pageSize
      const offset = (this.tablePage.currentPage - 1) * limit
      userList(Object.assign({ offset, limit }, this.queryParam))
        .then(res => {
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
