<template>
  <div class="sel-option">
    <ul>
      <li v-for="item in data" class="sel-option-item" :key="item.code"></li>
    </ul>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">

</style>
<script type="text/ecmascript-6">
export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    label: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    }
  }
}
</script>
