<template>
  <div id="app">
  </div>
</template>
<script>
export default {
  name: 'app',
  //  页面加载之前
  data() {
    return {}
  },
  mounted() {
//      this.$alert('', '', {
//        confirmButtonText: '知道了',
//        type: 'warning'
//      })
    this.$alert('Session失效并自动认证成功, 请重复当前操作！', '认证成功', {
      confirmButtonText: '知道了',
      type: 'success',
      callback: action => {
        document.domain = 'shinyway.org'
        let con401 = window.parent.document.getElementById("con401")
        if (!con401) {
          con401 = window.document.getElementById("con401")
        }
        if (con401) {
          con401.style.display = "none"
        }
      }
    });
  }
}
</script>