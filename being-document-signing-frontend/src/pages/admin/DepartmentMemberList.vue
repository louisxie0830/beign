<template>
  <v-flex id="department_member_list"
          ref="container">
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="departmentName"></header-title>
      </v-flex>
      <v-flex xs2>
        <v-menu
          v-if="isOwner"
          bottom
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" class="cloud-upload">cloud_upload</v-icon>
          </template>
          <v-list>
            <div class="menu-upload" @click="uploadCSV">{{ $t('uploadCSV') }}</div>
            <a href="/static/部門上傳範例.csv" download="部門上傳範例" class="menu-down">{{ $t('downloadSCV') }}</a>
            <input style="display: none;"
                   ref="files"
                   type="file"
                   accept=".csv, text/csv"
                   @change="handleFilesUpload();">
          </v-list>
        </v-menu>
      </v-flex>
    </v-toolbar>
    <v-container pa-0>
      <v-layout>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3
                v-show="showAddContact">
          <div>
            <img class="people"
                 src="./../../assets/image/people@2x.png">
            <p class="b-context"
               v-text="$t('department_member_list.add_member.text')" />
            <v-flex xs12
                    sm12
                    ma-3
                    d-flex
                    class="b-btn-area mt-4">
              <v-btn round
                     large
                     class="b-btn"
                     v-if="isOwner" @click.prevent="$router.push({name: 'CheckList', params: { id: companyId }})"
                     v-text="$t('common.add')" />
            </v-flex>
          </div>
        </v-flex>

        <v-flex v-show="!showAddContact"
                xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <div class="search">
            <v-text-field class="b-input"
                          v-model.lazy="searchName"
                          @input="searchContact"
                          :placeholder="$t('common.search_word_placeholder')"
                          outline />
          </div>
          <v-list class="b-list">
            <template v-for="(item, index) in fuzzySearchName">
              <v-list-tile :key="index + item.id"
                           avatar
                           ripple @click.stop="$router.push({ name: 'UserInfo', params: { companyId: companyId, userId: item.id } })">
                <v-list-tile-avatar >
                  <v-icon v-if="item.isAdmin" color="yellow darken-2">star</v-icon>
                  <v-icon v-else color="grey lighten-1">star</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="mb-1" v-text="item.name" />
                  <v-list-tile-sub-title class="mb-1" @click.stop="sendMail(item.email)">
                    <v-icon>mail_outline</v-icon><span class="ml-1"> {{ item.email }}</span>
                  </v-list-tile-sub-title>
                  <v-list-tile-sub-title @click.stop="callPhone(item.mobile)">
                    <v-icon>phone</v-icon><span class="ml-1">{{ item.mobile | formatPhoneNumber(item.mobileCode, 'rfc3966') }}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon
                         round
                         @click.stop="$router.push({ name: 'UserInfo', params: { companyId: companyId, userId: item.id } })">
                    <v-icon color="rgba(25,31,37,.28)">keyboard_arrow_right</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider :key="index" />
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { actions, getters } from '../../store/type.js';
export default {
  props: {
    companyId: {
      type: String,
      required: true
    },
    departmentId: {
      type: String,
      required: true
    },
    departmentName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      memberList: [],
      searchName: '',
      companyList: []
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA
    }),
    fuzzySearchName() {
      if (this.searchName) {
        return this.memberList.filter(c => {
          let regex = new RegExp('(' + this.searchName + ')', 'i');
          return c.name.match(regex);
        });
      }
      return this.memberList;
    },
    showAddContact() {
      return this.memberList.length === 0;
    },
    isOwner() {
      return this.companyList.find(({ id }) => id === +this.companyId).role === 1;
    },
    isAdmin() {
      const department = this.companyList.find(({ id }) => id === +this.companyId).department;
      return department && !!department.find(({ adminId }) => +adminId === this.USER_DATA.userId);
    }
  },
  async created() {
    const { companyList } = this.USER_DATA;
    this.companyList = companyList;

    const memberList = await this.GET_ORGANIZATION_DEPARTMENT_QUERY({
      departmentId: +this.departmentId,
      companyId: +this.companyId
    });
    this.memberList = memberList
      .map(item => {
        item.mobileCode = PhoneNumber(`+${item.mobile}`).getRegionCode();
        return item;
      })
      .sort(item => {
        return item.isAdmin ? -1 : 1;
      });

    console.log('this.memberList: ', this.showAddContact);
  },
  methods: {
    ...mapActions({
      GET_ORGANIZATION_DEPARTMENT_QUERY: actions.GET_ORGANIZATION_DEPARTMENT_QUERY
    }),
    uploadCSV() {
      this.$refs.files.click();
    },
    handleFilesUpload() {
      const uploadedFiles = this.$refs.files.files;
      const formData = new FormData();
      formData.append('file', uploadedFiles[0]);
      formData.append('departmentId', +this.departmentId);
      formData.append('companyId', +this.companyId);
      this.$store
        .dispatch('POST_INVITE_CREATE_MULTIPLE', { formData: formData })
        .then(({ data }) => {
          this.toast.show({
            icon: 'info',
            content: this.$t('uploadCSVSuccess')
          });
        })
        .finally(() => {
          this.$refs.files.value = '';
          this.$forceUpdate();
        });
    },
    sendMail(mail) {
      window.open(`mailto:${mail}`);
    },

    callPhone(phone) {
      window.location.href = `tel://"+${phone}`;
    }
  }
};
</script>

<style lang="scss">
@import './../../assets/scss/_variables.scss';
#department_member_list {
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
  .v-list__tile {
    padding: 0 10px;
    margin: 0 auto;
  }
  .v-list__tile.v-list__tile--link.theme--light {
    height: 100px;
    .v-list__tile__sub-title i {
      font-size: 14px;
    }
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
  .cloud-upload {
    cursor: pointer;
  }
  .b-list {
    height: calc(100vh - 120px);
    padding: 4px 0;
    overflow: auto;
  }
}
.menu-upload,
.menu-down {
  padding: 5px 15px;
  cursor: pointer;
  color: #333;
  text-decoration: none;
}
.menu-upload:hover,
.menu-down:hover {
  background-color: #ddd;
}
</style>
