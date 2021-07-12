<template>
  <v-flex>
    <div id="policy">
      <v-toolbar height="56"
                 app>
        <v-flex xs2>
          <go-back />
        </v-flex>
        <v-flex xs8>
          <v-toolbar-title v-text="$t('register.user_policy.text')">用戶使用条款</v-toolbar-title>
        </v-flex>
        <v-flex xs2 />
      </v-toolbar>
      <v-layout>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <v-content>
            <v-container fluid>
              <iframe :src="contentUrl"
                      class="myiframe"
                      width="100%" />
            </v-container>
          </v-content>
        </v-flex>
      </v-layout>
    </div>
  </v-flex>

</template>
<script>
export default {
  data() {
    return {
      contentUrl: '/static/policy/' + this.$i18n.locale + '.html'
    };
  },
  created() {}
};
</script>
<style lang="scss">
.myiframe {
  height: calc(100vh - 100px);
  border: 0px;
}
#policy {
  margin: 0;
  padding: 0;
  text-align: left;
  ul {
    margin: 0;
    padding: 0;
  }
  p {
    text-align: left;
  }
  li {
    list-style: none;
  }
  .container {
    line-height: 1.71;
    font-size: 14px;
  }
}
</style>
