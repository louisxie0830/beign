<template>
  <div>
    <div class="head-title">{{ $t('superadmin.edit.entity') }}</div>
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
                  {
                    initialValue: formData.companyName,
                    rules: [{ required: true, message: $t('superadmin.companyname.tip') }]
                  }
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
                @change="handleSelect"
                v-decorator="[
                  'country',
                  {
                    initialValue: formData.country,
                    rules: [{ required: true, message: $t('superadmin.country.tip') }]
                  }
                ]"
              >
                <a-select-option
                  v-for="item in countriesData"
                  :value="item.country"
                  :key="item.key"
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
                    initialValue: formData.taxId,
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
                    initialValue: formData.contactEmail,
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
                    initialValue: formData.faxNo,
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
                    initialValue: formData.phoneNo,
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
                v-decorator="['address', { initialValue: formData.address }]"
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
        <div align="center">
          <confirm-checkbox />
        </div>
      </a-form>
      <div align="center">
        <a-button type="primary" :loading="loading" @click="SAVE">{{ $t('personal.save') }}</a-button>
        <a-button @click="CANCEL" style="margin-left: 60px;">{{ $t('superadmin.cancel') }}</a-button>
      </div>
      <div class="clear"></div>
      <a-divider />
      <p class="title">{{ $t('superadmin.user.management') }}</p>
      <a-table
        :columns="getColumnsUser('manage')"
        :rowKey="record => record.id"
        :dataSource="userListManage"
        bordered
        :pagination="false"
      >
        <template v-for="col in columnList" :slot="col" slot-scope="text, record">
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleManageChange(e.target.value, record.employeeId, col)"
            />
            <template v-else>{{ text }}</template>
          </div>
        </template>
        <template slot="entityRole" slot-scope="text">
          <template>
            <span style="display:block;" v-for="(item, i) in transEntityRole(text)" color="blue" :key="i">
              {{ item.role }}
              <a-tag :color="item.permission === 'ADMIN' ? 'red' : 'green'">{{ item.permissionName }}</a-tag>
            </span>
          </template>
        </template>
        <template slot="userRole" slot-scope="text">
          <template>{{ $t('userRoles')[text] }}</template>
        </template>
        <template slot="companyNotification" slot-scope="text">
          <template>{{ $t('emailNotification')[text] }}</template>
        </template>
        <template slot="status" slot-scope="text">
          <template>{{ $t('userPermissions')[text] }}</template>
        </template>
        <template slot="Operation" slot-scope="text, record">
          <span>
            <a-button type="primary" size="small" @click="() => editUserInfo(record.id, 'manage')">{{
              $t('superadmin.edit.user.data')
            }}</a-button>
            <a-button size="small" style="margin-top:5px;" @click="() => inviteUserRole(record.id, 'manage')">{{
              $t('superadmin.user.authorization')
            }}</a-button>
          </span>
        </template>
      </a-table>
      <a-pagination
        style="margin-top: 20px; float: right; margin-bottom: 20px;"
        size="small"
        v-model="current"
        :defaultPageSize="10"
        :total="totalPage"
      />
      <div class="clear"></div>
      <a-divider />
      <p class="title">{{ $t('superadmin.invite.user') }}</p>
      <div align="right" style="margin-bottom: 40px;">
        <a-button style="margin-left: 40px;" type="primary" @click="triggerCreateUserModal">{{
          $t('superadmin.create.new.user')
        }}</a-button>
      </div>
      <a-table
        :columns="getColumnsUser()"
        :rowKey="record => record.employeeId"
        :dataSource="userList"
        bordered
        :pagination="false"
      >
        <template slot="entityRole" slot-scope="text">
          <template>{{ $t('entityRoles')[text] }}</template>
        </template>
        <template slot="userRole" slot-scope="text">
          <template>{{ $t('userRoles')[text] }}</template>
        </template>
        <template slot="Action" slot-scope="text, record">
          <span>
            <a-button class="btnstyle" @click="Resend(record)" :loading="resendBtnLoading">{{
              $t('superadmin.user.resend')
            }}</a-button>
            <a-button class="btnstyle" style="margin-left: 15px;" :loading="deleteBtnLoading" @click="Delete(record)">{{
              $t('superadmin.user.delete')
            }}</a-button>
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
    </div>
    <div class="clear"></div>

    <create-user
      @initData="initData"
      @hideModal="hideModal"
      :createUserModal="createUserModal"
      :selectedRows="selectedRows"
      :companyId="formData.id"
    />
    <edit-user
      @initData="initData"
      @hideModal="hideModal"
      :editUserModal="editUserModal"
      :selectEditUser="selectEditUser"
    />
    <invite-user-role
      @initData="initData"
      @hideModal="hideModal"
      :inviteUserRoleModal="inviteUserRoleModal"
      :selectedRows="selectedRows"
      :selectEditUser="selectEditUser"
      :companyId="formData.id"
    />
  </div>
</template>

<script>
import { groupArray, getUrlParameters } from '@/utils/util'
import { entityRolesData, customsRegionData, permissionsLevelData, countryData } from '@/const/systemData'
import editUser from './components/EditUser'
import createUser from './components/CreateUser'
import inviteUserRole from './components/InviteUserRole'
import cbBoxesTable from '../superAdmin/components/CbBoxesTable'
import confirmCheckbox from '../superAdmin/components/ConfirmCheckbox'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      cbContent: false,
      editUserModal: false,
      createUserModal: false,
      inviteUserRoleModal: false,
      loading: false,
      formItemLayout: {
        labelCol: { span: 12 },
        wrapperCol: { span: 12 }
      },
      form: this.$form.createForm(this),
      selectedRowKeys: [],
      selectedRows: [],
      selectedEntities: [],
      dataSourceCBMap: {},
      dataSourceUser: [],
      current: 1,
      currentManage: 1,
      check: false,
      columnList: ['employeeId', 'firstName', 'lastName', 'emailAddress'],
      userManagementData: [],
      cacheData: [],
      formData: {},
      tableKey: 1,
      dataSourceCB: customsRegionData,
      saveBtn: true,
      resendBtnLoading: false,
      deleteBtnLoading: false,
      selectEditUser: {}
    }
  },
  computed: {
    ...mapState({
      lang: state => state.i18n.lang
    }),
    userList () {
      return groupArray(this.dataSourceUser, 10)[this.current - 1]
    },
    userListManage () {
      return groupArray(this.userManagementData, 10)[this.currentManage - 1]
    },
    totalPage () {
      return this.dataSourceUser.length
    },
    totalPageManage () {
      return this.userManagementData.length
    },
    transEntityRole () {
      return arr => {
        // console.log('transEntityRole.arr', arr)
        return arr.map(item => {
          return {
            role: this.$t('entityRoles')[item.role],
            permissionName: this.$t('userRoles')[item.permission],
            permission: item.permission
          }
        })
      }
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
    columnsCB () {
      return [
        {
          title: this.$t('superadmin.customs.zone'),
          dataIndex: 'customs',
          key: 'customs',
          scopedSlots: { customRender: 'customs' }
        },
        {
          title: this.$t('superadmin.case.no'),
          dataIndex: 'case',
          key: 'case',
          scopedSlots: { customRender: 'case' }
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
  components: {
    editUser,
    createUser,
    inviteUserRole,
    cbBoxesTable,
    confirmCheckbox
  },
  created () {
    this.initData()
  },
  methods: {
    handleSelect () {},
    initData () {
      const companyId = getUrlParameters('companyId')
      this.$store
        .dispatch('requestCompanyInfo', { companyId })
        .then(({ data }) => {
          const members = data.members
          this.userManagementData = members.map(it => {
            it.entityRole = it.roles.map(i => {
              return {
                role: i.role,
                permission: permissionsLevelData.find(k => {
                  if (k.key === i.isAdmin) {
                    return k
                  }
                }).level
              }
            })
            // console.log('it.entityRole000', it.entityRole)

            return it
          })
          this.cacheData = this.userManagementData.map(item => ({ ...item }))
          this.dataSourceUser = data.inviteRecords.map(item => {
            item.entityRole = item.role
            item.userRole = item.isAdmin === 1 ? 'ADMIN' : 'BASIC'
            return item
          })
          this.selectedRowKeys = []
          this.selectedRows = []
          data.companyRoles.map(item => {
            this.selectedRowKeys.push(
              entityRolesData.find(i => {
                return i.role === item.role
              }).key
            )
            this.selectedRows.push({
              role: item.role
            })
            if (item.role === 'CUSTOMS_BROKER') {
              this.cbContent = true
              data.companyBoxes.map(item => {
                this.dataSourceCBMap[item.region] = item.boxNo
              })
              this.tableKey = 2
            }
          })
          this.formData = {
            ...data
          }
          console.log('this.formData', this.formData)
        })
        .catch(err => {
          this.$store.dispatch('errHandler', err)
        })
    },
    triggerInviteModal () {
      this.inviteUserRoleModal = true
    },
    triggerEditUserModal () {
      this.editUserModal = true
    },
    triggerCreateUserModal () {
      this.createUserModal = true
    },
    hideModal () {
      this.createUserModal = false
      this.editUserModal = false
      this.inviteUserRoleModal = false
    },
    handleChange (value, key, column) {
      const newData = [...this.dataSourceUser]
      const target = newData.filter(item => key === item.employeeId)[0]
      if (target) {
        target[column] = value
        this.dataSourceUser = newData
      }
    },
    handleManageChange (value, key, column) {
      const newData = [...this.userManagementData]
      const target = newData.filter(item => key === item.employeeId)[0]
      if (target) {
        target[column] = value
        this.userManagementData = newData
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      // console.log('old selectedRows', this.selectedRows)
      // console.log('new selectedRows', selectedRows)
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
      if (removeRole && this.userManagementData.length > 0 && this.selectedRows.length > 0) {
        let checkEntityRole = true
        for (const i in this.userManagementData) {
          const entityRoles = this.userManagementData[i].entityRole
          if (entityRoles.some(item => item.role === removeRole)) {
            checkEntityRole = false
          }
        }
        // console.log('checkEntityRole', checkEntityRole)
        if (!checkEntityRole) {
          // this.$message.error('您邀請的用戶列表裡已經有該實體角色，如要取消請先將用戶的實體角色取消！')
          // return
          const self = this
          this.$confirm({
            title: this.$t('superadmin.remove.entity.role.permission'),
            content: (
              <div>
                <p>{self.$t('entityRoles')[removeRole]}</p>
                <p style="color:red;">{this.$t('superamdin.remove.content.tip')}</p>
              </div>
            ),
            onOk () {
              self.updateEntityRoleSelect(self, selectedRowKeys, selectedRows)
            },
            onCancel () {}
          })
        } else {
          this.updateEntityRoleSelect(this, selectedRowKeys, selectedRows)
        }
      } else {
        this.updateEntityRoleSelect(this, selectedRowKeys, selectedRows)
      }
    },
    updateEntityRoleSelect (that, selectedRowKeys, selectedRows) {
      that.selectedRowKeys = selectedRowKeys
      that.selectedRows = selectedRows
      that.cbContent = !!selectedRows.find(i => i.role === 'CUSTOMS_BROKER')
      that.selectedEntities = that.dataSource.filter(item => selectedRowKeys.indexOf(item.key) > -1)
    },
    editUserInfo (key) {
      this.selectEditUser = this.userManagementData.find(item => {
        return item.id === key
      })
      console.log('editUserInfo this.selectEditUser', this.selectEditUser)
      this.triggerEditUserModal()
    },
    inviteUserRole (key) {
      this.selectEditUser = this.userManagementData.find(item => {
        return item.id === key
      })
      console.log('inviteUserRole this.selectEditUser', this.selectEditUser)
      this.triggerInviteModal()
    },
    save (record) {
      const newData = [...this.userManagementData]
      const target = newData.filter(item => record.employeeId === item.employeeId)[0]
      const list = newData.filter(item => record.employeeId !== item.employeeId)
      if (target && !target.editable) {
        return
      }
      const opt = {
        email: record.email,
        employeeId: record.employeeId,
        firstName: record.firstName,
        lastName: record.lastName,
        status: record.status,
        userId: record.id
      }
      if (!this.saveBtn) {
        return
      }
      this.saveBtn = false
      this.$store
        .dispatch('userEditPost', opt)
        .then(() => {
          this.$message.success('save success')
          if (target) {
            const emailSame = list.find(item => item.emailAddress === target.emailAddress && item.emailAddress !== '')
            if (emailSame) {
              this.$message.info(this.$t('superadmin.invite.user.tip'))
              return
            }
            delete target.editable
            this.userManagementData = newData
            this.cacheData = newData.map(item => ({ ...item }))
          }
        })
        .catch(err => {
          this.$store.dispatch('errHandler', err)
        })
        .finally(() => {
          this.saveBtn = true
        })
    },
    cancel (key) {
      const newData = [...this.userManagementData]
      const target = newData.filter(item => key === item.employeeId)[0]
      // if (!target.editable) {
      //   this.showDeleteConfirm(key)
      //   return
      // }
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.employeeId)[0])
        delete target.editable
        this.userManagementData = newData
      }
    },
    delete (key) {
      const newData = [...this.userManagementData]
      const target = newData.filter(item => key === item.employeeId)[0]
      const list = newData.filter(item => key !== item.employeeId) || []
      if (target) {
        this.userManagementData = list
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
    SAVE () {
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
                customsBrokers.push({
                  zone: key,
                  caseNo: this.dataSourceCBMap[key]
                })
              }
              // if (tap) { 箱号可以留空
              //   this.$message.error('Please input cb information')
              //   return
              // }
            }
            const entityRoles = this.selectedRows.map(item => {
              return item.role
            })
            for (const i in values) {
              if (i.indexOf('boxes') === 0) {
                delete values[i]
              }
            }
            const opt = {
              ...values,
              companyId: +getUrlParameters('companyId'),
              entityRoles,
              customsBrokers,
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
              .dispatch('companyEditPost', opt)
              .then(() => {
                this.$message.success('Save Success')
                this.initData()
              })
              .catch(err => {
                this.$store.dispatch('errHandler', err)
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
    Resend (record) {
      this.$confirm({
        title: this.$t('superadmin.user.resend.title'),
        // content: 'Are you sure to delete',
        confirmLoading: this.resendBtnLoading,
        onOk: () => {
          this.resendBtnLoading = false
          this.$store
            .dispatch('userInviteResendPost', { language: this.lang, inviteId: record.id })
            .then(() => {
              this.$message.success('Resend to user')
            })
            .catch(err => {
              this.$store.dispatch('errHandler', err)
            })
            .finally(() => {
              this.resendBtnLoading = false
            })
        },
        onCancel () {}
      })
    },
    Delete (record) {
      this.$confirm({
        title: this.$t('superadmin.user.delete.title'),
        // content: 'Are you sure to delete',
        confirmLoading: this.deleteBtnLoading,
        onOk: () => {
          this.deleteBtnLoading = true
          this.$store
            .dispatch('userInviteDeletePost', { inviteId: record.id })
            .then(() => {
              setTimeout(() => {
                this.$message.success('User deleted')
                this.initData()
              }, 1000)
            })
            .catch(err => {
              this.$store.dispatch('errHandler', err)
            })
            .finally(() => {
              this.deleteBtnLoading = false
            })
        },
        onCancel () {}
      })
    },
    getColumnsUser (type) {
      const column = [
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
          dataIndex: 'email',
          scopedSlots: { customRender: 'emailAddress' }
        },
        {
          title: this.$t('superadmin.entity.roles'),
          dataIndex: 'entityRole',
          scopedSlots: { customRender: 'entityRole' }
        },
        {
          title: this.$t('list.operation'),
          dataIndex: 'employeeID',
          scopedSlots: { customRender: 'Operation' },
          width: 100
        }
      ]
      if (type === 'manage') {
        column.splice(1, 0, {
          title: this.$t('user.username'),
          dataIndex: 'username',
          scopedSlots: { customRender: 'username' }
        })
        column.splice(4, 0, {
          title: this.$t('user.companyNotification'),
          dataIndex: 'companyNotification',
          scopedSlots: { customRender: 'companyNotification' }
        })
        column.splice(column.length - 1, 0, {
          title: this.$t('user.status.name'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          width: 90
        })
      } else {
        column.splice(column.length - 1, 0, {
          title: this.$t('superadmin.user.role'),
          dataIndex: 'userRole',
          scopedSlots: { customRender: 'userRole' }
        })
        column.splice(column.length - 1, 1, {
          title: this.$t('Index.file.action'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'Action' },
          width: 198
        })
      }
      return column
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
  .btnstyle {
    padding: 0 14px;
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
