<template>
  <div>
    <ScrollingDocument class="pdf-document"
                       v-bind="{pages, pageCount, currentPage}"
                       v-slot="{page, isPageFocused, isElementFocused}"
                       :enable-page-jump="true"
                       @page-jump="onPageJump"
                       @pages-fetch="onPagesFetch"
                       @pages-reset="fitWidth">
      <PDFPage v-bind="{scale, optimalScale, page, isPageFocused, isElementFocused}"
               @page-rendered="onPageRendered"
               @page-errored="onPageErrored"
               @page-focus="onPageFocused"
               @page-click="onPageClicked"
               @page-rendered-completed="onPageRenderedCompleted"
 
               
      />
      
      <vue-drag-resize 
        v-if="signerType === 'SIGN'"
        class="draggable-area"
        :parent-limitation="true" 
        @dragging="onDragging"
        @dragstop="onDragstop"
    
        @clicked="onActived"
        :is-resizable="false"
        :minh="14"
        :w="w"
        :x="x"
        :y="y"
        :h="h">
      </vue-drag-resize>
    </ScrollingDocument>
    <img ref="signatureImage" id="canvasImg" />
  </div>
</template>

<script>
// PDFDocument renders an entire PDF inline using
// PDF.js and <canvas>. Currently does not support,
// rendering of selected pages (but could be easily
// updated to do so).
import { PIXEL_RATIO, VIEWPORT_RATIO } from '../utils/constants.js';
import VueDragResize from 'vue-drag-resize';
import { mapGetters, mapMutations, mapState } from 'vuex';
import { getters, mutations } from './../store/type';
import ScrollingDocument from './ScrollingDocument';
import PDFPage from './PDFPage';

export default {
  name: 'PDFDocument',
  components: {
    ScrollingDocument,
    PDFPage,
    VueDragResize
  },
  props: {
    pages: {
      required: true
    },
    pageCount: {
      type: Number,
      default: 0
    },
    scale: {
      type: Number,
      default: 1.0
    },
    optimalScale: {
      type: Number
    },
    fit: {
      type: String
    },
    currentPage: {
      type: Number,
      default: 1
    },
    isPreviewEnabled: {
      default: false
    },
    signerType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      w: 0,
      h: 0,
      x: 0,
      y: 0,
      renderedPage: 0,
      realCurrentPage: 0,
      canvasElement: document.createElement('canvas')
    };
  },

  computed: {
    ...mapGetters([getters.SIGNATURE_INFO, getters.USER_DATA, getters.CORP_ID, getters.SIGNATURE_STATUS]),
    ...mapState({
      companyStamp: state => state.companyStamp
    }),
    defaultViewport() {
      if (!this.pages.length) return { width: 0, height: 0 };
      const [page] = this.pages;
      console.log('viewport');
      console.log(page.getViewport(1.0));
      return page.getViewport(1.0);
    },

    isPortrait() {
      const { width, height } = this.defaultViewport;
      return width <= height;
    },
    getSignatureStatus() {
      return this[getters.SIGNATURE_STATUS];
    },
    getSignatureInfo() {
      return this[getters.SIGNATURE_INFO];
    },
    getColor() {
      return this[getters.SIGNATURE_INFO].color;
    },
    getRenderIndex() {
      return this[getters.SIGNATURE_INFO].renderPageIndex;
    },
    getZoomIndex() {
      return this[getters.SIGNATURE_INFO].zoom;
    },
    getUserData() {
      return this[getters.USER_DATA];
    }
  },
  watch: {
    fit(fit) {
      switch (fit) {
        case 'width':
          this.fitWidth();
          break;
        case 'auto':
          this.fitAuto();
          break;
        default:
          break;
      }
    },
    getColor(value) {
      this.updateCoordinate(this.x, this.y, this.w, this.h, this.getSignatureInfo.page);
    },
    getRenderIndex(index) {
      this.setSignatureZone(index);
    },
    getZoomIndex() {
      this.renderSignature();
    },
    w(width) {
      this.SET_SIGNATURE_STATUS({ width });
    },
    h(height) {
      this.SET_SIGNATURE_STATUS({ height });
    },
    pageCount: 'fitWidth',
    isPreviewEnabled: 'fitWidth'
  },
  mounted() {
    console.log('this.signerType', this.signerType);
  },
  destroyed() {
    this.SET_SIGNATURE_STATUS({ isDragging: false });
  },
  methods: {
    ...mapMutations({
      SET_SIGNATURE_STATUS: mutations.SET_SIGNATURE_STATUS,
      UPDATE_SINATURE_INFO: mutations.UPDATE_SINATURE_INFO
    }),

    renderSignature() {
      this.createSignatureCanvas({
        companyName: this.getSignatureStatus.companyName,
        name: this.getUserData.name,
        signingDate: this.getSignatureStatus.systemDate,
        baseFontSize: 16,
        fontStyle: this.getSignatureStatus.fontStyleName || this.getSignatureInfo.fontStyleName,
        color: this.getSignatureInfo.color
      });
    },
    //created signature by userName,organization and signing date
    createSignatureCanvas({ companyName = '', name, signingDate = '', baseFontSize = 16, fontStyle, color }) {
      const linePadding = 4;
      const maxWordingCount = Math.max(companyName.length, name.length, signingDate.length);
      let size = baseFontSize + this.getZoomIndex - 1;
      //for rendering high high resolution canvas
      size = size * 2;
      const ctx = this.canvasElement.getContext('2d');
      ctx.font = `${size}px ${fontStyle}`;

      const maxWording = [companyName, name, signingDate].reduce((a, b) => {
        return a.replace(/[^\x00-\xff]/g, 'xx').length > b.replace(/[^\x00-\xff]/g, 'xx').length ? a : b;
      });
      const measureText = ctx.measureText(maxWording);
      this.canvasElement.width = measureText.width;
      const lineLength = companyName === '' ? 2 : 3;
      this.canvasElement.height = (size + linePadding) * lineLength + linePadding;
      const aspectRatio = this.canvasElement.width / this.canvasElement.height;
      const dataURL = this.drawSignature({ companyName, name, signingDate, linePadding, size, fontStyle, color });

      //viewport width
      let { widthRatio, heigthRatio } = this.getClientRatio(1);
      //for showing only
      const ratioWidth = measureText.width / 2;
      this.$refs.signatureImage.width = ratioWidth * widthRatio;
      this.$refs.signatureImage.src = this.companyStamp ? this.companyStamp : dataURL;
      this.h = this.$refs.signatureImage.height; //(ratioWidth / aspectRatio) * heigthRatio;
      this.w = this.$refs.signatureImage.width; //ratioWidth * widthRatio;
    },
    drawSignature({ companyName, name, signingDate, fontStyle, linePadding, size, color }) {
      //draw canvas
      const ctx = this.canvasElement.getContext('2d');
      ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      ctx.fillStyle = color;
      console.log('size: ', size);
      ctx.font = `${size}px ${fontStyle}`;
      let lineCount = 1;
      if (companyName.length !== 0) {
        ctx.fillText(companyName, 0, (size + linePadding) * lineCount);
        lineCount++;
      }
      ctx.fillText(name, 0, (size + linePadding) * lineCount);
      lineCount++;
      ctx.fillText(signingDate, 0, (size + linePadding) * lineCount);
      lineCount++;
      return this.canvasElement.toDataURL();
    },
    //appended signature by assigned page
    pageWidthScale() {
      const { defaultViewport, $el } = this;
      if (!defaultViewport.width) return 0;
      return ($el.clientWidth * PIXEL_RATIO * VIEWPORT_RATIO) / defaultViewport.width;
    },

    pageHeightScale() {
      const { defaultViewport, $el } = this;
      if (!defaultViewport.height) return 0;
      return ($el.clientHeight * PIXEL_RATIO * VIEWPORT_RATIO) / defaultViewport.height;
    },
    // Determine an ideal scale using viewport of document's first page, the pixel ratio from the browser
    // and a subjective scale factor based on the screen size.
    fitWidth() {
      console.log('fit width');
      const scale = this.pageWidthScale();
      this.updateScale(scale, { isOptimal: !this.optimalScale });
    },

    fitHeight() {
      const scale = this.isPortrait ? this.pageHeightScale() : this.pageWidthScale();
      this.updateScale(scale);
    },

    fitAuto() {
      const scale = Math.min(this.pageWidthScale(), this.pageHeightScale());
      this.updateScale(scale);
    },

    updateScale(scale, { isOptimal = false } = {}) {
      if (!scale) return;
      this.$emit('scale-change', { scale, isOptimal });
    },

    onPageJump(scrollTop) {
      this.$el.scrollTop = scrollTop; // triggers 'scroll' event
    },

    onPagesFetch(currentPage) {
      this.$parent.$emit('pages-fetch', currentPage);
    },

    onPageFocused(pageNumber) {
      this.$parent.$emit('page-focus', pageNumber);
    },

    onPageRendered(payload) {
      this.$parent.$emit('page-rendered', payload);
      console.log(`${this.pageCount} , + ${this.currentPage} `);
      console.log(payload);
      const aspectRatio = this.canvasElement.width / this.canvasElement.height;
      // this.renderedPage;
      if (this.getSignatureInfo.couldBeRendered) {
        if (payload.page.pageIndex === 0) {
          this.renderSignature();
          //get signatureInfo
          this.renderedPage = this.getSignatureInfo.page === 0 ? this.pageCount : this.getSignatureInfo.page;
        }

        if (payload.page.pageNumber === this.renderedPage) {
          const viewportlPosistion = this.getViewportPosistion({
            p: payload.page.pageNumber,
            x: this.getSignatureInfo.pageOffsetX,
            y: this.getSignatureInfo.pageOffsetY,
            w: this.getSignatureInfo.width,
            h: this.getSignatureInfo.height
          });
          this.x = viewportlPosistion.x;
          this.y = viewportlPosistion.y;
          this.w = viewportlPosistion.w;
          this.h = viewportlPosistion.h;
          this.renderSignature();
          this.setSignatureZone(payload.page.pageIndex);
        }
      }
    },
    onPageClicked() {
      this.SET_SIGNATURE_STATUS({
        isDragging: false
      });
    },
    onPageErrored(payload) {
      this.$parent.$emit('page-errored', payload);
    },
    onActived(e) {
      this.SET_SIGNATURE_STATUS({
        isDragging: true
      });
    },
    onDragging(coordinate) {
      this.SET_SIGNATURE_STATUS({
        isDragging: true,
        ...coordinate
      });
    },
    onDragstop(coordinate) {
      this.updateCoordinate(coordinate.left, coordinate.top, coordinate.width, coordinate.height, this.currentPage);
    },
    updateCoordinate(x, y, w, h, p) {
      this.renderSignature();
      let image64 = this.canvasElement.toDataURL();
      this.x = x;
      this.y = y;
      const originalPosistion = this.getOriginalPosistion({
        p: p,
        x: this.x,
        y: this.y,
        w: w,
        h: h
      });
      console.log('originalPosistion');
      console.log(originalPosistion);
      this.UPDATE_SINATURE_INFO({
        width: originalPosistion.w,
        height: originalPosistion.h,
        pageOffsetX: originalPosistion.x,
        pageOffsetY: originalPosistion.y,
        page: p,
        content: image64,
        pageH: this.pages[p - 1].getViewport(1.0).height * originalPosistion.hr, // 单页的pdf渲染出来的实际高度用于限制签名的resize
        color: this.getSignatureInfo.color
      });
      this.SET_SIGNATURE_STATUS({
        isDragging: true
      });
    },
    getClientRatio(p) {
      const canvasElement = document.getElementsByClassName('pdf-page')[p - 1];
      const page = this.pages[p - 1];
      let widthRatio = Number.parseInt(canvasElement.style.width) / page.getViewport(1.0).width;
      let heigthRatio = Number.parseInt(canvasElement.style.height) / page.getViewport(1.0).height;
      return { widthRatio, heigthRatio };
    },
    getViewportPosistion({ p, x, y, w, h }) {
      let { widthRatio, heigthRatio } = this.getClientRatio(p);
      return {
        p,
        y: y * heigthRatio,
        x: x * widthRatio,
        w: w * widthRatio,
        h: h * heigthRatio,
        wr: widthRatio,
        hr: heigthRatio
      };
    },
    getOriginalPosistion({ p, x, y, w, h }) {
      let { widthRatio, heigthRatio } = this.getClientRatio(p);
      return {
        p,
        y: y / heigthRatio,
        x: x / widthRatio,
        w: w / widthRatio,
        h: h / heigthRatio,
        wr: widthRatio,
        hr: heigthRatio
      };
    },
    setSignatureZone(pageIndex) {
      let renderedPages = document.getElementsByClassName('scrolling-page');
      let renderSigArea = document.getElementsByClassName('draggable-area')[0];
      renderSigArea.appendChild(this.$refs.signatureImage);
      renderedPages[pageIndex].appendChild(renderSigArea);
    }
  }
};
</script>

<style>
.pdf-document {
  position: absolute;
  overflow: auto;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #525f69;
}

.scrolling-page {
  margin-bottom: 1em;
  position: relative;
  width: 100%;
  top: 56px;
}
.vdr.active:before {
  content: '';
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  outline: 4px dashed #d6d6d6;
}
/* @media print {
    .pdf-document {
        position: static;
    }
} */
</style>
