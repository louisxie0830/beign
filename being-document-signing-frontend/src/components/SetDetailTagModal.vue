<template>
  <v-card id="set_detail_tag_modal">
    <v-card-title class="b-dialog-title"
                  v-text="$t('set_detail_tag.set_Tag.text')" />
    <v-card-text class="pa-0">
      <v-btn id="close_btn"
             label
             flat
             icon
             @click="onCancel('close')">
        <v-icon>close</v-icon>
      </v-btn>
      <v-flex>
        <v-text-field class="b-input search"
                      v-model.lazy="tagName"
                      v-disable-paste
                      append-icon="search"
                      :placeholder="$t('common.search_word_placeholder')"
                      outline />
        <v-flex class="tags"
                v-if="tags && tags.length > 0">
          <v-chip :class="{'tag_active': tag.active}"
                  v-show="fuzzySearchTags.length > 0"
                  v-for="tag in fuzzySearchTags"
                  :key="tag.id"
                  @click="selectTag(tag)"
                  label>{{ tag.name }}</v-chip>
          <span v-show="fuzzySearchTags.length <= 0">{{ $t('common.no_more_data') }}</span>
        </v-flex>
        <div v-else>
          <span class="no_tag">
            {{ $t('set_tags.not_tag,text') }}
            <v-icon>bookmark_border</v-icon>
          </span>
        </div>
      </v-flex>

    </v-card-text>
    <v-card-actions>
      <v-btn flat
             block
             @click="onCancel('openCreateTagsModal')">
        <v-icon>add</v-icon>
        {{ $t('set_tags.create_title.text') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { getters } from '../store/type.js';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      tags: [],
      tagName: ''
    };
  },
  computed: {
    ...mapGetters({
      TAG_LIST: getters.TAG_LIST
    }),
    fuzzySearchTags() {
      return this.tags.filter(tag => {
        let regex = new RegExp('(' + this.tagName + ')', 'i');
        return tag.name.match(regex);
      });
    }
  },
  created() {
    this.tags = JSON.parse(JSON.stringify(this.TAG_LIST)).map(t => {
      t.active = false;
      return t;
    });
  },
  methods: {
    selectTag(t) {
      for (let i = 0, len = this.tags.length; i < len; i++) {
        if (this.tags[i].id === t.id) {
          this.tags[i].active = !this.tags[i].active;
        } else {
          this.tags[i].active = false;
        }
      }
      this.$forceUpdate();
      let tags = this.tags.filter(t => t.active);
      this.onConfirm(tags);
    },
    onConfirm(tags) {
      this.$emit('on-confirm', tags.length > 0 ? tags : '');
    },
    onCancel(status) {
      this.$emit('on-cancel', status);
    }
  }
};
</script>
<style lang="scss">
@import './../assets/scss/_variables.scss';
#set_detail_tag_modal {
  .b-input .v-input__prepend-outer {
    margin-top: 7px !important;
  }
  .b-input .v-input__append-inner {
    margin-top: 7px !important;
  }
  .b-input.search {
    background-color: #fff;
    padding: 8px 16px;
    .v-input__slot {
      border-radius: 3px !important;
      background-color: rgba(9.8, 12.2, 14.5, 0.08) !important;
      border-color: #f6f6f6 !important;
    }
    .v-text-field__details {
      display: none;
    }
  }
  .tags {
    margin: 0;
    text-align: left;
    padding: 0px 14px;
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
  .v-btn__content {
    color: #4caad2;
    justify-content: left;
    font-size: 14px;
    i {
      margin-right: 4px;
      font-size: 24px;
    }
  }
  #close_btn {
    position: absolute;
    top: 5px;
    right: 0;
    color: #909399 !important;
    font-size: 10px;
    .v-btn__content {
      color: #909399 !important;
      font-size: 10px;
      justify-content: center;
    }
  }
}
</style>
