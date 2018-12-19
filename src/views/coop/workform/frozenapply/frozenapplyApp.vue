<template>
  <div class="lx_main">
    <sub-header :title="workTitle" icon="xinzengliuxueyuanxiao"></sub-header>
    <block-border>
      <block-header slot="title" title="报审信息"></block-header>
      <div slot="container" class="lx_container">
        <el-row class="lx_row_txt">
          <el-col :span="5"><span>报审人：{{schoolData.applyUserName}}</span></el-col>
          <el-col :span="12">
            <span>报审部门：{{schoolData.applyDept}}</span>
          </el-col>
          <el-col :span="5">
            <span>报审时间：{{schoolData.applyDate | formatTime}}</span>
          </el-col>
        </el-row>
      </div>
    </block-border>
    <block-border>
      <block-header slot="title" title="基本信息"></block-header>
      <div slot="container" class="lx_partner_box">
        <div class="lx_appreve_info">
          <el-row class="lx_row_txt">
            <el-col :span="8"><span>院校/机构：{{form.orgName}}</span></el-col>
            <el-col :span="8"><span>{{workText}}的合作项目：{{form.projName}}</span></el-col>
          </el-row>
        </div>
        <h3>【院校】</h3>
        <el-table :data="tableData" header-row-class-name="lx_table_hd">
          <el-table-column label="国家" prop="countryName"></el-table-column>
          <el-table-column label="院校外国名" prop="colNameEn"></el-table-column>
          <el-table-column label="院校中文名" prop="colNameCn"></el-table-column>
          <el-table-column label="院校类型" prop="colType"></el-table-column>
          <el-table-column label="院校性质" prop="colProperty" :formatter="_formatCol"></el-table-column>
        </el-table>
      </div>
    </block-border>
    <block-border>
      <block-header slot="title" title="申请原因"></block-header>
      <div class="lx_apply_info" slot="container">
        <h4>{{showTxt}}:</h4>
        <p class="lx_show_reson">{{schoolData.memo}}</p>
        <div class="lx_reson_info_tool">
          <span>申请人：{{schoolData.applyUserName}}</span><span>申请时间：{{schoolData.applyDate | formatTime}}</span>
        </div>
      </div>
    </block-border>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  #app {
    width: 100%;
    min-width: auto;
  }

  .lx_partner_box {
    margin-top: -30px;
    h3 {
      color: #2196f3;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .lx_appreve_info {
    border-bottom: 1px solid #B5BFC6;
    padding: 25px 0;
  }

  .lx_item_long {
    label.el-form-item__label {
      line-height: 24px;
      font-size: 16px;
      padding-right: 20px;
    }
  }

  .lx_show_reson {
    padding-top: 15px;
    font-size: 14px;
    color: #606266;
    /*text-indent: 2em;*/
    line-height: 1.8;
    letter-spacing: 1px;
    margin: 0;
    font-family: "Microsoft YaHei";
  }

  .lx_apply_info {
    margin: 0 20px;
    h4 {
      color: #f56c6c;
      margin: 0;
      font-weight: 500;
    }
  }

  .lx_reson_info_tool {
    display: flex;
    justify-content: flex-end;
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
    font-size: 14px;
    color: #606266;
    span {
      margin-right: 60px;
    }
  }
</style>
<script type="text/ecmascript-6">
import SubHeader from '@/components/SubHeader'
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'
import {getApproveCont} from '@/api/coopContract'
import {ERR_OK} from '@/utils/status'
import {GetRequest} from '@/utils/index.js'

export default {
  data() {
    return {
      form: {
        orgName: null,
        projName: null,
        reason: ''
      },
      tableData: [],
      showTxt: '',
      // status: {},
      isRevoke: '',
      type: '',
      conId: null,
      ID: null,
      workText: '',
      workTitle: '',
      schoolData: {},
      queryID: ''
    }
  },
  mounted() {
    let req = GetRequest()
    this.queryID = req.id
    this.type = req.type
    setTimeout(() => {
      this._initData(this.queryID)
    }, 17)
  },
  methods: {
    _initData(id) {
      getApproveCont({
        conId: id
      }).then(res => {
        if (res.status === ERR_OK) {
          this.schoolData = res.data
          this.form.orgName = res.data.orgNameCn
          this.form.projName = res.data.projectName
          this.tableData = res.data.colList
          this.form.reason = res.data.memo
          this.ID = res.data.id
          this.isRevoke = res.data.hasRevoke
          this.isShowReason()
        }
      })
    },
    _formatCol(row) {
      if (row.colProperty) {
        return row.colProperty.name
      } else {
        return '/'
      }
    },
    isShowReason() {
      if (this.schoolData.changeType) {
        switch (this.schoolData.changeType.code) {
          case 'FROZEN':
            this.workText = '冻结'
            this.workTitle = '申请冻结的项目信息'
            this.showTxt = '冻结申请原因'
            return true
          case 'NORMAL':
            this.workText = '解冻'
            this.workTitle = '申请解冻的项目信息'
            this.showTxt = '解冻申请原因'
            return true
          case 'freezeing':
            this.workText = '撤回'
            this.workTitle = '申请撤回的项目信息'
            this.showTxt = '撤回申请原因'
            return true
          case 'STOP':
            this.workText = '终止'
            this.workTitle = '申请终止的项目信息'
            this.showTxt = '终止申请原因'
            return true
          default:
            return false
        }
      }
    }
  },
  computed: {
    // isText() {
    //   switch (this.$route.query.workType) {
    //     case 'FROZEN':
    //       this.workText = '冻结'
    //       this.workTitle = '申请冻结的项目信息'
    //       break
    //     case 'NORMAL':
    //       this.workText = '解冻'
    //       this.workTitle = '申请解冻的项目信息'
    //       break
    //     case 'freezeing':
    //       this.workText = '撤回'
    //       this.workTitle = '申请撤回的项目信息'
    //       break
    //     case 'STOP':
    //       this.workText = '终止'
    //       this.workTitle = '申请终止的项目信息'
    //       return true
    //     default:
    //       return false
    //   }
    // },
  },
  components: {
    SubHeader,
    BlockBorder,
    BlockHeader
  }
}
</script>
