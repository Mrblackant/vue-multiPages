<template>
  <div class="lx_container">
    <div class="lx_main">
      <sub-header :title="workTitle" icon="xinzengliuxueyuanxiao"></sub-header>
      <block-border v-show="isHasApplyUser">
        <block-header slot="title" title="报审信息">
          <div v-show="isShowSchedule" slot="right" class="process-bt-right">
            <apply-check :processKey="processKey" :applyID="applyID" :URI="URI"></apply-check>
          </div>
        </block-header>
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
      <block-border v-if="isBack">
        <block-header slot="title" title="申请原因"></block-header>
        <div class="lx_apply_info" slot="container">
          <h4>{{workText}}的原因:</h4>
          <p class="lx_show_reson">{{schoolData.memo}}</p>
          <div class="lx_reson_info_tool">
            <span>申请人：{{schoolData.applyUserName}}</span><span>申请时间：{{schoolData.applyDate | formatTime}}</span>
          </div>
        </div>
      </block-border>
      <block-border v-if="isShowReason">
        <block-header slot="title" :title="isTitle"></block-header>
        <div class="lx_approval_opinion" slot="container">
          <el-row>
            <el-form :model="form" label-position="left">
              <el-col :span="20">
                <el-form-item :label="showTxt" class="lx_item_long" label-width="120px">
                  <el-input v-model="form.reason" type="textarea" placeholder="请输入审批意见" maxlength="200"
                            :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
      </block-border>
      <div class="lx_btn_center" v-if="isShowReason">
        <el-button v-if="isStatus" type="primary" plain @click="updateContractOpt(type)">提交申请</el-button>
        <el-button v-if="isBack" type="primary" plain @click="backApply">撤回</el-button>
        <el-button @click="goR">取消</el-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
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

  .process-bt-right {
    width: 100%;
    float: right;
    margin-right: 10px;
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
import ApplyCheck from '@/views/components/applyCheck/applyCheck'
import {getApproveCont, approveCont} from '@/api/coopContract'
import {ERR_OK} from '@/utils/status'
import {withDraw} from '@/api/coopManage'
import global_ from '@/Global'
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
      status: {},
      schoolData: {},
      processKey: '', // 查看申请的KEY
      applyID: '', // 申请ID
      URI: '',
      queryID: '',
      workType: ''
    }
  },
  mounted() {
    let req = GetRequest()
    this.type = req.type
    this.queryID = req.id
    this.workType = req.workType
    // setTimeout(() => {
    this.$nextTick(() => {
      this.URI = global_.APPROVE
      this._initData(this.queryID)
    })
    // }, 17)
  },
  methods: {
    _initData(id) {
      getApproveCont({
        conId: id
      }).then(res => {
        if (res.status === ERR_OK) {
          this.schoolData = res.data
          this.processKey = res.data.processKey
          this.status = res.data.status
          this.applyID = res.data.id
          this.form.orgName = res.data.orgNameCn
          this.form.projName = res.data.projectName
          this.tableData = res.data.colList
          this.ID = res.data.id
          this.isRevoke = res.data.hasRevoke
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
    backApply() {
      if (this.form.reason) {
        withDraw({
          bussinessKey: this.ID,
          comment: this.form.reason,
          applyBizCode: 'COOP_STATUS_APPLY'
        }).then(res => {
          if (res.status === ERR_OK) {
            // this.$message.success('撤回成功')
            this.$alert('撤回成功！', '温馨提示', {
              confirmButtonText: '知道了',
              type: 'success',
              callback: action => {
                setTimeout(() => {
                  window.history.go(-1)
                  //this.$router.go(-1)
                }, 1500)
              }
            })
          } else {
            // this.$message.error(res.msg)
            this.$alert(res.msg, '错误提示', {
              confirmButtonText: '知道了',
              type: 'error'
            })
          }
        })
      } else {
        this.$message.error('原因不能为空！')
      }
    },
    _approve(type) {
      if (this.form.reason) {
        approveCont({
          conId: this.queryID,
          changeType: type,
          memo: this.form.reason
        }).then(res => {
          if (res.status === ERR_OK) {
            // this.isIng = true
            // this.$message({
            //   type: 'success',
            //   message: '申请成功!'
            // })
            // setTimeout(() => {
            //   this.goR()
            // }, 1500)
            this.$alert('申请成功！', '温馨提示', {
              confirmButtonText: '知道了',
              type: 'success',
              callback: action => {
                setTimeout(() => {
                  this.goR()
                }, 1500)
              }
            })

          } else {
            // this.$message({
            //   type: 'warning',
            //   message: '程序错误！'
            // })
            this.$alert('程序错误！' + res.msg, '错误提示', {
              confirmButtonText: '知道了',
              type: 'error'
            })
          }
        })
      } else {
        this.$message.error('原因不能为空！')
      }
    },
    // 合同审批操作
    updateContractOpt(type) {
      if (type === 'FROZEN') {
        this._approve('FROZEN')
      } else if (type === 'NORMAL') {
        this._approve('NORMAL')
      } else if (type === 'STOP') {
        this._approve('STOP')
      }
    },
    goR() {
      window.history.go(-1)
      //this.$router.go(-1)
    }
  },
  computed: {
    isText() {
      switch (this.workType) {
        case 'FROZEN':
          this.workText = '冻结'
          this.workTitle = '合作项目冻结申请'
          break
        case 'NORMAL':
          this.workText = '解冻'
          this.workTitle = '合作项目解冻申请'
          break
        case 'freezeing':
          this.workText = '撤回'
          this.workTitle = '合作项目撤回申请'
          break
        case 'STOP':
          this.workText = '终止'
          this.workTitle = '合作项目终止申请'
          return true
        default:
          return false
      }
    },
    isShowReason() {
      switch (this.type) {
        case 'FROZEN':
          this.workText = '冻结'
          this.workTitle = '合作项目冻结申请'
          this.showTxt = '冻结申请原因'
          return true
        case 'NORMAL':
          this.workText = '解冻'
          this.workTitle = '合作项目解冻申请'
          this.showTxt = '解冻申请原因'
          return true
        case 'freezeing':
          if (this.schoolData.changeType) {
            if (this.schoolData.changeType.name === '生效中') {
              this.workText = '解冻'
              this.workTitle = `合作项目解冻申请`
            } else {
              this.workText = this.schoolData.changeType.name
              this.workTitle = `合作项目${this.schoolData.changeType.name}申请`
            }
            this.showTxt = '撤回申请原因'
          }
          return true
        case 'STOP':
          this.workText = '终止'
          this.workTitle = '合作项目终止申请'
          this.showTxt = '终止申请原因'
          return true
        default:
          return false
      }
    },
    isTitle() {
      if (this.type === 'freezeing') {
        return '撤回理由'
      } else {
        switch (this.type) {
          case 'FROZEN':
            return '冻结原因'
          case 'NORMAL':
            return '解冻原因'
          case 'STOP':
            return '终止原因'
          default:
            return false
        }
      }
    },
    isStatus() {
      if (this.isRevoke === false) {
        return true
      } else {
        return false
      }
    },
    isBack() {
      if (this.isRevoke === true) {
        return true
      } else {
        return false
      }
    },
    isHasApplyUser() {
      if (this.schoolData.applyUserName) {
        return true
      } else {
        return false
      }
    },
    isShowSchedule() {
      if (this.status) {
        if (this.status.code === 'IN_APPROVAL') {
          return true
        } else {
          return false
        }
      }
    }
    // isShow() {
    //   if (this.$route.query.type === 'freezeing') {
    //     if (this.schoolData.applyUserId === sessionStorage.getItem('currUserID')) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   } else {
    //     return true
    //   }
    // }
  },
  components: {
    SubHeader,
    BlockBorder,
    BlockHeader,
    ApplyCheck
  }
}
</script>
