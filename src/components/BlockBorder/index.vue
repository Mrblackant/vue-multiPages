<template>
  <div :class="hasClass ? 'lx_block_border' : ''">
    <slot name="title"></slot>
    <div :class="hasClass ? 'lx_block_container' : ''">
      <slot name="container"></slot>
    </div>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
</style>
<script type="text/ecmascript-6">
export default {
  props: {
    hasClass: {
      type: Boolean,
      default() {
        return true
      }
    }
  }
}
</script>
