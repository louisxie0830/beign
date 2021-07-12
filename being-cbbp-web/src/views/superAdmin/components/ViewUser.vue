<template>
  <div>
    <a-modal
      :title="$t('page.title.userInfo')"
      :width="800"
      :visible="viewUserModal"
      @cancel="cancel"
      :footer="false"
      @ok="ok"
      class="edit-user"
    >
      <a-spin tip="Loading..." :spinning="loading">
        <a-row>
          <a-col :span="4">
            <b>{{ $t('user.username') }} :</b>
          </a-col>
          <a-col :span="8">{{ userInfo.username }}</a-col>
          <a-col :span="4">
            <b>{{ $t('user.employeeId') }} :</b>
          </a-col>
          <a-col :span="8">{{ userInfo.employeeId }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="2">
            <b>{{ $t('user.firstName') }} :</b>
          </a-col>
          <a-col :span="4">{{ userInfo.firstName }}</a-col>
          <a-col :span="2">
            <b>{{ $t('user.lastName') }} :</b>
          </a-col>
          <a-col :span="4">{{ userInfo.lastName }}</a-col>

          <a-col :span="4">
            <b>{{ $t('user.email') }} :</b>
          </a-col>
          <a-col :span="8">{{ userInfo.email }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="4">
            <b>{{ $t('user.updatedAt') }} :</b>
          </a-col>
          <a-col :span="8">{{ formatTime(userInfo.updatedAt) }}</a-col>
          <a-col :span="4">
            <b>{{ $t('user.createdAt') }} :</b>
          </a-col>
          <a-col :span="8">{{ formatTime(userInfo.createdAt) }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="4">
            <b>{{ $t('user.companyName') }} :</b>
          </a-col>
          <a-col :span="8">{{ userInfo && userInfo.company ? userInfo.company.companyName : '' }}</a-col>
          <a-col :span="4">
            <b>{{ $t('user.status.name') }} :</b>
          </a-col>
          <a-col :span="8">{{ $t('userPermissions')[userInfo.status] }}</a-col>
        </a-row>
        <a-row>
          <template v-if="userInfo && userInfo.region">
            <a-col :span="4">
              <b>{{ $t('user.region') }} :</b>
            </a-col>
            <a-col :span="8">{{ $t('customsRegions')[userInfo.region.substring(0, 1)] }}</a-col>
          </template>
          <a-col :span="4">
            <b>{{ $t('user.companyNotification') }} :</b>
          </a-col>
          <a-col :span="8">{{ $t('emailNotification')[userInfo.companyNotification] }}</a-col>
        </a-row>
        <a-row>
          <a-table :columns="roleDataColumn" :dataSource="userInfo.allRole" bordered :pagination="false">
            <template slot="role" slot-scope="text">{{ $t('entityRoles')[text] }}</template>
            <template slot="level" slot-scope="text">{{ $t('userRoles')[text] }}</template>
            <template slot="title">{{ $t('user.roleName') }}</template>
          </a-table>
        </a-row>
        <a-divider />
        <a-row>
          <a-col :span="24" align="center">
            <a-button type="primary" @click="editUser()">{{ $t('superadmin.edit.user.data') }}</a-button>
          </a-col>
        </a-row>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getInfo } from '@/api/login'
import moment from 'moment'
import { permissionsLevelData } from '@/const/systemData'
export default {
  props: {
    viewUserModal: {
      type: Boolean,
      default: false
    },
    selectedUserId: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapState({
      lang: state => state.i18n.lang,
      loginUser: state => state.user.info
    }),
    roleDataColumn () {
      return [
        {
          title: this.$t('user.roleName'),
          dataIndex: 'role',
          scopedSlots: { customRender: 'role' }
        },
        {
          title: this.$t('user.isAdmin'),
          dataIndex: 'level',
          scopedSlots: { customRender: 'level' }
        },
        {
          title: this.$t('user.ethAddress'),
          dataIndex: 'ethAddress'
        }
      ]
    }
  },
  data () {
    return {
      loading: false,
      userInfo: {},
      labelCol: { lg: { span: 14 }, sm: { span: 14 } },
      wrapperCol: { lg: { span: 14, offset: 5 }, sm: { span: 14, offset: 5 } }
    }
  },
  watch: {
    viewUserModal: {
      handler () {
        if (this.viewUserModal) {
          this.getUserInfo()
        }
      }
    }
  },
  methods: {
    restView () {
      this.userInfo = {}
    },
    getUserInfo () {
      this.loading = true
      this.restView()
      getInfo({ userId: this.selectedUserId })
        .then(res => {
          this.userInfo = res.data
          if (this.userInfo && this.userInfo.allRole) {
            this.userInfo.allRole.map(r => {
              const key = r.isAdmin ? 1 : 0
              r.level = permissionsLevelData.find(i => i.key === key).level
              return r
            })
          }
          this.loading = false
        })
        .catch(err => {
          this.cancel()
          console.error('viewUser getInfo err', err)
        })
    },
    formatTime (t) {
      return moment(t).format('YYYY-MM-DD HH:mm')
    },
    editUser () {
      this.$emit('openEditUserModal')
    },
    cancel () {
      this.$emit('hideModal')
    },
    ok () {},

    cancelBtn () {
      this.cancel()
    },
    handleSelect () {}
  }
}
</script>

<style lang="less">
.edit-user {
  max-width: 90%;
  .ant-form-vertical .ant-form-item-label {
    margin-left: 20.83333333%;
  }
}
</style>
