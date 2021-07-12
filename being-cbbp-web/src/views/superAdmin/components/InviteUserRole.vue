<template>
  <div>
    <a-modal
      :title="$t('superadmin.user.role.permission')"
      :width="800"
      :visible="inviteUserRoleModal"
      @cancel="cancel"
      :footer="false"
      @ok="ok"
      :destroyOnClose="true"
      class="invite-new-user"
    >
      <a-row>
        <a-col :span="6">
          <b>{{ $t('superadmin.employee.id') }}:</b>
          {{ selectEditUser.employeeId }}
        </a-col>
        <a-col :span="8" v-if="/^[\u4e00-\u9fa5]+$/.test(this.selectEditUser.lastName)">
          <b>{{ $t('superadmin.invite.name') }}:</b>
          {{ selectEditUser.lastName }}{{ selectEditUser.firstName }}
        </a-col>
        <a-col :span="8" v-else>
          <b>{{ $t('superadmin.invite.name') }}:</b>
          {{ selectEditUser.firstName }}{{ selectEditUser.lastName }}
        </a-col>
        <a-col :span="10">
          <b>{{ $t('superadmin.email') }}:</b>
          {{ selectEditUser.email }}
        </a-col>
        <a-table
          :columns="getColumns()"
          :rowKey="record => record.key"
          :dataSource="cacheData"
          bordered
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: checkboxProps
          }"
          :pagination="false"
          size="middle"
          style="width: 90%;margin: 40px auto;"
          :key="tableKey"
        >
          <template slot="userRole" slot-scope="text, record">
            <a-select
              style="margin: -5px 0; width: 160px;"
              v-model="record.userRole"
              placeholder="Please select"
              @change="handleUserRoleChange"
              :disabled="loginUser.id === selectEditUser.id"
            >
              <a-select-option value="ADMIN">{{ $t('superadmin.Admin') }}</a-select-option>
              <a-select-option value="BASIC">{{ $t('superadmin.basic.user') }}</a-select-option>
            </a-select>
          </template>
          <template slot="Action" slot-scope="text, record">
            <a-button v-if="!record.role" @click="Invite(record)" :loading="record.inviteBtnLoading">
              {{ $t('page.form.select.editUserRole.invite') }}
            </a-button>
            <a-button
              type="primary"
              ghost
              v-if="record.role && loginUser.id !== selectEditUser.id"
              :disabled="!record.isChangeUserRole"
              :loading="record.changeRoleBtnLoading"
              @click="changeRole(record)"
            >{{ $t('page.form.select.editUserRole.edit') }}</a-button
            >
            <a-button
              type="danger"
              ghost
              v-if="record.role && loginUser.id !== selectEditUser.id"
              style="margin-left: 15px;"
              :loading="record.revokeBtnLoading"
              @click="Revoke(record)"
            >{{ $t('page.form.select.editUserRole.revoke') }}</a-button
            >
          </template>
        </a-table>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import { permissionsLevelData } from '@/const/systemData'
import { mapState } from 'vuex'
export default {
  props: {
    inviteUserRoleModal: {
      type: Boolean,
      default: false
    },
    selectedRows: {
      type: Array,
      default: () => []
    },
    selectEditUser: {
      type: Object,
      default: () => {}
    },
    companyId: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapState({
      lang: state => state.i18n.lang,
      loginUser: state => state.user.info
    }),
    entityRoles () {
      const list = this.selectedRows.map(item => {
        return item.role || item
      })
      return list
    },
    orgDataSource () {
      return [
        {
          key: 1,
          entityRole: this.$t('superadmin.exporter'),
          name: 'EXPORTER',
          userRole: 'ADMIN',
          inviteBtnLoading: false,
          revokeBtnLoading: false,
          changeRoleBtnLoading: false,
          isChangeUserRole: false,
          action: 'Invite'
        },
        {
          key: 2,
          entityRole: this.$t('superadmin.importer'),
          name: 'IMPORTER',
          userRole: 'ADMIN',
          inviteBtnLoading: false,
          revokeBtnLoading: false,
          changeRoleBtnLoading: false,
          isChangeUserRole: false,
          action: 'Invite'
        },
        {
          key: 3,
          entityRole: this.$t('superadmin.customsbroker'),
          name: 'CUSTOMS_BROKER',
          userRole: 'ADMIN',
          inviteBtnLoading: false,
          revokeBtnLoading: false,
          changeRoleBtnLoading: false,
          isChangeUserRole: false,
          action: 'Invite'
        }
      ]
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      selectedRowKeys: [],
      selectedRowsTable: [],
      user: '',
      cacheData: [],
      userList: [],
      cuerrntUserInfo: null,
      tableKey: 1,
      dataSource: []
    }
  },
  watch: {
    inviteUserRoleModal: {
      handler () {
        if (this.inviteUserRoleModal) {
          this.initUserRoleData()
        }
      }
    }
  },
  methods: {
    handleUserRoleChange (newValue) {
      console.log('this.cacheData', this.cacheData)
      this.cacheData.map(item => {
        if (item.role) {
          const orgUserRole = permissionsLevelData.find(it => it.key === item.isAdmin).level
          if (orgUserRole !== item.userRole) {
            item.isChangeUserRole = true
          } else {
            item.isChangeUserRole = false
          }
        }
      })
    },
    selectChange () {
      const target = this.userList.filter(item => item.id === this.user)[0]
      if (target) {
        this.cuerrntUserInfo = target
        const roles = target.roles
        this.cacheData = this.cacheData.map(item => {
          const j = roles.find(i => i.role === item.name)
          if (j) {
            this.selectedRowKeys.push(item.key)
            // j.isAdmin === 1 ? (item.userRole = 'ADMIN') : (item.userRole = 'BASIC')
            item.userRole = permissionsLevelData.find(it => it.key === j.isAdmin).level
            return { ...item, ...j }
          }
          return { ...item }
        })
      }
    },
    initUserRoleData () {
      console.log('inviteUserRole roles', this.selectedRows)
      this.dataSource = this.orgDataSource.filter(item => {
        return this.selectedRows.find(i => i.role === item.name)
      })
      this.cacheData = this.dataSource.map(item => ({ ...item }))
      this.cuerrntUserInfo = this.selectEditUser
      const roles = this.selectEditUser.roles
      if (roles && roles.length > 0) {
        this.cacheData = this.cacheData.map(item => {
          const j = roles.find(i => i.role === item.name)
          if (j) {
            this.selectedRowKeys.push(item.key)
            // j.isAdmin === 1 ? (item.userRole = 'ADMIN') : (item.userRole = 'BASIC')
            item.userRole = permissionsLevelData.find(it => it.key === j.isAdmin).level
            return { ...item, ...j }
          }
          return { ...item }
        })
      }
    },
    cancel () {
      this.cacheData = this.dataSource.map(item => ({ ...item }))
      this.selectedRowKeys = []
      this.form.resetFields()
      this.$emit('hideModal')
      this.user = ''
    },
    Invite (record) {
      console.log('invite record', record)
      if (this.cuerrntUserInfo) {
        if (
          !this.cuerrntUserInfo.firstName ||
          !this.cuerrntUserInfo.firstName ||
          !this.cuerrntUserInfo.employeeId ||
          !this.cuerrntUserInfo.email
        ) {
          this.$message.error(this.$t('superamdin.complete.invite.user.info.tip'))
          return
        }
        const self = this
        this.$confirm({
          title: this.$t('superamdin.comfirm.invite.new.user.permission'),
          content: self.$t('entityRoles')[record.name] + '[' + self.$t('userRoles')[record.userRole] + ']',
          confirmLoading: record.inviteBtnLoading,
          onOk: () => {
            const newData = [...self.cacheData]
            const target = newData.filter(item => item.key === record.key)[0]
            self.$set(target, 'inviteBtnLoading', true)
            const opt = {
              companyId: self.companyId,
              language: self.lang,
              firstName: self.cuerrntUserInfo.firstName,
              lastName: self.cuerrntUserInfo.lastName,
              employeeId: self.cuerrntUserInfo.employeeId,
              email: self.cuerrntUserInfo.email,
              role: target.name,
              userRole: target.userRole,
              userId: self.cuerrntUserInfo.id
            }
            self.$store
              .dispatch('userInvitePost', opt)
              .then(() => {
                self.$message.success('invite success')
                self.$emit('initData')
              })
              .catch(err => {
                self.$store.dispatch('errHandler', err)
              })
              .finally(() => {
                self.$set(target, 'inviteBtnLoading', false)
              })
          },
          onCancel () {}
        })
      }
    },
    Revoke (record) {
      if (this.cuerrntUserInfo) {
        console.log('this.cuerrntUserInfo', this.cuerrntUserInfo)
        console.log('this.loginUser', this.loginUser)
        if (this.loginUser.id === this.cuerrntUserInfo.id) {
          this.$message.success(this.$t('superadmin.revoke.yourself.permission.tip'))
          return
        }
        const self = this
        this.$confirm({
          title: this.$t('superadmin.remove.entity.role.permission'),
          content: (
            <div>
              <p>{self.$t('entityRoles')[record.name]}</p>
              <p style="color:red;">{this.$t('superamdin.remove.content.tip')}</p>
            </div>
          ),
          confirmLoading: record.revokeBtnLoading,
          onOk: () => {
            const newData = [...self.cacheData]
            const target = newData.filter(item => item.key === record.key)[0]
            self.$set(target, 'revokeBtnLoading', true)
            const opt = {
              userId: self.cuerrntUserInfo.id,
              role: target.name
            }
            self.$store
              .dispatch('userRevokePost', opt)
              .then(() => {
                self.$set(target, 'revokeBtnLoading', false)
                self.$message.success('revoke success')
                self.selectedRowKeys = self.selectedRowKeys.filter(item => item !== record.key)
                self.$set(target, 'role', false)
                self.$emit('initData')
              })
              .catch(err => {
                self.$set(target, 'revokeBtnLoading', false)
                self.$store.dispatch('errHandler', err)
              })
          },
          onCancel () {}
        })
      }
    },
    changeRole (record) {
      if (this.cuerrntUserInfo) {
        const orgUserRole = permissionsLevelData.find(it => it.key === record.isAdmin).level
        const self = this
        this.$confirm({
          title: this.$t('superadmin.modify.role.permission'),
          content: (
            <div>
              <p>
                {this.$t('superadmin.original.permission')}：{self.$t('entityRoles')[record.name]} [{' '}
                {self.$t('userRoles')[record.userRole]}]
              </p>
              <p>
                {this.$t('superadmin.new.permission')}：{self.$t('entityRoles')[record.name]} [{' '}
                {self.$t('userRoles')[orgUserRole]}]
              </p>
            </div>
          ),
          confirmLoading: record.changeRoleBtnLoading,
          onOk: () => {
            const newData = [...self.cacheData]
            const target = newData.filter(item => item.key === record.key)[0]
            self.$set(target, 'changeRoleBtnLoading', true)
            const opt = {
              userId: self.cuerrntUserInfo.id,
              role: target.name,
              userRole: target.userRole
            }
            self.$store
              .dispatch('userRoleEditPost', opt)
              .then(() => {
                self.$set(target, 'changeRoleBtnLoading', false)
                self.$message.success('Change user role success')
                self.$set(target, 'isAdmin', permissionsLevelData.find(it => it.key !== record.isAdmin).key)
                self.$set(target, 'isChangeUserRole', false)
                self.$emit('initData')
              })
              .catch(err => {
                self.$set(target, 'changeRoleBtnLoading', false)
                self.$store.dispatch('errHandler', err)
              })
          },
          onCancel () {}
        })
      }
    },
    ok () {},
    handleChange () {},
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRowsTable = selectedRows
      console.log(selectedRowKeys)
    },
    checkboxProps (record) {
      return {
        props: {
          disabled: record.key !== 0 // Column configuration not to be checked
        }
      }
    },
    getColumns () {
      return [
        {
          title: this.$t('superadmin.entity.roles'),
          dataIndex: 'entityRole'
        },
        {
          title: this.$t('superadmin.user.role'),
          dataIndex: 'userRole',
          scopedSlots: { customRender: 'userRole' }
        },
        {
          title: this.$t('list.operation'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'Action' },
          width: 230
        }
      ]
    },
    createAccount () {
      const {
        form: { validateFields }
      } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          const list = this.cacheData.filter(item => this.selectedRowKeys.indexOf(item.key) > -1)
          console.log('list', list)
          console.log('values', values)
        }
      })
    },
    cancelBtn () {
      this.cancel()
    },
    handleSelect () {}
  }
}
</script>

<style lang="less">
.invite-new-user {
  max-width: 90%;
}
</style>
