import { mutations } from './../store/type';
import $store from './../store';
class ApplyLoading {
  constructor() {
    this.timer = null;
    this.notShowLoadList = [
      '/ding/config',
      '/letter/list',
      '/contact/list',
      '/letter/upload',
      '/tag/list',
      '/letter/status',
      '/signing/corps'
    ];
  }
  isShowLoading(url) {
    return this.notShowLoadList.findIndex(r => url.includes(r)) <= -1;
  }
  show() {
    this.throttle(true);
  }
  hide() {
    this.throttle(false);
  }
  throttle(status) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      $store.commit(mutations.UPDATE_LOAD_STATUS, status);
    }, 100);
  }
}

export default new ApplyLoading();
