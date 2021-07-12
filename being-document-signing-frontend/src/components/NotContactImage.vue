<template>
  <v-flex justify-center
          class="text-xs-center">
    <v-img id="not_contact_iamge"
           style="margin: auto;"
           :src="emptyImg"
           :height="options.height"
           :width="options.width"
           :max-height="options.maxHeight"
           :max-width="options.maxWidth"
           :min-height="options.minHeight"
           :min-width="options.width" />
    <p class="mt-4 b-context"
       style="font-size:17px"
       v-text="$t('null_contact.toolbar_title.text')" />
  </v-flex>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return { emptyImg: require('./../assets/image/empty@3x.png') };
  }
};
</script>
