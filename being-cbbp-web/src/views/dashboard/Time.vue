<template>
  <span>{{ time }}</span>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      time: '',
      timer: null
    }
  },
  created () {
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.time = moment().format('YYYY-MM-DD HH:mm:ss')
    }, 1000)
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>
