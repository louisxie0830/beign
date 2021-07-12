<template>
  <v-list id="sponsor"
          class="mt-1">
    <v-list-tile>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t('signing.sponsor_sign') }}</v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-switch v-model="sponsorStatus"
                  color="#13c3ea"
                  @change="toggleSponsorStatus(sponsorStatus)" />
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  props: {
    creatorSign: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    sponsorStatus() {
      return this.creatorSign;
    }
  },
  methods: {
    toggleSponsorStatus(status) {
      this.$emit('updataSponsorStatus', !status);
    }
  }
};
</script>
<style lang="scss">
#sponsor {
  .v-list__tile {
    padding: 0;
  }
}
</style>
