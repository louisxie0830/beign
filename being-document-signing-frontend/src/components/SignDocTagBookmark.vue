<template>
  <v-flex xs2>
    <v-btn flat
           icon
           @click="openModal">
      <v-icon>bookmark_border</v-icon>
    </v-btn>
  </v-flex>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { actions, getters } from '../store/type.js';
export default {
  props: {
    letterId: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      TAG_LIST: getters.TAG_LIST
    })
  },
  methods: {
    ...mapActions({
      POST_TAG_DETAIL_UPDATE: actions.POST_TAG_DETAIL_UPDATE
    }),
    openModal() {
      this.TAG_LIST.length > 0 ? this.openSetTagModal() : this.openCreateTagModal();
    },
    openSetTagModal() {
      this.modal.hide();
      this.$nextTick(() => {
        this.modal.show({
          size: 310,
          componentName: 'SetDetailTagModal',
          persistent: false,
          onConfirm: tag => {
            this.updateDetailTag(tag);
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
            this.updateDetailTag(tag);
          },
          onCancel: () => {
            this.openSetTagModal();
          }
        });
      });
    },
    async updateDetailTag(tag) {
      let tagIds = tag.map(t => t.id);
      await this.POST_TAG_DETAIL_UPDATE({
        tagIds: tagIds,
        letterId: this.letterId
      });
      this.$emit('updateSignDocInfo', this.letterId);
    }
  }
};
</script>
