import Vue from 'vue';
Vue.config.productionTip = false
import router from '../src/router'
let baseMounted = localStorage.getItem('baseUrl')
console.log(baseMounted)
var App = resolve => require.ensure([], () => resolve(require("../src/views/" + baseMounted + ".vue")));

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
