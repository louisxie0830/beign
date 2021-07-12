<template>
  <v-flex>
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('user_info.title.text')"></header-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-3>
      <v-layout row
                wrap>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <v-card>
            <v-card-text>
              <v-form ref="form"
                      v-model="valid"
                      lazy-validation>
                <v-flex xs12>
                  <p class="b-label" v-text="$t('common.name')"/>
                </v-flex>
                <v-text-field class="b-input"
                              validate-on-blur
                              v-model.trim="param.name"
                              :placeholder="$t('common.name_placeholder')"
                              single-line
                              outline
                              required
                              :readonly="true"
                              disabled/>

                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.phone')" />
                </v-flex>
                <v-layout row>
                  <v-flex xs5>
                    <v-autocomplete class="b-input"
                                    v-model.trim="mobileCode"
                                    :rules="rules.countryCodes"
                                    :items="countryCodes"
                                    item-text="code"
                                    item-value="iso2"
                                    :placeholder="$t('common.country_code')"
                                    hide-selected
                                    flat
                                    solo :readonly="true" disabled>
                      <template slot="item"
                                slot-scope="{ item }">
                        <template>
                          <v-list-tile-content>
                            <v-list-tile-title> {{ item.iso2 }}: {{ item.code }}</v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs8
                          ml-1>
                    <v-text-field class="b-input"
                                  v-model.trim="phonenumber"
                                  :rules="rules.phone(param.currentCountryIso2)"
                                  :placeholder="$t('common.phone_placeholder')"
                                  hide-no-data
                                  validate-on-blur
                                  single-line
                                  outline
                                  required
                                  :readonly="true" disabled/>
                  </v-flex>
                </v-layout>
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.department')" />
                </v-flex>
                <v-layout row>
                  <v-flex xs12>
                    <v-autocomplete class="b-input"
                                    v-model.trim="param.departmentId"
                                    :items="departmentList"
                                    item-value="id"
                                    item-text="name"
                                    :placeholder="$t('common.unit_name')"
                                    flat
                                    solo
                                    :readonly="isReadOnly">
                      <template slot="item"
                                slot-scope="{ item }">
                        <template>
                          <v-list-tile-content>
                            <v-list-tile-title v-text="item.name"></v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </v-flex>

                </v-layout>

                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.position_name')" />
                </v-flex>

                <v-flex xs12
                        ml-1>
                  <v-text-field class="b-input"
                                v-model.trim="param.positionName"
                                :placeholder="$t('common.position_name_placeholder')"
                                hide-no-data
                                validate-on-blur
                                single-line
                                outline
                                :readonly="isReadOnly" :counter="20" maxlength="20" />
                </v-flex>

                <v-flex xs12>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title v-text="$t('common.setAdmin')" />
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-switch v-model="param.isAdmin"
                                  color="#13c3ea"
                                  :readonly="isReadOnly"/>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                </v-flex>
                <v-flex xs12>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title v-text="$t('common.setStamp')" />
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-switch v-model="param.isSignatureAuthorized"
                                  color="#13c3ea"
                                  :readonly="!isOwner"/>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                </v-flex>
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.area')" />
                </v-flex>
                <v-layout row>
                  <v-flex xs6>
                    <v-autocomplete class="b-input"
                                    v-model.trim="param.country"
                                    :items="REGION"
                                    item-text="name"
                                    item-value="code"
                                    :placeholder="$t('common.countries')"
                                    flat
                                    solo
                                    :readonly="isReadOnly">
                      <template slot="item"
                                slot-scope="{ item }">
                        <template>
                          <v-list-tile-content>
                            <v-list-tile-title> {{ item.name }}</v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs7
                          ml-1>
                    <v-autocomplete class="b-input"
                                    v-model.trim="param.city"
                                    :items="getCity"
                                    item-text="name"
                                    item-value="code"
                                    :placeholder="$t('common.city')"
                                    flat
                                    solo
                                    :readonly="isReadOnly">
                      <template slot="item"
                                slot-scope="{ item }">
                        <template>
                          <v-list-tile-content>
                            <v-list-tile-title> {{ item.name }}</v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </v-flex>
                </v-layout>
              </v-form>

            </v-card-text>
          </v-card>
          <v-flex xs12
                  sm12
                  mt-3
                  d-flex
                  class="b-btn-area"
                  v-if="!isReadOnly">
            <v-btn round
                   class="b-btn"
                   large
                   @click="submit"
                   v-text="$t('common.update')" />
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>
<script>
import CryptoJS from 'crypto-js';
import rulesMixin from '../../mixins/Rules';
import { mapActions, mapGetters } from 'vuex';
import { actions, getters } from '../../store/type.js';
import { countryCodes } from '../../utils/status';

export default {
  mixins: [rulesMixin],
  data() {
    return {
      valid: false,
      param: {
        name: '',
        mobile: '',
        departmentId: 15,
        isAdmin: false,
        country: '',
        city: '',
        userId: '',
        positionName: '',
        isSignatureAuthorized: false
      },
      departmentList: [],
      mobileCode: '',
      phonenumber: '',
      countryCodes: []
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA,
      REGION: getters.REGION,
      CITY: getters.CITY
    }),
    isOwner() {
      return this.USER_DATA.companyList.find(({ id }) => id === +this.$route.params.companyId).role === 1;
    },
    isAdmin() {
      const department = this.USER_DATA.companyList.find(({ id }) => id === +this.$route.params.companyId).department;

      return department && !!department.find(({ adminId }) => +adminId === this.USER_DATA.userId);
    },
    isReadOnly() {
      return !this.isOwner && !this.isAdmin;
    },

    getCity() {
      return this.CITY[this.param.country];
    }
  },
  async created() {
    const userInfoRes = await this.GET_USER_USERINFO_QUERY({
      companyId: this.$route.params.companyId,
      userId: this.$route.params.userId
    });
    for (const key in countryCodes) {
      if (key === 'TW' || key === 'CN' || key === 'KR' || key === 'SG' || key === 'JP' || key === 'HK') {
        this.countryCodes.push(countryCodes[key]);
        this.countryCodes.sort((a, b) => {
          if (a.iso2 > b.iso2) {
            return -1;
          }
          return 0;
        });
      }
    }

    this.param.companyId = this.$route.params.companyId;
    this.param = Object.assign(this.param, userInfoRes);
    this.param.isSignatureAuthorized = userInfoRes.isSignatureAuthorized === 1;
    this.mobileCode = PhoneNumber(`+${this.param.mobile}`).getRegionCode();
    this.phonenumber = PhoneNumber(this.param.mobile, this.mobileCode).getNumber('significant');
    this.departmentList = await this.GET_ORGANIZATION_DEPARTMENTS({ companyId: this.$route.params.companyId });
    this.isAdmin &&
      this.departmentList.filter(item => {
        return +item.adminId === this.USER_DATA.userId;
      });

    this.departmentList.unshift({
      id: 0,
      name: '未分類'
    });

    this.GET_SIGNING_USERS({
      corpId: this.$route.params.companyId,
      role: 'admin'
    });
  },
  methods: {
    ...mapActions({
      GET_USER_USERINFO_QUERY: actions.GET_USER_USERINFO_QUERY,
      GET_ORGANIZATION_DEPARTMENTS: actions.GET_ORGANIZATION_DEPARTMENTS,
      GET_SIGNING_USERS: actions.GET_SIGNING_USERS,
      POST_USER_USER_INFO_UPDATE_OR_CREATE: actions.POST_USER_USER_INFO_UPDATE_OR_CREATE
    }),
    async submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        const {
          companyId,
          userId,
          city,
          country,
          departmentId,
          isAdmin,
          isSignatureAuthorized,
          positionName
        } = this.param;
        await this.POST_USER_USER_INFO_UPDATE_OR_CREATE({
          companyId,
          userId,
          departmentId: departmentId,
          city,
          country,
          isAdmin,
          positionName,
          isSignatureAuthorized
        });
        this.alert.show({
          content: this.$t('user_info.update_success'),
          position: 'middle'
        });
      } catch (e) {
        console.error('e: ', e);
      }
    }
  }
};
</script>

<style lang="scss">
</style>
