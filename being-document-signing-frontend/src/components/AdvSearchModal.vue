<template>
  <v-card id="adv_search_modal">
    <v-card-title class="b-dialog-title">{{ $t('sign_documents.adv_search.text') }}</v-card-title>
    <v-card-text>
      <v-btn id="close_btn"
             label
             flat
             icon
             @click="_onCancel">
        <v-icon>close</v-icon>
      </v-btn>
      <v-flex xs12>
        <p class="b-label">{{ $t('common.publish_date') }}</p>
      </v-flex>
      <DatePickerRange ref="datePickerRange"
                       :labels="labels"
                       highlight-range
                       :prepend-inner-icon="'event'"
                       @input="onDateRangeChange" />
      <v-btn class="reset-btn"
             flat
             @click="resetDate">
        <v-icon>cancel</v-icon>{{ $t('sign_document.clear_select_date.text') }}
      </v-btn>
      <div class="tags mb-2"
           v-if="showSignTagList">
        <v-flex xs12>
          <p class="b-label mb-2"
             v-text="$t('common.sign_status')" />
        </v-flex>
        <v-flex xs12
                class="text-xs-left">
          <v-chip :class="{'tag_active': advData.status === ''}"
                  @click="selectSignAllTag">{{ $t('common.all') }}</v-chip>
          <v-chip v-for="tag in LETTER_TAGS"
                  :key="tag.type"
                  :class="{'tag_active': advData.status === tag.type}"
                  @click="selectSignTag(tag.type)">{{ tag.wording }}</v-chip>
        </v-flex>
      </div>
      <v-flex xs12>
        <p class="b-label mb-2">{{ $t('set_tags.custom_tags.text') }}</p>
      </v-flex>
      <div class="tags"
           v-if="tags && tags.length > 0">
        <v-flex xs12
                class="text-xs-left">
          <v-chip :class="{'tag_active': selectAllCustomType}"
                  @click="selectAllCustomTag">{{ $t('common.all') }}</v-chip>
          <v-chip v-for="tag in tags"
                  :key="tag.id"
                  :class="{'tag_active': tag.active && !selectAllCustomType}"
                  @click="selectCustomTag(tag)">{{ tag.name }}</v-chip>
        </v-flex>
      </div>
      <div v-else>
        <span class="no_tag">
          {{ $t('set_tags.not_tag,text') }}
          <v-icon>bookmark_border</v-icon>
        </span>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn round
             @click="_onCancel"
             v-text="$t('common.cancel')" />
      <v-btn round
             class="b-btn"
             @click="_onConfirm"
             v-text="$t('common.confirm')" />
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex';
import { getters } from '../store/type.js';
import signMixin from './../mixins/Sign.js';
import router from './../router';
import STATUS from './../utils/status.js';
const { LETTER_STATUS, SOURCE_STATUS } = STATUS;

export default {
  mixins: [signMixin],
  data() {
    return {
      labels: {
        start: this.$t('common.select_date.text'),
        end: this.$t('common.select_date.text')
      },
      advData: {
        status: '',
        date: [],
        tags: []
      },
      tags: [],
      currentRouterParma: '',
      selectAllCustomType: true
    };
  },
  computed: {
    ...mapGetters({
      TAG_LIST: getters.TAG_LIST
    }),
    showSignTagList() {
      return this.currentRouterParma === 2 || this.currentRouterParma === 5 || this.currentRouterParma === 4;
    }
  },
  created() {
    this.currentRouterParma = +router.history.current.params.type;
    this.tags = JSON.parse(JSON.stringify(this.TAG_LIST));
    this.tags = this.tags.map(t => {
      t.active = false;
      return t;
    });
  },
  methods: {
    resetDate() {
      this.$refs.datePickerRange.startDate = '';
      this.$refs.datePickerRange.endDate = '';
    },
    onDateRangeChange(date) {
      this.advData.date = date;
    },
    selectAllCustomTag() {
      this.selectAllCustomType = true;
      for (let i = 0, len = this.tags.length; i < len; i++) {
        this.tags[i].active = false;
      }
      this.$forceUpdate();
    },
    selectCustomTag(t) {
      this.selectAllCustomType = false;
      for (let i = 0, len = this.tags.length; i < len; i++) {
        if (t.id === this.tags[i].id) {
          this.tags[i].active = true;
        } else {
          this.tags[i].active = false;
        }
      }
      this.$forceUpdate();
    },
    selectSignAllTag() {
      this.advData.status = '';
      this.$forceUpdate();
    },
    selectSignTag(id) {
      this.advData.status = id;
      this.$forceUpdate();
    },
    _onConfirm() {
      if (this.selectAllCustomType) {
        this.advData.tags = [];
      } else {
        for (let i = 0, len = this.tags.length; i < len; i++) {
          if (!!this.tags[i].active) this.advData.tags.push(this.tags[i].id);
        }
      }
      this.$emit('on-confirm', this.advData);
    },
    _onCancel() {
      this.$emit('on-cancel');
    }
  }
};
</script>
<style lang="scss">
@import './../assets/scss/_variables.scss';
#adv_search_modal {
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
}
.reset-btn {
  margin-top: 16px;
  font-size: 12px;
  width: 72px;
  height: 17px;
  color: #92929b !important;
  i {
    font-size: 12px;
  }
}
.v-chip {
  box-sizing: border-box;
  border-radius: 6px;
  height: 28px;
  color: rgba(25, 31, 37, 0.12);
}
.tags {
  margin: 0;
}
.tag_active {
  background-color: $aqua !important;
  color: $white !important;
}
.no_tag {
  font-size: 17px;
  color: $dark--28;
  margin-top: 14px;
  i {
    color: $dark--28 !important;
    margin-left: 4px;
    vertical-align: middle;
  }
}
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
</style>
