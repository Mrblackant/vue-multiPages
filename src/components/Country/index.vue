<template>
  <div class="lx_country_box" :class="overClass" ref="box" id="country_box">
    <div class="lx_flex">
      <el-input v-if="showTxt" @focus="showDialog" ref="inputText" :readonly="true"
                :disabled="inputDisabled"
                :placeholder="placeholder"
                class="width100"
                v-model="inputVal"></el-input>
      <el-button v-else :class="btnClass" @click="showDialog">{{text}}</el-button>
      <!--<span  class="lx_selted_c">{{inputVal}}</span>-->
      <el-input v-if="!showTxt" :readonly="true" v-model="inputVal" class="width100 lx_country_txtinput"
                disabled></el-input>
    </div>
    <!--</slot>-->
    <el-dialog
      :visible.sync="dialogVis"
      center class="lx_dialog lx_init_dialog"
      :width="widths"
      :append-to-body="isInBody">
      <div class="lx_dialog_title" slot="title">
        <h2>{{title}}</h2>
      </div>
      <div class="lx_dialog_main">
        <!--显示多选-->
        <div class="lx_more" v-if="more">
          <fieldset v-for="(v, k, index) in countryData">
            <legend>{{k}}
              <el-checkbox :label="k" v-model="itemChkAll[k]" class="lx_country_padding" @change="handleCheckAllChange(k, v)">全选
              </el-checkbox>
            </legend>
            <el-checkbox-group v-model="itemChkList[k]" @change="handleCheckedChange(k, itemChkList[k])">
              <el-checkbox class="lx_country_mult" border v-for="item in v" :label="item" :key="item.code">
                {{item.nameCn}}
              </el-checkbox>
            </el-checkbox-group>
          </fieldset>
        </div>
        <!--显示单选-->
        <div class="lx_one" v-else>
          <div style="margin-bottom: 10px;">
            <el-button border @click="clearRadio" v-if="isCancelCheck">取消选中</el-button>
          </div>
          <el-radio-group v-model="radioOne">
            <fieldset v-for="(v, k, index) in countryData">
              <legend>{{k}}</legend>
              <el-radio class="lx_country_single" border v-for="item in v" :label="item"
                        :key="item.code">
                {{item.nameCn}}
              </el-radio>
            </fieldset>
          </el-radio-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCountry" round size="mini">确 定</el-button>
        <el-button @click="hideDialog" round size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  // 弹出窗样式覆盖ele-ui
  .lx_init_dialog {
    .el-dialog {
      border-radius: 5px;
      border: 1px solid #e4e7ed;
      .el-dialog__header {
        padding: 0;
      }
      .el-dialog__body {
        padding: 25px 0 25px 25px;
        .lx_dialog_mr10 {
          padding-right: 25px;
        }
        .lx_dialog_tip {
          color: #2196f3;
          font-size: 16px;
          font-family: "Microsoft YaHei";
          font-weight: 500;
        }
      }
      .el-checkbox.is-bordered + .el-checkbox.is-bordered, .el-radio.is-bordered {
        margin-left: 0;
      }
      .lx_one {
        height: 400px;
        overflow-y: auto;
      }
      .el-checkbox, .el-radio {
        margin-right: 10px;
        margin-bottom: 10px;
        width: 154px;
        text-align: center;
      }
    }
  }

  fieldset .lx_country_padding lable {
    margin-right: 2px;
    margin-left: 2px;
    padding-left: 2px;
  }

  .lx_country_box {
    .lx_dialog {
      .el-dialog {
        border-radius: 5px;
        border: 1px solid #e4e7ed;
        .el-dialog__header {
          padding: 0;
        }
        .el-dialog__body {
          padding: 25px 0 25px 25px;
          .lx_dialog_mr10 {
            padding-right: 25px;
          }
          .lx_dialog_tip {
            color: #2196f3;
            font-size: 16px;
            font-family: "Microsoft YaHei";
            font-weight: 500;
          }
        }
        .el-checkbox.is-bordered + .el-checkbox.is-bordered, .el-radio.is-bordered {
          margin-left: 0;
        }
        .el-checkbox, .el-radio {
          margin-right: 10px;
          margin-bottom: 10px;
          width: 154px;
          text-align: center;
        }
      }
    }

    .lx_flex {
      display: flex;
      width: 100%;
    }

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

    .lx_dialog_main {
      overflow-y: auto;
      height: 400px;
    }

    .lx_selted_c {
      margin-left: 10px;
      display: block;
      line-height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .lx_country_txtinput.el-input {
      .el-input__inner {
        border-color: #fff !important;
        cursor: default !important;
        overflow: hidden; /*溢出隐藏*/
        text-overflow: ellipsis; /*以省略号...显示*/
        white-space: nowrap;

      }
    }
    .lx_country_txtinput.el-input.is-disabled {
      .el-input__inner {
        background-color: #fff !important;
        color: #909399;
      }
    }

  }

  fieldset {
    border: 1px solid #e4e7ed;
    margin-top: 18px;
    padding-top: 10px;
    padding-left: 12px;
    min-width: 500px;
  }

  legend {
    font: bold 14px Arial, Helvetica, sans-serif;
    color: #606266;
    background-color: #FFFFFF;
  }
</style>
<script type="text/ecmascript-6">
export default {
  props: {
    overClass: {
      type: String,
      default: ''
    },
    // 输入框默认文字
    placeholder: {
      type: String,
      default: '请输入'
    },
    // 弹出窗标题
    title: {
      type: String,
      default: '标题'
    },
    // 弹出窗宽度
    width: {
      type: Number,
      default: 565
    },
    // 数据
    data: {
      type: Array,
      default: []
    },
    // 显示多选还是单选
    more: {
      type: Boolean,
      default: true
    },
    // 按钮文字
    text: {
      type: String,
      default: '请选择'
    },
    // 按钮样式
    btnClass: {
      type: String,
      default: 'lx_comp_btn'
    },
    // 显示按钮还是input
    showTxt: {
      type: Boolean,
      default: true
    },
    // input 值绑定
    inputVal: {
      type: String,
      default: ''
    },
    // 禁用输入框
    inputDisabled: {
      type: Boolean,
      default: false
    },
    // 是否嵌套弹出
    isInBody: {
      type: Boolean,
      default: false
    },
    // 取消选中
    isCancelCheck: {
      type: Boolean,
      default: true
    },
    // 父组件传递的值
    parentVal: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    // 计算dialog 的宽度
    widths() {
      return this.width + 'px'
    }
  },
  data() {
    return {
      dialogVis: false,
      checkList: this.parentVal,
      radioOne: {},
      chkAll: false,
      itemChkAll: {},
      itemChkList: {},
      countryData: {}
    }
  },
  mounted() {
    this._initData()
  },
  methods: {
    _initData() {
      setTimeout(() => {
        if (this.parentVal) {
          if (this.more) {
            this.checkList = []
            this.parentVal.map(item => {
              this.checkList.push(item)
            })
          } else {
            this.radioOne = this.parentVal[0]
          }
        }
        this.countryData = {}
        if (this.data) {
          let list = this.data
          for (var i = 0; i < list.length; i++) {
            if (!list[i].regionCode) {
              list[i].regionCode = ""
            }
            if (!this.countryData[list[i].regionCode]) {
              this.$set(this.itemChkAll, list[i].regionCode, false)
              this.$set(this.itemChkList, list[i].regionCode, [])
              this.checkList.forEach(item => {
                if (item.regionCode === list[i].regionCode) {
                  this.itemChkList[list[i].regionCode].push(item)
                }
              })
              this.countryData[list[i].regionCode] = []
            }
            this.countryData[list[i].regionCode].push(list[i]);
          }
          Object.keys(this.itemChkList).forEach(key => {

            if (this.itemChkList[key].length < this.countryData[key].length) {
              this.itemChkAll[key] = false
            } else {
              this.itemChkAll[key] = true
            }
          })
        }
      }, 500)
    },
    // 选择内容派发到父组件，值为Array 类型
    handleCountry() {
      this.dialogVis = false
      let data = []
      if (this.more) {
        data = this.checkList
      } else {
        data.push(this.radioOne)
      }
      this.$emit('country', {data: data, more: this.more})
    },
    // 显示弹出窗
    showDialog() {
      this.dialogVis = true
    },
    clearRadio() {
      this.radioOne = {}
    },
    // 隐藏弹出窗
    hideDialog() {
      // console.log(this.parentVal)
      if (!this.more) {
        this.radioOne = this.parentVal[0]
      } else {
        this.checkList = []
        this.parentVal.map(item => {
          this.checkList.push(item)
        })
        if (this.parentVal.length < this.data.length) {
          this.chkAll = false
        } else {
          this.chkAll = true
        }
      }
      this.dialogVis = false
    },
    // 全选
    handleCheckAllChange(k, data) {
      let bol = this.itemChkAll[k]
      this.itemChkList[k] = bol ? data : []
      this.checkList = []
      Object.keys(this.itemChkList).forEach(key => {
        if (this.itemChkList[key]) {
          this.checkList.push(...this.itemChkList[key])
        }
      })
    },
    handleCheckedChange(k, value) {
      if (value && value.length < this.countryData[k].length) {
        this.itemChkAll[k] = false
      } else {
        this.itemChkAll[k] = true
      }
      this.checkList = []
      Object.keys(this.itemChkList).forEach(key => {
        if (this.itemChkList[key]) {
          this.checkList.push(...this.itemChkList[key])
        }
      })
    }
  },
  watch: {
//      checkList: {  // 这监听对象值的改变 和上面的不一样。
//        handler(curVal,oldVal){
//          if(curVal){
//            let a = {}
//            value.forEach(item =>{
//              a[item.code] = 1
//            })
//            this.data.forEach(item =>{
//              if(a[item.code] !== 1){
//                this.itemChkAll[item.regionCode] = false
//              }
//            })
//          }
//        },
//        deep: true,
//      },
    // parentVal(newVal, oldVal) {
    //   if (oldVal) {
    //     if (!this.more) {
    //       this.radioOne = oldVal[0]
    //     } else {
    //       oldVal.map(item => {
    //         this.checkList = []
    //         this.checkList.push(item)
    //       })
    //     }
    //   }
    // }
  }
}
</script>
