<template>
  <el-dialog
    title="查看评判标准"
    :visible.sync="judgeFlag"
    class="lx_level_box"
    width="500px">
    <div>
      <el-table
        :data="tableList">
        <el-table-column
          prop="levelName"
          label="合作等级">
        </el-table-column>
        <el-table-column
          prop="consultAward"
          label="顾问奖金">
        </el-table-column>
        <el-table-column
          prop="evaluationFactor"
          label="评判因素">
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer lx_level_footer">
    <el-button @click="judgeFlag = false">取 消</el-button>
    <el-button type="primary" @click="judgeFlag = false">确 定</el-button>
  </span>
  </el-dialog>
</template>
<style lang="scss" rel="stylesheet/scss">
  .lx_level_box {
    .el-dialog__footer {
      text-align: center;
    }
  }
</style>
<script type="text/ecmascript-6">
export default {
  props: {
    tableList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      judgeFlag: false
    }
  },
  methods: {
    showLevel() {
      this.judgeFlag = true
    }
  }
}
</script>
