<template>
  <div>
    <a-modal :footer="null" :visible="web3Loading" :closable="false">
      <div align="center" style="padding: 40px 0;">
        <p>
          <img src="../assets/shipmentbg/picture-book-star.png" />
        </p>
        <p style="color: red; margin-bottom: 60px;">
          {{ $t('web3LoadingText') }}
        </p>
        <a-icon type="loading" style="color: red; font-size:40px;" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Web3Decrypt',
  data () {
    return {}
  },
  computed: {
    ...mapState({
      web3Loading: state => state.web3.web3Loading
    })
  },
  methods: {}
}
</script>
