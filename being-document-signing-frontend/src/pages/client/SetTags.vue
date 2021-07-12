<template>
  <v-flex id="setTags">
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('set_tags.toolbar_title.text')"></header-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-3>
      <v-layout row
                wrap>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <v-card>
            <v-card-text>
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
                       :disabled="TAG_LIST.length === 20">
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
                        outline
                        @input="delTag(tag)"
                        color="secondary"
                        close>{{ tag.name }}</v-chip>
              </div>
              <div v-else>
                <span class="no_tag">{{ $t('set_tags.not_tag,text') }}<v-icon>bookmark_border</v-icon></span>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { actions, mutations, getters } from './../../store/type.js';
import rulesMixin from './../../mixins/Rules.js';

export default {
  mixins: [rulesMixin],
  data() {
    return {
      tagName: '',
      valid: false
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
  methods: {
    ...mapActions({
      POST_ADD_OR_UPDATA: actions.POST_TAG_ADD_OR_UPDATE,
      POST_TAG_DEL: actions.POST_TAG_DEL
    }),
    addTags() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.POST_ADD_OR_UPDATA({ tagName: this.tagName });
      this.tagName = '';
    },
    delTag({ id }) {
      this.modal.show({
        title: this.$t('common.del_confirmed'),
        content: this.$t('set_tags.agree_del.text'),
        onConfirm: async () => {
          await this.POST_TAG_DEL({ tagId: id });
        }
      });
    }
  }
};
</script>
<style lang="scss" scope="scoped">
@import './../../assets/scss/_variables.scss';
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
      // float: right;
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
    border-radius: 6px;
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
