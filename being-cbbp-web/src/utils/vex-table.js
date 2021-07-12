import Vue from 'vue'
import 'vxe-table/lib/index.css'
import '@/assets/css/vex-table-custom.css'
import { VXETable, Table, Column, Header, Body, Pager, Checkbox, Grid, Loading, Toolbar } from 'vxe-table'
import zhTWLocat from 'vxe-table/lib/locale/lang/zh-TW'

// Vue.use(Icon)
Vue.use(Table)
Vue.use(Column)
Vue.use(Header)
Vue.use(Body)
// Vue.use(Footer)
// Vue.use(Filter)
Vue.use(Loading)
// Vue.use(Tooltip)
Vue.use(Grid)
// Vue.use(Menu)
Vue.use(Toolbar)
Vue.use(Pager)
Vue.use(Checkbox)
// Vue.use(Radio)
// Vue.use(Input)
// Vue.use(Button)
// Vue.use(Modal)
// Vue.use(Edit)
// Vue.use(Export)
// Vue.use(Keyboard)
// Vue.use(Validator)
// Vue.use(Resize)

// 按需加载的方式默认是不带国际化的，需要自行导入
VXETable.setup({
  i18n: (key, value) => VXETable.t(zhTWLocat, key)
})
