<template>
  <v-list id="languages" class="b-list">
    <template v-for="(item, index) in languages">
      <v-list-tile @click="setLanguages(item)"
                   :key="item.name"
                   avatar
                   ripple>
        <v-list-tile-content>
          <v-list-tile-title v-text="$t(`set_languages.${item}.text`)" />
        </v-list-tile-content>

        <v-list-tile-avatar>
          <v-icon v-show="item === currentLang"
                  color="#13c3ea">check</v-icon>
        </v-list-tile-avatar>

      </v-list-tile>

      <v-divider v-if="index + 1 < languages.length"
                 :key="index" />
    </template>
  </v-list>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { actions, getters } from '../store/type';
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
