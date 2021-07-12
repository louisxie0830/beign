<template>
  <v-flex id="signDocs"
          :class="{'b-content': !isDefaultEmpty}"
          ref="container"
          v-infinite-scroll="handleScroll">
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <v-toolbar-title @click="$router.push('/')"><div class="logo-title"><div class="logo-box"><span class="logo-image"></span></div><div class="logo-content" >{{ getLetterStatus(getSingpParamType) }}</div></div></v-toolbar-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <template v-if="!isDefaultEmpty">
      <v-layout>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <v-text-field class="b-input search"
                        v-model.lazy="queryParam.keyWord"
                        v-disable-paste
                        :placeholder="$t('common.search_title_placeholder')"
                        clearable
                        outline
                        append-icon="search"
                        append-outer-icon="filter_list"
                        @input="search"
                        @click:append-outer="openAdvSearchModal" />

          <v-list id="b-sign-list">

            <div id="adv_search"
                 class="text-align-l mb-2 pl-3">
              <v-chip v-show="advDate"
                      outline
                      close
                      color="#13c3ea"
                      @input="delAdvTag('date')">{{ advDate }}</v-chip>
              <v-chip v-show="queryParam.status || queryParam.status === 0"
                      outline
                      close
                      color="#13c3ea"
                      @input="delAdvTag('letterStatus')">{{ getDocumentStatusInfo(queryParam.status).wording }}</v-chip>
              <v-chip v-show="queryParam.tagIds.length > 0"
                      v-for="tag in queryParam.tagIds"
                      :key="tag.id"
                      outline
                      close
                      color="#13c3ea"
                      @input="delAdvTag('tags', tag)">{{ getTagName(tag) }}</v-chip>
            </div>

            <template v-for="(doc, index) in documents">
              <v-list-tile id="document_list"
                           :class="[ doc.read ? 'readed' : 'unread']"
                           :key="doc.id"
                           :ripple="false"
                           @click="getInfo(doc)">
                <v-list-tile-content>
                  <v-list-tile-title>
                    <span>{{ doc.title }}</span>
                    <v-icon v-if="doc.isMain"
                            color="yellow darken-2">
                      star
                    </v-icon>
                  </v-list-tile-title>
                  <v-list-tile-sub-title class="company_name"> {{ doc.companyName || '' }} {{ doc.senderName }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>

                    <v-chip small
                            label
                            @click.stop="searchStatus(doc.status)"
                            :color="isExpiredColor(doc) ? '#fb8c00' : getDocumentStatusInfo(doc.status).color"
                            text-color="white"
                            v-if="getSingpParamType != 1"
                            v-text="getDocumentStatusInfo(doc.status).wording" />

                    <v-chip v-show="doc.tagNames.length > 0"
                            v-for="(tag, index) in doc.tagNames"
                            :key="index"
                            class="no-margin"
                            small
                            label
                            text-color="#626167"
                            @click.stop="searchTag(tag)"
                            v-text="tag" />

                  </v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <span class="doc-state-date">{{ doc.createTime | dateformat('YYYY/MM/DD') }}</span>
                </v-list-tile-action>

              </v-list-tile>
              <v-divider :key="index" />
            </template>
            <v-flex ma-3
                    v-if="!isLoading && getLoadingWording"
                    v-text="getLoadingWording" />
            <v-flex ma-3
                    v-else-if="isLoading">
              <v-progress-circular indeterminate
                                   color="primary" />
            </v-flex>
          </v-list>
        </v-flex>
      </v-layout>
    </template>
    <template v-else>
      <v-content>
        <v-flex xs12
                sm8
                offset-sm2>
          <div class="work-outline-label">
            <img style="width:200px; height:160px"
                 :src="emptyImg">
          </div>
        </v-flex>
        <v-flex xs12
                sm8
                offset-sm2>
          <div class="work-outline-wording"
               v-text="$t('sign_documents.no_data.text')">暫無相關文件</div>
        </v-flex>
      </v-content>
    </template>
    <template v-if="documents.length === 0 && !isDefaultEmpty && !isLoading">
      <v-content>
        <v-flex xs12
                sm8
                offset-sm2>
          <div class="work-outline-wording">{{ $t('common.no_same_data.text') }}</div>
        </v-flex>
      </v-content>
    </template>
  </v-flex>
</template>

<script>
import STATUS from './../../utils/status.js';

import { mapActions, mapGetters, mapMutations } from 'vuex';
import { actions, mutations, getters } from './../../store/type.js';
import signMixin from './../../mixins/Sign.js';
const { LETTER_STATUS, SOURCE_STATUS } = STATUS;

export default {
  name: 'SignDocuments',
  mixins: [signMixin],
  data() {
    return {
      emptyImg: require('./../../assets/image/empty@3x.png'),
      hasNext: false,
      isLoading: false,
      isInit: false,
      documents: [],
      isDefaultEmpty: false,
      queryParam: {
        type: +this.$route.params.type,
        start: 0,
        limit: 20,
        keyWord: '',
        beginDate: '',
        endDate: '',
        tagIds: [],
        status: ''
      }
    };
  },
  computed: {
    ...mapGetters({
      TAG_LIST: getters.TAG_LIST
    }),
    getLoadingWording() {
      if (this.isInit) {
        return this.isLoading && this.hasNext ? this.$t('common.loading') : '';
      } else {
        return this.isLoading && this.hasNext ? this.$t('common.loading') : '';
      }
    },
    getSingpParamType() {
      return this.$route.params.type;
    },
    getLetterStatus() {
      return state => {
        let wording = '';
        state = parseInt(state);
        switch (state) {
          case SOURCE_STATUS.AWAITING_SIGNATURE:
            wording = this.$t('common.awaiting_signature'); //'待簽署']
            break;
          case SOURCE_STATUS.MY_STARTED_SIGNATURE:
            wording = this.$t('common.my_started_signature');
            break;
          case SOURCE_STATUS.MY_SIGNED:
            wording = this.$t('common.my_signed');
            break;
          case SOURCE_STATUS.ACCEPTED_COPY:
            wording = this.$t('common.accepted_copy');
            break;
          case SOURCE_STATUS.HISTORIES:
            wording = this.$t('common.histories');
            break;
          default:
            wording = 'UNKONW';
            break;
        }
        return wording;
      };
    },
    getDocumentStatusInfo() {
      return state => {
        let color = '#f25643';
        let wording = 'UNKOWN';
        state = parseInt(state);
        for (let i = 0, len = this.LETTER_TAGS.length; i < len; i++) {
          if (state === this.LETTER_TAGS[i].type) {
            color = this.LETTER_TAGS[i].color;
            wording = this.LETTER_TAGS[i].wording;
          }
        }
        return { color, wording };
      };
    },
    advDate() {
      if (this.queryParam.beginDate && this.queryParam.endDate) {
        return this.queryParam.beginDate + '~' + this.queryParam.endDate;
      } else if (this.queryParam.beginDate && !this.queryParam.endDate) {
        return this.queryParam.beginDate;
      } else {
        return '';
      }
    }
  },
  async created() {
    await this.loadLetterList(this.queryParam, true);
    // 待我签署显示文件提示信息
    if (this.queryParam.type === 1) {
      this.IS_SHOW_FILE_TIPS(true);
    } else {
      this.IS_SHOW_FILE_TIPS(false);
    }
  },
  methods: {
    ...mapActions({
      GET_LETTER_LIST: actions.GET_LETTER_LIST
    }),
    ...mapMutations({
      SET_DOCUMENT: mutations.SET_DOCUMENT,
      UPDATE_TAG_LIST: mutations.UPDATE_TAG_LIST,
      IS_SHOW_FILE_TIPS: mutations.IS_SHOW_FILE_TIPS
    }),
    isExpiredColor(doc) {
      const expiredTime = new Date(doc.expiredTime);
      const nowDate = new Date();
      return (
        doc.expiredTime !== '1970-01-01T15:59:59.000Z' &&
        doc.expiredTime &&
        doc.status === STATUS.LETTER_STATUS.SIGNING &&
        nowDate.valueOf() > expiredTime.valueOf()
      );
    },
    searchTag(tag) {
      const tagIds = this.queryParam.tagIds;
      const id = this.getTagId(tag);
      if (id && tagIds.indexOf(id) < 0) {
        tagIds.push(id);
      }
      const date = this.advDate ? this.advDate.split('~') : [];
      const status = this.queryParam.status;
      this.advSearch({ date, tags: tagIds, status });
    },
    searchStatus(doc) {
      const date = this.advDate ? this.advDate.split('~') : [];
      const tagIds = this.queryParam.tagIds;
      this.advSearch({ date, tags: tagIds, status: doc });
    },
    async handleScroll() {
      let scrollTop = document.documentElement.scrollTop + document.body.scrollTop;
      let windowsHeight = window.innerHeight;
      let scrollPosition = windowsHeight + scrollTop;
      let targeElementHeight = parseInt(this.$refs.container.clientHeight);

      if (targeElementHeight - scrollPosition <= 200) {
        if (this.hasNext && !this.isLoading) {
          await this.loadLetterList(this.queryParam);
        }
      }
    },
    async loadLetterList(param, isInit = false) {
      this.isLoading = true;
      try {
        let result = await this.GET_LETTER_LIST(param);

        if (result.length < this.queryParam.limit) {
          this.documents = this.documents.concat(result);
          this.hasNext = false;
        } else {
          this.documents = this.documents.concat(result);
          this.queryParam.start = result.length + this.queryParam.start;
          this.hasNext = true;
        }
        this.isInit = isInit;
        this.isDefaultEmpty = this.documents.length === 0 && !!this.isInit;
      } finally {
        this.isLoading = false;
      }
    },
    search: (function() {
      let timer = null;
      const delay = 200;
      return function() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          this.queryParam.start = 0;
          this.queryParam.limit = 20;
          this.documents = [];
          this.loadLetterList(this.queryParam);
        }, delay);
      };
    })(),
    getInfo(detail) {
      detail.statusInfo = this.getDocumentStatusInfo(detail.status);
      this.SET_DOCUMENT({
        detail,
        letterType: this.getSingpParamType,
        letterTypeName: this.getLetterStatus(this.getSingpParamType)
      });
      this.$router.push({
        name: 'SignDocumentInfo',
        params: { letterId: detail.id }
      });
    },
    getTagId(name) {
      if (this.TAG_LIST.length === 0) {
        return '';
      } else {
        return this.TAG_LIST.find(t => t.name === name).id;
      }
    },
    getTagName(id) {
      if (this.TAG_LIST.length === 0) {
        return '';
      } else {
        return this.TAG_LIST.find(t => t.id === id).name;
      }
    },
    openAdvSearchModal() {
      this.modal.show({
        size: 310,
        componentName: 'AdvSearchModal',
        onConfirm: advData => {
          this.advSearch(advData);
        }
      });
    },
    advSearch({ date, tags, status }) {
      this.queryParam.tagIds = tags.length > 0 ? tags : [];
      this.queryParam.beginDate = (date.length > 0 && date[0]) || '';
      this.queryParam.endDate = date.length >= 2 ? date[1] : date[0] || '';
      this.queryParam.start = 0;
      this.queryParam.limit = 20;
      this.queryParam.status = status !== '' ? status : '';
      this.documents = [];
      this.loadLetterList(this.queryParam);
    },
    delAdvTag(type, tagId = '') {
      switch (type) {
        case 'date':
          this.queryParam.beginDate = '';
          this.queryParam.endDate = '';
          break;
        case 'tags':
          if (tagId) {
            this.queryParam.tagIds = this.queryParam.tagIds.filter(id => id !== tagId);
          }
          break;
        case 'letterStatus':
          this.queryParam.status = '';
          break;
      }
      this.documents = [];
      this.queryParam.start = 0;
      this.queryParam.limit = 20;
      this.loadLetterList(this.queryParam);
    }
  }
};
</script>

<style lang="scss">
@import './../../assets/scss/_variables.scss';
#document_list {
  min-height: 82px;
  position: relative;
  .v-chip {
    margin: 0;
    border-radius: 2px !important;
    padding: 4px;
    font-size: 10px !important;
    .v-chip__content {
      font-size: 10px !important;
    }
  }
  .doc-state-date {
    position: absolute;
    bottom: 5px;
    font-size: 10px !important;
  }
}

#b-sign-list {
  padding: 0 0 2px 0;
  margin-top: -8px;
  background-color: transparent;
  .v-list__tile__title {
    font-size: 17px;
  }
  .company_name {
    font-size: 13px !important;
  }
  .v-chip__close > i {
    color: $aqua !important;
  }
  .unread {
    background-color: $white;
    .v-list__tile__title {
      font-weight: 500;
      color: $dark;
    }
  }
  .readed {
    background-color: #f2f2f2;
  }
}

#adv_search {
  background-color: #fff;
  text-align-last: left;
  border-radius: 6px;
  margin: 0;
  padding: 0px 14px;
}

#signDocs {
  .b-input .v-input__prepend-outer {
    margin-top: 7px !important;
  }
  .b-input .v-input__append-inner {
    margin-top: 7px !important;
  }
  .v-input__append-outer {
    margin-top: 8px;
  }
  .b-input.search {
    background-color: #fff;
    padding: 8px 16px;
    .v-input__slot {
      background-color: rgba(9.8, 12.2, 14.5, 0.08) !important;
      border-color: #f6f6f6 !important;
    }
    .v-text-field__details {
      display: none;
    }
    .v-input__slot {
      height: 36px !important;
      border-radius: 3px !important;
    }
  }

  .work-outline-wording {
    font-size: 20px;
    color: $dark-28;
    margin-top: 100px;
  }
  .work-outline-label {
    margin-top: 124px;
    margin-bottom: 24px;
  }

  .cus-v-list-tile {
    padding: 8px 16px;
    a {
      padding: 0;
    }
  }
}
</style>
