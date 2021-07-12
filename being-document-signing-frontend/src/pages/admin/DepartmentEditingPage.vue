<template>
  <v-flex id="department_editing_page"
          ref="container">
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('department_editing.title_text')"></header-title>
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
                    class="b-btn-area mt-4">
              <v-btn round
                     large
                     class="b-btn"
                     @click.stop="openAddDepartmentModal"
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
                           ripple>
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.name" />
                  <v-list-tile-sub-title v-text="item.email" />
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon
                         round
                         @click.stop="delDepartment(item)">
                    <v-icon color="rgba(25,31,37,.28)">delete_forever</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < departmentList.length"
                         :key="index" />
            </template>
          </v-list>
          <v-flex xs12
                  sm12
                  ma-2
                  d-flex
                  class="b-btn-area">
            <v-btn round
                   large
                   class="b-btn"
                   @click="openAddDepartmentModal"
                   v-text="$t('common.add')" />
          </v-flex>
        </v-flex>

      </v-layout>
    </v-container>
    <v-dialog
      class="b-dialog"
      v-model="isOpenAddDepartmentModal"
      width="500"
    >
      <v-card>
        <v-card-title
          class="title headline"
          v-text="$t('department_editing.add_department_modal_tile.text')"
        />
        <v-card-text>
          <v-btn id="close_btn"
                 label
                 flat
                 icon
                 @click="closeAddDepartmentModal">
            <v-icon>close</v-icon>
          </v-btn>
          <v-form ref="form"
                  v-model="valid"
                  lazy-validation>
            <v-flex xs12>
              <p class="b-label" v-text="$t('department_editing.add_department_modal_input_title.text')"></p>
            </v-flex>
            <v-text-field class="b-input"
                          validate-on-blur
                          v-model.trim="param.name"
                          :rules="rules.departmentName"
                          :placeholder="$t('common.department_placeholder')"
                          single-line
                          outline
                          required />
          </v-form>
        </v-card-text>


        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="cancel b-btn white"
            round
            v-text="$t('common.cancel')"
            @click="closeAddDepartmentModal"
          >
            I accept
          </v-btn>
          <v-btn
            class="confirm b-btn"
            round
            v-text="$t('common.confirm')"
            @click="addDepartment"
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-flex>
</template>
<script>
import rulesMixin from '../../mixins/Rules';
import { mapActions, mapGetters } from 'vuex';
import { actions, getters } from './../../store/type.js';

export default {
  mixins: [rulesMixin],
  data() {
    return {
      valid: false,
      isOpenAddDepartmentModal: false,
      administratorList: [],
      isLoading: false,
      param: {
        adminId: '',
        companyId: '',
        name: null
      },
      departmentList: []
    };
  },
  computed: {
    showAddDepartment() {
      return this.departmentList <= 0;
    },
    getLoadingWording() {
      if (this.hasNext) {
        return this.$t('common.loading');
      } else {
        return '';
      }
    }
  },
  async created() {
    this.param.companyId = this.$route.params.id;
    this.departmentList = await this.GET_ORGANIZATION_DEPARTMENTS({ companyId: this.param.companyId });
    this.administratorList = await this.GET_SIGNING_USERS({
      corpId: this.param.companyId,
      role: 'admin'
    });
  },
  methods: {
    ...mapActions({
      GET_SIGNING_USERS: actions.GET_SIGNING_USERS,
      GET_ORGANIZATION_DEPARTMENTS: actions.GET_ORGANIZATION_DEPARTMENTS,
      POST_ORGANIZATION_DEPARTMENT_CREATE: actions.POST_ORGANIZATION_DEPARTMENT_CREATE,
      POST_ORGANIZATION_DEPARTMENTS_DELETE: actions.POST_ORGANIZATION_DEPARTMENTS_DELETE
    }),
    delDepartment(data) {
      this.modal.show({
        title: this.$t('common.del_confirmed'),
        content: this.$t('department_editing.del.text'),
        onConfirm: async () => {
          await this.POST_ORGANIZATION_DEPARTMENTS_DELETE({
            departmentId: data.id
          });
          this.departmentList = await this.GET_ORGANIZATION_DEPARTMENTS({ companyId: this.param.companyId });
        }
      });
    },
    openAddDepartmentModal() {
      this.isOpenAddDepartmentModal = true;
    },
    async addDepartment() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        await this.POST_ORGANIZATION_DEPARTMENT_CREATE({
          name: this.param.name,
          companyId: this.param.companyId
        });
        this.departmentList = await this.GET_ORGANIZATION_DEPARTMENTS({ companyId: this.param.companyId });
        this.toast.show({
          icon: 'check',
          content: this.$t('common.add_success')
        });
      } finally {
        this.param.name = '';
        this.closeAddDepartmentModal();
      }
    },
    closeAddDepartmentModal() {
      this.isOpenAddDepartmentModal = false;
    }
  }
};
</script>
<style lang="scss">
#department_editing_page {
  // overflow: hidden;
  // max-height: 100vh;
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
    height: calc(100vh - 120px);
    padding: 4px 0;
    overflow: auto;
  }
}
</style>
