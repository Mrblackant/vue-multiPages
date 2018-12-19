// 如果你想用自己创建的实例，在自己单独的js文件里加上：let baseUrl="noNeed" / localStorage.setItem('baseUrl',baseUrl)
let baseMounted = localStorage.getItem('baseUrl')
console.log(baseMounted)

// if (baseMounted === 'noNeed'||baseMounted == null) {
//     // 组件自己创建了实，将不会再引入下边的资源
//     throw new Error("当前组件自己创建了实例,不会引用公用方法、实例");
// }

import Vue from 'vue'
// import 'babel-polyfill'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
// import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import '@/styles/fonts/iconfont.css' // global css
import '@/styles/common.scss'
import '@/filters/filter'

import store from "@/store/index"

if (baseMounted !== 'noNeed' && baseMounted != null) {
  var App = resolve => require.ensure([], () => resolve(require("../src/views/" + baseMounted + ".vue")))
  new Vue({
    el: '#app',
    store,
    template: '<App/>',
    components: {App}
  })
}
localStorage.removeItem('baseUrl')
