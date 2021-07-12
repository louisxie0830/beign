<template>
  <v-flex xs12
          sm6
          md4
          id="date-picker">
    <v-dialog ref="dialog"
              v-model="showValue"
              persistent
              lazy
              :max-width="maxWidth">
      <v-date-picker color="#13c3ea"
                     width="maxWidth"
                     locale="locale"
                     v-model="selectDate"
                     :min="minDate">
        <v-spacer />
        <v-btn round
               class="b-btn white"
               @click="_onCancel">{{ $t('common.cancel') }}</v-btn>
        <v-btn round
               class="b-btn"
               @click="_onConfirm(selectDate)">{{ $t('common.confirm') }}</v-btn>
      </v-date-picker>
    </v-dialog>

  </v-flex>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    minDate: {
      type: String,
      default: new Date().toISOString().substr(0, 10)
    },
    maxDate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showValue: false,
      locale: 'zh-cn',
      selectDate: new Date().toISOString().substr(0, 10),
      maxWidth: 290
    };
  },
  watch: {
    showValue(val) {
      if (val) {
        document.getElementsByTagName('body')[0].className = 'noscroll';
        this.showValue = true;
      } else {
        document.body.removeAttribute('class', 'noscroll');
        this.showValue = false;
      }
    }
  },
  created() {
    this.maxWidth = document.body.clientWidth - this.maxWidth <= 30 ? 280 : 290;
    this.showValue = this.show;
    if (this.value) {
      this.showValue = this.value;
    }
  },
  methods: {
    _onConfirm(date) {
      if (!this.showValue) {
        return;
      }
      this.showValue = false;
      this.$emit('on-confirm', date);
    },
    _onCancel() {
      if (!this.showValue) {
        return;
      }
      this.showValue = false;
      this.$emit('on-cancel');
    }
  }
};
</script>
<style lang="scss">
</style>
