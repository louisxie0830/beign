<template>
  <v-list id="switch_sign_status">
    <v-list-tile>
      <v-list-tile-content>
        <v-list-tile-title> {{ type === 'message' ? $t('singing.notices_status.message') : $t('singing.notices_status') }}</v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-switch v-model="status"
                  color="#13c3ea"
                  @change="toggleStatus(status)" />
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  props: {
    emailSwitch: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    status() {
      return this.emailSwitch;
    }
  },
  methods: {
    toggleStatus(status) {
      this.$emit('updateNoticesSignStatus', !status);
    }
  }
};
</script>
<style lang="scss">
#switch_sign_status {
  .v-list__tile {
    padding: 0;
  }
}
</style>
