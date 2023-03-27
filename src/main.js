import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
// import axios from 'axios' //引入路由
import api from '@/http'
import mavonEditor from 'mavon-editor'

import "element-ui/lib/theme-chalk/index.css"
import 'mavon-editor/dist/css/index.css'

import "./axios"
import "./permission"

Vue.config.productionTip = false
// Vue.prototype.$axios = axios

Vue.use(api)
Vue.use(ElementUI)
Vue.use(mavonEditor)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

