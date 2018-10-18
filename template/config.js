import Vue from 'vue';
let baseMounted = localStorage.getItem('baseUrl')
console.log(baseMounted)
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 如果你想用自己创建的实例，在自己单独的js文件里加上：let baseUrl="noNeed" / localStorage.setItem('baseUrl',baseUrl)
if (baseMounted !== 'noNeed') {
  var App = resolve => require.ensure([], () => resolve(require("../src/views/" + baseMounted + ".vue")));
  new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
  })
}