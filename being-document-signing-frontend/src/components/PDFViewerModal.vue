<template>
  <v-layout row
            justify-center>
    <v-dialog v-model="show"
              fullscreen
              hide-overlay
              lazy
              transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar height="50" v-if="!isEditMode"
                   app
                   color="#f5f5f5">
          <v-flex xs3>
            <v-btn class="b-toolbar-icon left"
                   icon
                   :ripple="false"
                   @click="closeModal">
              <v-icon class="b-text">arrow_back_ios</v-icon>
              <span class="b-text"
                    v-text="$t('common.back')">返回</span>
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <v-toolbar-title v-if="options && options.fileName"
                             v-text="options.fileName" />
          </v-flex>
          <v-flex xs3 />
        </v-toolbar>
        <v-toolbar height="50" v-else
                   dark
                   app
                   class="editing-mode"
                   @click="switchMode()">
          <v-flex xs3>
            <v-btn class="b-toolbar-icon left"
                   icon
                   :ripple="false"
                   @click="switchAndClose()"
            >
              <v-icon class="d-text">arrow_back_ios</v-icon>
              <span class="d-text" v-text="$t('common.back')"
              >返回</span>
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <v-toolbar-title  
            v-text="$t('signing.preview_signature.mode')" />
          </v-flex>
          <v-flex xs3 />
        </v-toolbar>
        <div class="mode-pane-style" ref="editorBar" v-if="isEditMode">             
          <v-btn-toggle v-model="toggleExclusive">
            <v-btn flat @click="pageChange('prev')">
              <v-icon class="d-text">navigate_before</v-icon>
            </v-btn>
            <input flat type="number" v-model="currentPage" class="number-input-non-spinner"/>
            <v-btn flat @click="pageChange('next')">
              <v-icon class="d-text">navigate_next</v-icon>
            </v-btn>
            <v-btn flat @click.stop="zoomin()" :disabled="zoom>4">
              <v-icon class="d-text">zoom_in</v-icon>
            </v-btn>
            <v-btn flat @click.stop="zoomout()" :disabled="zoom<-4">
              <v-icon class="d-text">zoom_out</v-icon>
            </v-btn>
            <v-btn flat @click="openColorPicker" v-if="!companyStamp">
              <v-icon :color="color">color_lens</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
        <PDFViewer v-if="options && options.url && show"
                   v-bind="{'url': options.url}"
                   :signer-type="signerType"
                   @document-errored="onDocumentErrored"
                   @current-page="updateCurrentPage"
                   @page-count="getPageCount">
                   
        </PDFViewer>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isShowColorPicker" width="300">
      <Swatches v-model="color" swatch-size="28" colors="text-advanced" inline></Swatches>
    </v-dialog>
  </v-layout>
</template>

<script>
import PDFViewer from './PDFViewer';

import { mapGetters, mapMutations, mapState } from 'vuex';
import { getters, mutations } from './../store/type';

import Swatches from 'vue-swatches';

// Import the styles too, globally
import 'vue-swatches/dist/vue-swatches.min.css';
export default {
  components: {
    PDFViewer,
    Swatches
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    signerType: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      url:
        'http://0.0.0.0:8080/letter/preview?key=2019%2F3%2F21%2F154d0cca-cd2e-432d-9f85-c02caf16854a_%E9%93%BE%E7%89%B9%E6%80%A7%E4%BB%8B%E7%BB%8D.pdf&accessToken=fa75e523-c78a-4161-b678-97e6438271bf',
      documentError: undefined,
      mode: 'edit',
      isShowColorPicker: false,
      color: '#EA0606',
      currentPage: 1,
      pageCount: 1,
      toggleExclusive: false,
      zoom: 1
    };
  },
  computed: {
    ...mapGetters({
      SIGNATURE_STATUS: getters.SIGNATURE_STATUS,
      SIGNATURE_INFO: getters.SIGNATURE_INFO
    }),
    ...mapState({
      companyStamp: state => state.companyStamp
    }),
    isEditMode() {
      return this.SIGNATURE_STATUS.isDragging;
    }
  },
  watch: {
    color: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.UPDATE_SINATURE_INFO({ ...this.SIGNATURE_INFO, color: this.color });
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations({
      UPDATE_SINATURE_INFO: mutations.UPDATE_SINATURE_INFO,
      SET_SIGNATURE_STATUS: mutations.SET_SIGNATURE_STATUS
    }),
    initPanel(zoom, color) {
      this.zoom = zoom;
      this.color = color;
    },
    zoomin() {
      const viewWidth = document.body.clientWidth;
      const limitWidth = this.SIGNATURE_STATUS.left + this.SIGNATURE_STATUS.width + 8;
      const limitHeight = this.SIGNATURE_STATUS.top + this.SIGNATURE_STATUS.height;
      if (limitHeight >= this.SIGNATURE_INFO.pageH) {
        return;
      }
      if (this.zoom <= 4 && viewWidth > limitWidth) {
        this.zoom++;
        this.UPDATE_SINATURE_INFO({ ...this.SIGNATURE_INFO, zoom: this.zoom });
      }
    },
    zoomout() {
      if (this.zoom >= -4) {
        this.zoom--;
        this.UPDATE_SINATURE_INFO({ ...this.SIGNATURE_INFO, zoom: this.zoom });
      }
    },
    closeModal() {
      this.$emit('updatePDFPreviewStatus', false);
    },
    switchAndClose() {
      this.switchMode();
      this.closeModal();
    },
    switchMode() {
      this.SET_SIGNATURE_STATUS({ isDragging: false });
      this.mode = 'preview';
    },
    openColorPicker() {
      this.isShowColorPicker = true;
    },
    onDocumentErrored(e) {
      this.documentError = e.text;
      this.alert.show({
        content: this.documentError,
        position: 'middle'
      });
    },
    pageChange(type) {
      if (type === 'prev') {
        this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : 1;
      } else {
        this.currentPage = this.currentPage < this.pageCount ? this.currentPage + 1 : this.pageCount;
      }
      document.getElementById(`secret-input-${this.currentPage}`).scrollIntoView();
      this.UPDATE_SINATURE_INFO({
        ...this.SIGNATURE_INFO,
        renderPageIndex: this.currentPage - 1,
        page: this.currentPage
      });
    },
    updateCurrentPage(currentPage) {
      this.currentPage = currentPage;
    },
    getPageCount(count) {
      this.pageCount = count;
    }
  }
};
</script>
<style lang="scss">
.number-input-non-spinner {
  width: 40px;
  text-align: center;
  color: #ddd;
  -moz-appearance: textfield; /* Firefox */
}
.number-input-non-spinner::-webkit-outer-spin-button {
  -webkit-appearance: inner-spin-button;
  display: inline-block;
  cursor: default;
  flex: 0 0 auto;
  align-self: stretch;
  -webkit-user-select: none;
  opacity: 0;
  pointer-events: none;
  -webkit-user-modify: read-only;
}
.mode-pane-style {
  position: fixed;
  top: 50px;
  z-index: 2;
  height: 40px;
  width: 100%;
  left: 0;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  .v-item-group {
    border: 1px #3a3838 solid;
    background-color: #3a3838 !important;
  }
}
.vc-compact {
  width: 240px;
}
.editing-mode {
  background-color: #3a3838 !important;
  .v-toolbar__title {
    color: #fefefe;
  }
}
.d-text {
  color: #fefefe !important;
}
</style>
