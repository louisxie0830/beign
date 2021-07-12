<template>
  <div class="admin-page">
    <div class="title" align="center">
      <span>{{ $t('customsUser') }}</span>
    </div>
    <div class="content">
      <p class="con-title">{{ $t('customsUser.table.customs.zone') }}: {{ regionsLangMap[loginInfo.region] }}</p>
      <a-table
        :columns="customsColumn"
        :dataSource="customsUserList"
        bordered
        :pagination="false"
        :rowKey="record => record.employeeId"
      >
        <template v-for="col in ['name', 'email']" :slot="col" slot-scope="text, record">
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.employeeId, col)"
            />
            <template v-else>
              <span>{{ text }}</span>
              <div v-if="loginInfo.employeeId === record.employeeId && col === 'name'">
                <a-tag color="red">{{ $t('customsUser.tip.yourself') }}</a-tag>
              </div>
            </template>
          </div>
        </template>
        <template v-for="col in ['companyNotification']" slot="companyNotification" slot-scope="text, record">
          <div :key="col">
            <a-select
              v-if="record.editable"
              style="margin: -5px 0;width:80px;"
              v-model="queryparam.companyNotification"
              @change="e => handleChange(queryparam.companyNotification, record.employeeId, 'companyNotification')"
            >
              <a-select-option value="0">{{ $t('emailNotification')['0'] }}</a-select-option>
              <a-select-option value="1">{{ $t('emailNotification')['1'] }}</a-select-option>
            </a-select>
            <template v-else>{{ $t('emailNotification')[text] }}</template>
          </div>
        </template>
        <template v-for="col in ['isAdmin']" slot="isAdmin" slot-scope="text, record">
          <div :key="col">
            <a-select
              v-if="record.editable && loginInfo.employeeId !== record.employeeId"
              style="margin: -5px 0;width:200px;"
              v-model="queryparam.role"
              @change="e => handleChange(queryparam.role, record.employeeId, 'isAdmin')"
            >
              <a-select-option value="true">{{ $t('customsUser.customs.office.admin') }}</a-select-option>
              <a-select-option value="false">{{ $t('customsUser.customs.office.reviewer') }}</a-select-option>
            </a-select>
            <template v-else>{{ roleLangMap[text] }}</template>
          </div>
        </template>
        <template v-for="col in ['status']" slot="status" slot-scope="text, record">
          <div :key="col">
            <a-select
              v-if="record.editable && loginInfo.employeeId !== record.employeeId"
              style="margin: -5px 0; width:100px;"
              v-model="queryparam.status"
              @change="e => handleChange(queryparam.status, record.employeeId, 'status')"
            >
              <a-select-option value="1">{{ $t('customsUser.active') }}</a-select-option>
              <a-select-option value="2">{{ $t('customsUser.inactive') }}</a-select-option>
            </a-select>
            <template v-else>{{ statusLangMap[text] }}</template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <span>
                <a @click="() => edit(record.employeeId)">
                  <a-icon type="edit" :style="{ fontSize: '20px', color: '#9b9b9b' }" />
                </a>
              </span>
              <a @click="() => save(record)">
                <a-icon type="check-circle" :style="{ fontSize: '20px', color: '#68b310' }" />
              </a>
              <a @click="() => cancel(record.employeeId)">
                <a-icon type="close-circle" :style="{ fontSize: '20px', color: '#d0021b' }" />
              </a>
            </span>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { customsList, customsUpdate } from '@/api/account'
// import { defaultLang } from '@/locales'
// import Vue from 'vue'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      customsRegionMap: {},
      openEditKey: 0,
      customsUserList: [],
      // columns: [],
      cacheData: [],
      queryparam: {
        companyNotification: '',
        role: '',
        status: ''
      }
    }
  },
  created () {
    this.customsData()
  },
  computed: {
    ...mapState({
      roles: state => state.user.roles,
      loginInfo: state => state.user.info,
      lang: state => state.i18n.lang
    }),
    regionsLangMap () {
      return {
        AA: 'A* - ' + this.$t('admin.Keelung'),
        BA: 'B* - ' + this.$t('admin.Kaoshiung'),
        CA: 'C* - ' + this.$t('admin.Taipei'),
        DA: 'D* - ' + this.$t('admin.Taichung')
      }
    },
    statusLangMap () {
      return {
        '1': this.$t('customsUser.account.status.active'),
        '2': this.$t('customsUser.account.status.inactive')
      }
    },
    roleLangMap () {
      return {
        true: this.$t('customsUser.customs.role.admin'),
        false: this.$t('customsUser.customs.role.normal')
      }
    },
    customsColumn () {
      return [
        {
          title: this.$t('customsUser.employeeId'),
          dataIndex: 'employeeId',
          scopedSlots: { customRender: 'employeeId' }
        },
        {
          title: this.$t('customsUser.name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('customsUser.email'),
          dataIndex: 'email',
          width: '24%',
          scopedSlots: { customRender: 'email' }
        },
        {
          title: this.$t('customsUser.email.notice'),
          dataIndex: 'companyNotification',
          width: '8%',
          scopedSlots: { customRender: 'companyNotification' }
        },
        {
          title: this.$t('customsUser.user.role'),
          dataIndex: 'isAdmin',
          width: '20%',
          scopedSlots: { customRender: 'isAdmin' }
        },
        {
          title: this.$t('customsUser.user.account'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('customsUser.user.operation'),
          dataIndex: 'operation',
          width: '12%',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  methods: {
    handleChange (value, key, column) {
      const newCustomsUserList = [...this.customsUserList]
      const target = newCustomsUserList.filter(item => key === item.employeeId)[0]
      if (target) {
        target[column] = value
        this.customsUserList = newCustomsUserList
      }
    },
    customsData () {
      customsList().then(res => {
        this.customsUserList = res.data
        this.cacheData = this.customsUserList.map(item => ({ ...item }))
      })
    },
    edit (key) {
      if (this.openEditKey) {
        this.cancel(this.openEditKey)
      }
      this.openEditKey = key
      const newCustomsUserList = [...this.customsUserList]
      const target = newCustomsUserList.filter(item => key === item.employeeId)[0]
      if (target) {
        target.editable = true
        this.queryparam.companyNotification = '' + target.companyNotification
        this.queryparam.role = '' + target.isAdmin
        this.queryparam.status = '' + target.status
        this.customsUserList = newCustomsUserList
      }
    },
    save (record) {
      if (this.openEditKey) {
        const saveKey = this.openEditKey
        console.log('save record', record)
        if (!record.name || !record.email) {
          this.$message.error(this.$t('customsUser.validate.blank'))
          return
        }
        const newCustomsUserList = [...this.customsUserList]
        const target = newCustomsUserList.filter(item => record.employeeId === item.employeeId)[0]
        if (target) {
          delete target.editable
          this.customsUserList = newCustomsUserList
          // this.cacheData = newCustomsUserList.map(item => ({ ...item }));
          const options = {
            id: record.id,
            name: record.name,
            email: record.email,
            companyNotification: record.companyNotification,
            status: record.status,
            isAdmin: record.isAdmin
          }
          customsUpdate(options)
            .then(res => {
              this.customsData()
            })
            .catch(err => {
              this.cancel(saveKey)
              this.$store.dispatch('errHandler', err)
            })
        }
      }
      this.openEditKey = 0
    },
    cancel (key) {
      this.openEditKey = 0
      const newCustomsUserList = [...this.customsUserList]
      const target = newCustomsUserList.filter(item => key === item.employeeId)[0]
      if (target) {
        // console.log('cacheData',this.cacheData)
        Object.assign(target, this.cacheData.filter(item => key === item.employeeId)[0])
        delete target.editable
        this.customsUserList = newCustomsUserList
      }
    }
  }
}
</script>
<style lang="less">
.editable-row-operations a {
  margin-right: 8px;
}
.admin-page {
  width: 100%;
  max-width: 1040px;
  margin: 40px auto;
}
.admin-page .title {
  font-size: 18px;
  color: #000;
}
.admin-page .content .con-title {
  border-bottom: 1px solid #ddd;
  color: #000;
  padding-left: 20px;
  padding-bottom: 20px;
}
</style>
