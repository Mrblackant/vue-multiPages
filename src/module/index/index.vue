<template>
  <div id="app">
    我是首页
    <br />
      <!-- <el-button>默认按钮</el-button> -->
    <br />
    <a href="./crm.html">CRM系统<span class="red_txt">(一级目录)</span></a>
    <br />
    <br />
    <a href="./crm/lx.html">CRM系统/留学子系统<span class="blue_txt">(二级目录)</span></a>
    <br />
    <br />
    <a href="./crm/lx/seed.html">CRM系统/留学子系统/种子库<span class="pop_txt">(三级目录)</span></a>
    <br />
    <br />
    <a href="./crm/lx/seed/bank.html">CRM系统/留学子系统/种子库/资源库<span class="popo_txt">(四级目录)</span></a>
  </div>
</template>
<script>
export default {
  name: 'app',
  //  页面加载之前
  created() {},
  //  页面加载后
  mounted() {}
}

</script>
<style scoped>
.red_txt{
  color: red;
}
.blue_txt{
  color: blue;
}
.pop_txt{
  color: #00bcd4;
}
.popo_txt{
  color:#ff9800;
}
</style>
