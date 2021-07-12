<template>
  <v-container v-show="signerList.length > 0"
               fluid
               mt-2
               pr-2
               pl-2>
    <v-layout>
      <v-flex xs12>
        <v-card>
          <v-list two-line
                  class="b-status-list">
            <template v-for="(item, index) in signerList">
              <v-list-tile :key="item.email"
                           avatar
                           ripple>
                <v-list-tile-action>
                  <span class="v-stepper__step__step aqua white-wording ml-2"
                        :class="{'isActive': index === activeIndex && !isWithdrawn }">
                    {{ index + 1 }}
                    <span :class="{'timeline': index < signerList.length -1, 'isActive': index === activeIndex }"
                          :style="`height: ${item.lineHeight+68}px;bottom: ${-60-item.lineHeight}px`"></span>
                  </span>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.companyName || '' }} {{ item.senderName }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.email }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title :style="{color: getProcessStateInfo(item.status, item.type).color}"
                                         v-if="item.status !=99">
                    <v-icon size="20" :color="getProcessStateInfo(item.status, item.type).color">
                      {{ getProcessStateInfo(item.status, item.type).icon }}
                    </v-icon>
                    <span style="vertical-align: top;" v-text="getProcessStateInfo(item.status, item.type).wording" />
                    <span style="color: #999;" v-if="item.status === 2" v-text="'/'" />
                    <v-icon v-if="item.status === 2" size="20" color="#999">
                      {{ getProcessStateInfo(item.status, item.type).icon }}
                    </v-icon>
                    <span style="color: #999; vertical-align: top;" v-if="item.status === 2">
                      {{ getProcessStateInfo(item.status, item.type).awaiting }}
                    </span>
                    <span class="b-list-date">{{ item.signTime | dateformat('YYYY/MM/DD HH:mm') }}</span>
                    <p ref="comment"
                       class="b-comment"
                       v-if="item.comment">{{ '"'+ item.comment + '"' }}</p>
                  </v-list-tile-sub-title>
                  <v-list-tile-sub-title v-if="item.status === 99">
                    <v-icon size="20" color="#999">
                      {{ getProcessStateInfo(2, item.type).icon }}
                    </v-icon>
                    <span style="color: #999; vertical-align: top;">
                      {{ getProcessStateInfo(2, item.type).awaiting }}
                    </span>
                    <span class="b-list-date">{{ item.signTime | dateformat('YYYY/MM/DD HH:mm') }}</span>
                    <p ref="comment"
                       class="b-comment"
                       v-if="item.comment">{{ '"'+ item.comment + '"' }}</p>
                  </v-list-tile-sub-title>

                </v-list-tile-content>

              </v-list-tile>
              <!-- <v-divider inset
                         :key="index"
                         v-if="index !== signerList.length - 1" /> -->
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import STATUS from '../utils/status.js';
import { setTimeout } from 'timers';

export default {
  props: {
    signerList: {
      type: Array,
      default: () => []
    },
    isWithdrawn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeIndex: null,
      isUpdated: false
    };
  },
  computed: {
    getProcessStateInfo() {
      return (state, type = '') => {
        let color = '';
        let wording = '';
        let icon = '';
        let awaiting = '';

        /**
         *    STARTED: 0,
              AWAITING: 2,
              SINGED: 3,
              WITHDRAWED: 1,
              REJECTED: 4,
              NONE: 99
         */
        switch (parseInt(state)) {
          case STATUS.SIGNER_STATUS.AWAITING:
            //等待中 #3296fa
            color = '#ff943e';
            wording = this.$t('common.status_awaiting');
            icon = 'access_time';
            awaiting = type === 'SIGN' ? this.$t('common.status_awaiting_text') : '等待同意';
            break;
          case STATUS.SIGNER_STATUS.WITHDRAWN:
            color = '#f25643';
            wording = this.$t('common.status_withdrawed');
            icon = 'block';
            break;
          case STATUS.SIGNER_STATUS.SINGED:
            color = type === 'SIGN' ? '#15bc83' : '#1976d2';
            wording = type === 'SIGN' ? this.$t('common.status_signed') : '已同意';
            icon = type === 'SIGN' ? 'check_circle_outline' : 'thumb_up_alt';
            break;
          case STATUS.SIGNER_STATUS.REJECTED:
            color = '#f25643';
            wording = this.$t('common.status_rejected');
            icon = 'highlight_off';
            break;
          case STATUS.SIGNER_STATUS.STARTED:
            color = '#3296fa';
            wording = '已發起';
            icon = 'person_pin';
            break;
          case STATUS.SIGNER_STATUS.NONE:
            color = '';
            wording = '';
            icon = '';
            break;
          default:
            color = '#888';
            wording = this.$t('common.unknown_error_without_arg');
            break;
        }

        return { color, wording, icon, awaiting };
      };
    }
  },
  updated() {
    if (!this.isUpdated) {
      setTimeout(() => {
        this.getLingHeight();
        this.getActivateIndex();
        this.isUpdated = true;
      }, 0);
    }
  },
  methods: {
    getLingHeight() {
      let isLatest = false;
      this.signerList.forEach((item, index) => {
        if (item.comment) {
          isLatest = index === this.signerList.length - 1;
          item.lineHeight = !isLatest ? this.$refs.comment[0].clientHeight + 16 : 0;
        }
      });
    },
    getActivateIndex() {
      for (let i = 0; i < this.signerList.length; i++) {
        if (this.signerList[i].status === 2 || this.signerList[i].status === 4) {
          this.activeIndex = i;
          break;
        }
      }
      if (this.activeIndex === null) {
        this.activeIndex = this.signerList.length - 1;
      }
    }
  }
};
</script>

<style lang="scss">
@import '../assets/scss/_variables.scss';
.aqua.white-wording {
  position: absolute;
  top: 28px;
  &.isActive {
    background-color: $aqua !important;
  }
  .timeline {
    border-right: 2px solid #bdbdbd;
    height: 68px;
    position: absolute;
    bottom: -60px;
    z-index: -1;
    left: calc(50% - 1px);
  }
}
.b-list-date {
  float: right;
  color: $dark-28;
  font-size: 12px;
  padding-top: 4px;
}
.b-status-list {
  position: relative;
  z-index: 0;
  margin-bottom: 30px;

  .v-list__tile__content {
    padding: 8px 0;
    min-height: 68px;
  }
  .v-list__tile.v-list__tile--avatar.theme--light {
    height: auto !important;
  }
}

.b-comment {
  white-space: normal;
  text-align: justify;
  text-justify: inter-ideograph;
  color: $dark-56;
  margin: 8px 0;
}
</style>
