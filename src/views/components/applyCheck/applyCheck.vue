<template>
  <div>
    <div class="lx_btn_right">
      <el-button @click="check1">审批进度</el-button>
      <el-button @click="check2">审批意见</el-button>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="judgeFlag"
      class="lx_level_box"
      width="1200px">
      <div>
        <iframe style="border:0" width="100%" height="500px"
                :src="url"></iframe>
      </div>
      <div slot="footer" class="dialog-footer lx_level_footer">
        <el-button @click="judgeFlag = false">关 闭</el-button>
        <!--<el-button type="primary" @click="judgeFlag = false">确 定</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  .lx_btn_right {
    text-align: right;
  }
</style>
<script type="text/ecmascript-6">
import global_ from '@/Global'
import {getWorkFlowURI} from '@/api/dict'
import {ERR_OK} from '@/utils/status'

export default {
  props: {
    processKey: {
      type: String,
      default: ''
    },
    applyID: {
      type: String,
      default: ''
    },
    URI: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      judgeFlag: false,
      url: '',
      title: '',
      ApproveUrl: null
    }
  },
  mounted() {
    this._initApplpveUrl()
  },
  methods: {
    _initApplpveUrl() {
      getWorkFlowURI().then((res) => {
        if (res.status === ERR_OK) {
          this.ApproveUrl = res.data
          sessionStorage.setItem('LXURI', res.data)
        }
      })
    },
    check1() {
      this.judgeFlag = true
      this.title = '查看审批进度'
      if (this.ApproveUrl) {
        this.url = this.ApproveUrl + `/process.html?businessKey=${this.applyID}&processDefinitionKey=${this.processKey}`
      }
    },
    check2() {
      this.judgeFlag = true
      this.title = '查看审批意见'
      if (this.ApproveUrl) {
        this.url = this.ApproveUrl + `/comment.html?businessKey=${this.applyID}&processDefinitionKey=${this.processKey}`
      }
    }
  }
}
</script>
