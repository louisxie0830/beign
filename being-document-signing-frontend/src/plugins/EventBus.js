export default {
  install(Vue) {
    const bus = new Vue({});
    if (!Vue.$bus) {
      Vue['$bus'] = bus;
    } else {
      Vue.$bus = bus;
    }

    Vue.mixin({
      created: function() {
        if (this.$bus) {
          this.$bus = bus;
        } else {
          this['$bus'] = bus;
        }
      }
    });
  }
};
