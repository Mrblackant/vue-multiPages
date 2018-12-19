<template>
  <div class="ui-sle-box">
    <span v-text="placeholder"></span>
    <ul>
      <li></li>
    </ul>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  .ui-sle-box {

  }
</style>
<script type="text/ecmascript-6">
export default {
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    },
    list: {
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
  },
  methods: {}
}
</script>
