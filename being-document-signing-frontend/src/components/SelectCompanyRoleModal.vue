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
                    color="#3333"
                    :placeholder="$t('sign_document_info.sign_identify_choose.text')" />
        </v-flex>
        <v-flex v-show="buyMessage"
                xs12
                sm12
                d-flex
                pa-2>
          <span class="grey--text text-align-l"
                v-text="buyMessage" />
        </v-flex>
        <v-flex v-if="isShortage"
                xs12
                sm12
                d-flex
                px-2>
          <span class="grey--text text-align-l"
                v-text="$t('purchase.count.shortage.text')" />
        </v-flex>
        <v-flex v-if="isShortage"
                xs12
                sm12
                d-flex
                px-2>
          <span class="grey--text text-align-l">{{ $t('purchase.count.shortage_detail.first.text')
            + USER_DATA.limit_duration
            + $t('purchase.count.shortage_detail.second.text')
            + USER_DATA.limit
          + $t('purchase.count.shortage_detail.third.text') }}</span>
        </v-flex>
      </div>
    </v-card-text>
    <v-card-actions v-if="!isShortage">
      <v-spacer />
      <v-btn round
             @click="_onCancel"
             v-text="$t('common.cancel')" />
      <v-btn v-show="!buyMessage"
             class="b-btn"
             round
             @click="_onConfirm"
             v-text="$t('common.confirm')" />
      <v-btn v-show="buyMessage"
             class="b-btn"
             round
             @click="jumpToBuyPage"
             v-text="$t('common.go_to_purchase')" />
    </v-card-actions>
    <v-card-actions v-else>
      <v-spacer />
      <v-btn round
             @click="goHomePage"
             v-text="'回首頁'" />
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
      USER_DATA: getters.USER_DATA,
      userEntity: getters.USER_ENTITY
    }),
    isShortage() {
      return this.company === 0 && this.USER_DATA.remain <= 0 ? true : false;
    },
    // 已購買次數
    // signingQuota
    // 剩餘次數
    // signingRemain
    currentCompanyData() {
      const { companyList } = this.USER_DATA;
      if (companyList.length === 0 || this.company === 0) {
        return;
      }

      for (let i = 0, c; (c = companyList[i]); i++) {
        if (c.id === this.company) {
          return c;
        }
      }
    },
    buyMessage() {
      if (!this.currentCompanyData) return;
      if (this.currentCompanyData.signing_quota === 0) {
        return this.$t('common.signing_quota');
      } else if (this.currentCompanyData.signing_remain === 0) {
        return this.$t('common.signing_remain');
      } else {
        return null;
      }
    }
  },
  async created() {
    await this.GET_USER_STATUS({ token: this.USER_DATA.token });
    await this.GET_SIGNING_CORPS({ role: 'user', token: this.USER_DATA.token }).then(({ companyList }) => {
      if (companyList.length > 0) {
        this.companyList = [...this.companyList, ...companyList];
      }
    });
    this.company = this.userEntity || 0;
    console.log(this.userEntity);
  },
  methods: {
    ...mapActions({
      GET_SIGNING_CORPS: actions.GET_SIGNING_CORPS,
      GET_USER_STATUS: actions.GET_USER_STATUS
    }),
    jumpToBuyPage() {
      this.$emit('on-cancel');
      router.push({ name: 'Purchase' });
    },
    _onConfirm() {
      this.$emit('on-confirm', this.company);
    },
    _onCancel() {
      if (this.isShortage) {
        this.goHomePage();
      } else {
        this.$emit('on-cancel');
      }
    },
    goHomePage() {
      router.push({ name: 'Index' });
    }
  }
};
</script>
<style lang="scss">
</style>
