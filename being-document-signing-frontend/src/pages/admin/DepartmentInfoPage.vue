<template>
  <v-flex id="department_info_page"
          ref="container">
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="companyName"></header-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-0>
      <v-layout>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3
                v-show="showAddDepartment">
          <div>
            <img class="people"
                 src="./../../assets/image/people@2x.png">
            <p class="b-context"
               v-text="$t('department_editing.add_member.text')" />
            <v-flex xs12
                    sm12
                    ma-3
                    d-flex
                    class="b-btn-area mt-4"
                    v-if="isOwner">
              <v-btn round
                     large
                     class="b-btn"
                     @click.stop="jumpToDepartmentEditingPage"
                     v-text="$t('common.add')" />
            </v-flex>
          </div>
        </v-flex>

        <v-flex v-show="!showAddDepartment"
                xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <v-list class="b-list">
            <template v-for="(item, index) in departmentList">
              <v-list-tile :key="index + item.name"
                           avatar
                           ripple
                           @click.stop="jumpToDepartmentMemberPage(item)">
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.name" />
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon
                         round
                         @click.stop="jumpToDepartmentMemberPage(item)">
                    <v-icon color="rgba(25,31,37,.28)">keyboard_arrow_right</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < departmentList.length"
                         :key="index" />
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { actions, getters } from './../../store/type.js';

export default {
  data() {
    return {
      departmentList: [],
      companyName: '',
      companyList: []
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA
    }),
    showAddDepartment() {
      return this.departmentList <= 0;
    },
    getLoadingWording() {
      if (this.hasNext) {
        return this.$t('common.loading');
      } else {
        return '';
      }
    },
    isOwner() {
      return this.companyList.find(({ id }) => id === +this.$route.params.companyId).role === 1;
    }
  },
  async created() {
    const { companyList } = this.USER_DATA;
    this.companyList = companyList;
    this.companyName = companyList.find(item => {
      return item.id === Number(this.$route.params.companyId);
    }).name;
    this.departmentList = await this.GET_ORGANIZATION_DEPARTMENTS({ companyId: this.$route.params.companyId });
    this.departmentList.unshift({
      id: 0,
      name: '未分類'
    });
  },
  methods: {
    ...mapActions({
      GET_ORGANIZATION_DEPARTMENTS: actions.GET_ORGANIZATION_DEPARTMENTS
    }),
    jumpToDepartmentEditingPage() {
      this.$router.push({
        name: 'DepartmentEditingPage',
        params: { id: this.$route.params.companyId }
      });
    },
    jumpToDepartmentMemberPage(departmentData) {
      console.log('departmentData: ', departmentData);
      this.$router.push({
        name: 'DepartmentMemberList',
        params: {
          companyId: this.$route.params.companyId,
          departmentId: departmentData.id,
          departmentName: departmentData.name
        }
      });
    }
  }
};
</script>
<style lang="scss">
#department_info_page {
  .b-icon-add {
    font-size: 80px;
  }
  .people {
    margin-top: 40px;
    width: 117px;
    height: 103px;
    object-fit: contain;
  }
  .search {
    background-color: #fff;
    padding-top: 8px;
    padding-left: 14px;
    padding-right: 14px;
  }
  .b-input {
    .v-input__slot {
      border: 1px solid #dcdfe6 !important;
      min-height: 40px !important;
      background: #ededee !important;
      color: rgba(25, 31, 37, 0.4) !important;

      .v-text-field__slot {
        margin: 0;
        & input {
          margin-top: 4px !important;
        }
      }
    }
    &.v-input--is-focused.v-input--has-state {
      .v-input__slot {
        border: 1px solid red !important;
      }
    }
    &.v-messages .theme--light {
      display: none;
    }
    .v-text-field__details {
      display: none;
    }
  }
  .b-list {
    height: 100%;
    padding: 4px 0;
    overflow: auto;
  }
}
</style>
