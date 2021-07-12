<template>
  <v-container v-if="message"
               id="sign_doc_message"
               pl-2
               pr-2
               pt-2>
    <v-card>
      <v-card-text>
        <div class="name-info">
          <span>{{ $t('common.sender') + '：' }}</span>
          <span v-text="sender"></span>
        </div>
        <v-textarea solo
                    flat
                    readonly
                    disabled
                    v-model="message" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ''
    },
    sender: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss">
@import '../assets/scss/_variables.scss';
#sign_doc_message {
  .v-textarea {
    border: none !important;
  }
  .name-info {
    font-size: 12px;
    text-align: left;
    letter-spacing: -0.29px;

    & span:first-child {
      color: $dark--28;
    }
    & span:last-child {
      color: $dark-56;
    }
  }
}
</style>
