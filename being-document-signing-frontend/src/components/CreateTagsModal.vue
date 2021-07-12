<template>
  <!-- set tags -->
  <v-card id="setTags">
    <v-card-text>
      <v-btn id="close_btn"
             label
             flat
             icon
             @click="_onCancel">
        <v-icon>close</v-icon>
      </v-btn>
      <h2 v-once
          class="create_title">{{ $t('set_tags.create_title.text') }}</h2>
      <v-flex xs12>
        <p v-once
           class="b-label">{{ $t('set_tags.tag_name.text') }}</p>
      </v-flex>
      <v-flex xs12
              sm12
              d-flex>
        <v-form ref="form"
                v-model="valid">
          <v-text-field class="b-input"
                        v-model.trim="tagName"
                        v-disable-paste
                        :rules="rules.bLength(12)"
                        required
                        outline
                        validate-on-blur
                        :disabled="TAG_LIST.length === 20"
                        :placeholder="$t('set_tags.tag_name_placeholder.text')" />
        </v-form>

        <v-btn class="b-btn add_tags"
               @click="addTags"
               :disabled="TAG_LIST.length === 20"
               flat>
          {{ $t('set_tags.tag_create.text') }}
        </v-btn>
      </v-flex>
      <div class="management clearfix">
        <v-flex xs4>
          <h2>{{ $t('set_tags.tag_management_title.text') }}</h2>
        </v-flex>
        <v-flex xs8
                right>
          <span :class="tagClass">{{ TAG_LIST.length }}</span><span> / 20</span>
        </v-flex>
      </div>
      <div class="tags"
           v-if="TAG_LIST && TAG_LIST.length > 0">
        <v-chip v-for="tag in TAG_LIST"
                :key="tag.id"
                @input="openConfirmDelModal(tag)"
                color="secondary"
                outline
                close
                label>{{ tag.name }}</v-chip>
      </div>
      <div v-else>
        <span class="no_tag">{{ $t('set_tags.not_tag,text') }}<v-icon>bookmark_border</v-icon></span>
      </div>
    </v-card-text>
    <!-- confirmDelModal -->
    <v-dialog class="b-dialog"
              v-model="confirmDelModal"
              :max-width="290"
              lazy
              persistent>
      <v-card id="common_modal">
        <v-card-title class="title headline">{{ $t('common.del_confirmed') }}</v-card-title>
        <v-card-text class="text">
          <v-btn id="close_btn"
                 label
                 flat
                 icon
                 @click="confirmDelModal = false">
            <v-icon>close</v-icon>
          </v-btn>
          <p>{{ $t('set_tags.agree_del.text') }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="cancel b-btn white"
                 round
                 @click="confirmDelModal = false">{{ $t('common.cancel') }}</v-btn>
          <v-btn class="confirm b-btn"
                 round
                 @click="delTag">
            {{ $t('common.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import rulesMixin from './../mixins/Rules.js';

import { mapActions, mapGetters } from 'vuex';
import { actions, getters } from './../store/type.js';
export default {
  mixins: [rulesMixin],
  data() {
    return {
      tagName: '',
      start: 0,
      limit: 20,
      valid: false,
      confirmDelModal: false,
      delTagInfo: null
    };
  },
  computed: {
    ...mapGetters({
      TAG_LIST: getters.TAG_LIST
    }),
    tagClass() {
      switch (this.TAG_LIST.length) {
        case 0:
          return 'default';
        case 20:
          return 'danger';
        default:
          return 'normal';
      }
    }
  },
  created() {},
  methods: {
    ...mapActions({
      POST_ADD_OR_UPDATA: actions.POST_TAG_ADD_OR_UPDATE,
      POST_TAG_DEL: actions.POST_TAG_DEL
    }),
    openConfirmDelModal(data) {
      this.confirmDelModal = true;
      this.delTagInfo = data;
    },
    addTags() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.POST_ADD_OR_UPDATA({ tagName: this.tagName }).then(({ id }) => {
        this.tagName = '';
        const tags = this.TAG_LIST.filter(t => t.id === id);
        this.$emit('on-confirm', tags.length > 0 ? tags : '');
      });
    },
    delTag() {
      let tagId;
      for (let i = 0; this.TAG_LIST.length; i++) {
        if (this.TAG_LIST[i] === this.delTagInfo) {
          tagId = this.delTagInfo.id;
          break;
        }
      }
      if (tagId) {
        this.POST_TAG_DEL({ tagId: tagId }).then(() => {
          this.confirmDelModal = false;
          this.delTagInfo = null;
        });
      }
    },
    _onCancel() {
      this.$emit('on-cancel');
    }
  }
};
</script>
<style lang="scss">
@import './../assets/scss/_variables.scss';
#setTags {
  h2 {
    font-size: 17px;
    font-weight: normal;
  }
  .create_title {
    text-align-last: left;
    margin-bottom: 14px;
  }
  .management {
    margin-bottom: 10px;
    h2,
    span {
      height: 31px;
      vertical-align: middle;
    }
    h2 {
      float: left;
    }
    span {
      line-height: 31px;
      &.default {
        color: rgba(26, 31, 38, 0.28);
      }
      &.normal {
        color: $turquoise-blue;
      }
      &.danger {
        color: #ef6e6a;
      }
    }
  }
  .management::after,
  .management::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    clear: both;
    margin: auto;
  }
  .add_tags {
    margin: 0 0 0 10px;
    border: 1px solid #95dded !important;
    height: 40px;
    border-radius: 22px;
    background-color: #fff !important;
    font-size: 1rem;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 20px;
    letter-spacing: normal;
    text-align: center;
    color: #10acce !important;
  }
  .v-chip {
    border-color: #13c3ea !important;
    .v-chip--outline {
      color: #38abd0;
    }
  }
  .v-chip.v-chip.v-chip--outline,
  .secondary--text {
    color: #38abd0 !important;
    caret-color: #38abd0 !important;
  }
  .tags {
    display: flex;
    justify-items: left;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
  }
  .no_tag {
    font-size: 17px;
    color: $dark--28;
    i {
      color: $dark--28 !important;
      margin-left: 4px;
      vertical-align: middle;
    }
  }
}
</style>
