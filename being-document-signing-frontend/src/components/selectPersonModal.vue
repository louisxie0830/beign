<template>
  <v-card>
    <v-card-title v-once
                  class="b-dialog-title">{{ $t('common.select_company_role') }}</v-card-title>
    <v-card-text>
      <v-btn id="close_btn"
             label
             flat
             icon
             @click="_onCancel">
        <v-icon>close</v-icon>
      </v-btn>
      <div>
        <v-flex xs12
                sm12
                d-flex>
          <v-select item-text="name"
                    item-value="id"
                    class="b-input text-align-l"
                    solo
                    :flat="true"
                    :items="companyList"
                    v-model="company"
                    color="#333" />
        </v-flex>
      </div>
      <div>
        <v-flex xs12
                sm12
                d-flex>
          <v-select item-text="name"
                    item-value="key"
                    class="b-input text-align-l"
                    solo
                    :flat="true"
                    :items="agreeList"
                    v-model="agree"
                    color="#333" />
        </v-flex>
      </div>
    </v-card-text>
    <v-card-actions v-if="!isShortage">
      <v-spacer />
      <v-btn round
             @click="_onCancel"
             v-text="$t('common.cancel')" />
      <v-btn class="b-btn"
             round
             @click="_onConfirm"
             v-text="$t('common.confirm')" />
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { actions, getters } from './../store/type.js';

export default {
  data() {
    return {
      company: 0,
      companyList: [{ id: 0, name: this.$t('common.person') }],
      agree: 1,
      agreeList: [
        {
          key: 1,
          name: this.$t('sign_document_info.toast.sign.text'),
          remark: 'SIGN'
        },
        {
          key: 3,
          name: this.$t('sign_document_info.toast.approval.text'),
          remark: 'APPROVAL'
        }
      ]
    };
  },
  computed: {},
  created() {
    this.GET_SINGER_COMPANY_LIST({ email: this.extra.email }).then(res => {
      if (res.length > 0) {
        this.companyList = this.companyList.concat(res);
      }
    });
  },
  methods: {
    ...mapActions({
      GET_SINGER_COMPANY_LIST: actions.GET_SINGER_COMPANY_LIST
    }),
    _onConfirm() {
      const company = this.companyList.filter(item => item.id === this.company);
      const agree = this.agreeList.filter(item => item.key === this.agree);
      this.$emit('on-confirm', { company, agree });
    },
    _onCancel() {
      this.$emit('on-cancel');
    }
  }
};
</script>
<style lang="scss">
</style>
