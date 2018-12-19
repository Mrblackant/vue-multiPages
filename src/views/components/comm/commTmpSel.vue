<template>
  <el-row>
    <el-form-item>
      <div class="lx_flex_broke">
        <el-radio v-model="commtmp" label="STANDARD" @change="changeTmp" border class="lx_brotmp_radio">
          佣金模板（可自动计算）
          <el-select v-model="commsel" size="mini" placeholder="请选择"
                     @change="changeType"
                     class="lx_brotmp_sel">
            <el-option v-for="item in mouldsList" :label="item.name" :value="item.code"
                       :key="item.code"></el-option>
          </el-select>
        </el-radio>
        <el-radio v-model="commtmp" label="NONSTANDARD" @change="changeTmp" border class="lx_brotmp_radio">
          非标准模板（人工计算佣金）
        </el-radio>
      </div>
    </el-form-item>
  </el-row>
</template>
<style lang="scss" rel="stylesheet/scss">

</style>
<script type="text/ecmascript-6">
export default {
  props: {
    mouldsList: { // 类型
      type: Array,
      default: []
    },
    commTmp: { // 模板类型
      type: String,
      default: 'STANDARD'
    },
    commSel: { // 标准模板类别
      type: String,
      default: 'FIXED'
    }
  },
  data() {
    return {
      commsel: this.commSel,
      commtmp: this.commTmp
    }
  },
  methods: {
    changeType() {
      this.$emit('update:commSel', this.commsel)
    },
    changeTmp() {
      this.$emit('update:commTmp', this.commtmp)
    }
  },
  watch: {
    commSel(newVal, oldVal) {
      // console.log('commsel:' + newVal + ',old:' + oldVal)
      if (newVal) {
        this.commsel = newVal
      }
    },
    commTmp(newVal, oldal) {
      // console.log('commtmp:' + newVal + ',old:' + oldal)
      if (newVal) {
        this.commtmp = newVal
      }
    }
  }
}
</script>
