<template>
  <div class="scrolling-document"
       v-scroll.immediate="updateScrollBounds">
    <ScrollingPage v-for="(page, i) in pages"
                   :key="page.pageNumber"
                   v-show="pages"
                   v-bind="{page, clientHeight, scrollTop, focusedPage, enablePageJump}"
                   v-slot="{isPageFocused, isElementFocused}"
                   @page-jump="onPageJump">
      <div class="scrolling-page" :id="`scrolling-page-${i+1}`">
        <span :id="`secret-input-${i+1}`" style="visibility: hidden;" />
        <slot v-bind="{page, isPageFocused, isElementFocused}"></slot>
      </div>
    </ScrollingPage>

    <div v-visible="fetchPages"
         class="observer"></div>
  </div>
</template>

<script>
import ScrollingPage from './ScrollingPage';

export default {
  components: {
    ScrollingPage
  },

  props: {
    pages: {
      required: true
    },
    enablePageJump: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      default: 1
    },
    isParentVisible: {
      default: true
    },
    pageCount: {
      type: Number,
      defaulut: 0
    }
  },

  data() {
    return {
      focusedPage: undefined,
      scrollTop: 0,
      clientHeight: 0
    };
  },

  computed: {
    pagesLength() {
      return this.pages.length;
    }
  },

  watch: {
    isParentVisible: 'updateScrollBounds',

    pagesLength(count, oldCount) {
      if (oldCount === 0) this.$emit('pages-reset');

      // Set focusedPage after new pages are mounted
      this.$nextTick(() => {
        this.focusedPage = this.currentPage;
      });
    },

    currentPage(currentPage) {
      if (currentPage > this.pages.length) {
        this.fetchPages(currentPage);
      } else {
        this.focusedPage = currentPage;
      }
    }
  },
  created() {
    console.log('scrollng document hello');
  },

  methods: {
    fetchPages(currentPage) {
      this.$emit('pages-fetch', currentPage);
    },

    onPageJump(scrollTop) {
      this.$emit('page-jump', scrollTop);
    },

    updateScrollBounds() {
      const { scrollTop, clientHeight } = this.$el;

      this.scrollTop = scrollTop;
      this.clientHeight = clientHeight;
    }
  }
};
</script>
