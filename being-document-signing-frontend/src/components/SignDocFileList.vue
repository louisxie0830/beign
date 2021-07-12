<template>
  <v-container id="fileList"
               v-if="fileList.length > 0"
               mt-2
               pr-2
               pl-2>
    <v-card>
      <v-list two-line>
        <template v-for="(item, index) in fileList">
          <v-divider :key="index"
                     v-if="index > 0"></v-divider>
          <v-list-tile :key="item.name"
                       avatar
                       ripple>
            <v-list-tile-avatar>
              <v-icon color="#ccc"
                      size="30">insert_drive_file</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.fileName }}
                <v-tooltip v-show="isShowFileTips && signerType === 'SIGN'" right
                           max-width="360">
                  <span class="image-icon" slot="activator"><img style="height:18px;width:18px;" src="../assets/image/mark.png"/></span>
                  <div class="b-tooltip-content">
                    <p>{{ $t("sign_file_tip.title.text") }}</p>
                    <p>{{ $t("sign_file_tip1.text") }}</p>
                    <p>{{ $t("sign_file_tip2.text") }}</p>
                    <p>{{ $t("sign_file_tip3.text") }}</p>
                    <p>{{ $t("sign_file_tip4.text") }}</p>
                  </div>
                </v-tooltip>
              </v-list-tile-title>
              <div class="file-info mt-1">
                <span class="sub-title"
                      v-text="item.fileType" />
                <span class="link">
                  <a @click="donwloadFile(item)" v-show="!(isWithdrawn || isExpried)">
                    <v-icon>get_app</v-icon><span> {{ $t("common.download") }}</span>
                  </a>
                  <span>
                    <a @click="getPDFPreviewUrl(item)" v-show="!isWithdrawn">
                      <v-icon>search</v-icon><span>{{ $t('common.preview') }}</span>
                    </a>
                  </span>
                </span>
              </div>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import { actions, getters, mutations } from '../store/type.js';
import EncryptionFactory from '../utils/EncryptionFactory';
import { isMobile } from '../utils/tool';
export default {
  props: {
    fileList: {
      type: Array,
      default: () => []
    },
    signerType: {
      type: String,
      default: ''
    },
    isWithdrawn: {
      type: Boolean,
      default: false
    },
    isExpried: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA
    }),
    ...mapState({
      isShowFileTips: state => state.isShowFileTips
    })
  },
  mounted() {
    console.log('isShowFileTips', this.isShowFileTips);
  },
  methods: {
    ...mapActions({
      GET_USER_CER_PASSWORD: actions.GET_USER_CER_PASSWORD
    }),
    ...mapMutations({
      UPDATE_SINATURE_INFO: mutations.UPDATE_SINATURE_INFO
    }),
    async decrypted(password) {
      try {
        const cerPwd = await this.GET_USER_CER_PASSWORD();
        const secretKey = await EncryptionFactory.secretKey(this.USER_DATA.email, password);
        const privateKey = await EncryptionFactory.decrypted(cerPwd, secretKey);

        return true;
      } catch (error) {
        this.toast.show({
          icon: 'info',
          content: this.$t('common_voucher_password_error.text')
        });
        return false;
      }
    },
    showAuthModal(callBack) {
      this.modal.show({
        componentName: 'ConfirmCerPassword',
        onConfirm: async password => {
          if (!!(await this.decrypted(password))) {
            callBack && callBack();
          }
        }
      });
    },
    donwloadFile({ url }) {
      this.showAuthModal(async () => {
        const downloadUrl = `${process.env.BASE_URL}/letter/download?key=${url}&accessToken=${this.USER_DATA.token}`;
        if (dd.ios && dd.env.platform !== 'notInDingTalk') {
          await DingClient.openLink(downloadUrl);
        } else if (isMobile.iOS()) {
          location.href = downloadUrl;
        } else {
          const link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = downloadUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    },
    getPDFPreviewUrl(item) {
      this.UPDATE_SINATURE_INFO({
        url: item.url
      });
      this.showAuthModal(() => {
        const options = {
          fileName: item.fileName,
          url: `${process.env.BASE_URL}/letter/preview?key=${item.url}&accessToken=${this.USER_DATA.token}`,
          fileInfo: item //save oraginal file object
        };
        this.$emit('updatePDFPreviewStatus', true, options);
      });
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';

#fileList {
  .v-list__tile__content {
    margin-top: 8px;
    padding: 8px 0px;
  }
  .v-list__tile__sub-title,
  .v-list__tile__title {
    overflow: visible;
  }
  .v-list {
    box-sizing: border-box;
    min-height: 80px;
    .v-list__tile__title {
      font-size: 14px !important;
      color: $dark;
      letter-spacing: -0.4px;
    }
  }
  .file-info {
    width: 100%;
    .sub-title {
      float: left;
      vertical-align: middle;
      font-size: 13px !important;
      color: $dark--40;
      margin-right: 42px;
    }
    .link {
      font-size: 12px;
      float: right;
      vertical-align: middle;
      a {
        margin-left: 6px;
      }
      i,
      span {
        font-size: 14px !important;
        vertical-align: middle;
        color: $dark-56;
      }
    }
  }
  .image-icon {
    float: right;
    margin-top: 3px;
  }
}
.v-tooltip__content {
  background: $aqua !important;
  text-align: left;
  margin-top: -8.6rem;
}
</style>
