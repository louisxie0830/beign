<template>
  <v-btn class="sign_btn"
         @click="callBack"
         fab
         dark
         color="info">
    <v-icon>add</v-icon>
  </v-btn>
</template>
<script>
export default {
  props: {
    callBack: {
      type: Function,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import './../assets/scss/_variables.scss';
.sign_btn {
  position: fixed;
  bottom: 16.4px;
  right: 20px;
  z-index: 1;
  width: 47.6px;
  height: 47.6px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.14);
  background-color: $aqua !important;
  font-size: 23px;
}
</style>
