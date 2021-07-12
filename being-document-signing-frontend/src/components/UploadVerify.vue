<template>
  <v-card id="sign_upload">
    <v-card-text>
      <v-flex xs12
              v-if="files.length === 0">
        <span class="init-btn"
              @click="addFile()">
          <v-container pa-0>
            <v-layout row
                      wrap>
              <v-flex xs10>
                <p style="margin: 0">{{ $t('check_file.checked.text') }} <span class="prompt">{{ $t('signing.add_sign_prompt.text') }}</span></p>
              </v-flex>
              <v-flex xs2
                      class="init-icon">
                <v-icon>add_circle_outline</v-icon>
              </v-flex>
            </v-layout>
          </v-container>
        </span>
      </v-flex>

      <v-list v-show="files.length > 0">
        <v-flex xs12>
          <p class="b-label">{{ $t('check_file.wait.checked.text') }}</p>
        </v-flex>
        <template v-show="files.length > 0"
                  v-for="(item, index) in files">
          <v-list-tile :key="index"
                       avatar>
            <v-list-tile-avatar>
              <v-icon color="grey lighten-1">description</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-text="item.fileName || item.name" />
              <v-list-tile-sub-title> {{ $t('common.doc_type',[ item.fileType ]) }} {{ formatByte(item.size) }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn v-if="item.status === 'fail'"
                     icon
                     ripple
                     round
                     @click.prevent="removeFile(item)">
                <v-icon color="grey lighten-1">error</v-icon>
              </v-btn>
              <v-btn v-else-if="item.status !== 'fail'"
                     icon
                     ripple
                     round
                     @click.prevent="removeFile(item)">
                <v-icon color="grey lighten-1">clear</v-icon>
              </v-btn>
              <span v-else
                    ripple
                    round>{{ item.status }}</span>

            </v-list-tile-action>
          </v-list-tile>
        </template>
        <v-flex xs12>
          <v-btn class="b-btn white my-btn"
                 :flat="true"
                 large
                 @click="addFile()">
            <v-icon>add</v-icon>
            <span v-text="$t('check_file.upload.text')" />
            <input style="display: none;"
                   id="files"
                   ref="files"
                   type="file"
                   name="inputFileUpload"
                   accept=".pdf,application/pdf"
                   @change="$emit('resetData'); handleFilesUpload();">
          </v-btn>
        </v-flex>
      </v-list>

    </v-card-text>
  </v-card>

</template>
<script>
import { mapActions } from 'vuex';
import { actions } from './../store/type.js';
export default {
  props: {
    updateFileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      files: [],
      maxSize: 30 * 1048576,
      maxUploadSize: 15,
      currentFileSize: 0,
      currentUploadSize: 0,
      postLetterUploadList: [],
      existFile: [],
      isLoading: false
    };
  },
  computed: {
    currentFiles() {
      return this.files;
    }
  },
  methods: {
    ...mapActions({
      postLetterUploadVerify: actions.POST_LETTER_VERIFY,
      errHandler: 'errHandler'
    }),
    addFile() {
      this.$refs.files.click();
    },
    submitVerfy() {
      for (let i = 0; i < this.files.length; i++) {
        if (!this.isExistFile(this.files[i].name) && this.files[i].status !== 'finish') {
          const formData = new FormData();
          formData.append('file', this.files[i]);
          const config = {
            onUploadProgress: progressEvent => {
              const complete = (((progressEvent.loaded / progressEvent.total) * 100) | 0) + '%';
              this.files[i].status = complete;
              this.$forceUpdate();
            }
          };
          this.postLetterUploadVerify({ formData: formData, config: config })
            .then(({ data }) => {
              this.$emit('updateFileList', {
                data: data
              });
              this.files[i].status = 'finish';
            })
            .catch(err => {
              this.files[i].status = 'fail';
              this.$emit('failEvent', err.data);
            })
            .finally(() => {
              this.$refs.files.value = '';
              this.$forceUpdate();
            });
        }
      }
    },
    handleFilesUpload() {
      const uploadedFiles = this.$refs.files.files;
      for (let i = 0, len = uploadedFiles.length; i < len; i++) {
        if (this.validateFile(uploadedFiles[i]) && !this.isExistFile(uploadedFiles[i].name)) {
          this.files = [];
          this.files.push(uploadedFiles[i]);
        }
      }
      this.$refs.files.value = '';
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
    removeFile({ name }) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].name === name) {
          this.files.splice(i, 1);
          break;
        }
      }
      this.$emit('updateFileList', {
        type: 'del'
      });
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
    }
  }
};
</script>
<style lang="scss">
@import './../assets/scss/_variables.scss';

#sign_upload {
  .v-list {
    border-bottom: 0;
    padding: 0;
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
  .my-btn {
    border: 1px solid;
    border-color: #13c3ea !important;
    border-radius: 22px;
  }
}
</style>
