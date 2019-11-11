// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 导入 element-ui
import ElementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
Vue.use(ElementUI)

// 导入字体图标
import "../node_modules/font-awesome/css/font-awesome.css"

import base from './base'
Vue.use(base)

// 引入 store
import store from './store/store'

// 引入axios
import axios from 'axios'


// 引入 vue-lazyload
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload,{
  preLoad: 1.3,
  error:'/static/image/error.jpg',
  loading:'/static/image/loading.gif',
  attempt: 1
})
// 响应状态码拦截
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if(error.response.status === 404) {
      console.log(error);
      
    }
  }
)

// 引入自定义指令
import Highlight from './highlight'
Vue.use(Highlight)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
