<template>
  <div>
    <div class="head-title">{{ $t('superadmin.create.entity') }}</div>
    <div class="main-content">
      <p class="title">{{ $t('superadmin.entity.role') }}</p>
      <a-divider />
      <div class="role">
        <p>{{ $t('superadmin.select.entity.role') }}</p>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          bordered
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :pagination="false"
        />
      </div>
      <p class="title">{{ $t('superadmin.company.information') }}</p>
      <a-divider />
      <a-form :form="form">
        <a-row class="company">
          <a-col :span="12">
            <a-form-item
              :label="$t('superadmin.company.name')"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input
                :placeholder="$t('superadmin.companyname.tip')"
                v-decorator="[
                  'companyName',
                  { rules: [{ required: true, message: $t('superadmin.companyname.tip') }] }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :label="$t('superadmin.country')"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-select
                :placeholder="$t('superadmin.country.tip')"
                v-decorator="[
                  'country',
                  {
                    rules: [{ required: true, message: $t('superadmin.country.tip') }]
                  }
                ]"
              >
                <a-select-option
                  v-for="item in countriesData"
                  :value="item.country"
                  :key="item.tmpId"
                >{{ $t('page.form.select.countries')[item.country] }} ({{ item.country }})</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :label="$t('superadmin.tax.id')"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input
                :placeholder="$t('superadmin.taxid.tip')"
                v-decorator="[
                  'taxId',
                  {
                    rules: [{ required: true, message: $t('superadmin.taxid.tip') }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :label="$t('superadmin.email')"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input
                :placeholder="$t('superadmin.email.tip')"
                v-decorator="[
                  'contactEmail',
                  {
                    rules: [
                      { required: true, message: $t('superadmin.email.tip') },
                      { pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message: $t('superadmin.email.reg.tip') }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :label="$t('superadmin.fax.number')"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input
                :placeholder="$t('superadmin.faxnumber.tip')"
                v-decorator="[
                  'faxNo',
                  {
                    rules: [
                      {
                        required: false
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :label="$t('superadmin.phone.number')"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input
                :placeholder="$t('superadmin.phonenumber.tip')"
                v-decorator="[
                  'phoneNo',
                  {
                    rules: [
                      {
                        required: false
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="$t('superadmin.address')" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-input
                :placeholder="$t('superadmin.address.tip')"
                v-decorator="['address', { rules: [{ message: $t('superadmin.address.tip') }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <div v-show="cbContent">
          <cb-boxes-table
            @handleCbChange="handleCbChange"
            :dataSourceCB="dataSourceCB"
            :dataSourceCBMap="dataSourceCBMap"
          />
        </div>
        <a-divider />
        <p class="title">{{ $t('superadmin.invite.user') }}</p>
        <div align="right" style="margin-bottom: 40px;">
          <a-button type="primary" @click="addMore">{{ $t('superadmin.add.more') }}</a-button>
        </div>
        <a-table
          :columns="getColumnsUser()"
          :rowKey="record => record.tmpId"
          :dataSource="userList"
          bordered
          :pagination="false"
        >
          <!-- <template slot="employeeId" slot-scope="text">
            {{ text }}
          </template>
          <template slot="firstName" slot-scope="text">
            {{ text }}
          </template>
          <template slot="lastName" slot-scope="text">
            {{ text }}
          </template>
          <template slot="emailAddress" slot-scope="text">
            {{ text }}
          </template> -->
          <template slot="entityRole" slot-scope="text">
            {{ $t('entityRoles')[text] }}
          </template>
          <template slot="userRole" slot-scope="text">
            {{ $t('userRoles')[text] }}
          </template>
          <template slot="Operation" slot-scope="text, record">
            <span>
              <a @click="() => edit(record.tmpId)" style="margin-right: 10px;">
                <a-icon type="edit" :style="{ fontSize: '20px', color: '#9b9b9b' }" />
              </a>
              <a @click="() => showDeleteConfirm(record.tmpId)">
                <a-icon type="close-circle" :style="{ fontSize: '20px', color: '#d0021b' }" />
              </a>
            </span>
          </template>
        </a-table>
        <a-pagination
          style="margin-top: 20px; float: right;"
          size="small"
          v-model="current"
          :defaultPageSize="10"
          :total="totalPage"
        />
        <div class="clear"></div>
        <div align="center">
          <confirm-checkbox />
        </div>
      </a-form>
    </div>

    <div align="center">
      <a-button type="primary" @click="CREATE" :loading="loading">{{ $t('superadmin.create') }}</a-button>
      <a-button @click="CANCEL" style="margin-left: 60px;">{{ $t('superadmin.cancel') }}</a-button>
    </div>

    <edit-invite-user
      @saveInviteUser="saveInviteUser"
      @hideModal="hideModal"
      :dataSourceUser="dataSourceUser"
      :editInviteUserModal="editInviteUserModal"
      :entityRoleList="selectedRows"
      :selectEditUser="selectEditUser"
    />
  </div>
</template>

<script>
import { groupArray } from '@/utils/util'
import { entityRolesData, customsRegionData, countryData } from '@/const/systemData'
import { mapState } from 'vuex'
import editInviteUser from '../superAdmin/components/EditInviteUser'
import cbBoxesTable from '../superAdmin/components/CbBoxesTable'
import confirmCheckbox from '../superAdmin/components/ConfirmCheckbox'
export default {
  data () {
    return {
      cbContent: false,
      formItemLayout: {
        labelCol: { span: 12 },
        wrapperCol: { span: 12 }
      },
      form: this.$form.createForm(this),
      selectedRowKeys: [],
      selectedRows: [],
      loading: false,
      selectedEntities: [],
      dataSourceCBMap: {},
      dataSourceUser: [],
      current: 1,
      check: false,
      columnList: ['firstName', 'lastName'],
      editInviteUserModal: false,
      selectEditUser: {}
    }
  },
  components: {
    cbBoxesTable,
    confirmCheckbox,
    editInviteUser
  },
  computed: {
    ...mapState({
      lang: state => state.i18n.lang
    }),
    userList () {
      return groupArray(this.dataSourceUser, 10)[this.current - 1]
    },
    totalPage () {
      return this.dataSourceUser.length
    },
    columnsCB () {
      return [
        {
          title: this.$t('superadmin.customs.zone'),
          dataIndex: 'customs',
          key: 'customs'
        },
        {
          title: this.$t('superadmin.case.no'),
          dataIndex: 'case',
          key: 'case',
          scopedSlots: { customRender: 'case' }
        }
      ]
    },
    dataSourceCB () {
      return customsRegionData.map(item => {
        const i18nKey = 'customsRegions.' + item.role
        item.customs = this.$t(i18nKey)
        return item
      })
    },
    columns () {
      return [
        {
          title: this.$t('superadmin.company.role'),
          dataIndex: 'name',
          key: 'role'
        }
      ]
    },
    dataSource () {
      return entityRolesData.map(item => {
        const i18nKey = 'entityRoles.' + item.role
        item.name = this.$t(i18nKey)
        return item
      })
    },
    countriesData () {
      return countryData
    }
  },
  methods: {
    hideModal () {
      this.editInviteUserModal = false
    },
    saveInviteUser (inviteUserData) {
      console.log('inviteUserData', inviteUserData)
      const editUserObj = this.dataSourceUser.find(item => item.tmpId === inviteUserData.tmpId)
      if (!editUserObj) {
        this.dataSourceUser.push(inviteUserData)
      } else {
        const newData = this.dataSourceUser.map(item => {
          if (item.tmpId === inviteUserData.tmpId) {
            item = inviteUserData
          }
          return item
        })
        this.dataSourceUser = newData
        console.log('this.dataSourceUser after', this.dataSourceUser)
      }
      this.hideModal()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      let addRole = ''
      let removeRole = ''
      if (this.selectedRows.length > selectedRows.length) {
        removeRole = this.selectedRows.find(item => {
          const temp = selectedRows.find(i => i.role === item.role)
          if (!temp) {
            return item
          }
        }).role
      } else if (this.selectedRows.length < selectedRows.length) {
        addRole = selectedRows.find(item => {
          const temp = this.selectedRows.find(i => i.role === item.role)
          if (!temp) {
            return item
          }
        }).role
      }
      console.log('removeRole=', removeRole)
      console.log('addRole=', addRole)
      if (this.dataSourceUser.length > 0) {
        let checkEntityRole = true
        for (const i in this.dataSourceUser) {
          const entityRole = this.dataSourceUser[i].entityRole
          if (entityRole === removeRole) {
            checkEntityRole = false
          }
        }
        // console.log('checkEntityRole', checkEntityRole)
        if (!checkEntityRole) {
          this.$message.error(this.$t('superadmin.userlist.exist'))
          return
        }
      }
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.cbContent = !!selectedRows.find(i => i.role === 'CUSTOMS_BROKER')
      this.selectedEntities = this.dataSource.filter(item => selectedRowKeys.indexOf(item.tmpId) > -1)
    },
    addMore () {
      if (this.selectedRows.length === 0) {
        this.$message.error(this.$t('superadmin.select.role.first'))
        return
      }
      const timeKey = Date.now()
      this.selectEditUser = {
        tmpId: timeKey,
        employeeId: '',
        firstName: '',
        lastName: '',
        emailAddress: '',
        entityRole: '',
        userRole: ''
      }
      this.editInviteUserModal = true
    },
    edit (key) {
      const newData = [...this.dataSourceUser]
      const target = newData.filter(item => key === item.tmpId)[0]
      this.selectEditUser = target
      this.editInviteUserModal = true
    },
    delete (key) {
      const newData = [...this.dataSourceUser]
      const target = newData.filter(item => key === item.tmpId)[0]
      const list = newData.filter(item => key !== item.tmpId) || []
      if (target) {
        this.dataSourceUser = list
      }
    },
    showDeleteConfirm (key) {
      this.$confirm({
        title: this.$t('superadmin.user.delete.title'),
        // content: 'Are you sure to delete',
        onOk: () => {
          this.delete(key)
        },
        onCancel () {}
      })
    },
    handleCbChange (value, record) {
      this.dataSourceCBMap[record.role] = value
    },
    CREATE () {
      if (this.selectedRowKeys.length === 0) {
        return this.$message.error(this.$t('superadmin.please.select.user.permission'))
      }
      // validateFieldsAndScroll:与validateFields相似，但校验完后，如果校验不通过的菜单域不在可见范围内，则自动滚动进可见范围
      // option.scroll.offsetTop定義校驗失敗時自动滚动进可见范围時的offsetTop位置
      this.form.validateFieldsAndScroll(
        {
          scroll: {
            offsetTop: 80
          }
        },
        (error, values) => {
          console.log('error', error)
          if (!error) {
            // 校验cb的信息
            const customsBrokers = []
            if (this.cbContent) {
              // let tap = true
              for (const key in this.dataSourceCBMap) {
                // tap = !(this.dataSourceCBMap[key] && this.dataSourceCBMap[key] !== '')
                if (this.dataSourceCBMap[key] !== '') {
                  customsBrokers.push({
                    zone: key,
                    caseNo: this.dataSourceCBMap[key]
                  })
                }
              }
              // if (tap) { 箱号可以留空
              //   this.$message.error('Please input cb information')
              //   return
              // }
            }
            // 校验邀请的user信息
            if (this.dataSourceUser.length === 0) {
              this.$message.error(this.$t('superadmin.please.add.user.info'))
              return
            }
            let userTap = false
            let editTap = false
            let inviteUsers = this.dataSourceUser.map(item => {
              for (const key in item) {
                if (item[key] === '') {
                  userTap = true
                }
                if (item['editable'] === true) {
                  editTap = true
                }
              }
              return { ...item }
            })
            if (userTap) {
              this.$message.error(this.$t('superadmin.user.info.not.empty'))
              return
            }
            if (editTap) {
              this.$message.error(this.$t('superadmin.save.user.info'))
              return
            }
            const entityRoles = this.selectedRows.map(item => {
              return item.role
            })
            inviteUsers = inviteUsers.map(item => {
              delete item.tmpId
              item.email = item.emailAddress
              delete item.emailAddress
              return item
            })
            console.log('values', values)
            const newVal = {}
            newVal.address = values.address || ''
            newVal.companyName = values.companyName
            newVal.contactEmail = values.contactEmail
            newVal.country = values.country
            newVal.faxNo = values.faxNo || ''
            newVal.phoneNo = values.phoneNo || ''
            newVal.taxId = values.taxId
            console.log('newVal', newVal)
            for (const i in values) {
              if (i.indexOf('boxes') === 0) {
                delete values[i]
              }
            }
            const opt = {
              ...newVal,
              entityRoles,
              customsBrokers,
              inviteUsers,
              language: this.lang,
              confirm: true
            }
            this.loading = true
            // 箱号数字或者不填正则判断
            const customsbrokerReg = /^[\d]*$/
            const cbReg = customsBrokers.every(item => {
              return customsbrokerReg.test(item.caseNo) || item.caseNo === ''
            })
            console.log('cbReg', cbReg, customsBrokers)
            if (!cbReg) {
              this.$message.warning(this.$t('superadmin.cb.casenumber.tip'))
              this.loading = false
              return
            }
            this.$store
              .dispatch('companyCreatePost', opt)
              .then(() => {
                this.$message.success('success')
                this.$router.push({ name: 'companyList' })
              })
              .catch(err => {
                this.$store.dispatch('errHandler', err)
                if (err.data.code === '29006' || err.data.code === '29007') {
                  this.$message.error(this.$t(err.data.code) + ':' + err.data.message)
                }
              })
              .finally(() => {
                this.loading = false
              })
          }
        }
      )
    },
    CANCEL () {
      console.log('CANCEL')
      this.$router.push({ name: 'companyList' })
    },
    getColumnsUser () {
      return [
        {
          title: this.$t('superadmin.employee.id'),
          dataIndex: 'employeeId',
          scopedSlots: { customRender: 'employeeId' }
        },
        {
          title: this.$t('superadmin.first.name'),
          dataIndex: 'firstName',
          scopedSlots: { customRender: 'firstName' }
        },
        {
          title: this.$t('superadmin.last.name'),
          dataIndex: 'lastName',
          scopedSlots: { customRender: 'lastName' }
        },
        {
          title: this.$t('superadmin.email.address'),
          dataIndex: 'emailAddress',
          scopedSlots: { customRender: 'emailAddress' }
        },
        {
          title: this.$t('superadmin.entity.roles'),
          dataIndex: 'entityRole',
          scopedSlots: { customRender: 'entityRole' }
        },
        {
          title: this.$t('superadmin.user.role'),
          dataIndex: 'userRole',
          scopedSlots: { customRender: 'userRole' }
        },
        {
          title: this.$t('Index.file.action'),
          dataIndex: 'employeeID',
          scopedSlots: { customRender: 'Operation' },
          width: 120
        }
      ]
    }
  }
}
</script>

<style scoped lang="less">
.head-title {
  text-align: center;
  font-size: 22px;
  margin-top: 30px;
  margin-bottom: 40px;
}
.main-content {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  .title {
    font-size: 18px;
  }
  .role {
    max-width: 350px;
    margin: 40px auto;
  }
  .company {
    max-width: 900px;
    margin: 40px auto;
  }
}
.clear {
  clear: both;
}
/deep/ .ant-form-item-label {
  padding-right: 30px;
}
.ant-input {
  padding: 0 9px;
  font-size: 13px;
}
</style>
