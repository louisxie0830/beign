import Vue from 'vue';

import InfiniteScroll from './InfiniteScroll';
import DisablePaste from './DisablePaste';
import Scroll from './Scroll';
import Visible from './Visible';

const directives = {
  InfiniteScroll,
  DisablePaste,
  Scroll,
  Visible
};

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]);
});

export default directives;
