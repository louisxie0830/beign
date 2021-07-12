<template>
  <v-card id="sign-read-person">
    <v-card-text>

      <v-flex xs12
              v-if="readerList.length === 0">
        <span class="init-btn"
              @click="openModal">
          <v-container pa-0>
            <v-layout row
                      wrap>
              <v-flex xs10>
                <p v-text="$t('signing.add_reader.text')" />
              </v-flex>
              <v-flex xs2
                      class="init-icon">
                <v-icon>add_circle_outline</v-icon>
              </v-flex>
            </v-layout>
          </v-container>
        </span>
      </v-flex>

      <v-list v-if="readerList.length > 0 ">
        <v-flex xs12>
          <p class="b-label">{{ $t('signing.reader.text') }}</p>
        </v-flex>

        <SignList :list.sync="readerList" list-type="view" @updateMember="updateReaderList" @removeMember="removeMember" />

        <v-flex xs12>
          <v-btn class="b-btn white"
                 :flat="true"
                 large
                 @click="openModal">
            <v-icon>add</v-icon>
            <span v-text="$t('signing.add_reader.text')" />
          </v-btn>
        </v-flex>
      </v-list>

      <!-- 新增閱覽人 modal -->
      <v-dialog v-model="showAddContactModal"
                persistent
                scrollable
                lazy
                max-width="500px">
        <v-card style="max-width:100%">
          <v-card-title v-text="$t('signing.add_reader.text')" />
          <v-card-text id="sign_read_contact_content"
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
                         @click="showContactModal = true"
                         v-text="$t('signing.add_contact_form_record.text')" />
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
                <v-flex xs12>
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
            <v-layout wrap
                      v-show="showContactModal">
              <v-flex xs12
                      v-show="!showNotContactIcon">
                <div class="search px-3">
                  <v-text-field class="b-input"
                                v-model.trim="searchName"
                                :placeholder="$t('common.search_word_placeholder')"
                                outline />
                </div>
                <v-list class="b-list">
                  <template v-for="(item, index) in fuzzySearchReadMember">
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

                    <v-divider v-if="index + 1 < fuzzySearchReadMember.length"
                               :key="index" />
                  </template>
                  <!-- <v-flex ma-3
                          v-show="!isLoading"
                          v-text="getLoadingWording" />
                  <v-flex ma-3
                          v-show="isLoading">
                    <v-progress-circular indeterminate
                                         color="primary" />
                  </v-flex> -->
                </v-list>
              </v-flex>
              <v-flex justify-center
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
import SignList from '../components/SignList';
import NotContactImage from './../components/NotContactImage';
import { mapActions, mapGetters } from 'vuex';
import { actions, getters } from './../store/type.js';

export default {
  components: { SignList, NotContactImage },
  mixins: [rulesMixin],
  props: {
    readerList: {
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
    fuzzySearchReadMember() {
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
          return this.readerList.length > 0 && this.readerList.some(m => m.email === email);
        };
        let contact = JSON.parse(JSON.stringify(this.CONTACT));
        return contact
          .map(member => {
            if (this.readerList.length > 0) {
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
    checkReader(email) {
      return this.readerList.length > 0 && this.readerList.some(reader => reader.email === email);
    },
    addMember() {
      if (!this.showContactModal) {
        if (!this.$refs.form.validate()) {
          return;
        }
        let { name, email } = this.addContactData;
        email = email.toLowerCase();

        const updateReaderList = ({ id, name, email }) => {
          const readerList = [...this.readerList, ...[{ id: id, name: name, email: email, active: true }]];
          this.addContactData = this.getDefaultAddContactData();
          this.updateReaderList(readerList);
          this.showAddContactModal = false;
        };

        if (!this.checkMember(email)) {
          updateReaderList(this.addContactData);
        } else if (!this.checkReader(email)) {
          let member = null;
          member = this.contactList.find(m => m.email === email);
          member.name = name;
          updateReaderList(member);
        } else if (this.checkReader(email)) {
          this.readerList.map(reader => {
            if (reader.email === email) {
              reader.name = name;
            }
            return reader;
          });
          this.showAddContactModal = false;
        }
      } else {
        if (this.contactList.length <= 0) {
          this.showContactModal = false;
          return;
        }
        let readerList = [];
        if (this.readerList.length > 0) {
          readerList = this.readerList.filter(member => {
            return !this.contactList.some(c => c.email === member.email);
          });
          readerList = [...readerList, ...this.contactList];
        } else {
          readerList = this.contactList;
        }
        readerList = readerList.filter(m => !!m.active);
        if (readerList.length > 0) {
          this.updateReaderList(readerList);
        }
        this.showAddContactModal = false;
        this.showContactModal = false;
      }
    },
    updateReaderList(readerList) {
      this.$emit('updateReaderList', readerList);
    },
    removeMember({ name, email }) {
      const readerList = this.readerList.filter(m => !(m.name === name && m.email === email));
      this.$emit('updateReaderList', readerList);
    }
  }
};
</script>


<style lang="scss">
#sign-read-person {
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

#sign_read_contact_content {
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
