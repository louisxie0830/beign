<template>
  <v-flex id="managementIndex">
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('management.index.title')"></header-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-2>
      <v-layout v-if="!isNotJoinAnyCompant">
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <v-card class="pb-2">
            <v-subheader v-text="$t('management.index.company_title')"/>
            <v-select v-model="company"
                      dense
                      attach
                      item-text="name"
                      item-value="id"
                      :items="companyList"
                      :change="changeCompany()"/>
            <v-subheader v-text="$t('management.index.company_content', [USER_DATA.name, companyName, userRoleText])" />
          </v-card>

          <v-card style="margin-top: 10px; margin-bottom: 30px">
            <v-list>
              <v-list-tile v-if="isOwner" @click.prevent="$router.push({name: 'CheckList', params: { id: company }})">
                <v-list-tile-content>
                  <v-list-tile-title v-text="$t('management.index.update_administrator_title')" />
                  <v-list-tile-sub-title v-text="$t('management.index.update_administrator_sub_title')"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-avatar>
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-list-tile-avatar>
              </v-list-tile>

              <v-list-tile v-if="isOwner" @click.prevent="$router.push({ name: 'DepartmentEditingPage', params: { id: company }})">
                <v-list-tile-content>
                  <v-list-tile-title v-text="$t('management.index.update_department_title')" />
                  <v-list-tile-sub-title v-text="$t('management.index.update_department_sub_title')"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-avatar>
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-list-tile-avatar>
              </v-list-tile>

              <v-list-tile v-if="isOwner" @click.prevent="$router.push({ name: 'EditManager', params: { type: 'ChangeManager', id: company }})">
                <v-list-tile-content>
                  <v-list-tile-title v-text="$t('management.index.change_administrator_title')" />
                  <v-list-tile-sub-title v-text="$t('management.index.change_administrator_sub_title')"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-avatar>
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-list-tile-avatar>
              </v-list-tile>

              <v-list-tile v-if="isOwner || isAdmin" @click.prevent="$router.push({name: 'InviteFriends', params:{companyId:company }})">
                <v-list-tile-content>
                  <v-list-tile-title v-text="$t('management.index.invite_member_mail_title')" />
                  <v-list-tile-sub-title v-text="$t('management.index.invite_member_mail_sub_title')"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-avatar>
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-list-tile-avatar>
              </v-list-tile>

              <v-list-tile @click.prevent="$router.push({name: 'DepartmentInfoPage', params:{companyId:company }})">
                <v-list-tile-content>
                  <v-list-tile-title v-text="$t('management.index.certification_organization_member_title')" />
                  <v-list-tile-sub-title v-text="$t('management.index.certification_organization_member_sub_title')"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-avatar>
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-list-tile-avatar>
              </v-list-tile>

              <v-list-tile v-if="isOwner" @click.prevent="$router.push({ name: 'AddStamp', params: { id: company }})">
                <v-list-tile-content>
                  <v-list-tile-title v-text="$t('add_stamp_router')" />
                  <v-list-tile-sub-title v-text="$t('add_stamp_router_desc')"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-avatar>
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-list-tile-avatar>
              </v-list-tile>

            </v-list>
          </v-card>
        </v-flex>
        <AddBtn/>
      </v-layout>
    </v-container>

  </v-flex>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getters, actions } from './../../store/type.js';

export default {
  name: 'ManagementIndex',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (sessionStorage.getItem('cache-current-company-index') && from.name !== 'Index') {
        vm.company = Number(sessionStorage.getItem('cache-current-company-index'));
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.company) {
      sessionStorage.setItem('cache-current-company-index', JSON.stringify(this.company));
    }

    next();
  },
  data() {
    return {
      isNotJoinAnyCompant: true,
      companyList: [],
      settingItems: [
        {
          title: this.$t('management.index.change_manager'),
          value: 'ChangeManager'
        },
        { title: this.$t('management.index.add_manager'), value: 'AddManager' }
      ],
      company: sessionStorage.getItem('cache-current-company-index')
        ? Number(sessionStorage.getItem('cache-current-company-index'))
        : 0,
      username: '',
      companyName: '',
      isAdmin: false,
      isOwner: false
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA,
      userEntity: getters.USER_ENTITY
    }),
    userRoleText() {
      if (this.isOwner) {
        return this.$t('common.top_administrator');
      }
      if (this.isAdmin) {
        return this.$t('common.department_administrator');
      }
      return this.$t('common.member');
    }
  },
  created() {
    const { email, role, companyList, companyId, token } = this.USER_DATA;
    this.isNotJoinAnyCompant = companyList.length === 0;

    this.username = email;
    this.companyList = companyList;
    this.company = this.userEntity === 0 ? companyId : this.userEntity;
    this.companyName = this.companyList.find(c => c.id === this.company).name;
  },
  methods: {
    ...mapActions({
      GET_SIGNING_CORPS: actions.GET_SIGNING_CORPS
    }),

    goPage() {
      return;
    },

    changeCompany() {
      const department = this.companyList.find(({ id }) => id === this.company).department;
      this.companyName = this.companyList.find(c => c.id === this.company).name;
      this.isOwner = this.companyList.find(({ id }) => id === this.company).role === 1;
      this.isAdmin = !!department.find(({ adminId }) => adminId === this.USER_DATA.userId);
    }
  }
};
</script>

<style lang="scss">
#managementIndex {
  .v-list {
    padding: 0;
  }
  .v-list__tile__sub-title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: pre-wrap;
  }
  .v-list__tile.v-list__tile--link.theme--light {
    height: 70px;
  }
  .primary--text {
    color: #10acce !important;
    caret-color: #10acce !important;
  }
  .v-input__slot:before {
    display: none;
  }
  .v-select__selections {
    margin-left: 16px;
  }
  .v-text-field .v-input__append-inner {
    margin-right: 16px;
  }
  .v-text-field > .v-input__control > .v-input__slot:after,
  .v-text-field > .v-input__control > .v-input__slot:before {
    display: none;
  }
  .b-list {
    cursor: pointer;
  }
}
</style>
