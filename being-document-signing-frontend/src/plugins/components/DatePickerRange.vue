<template>
  <div class="date-range dar">
    <div v-if="showPresets"
         class="date-range__presets">
      <v-list :dark="dark">
        <v-subheader>{{ labels.preset }}</v-subheader>
        <v-list-tile v-for="(preset, index) in presets"
                     v-model="isPresetActive[index]"
                     :key="index"
                     @click="onPresetSelect(index)">
          <v-list-tile-content>{{ preset.label }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </div>
    <div class="date-range__pickers">
      <v-menu class="date-range__picker date-range__pickers--start"
              v-model="startDateMenu"
              :close-on-content-click="false"
              lazy
              transition="slide-x-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px">
        <v-text-field v-if="highlightRange"
                      slot="activator"
                      v-model="formattedStartDate"
                      :placeholder="labels.start"
                      name="startDate"
                      class="b-input date-range__pickers-input"
                      :prepend-icon="prependIcon"
                      :prepend-inner-icon="prependInnerIcon"
                      readonly />
        <v-text-field v-if="!highlightRange"
                      slot="activator"
                      v-model="formattedStartDate"
                      :placeholder="`Date(${format})`"
                      name="startDate"
                      class="b-input date-range__pickers-input"
                      :prepend-icon="prependIcon"
                      ::prepend-inner-icon="prependInnerIcon"
                      readonly />
        <v-date-picker :next-icon="nextIcon"
                       :prev-icon="prevIcon"
                       :dark="dark"
                       :events="highlightRange ? dateRange.dates : events"
                       :event-color="highlightRange ? dateRange.colors : eventColor"
                       v-model="startDate"
                       :min="options.minDate"
                       :max="endDate"
                       :locale="locale"
                       :first-day-of-week="firstDayOfWeek"
                       no-title
                       @change="onDateRangeChange; startDateMenu = false" />
      </v-menu>
      <v-menu v-if="highlightRange"
              class="date-range__picker date-range__picker--end"
              v-model="endDateMenu"
              :close-on-content-click="false"
              transition="slide-x-transition"
              lazy
              offset-y
              :nudge-left="160"
              full-width
              max-width="290px"
              min-width="290px">
        <v-text-field slot="activator"
                      :placeholder="labels.end"
                      v-model="formattedEndDate"
                      :prepend-icon="prependIcon"
                      :prepend-inner-icon="prependInnerIcon"
                      name="endDate"
                      class="b-input date-range__pickers-input"
                      readonly />
        <v-date-picker :next-icon="nextIcon"
                       :prev-icon="prevIcon"
                       :dark="dark"
                       :min="startDate"
                       :max="maxDate"
                       :events="highlightRange ? dateRange.dates : events"
                       :event-color="highlightRange ? dateRange.colors : eventColor"
                       v-model="endDate"
                       :locale="locale"
                       :first-day-of-week="firstDayOfWeek"
                       no-title
                       @change="onDateRangeChange; endDateMenu = false" />
      </v-menu>
    </div>
  </div>
</template>

<script>
// import * as moment from 'moment'
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {};
      }
    },
    noPresets: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    },
    prependIcon: {
      type: String,
      default: ''
    },
    prependInnerIcon: {
      type: String,
      default: ''
    },
    nextIcon: {
      type: String,
      default: 'chevron_right'
    },
    prevIcon: {
      type: String,
      default: 'chevron_left'
    },
    labels: {
      type: Object,
      default() {
        return {
          start: 'Start Date',
          end: 'End Date',
          preset: 'Presets'
        };
      }
    },
    events: {
      type: [Array, Object, Function],
      default: () => null
    },
    eventColor: {
      type: [String, Function, Object],
      default: 'warning'
    },
    highlightRange: {
      type: Boolean,
      default: false
    },
    highlightColors: {
      type: String,
      default: ''
    },
    locale: {
      type: String,
      default: 'zh-cn'
    },
    firstDayOfWeek: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      startDate: this.options.startDate,
      endDate: this.options.endDate || '',
      format: this.options.format || 'YYYY-MM-DD',
      presets: this.options.presets,
      dateRange: {
        dates: [],
        colors: {}
      },
      startDateMenu: false,
      endDateMenu: false
    };
  },
  computed: {
    formattedStartDate() {
      return this.startDate ? moment(this.startDate).format(this.format) : '';
    },
    formattedEndDate() {
      return this.endDate ? moment(this.endDate).format(this.format) : '';
    },
    highlightColorClasses() {
      if (this.highlightColors) {
        return this.highlightColors;
      }
      return this.dark ? 'blue-grey darken-1' : 'blue lighten-5';
    },
    isPresetActive() {
      return this.presets.map(preset => preset.range[0] === this.startDate && preset.range[1] === this.endDate);
    },
    today() {
      return moment().format(this.format);
    },
    maxDate() {
      return this.options.maxDate || '';
    },
    showPresets() {
      return !this.noPresets && this.options.presets && this.options.presets.length > 0;
    }
  },
  watch: {
    startDate() {
      this.onDateRangeChange();
    },
    endDate() {
      this.onDateRangeChange();
    }
  },
  mounted() {
    if (this.highlightRange) this.setInRangeData();
  },
  methods: {
    onPresetSelect(presetIndex) {
      this.startDate = this.presets[presetIndex].range[0];
      this.endDate = this.presets[presetIndex].range[1];
    },
    onDateRangeChange() {
      if (this.highlightRange) this.setInRangeData();
      this.$nextTick(() => {
        let dateRange =
          this.startDate && this.endDate ? [this.startDate, this.endDate] : [this.startDate || this.endDate];
        this.$emit('input', dateRange);
      });
    },
    setInRangeData() {
      const inRangeData = {
        dates: [],
        colors: {}
      };

      if (this.highlightRange) {
        const startDate = moment(this.startDate).toDate();
        const endDate = moment(this.endDate).toDate();
        const diffDays = (endDate - startDate) / (1000 * 3600 * 24);

        for (let i = 0; i <= diffDays; i += 1) {
          const date = this.addDays(startDate, i);
          inRangeData.dates.push(date);
          inRangeData.colors[date] = `date-range__date-in-range ${this.highlightColorClasses}`;

          if (i === 0) {
            inRangeData.colors[date] += ' date-range__range-start';
          }
          if (i === diffDays) {
            inRangeData.colors[date] += ' date-range__range-end';
          }
        }
      }

      this.dateRange = inRangeData;
    },
    addDays(date, days) {
      const result = moment(date).toDate();
      result.setDate(result.getDate() + days);
      return moment(result).format(this.format);
    }
  }
};
</script>

<style lang="scss">
.date-range {
  display: flex;
}

.date-range__presets {
  margin-right: 1rem;
}

.date-range__pickers {
  display: flex;
}

.date-range__picker {
  padding: 0;
}
.date-range >>> .date-picker-table table,
.date-range >>> .v-date-picker-table table {
  border-collapse: collapse;
}
.date-range >>> .date-picker-table__event.date-range__date-in-range,
.date-range >>> .v-date-picker-table__event.date-range__date-in-range {
  z-index: 0;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 0;
}
.date-range >>> .date-picker-table__event.date-range__date-in-range.date-range__range-start,
.date-range >>> .v-date-picker-table__event.date-range__date-in-range.date-range__range-start {
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  left: 7px;
  width: 31px;
}
.date-range >>> .date-picker-table__event.date-range__date-in-range.date-range__range-end,
.date-range >>> .v-date-picker-table__event.date-range__date-in-range.date-range__range-end {
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}
.date-range >>> .date-picker-table .btn,
.date-range >>> .v-date-picker-table .v-btn {
  z-index: 1;
}
</style>
