<template>
  <v-layout id="docInfo">
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <v-toolbar-title v-text="DOCUMENTS.letterTypeName">我的簽署</v-toolbar-title>
      </v-flex>
      <SignDocTagBookmark :letter-id="letterId"
                          @updateSignDocInfo="getLetterById" />
    </v-toolbar>
    <v-container>
      <v-layout row
                wrap>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <v-alert :value="isExpried || isWithdrawn"
                   class="text-xs-left"
                   :class="{'gray-top': isWithdrawn}"
                   type="warning">
            <span class="subtitle"
                  v-text="isExpried ? $t('sign_document_info.alert.timeout') : $t('sign_document_info.alert.withdraw')"> This is a warning alert.</span>
            <p class="subtitle" v-if="withdrawTime">{{ $t('sign_document_info.alert.time') + '：' }} {{ withdrawTime | dateformat('YYYY/MM/DD HH:mm') }}</p>
            <p class="subtitle"
               v-if="withdrawReason">{{ $t('sign_document_info.alert.reason') + '：' + withdrawReason }}</p>
          </v-alert>
          
          <SignDocTitle :doc-detail="docDetail"
                        :letter-id="letterId"
                        @updateSignDocInfo="getLetterById" />
          <SignDocMessage :message="docDetail.message"
                          :sender="docDetail.senderName" />
          <v-container mt-2 pr-2 pl-2 v-if="DOCUMENTS.letterType == 1 && signerType === 'SIGN'">
            <sign-style-options /> 
          </v-container>
          <SignDocFileList :file-list="docDetail.fileList"
                           @updatePDFPreviewStatus="updatePDFPreviewStatus"
                           :signer-type="signerType"
                           :is-withdrawn="isWithdrawn"
                           :is-expried="isExpried" />
          <SignDocSingerList :signer-list="docDetail.signerList" :is-withdrawn="isWithdrawn"></SignDocSingerList>
          <PDFViewerModal :show="showPDFPreview"
                          :options="options"
                          ref="viewerModal"
                          :signer-type="signerType"
                          @updatePDFPreviewStatus="updatePDFPreviewStatus" />
          <!-- button area -->
          <div class="padding-card"
               v-if="showSignAction">
            <v-layout>
              <v-flex xs6
                      sm6
                      d-flex>
                <v-btn round
                       large
                       @click="openCertCodeDialog('decline')"
                       v-text="$t('sign_document_info.toast.decline.text')"
                       :disabled="isExpried">
                  拒絕
                </v-btn>
              </v-flex>
              <v-flex xs6
                      sm6
                      d-flex>
                <v-btn round
                       large
                       class="b-btn"
                       @click="openCertCodeDialog('sign')"
                       v-text="signerTypeName"
                       :disabled="isExpried">
                  簽署
                </v-btn>
              </v-flex>
            </v-layout>
          </div>
          <div v-if="showWithdawAction">
            <v-layout>
              <v-flex xs12
                      sm12
                      ma-3
                      class="b-btn-area"
                      d-flex>
                <v-btn round
                       large
                       class="b-btn"
                       @click="openCertCodeDialog('withdaw')"
                       :disabled="isExpried"
                       v-text="$t('sign_document_info.toast.withdaw.text')">
                  撤回签署

                </v-btn>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
     
      </v-layout>

    </v-container>
  
  </v-layout>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { actions, mutations, getters } from './../../store/type';

import PDFViewerModal from '../../components/PDFViewerModal';
const SignDocTagBookmark = () => import('../../components/SignDocTagBookmark');
const SignDocTitle = () => import('../../components/SignDocTitle');
const SignDocMessage = () => import('../../components/SignDocMessage');
const SignDocFileList = () => import('../../components/SignDocFileList');
const SignDocSingerList = () => import('../../components/SignDocSingerList');
const SignStyleOptions = () => import('../../components/SignStyleOptions');

import DingClient from './../../plugins/DingTalk.js';

import STATUS from '../../utils/status.js';
const SOURCE_STATUS = STATUS.SOURCE_STATUS;

const components = {
  PDFViewerModal,
  SignDocTagBookmark,
  SignDocTitle,
  SignDocMessage,
  SignDocFileList,
  SignDocSingerList,
  SignStyleOptions
};

export default {
  name: 'SignDocuments',
  components,
  data() {
    return {
      showWithdawAction: false,
      showSignAction: false,
      isShowCertCodeDialog: false,
      letterId: '',
      isExpried: false,
      isWithdrawn: false,
      withdrawReason: '',
      withdrawTime: '',
      showPDFPreview: false,
      signerType: 'SIGN',
      signerCompany: {},
      docDetail: {
        id: 0,
        title: '',
        status: 1,
        message: '',
        createTime: 0,
        expiredTime: 0,
        company: {},
        signerList: [],
        fileList: []
      },
      signatures: []
    };
  },
  computed: {
    ...mapGetters({
      DOCUMENTS: getters.DOCUMENTS,
      USER_DATA: getters.USER_DATA,
      SIGNATURE_INFO: getters.SIGNATURE_INFO
    }),
    signerTypeName() {
      return this.signerType === 'SIGN'
        ? this.$t('sign_document_info.toast.sign.text')
        : this.$t('sign_document_info.toast.approval.text');
    }
  },
  async created() {
    this.letterId = this.$route.params.letterId;
    this.displayInfoTitle(this.DOCUMENTS.letterType);
    await this.getLetterById(this.letterId);
  },
  methods: {
    ...mapActions({
      GET_LETTER_DETAIL: actions.GET_LETTER_DETAIL,
      POST_LETTER_DECLINE: actions.POST_LETTER_DECLINE,
      POST_LETTER_SIGN: actions.POST_LETTER_SIGN,
      POST_LETTER_WITHDRAW: actions.POST_LETTER_WITHDRAW,
      errHandler: 'errHandler'
    }),
    ...mapMutations({
      UPDATE_LOAD_STATUS: mutations.UPDATE_LOAD_STATUS,
      UPDATE_SINATURE_INFO: mutations.UPDATE_SINATURE_INFO,
      SET_SIGNATURE_STATUS: mutations.SET_SIGNATURE_STATUS
    }),

    displayInfoTitle(state) {
      switch (parseInt(state)) {
        case SOURCE_STATUS.AWAITING_SIGNATURE:
          this.showSignAction = true;
          this.showWithdawAction = false;

          break;
        case SOURCE_STATUS.MY_STARTED_SIGNATURE:
          this.showSignAction = false;
          this.showWithdawAction = true;
          break;
        default:
          this.showSignAction = false;
          this.showWithdawAction = false;
          break;
      }
      //only signer
      this.UPDATE_SINATURE_INFO({ couldBeRendered: this.showSignAction });
    },

    async getLetterById(letterId) {
      let result = await this.GET_LETTER_DETAIL({ letterId });

      this.docDetail = result;
      const currSigner = this.docDetail.signerList.filter(item => item.email === this.USER_DATA.email)[0];
      this.signerType = currSigner ? currSigner.type : 'SIGN';
      this.signerCompanyId = currSigner ? currSigner.corpId : 0;
      this.SET_SIGNATURE_STATUS({ companyName: currSigner ? currSigner.companyName : '' });
      this.docDetail.fileList = this.docDetail.fileList.map(f => {
        f.fileName = decodeURIComponent(f.fileName.substr(0, f.fileName.lastIndexOf('.')));
        return f;
      });
      this.isWithdrawn = this.docDetail.status === 1 ? true : false;

      this.withdrawReason = this.docDetail.comment;
      this.withdrawTime = this.docDetail.withdrawTime;
      if (
        this.docDetail.status === STATUS.LETTER_STATUS.COMPLETED ||
        this.docDetail.status === STATUS.LETTER_STATUS.WITHDRAWN ||
        this.docDetail.status === STATUS.LETTER_STATUS.REJECTED
      ) {
        this.showWithdawAction = false;
        this.showSignAction = false;
      }
      if (!this.docDetail.expiredTime || this.docDetail.expiredTime === '1970-01-01T15:59:59.000Z') {
        this.isExpried = false;
      } else {
        let expiredTime = new Date(this.docDetail.expiredTime);
        let nowDate = new Date();

        if (nowDate.valueOf() > expiredTime.valueOf() && this.docDetail.status === STATUS.LETTER_STATUS.SIGNING) {
          this.isExpried = true;
        }
      }

      let nextStateIsNone = false;
      let hasAwatting = false;
      for (let i = 0; i < this.docDetail.signerList.length; i++) {
        let item = this.docDetail.signerList[i];
        if (!!nextStateIsNone) {
          item.status = STATUS.SIGNER_STATUS.NONE;
        }
        if (
          item.status === STATUS.SIGNER_STATUS.AWAITING ||
          item.status === STATUS.SIGNER_STATUS.REJECTED ||
          item.status === STATUS.SIGNER_STATUS.WITHDRAWN
        ) {
          nextStateIsNone = true;
        }
      }
    },

    openCertCodeDialog(action) {
      let dialogSetting = {
        componentName: 'RejectSigning'
      };

      switch (action) {
        case 'withdaw':
          dialogSetting.extra = {
            companyId: this.signerCompanyId
          };
          dialogSetting.onConfirm = async res => await this.withdaw(res);
          break;

        case 'sign':
          dialogSetting.componentName = 'ConfirmPrivateKey';
          dialogSetting.extra = {
            companyId: this.signerCompanyId,
            tips: this.$t('signDocumentInfo.sign_tips', [this.USER_DATA.name, `"${this.docDetail.title}"`])
          };
          dialogSetting.onConfirm = async res => await this.sign(res);
          break;

        default:
          dialogSetting.extra = {
            companyId: this.signerCompanyId
          };
          dialogSetting.onConfirm = async res => await this.decline(res);
          break;
      }

      this.modal.show(dialogSetting);
    },

    goBack() {
      this.$router.push({ path: '/Index' });
    },
    getDefaultColor() {
      return '#EA0606';
    },
    updatePDFPreviewStatus(type, options = null) {
      let hasData = false;
      if (!!type) {
        console.log(options);
        let tempSignature = null;
        for (let i = 0, l = this.docDetail.fileList.length; i < l; i++) {
          if (this.docDetail.fileList[i].fileName === options.fileName && this.docDetail.fileList[i].signature) {
            // this.UPDATE_SINATURE_INFO(this.docDetail.fileList[i].signature);
            tempSignature = this.docDetail.fileList[i].signature;
          }
        }
        this.showPDFPreview = true;
        if (tempSignature) {
          //exsiting signature will getting data from state.
          this.UPDATE_SINATURE_INFO(tempSignature);
          this.$refs.viewerModal.initPanel(tempSignature.zoom, tempSignature.color);
        } else {
          //new signature will init data
          this.$refs.viewerModal.initPanel(1, this.getDefaultColor());
        }
      } else {
        this.showPDFPreview = false;
        //close event
        let signature = { ...this.SIGNATURE_INFO };

        if (signature.content) {
          const signaturePayload = {
            fileUrl: signature.url,
            page: signature.page,
            pageOffsetX: signature.pageOffsetX,
            pageOffsetY: signature.pageOffsetY,
            color: signature.color,
            content: signature.content
          };
          for (let i = 0, l = this.docDetail.fileList.length; i < l; i++) {
            if (this.docDetail.fileList[i].fileName === this.options.fileName) {
              this.docDetail.fileList[i].signature = signature;
            }
          }
          for (let i = 0, l = this.signatures.length; i < l; i++) {
            if (this.signatures[i].fileUrl === signaturePayload.fileUrl) {
              this.signatures[i] = signaturePayload;
              hasData = true;
            }
          }
          if (!hasData) {
            this.signatures.push(signaturePayload);
          }

          this.UPDATE_SINATURE_INFO({
            id: 0,
            title: '',
            color: this.getDefaultColor(),
            pageOffsetX: 0,
            pageOffsetY: 0,
            width: 0,
            height: 0,
            page: 0,
            zoom: 1,
            content: '',
            renderPageIndex: null
          });
        }
      }
      this.options = options;
    },

    async sign({ pwd, role, comment }) {
      this.UPDATE_LOAD_STATUS(true);

      await this.POST_LETTER_SIGN({
        pwd,
        letterId: this.letterId,
        corpId: role,
        comment,
        signatures: this.signatures
      });
      this.toast.show({
        icon: 'check',
        content: this.$t('sign_document_info.toast.sign.text_success'),
        onHide: () => {
          this.goBack();
        }
      });
    },

    async decline({ pwd, role, comment }) {
      this.UPDATE_LOAD_STATUS(true);
      let result = null;
      result = await this.POST_LETTER_DECLINE({
        pwd,
        letterId: this.letterId,
        corpId: role,
        comment
      });
      this.toast.show({
        icon: 'check',
        content: this.$t('sign_document_info.toast.decline.text_success'),
        onHide: () => {
          this.goBack();
        }
      });
    },
    async withdaw({ pwd, role, comment }) {
      this.UPDATE_LOAD_STATUS(true);
      let result;
      try {
        result = await this.POST_LETTER_WITHDRAW({
          pwd,
          letterId: this.letterId,
          corpId: role,
          comment
        });
        this.toast.show({
          icon: 'check',
          content: this.$t('sign_document_info.toast.withdaw.text_success'),
          onHide: () => {
            this.goBack();
          }
        });
      } catch (error) {
        this.isShowCertCodeDialog = false;
      }
    }
  }
};
</script>

<style lang="scss">
@import './../../assets/scss/_variables.scss';
#docInfo {
  .gray-top {
    background-color: #c3bebe !important;
    p {
      margin: 0;
    }
  }
  .head-info {
    background-color: #fff;
  }
  .v-chip {
    font-size: 10px !important;
    margin: 0px;
    & .v-chip__close > .v-icon {
      font-size: 14px !important;
    }
  }
  .v-chip__content {
    padding: 4px;
  }
  .v-list__tile__action,
  .v-list__tile__avatar {
    min-width: 54px;
    width: 54px;
  }

  .tile-margin {
    margin: 8px;
  }
  .white-wording {
    color: #fff;
  }
  .aqua {
    color: #fff;
    background-color: #bdbdbd;
  }
  .b-content {
    background-color: #fff;
    .b-doc-list .v-list__tile {
      height: 60px;
    }
    .b-status-list .v-list__tile {
      height: 86px;
    }
  }
  .b-content-margin-bottom {
    margin-bottom: 10px;
  }
  .container {
    padding: 0;
  }
  .padding-card {
    background-color: #f0f0f0;
    padding: 16px 8px;
  }
  .v-list {
    padding: 0;
    .v-list__tile__title {
      font-size: 17px;
      color: $dark;
      letter-spacing: -0.4px;
    }
  }

  .v-text-field.v-text-field--enclosed > .v-input__control > .v-input__slot {
    padding: 0;
  }
}
.company-name-modal {
  height: 40px;
  display: block;
  line-height: 40px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  text-align: left;
  padding-left: 10px;
  font-size: 16px;
}
</style>
