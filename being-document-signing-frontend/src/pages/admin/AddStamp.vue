<template>
  <v-flex id="add_stamp">
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('add_stamp_title')"></header-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-3>
      <v-layout 
        xs12 
        sm12 
        align-center 
        justify-center 
        column 
        fill-height>
        <div class="file-content">
          <div v-if="files.length === 0" class="file_upload--title file_upload_title" v-text="'+公司簽章上傳'"/>
          <div v-if="files.length === 0" class="file_upload--title" v-text="'可上傳檔案不可超過2MB'"/>
          <div v-if="files.length === 1" @click="addFile" class="stamp-img">
            <p class="stamp-info">{{ $t('change_stamp') }}</p>
            <canvas id="canvas-stamp"></canvas>
          </div>
        </div>
        <v-btn class="b-btn"
               :flat="true"
               large
               @click="addFile"
               v-show="files.length === 0">
          <span v-text="$t('signing.add_doc.text')" />
          <input style="display: none;"
                 ref="stampFile"
                 type="file"
                 accept=".png, .jpg, image/png, image/jpeg"
                 @change="handleFilesUpload">
        </v-btn>
        <v-btn class="b-btn"
               :flat="true"
               large
               @click="handleSubmit"
               v-show="files.length === 1">
          <span v-text="'确认'" />
        </v-btn>
      </v-layout>
    </v-container>
  </v-flex>
</template>

<script>
export default {
  name: 'AddStamp',
  data() {
    return {
      files: [],
      img: {},
      size: 0,
      base64: null
    };
  },
  methods: {
    addFile() {
      this.$refs.stampFile.click();
    },
    handleSubmit() {
      this.$store
        .dispatch('POST_ADD_STAMP', {
          companyId: this.$route.params.id,
          signature: this.base64
        })
        .then(res => {
          this.alert.show({
            content: this.$t('uploadCSVSuccess'),
            position: 'middle'
          });
          this.$router.go(-1);
        });
    },
    handleFilesUpload() {
      this.files = this.$refs.stampFile.files;
      this.size = this.files[0].size;
      if (this.size > 2 * 1024 * 1024) {
        this.toast.show({
          icon: 'info',
          content: this.$t('alert_img_size')
        });
        this.files = [];
        this.$refs.stampFile.value = '';
        return;
      }
      console.log(this.size);
      const reader = new FileReader();
      reader.readAsDataURL(this.files[0]); //转化成base64数据类型
      reader.onload = e => {
        const cvs = document.querySelector('#canvas-stamp');
        // cvs.width = 300;
        cvs.height = 200;
        const ctx = cvs.getContext('2d');
        const img = new Image();
        this.base64 = reader.result;
        img.src = reader.result;
        img.onload = () => {
          cvs.width = (img.width * 200) / img.height;
          ctx.drawImage(img, 0, 0, (img.width * 200) / img.height, 200);
          this.img = cvs.toDataURL(); //获取canvas base64数据
        };
        this.$refs.stampFile.value = '';
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.file-content {
  width: 95%;
  margin-left: 2.5%;
  background-color: #fff;
  height: 200px;
}
.file_upload_title {
  margin-top: 70px;
}
.b-btn {
  background-color: #10acce;
  color: #fff;
  width: 70%;
  margin-top: 20px;
  border-radius: 22px;
}
.stamp-img {
  position: relative;
  cursor: pointer;
}
.stamp-info {
  position: absolute;
  height: 45px;
  background: rgba(0, 0, 0, 0.3);
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  line-height: 45px;
  color: #fff;
  margin: 0;
  font-size: 25px;
}
</style>
