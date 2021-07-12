<template>
  <v-flex id="account_info">
    <v-toolbar height="56"
               class="b-toolbar"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('account_info.title')"></header-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-2>
      <v-layout>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <v-card>
            <v-list class="user_info">
              <v-icon class="mt-3">account_circle</v-icon>
              <div class="mb-3" v-text="$t('account_info.welcome_message', [userData.name])" />
            </v-list>
            <v-list >
              <v-list-tile @click.prevent="goto('/client/ChangePassword')">
                <v-list-tile-content>
                  <v-list-tile-title v-text="$t('account_info.update_password_title')" />
                  <v-list-tile-sub-title v-text="$t('account_info.update_password_sub_title')"></v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-avatar>
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-list-tile-avatar>
              </v-list-tile>
              <v-list-tile @click.prevent="goto('/client/AuthCode')">
                <v-list-tile-content>
                  <v-list-tile-title v-text="$t('account_info.update_sign_password_title')" />
                  <v-list-tile-sub-title v-text="$t('account_info.update_sign_password_sub_title')"></v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-avatar>
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-list-tile-avatar>
              </v-list-tile>
            </v-list>
          </v-card>
          <v-card style="margin-top:10px;">
            <v-list>
              <v-list-tile href="javascript:void(0)">
                <v-list-tile-content >
                  <v-list-tile-title v-text="$t('account_info.update_language_title')" />
                  <v-list-tile-sub-title style="white-space:inherit; overflow:visible" v-text="$t('account_info.update_language_sub_title')"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-card style="border-radius: 0 0 8px 8px; box-shadow:none;">
                <Languages/>
              </v-card>
            </v-list>
          </v-card>
          <v-card style="margin-top:10px; margin-bottom:30px">
            <v-list>
              <v-list-tile @click.prevent="goto('/client/SetTags')">
                <v-list-tile-content>
                  <v-list-tile-title v-text="$t('account_info.update_tag_list_title')" />
                  <v-list-tile-sub-title style="white-space:inherit; overflow:visible" v-text="$t('account_info.update_tag_list_sub_title')"></v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-avatar>
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-list-tile-avatar>
              </v-list-tile>
              <v-list-tile @click.prevent="goto('/client/ContactPerson')">
                <v-list-tile-content>
                  <v-list-tile-title v-text="$t('account_info.update_contact_title')" />
                  <v-list-tile-sub-title style="white-space:inherit; overflow:visible" v-text="$t('account_info.update_contact_sub_title')"></v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-avatar>
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-list-tile-avatar>
              </v-list-tile>

              <v-list-tile @click.prevent="goto('/client/CertificationPage')">
                <v-list-tile-content>
                  <v-list-tile-title v-text="$t('account_info.certification_title')" />
                  <v-list-tile-sub-title style="white-space:inherit; overflow:visible" v-text="$t('account_info.certification_sub_title')"></v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-avatar>
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-list-tile-avatar>
              </v-list-tile>
            </v-list>
        </v-card></v-flex>

      </v-layout>
    </v-container>
  </v-flex>
</template>


<script>
const GoBack = () => import('../../components/GoBack.vue');
const Languages = () => import('../../components/Languages.vue');
import { mapGetters } from 'vuex';
import { actions, mutations, getters } from '../../store/type.js';

export default {
  components: {
    GoBack,
    Languages
  },
  computed: {
    ...mapGetters({
      userData: getters.USER_DATA
    })
  },
  methods: {
    goto(router) {
      this.$router.push(router);
    }
  }
};
</script>


<style lang="scss">
#account_info {
  .v-list {
    padding: 0;
  }
  .v-list__tile.v-list__tile--link.theme--light {
    height: 70px;
  }
  .user_info > i {
    font-size: 60px;
  }
  #languages {
    .v-list {
      padding: 0;
    }
    .v-list__tile.v-list__tile--link.theme--light {
      height: 56px;
    }
  }
}
</style>
