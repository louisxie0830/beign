<template>
  <v-flex id="register">
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <v-toolbar-title v-text="$t('set_languages.title.text')" />
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-0>
      <v-layout row
                wrap>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <v-list class="b-list">
            <template v-for="(item, index) in languages">
              <v-list-tile @click="setLanguages(item)"
                           :key="item.name"
                           avatar
                           ripple>
                <v-list-tile-content>
                  <v-list-tile-title v-text="$t(`set_languages.${item}.text`)" />
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon v-show="item === currentLang"
                          large
                          color="#13c3ea">check</v-icon>
                </v-list-tile-action>

              </v-list-tile>

              <v-divider v-if="index + 1 < languages.length"
                         :key="index" />
            </template>
          </v-list>
          <v-flex mt-2>
            <span class="prompt">{{ $t('set_languages.prompt.text') }}</span>
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
      languages: []
    };
  },
  computed: {
    ...mapGetters({
      currentLang: getters.LANG
    })
  },
  created() {
    for (const key in this.$i18n.messages) {
      this.languages.push(key);
    }
  },
  methods: {
    ...mapActions({
      UPDATE_LANG: actions.POST_USER_LANG
    }),
    setLanguages(lang) {
      this.UPDATE_LANG({ lang });
    }
  }
};
</script>
<style lang="scss">
@import './../../assets/scss/_variables.scss';
.prompt {
  color: $dark-28;
  font-size: 13px;
}
</style>
