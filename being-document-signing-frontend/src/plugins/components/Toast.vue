<template>
  <v-alert id="toast"
           v-model="showValue">
    <v-layout align-center
              justify-center
              column
              fill-height>
      <v-icon class="toast_icon"
              v-show="icon">{{ icon }}</v-icon>
      <div class="toast_content"
           v-show="content">{{ content }}</div>
    </v-layout>

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
    icon: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    timer: {
      type: Number | String,
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
      let toast = document.getElementById('toast');
      let body = document.body;
      let toastContent = document.getElementsByClassName('toast_content')[0];
      let elementLeft = (parseInt(body.clientWidth) - 120) / 2;
      let elementTop = parseInt(window.innerHeight - 120) / 2;
      toast.style.top = `${elementTop}px`;
      toast.style.left = `${elementLeft}px`;
      if (val) {
        document.getElementsByTagName('body')[0].className = 'noscroll';
        if (this.height) {
          toast.style.height = `${this.height}px`;
          toastContent.style.margin = 0;
        }
        if (this.width) {
          toast.style.width = `${this.width}px`;
        }
        this.autoHide &&
          setTimeout(() => {
            this._onHide();
          }, this.timer);
      } else {
        document.body.removeAttribute('class', 'noscroll');
      }
    }
  },
  created() {
    this.showValue = this.show;
    if (this.value) {
      this.showValue = this.value;
    }
  },
  methods: {
    _onHide() {
      if (!this.showValue) {
        return;
      }
      this.showValue = false;
      this.$emit('on-hide');
    }
  }
};
</script>
<style lang="scss">
#toast {
  position: fixed;

  width: 120px;
  height: 120px;
  opacity: 0.7 !important;
  border-radius: 5px;
  background-color: #111111 !important;
  z-index: 9999;
  .toast_icon {
    font-size: 4rem;
    color: #ffffff;
  }
  .toast_content {
    margin-top: 5px;
  }
}
</style>
