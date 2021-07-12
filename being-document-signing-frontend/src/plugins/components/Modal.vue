<template>
  <v-flex xs12
          sm6
          md4>
    <transition name="fade"
                mode="out-in">
      <v-dialog class="b-dialog"
                v-model="showValue"
                :max-width="size"
                lazy
                :persistent="persistent">
        <component v-if="hasComponentName"
                   @on-confirm="_onConfirm"
                   @on-cancel="_onCancel"
                   :is="componentName" 
                   :extra="extra" />
        <v-card id="common_modal"
                v-else>
          <v-card-title class="title headline">{{ title }}</v-card-title>
          <v-card-text class="text">
            <v-btn id="close_btn"
                   label
                   flat
                   icon
                   @click="_onCancel">
              <v-icon>close</v-icon>
            </v-btn>
            <v-icon v-if="showIcon">{{ iconType }}</v-icon>
            <p v-show="Array.isArray(content)"
               v-for="(text, index) in content"
               :key="index"> {{ text }}</p>
            <p v-show="!Array.isArray(content) && content">{{ content }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn class="cancel b-btn white"
                   round
                   v-if="showCancel"
                   @click="_onCancel">{{ cancelText || $t('common.cancel') }}</v-btn>
            <v-btn class="confirm b-btn"
                   v-if="showConfirm"
                   round
                   @click="_onConfirm">
              {{ confirmText || $t('common.confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </transition>

  </v-flex>

</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    // 额外的参数
    extra: {
      type: Object,
      default: null
    },
    componentName: {
      type: String,
      default: ''
    },
    size: {
      type: String | Number,
      default: 290
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String | Array,
      default: ''
    },
    showConfirm: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    iconType: {
      type: String,
      default: 'info'
    },
    confirmText: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: ''
    },
    persistent: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showValue: false,
      hasComponentName: false
    };
  },
  watch: {
    showValue(val) {
      if (val) {
        // document.getElementsByTagName('body')[0].className = 'noscroll';
        this.showValue = true;
        this.hasComponentName = this.componentName ? true : false;
        this.$bus.$emit('modal-on-show');
      } else {
        // document.body.removeAttribute('class', 'noscroll');
        this.showValue = false;
        this.hasComponentName = false;
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
    _onConfirm(data) {
      if (!this.showValue) {
        return;
      }
      this.showValue = false;
      this.$emit('on-confirm', data);
    },
    _onCancel(data) {
      if (!this.showValue) {
        return;
      }
      this.showValue = false;
      this.$emit('on-cancel', data);
    }
  }
};
</script>
<style lang="scss">
#common_modal {
  .b-dialog {
    border-radius: 8px;
  }
  .title {
    color: #303133;
    font-size: 16px;
  }
  .text {
    i {
      color: #ff943e;
      width: 10%;
      height: 10%;
    }
    p {
      width: 80%;
      text-align: left;
      color: #606266;
      font-size: 14px;
      margin-left: 9px;
      height: 10%;
    }
    i,
    p {
      float: left;
      vertical-align: middle;
    }
  }
  #close_btn {
    i {
      color: #909399 !important;
    }
  }
  .text::after {
    content: '';
    clear: both;
    display: block;
  }
}
.tips-message {
  max-width: 258px;
  max-height: 64px;
  overflow-y: auto;
}
</style>
