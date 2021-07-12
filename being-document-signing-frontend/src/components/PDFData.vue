

<script>
// PDFDocument renders an entire PDF inline using
// PDF.js and <canvas>. Currently does not support,
// rendering of selected pages (but could be easily
// updated to do so).

import range from 'lodash/range';
import { getters, mutations } from '../store/type.js';
import { mapGetters, mapMutations } from 'vuex';

function getDocument(url, authToken) {
  // Using import statement in this way allows Webpack
  // to treat pdf.js as an async dependency so we can
  // avoid adding it to one of the main bundles
  authToken = 'Bearer' + ' ' + authToken;
  const getDocument = require('pdfjs-dist/webpack').getDocument;
  return getDocument({
    url: url,
    httpHeaders: { authorization: authToken },
    withCredentials: true
  });
}

// pdf: instance of PDFData
// see docs for PDF.js for more info
function getPages(pdf, first, last) {
  const allPages = range(first, last + 1).map(number => pdf.getPage(number));
  return Promise.all(allPages);
}

const BUFFER_LENGTH = 10;
function getDefaults() {
  return {
    pages: [],
    cursor: 0
  };
}

export default {
  name: 'PDFData',

  props: {
    url: {
      type: String,
      required: true
    }
  },

  data() {
    return Object.assign(getDefaults(), {
      pdf: undefined
    });
  },

  computed: {
    ...mapGetters({
      USER_DATA: getters.USER_DATA
    }),
    pageCount() {
      return this.pdf ? this.pdf.numPages : 0;
    }
  },

  watch: {
    url: {
      handler(url) {
        this.UPDATE_LOAD_STATUS(true);
        getDocument(url, this.USER_DATA.token)
          .then(pdf => {
            this.pdf = pdf;
            this.UPDATE_LOAD_STATUS(false);
          })
          .catch(response => {
            this.UPDATE_LOAD_STATUS(false);
            this.$emit('document-errored', { text: 'Failed to retrieve PDF', response });
          });
      },
      immediate: true
    },

    pdf(pdf, oldPdf) {
      if (!pdf) return;
      if (oldPdf) Object.assign(this, getDefaults());

      this.$emit('page-count', this.pageCount);
      this.fetchPages();
    }
  },

  created() {
    this.$on('page-rendered', this.onPageRendered);
    this.$on('page-errored', this.onPageErrored);
    this.$on('pages-fetch', this.fetchPages);
  },

  methods: {
    ...mapMutations({
      UPDATE_LOAD_STATUS: mutations.UPDATE_LOAD_STATUS
    }),
    fetchPages(currentPage = 0) {
      if (!this.pdf) return;
      if (this.pageCount > 0 && this.pages.length === this.pageCount) return;

      const startIndex = this.pages.length;
      if (this.cursor > startIndex) return;

      const startPage = startIndex + 1;
      const endPage = Math.min(Math.max(currentPage, startIndex + BUFFER_LENGTH), this.pageCount);
      this.cursor = endPage;
      getPages(this.pdf, startPage, endPage)
        .then(pages => {
          const deleteCount = 0;
          this.pages.splice(startIndex, deleteCount, ...pages);
          return this.pages;
        })
        .catch(response => {
          this.$emit('document-errored', { text: 'Failed to retrieve pages', response });
        });
    },

    onPageRendered({ text, page }) {
      console.log(text, page);
    },

    onPageErrored({ text, response, page }) {
      console.log('Error!', text, response, page);
    }
  },

  render(h) {
    return h('div', [
      this.$scopedSlots.preview({
        pages: this.pages
      }),
      this.$scopedSlots.document({
        pages: this.pages
      })
    ]);
  }
};
</script>
