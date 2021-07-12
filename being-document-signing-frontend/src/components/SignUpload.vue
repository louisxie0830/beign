<template>
  <v-card id="sign_upload">
    <v-card-text>
      <v-list>
        <v-flex xs12>
          <p class="b-label"><span>{{ $t('signing.sign_doc.text') }}</span>
            <v-tooltip left
                       max-width="360" v-if="creatorsignkey===1">
              <span class="image-icon" slot="activator"><img style="height:18px;width:18px;" src="../assets/image/mark.png" /></span>
              <div class="b-tooltip-content">
                <p>{{ $t("sign_file_tip.title.text") }}</p>
                <p>{{ $t("sign_uploadfile_tip1.text") }}</p>
                <p>{{ $t("sign_file_tip2.text") }}</p>
                <p>{{ $t("sign_file_tip3.text") }}</p>
                <p>{{ $t("sign_file_tip4.text") }}</p>
              </div>
            </v-tooltip>
          </p>
        </v-flex>
        <template v-show="files.length > 0"
                  v-for="(item ,index) in files">
          <v-list-tile :key="item.name" class="file_list"
                       avatar>
            <v-list-tile-avatar>
              <v-btn @click.prevent="previewPdf(item,index)"
                     icon
                     ripple
                     round
                     :disabled="isLoading || item.status !== 'finish'">
                <v-icon color="grey lighten-1" >pageview</v-icon>
              </v-btn>
              
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-text="item.fileName || item.name" />
              <!-- <v-list-tile-sub-title v-text="formatByte(item.size|| item.fileSize)"/>  -->
            </v-list-tile-content>

            <v-list-tile-action>

              <v-btn v-if="item.status === 'fail'"
                     icon
                     ripple
                     round
                     @click.prevent="removeFile(item)">
                <v-icon color="grey lighten-1">error</v-icon>
              </v-btn>
              <v-btn v-else-if="item.status === 'finish'"
                     icon
                     ripple
                     round
                     @click.prevent="removeFile(item)"
                     :disabled="isLoading">
                <v-icon color="grey lighten-1">delete</v-icon>
              </v-btn>
              <span v-else
                    ripple
                    round>{{ item.status }}</span>

            </v-list-tile-action>
          </v-list-tile>
        </template>
        <v-layout 
          xs12 
          sm12 
          align-center 
          justify-center 
          column 
          fill-height 
          id="file_upload" 
          ref="fileUpload">
          <div class="file_upload--title" v-text="$t('sign.upload_file_tips')"/>
          <v-btn class="b-btn white"
                 :flat="true"
                 large
                 @click="addFile"
                 :disabled="files.length > 15 || isLoading">
            <span v-text="$t('signing.add_doc.text')" />
            <input style="display: none;"
                   id="files"
                   ref="files"
                   type="file"
                   name="inputFileUpload"
                   accept=".pdf,application/pdf"
                   multiple
                   @change="handleFilesUpload">
          </v-btn>
          <div class="mt-2" v-text="$t('sign.upload_file_max_size')"/>
        </v-layout>
      </v-list>
    </v-card-text>
    <PDFViewerModal :show="showPDFPreview"
                    ref="viewerModal"
                    :options="options"
                    signer-type="SIGN"
                    @updatePDFPreviewStatus="updatePDFPreviewStatus" />
  </v-card>
</template>
<script>
import PDFViewerModal from './PDFViewerModal';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { actions, getters, mutations } from './../store/type.js';
import EncryptionFactory from '../utils/EncryptionFactory';

export default {
  components: {
    PDFViewerModal
  },
  props: {
    updateFileList: {
      type: Array,
      default: () => []
    },
    creatorsignkey: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      files: [],
      maxSize: 10 * 1048576,
      maxUploadSize: 15,
      currentFileSize: 0,
      currentUploadSize: 0,
      postLetterUploadList: [],
      existFile: [],
      isLoading: false,
      showPDFPreview: false,
      options: {},
      currentIndex: 0
    };
  },
  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA,
      SIGNATURE_INFO: getters.SIGNATURE_INFO
    }),
    currentFiles() {
      return this.files;
    }
  },

  watch: {
    updateFileList(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.files = newValue
          .map(f => {
            f.fileName = decodeURIComponent(f.fileName);
            f.status = f.status || 'finish';
            return f;
          })
          .filter((element, index, arr) => {
            return arr.indexOf(element) === index;
          });
      }
    }
  },

  created() {
    this.fileUploadWhenDrag();
  },

  methods: {
    ...mapActions({
      postLetterUpload: actions.POST_LETTER_UPLOAD,
      GET_USER_CER_PASSWORD: actions.GET_USER_CER_PASSWORD,
      errHandler: 'errHandler'
    }),
    ...mapMutations({
      UPDATE_SINATURE_INFO: mutations.UPDATE_SINATURE_INFO
    }),

    fileUploadWhenDrag() {
      this.$nextTick(() => {
        const fileUpload = document.getElementById('file_upload');
        const dndFunction = e => {
          e.preventDefault();
          e.stopPropagation();
        };
        this.$refs.fileUpload.addEventListener('drag', dndFunction);
        this.$refs.fileUpload.addEventListener('dragstart', dndFunction);
        this.$refs.fileUpload.addEventListener('dragend', dndFunction);
        this.$refs.fileUpload.addEventListener('dragover', dndFunction);
        this.$refs.fileUpload.addEventListener('dragenter', dndFunction);
        this.$refs.fileUpload.addEventListener('dragleave', dndFunction);
        this.$refs.fileUpload.addEventListener('drop', e => {
          e.preventDefault();
          if (!this.isLoading) {
            this.$refs.files.files = e.dataTransfer.files;
            this.handleFilesUpload();
          }
        });
      });
    },

    addFile() {
      this.$refs.files.click();
    },
    fetchUploadPdf(fileUrl) {
      return `${process.env.BASE_URL}/letter/preview?key=${fileUrl}&accessToken=${this.USER_DATA.token}&access=allow`;
    },
    getDefaultColor() {
      return '#EA0606';
    },
    async handleFilesUpload() {
      const uploadedFiles = this.$refs.files.files;

      for (let i = 0, len = uploadedFiles.length; i < len; i++) {
        if (uploadedFiles[i].name.length - 4 > 40) {
          window.app.toast.show({
            icon: 'info',
            content: this.$t('upload_file_length')
          });
          console.log(uploadedFiles[i].name.length - 4);
        } else if (this.validateFile(uploadedFiles[i]) && !this.isExistFile(uploadedFiles[i].name)) {
          this.files.push(uploadedFiles[i]);
        }
      }
      this.$refs.files.value = '';
      let fetchAll = [];

      for (let i = 0; i < this.files.length; i++) {
        if (
          !this.isExistFile(this.files[i].name || this.files[i].fileName) &&
          (this.files[i].status !== 'finish' && this.files[i].status !== 'fail')
        ) {
          const formData = new FormData();
          formData.append('file', this.files[i]);
          formData.append('version', 1);

          const config = {
            onUploadProgress: progressEvent => {
              const complete = (((progressEvent.loaded / progressEvent.total) * 100) | 0) + '%';
              this.files[i].status = complete;
              this.$forceUpdate();
            }
          };
          this.isLoading = true;
          fetchAll.push(
            this.postLetterUpload({ formData: formData, config: config })
              .then(({ data }) => {
                this.files[i].status = 'finish';
                this.files[i] = { ...this.files[i], ...data };

                this.$emit('updateFileList', {
                  type: 'add',
                  data: this.files[i]
                });

                this.$forceUpdate();
              })
              .catch(err => {
                this.files[i].status = 'fail';

                this.$emit('updateFileList', {
                  type: 'add',
                  data: {
                    fileName: this.files[i].name,
                    type: this.files[i].type,
                    status: this.files[i].status,
                    fileHash: this.files[i].fileHash
                  }
                });
                this.$forceUpdate();
              })
          );
        }
      }
      Promise.all(fetchAll).finally(() => {
        this.isLoading = false;
        if (this.$refs.files.value) {
          this.$refs.files.value = '';
        }
        this.$forceUpdate();
      });
    },

    isExistFile(name) {
      if (this.updateFileList.length > 0) {
        for (let i = 0, len = this.updateFileList.length; i < len; i++) {
          if (this.updateFileList[i].fileName === name) {
            return true;
          }
        }
      }
      return false;
    },

    removeFile({ name, fileName, fileHash, status }) {
      name = name || fileName;
      let data;
      if (status === 'fail') {
        for (let i = 0, len = this.files.length; i < len; i++) {
          if (this.files[i].name === name) {
            data = {
              fileName: this.files[i].name
            };
            break;
          } else if (this.files[i].fileName === name) {
            data = {
              fileName: this.files[i].fileName
            };
            break;
          }
        }
      } else {
        const repalceName = name.replace(/,|，/g, '');
        for (let i = 0, len = this.updateFileList.length; i < len; i++) {
          if (this.updateFileList[i].fileName === repalceName && this.updateFileList[i].fileHash === fileHash) {
            data = this.updateFileList[i];
            break;
          }
        }
      }
      if (data) {
        this.$emit('updateFileList', {
          type: 'del',
          data: data
        });
      }
    },

    validateFile(file) {
      if (file.size >= this.maxSize) {
        this.alert.show({
          content: file.name + this.$t('common_file_upload_max_size'),
          position: 'middle'
        });
        return false;
      }
      const fileRegEx = /^application\/(pdf)$/;
      if (!fileRegEx.test(file.type)) {
        this.alert.show({
          content: file.name + this.$t('common.file_rules.format'),
          position: 'middle'
        });
        return false;
      }
      return true;
    },

    formatByte(size) {
      if (size < 1024) {
        return size + 'Byte';
      } else if (size < 1048576) {
        return Math.floor(size / 1024) + 'KB';
      } else {
        return Math.floor(size / 1048576) + 'MB';
      }
    },

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
    getDocumentSignature() {},
    saveDocumentSignature(options) {
      //find out the same fileName or fileUrl ,and save the singature info
      for (let i = 0, l = this.updateFileList.length; i < l; i++) {
        let fileInfo = this.updateFileList[i];
        if (this.options.fileName === fileInfo.fileName) {
          fileInfo.signature = {
            page: this.SIGNATURE_INFO.page,
            pageOffsetX: this.SIGNATURE_INFO.pageOffsetX,
            pageOffsetY: this.SIGNATURE_INFO.pageOffsetY,
            content: this.SIGNATURE_INFO.content,
            color: this.SIGNATURE_INFO.color,
            fontStyleName: this.SIGNATURE_INFO.fontStyleName,
            renderPageIndex: this.SIGNATURE_INFO.renderPageIndex,
            zoom: this.SIGNATURE_INFO.zoom
          };
        }
      }
      //clean the current state
      this.UPDATE_SINATURE_INFO({
        id: 0,
        title: '',
        fontStyleName: 'sans-serif',
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
      console.log('SIGNATURE_INFO=', this.SIGNATURE_INFO);
    },
    updatePDFPreviewStatus(type, options = null) {
      if (!!type) {
        //get document signature
        this.showPDFPreview = true;
      } else {
        //save document signature
        this.showPDFPreview = false;
        this.saveDocumentSignature(this.options);
      }
      this.options = options;
    },

    previewPdf({ fileUrl, fileName, readerResult, signature }, currentIndex) {
      this.options = {
        fileName,
        url: this.fetchUploadPdf(fileUrl)
      };
      this.currentIndex = currentIndex;
      this.showPDFPreview = true;
      if (signature) {
        //exsiting signature will getting data from state.
        this.UPDATE_SINATURE_INFO(signature);
        this.$refs.viewerModal.initPanel(signature.zoom, signature.color);
      } else {
        //new signature will init data
        this.$refs.viewerModal.initPanel(1, this.getDefaultColor());
      }
    },

    preFileLoad(files) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import './../assets/scss/_variables.scss';

#sign_upload {
  .v-list {
    border-bottom: 0;
    padding: 0;
  }
  .v-tooltip--left {
    vertical-align: sub;
  }
  .v-list__tile {
    padding: 0;
  }
  .init-btn {
    cursor: pointer;
    .flex {
      align-self: center;
    }
    &p {
      text-align: left;
      margin: 0;
    }
    .prompt {
      color: $dark--40;
      font-size: 12px;
    }
    .init-icon {
      text-align: right;
      cursor: pointer;
    }
  }

  #file_upload {
    height: 200px;
    border: 2px dotted $dark-40;
    .b-btn {
      border-color: $dark-40 !important;
      color: $dark-40 !important;
    }
  }
  .file_upload--title {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: $dark-40;
  }
  .file_list {
    margin-bottom: 0px;
  }
}
.v-tooltip__content {
  background: $aqua !important;
  text-align: left;
  margin-top: -80px;
}
</style>
