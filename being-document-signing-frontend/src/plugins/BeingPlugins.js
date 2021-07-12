import i18n from './i18n';
import store from './../store';
import { mergeOptions } from './pluginHelper.js';

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

import ToastComponent from './components/Toast.vue';
export const ToastPlugin = (() => {
  let $vm;
  return {
    install(vue, options = {}) {
      const Toast = vue.extend(ToastComponent);

      if (!$vm) {
        $vm = new Toast({
          el: document.createElement('div'),
          propsData: {
            title: ''
          }
        });
        document.body.appendChild($vm.$el);
      }

      const toast = {
        show(options) {
          if (typeof options === 'object') {
            mergeOptions($vm, options);
          }
          this.$watcher && this.$watcher();
          this.$watcher = $vm.$watch('showValue', val => {
            if (!val && options) {
              $vm.showValue = false;
            }
          });

          $vm.$off('on-hide');

          $vm.$on('on-hide', () => {
            options && isFunction(options.onHide) && options.onHide && options.onHide();
          });

          $vm.showValue = true;
        },
        hide() {
          $vm.showValue = false;
        }
      };

      vue['toast'] = toast;

      vue.mixin({
        created() {
          this.toast = vue.toast;
        }
      });
    }
  };
})();

import AlertComponent from './components/Alert.vue';
export const AlertPlugin = (() => {
  let $vm;
  return {
    install(vue, options = {}) {
      const Alert = vue.extend(AlertComponent);

      if (!$vm) {
        $vm = new Alert({
          el: document.createElement('div'),
          propsData: {
            title: ''
          }
        });
        document.body.appendChild($vm.$el);
      }

      const alert = {
        show(options) {
          if (typeof options === 'object') {
            mergeOptions($vm, options);
          }
          this.$watcher && this.$watcher();
          this.$watcher = $vm.$watch('showValue', val => {
            if (!val && options) {
              $vm.showValue = false;
            }
          });
          $vm.showValue = true;
        },
        hide() {
          $vm.showValue = false;
        }
      };

      vue['alert'] = alert;

      vue.mixin({
        created() {
          this.alert = vue.alert;
        }
      });
    }
  };
})();

import DatePickerComponent from './components/DatePicker.vue';
export const DatePickerPlugin = (() => {
  let $vm;
  return {
    install(vue, options = {}) {
      vue.t = i18n.t.bind(i18n);
      vue.prototype.$t = vue.t;
      const DatePicker = vue.extend(DatePickerComponent);

      if (!$vm) {
        $vm = new DatePicker({
          el: document.createElement('div'),
          propsData: {}
        });
        document.body.appendChild($vm.$el);
      }

      const datePicker = {
        show(options) {
          if (typeof options === 'object') {
            mergeOptions($vm, options);
          }
          this.$watcher && this.$watcher();
          this.$watcher = $vm.$watch('showValue', val => {
            if (!val && options) {
              $vm.showValue = false;
            }
          });

          $vm.$off('on-cancel');
          $vm.$off('on-confirm');

          $vm.$on('on-cancel', () => {
            options && options.onCancel && options.onCancel();
          });
          $vm.$on('on-confirm', date => {
            options && options.onConfirm && options.onConfirm(date);
          });

          $vm.showValue = true;
        },
        hide() {
          $vm.showValue = false;
        }
      };

      vue['datePicker'] = datePicker;

      vue.mixin({
        created() {
          this.datePicker = vue.datePicker;
        }
      });
    }
  };
})();

import ModalComponent from './components/Modal.vue';
export const ModalPlugin = (() => {
  let $vm;
  return {
    install(vue, options = {}) {
      vue.t = i18n.t.bind(i18n);
      vue.prototype.$t = vue.t;
      vue.prototype.$store = store;
      const Modal = vue.extend(ModalComponent);

      if (!$vm) {
        $vm = new Modal({
          el: document.createElement('div'),
          propsData: {}
        });
        document.body.appendChild($vm.$el);
      }

      const modal = {
        show(options) {
          if (typeof options === 'object') {
            mergeOptions($vm, options);
          }
          this.$watcher && this.$watcher();
          this.$watcher = $vm.$watch('showValue', val => {
            if (!val && options) {
              $vm.showValue = false;
            }
          });

          $vm.$off('on-cancel');
          $vm.$off('on-confirm');

          $vm.$on('on-cancel', data => {
            options && options.onCancel && options.onCancel(data);
          });
          $vm.$on('on-confirm', data => {
            options && options.onConfirm && options.onConfirm(data);
          });

          $vm.showValue = true;
        },
        hide() {
          $vm.showValue = false;
        }
      };
      vue['modal'] = modal;

      vue.mixin({
        created() {
          this.modal = vue.modal;
        }
      });
    }
  };
})();

import DateRangePickerComponent from './components/DatePickerRange.vue';
export const DateRangePickerPlugin = {
  install(Vue) {
    Vue.component('DatePickerRange', DateRangePickerComponent);
  }
};

import DingTalk from './DingTalk';
export const DingTalkPlugin = {
  install(Vue) {
    Vue._dingTalk = DingTalk;
    window._dingTalk = DingTalk;
    Object.defineProperties(Vue.prototype, {
      _dingTalk: {
        get() {
          return DingTalk;
        }
      },
      $dingTalk: {
        get() {
          return DingTalk;
        }
      }
    });
  }
};

import Bus from './EventBus';
export const BusPlugin = Bus;

export default {
  ToastPlugin,
  AlertPlugin,
  DatePickerPlugin,
  ModalPlugin,
  DateRangePickerPlugin,
  DingTalkPlugin,
  BusPlugin
};
