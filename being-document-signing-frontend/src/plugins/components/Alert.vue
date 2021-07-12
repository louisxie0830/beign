<template>
  <v-alert id="alert"
           :class="[position]"
           :value="showValue">
    {{ content }}
  </v-alert>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'top'
    },
    timer: {
      type: Number,
      default: 3000
    },
    autoHide: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showValue: false
    };
  },
  watch: {
    showValue(val) {
      if (val) {
        document.getElementsByTagName('body')[0].className = 'noscroll';
        this.showValue = true;
        this.autoHide &&
          setTimeout(() => {
            this.showValue = false;
          }, this.timer);
      } else {
        document.body.removeAttribute('class', 'noscroll');
        this.showValue = false;
      }
    }
  },
  created() {
    this.showValue = this.show;
    if (this.value) {
      this.showValue = this.value;
    }
  }
};
</script>
<style lang="scss">
#alert {
  position: fixed !important;
  background-color: rgba(0, 0, 0, 0.7) !important;
  color: #ffffff;
  text-align-last: center;
  font-size: 14px;
  z-index: 99999;
  width: 80%;
  height: 60px;
  box-sizing: border-box;
  i {
    color: #ffffff;
  }
}
.bottom {
  margin: auto;
  bottom: 10px;
  left: 0;
  right: 0;
}
.middle {
  margin: auto;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
}
.top {
  margin: auto;
  left: 0;
  right: 0;
  top: 10px;
}
</style>
