<template>
  <div id="reportmessage">
    <div id="sendMessage" v-show="!showMessageModal" @click.prevent="toggleView"><v-icon>email</v-icon><span class="text">{{ $t('report.message_btn') }}</span></div>
    <div id="sendMessageForm" v-show="showMessageModal">
      <v-layout row
                wrap>
        <v-flex>
          <v-card>
            <v-card-title>
              <v-layout
                align-center
                justify-space-between
              >
                <span v-text="$t('report.message_form_title')"></span>
                <v-icon @click="toggleView">remove</v-icon>
              </v-layout>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <v-flex xs12>
                  <p class="b-label" v-text="$t('report.message_form_user_name')"></p>
                </v-flex>
                <v-text-field class="b-input"
                              validate-on-blur
                              v-model.trim="sendMessage.username"
                              :rules="rules.name"
                              single-line
                              outline
                              required />
                <v-flex xs12>
                  <p class="b-label" v-text="$t('report.message_form_user_email')"></p>
                </v-flex>
                <v-text-field class="b-input"
                              validate-on-blur
                              v-model.trim="sendMessage.email"
                              v-disable-paste
                              :rules="rules.email"
                              single-line
                              outline
                              required />
                <v-flex xs12>
                  <p class="b-label">
                    {{ $t('common.message') }}
                  </p>
                </v-flex>
                <v-textarea solo
                            maxlength="300"
                            name="input-7-4"
                            :flat="true"
                            :rules="rules.message"
                            v-model="sendMessage.message" />
                <v-flex xs12
                        sm12
                        mt-3
                        d-flex v-if="isFinish && reportTips">
                  <div v-html="reportTips"></div>
                </v-flex>
                <v-flex xs12
                        sm12
                        mt-3
                        d-flex>
                  <v-btn @click="submit" class="b-btn">{{ $t('report.message_form_submit_button') }}</v-btn>
                </v-flex>

              </v-form>

            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
          
    </div>
  </div>
</template>

<script>
import rulesMixin from '../mixins/Rules';
export default {
  mixins: [rulesMixin],

  data() {
    return {
      valid: false,
      sendMessage: {
        username: '',
        email: '',
        message: ''
      },
      showMessageModal: false,
      reportTips: '',
      isFinish: false
    };
  },

  methods: {
    toggleView() {
      this.showMessageModal = !this.showMessageModal;
      if (!!this.showMessageModal) {
        this.isFinish = false;
      }
      this.sendMessage = {
        username: '',
        email: '',
        message: ''
      };
    },

    submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.$http
        .post('/message/add', this.sendMessage)
        .then(res => {
          this.reportTips = this.$t('report.message_form_success');
        })
        .catch(error => {
          this.reportTips = this.$t('report.message_form_fail');
        })
        .finally(() => {
          this.isFinish = true;
          this.sendMessage = {
            username: '',
            email: '',
            message: ''
          };
        });
    }
  }
};
</script>


<style lang="scss">
@import '../assets/scss/_variables.scss';
#reportmessage {
  #sendMessage {
    position: fixed;
    bottom: 0;
    left: 10px;
    width: 110px;
    text-align: left;
    background-color: $aqua;
    padding: 5px 0 5px 10px;
    border-radius: 10px 10px 0 0;
    height: 30px;
    cursor: pointer;

    i {
      font-size: 16px;
      display: inline-block;
      vertical-align: middle;
      color: #fff5ee;
    }
    .text {
      font-size: 12px;
      display: inline-block;
      vertical-align: middle;
      color: #fff5ee;
    }
    .text {
      margin-left: 10px;
    }

    @media screen and (max-width: 540px) {
      width: 46px;
      text-align: center;
      padding: 0px;
      height: 30px;
      line-height: 30px;
      i {
        font-size: 26px;
        text-align: center;
        display: inline-block;
        vertical-align: middle;
      }
      .text {
        display: none;
      }
    }
  }
  #sendMessageForm {
    width: 100%;
    max-width: 300px;
    position: fixed;
    bottom: 0px;
    left: 10px;
    z-index: 100;
    .v-card {
      border-radius: 8px 8px 0 0 !important;
    }
    .v-card__title {
      background-color: $aqua;
      color: $white-bgc;
      font-size: 13px !important;
      font-weight: bold;
      padding: 10px;
      i {
        color: $white-bgc;
        cursor: pointer;
      }
    }
    textarea {
      margin: 0;
    }
  }
  .v-textarea {
    border: 1px solid #dcdfe6 !important;
    border-radius: 8px;
    .v-input__slot {
      margin: 0;
    }
  }
}
</style>
