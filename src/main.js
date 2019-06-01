import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import 'animate.css'

axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://api.kevinz.cn:6699';
// axios.defaults.baseURL = 'http://localhost:3000'

axios.interceptors.request.use(config => {
  config.headers = {
    'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
  };
  if (config.method === 'get') {
    config.params = {
      _t: Date.parse(new Date()) / 1000,
      ...config.params
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

Vue.prototype.$axios = axios;
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
