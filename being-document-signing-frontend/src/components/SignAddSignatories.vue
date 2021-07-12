<template>
  <v-card id="sign-add-signatories">
    <v-card-text>
      <v-flex xs12
              v-show="signerList.length === 0">
        <span class="init-btn"
              @click="openModal">
          <v-container pa-0>
            <v-layout row
                      wrap>
              <v-flex xs10>
                <p v-text="$t('signing.add_signer.text')" />
              </v-flex>
              <v-flex xs2
                      class="init-icon">
                <v-icon>add_circle_outline</v-icon>
              </v-flex>
            </v-layout>
          </v-container>
        </span>
      </v-flex>
      <v-list v-if="signerList.length > 0">
        <v-flex xs12>
          <p class="b-label">{{ $t('signing.signer.text') }}</p>
        </v-flex>
        <!-- sign list -->
        <SignList :list.sync="signerList" @updateMember="updateSignList" @removeMember="removeMember"/>

        <v-flex xs12>
          <v-btn class="b-btn white"
                 :flat="true"
                 large
                 @click="openModal">
            <v-icon>add</v-icon>
            <span v-text="$t('signing.add_signer.text')" />
          </v-btn>
        </v-flex>
      </v-list>
      <!-- 新增簽署人 modal -->
      <v-dialog id="signModal"
                v-model="showAddContactModal"
                persistent
                scrollable
                lazy
                max-width="500px">
        <v-card style="max-width:100%">
          <v-card-title v-text="$t('signing.add_signer.text')" />
          <v-card-text id="signatories_contact_content"
                       style="max-height:300px">
            <v-layout wrap
                      v-show="!showContactModal">
              <v-form style="width:100%;padding: 0 16px;"
                      ref="form"
                      v-model="valid"
                      lazy-validation>
                <v-flex xs12
                        sm12>
                  <v-btn block
                         round
                         outline
                         color="#13c3ea"
                         v-text="$t('signing.add_contact_form_record.text')"
                         @click="showContactModal = true" />
                </v-flex>
                <v-flex xs12
                        sm6
                        md4>
                  <p class="b-label"
                     v-text="$t('common.name')" />
                </v-flex>
                <v-text-field class="b-input"
                              v-model.trim="addContactData.name"
                              validate-on-blur
                              :rules="rules.name"
                              :placeholder="$t('common.name_placeholder')"
                              single-line
                              outline
                              required />
                <v-flex xs12
                        sm6
                        md4>
                  <p class="b-label">Email</p>
                </v-flex>
                <v-text-field class="b-input"
                              v-model.trim="addContactData.email"
                              validate-on-blur
                              :rules="rules.email"
                              :placeholder="$t('common.mail_placeholder')"
                              single-line
                              outline
                              required />
              </v-form>
            </v-layout>
            <v-layout v-show="showContactModal"
                      wrap>
              <v-flex xs12
                      v-show="!showNotContactIcon">
                <div class="search px-3">
                  <v-text-field class="b-input"
                                v-model.trim="searchName"
                                :placeholder="$t('common.search_word_placeholder')"
                                outline />
                </div>
                <v-list class="b-list">
                  <template v-for="(item, index) in fuzzySearchSigerMember">
                    <v-list-tile @click="selectMember(item)"
                                 :key="item.id"
                                 avatar
                                 ripple>
                      <v-list-tile-content>
                        <v-list-tile-title v-text="item.name" />
                        <v-list-tile-sub-title v-text="item.email" />
                      </v-list-tile-content>

                      <v-list-tile-action>
                        <v-icon v-show="item.active"
                                color="#13c3ea">check</v-icon>
                      </v-list-tile-action>

                    </v-list-tile>

                    <v-divider v-if="index + 1 < fuzzySearchSigerMember.length"
                               :key="index" />
                  </template>
                  <!-- <v-flex ma-3
                          v-show="!isLoading"
                          v-text="getLoadingWording" /> -->
                  <!-- <v-flex ma-3
                          v-show="isLoading">
                    <v-progress-circular indeterminate
                                         color="primary" />
                  </v-flex> -->
                </v-list>
              </v-flex>
              <v-flex xs12
                      justify-center
                      v-show="showNotContactIcon">
                <not-contact-image :options="{'width':'150px', 'height': '120px'}" />
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn round
                   class="b-btn white"
                   @click="closeModal"
                   v-text="$t('common.cancel')" />
            <v-btn round
                   class="b-btn"
                   @click="addMember"
                   v-text="$t('common.confirm')" />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>
<script>
import rulesMixin from './../mixins/Rules.js';
import NotContactImage from './../components/NotContactImage';
import SignList from '../components/SignList';
import { mapActions, mapGetters } from 'vuex';
import { actions, getters } from './../store/type.js';

export default {
  components: {
    SignList,
    NotContactImage
  },
  mixins: [rulesMixin],
  props: {
    signerList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      valid: false,
      searchName: '',
      showContactModal: false,
      showAddContactModal: false,
      addContactData: {
        email: '',
        name: ''
      },
      contactList: []
    };
  },
  computed: {
    ...mapGetters({
      CONTACT: getters.CONTACT
    }),
    fuzzySearchSigerMember() {
      if (this.searchName) {
        return this.contactList.filter(c => {
          let regex = new RegExp('(' + this.searchName + ')', 'i');
          return c.name.match(regex);
        });
      }
      return this.contactList;
    },
    showNotContactIcon() {
      return this.contactList.length <= 0;
    }
  },
  methods: {
    ...mapActions({
      POST_ADD_CONTACT: actions.POST_ADD_CONTACT,
      errHandler: 'errHandler'
    }),
    getDefaultAddContactData() {
      return {
        email: '',
        name: ''
      };
    },
    updateData() {
      if (this.CONTACT.length > 0) {
        const checkMember = ({ email }) => {
          return this.signerList.length > 0 && this.signerList.some(m => m.email === email);
        };
        let contact = JSON.parse(JSON.stringify(this.CONTACT));
        return contact
          .map(member => {
            if (this.signerList.length > 0) {
              member.active = checkMember(member);
            } else {
              member.active = false;
            }
            return member;
          })
          .sort(member => {
            if (!!member.active) {
              return -1;
            }
            return 0;
          });
      }
      return [];
    },
    openModal() {
      this.contactList = this.updateData();
      this.addContactData = this.getDefaultAddContactData();
      this.searchName = '';
      this.showAddContactModal = true;
      this.showContactModal = false;
    },
    closeModal() {
      if (!this.showContactModal) {
        this.showAddContactModal = false;
        this.showContactModal = false;
      } else {
        this.showContactModal = false;
      }
      this.$refs.form.resetValidation();
    },
    selectMember(memberInfo) {
      memberInfo.active = !memberInfo.active;
      this.$forceUpdate();
    },
    checkMember(email) {
      return this.contactList.length > 0 && this.contactList.some(m => m.email === email);
    },
    checkSigner(email) {
      return this.signerList.length > 0 && this.signerList.some(singer => singer.email === email);
    },
    addMember() {
      if (!this.showContactModal) {
        if (!this.$refs.form.validate()) {
          return;
        }
        let { name, email } = this.addContactData;
        email = email.toLowerCase();

        const updateSignerList = async ({ id, name, email }) => {
          // 新增簽署人
          let res = await this.POST_ADD_CONTACT({
            name: name,
            email: email
          });
          if (Object.keys(res).length > 0) {
            const signerList = [...this.signerList, ...[{ id: id, name: name, email: email, active: true }]];
            this.addContactData = this.getDefaultAddContactData();
            this.updateSignList(signerList);
            this.showAddContactModal = false;
          }
        };
        if (!this.checkMember(email)) {
          updateSignerList(this.addContactData);
        } else if (!this.checkSigner(email)) {
          let member = null;
          member = this.contactList.find(m => m.email === email);
          member.name = name;
          updateSignerList(member);
        } else if (this.checkSigner(email)) {
          this.signerList.map(signer => {
            if (signer.email === email) {
              signer.name = name;
            }
            return signer;
          });
          this.showAddContactModal = false;
        }
      } else {
        if (this.contactList.length <= 0) {
          this.showContactModal = false;
          return;
        }
        let signerList = [];
        let emailList = [];
        if (this.signerList.length > 0) {
          // 选中的联系人的邮箱列表
          const cEmailList = this.contactList.filter(item => item.active).map(item => item.email);
          // 选中的联系人已在签署人列表
          this.signerList.map(item => {
            if (cEmailList.includes(item.email)) {
              signerList.push(item);
              emailList.push(item.email);
            }
          });
          // 选中的联系人不在签署人列表
          this.contactList.map(item => {
            if (cEmailList.includes(item.email) && !emailList.includes(item.email)) {
              signerList.push(item);
            }
          });
          console.log('signerList33333', signerList);
        } else {
          signerList = this.contactList;
        }
        signerList = signerList.filter(m => !!m.active);

        if (signerList.length > 0) {
          this.updateSignList(signerList);
        }
        this.showAddContactModal = false;
        this.showContactModal = false;
      }
    },
    updateSignList(signerList) {
      this.$emit('updateSignerList', signerList);
    },
    removeMember({ name, email }) {
      const signerList = this.signerList.filter(m => !(m.name === name && m.email === email));
      this.$emit('updateSignerList', signerList);
    }
  }
};
</script>
<style lang="scss">
#sign-add-signatories {
  .search {
    background-color: #fff;
    padding-top: 8px;
    padding-left: 14px;
    padding-right: 14px;
  }
  .titleNo {
    border: 1px solid #cccc;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
    font-size: 12px;
    line-height: 20px;
  }
  .titleNo,
  .titleName,
  .title-info {
    display: inline-block;
    vertical-align: middle;
  }
  .title-info {
    margin-top: 10px;
  }
  .v-list__tile--avatar {
    height: auto;
  }
  .v-list {
    border-bottom: 0;
    padding: 0;
  }
  .v-list__tile {
    padding: 0;
  }
  .init-btn {
    cursor: pointer;
    &p {
      text-align: left;
      margin: 0;
    }
  }
  .list-item {
    margin-top: 10px;
  }
}
#signatories_contact_content {
  overflow: hidden;
  &.v-card__text {
    padding: 0;
  }
  .search .b-input .v-text-field__details {
    display: none;
  }
  .b-list {
    overflow-y: auto;
    height: 230px;
    .v-list__tile__content {
      max-width: calc(100% - 32px);
    }
    .v-list__tile__action {
      min-width: 0;
      max-width: 24px;
    }
  }
}
</style>
