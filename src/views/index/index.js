// let baseUrl="index/index"
// localStorage.setItem('baseUrl',baseUrl)
let baseUrl = "noNeed"
localStorage.setItem('baseUrl', baseUrl)
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './index.vue'

Vue.use(ElementUI);
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
