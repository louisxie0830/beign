<template>
  <div>
    <v-alert id="loading"
             v-model="showValue"
             persistent>
      <v-layout align-center
                justify-center
                column
                fill-height>
        <v-progress-circular indeterminate
                             color="white" />
      </v-layout>
    </v-alert>
    <div id="covered"
         v-show="showValue" />
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showValue() {
      return this.show;
    }
  }
};
</script>
<style lang="scss">
#loading {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 120px;
  height: 120px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.7) !important;
  z-index: 9999;
}
#covered {
  position: fixed;
  z-index: 888;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: Black;
  opacity: 0.3;
}
</style>
