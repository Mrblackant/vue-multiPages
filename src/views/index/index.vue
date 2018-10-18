<template>
  <div id="app">
    <header>
      <ul>
        <li>
          <a href="#/dashboard" class="collapsible-header waves-effect waves-teal menu-item">待办</a>
        </li>
        <li v-for="item in routes" v-if="!item.hidden">
          <a :href="'#/' + item.name" >{{item.meta.title}}</a>
          <ul v-if="item.children">
            <li v-for="i in item.children" v-if="!i.hidden">
              <a :href="'#/' + i.name">{{i.meta.title}}</a>
            </li>
          </ul>
        </li>
      </ul>
    </header>
    <main>
      <router-view></router-view>
    </main>
<!--   <main-fun v-show="false" @returnBack="returnBack"></main-fun>-->
  </div>
</template>

<script>
    // import {getRouter} from '../../api/dict'
//  import mainFun from './components/Main'
export default {
  name: 'app',
  //  页面加载之前
    data(){
      return{
          routes:[]
      }
    },
  created() {
  },
    methods:{
//        returnBack(data){
//           console.log(data)
//            this.routes = data
//        }
        _initData(){
            getRouter().then(res => {
                if (res.status === 1) {
                    this.routes = res.data
                }
            })
        }
    },
    components:{
//        mainFun
    }
    ,
  //  页面加载后
  mounted() {
    //注册菜单和侧边栏分级事件
//    $(".button-collapse").sideNav();
//    $('.collapsible').collapsible();
//
//    //菜单列表点击隐藏
//    $('.menu-item').click(function () {
//      $('#menu-list').sideNav('hide');
//    })
      // this._initData()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  #app {
  }
  header{ float:left;width:15%; height: 100%}
  main{ float:left;width:85%; height: 100%; min-height: 768px}
  body{
    min-height: 768px;
  }
  @media screen and (max-width: 300px) {
    body{
      min-height: 300px;
    }
  }
  @media screen and (max-width: 1000px) {
    body{
      min-height: 768px;
    }
  }

  .menu-wrapper {
    .el-menu-item{
      &.is-active,&:hover{background-color:#26c6da;
                 color: #fff;
                 border-radius: 5px;}
    }
  }


</style>
