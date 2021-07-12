<template>
  <v-flex id="certificationPage">
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('account_info.certification_title')"></header-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-2>
      <v-layout>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <v-card class="pb-2">
            <v-subheader v-text="$t('common.company_role')"/>
            <v-select
              v-if="companyList.length > 0"
              v-model="companyId"
              dense
              attach
              item-text="name"
              item-value="id"
              :items="companyList"
              :change="changeCompany()"/>
            <v-subheader v-text="$t('common.publish_date')"/>
            <v-layout align-center justify-space-around row fill-height>
              <DatePickerRange class="pa-2"
                               ref="datePickerRange"
                               :labels="labels"
                               highlight-range
                               :prepend-inner-icon="'event'"
                               @input="onDateRangeChange" />
              <v-btn class="reset-btn"
                     flat
                     @click.stop.prevent="resetDate">
                <v-icon>cancel</v-icon>{{ $t('sign_document.clear_select_date.text') }}
              </v-btn>
            </v-layout>
            <v-layout pa-2 class="b-content">
              <v-flex xs12
                      sm12
                      d-flex>
                <v-tabs slot="extension"
                        v-model="tabs"
                        centered
                        grow>
                  <v-tab v-for="item in titleList"
                         :key="item.value"
                         @click.native="getActiveTab(item.value)">
                    {{ item.title }}
                  </v-tab>
                  <v-tab-item class="pt-2" v-show="param.type === 1">
                    <v-list two-line>
                      <template v-for="(item, index) in certificationList" v-show="certificationList.length > 0">
                        <v-list-tile :key="item.id"
                                     avatar
                                     ripple>
                          <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}
                            </v-list-tile-title>
                            <v-list-tile-sub-title>{{ item.completeTime | dateformat('YYYY/MM/DD HH:mm') }}</v-list-tile-sub-title>
                          </v-list-tile-content>
                          <v-list-tile-action>
                            <span class="link">
                              <a @click="donwloadFile(item)">
                                <v-icon>get_app</v-icon><span> {{ $t("common.download") }}</span>
                              </a>
                              <a @click="getPDFPreviewUrl(item)">
                                <v-icon>search</v-icon><span>{{ $t('common.preview') }}</span>
                              </a>
                            </span>
                          </v-list-tile-action>
                        </v-list-tile>
                        <v-divider :key="index" />
                      </template>
                      <template>
                        <v-content v-show="certificationList.length <= 0">
                          <v-flex xs12
                                  sm8
                                  offset-sm2
                                  class="pt-2">
                            <div class="work-outline-wording">{{ $t('common.no_same_data.text') }}</div>
                          </v-flex>
                        </v-content>
                      </template>
                    </v-list>
                  </v-tab-item>
                  <v-tab-item class="pt-2" v-show="param.type === 2">
                    <v-list two-line>
                      <template v-for="(item, index) in certificationList" v-show="certificationList.length > 0">
                        <v-list-tile :key="item.id"
                                     avatar
                                     ripple>
                          <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}
                            </v-list-tile-title>
                            <v-list-tile-sub-title>{{ item.completeTime | dateformat('YYYY/MM/DD HH:mm') }}</v-list-tile-sub-title>
                          </v-list-tile-content>
                          <v-list-tile-action>
                            <span class="link">
                              <a @click="donwloadFile(item)">
                                <v-icon>get_app</v-icon><span> {{ $t("common.download") }}</span>
                              </a>
                              <a @click="getPDFPreviewUrl(item)">
                                <v-icon>search</v-icon><span>{{ $t('common.preview') }}</span>
                              </a>
                            </span>
                          </v-list-tile-action>
                        </v-list-tile>
                        <v-divider :key="index" />
                      </template>
                      <template >
                        <v-content v-show="certificationList.length <= 0">
                          <v-flex xs12
                                  sm8
                                  offset-sm2
                                  class="pt-2">
                            <div class="work-outline-wording">{{ $t('common.no_same_data.text') }}</div>
                          </v-flex>
                        </v-content>
                      </template>
                    </v-list>
                  </v-tab-item>
                  <v-tab-item class="pt-2" v-show="param.type === 3">
                    <v-list two-line>
                      <template v-for="(item, index) in certificationList" v-show="certificationList.length > 0">
                        <v-list-tile :key="item.id"
                                     avatar
                                     ripple>
                          <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}
                            </v-list-tile-title>
                            <v-list-tile-sub-title>{{ item.completeTime | dateformat('YYYY/MM/DD HH:mm') }}</v-list-tile-sub-title>
                          </v-list-tile-content>
                          <v-list-tile-action>
                            <span class="link">
                              <a @click="donwloadFile(item)">
                                <v-icon>get_app</v-icon><span> {{ $t("common.download") }}</span>
                              </a>
                              <a @click="getPDFPreviewUrl(item)">
                                <v-icon>search</v-icon><span>{{ $t('common.preview') }}</span>
                              </a>
                            </span>
                          </v-list-tile-action>
                        </v-list-tile>
                        <v-divider :key="index" />
                      </template>
                      <template>
                        <v-content v-show="certificationList.length <= 0">
                          <v-flex xs12
                                  sm8
                                  offset-sm2
                                  class="pt-2">
                            <div class="work-outline-wording">{{ $t('common.no_same_data.text') }}</div>
                          </v-flex>
                        </v-content>
                      </template>
                    </v-list>
                  </v-tab-item>
                </v-tabs>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <PDFViewerModal :show="showPDFPreview"
                    :options="options"
                    @updatePDFPreviewStatus="updatePDFPreviewStatus" />
  </v-flex>
</template>

<script>
import PDFViewerModal from '../../components/PDFViewerModal.vue';

import { mapGetters, mapActions } from 'vuex';
import { getters, actions } from '../../store/type';

export default {
  components: {
    PDFViewerModal
  },

  data() {
    return {
      tabs: null,
      titleList: [
        {
          title: this.$t('common.send_sign.text'),
          value: 1
        },
        {
          title: this.$t('common.signed.text'),
          value: 2
        },
        {
          title: this.$t('common.agreed.text'),
          value: 3
        }
      ],
      labels: {
        start: this.$t('common.select_date.text'),
        end: this.$t('common.select_date.text')
      },
      param: {
        companyId: null,
        type: 1,
        start: 0,
        limit: Number.MAX_SAFE_INTEGER,
        beginDate: '',
        endDate: ''
      },
      companyList: [],
      companyId: '',
      certificationList: [],
      showPDFPreview: false,
      options: {}
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA,
      userEntity: getters.USER_ENTITY
    })
  },
  created() {
    this.$nextTick(() => {
      const { companyList } = this.USER_DATA;
      this.companyList.push({
        id: 0, // this.USER_DATA.userId,
        name: this.$t('common.person'),
        role: this.USER_DATA.role,
        type: 'userId'
      });
      if (companyList.length > 0) {
        for (const item of companyList) {
          this.companyList.push({
            ...{ type: 'companyId' },
            ...item
          });
        }
      }

      this.companyId = this.userEntity || this.companyList[0].id;
    });
  },
  methods: {
    ...mapActions({
      GET_CERTIFICATION_LIST: actions.GET_CERTIFICATION_LIST
    }),

    changeCompany() {
      if (this.param.companyId === this.companyId) return;
      this.$nextTick(() => {
        this.param.companyId = this.companyId;
        this.getCertificationList();
      });
    },

    onDateRangeChange(date) {
      this.$nextTick(() => {
        date = date.filter(item => item);
        switch (date.length) {
          case 1:
            this.param.beginDate = date[0];
            this.getCertificationList();
            break;
          case 2:
            this.param.beginDate = date[0];
            this.param.endDate = date[1];
            this.getCertificationList();
            break;
        }
      });
    },

    resetDate() {
      this.$nextTick(() => {
        this.$refs.datePickerRange.startDate = '';
        this.$refs.datePickerRange.endDate = '';
        this.param.beginDate = '';
        this.param.endDate = '';
        this.getCertificationList();
      });
    },

    getActiveTab(value) {
      this.$nextTick(() => {
        this.param.type = value;
        this.getCertificationList();
      });
    },

    getCertificationList() {
      this.$nextTick(async () => {
        try {
          if (+this.USER_DATA.userId === +this.param.companyId) {
            const params = {
              type: this.param.type,
              start: 0,
              limit: Number.MAX_SAFE_INTEGER,
              beginDate: this.param.beginDate,
              endDate: this.param.endDate
            };
            this.certificationList = await this.GET_CERTIFICATION_LIST(params);
          } else {
            this.certificationList = await this.GET_CERTIFICATION_LIST(this.param);
          }
        } catch (error) {
          console.error('error: ', error);
        }
      });
    },

    donwloadFile({ id }) {
      const downloadUrl = `${process.env.BASE_URL}/certification/info?letterId=${id}&accessToken=${
        this.USER_DATA.token
      }`;

      const link = document.createElement('a');
      link.setAttribute('type', 'hidden');
      link.href = downloadUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    getPDFPreviewUrl({ id, title }) {
      this.options = {
        fileName: title,
        url: `${process.env.BASE_URL}/certification/preview?letterId=${id}&accessToken=${this.USER_DATA.token}`
      };
      this.showPDFPreview = true;
    },

    updatePDFPreviewStatus(type, options = null) {
      if (!!type) {
        this.showPDFPreview = true;
      } else {
        this.showPDFPreview = false;
      }
      this.options = options;
    }
  }
};
</script>


<style lang="scss">
@import './../../assets/scss/_variables.scss';
#certificationPage {
  .date-range__pickers--start {
    .b-input:first-child::after {
      content: '~';
      display: block;
      margin-top: 5px;
      margin-right: 2px;
      margin-left: 2px;
      color: #91939a;
    }
  }
  .v-text-field {
    height: 40px;
    .v-icon {
      font-size: 18px;
      margin-left: 22px;
      margin-top: 10px;
      margin-right: 10px;
    }
    padding-top: 0;
    .v-input__control > .v-input__slot {
      margin-bottom: 0;
      &:before {
        border-style: none;
      }
    }
    input {
      font-size: 12px;
      line-height: 24px;
      color: #91939a;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
  .reset-btn {
    font-size: 12px;
    width: 72px;
    height: 17px;
    color: #92929b !important;
    i {
      font-size: 12px;
    }
  }
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
  .v-list__tile {
    padding: 0 10px;
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
  .v-tabs__item {
    font-size: 14px;
    margin: auto;
  }
  .v-tabs__bar.theme--light {
    margin: auto;
    border-bottom: 1px solid $divider;
  }
  .accent {
    background-color: $turquoise-blue !important;
    border-color: $turquoise-blue !important;
  }
  .link {
    font-size: 12px;
    float: right;
    vertical-align: middle;
    a {
      margin-left: 6px;
      cursor: pointer;
    }
    i,
    span {
      font-size: 10px !important;
      vertical-align: middle;
      color: $dark-56;
      cursor: pointer;
    }
  }
}
</style>
