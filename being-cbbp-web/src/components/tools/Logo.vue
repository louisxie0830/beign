<template>
  <div class="logo">
    <router-link :to="{ name: 'dashboard' }">
      <h1 v-if="showTitle">
        <p style="height:44px;width:60px;"><img :src="title" style="width:100%;height:100%;" /></p>
      </h1>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: require('@/../public/logo.png'),
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
