<template>
  <v-flex>
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('invite_friends.title')"></header-title>
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
            <v-list>
              <v-list-tile href="javascript:void(0)">
                <v-list-tile-content >
                  <v-list-tile-title v-text="$t('invite_friends.company.name')" />
                  <v-list-tile-sub-title style="white-space:inherit; overflow:visible" v-text="companyName"/>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
          <v-card style="margin-top: 10px;">
            <v-card-text>
              <v-flex xs12>
                <p class="b-label"
                   v-text="$t('department_editing.add_department_modal_input_title.text')" />
              </v-flex>
              <v-select v-model="departmentId"
                        dense
                        attach
                        item-text="name"
                        item-value="id"
                        :items="department"
                        :change="changeDepartment(departmentId)"/>
              <v-flex xs12>
                <p class="b-label" v-text="$t('common.position_name')"/>
              </v-flex>
              <v-text-field class="b-input"
                            validate-on-blur
                            v-model.trim="inviteUserData.positionName"
                            :placeholder="$t('common.position_name_placeholder')"
                            single-line
                            outline
                            required :counter="20" maxlength="20"/>
            </v-card-text>
          </v-card>

          <v-card style="margin-top: 10px;">
            <v-card-text>
              <v-form ref="form"
                      v-model="valid"
                      lazy-validation>
                <v-flex xs12>
                  <p class="b-label" v-text="$t('common.name')"/>
                </v-flex>
                <v-text-field class="b-input"
                              validate-on-blur
                              v-model.trim="inviteUserData.name"
                              :rules="rules.name"
                              :placeholder="$t('common.name_placeholder')"
                              single-line
                              outline
                              required />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.phone')" />
                </v-flex>
                <v-text-field class="b-input"
                              validate-on-blur
                              v-model.trim="inviteUserData.phone"
                              v-disable-paste
                              :placeholder="$t('common.phone_placeholder')"
                              type="text"
                              single-line
                              outline
                              required />

                <v-flex xs12>
                  <p class="b-label">Email</p>
                </v-flex>
                <v-text-field outline
                              required
                              class="b-input"
                              v-model.trim="inviteUserData.email"
                              validate-on-blur
                              :rules="rules.email"
                              :placeholder="$t('common.email_rules.input_email')" />

                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.area')" />
                </v-flex>
                <v-layout row>
                  <v-flex xs6>
                    <v-autocomplete class="b-input"
                                    v-model.trim="inviteUserData.countries"
                                    :items="REGION"
                                    item-text="name"
                                    item-value="code"
                                    :placeholder="$t('common.countries')"
                                    hide-selected
                                    flat
                                    solo>
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
                                    v-model.trim="inviteUserData.city"
                                    :items="getCity"
                                    item-text="name"
                                    item-value="code"
                                    :placeholder="$t('common.city')"
                                    hide-selected
                                    flat
                                    solo>
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
                  class="b-btn-area">
            <v-btn round
                   class="b-btn"
                   large
                   v-text="'送出'"
                   @click="sendInvitedMail()" />
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>


<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import { getters, actions, mutations } from './../../store/type.js';
import rulesMixin from '../../mixins/Rules.js';

export default {
  mixins: [rulesMixin],
  data() {
    return {
      valid: false,
      companyName: '',
      inviteUserData: {
        name: '',
        phone: '',
        email: '',
        countries: '',
        city: '',
        positionName: ''
      },
      departmentId: ''
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA,
      CITY: getters.CITY,
      REGION: getters.REGION
    }),
    getCity() {
      return this.CITY[this.inviteUserData.countries];
    },
    department() {
      const company = this.USER_DATA.companyList.find(({ id }) => id === +this.$route.params.companyId);
      if (company.role === 1) {
        return company.department;
      } else if (company.role === 2) {
        return company.department.filter(item => item.id === this.departmentId);
      } else {
        return [];
      }
    }
  },
  created() {
    this.SET_REGION(this.USER_DATA.lang);
    this.SET_CITY(this.USER_DATA.lang);
    this.companyName = this.USER_DATA.companyList.find(c => {
      return +c.id === +this.$route.params.companyId;
    }).name;
    this.departmentId = this.USER_DATA.companyList.find(
      ({ id }) => id === +this.$route.params.companyId
    ).department[0].id;
  },
  methods: {
    ...mapActions({
      INVITED_MAIL_SEND: actions.POST_INVITED_MAIL_SEND
    }),
    ...mapMutations({
      SET_REGION: mutations.SET_REGION,
      SET_CITY: mutations.SET_CITY
    }),
    sendInvitedMail() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.INVITED_MAIL_SEND({
        name: this.inviteUserData.name,
        email: this.inviteUserData.email,
        mobile: this.inviteUserData.phone,
        departmentId: this.departmentId,
        companyId: this.$route.params.companyId,
        country: this.inviteUserData.countries,
        city: this.inviteUserData.city,
        positionName: this.inviteUserData.positionName
      });
    },
    changeDepartment(departmentId) {
      console.log('departmentId: ', departmentId);
    }
  }
};
</script>
