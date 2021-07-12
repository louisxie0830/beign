<template>
  <v-card>
    <v-card-title class="b-dialog-title">{{ $t('common.confirm_rejection') }}</v-card-title>
    <v-card-text>
      <v-btn id="close_btn"
             label
             flat
             icon
             @click="_onCancel">
        <v-icon>close</v-icon>
      </v-btn>
      <v-form ref="form"
              onsubmit="return false;"
              v-model="valid">
        <div v-if="companyList.length > 1">
          <v-flex xs12
                  sm12
                  d-flex>
            <v-select item-text="name"
                      item-value="id"
                      class="b-input"
                      solo
                      :flat="true"
                      :disabled="true"
                      :items="companyList"
                      v-model="companyId"
                      :placeholder="$t('sign_document_info.sign_identify_choose.text')" />
          </v-flex>
        </div>
        <v-flex xs12
                sm12
                d-flex>
          <v-text-field id="certCode"
                        class="b-input"
                        v-model.trim="certCode"
                        v-disable-paste
                        type="password"
                        :rules="rules.password"
                        single-line
                        outline
                        validate-on-blur
                        :placeholder="$t('common.cert_code_placeholder')" />
        </v-flex>
        <input style="z-index: -1;" type="text" name="name" /><!-- 防止Safari浏览器自动填充textarea -->
        <v-flex xs12
                sm12
                d-flex
                style="margin-top: -20px;">
          <v-textarea id="rejectComment"
                      v-model.trim="comment"
                      solo
                      :flat="true"
                      :placeholder="$t('common.confirm_rejecttion.comment')"
                      maxlength="128" />
        </v-flex>
        <v-flex xs12
                sm12
                d-flex>
          <span :style="{color: comment.length >= 128 ? 'red' : '#999', textAlign: 'right'}">{{ comment.length }}/128</span>
        </v-flex>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn round
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
import { mapGetters, mapActions } from 'vuex';
import { actions, getters } from './../store/type.js';
import rulesMixin from './../mixins/Rules.js';
export default {
  mixins: [rulesMixin],
  data() {
    return {
      valid: false,
      certCode: '',
      comment: '',
      company: 0,
      companyList: [{ id: 0, name: this.$t('common.person'), role: null }]
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA
    }),
    companyId() {
      return this.extra.companyId && this.extra.companyId;
    }
  },
  created() {
    const { token } = this.USER_DATA;

    this.GET_SIGNING_CORPS({ role: 'user', token: token }).then(({ companyList }) => {
      if (companyList.length > 0) {
        this.companyList = [...this.companyList, ...companyList];
      }
    });
  },
  mounted() {
    window.addEventListener('keypress', this.handlerKeypress, false);
  },
  destroyed() {
    window.removeEventListener('keypress', this.handlerKeypress);
  },
  methods: {
    ...mapActions({
      GET_SIGNING_CORPS: actions.GET_SIGNING_CORPS
    }),
    handlerKeypress({ key, code }) {
      if (key === 'Enter') {
        document.getElementById('certCode').blur();
        this._onConfirm();
      }
    },
    async _onConfirm() {
      let selectCompany;
      this.company = this.extra.companyId;
      if (this.$refs.form.validate()) {
        const { companyList } = this.USER_DATA;
        if (!!companyList.length && this.company !== 0) {
          selectCompany = companyList.find(c => c.id === this.company);
          this.$emit('on-confirm', {
            role: selectCompany.id,
            pwd: this.certCode,
            comment: this.comment
          });
        } else {
          this.$emit('on-confirm', {
            role: 0,
            pwd: this.certCode,
            comment: this.comment
          });
        }
        this.certCode = '';
        this.company = 0;
      }
    },
    _onCancel() {
      this.$emit('on-cancel');
      this.certCode = '';
      this.company = 0;
    }
  }
};
</script>
<style lang="scss">
.v-textarea {
  border: 1px solid #dcdfe6 !important;
  border-radius: 8px;
  .v-input__slot {
    margin: 0;
  }
}
</style>
