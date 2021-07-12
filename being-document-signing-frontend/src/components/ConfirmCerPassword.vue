<template>
  <v-card>
    <v-card-title class="b-dialog-title"
                  v-text="$t('common.cert_password')" />
    <v-card-text>
      <v-btn id="close_btn"
             label
             flat
             icon
             @click="_onCancel">
        <v-icon>close</v-icon>
      </v-btn>
      <v-flex xs12
              sm12
              d-flex>
        <v-form ref="form"
                onsubmit="return false;"
                v-model="valid">
          <v-text-field id="certCode"
                        class="b-input"
                        type="password"
                        v-disable-paste
                        v-model.trim="certCode"
                        :rules="rules.password"
                        :placeholder="$t('common.cert_code_placeholder')"
                        single-line
                        outline
                        validate-on-blur />
          <span v-if="extra && extra.tips" class="tips-message" v-html="extra.tips"></span>
        </v-form>
      </v-flex>
      
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn round
             class="b-btn white"
             @click="_onCancel"
             v-text="$t('common.cancel')" />
      <v-btn round
             class="b-btn"
             @click="_onConfirm"
             v-text="$t('common.confirm')" />
    </v-card-actions>
  </v-card>
</template>
<script>
import rulesMixin from './../mixins/Rules.js';
export default {
  mixins: [rulesMixin],
  data() {
    return {
      certCode: '',
      valid: false
    };
  },
  mounted() {
    window.addEventListener('keypress', this.handlerKeypress, false);
  },
  destroyed() {
    window.removeEventListener('keypress', this.handlerKeypress);
  },
  methods: {
    handlerKeypress({ key, code }) {
      if (key === 'Enter') {
        document.getElementById('certCode').blur();
        this._onConfirm();
      }
    },
    _onConfirm() {
      if (this.$refs.form.validate()) {
        this.$emit('on-confirm', this.certCode);
        this.certCode = '';
      }
    },
    _onCancel() {
      this.$emit('on-cancel');
      this.certCode = '';
    }
  }
};
</script>

<style lang="scss">
.tips-message {
  width: 100%;
  text-align: left;
  float: left;
  color: #111;
}
</style>
