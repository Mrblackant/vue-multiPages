<template>
  <div class="ui-sub-title-header">
    <i class="ui-icon" :class="fileIcon" v-show="iconShow"></i>
    <slot name="overwrite-title">
      <h2 class="title">{{title}}</h2>
    </slot>
    <slot name="right"></slot>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  .ui-sub-title-header {
    position: relative;
    height: 90px;
    .title {
      font-size: 20px;
      color: #2196f3;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 90px;
      margin: 0;
    }
  }
</style>
<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    icon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      iconShow: false
    }
  },
  computed: {
    fileIcon() {
      if (this.icon === null || this.icon === 'undefined') {
        this.iconShow = false
      } else {
        this.iconShow = true
        // console.log(this.icon)
        return this.icon
      }
    }
  }
}
</script>
