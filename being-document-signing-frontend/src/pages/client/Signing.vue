<template>
  <v-flex id="signing"
          xs12
          sm8
          md6
          offset-sm2
          offset-md3>
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <v-btn class="b-toolbar-icon left"
               icon
               :ripple="false"
               @click="cancel">
          <v-icon class="b-text">arrow_back_ios</v-icon>
          <span class="b-text"
                v-text="$t('common.back')" />
        </v-btn>
      </v-flex>
      <v-flex xs8>
        <v-toolbar-title v-text="$t('signing.toolbar_title.text')" />
      </v-flex>
      <v-flex xs2>
        <v-btn flat
               icon class="b-text" v-if="hasDrafts" @click="getDrafts">
          <v-icon>drafts</v-icon>
        </v-btn>
      </v-flex>
    </v-toolbar>
    <v-container pa-2>
      <v-layout row
                wrap>
        <!-- 簽署身份 -->
        <v-flex xs12
                v-if="companyName">
          <v-card>
            <v-card-text>
              <v-flex xs12>
                <v-container pa-0
                             ml-0>
                  <v-layout align-center
                            justify-space-between
                            row
                            fill-height>
                    <div>
                      <p class="text-align-l mt-0 mb-2 mr-0 ml-0 grey--text"
                         v-text="$t('common.company_role')" />
                      <h3 class="text-align-l mt-0 mb-0 mr-0 ml-0"
                          v-text="companyName" />
                    </div>
                    <v-btn depressed
                           flat
                           small
                           left
                           fab
                           color="#10acce"
                           @click="openSelectCompanyRoleModal"
                           v-text="$t('common.change')" />
                  </v-layout>
                  <v-layout align-center justify-space-between row fill-height>
                    <v-flex xs12
                            sm12
                            id="sign-select">
                      <v-select item-text="name"
                                item-value="key"
                                class="b-input text-align-l select-agree"
                                solo
                                :flat="true"
                                :items="creatorSignList"
                                :change="changeCreatorSign(createLetter.creatorSign)"
                                v-model="createLetter.creatorSign"
                                color="#333" />
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-flex>
            </v-card-text>
          </v-card>
        </v-flex>
        <!--簽署簽名樣式-->
        <v-flex xs12
                mt-2
                v-if="createLetter.creatorSign === 1">
          <sign-style-options ref="signStyleOptions"/> 
        </v-flex>
        <v-flex xs12
                mt-2>
          <!-- 新增簽署文件 -->
          <sign-upload @updateFileList="updateFileList"
                       :update-file-list.sync="createLetter.fileList" :creatorsignkey="createLetter.creatorSign"/>
        </v-flex>
        <v-flex xs12
                mt-2>
          <!-- 新增簽署人 -->
          <sign-add-signatories @updateSignerList="updateSignAtories"
                                :signer-list.sync="createLetter.signerList" />
        </v-flex>
        <v-flex xs12
                mt-2>
          <!-- 新增閱覽人 -->
          <sign-read-person @updateReaderList="updateReaderList"
                            :reader-list.sync="createLetter.viewerList" />
        </v-flex>
        <v-flex xs12
                mt-2
                id="adv-setting">
          <!-- 進階設定 -->
          <v-card>
            <v-card-text pa-0>
              <v-expansion-panel>
                <v-expansion-panel-content>
                  <div slot="header"
                       v-text="$t('signing.adv_setting.text')" />
                  <v-container px-3
                               py-1>
                    <v-layout row
                              wrap>
                      <v-flex xs12>
                        <div>
                          <v-flex xs12>
                            <p v-once
                               class="b-label">{{ $t('common.topic') }}({{ $t('common.optional') }})</p>
                          </v-flex>
                          <v-list>
                            <v-text-field class="b-input"
                                          v-model.trim="createLetter.title"
                                          single-line
                                          outline
                                          required
                                          maxlength="80" />
                          </v-list>
                          <v-flex xs12>
                            <p class="b-label">
                              {{ $t('common.message') }}({{ $t('common.optional') }})
                              <span class="char-number" :style="{color: titleLength === 80 ? 'red' : ''}">{{ titleLength }}/80</span>
                            </p>
                          </v-flex>
                          <v-textarea solo
                                      maxlength="300"
                                      name="input-7-4"
                                      :flat="true"
                                      :label="$t('signing.message_to_other.text')"
                                      v-model="createLetter.message" />
                          <v-flex xs12
                                  mt-2>
                            <p class="b-label">
                              {{ $t('signing.sign_expired_date') }}
                              <span class="char-number" :style="{color: messageLength === 300 ? 'red' : ''}">{{ messageLength }}/300</span>
                            </p>
                          </v-flex>
                          <v-flex xs12>
                            <sign-date @updataDueDate="updataDueDate" :dute-date.sync="createLetter.duteDate" />
                          </v-flex>
                          <v-flex xs12
                                  mt-2>
                            <signTagOptions @updataTags="updataTags" :tag-list.sync="createLetter.tagNames" />
                          </v-flex>
                          <!-- <v-flex xs12>
                            <sponsor @updataSponsorStatus="updataSponsorStatus" :creator-sign.sync="createLetter.creatorSign" />
                          </v-flex> -->
                          <!-- <v-flex xs12
                                  mt-2>
                            <p class="b-label">
                              {{ $t('signing.signature_style.text') }}
                            </p>
                          </v-flex> -->
                          <v-flex xs12>
                            <SwitchSignStatus @updateNoticesSignStatus="updateNoticesSignStatus" :email-switch.sync="createLetter.emailSwitch" />
                          </v-flex>
                          <v-flex xs12>
                            <SwitchSignStatus @updateNoticesSignStatus="updateNoticesMessageStatus" type="message" :email-switch.sync="createLetter.smsNotify" />
                          </v-flex>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-card-text>
          </v-card>

          <v-flex class="b-footer mt-2"
                  xs12
                  sm12
                  d-flex>
            <v-btn round
                   depressed
                   :ripple="false"
                   @click="cancel"
                   large
                   class="b-btn white"
                   v-text="$t('common.cancel')" />
            <v-btn round
                   :ripple="false"
                   @click="submit"
                   class="b-btn"
                   large
                   :disabled="disableSubmit"
                   v-text="$t('common.submit')" />
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>
<script>
const SignUpload = () => import('./../../components/SignUpload.vue');
const SignAddSignatories = () => import('./../../components/SignAddSignatories.vue');
const SignReadPerson = () => import('./../../components/SignReadPerson.vue');
const SignDate = () => import('./../../components/SignDate.vue');
const Sponsor = () => import('./../../components/Sponsor.vue');
const SignTagOptions = () => import('./../../components/SignTagOptions.vue');
const SignStyleOptions = () => import('./../../components/SignStyleOptions.vue');
const SwitchSignStatus = () => import('../../components/SwitchSignStatus.vue');

import status from './../../utils/status.js';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { actions, mutations, getters } from './../../store/type';
import isEqual from 'lodash/isEqual';

export default {
  components: {
    SignUpload,
    SignAddSignatories,
    SignReadPerson,
    SignDate,
    Sponsor,
    SignTagOptions,
    SignStyleOptions,
    SwitchSignStatus
  },
  data() {
    return {
      isLoading: false,
      companyId: 0,
      hasDrafts: false,
      creatorSignList: [
        {
          key: 0,
          name: this.$t('signing.sponsor_sign.only')
        },
        {
          key: 1,
          name: this.$t('signing.sponsor_sign')
        },
        {
          key: 3,
          name: this.$t('signing.sponsor_sign.agree')
        }
      ],
      createLetter: {
        title: '',
        message: '',
        fileList: [],
        signerList: [],
        duteDate: '',
        creatorSign: 0,
        viewerList: [],
        tagNames: [],
        emailSwitch: false,
        smsNotify: false,
        selectedSignature: null
      },
      draftsData: {},
      unsubscribe: null,
      signatureInfo: {}
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA,
      TAG_LIST: getters.TAG_LIST,
      CONTACT: getters.CONTACT
    }),
    messageLength() {
      return this.createLetter.message.length || 0;
    },
    titleLength() {
      return this.createLetter.title.length || 0;
    },
    companyName() {
      const getCompanyName = id => {
        let companyName;
        const { companyList } = this.USER_DATA;
        for (let i = 0, c; (c = companyList[i]); i++) {
          if (c.id === id) {
            companyName = c.name;
            this.SET_SIGNATURE_STATUS({ companyName });

            break;
          }
        }
        return companyName || this.$t('common.person');
      };
      const removeCompanyName = () => {
        this.SET_SIGNATURE_STATUS({ companyName: '' });
        return this.$t('common.person');
      };
      return this.companyId === 0 ? removeCompanyName() : getCompanyName(this.companyId);
    },
    disableSubmit() {
      const fileList = this.createLetter.fileList;
      const hasFailFile = fileList.some(({ status }) => status === 'fail');
      return fileList.length <= 0 || hasFailFile || this.createLetter.signerList.length <= 0 || this.isLoading;
    }
  },
  created() {
    this.openSelectCompanyRoleModal();
    this.GET_LETTER_DRAFT().then(res => {
      if (JSON.stringify(res) !== '{}') {
        res.emailSwitch = res.emailSwitch !== 0;
        res.smsNotify = res.smsNotify !== 0;
        res.corpId = res.corpId === 0 ? 0 : res.corpId;
        res.duteDate = res.duteDate ? res.duteDate : new Date(0).toISOString();
        if (!isEqual(this.defaultCreateLetterData(), res)) {
          this.hasDrafts = true;
          this.draftsData = res;
        }
      }
    });
  },

  methods: {
    ...mapActions({
      POST_LETTER_CREATE: actions.POST_LETTER_CREATE,
      GET_LETTER_DRAFT: actions.GET_LETTER_DRAFT,
      POST_LETTER_CREATE_DRAFT: actions.POST_LETTER_CREATE_DRAFT
    }),
    ...mapMutations({
      UPDATE_LOAD_STATUS: mutations.UPDATE_LOAD_STATUS,
      SET_SIGNATURE_STATUS: mutations.SET_SIGNATURE_STATUS,
      UPDATE_SINATURE_INFO: mutations.UPDATE_SINATURE_INFO
    }),
    defaultCreateLetterData() {
      return {
        corpId: 0,
        creatorSign: 0,
        duteDate: new Date(0).toISOString(),
        emailSwitch: false,
        smsNotify: 0,
        fileList: [],
        message: '',
        signerList: [],
        tagNames: [],
        title: this.titleHandle(),
        viewerList: []
      };
    },
    updateFileList(param) {
      if (param.type === 'add') {
        this.createLetter.fileList.push(param.data);
      } else {
        this.createLetter.fileList = this.createLetter.fileList.filter(f => f.fileName !== param.data.fileName);
      }
    },
    updateSignAtories(memberList) {
      this.createLetter.signerList = [...memberList];
    },
    updataDueDate(duteDate) {
      this.createLetter.duteDate = duteDate;
    },
    updataSponsorStatus(status) {
      this.createLetter.creatorSign = status;
    },
    updateReaderList(memberList) {
      this.createLetter.viewerList = memberList;
    },
    updataTags(tags) {
      this.createLetter.tagNames = tags;
    },

    openSelectCompanyRoleModal() {
      this.modal.show({
        componentName: 'SelectCompanyRoleModal',
        onConfirm: companyId => {
          this.companyId = companyId;
          companyId && this.getCompanySignature();
        }
      });
    },
    getCompanySignature() {
      this.$store
        .dispatch('GET_COMPANY_SIGNATURE', {
          companyId: this.companyId
        })
        .then(({ data }) => {
          const imgBase64 = data.data.signature;
          this.$store.commit('SET_COMPANY_STAMP', imgBase64);
        });
    },
    updateNoticesSignStatus(emailSwitch) {
      this.createLetter.emailSwitch = emailSwitch;
    },
    updateNoticesMessageStatus(smsNotify) {
      this.createLetter.smsNotify = smsNotify ? 1 : 0;
    },
    createDraftOrCreateLetter(param) {
      let {
        fileList,
        signerList,
        viewerList,
        title,
        message,
        duteDate,
        creatorSign,
        tagNames,
        emailSwitch,
        smsNotify
      } = param;
      let corpId = this.USER_DATA.companyList.length > 0 ? this.companyId : 0;
      if (corpId !== 0) {
        this.getCompanySignature();
      }
      fileList =
        fileList.length > 0
          ? fileList
              .filter(({ status }) => status === 'finish')
              .map(({ fileHash, fileType, fileUrl, fileSize, fileName, readerResult, signature }) => {
                let obj = {
                  fileHash,
                  fileType,
                  fileUrl,
                  fileSize,
                  fileName
                };
                if (signature) {
                  delete signature['fontStyleName'];
                  delete signature['renderPageIndex'];
                  // delete signature['zoom'];
                  if (signature.content) {
                    obj.signature = signature;
                  }
                }
                return obj;
              })
          : [];
      signerList =
        signerList.length > 0
          ? signerList.map(({ name, email, type, typeName, corpId, companyName }) => {
              return {
                name,
                email,
                type,
                corpId,
                typeName,
                companyName
              };
            })
          : [];

      viewerList =
        viewerList.length > 0
          ? viewerList.map(({ name, email }) => {
              return { name, email };
            })
          : [];

      tagNames = tagNames.length > 0 ? tagNames.map(({ name }) => name) : [];
      title = this.titleHandle();
      moment().utcOffset();
      if (duteDate && duteDate !== new Date(0).toISOString()) {
        duteDate = moment(this.createLetter.duteDate)
          .set({ hour: 23, minute: 59, second: 59 })
          .utcOffset(0)
          .toISOString();
      } else {
        duteDate = new Date(0).toISOString();
      }
      return {
        corpId,
        emailSwitch,
        smsNotify: smsNotify ? 1 : 0,
        fileList,
        signerList,
        tagNames,
        message,
        duteDate,
        creatorSign,
        title,
        viewerList
      };
    },
    fetchLetterDraft(param, cb) {
      this.POST_LETTER_CREATE_DRAFT(param).then(cb && cb);
    },
    submit() {
      const { remain, companyList, email } = this.USER_DATA;

      const isSigner = this.createLetter.signerList.find(item => item.email === email);
      if (isSigner && (this.createLetter.creatorSign === 1 || this.createLetter.creatorSign === 3)) {
        this.toast.show({
          icon: 'info',
          content: this.$t('submit.upload.toast')
        });
        return;
      }
      if (this.companyId === 0 && remain <= 0) {
        this.alert.show({
          content: this.$t('purchase.count.shortage.text'),
          position: 'middle'
        });
        return;
      } else if (companyList.length > 0 && this.companyId !== 0) {
        const signingRemain = companyList.find(({ id }) => id === this.companyId).signing_remain;
        if (signingRemain <= 0) {
          this.alert.show({
            content: this.$t('common.signing_remain'),
            position: 'middle'
          });
          return;
        }
      }

      this.isLoading = true;
      this.modal.show({
        componentName: 'ConfirmCerPassword',
        extra: {
          tips: this.$t('signing.tips_message', [this.USER_DATA.name, `"${this.titleHandle()}"`])
        },
        onConfirm: async pwd => {
          try {
            const param = { ...this.createDraftOrCreateLetter(this.createLetter), ...{ pwd } };
            // 删除两个用来显示的参数，不需要传给后端
            param.signerList = param.signerList.map(item => {
              delete item.typeName;
              delete item.companyName;
              item.type = item.type ? item.type : 'SIGN';
              item.corpId = item.corpId ? item.corpId : 0;
              return item;
            });
            // console.log('param', param);
            await this.POST_LETTER_CREATE(param);
            this.alert.show({
              content: this.$t('signing.submit_status_fail.success.text'),
              position: 'middle'
            });
            this.$router.push({ path: '/Index' });
          } finally {
            this.isLoading = false;
          }
        },
        onCancel: () => {
          this.isLoading = false;
        }
      });
    },
    cancel() {
      if (!isEqual(this.defaultCreateLetterData(), this.createDraftOrCreateLetter(this.createLetter))) {
        this.fetchLetterDraft(this.createDraftOrCreateLetter(this.createLetter), () => {
          this.alert.show({ content: this.$t('signing.drafts_saved'), position: 'middle' });
          setTimeout(() => {
            this.$router.go(-1);
          }, 3000);
        });
      } else {
        this.$router.go(-1);
      }
    },
    titleHandle() {
      if (!this.createLetter.title.trim()) {
        return this.USER_DATA.name + this.$t('signing.create_document.title');
      }
      return this.createLetter.title;
    },
    getDrafts() {
      this.modal.show({
        title: this.$t('signing.drafts_modal_title'),
        content: this.$t('signing.drafts_modal_content'),
        showIcon: false,
        onConfirm: () => {
          const updateArray = (param, cb) => {
            if (param.length <= 0) return [];
            for (let i = 0, len = param.length; i < len; i++) {
              param[i] = cb && cb(param[i]);
            }
            return param;
          };
          const combMember = param => {
            const { name, email, type, typeName, corpId, companyName } = param;
            if (this.CONTACT.length > 0 && this.CONTACT.some(c => c.name === name && c.email === email)) {
              param = this.CONTACT.find(c => c.name && c.email === email);
            }
            param.active = true;
            param.type = type;
            param.typeName = typeName;
            param.corpId = corpId;
            param.companyName = companyName;
            return param;
          };
          this.hasDrafts = false;
          this.draftsData.title =
            this.draftsData.title === `${this.USER_DATA.name}${this.$t('signing.create_document.title')}`
              ? ''
              : this.draftsData.title;
          this.draftsData.signerList = updateArray(this.draftsData.signerList, combMember);
          this.draftsData.viewerList = updateArray(this.draftsData.viewerList, combMember);
          this.draftsData.tagNames = updateArray(this.draftsData.tagNames, param => {
            if (this.TAG_LIST.length > 0 && this.TAG_LIST.some(t => t.name === param)) {
              return this.TAG_LIST.find(t => t.name === param);
            } else {
              return [];
            }
          });
          this.companyId = this.USER_DATA.companyList.length > 0 ? this.draftsData.corpId : 0;
          this.createLetter = { ...this.createLetter, ...this.draftsData };
          this.fetchLetterDraft(this.defaultCreateLetterData());
        }
      });
    },
    changeCreatorSign(val) {
      this.UPDATE_SINATURE_INFO({ couldBeRendered: val === this.creatorSignList[1].key ? true : false });
    }
  }
};
</script>
<style lang="scss">
@import './../../assets/scss/_variables.scss';
#signing {
  .v-list {
    border-bottom: 1px solid #eee;
    .v-list__tile__content {
      color: #909399;
      font-size: 17px;
    }
  }
  &.v-messages theme--light {
    display: none;
  }
  .v-text-field__details {
    display: none;
  }
  .b-input .v-input__slot {
    border: none !important;
  }
  .char-number {
    float: right;
    margin-top: -8px;
  }
  .red-leeter {
    color: red;
  }
  .select-agree {
    margin-top: 10px;
    .v-input__control {
      min-height: 40px;
    }
    .v-input__slot {
      padding: 0px;
    }
  }
}
#sign_upload,
#sign-add-signatories,
#sign-read-person {
  .init-btn {
    .flex {
      align-self: center;
    }
    p {
      text-align: left;
      margin: 0;
      font-size: 17px;
    }
    .init-icon {
      text-align: right;
      cursor: pointer;
      i {
        color: $aqua;
      }
    }
  }
  .b-btn.white {
    border: 1px solid;
    border-color: $aqua !important;
    border-radius: 22px;
  }
}

#adv-setting {
  .v-card__text {
    padding: 6px 0;
  }
  .v-expansion-panel {
    box-shadow: none;
  }
  .v-expansion-panel__header {
    padding: 8px 16px;
    font-size: 17px;
    color: #606266;
  }
  .v-list {
    border: 0;
  }
  .v-textarea,
  .b-input {
    border: 1px solid #dcdfe6 !important;
    border-radius: 8px;
    .v-input__slot {
      margin: 0;
    }
  }
}
</style>
