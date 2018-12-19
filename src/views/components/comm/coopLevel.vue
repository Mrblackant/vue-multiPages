<template>
  <el-row>
    <el-form-item label="本次合作等级" class="lx_level_main">
      <span class="lx_level_dialog" @click="showJudge">查看等级评判标准</span>
      <el-select v-model="form.level" @change="selChange" placeholder="请选择">
        <el-option v-for="item in levelList" :label="item.name" :value="item.code" :key="item.code"></el-option>
      </el-select>
      <span v-if="isRenews">&nbsp;&nbsp;原合作等级：{{ levalTemp[renewString] }}</span>
    </el-form-item>
    <level-dialog ref="leveldialog" :table-list="levelTable"></level-dialog>
  </el-row>
</template>
<style lang="scss" rel="stylesheet/scss">
  .lx_level_main {
    position: relative;
    .el-form-item__label {
      line-height: 22px;
    }
  }

  .lx_level_dialog {
    position: absolute;
    left: -110px;
    top: 8px;
    color: #2196f3;
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
<script type="text/ecmascript-6">
import LevelDialog from '../levelDialog/levelDialog'
import {ERR_OK} from '@/utils/status.js'
import {getLevelTable} from '@/api/dict'

export default {
  props: {
    levelList: {
      type: Array,
      default: []
    },
    levelItem: {
      type: String,
      default: ''
    },
    isRenews: { // 是否续签
      type: Boolean,
      default: false
    },
    renewString: { // 原合作等级
      type: String,
      default: ''
    },
    levelTable: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      form: {
        level: ''
      },
      levelTableList: [],
      levalTemp: {}
    }
  },
  mounted(){
    let that = this
    setTimeout(() => {
      // 获取等级
      getLevelTable().then(res => {
        if (res.status === ERR_OK) {
          this.levelTableList = res.data
          for (let l of that.levelTableList) {
            that.levalTemp[l.levelCode] = l.levelName
          }
        }
      })
    }, 17)
  },
  methods: {
    selChange() {
      this.$emit('level', this.form.level)
    },
    // 查看评判标准
    showJudge() {
      // this.judgeFlag = true
      this.$refs.leveldialog.showLevel()
    }
  },
  watch: {
    levelItem(newVal, oldVal) {
      // console.log(`newVal:${newVal},oldVal:${oldVal}`)
      this.form.level = newVal
    }
  },
  components: {
    LevelDialog
  }
}
</script>
