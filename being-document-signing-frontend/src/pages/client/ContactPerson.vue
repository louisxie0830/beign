<template>
  <v-flex id="contact_person"
          ref="container">
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('index.data.left_menu.set_contact')"></header-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-0>
      <v-layout>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3
                v-show="showAddContact">
          <div @click.stop="jumpToAddContact">

            <img class="people"
                 src="./../../assets/image/people@2x.png">
            <p class="b-context"
               v-text="$t('add_contact.toolbar_title.text')" />
            <v-flex xs12
                    sm12
                    ma-3
                    d-flex
                    class="b-btn-area mt-4">
              <v-btn round
                     large
                     class="b-btn"
                     @click.stop="jumpToAddContact"
                     v-text="$t('common.add')" />
            </v-flex>
          </div>
        </v-flex>

        <v-flex v-show="!showAddContact"
                xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <div class="search">
            <v-text-field class="b-input"
                          v-model.lazy="searchName"
                          @input="searchContact"
                          :placeholder="$t('common.search_word_placeholder')"
                          outline />
          </div>
          <v-list class="b-list">
            <template v-for="(item, index) in fuzzySearchName">
              <v-list-tile :key="index + item.name"
                           avatar
                           ripple>
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.name" />
                  <v-list-tile-sub-title v-text="item.email" />
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon
                         round
                         @click.stop="delMember(item)">
                    <v-icon color="rgba(25,31,37,.28)">delete_forever</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < fuzzySearchName.length"
                         :key="index" />
            </template>
            <v-flex ma-3
                    v-show="!isLoading"
                    v-text="getLoadingWording" />
            <v-flex ma-3
                    v-show="isLoading">
              <v-progress-circular indeterminate
                                   color="primary" />
            </v-flex>
          </v-list>
          <v-flex xs12
                  sm12
                  ma-2
                  d-flex
                  class="b-btn-area">
            <v-btn round
                   large
                   class="b-btn"
                   @click.stop="jumpToAddContact"
                   v-text="$t('common.add')" />
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { actions, getters } from './../../store/type.js';

export default {
  data() {
    return {
      contact: [],
      hasNext: false,
      isLoading: false,
      searchName: '',
      //   showAddContact: false,
      param: {
        start: 0,
        limit: 20,
        keyword: ''
      }
    };
  },
  computed: {
    ...mapGetters({
      CONTACT: getters.CONTACT
    }),
    showAddContact() {
      return this.CONTACT <= 0;
    },
    getLoadingWording() {
      if (this.hasNext) {
        return this.$t('common.loading');
      } else {
        return '';
      }
    },
    fuzzySearchName() {
      if (this.searchName) {
        return this.CONTACT.filter(c => {
          let regex = new RegExp('(' + this.searchName + ')', 'i');
          return c.name.match(regex);
        });
      }
      return this.CONTACT;
    }
  },
  created() {},
  methods: {
    ...mapActions({
      GET_CONTACT_LIST: actions.GET_CONTACT_LIST,
      POST_CONTACT_DELETE: actions.POST_CONTACT_DELETE
    }),
    delMember({ name, id }) {
      this.modal.show({
        title: this.$t('common.del_confirmed'),
        content: this.$t('contact_person.del_member_message.text'),
        onConfirm: async () => {
          try {
            await this.POST_CONTACT_DELETE({ contractId: Number(id) });
            this.toast.show({
              icon: 'check',
              content: this.$t('common.del_success')
            });
            this.$forceUpdate();
          } catch (error) {
            this.toast.show({
              icon: 'info',
              content: this.$t('common.del_fail')
            });
          }
        }
      });
    },
    jumpToAddContact() {
      this.$router.push({ name: 'AddContact' });
    }
  }
};
</script>
<style lang="scss">
#contact_person {
  // overflow: hidden;
  // max-height: 100vh;
  .b-icon-add {
    font-size: 80px;
  }
  .people {
    margin-top: 40px;
    width: 117px;
    height: 103px;
    object-fit: contain;
  }
  .search {
    background-color: #fff;
    padding-top: 8px;
    padding-left: 14px;
    padding-right: 14px;
  }
  .b-input {
    .v-input__slot {
      border: 1px solid #dcdfe6 !important;
      min-height: 40px !important;
      background: #ededee !important;
      color: rgba(25, 31, 37, 0.4) !important;

      .v-text-field__slot {
        margin: 0;
        & input {
          margin-top: 4px !important;
        }
      }
    }
    &.v-input--is-focused.v-input--has-state {
      .v-input__slot {
        border: 1px solid red !important;
      }
    }
    &.v-messages .theme--light {
      display: none;
    }
    .v-text-field__details {
      display: none;
    }
  }
  .b-list {
    height: calc(100vh - 200px);
    padding: 4px 0;
    overflow: auto;
  }
}
</style>
