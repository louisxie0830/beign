<template>
  <v-flex id="checkFile"
          xs12
          sm8
          md6
          offset-sm2
          offset-md3>
    <v-toolbar height="56"
               class="b-toolbar"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('check_file.title.text')"></header-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-2>
      <v-layout row wrap>
        <v-flex xs12
                mt-2>
          <!-- 新增文件 -->
          <upload-verify @updateFileList="updateFileList"
                         :update-file-list.sync="uploadFileList"
                         ref="child"
                         @failEvent="failEvent"
                         @resetData="resetData"
                         :max-number="1" />
        </v-flex>
        <v-flex xs12 mt-2 v-show="showVerify">
          <v-card pa-3
                  class="content">
            <v-layout row
                      wrap
                      v-show="!fail">
              <v-flex xs12>
                <v-card-text class="px-0 title-gray">{{ $t('check_file.checked.info.title') }}</v-card-text>
              </v-flex>
              <v-flex xs12>
                <v-card-text class="px-0 text-grey"><span>{{ $t('check_file.checked.info.status') }} :</span>
                  <v-chip v-for="tag in LETTER_TAGS"
                          :key="tag.type"
                          v-show="uploadFileList[0] && uploadFileList[0].signStatus === tag.type"
                          :style="{ backgroundColor: tag.color, color: '#fff'}">{{ tag.wording }}</v-chip></v-card-text>
              </v-flex>
              <v-flex xs12>
                <v-card-text class="px-0 text-grey">{{ $t('check_file.checked.info.modify.key') }} : {{ $t('check_file.checked.info.modify.value') }}</v-card-text>
              </v-flex>
            </v-layout>
            <v-layout row
                      wrap
                      v-show="fail">
              <v-flex xs12 d-flex style="text-align:left;">
                <v-card-text class="px-0 title-gray">{{ $t('check_file.checked.info.title') }}</v-card-text>
              </v-flex>
              <v-flex xs12>
                <v-card-text class="px-0" style="color:#f25643">{{ $t('check_file.checked.info.fail') }}: {{ failInfo.message }}</v-card-text>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex class="b-footer mt-2"
                xs12
                sm12
                d-flex
                v-show="!showVerify">
          <v-flex xs6
                  sm6
                  d-flex>
            <v-btn round
                   large
                   @click="checkSubmit('close')">
              取消
            </v-btn>
          </v-flex>
          <v-flex xs6
                  sm6
                  d-flex>
            <v-btn round
                   large
                   class="b-btn"
                   @click="checkSubmit('submit')">
              確定
            </v-btn>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>

<script>
const UploadVerify = () => import('./../../components/UploadVerify.vue');
import signMixin from './../../mixins/Sign.js';
export default {
  components: {
    UploadVerify
  },
  mixins: [signMixin],
  data() {
    return {
      uploadFileList: [],
      showVerify: false,
      failInfo: {},
      fail: true
    };
  },
  methods: {
    checkSubmit(type) {
      if (type === 'submit') {
        this.$refs.child.submitVerfy();
      } else {
        this.$router.go(-1);
      }
    },
    failEvent(data) {
      this.failInfo = data;
      this.fail = true;
      this.showVerify = true;
    },
    resetData() {
      this.showVerify = this.fail = false;
      this.failInfo = {};
    },
    updateFileList(param) {
      this.uploadFileList = [];
      if (param.type !== 'del') {
        this.uploadFileList.push(param.data);
        this.showVerify = true;
        this.fail = false;
      } else {
        this.uploadFileList = [];
        this.failInfo = {};
        this.fail = false;
        this.showVerify = false;
      }
      // console.log(this.uploadFileList);
    }
  }
};
</script>
<style lang="scss">
#checkFile {
  .content {
    padding-left: 15px;
    padding-right: 15px;
  }
  .text-grey {
    color: #999;
  }
  .title-gray {
    color: #666;
  }
}
</style>
