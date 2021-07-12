<template>
  <div>
    <v-flex xs12>
      <p v-once
         class="b-label">{{ $t('set_tags.tag_name.text') }}</p>
    </v-flex>
    <div id="sign-tag-options"
         class="b-input"
         @click="openModal">
      <v-container pa-0>
        <v-layout row
                  wrap>
          <v-flex xs12>
            <v-chip v-show="selectTag.length > 0"
                    v-for="tag in selectTag"
                    :key="tag.id"
                    class="chip--select-multi"
                    close
                    @input="removeTag(tag)">
              {{ tag.name }}
            </v-chip>
            <v-flex xs10
                    v-show="selectTag.length <= 0">
              <span v-text="$t('common.no')" />
            </v-flex>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>

</template>
<script>
import { mapGetters } from 'vuex';
import { getters } from '../store/type.js';

export default {
  props: {
    tagList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters({
      TAG_LIST: getters.TAG_LIST
    }),
    selectTag() {
      const CombTagObject = param => {
        let tagList = [];
        for (let i = 0, len = param.length; i < len; i++) {
          let tag = this.TAG_LIST.find(t => t.name === param[i] || t.name === param[i].name);
          console.log('tag: ', tag);
          if (tag) {
            tagList.push(tag);
          }
        }
        return tagList;
      };
      return this.tagList.length > 0 ? CombTagObject(this.tagList) : [];
    }
  },
  methods: {
    openModal() {
      this.TAG_LIST.length > 0 ? this.openSetTagModal() : this.openCreateTagModal();
    },
    removeTag() {
      this.$emit('updataTags', []);
    },
    openSetTagModal() {
      this.modal.hide();
      this.$nextTick(() => {
        this.modal.show({
          size: 310,
          componentName: 'SetDetailTagModal',
          persistent: false,
          onConfirm: tag => {
            this.$emit('updataTags', tag);
          },
          onCancel: type => {
            if (type === 'openCreateTagsModal') {
              this.openCreateTagModal();
            } else {
              this.modal.hide();
            }
          }
        });
      });
    },
    openCreateTagModal() {
      this.modal.hide();
      this.$nextTick(() => {
        this.modal.show({
          size: 310,
          componentName: 'CreateTagsModal',
          persistent: false,
          onConfirm: tag => {
            this.$emit('updataTags', tag);
          },
          onCancel: () => {
            this.openSetTagModal();
          }
        });
      });
    }
  }
};
</script>

<style lang="scss">
#sign-tag-options {
  display: flex;
  padding: 0 12px;
  &.b-input {
    height: 40px;
    .flex {
      align-self: center;
    }
  }
  .b-icon {
    text-align: right;
  }
}
</style>
