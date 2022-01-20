import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入axios
import axios from 'axios'

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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
