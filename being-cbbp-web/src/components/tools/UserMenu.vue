<template>
  <div class="user-wrapper">
    <div class="content-box">
      <span style="color: #fff;">
        <a-icon type="user" />
      </span>
      <a-dropdown v-if="nickname">
        <span class="action ant-dropdown-link user-dropdown-menu">
          <span>{{ nickname }} [{{ $t('entityRoles')[roles.code] }}]</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <!-- <a-menu-item key="0">
            <router-link :to="{ name: 'settings' }">
              <a-icon type="user"/>
              <span>{{ $t('personal.setting') }}</span>
            </router-link>
          </a-menu-item>-->
          <!-- <a-menu-divider /> -->
          <a-menu-item v-if="roles.code != 'ADMIN' && roles.code != 'CUSTOMS' && roles.isAdmin" key="1">
            <router-link :to="{ name: 'entityEdit' }">
              <a-icon type="solution" />
              <span>{{ $t('personal.setting.company') }}</span>
            </router-link>
          </a-menu-item>
          <a-menu-item v-if="roles.code != 'ADMIN' && roles.code != 'CUSTOMS'" key="2">
            <a href="javascript:;" @click="handleRole">
              <a-icon type="sync" />
              <span>{{ $t('personal.setting.roles') }}</span>
            </a>
          </a-menu-item>
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>{{ $t('personal.setting.logout') }}</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <lang-select />
      <a-modal
        :title="$t('personal.select.role.information')"
        v-model="selectModal"
        :footer="null"
        style="text-align:center;"
      >
        <a-form-item>
          <p style="margin-bottom:0em;padding:0px 116px;text-align:left;">
            {{ $t('personal.select.role.information.to') }}
          </p>
          <a-select
            v-model="currentRole"
            :placeholder="$t('personal.select.entity.role')"
            @change="handleSelect"
            style="width:240px;"
          >
            <a-select-option v-for="(item, index) in rolesList" :key="index" :value="item.role">{{
              $t('entityRoles')[item.role]
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <div align="center">
          <a-button @click="selectOk" type="primary" :confirmLoading="confirmLoading">
            {{ $t('list.modal.confirm') }}
          </a-button>
          <a-button @click="selectCancel" style="margin-left: 114px">{{ $t('list.modal.cancel') }}</a-button>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters, mapState } from 'vuex'
import LangSelect from '@/components/tools/LangSelect'
import { changeUserRole } from '@/api/manage'
import { entityRolesDataSource } from '@/const/systemData'

export default {
  name: 'UserMenu',
  components: {
    LangSelect,
    NoticeIcon
  },
  data () {
    return {
      selectModal: false,
      confirmLoading: false,
      rolesList: [],
      currentRole: ''
    }
  },
  computed: {
    ...mapGetters(['nickname', 'avatar', 'userInfo', 'roles']),
    ...mapState({
      token: state => state.user.token
    })
  },
  created () {
    this.rolesList = this.userInfo.allRole
    this.currentRole = this.roles.code
    // console.log('this.roleList', this.rolesList)
    // console.log('entityRolesData', entityRolesDataSource)
  },
  methods: {
    ...mapActions(['Logout', 'errHandler', 'ChangeToken']),
    handleLogout () {
      console.log('userMenu this.roles', this.roles)
      const roleData = entityRolesDataSource.find(item => item.role === this.roles.code)
      this.$confirm({
        title: this.$t('presonal.logout.alert'),
        content: this.$t('settings.logout.content'),
        okText: this.$t('presonal.ok.logout.text'),
        cancelText: this.$t('list.modal.cancel'),
        onOk: () => {
          return this.Logout({})
            .then(() => {
              setTimeout(() => {
                console.log('logout loginPath', roleData.loginPath)
                // this.$router.push({ name: roleData.loginPath })
                window.location.href = roleData.loginPath
              }, 16)
            })
            .catch(err => {
              this.$message.error({
                title: 'Error',
                description: err.message
              })
            })
        },
        onCancel () {}
      })
    },
    handleSelect (value) {
      this.currentRole = value
      console.log('this.currentRole', this.currentRole)
    },
    handleRole () {
      this.selectModal = true
    },
    selectOk () {
      this.selectModal = false
      const role = this.currentRole
      this.confirmLoading = true
      changeUserRole({ role })
        .then(res => {
          console.log('res', res, this.token)
          this.ChangeToken(res.data)
            .then(result => {
              location.reload()
            })
            .catch(err => {
              this.errHandler(err)
            })
        })
        .catch(err => {
          this.errHandler(err)
        })
        .finally(() => {
          this.selectModal = false
          this.confirmLoading = false
        })
    },
    selectCancel () {
      this.selectModal = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-dropdown-menu-wrapper.ant-dropdown-menu .ant-dropdown-menu-item {
  width: auto;
}
.layout.ant-layout .top-nav-header-index .header-index-wide .fix-header {
  flex: 0 0 450px !important;
}
</style>
