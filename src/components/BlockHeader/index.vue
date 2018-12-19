<template>
  <div class="lx_block_header">
    <slot name="overwrite-title">
      <h2 class="lx_block_bg">{{title}}</h2>
      <slot name="annot"></slot>
    </slot>
    <slot name="right"></slot>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  .process-bt-right {
    width: 100%;
    float: right;
    margin-right: 10px;
  }

  .lx_block_header {
    position: relative;
    display: flex;
    align-items: center;
    padding: 10px 0 0;
  }

  .lx_block_bg {
    background-color: #26c6da;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    color: #fff;
    display: inline-block;
    padding: 0 18px 0 26px;
    height: 32px;
    line-height: 32px;
    font-weight: 500;
    font-size: 16px;
  }
</style>
<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: '基本信息'
    }
  }
}
</script>
