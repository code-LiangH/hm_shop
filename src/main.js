import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font_/iconfont.css'   //导入字体图标
import TreeTable from "vue-table-with-tree-grid"


import axios from "axios"
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1"
axios.interceptors.request.use(config => { //请求拦截器，请求时为该请求添加header.Authorization属性，值为“token”，用来辨别
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
Vue.prototype.$http = axios

Vue.component('tree-table',TreeTable)


//关闭生产提示
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
