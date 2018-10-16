import Vue from 'vue';
Vue.config.productionTip = false

let baseMounted = localStorage.getItem('baseUrl')
console.log(baseMounted)
var App = resolve => require.ensure([], () => resolve(require("../src/module/" + baseMounted + ".vue")));


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
