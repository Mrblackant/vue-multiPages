<template>
  <div class="lx_subject_box" :class="categoryCla" ref="subject">
    <el-button :size="buttonSize" class="lx_btn_maxwidth" @click="changedVal" :title="values">{{values}}</el-button>
    <el-dialog
      :visible.sync="dialogVis"
      center class="lx_dialog lx_type_dialog"
      :width="widths"
      :append-to-body="isInBody">
      <div class="lx_dialog_title" slot="title">
        <h2>{{title}}</h2>
      </div>
      <div class="lx_dialog_main">
        <el-checkbox-group v-model="checkList" :disabled="isEnable">
          <div v-for="(v, k, index) in colTypes" class="lx_col_type_split">
            <el-checkbox class="lx_mult_chk" border v-for="item in v" v-if="item && item.code" :label="item.name" :value="item.code"
                         :key="item.code">{{item.name}}
            </el-checkbox>
            <br/>
          </div>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changedVal" round size="mini" :disabled="isEnable">确 定</el-button>
        <el-button @click="hideDialog" round size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  .lx_type_dialog {
    .lx_dialog_title {
      position: relative;
      height: 56px;
      line-height: 56px;
      padding-left: 24px;
      left: 0;
      color: #1e88e5;
      text-align: left;
      border-bottom: 2px solid #e4e7ed;
      h2 {
        font-size: 16px;
        font-weight: 500;
        margin: 0;
      }
    }
    .lx_col_type_split {
      margin-bottom: 20px
    }
    .lx_dialog_main {
      overflow-y: auto;
      height: 450px;
      .lx_mult_chk {
        width: 156px;
        height: 36px;
        margin-right: 18px;
        margin-bottom: 15px;
      }
    }
  }

  .lx_subject_box {
    .lx_btn_maxwidth {
      span {
        display: block;
        width: 87px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
<script type="text/ecmascript-6">
export default {
  props: {
    // 国家是否为空
    isCountry: {
      type: Boolean,
      default: true
    },
    // 弹出窗宽度
    width: {
      type: Number,
      default: 540
    },
    // 弹出窗标题
    title: {
      type: String,
      default: '标题'
    },
    // 是否嵌套弹出
    isInBody: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: []
    },
    values: { // 显示的值
      type: String,
      default: '请选择'
    },
    buttonSize: { // 按钮大小 medium、small、mini
      type: String,
      default: ''
    },
    isEnable: { // 是否禁用
      type: Boolean,
      default: false
    },
    categoryCla: {
      type: String,
      default: ''
    },
    parentVal: {
      type: Array,
      default: []
    },
    isUniq: {
      type: Boolean,
      default: false
    }
    // uniqList: {
    //   type: Array,
    //   default: []
    // }
  },
  data() {
    return {
      dialogVis: false,
      checkList: this.parentVal, // 选中内容
      colTypes: {}
    }
  },
//		mounted() {
//			this._initList()
//		},
  methods: {
    _initList() {
      setTimeout(() => { // 500 毫秒延迟是为了保证父组件 parentVal 的值能传递进来
        this.checkList = []
        this.parentVal.map((item) => {
          this.checkList.push(item)
        })
        //初始化院校类型
        this.colTypes = {}
        let list = this.dataList
        for (var i = 0; i < list.length; i++) {
          if (!list[i].dictType) {
            list[i].dictType = "1"
          }
          if (!this.colTypes[list[i].dictType]) {
            this.colTypes[list[i].dictType] = []
          }
          this.colTypes[list[i].dictType].push(list[i]);
        }
      }, 200)
    },
    // 修改值emit到父组件并关闭当前弹出窗
    changedVal() {
      this.showDialog()
      this._initList()
      if (this.checkList.length === 0) { // 判断选中内容是否为空
        return
      } else {
        let data = this.checkList.slice().join(',')
        this.$emit('update:values', data)
        // this.$emit('sent')
      }
    },
    // 弹出窗toggle
    showDialog() {
      if (!this.isCountry) {
        this.$emit('country', this.isCountry)
      } else {
        this.dialogVis = !this.dialogVis
        this.$emit('sendpost')
      }
    },
    // 隐藏弹出窗
    hideDialog() {
      this._initList()
      this.dialogVis = !this.dialogVis
    }
  },
  computed: {
    // 计算dialog 的宽度
    widths() {
      return this.width + 'px'
    }
  },
  watch: {
    values(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.checkList = []
      }
    },
    dataList: {
      handler(newValue, oldValue) {
        // 初始化留学类别
        let list = newValue

      },
      deep: true
    }
  }
}
</script>
