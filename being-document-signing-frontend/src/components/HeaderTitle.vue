<template>
  <v-toolbar-title >
    <div class="logo-title" @click="$router.push('/')">
      <div class="logo-box"><span class="logo-image"></span></div><div class="logo-content">{{ getTitle }}</div>
    </div>
  </v-toolbar-title>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'title'
    }
  },
  computed: {
    getTitle() {
      return this.title;
    }
  }
};
</script>
