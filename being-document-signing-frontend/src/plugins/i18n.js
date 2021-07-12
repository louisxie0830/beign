import Vue from 'vue';
import VueI18n from 'vue-i18n';

import cn from './../assets/lang/zh-cn.json';
import tw from './../assets/lang/zh-tw.json';

Vue.use(VueI18n);

let locale = (navigator.language || navigator.browserLanguage).toLowerCase();
if (locale !== 'zh-tw' && locale !== 'zh-cn') {
  locale = 'zh-tw';
}

const messages = {
  'zh-cn': cn,
  'zh-tw': tw
};

export default new VueI18n({
  locale,
  fallbackLocale: 'zh-tw',
  messages,
  silentTranslationWarn: false
});
