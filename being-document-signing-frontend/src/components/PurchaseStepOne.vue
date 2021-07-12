<template>
  <div>
    <v-card class="b-card one">
      <v-card-text>
        <v-flex xs12>
          <p class="b-label">{{ $t('sign_document_info.sign_identify.text') }}</p>
        </v-flex>
        <v-flex xs12>
          <v-select class="b-input"
                    v-model="role"
                    item-text="name"
                    item-value="id"
                    :items="companyList"
                    :disabled="notJoinCompany"
                    @change="selectRole(role)"
                    :placeholder="$t('sign_document_info.sign_identify_choose.text')" />
        </v-flex>
        <v-flex xs12
                v-if="!notJoinCompany">
          <p class="b-label">{{ $t('purchase.info.text') }}</p>
        </v-flex>
        <v-flex xs12
                v-if="!notJoinCompany">
          <v-container pa-0
                       class="b-count-area">
            <v-layout row
                      wrap>
              <v-flex xs4>
                <span class="b-label">{{ $t('purchase.count.text') }}</span>
              </v-flex>
              <v-flex xs8
                      right>
                <p>
                  <span :class="tagClass">{{ quota }}</span>
                  <span>次</span>
                </p>
              </v-flex>
            </v-layout>
          </v-container>
          <v-flex xs12>
            <p class="b-label">{{ $t('index.data.left_menu.purchase') }}</p>
          </v-flex>
          <v-flex xs12
                  class="b-plan-area">
            <v-list>
              <v-list-tile @click.prevent="selectPlan(item)"
                           v-for="item in packageList"
                           :key="item.id">
                <v-list-tile-action>
                  <v-icon v-if="item.selected"
                          :color="themeColor">check_circle</v-icon>
                  <v-icon v-else>panorama_fish_eye</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    <v-container pa-0>
                      <v-layout row
                                wrap>
                        <v-flex xs4>{{ item.offer }} 次</v-flex>
                        <v-flex xs8
                                class="price">{{ item.unit_price }} {{ formatCurrency[item.currency] }}</v-flex>
                      </v-layout>
                    </v-container>
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
        </v-flex>
      </v-card-text>
    </v-card>
    <v-flex xs12
            class="b-btn-area"
            v-if="!notJoinCompany">
      <v-btn round
             large
             block
             class="b-btn"
             :disabled="!packageId"
             @click="goStep()">{{ $t('common.next_step') }}</v-btn>
    </v-flex>
    <v-container v-if="notJoinCompany">
      <v-layout align-center
                justify-center
                row
                fill-height>
        <p class="b-label">{{ $t('purchase.invoice.not_join_company.text') }}</p>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { actions, getters, mutations } from './../store/type.js';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      themeColor: '#13c3ea',
      role: null,
      packageList: [],
      companyList: [{ id: 0, name: this.$t('common.person'), role: null }],
      quota: 0,
      unit_price: 0,
      packageId: null,
      notJoinCompany: false,
      formatCurrency: {
        CNY: 'RMB',
        TWD: 'NTD'
      },
      unit: '' // 币种
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA
    }),
    tagClass() {
      switch (1) {
        case 0:
          return 'default';
        case 20:
          return 'danger';
        default:
          return 'normal';
      }
    }
  },
  created() {
    this.getSigningCops({ role: 'user', token: this.USER_DATA.token })
      .then(({ companyList }) => {
        this.UPDATE_USER_DATA({ ...this.USER_DATA, ...companyList });
      })
      .finally(() => {
        if (this.USER_DATA.companyList.length > 0) {
          this.companyList = JSON.parse(JSON.stringify(this.USER_DATA.companyList));
        } else {
          this.notJoinCompany = true;
        }
        this.role = this.companyList[0].id;
        this.quota = this.companyList[0].signing_remain;
      });

    this.getPackages().then(data => {
      if (data.length > 0) {
        let obj = data.map(item => {
          item.selected = false;
          return item;
        });
        this.packageList = [...obj];
      }
    });
  },
  methods: {
    ...mapActions({
      getSigningCops: actions.GET_SIGNING_CORPS,
      getPackages: actions.GET_PAYMENT_PACKAGES
    }),
    ...mapMutations({
      SET_USER_COMPANY_LIST: mutations.SET_USER_COMPANY_LIST,
      UPDATE_USER_DATA: mutations.UPDATE_USER_DATA
    }),
    selectRole(role) {
      this.role = role;
      if (this.companyList.length > 0) {
        this.quota = this.companyList.find(item => {
          return item.id === role;
        }).signing_remain;
      }
    },
    selectPlan(item) {
      this.packageList.forEach(item => (item.selected = false));
      item.selected = !item.selected;
      this.packageId = item.id;
      this.unit_price = item.unit_price;
      this.unit = this.formatCurrency[item.currency];
    },
    goStep() {
      this.$emit('goStep', 'next');
      this.$emit(
        'stepInfo',
        {
          corpId: this.role,
          packageId: this.packageId,
          amount: 1
        },
        this.unit_price,
        this.unit
      );
    }
  }
};
</script>
<style lang="scss">
.b-card.one {
  .v-list__tile {
    padding: 0;
    height: 32px;
  }
  .b-plan-area {
    .price {
      text-align: right;
    }
  }
  .elevation-2 {
    box-shadow: none !important;
  }
}
</style>
