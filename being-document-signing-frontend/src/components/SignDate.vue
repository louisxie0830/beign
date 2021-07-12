<template>
  <div id="sign-date"
       class="b-input"
       @click="openDataPicker()">
    <v-container pa-0>
      <v-layout row
                wrap>
        <v-flex xs10>
          <span v-text="date" />
        </v-flex>
        <v-flex xs2
                class="b-icon">
          <v-icon v-if="isDate">clear</v-icon>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import debounce from 'lodash/debounce';
export default {
  props: {
    duteDate: {
      type: [String, Date],
      default: ''
    }
  },
  data() {
    return {
      date: this.$t('common.no')
    };
  },
  computed: {
    isDate() {
      let date = new Date(this.date);
      return date instanceof Date && !isNaN(date.valueOf());
    }
  },
  watch: {
    duteDate(val) {
      if (val && val !== new Date(0).toISOString()) {
        this.date = moment(val).format('YYYY-MM-DD');
      } else {
        this.date = this.$t('common.no');
      }
    }
  },
  methods: {
    openDataPicker() {
      if (this.isDate) {
        this.date = this.$t('common.no');
        this.$emit('updataDueDate', '');
      } else {
        this.datePicker.show({
          onConfirm: date => {
            this.date = date;
            this.$emit('updataDueDate', date);
          }
        });
      }
    }
  }
};
</script>
<style lang="scss">
#sign-date {
  display: flex;
  padding: 0 12px;
  &.b-input {
    height: 40px;
    .flex {
      align-self: center;
    }
  }
  .b-icon {
    text-align: right;
  }
}
</style>
