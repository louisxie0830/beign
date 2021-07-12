<template>
  <v-card>
    <v-card-title v-once
                  class="b-dialog-title">{{ $t('common.change_company_roleinfo') }}</v-card-title>
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
                    color="#3333"
                    :placeholder="$t('sign_document_info.sign_identify_choose.text')" />
        </v-flex>
      </div>
    </v-card-text>
    <v-card-actions>
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
import router from './../router';

export default {
  data() {
    return {
      company: 0,
      companyList: [{ id: 0, name: this.$t('common.person'), role: null }]
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA
    })
  },
  async created() {
    await this.GET_USER_STATUS({ token: this.USER_DATA.token });
    await this.GET_SIGNING_CORPS({ role: 'user', token: this.USER_DATA.token }).then(({ companyList }) => {
      if (companyList.length > 0) {
        this.companyList = [...companyList, ...this.companyList];
      }
    });
  },
  methods: {
    ...mapActions({
      GET_SIGNING_CORPS: actions.GET_SIGNING_CORPS,
      GET_USER_STATUS: actions.GET_USER_STATUS
    }),
    _onConfirm() {
      this.$emit('on-confirm', this.company);
    },
    _onCancel() {
      this.$emit('on-cancel');
    }
  }
};
</script>
<style lang="scss">
</style>
