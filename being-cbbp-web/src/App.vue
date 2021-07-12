<template>
  <a-locale-provider :locale="this.lang ? this.language[this.lang] : zhTW">
    <div id="app">
      <router-view />
      <web3-decrypt />
      <web3-loading />
    </div>
  </a-locale-provider>
</template>

<script>
// import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import enUS from 'ant-design-vue/lib/locale-provider/en_US'
import zhTW from 'ant-design-vue/lib/locale-provider/zh_TW'
import { AppDeviceEnquire } from '@/utils/mixin'
import Web3Decrypt from './components/Web3Decrypt'
import Web3Loading from './components/Web3Loading'
import { mapState } from 'vuex'

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      language: {
        'en-US': enUS,
        'zh-TW': zhTW
      }
    }
  },
  components: {
    'web3-decrypt': Web3Decrypt,
    'web3-loading': Web3Loading
  },
  computed: {
    ...mapState({
      lang: state => state.i18n.lang
    })
  }
}
</script>
<style>
#app {
  height: 100%;
}
.demo-icon {
  font-family: 'fontello';
  font-style: normal;
  font-weight: normal;
  speak: none;

  display: inline-block;
  text-decoration: inherit;
  width: 1em;
  margin-right: 0.2em;
  text-align: center;
  /* opacity: .8; */

  /* For safety - reset parent styles, that can break glyph codes*/
  font-variant: normal;
  text-transform: none;

  /* fix buttons height, for twitter bootstrap */
  line-height: 1em;

  /* Animation center compensation - margins should be symmetric */
  /* remove if not needed */
  margin-left: 0.2em;

  /* You can be more comfortable with increased icons size */
  /* font-size: 120%; */

  /* Font smoothing. That was taken from TWBS */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* Uncomment for 3D effect */
  /* text-shadow: 1px 1px 1px rgba(127, 127, 127, 0.3); */
}
</style>
