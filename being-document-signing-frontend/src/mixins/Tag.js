import { mapActions, mapGetters, mapMutations } from 'vuex';
import { actions, mutations, getters } from './../store/type';
export default {
  computed: {
    ...mapGetters({
      TAG_LIST: getters.TAG_LIST
    })
  }
};
