import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入axios
import axios from 'axios'
// 导入table插件
import ZkTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(ZkTable)
// 将富文本编辑器注册为全局可用
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
// 配置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 通过 axios 请求拦截器添加token 保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  // 为请求头对象 添加 token 验证的 authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须return config
  return config
})
Vue.prototype.$http = axios

Vue.filter('dateFormat', function (originVal) {
  const date = new Date(originVal)
  const y = date.getFullYear()
  // getMonth() 从 0 开始 需要 +1
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDate() + '').padStart(2, '0')
  const hh = (date.getHours() + '').padStart(2, '0')
  const mm = (date.getMinutes() + '').padStart(2, '0')
  const ss = (date.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
