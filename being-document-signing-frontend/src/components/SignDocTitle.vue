<template>

  <v-container class="head-info px-3
                         py-2">
    <v-flex xs12>
      <h6 class="text-xs-left"
          style="font-size: 17px;"
          v-text="docDetail.title" />
    </v-flex>
    <v-layout row
              wrap
              mt-3>
      <v-flex xs12
              md12
              class="text-align-l">
        <v-chip small
                label
                :color="showExpiredColor ? '#fb8c00' : DOCUMENTS.detail.statusInfo.color"
                text-color="white">
          {{ DOCUMENTS.detail.statusInfo.wording }}
        </v-chip>
        <v-chip v-for="tag in docDetail.tagList"
                :key="tag.id"
                class="ml-0"
                small
                label
                close
                text-color="#626167"
                @input="delCustomTag(tag)">
          {{ tag.tagName }}
        </v-chip>
      </v-flex>

    </v-layout>
    <v-layout row
              wrap
              mt-1
              class="ten-pixel">
      <v-flex xs6
              sm6
              d-flex
              text-xs-left>
        <span>{{ $t('common.publish_date')+':' }} {{ docDetail.createTime | dateformat('YYYY/MM/DD HH:mm') }}</span>
      </v-flex>
      <v-flex xs6
              sm6
              d-flex
              text-xs-left>
        <span v-if="showExpiredTime">{{ $t('common.expired_date')+':' }} {{ docDetail.expiredTime | dateformat('YYYY/MM/DD HH:mm') }}</span>
        <span v-else>{{ $t('common.expired_date')+':' }} {{ $t('common.no') }}</span>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import { actions, getters } from '../store/type.js';
import STATUS from '../utils/status.js';

export default {
  props: {
    docDetail: {
      type: Object,
      default: () => {}
    },
    letterId: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      DOCUMENTS: getters.DOCUMENTS
    }),
    showExpiredTime() {
      return this.docDetail.expiredTime !== '1970-01-01T15:59:59.000Z' && this.docDetail.expiredTime;
    },
    showExpiredColor() {
      const expiredTime = new Date(this.docDetail.expiredTime);
      const nowDate = new Date();
      return (
        this.showExpiredTime &&
        nowDate.valueOf() > expiredTime.valueOf() &&
        this.docDetail.status === STATUS.LETTER_STATUS.SIGNING
      );
    }
  },
  created() {
    this.STATUS = STATUS;
  },
  methods: {
    ...mapActions({
      POST_TAG_DETAIL_UPDATE: actions.POST_TAG_DETAIL_UPDATE
    }),
    async delCustomTag({ tagId }) {
      let tagIds = this.docDetail.tagList.filter(t => t.tagId !== tagId).map(t => t.tagId);
      await this.POST_TAG_DETAIL_UPDATE({
        tagIds: tagIds.length > 0 ? tagIds : [],
        letterId: this.letterId
      });
      this.$emit('updateSignDocInfo', this.letterId);
    }
  }
};
</script>

<style lang="scss">
@import '../assets/scss/_variables.scss';
.head-info h6 {
  word-break: break-all;
}
.ten-pixel {
  position: relative;
  text-align: left;
  div > span {
    display: block;
    font-size: 10px;
    color: $dark-28;

    @media screen and (max-width: 330px) {
      font-size: 12px;
      transform: scale(0.833);
      margin-left: -12px;
    }
  }
}
</style>
