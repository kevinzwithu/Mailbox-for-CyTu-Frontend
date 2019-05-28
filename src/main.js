import Vue from 'vue'
import App from './App.vue'
import lottie from 'vue-lottie';

Vue.component('lottie', lottie)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
