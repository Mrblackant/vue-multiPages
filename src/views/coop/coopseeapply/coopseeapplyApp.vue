<template>
  <div class="lx_container">
    <div class="lx_main">
      <sub-header :title="title" icon="yuanxiaohezuoxiangmu"></sub-header>
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
        <div slot="container" class="lx_container">
          <el-row class="lx_row_txt">
            <el-col :span="8"><span>国家：{{schoolData.countryName}}</span></el-col>
            <el-col :span="8">
              <span>院校外文名：{{schoolData.colNameEn}}</span>
            </el-col>
            <el-col :span="8">
              <span>院校中文名：{{schoolData.colNameCn}}</span>
            </el-col>
          </el-row>
          <el-row class="lx_row_txt">
            <el-col :span="8">
              <span>院校类型：<label v-for="item in schoolData.colTypes">{{item.name}},</label></span>
            </el-col>
            <el-col :span="8">
              <span>院校性质：{{schoolData.colProperty | names}}</span>
            </el-col>
          </el-row>
          <el-row class="lx_row_txt">
            <el-col :span="16">
              <span>合作机构：{{schoolData.orgNameCn}}({{schoolData.orgNameEn}})</span>
            </el-col>
            <el-col :span="8">
              <span>合作项目：{{schoolData.projectName}}</span>
            </el-col>
          </el-row>
          <el-row class="lx_row_txt">
            <el-col :span="8">
              <span>合作方式：{{schoolData.applyType | names }}</span>
            </el-col>
            <el-col :span="8">
              <span>合作等级：{{ levalTemp[schoolData.leavel] }}</span>
            </el-col>
          </el-row>
        </div>
      </block-border>
      <block-border v-if="isForBack">
        <block-header slot="title" title="申请原因"></block-header>
        <div class="lx_apply_info" slot="container">
          <h4>{{changeTxt}}:</h4>
          <p class="lx_show_reson">{{schoolData.memo}}</p>
          <div class="lx_reson_info_tool">
            <span>申请人：{{schoolData.applyUserName}}</span><span>申请时间：{{schoolData.applyDate | formatTime}}</span>
          </div>
        </div>
      </block-border>
      <block-border v-if="!isForBack">
        <block-header slot="title" title="申请理由"></block-header>
        <div class="lx_approval_opinion" slot="container">
          <el-row>
            <el-form :model="formopinion" label-position="left">
              <el-col :span="20">
                <el-form-item :label="changeTxt" class="lx_item_long" label-width="150px">
                  <el-input v-model="formopinion.opnion" type="textarea" placeholder="请输入审批意见" maxlength="200"
                            :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
      </block-border>
      <block-border v-if="isForBack">
        <block-header slot="title" title="撤回理由"></block-header>
        <div class="lx_approval_opinion" slot="container">
          <el-row>
            <el-form :model="formopinion" label-position="left">
              <el-col :span="20">
                <el-form-item label="院校下的项目设置撤回原因" class="lx_item_long" label-width="150px">
                  <el-input v-model="formopinion.opnion" type="textarea" placeholder="请输入审批意见" maxlength="200"
                            :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
      </block-border>
      <!--<block-border v-if="isForBack">-->
      <!--<block-header slot="title" title="申请理由"></block-header>-->
      <!--<div class="lx_approval_opinion" slot="container">-->
      <!--<el-form :model="formopinion" label-position="left">-->
      <!--<el-col :span="20">-->
      <!--<el-form-item label="院校下的项目设置撤回的申请原因" class="lx_item_long" label-width="150px">-->
      <!--<el-input v-model="formopinion.opnion" type="textarea" placeholder="请输入原因"-->
      <!--:autosize="{ minRows: 4, maxRows: 6}"></el-input>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-form>-->
      <!--</div>-->
      <!--</block-border>-->
      <div class="lx_btn_center">
        <el-button v-if="!isForBack" type="primary" plain @click="submitApply">提交申请</el-button>
        <el-button v-if="isForBack" type="primary" plain @click="backApply">撤回</el-button>
        <el-button @click="goR">取消</el-button>
      </div>
      <!--<block-border>-->
      <!--<block-header slot="title" title="审批意见"></block-header>-->
      <!--<div class="lx_apply_info" slot="container">-->
      <!--<h4>驳回</h4>-->
      <!--<p class="lx_show_reson">就是不想让你通过，没有别的理由.</p>-->
      <!--<div class="lx_reson_info_tool">-->
      <!--<span>申请人：XXX</span><span>申请时间：2018.03.01 11:00:22</span>-->
      <!--</div>-->
      <!--</div>-->
      <!--</block-border>-->
      <!--<block-border>-->
      <!--<block-header slot="title" title="审批情况"></block-header>-->
      <!--<el-table slot="container" header-row-class-name="lx_table_hd" :data="approvalinfo">-->
      <!--<el-table-column prop="time" label="操作时间"></el-table-column>-->
      <!--<el-table-column prop="operater" label="操作人"></el-table-column>-->
      <!--<el-table-column prop="operatcont" label="操作内容"></el-table-column>-->
      <!--<el-table-column prop="operdesc" label="备注"></el-table-column>-->
      <!--</el-table>-->
      <!--</block-border>-->
    </div>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  .lx_block_txt_header {
    font-size: 16px;
    color: #827de3;
    font-weight: 500;
    line-height: 30px;
    margin-left: 30px;
    padding-bottom: 0;
    margin-bottom: 0;
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

  .lx_item_long {
    label.el-form-item__label {
      line-height: 24px;
      font-size: 16px;
      padding-right: 20px;
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

  .lx_partner_box {
    margin-top: -30px;
    h3 {
      color: #2196f3;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .lx_btn_center {
    text-align: center;
  }

  .lx_apply_info {
    margin: 0 20px;
    h4 {
      color: #f56c6c;
      margin: 0;
      font-weight: 500;
    }
  }

  .lx_container {
    .lx_row_txt {
      height: 30px;
      line-height: 30px;
      margin-bottom: 15px;
      color: #303133;
      font-size: 16px;
      font-family: "Microsoft YaHei";
    }
  }
</style>
<script type="text/ecmascript-6">
import SubHeader from '@/components/SubHeader'
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'
import ApplyCheck from '@/views/components/applyCheck/applyCheck'
import {getTable, setSel} from '@/api/schoolManage'
import {ERR_OK} from '@/utils/status'
import {GetRequest} from '@/utils/index'
import {withDraw} from '@/api/coopManage'
import global_ from '@/Global'
import {getApplyEnum} from '@/api/dict'

export default {
  data() {
    return {
      schoolData: {},
      displayData: [],
      approvalinfo: [],
      formopinion: {
        opnion: ''
      },
      id: '',
      type: '',
      status: {},
      isRevoke: '',
      isUrl: 'a', // 定义到审批流的URL
      title: '',
      userID: '',
      processKey: '', // 查看申请的KEY
      applyID: '', // 申请ID
      URI: '',
      levalTemp: {}
    }
  },
  created() {
    let req = GetRequest()
    this.id = req.id
    this.type = req.type
    setTimeout(() => {
      this._initData()
    }, 17)
  },
  mounted() {
    this.applyID = this.id
    this.URI = global_.APPROVE
    getApplyEnum().then((res) => {
      if (res.status === ERR_OK) {
        let levelList = res.data.leavels
        for (let l of levelList) {
          this.levalTemp[l.code] = l.name
        }
      }
    })
  },
  filters: {
    names(val) {
      if (!val) {
        return
      } else {
        return val.name
      }
    }
  },
  methods: {
    submitApply() {
      if (this.formopinion.opnion) {
        setSel({
          colOrgId: this.id,
          selectType: this.type === 'CHECK' ? 'CHECKED' : 'UNCHECKED',
          memo: this.formopinion.opnion
        }).then(res => {
          if (res.status === ERR_OK) {
            // this.$message.success('申请成功！')
            // setTimeout(() => {
            //     // this.$router.go(-1)
            //     window.history.go(-1)
            // }, 1500)
            this.$alert('申请成功！', '温馨提示', {
              confirmButtonText: '知道了',
              type: 'success',
              callback: action => {
                setTimeout(() => {
                  // this.$router.go(-1)
                  window.history.go(-1)
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
        this.$message.error('原因不能为空')
      }
    },
    goR() {
      window.history.go(-1)
      //this.$router.go(-1)
    },
    backApply() {
      if (this.formopinion.opnion) {
        withDraw({
          bussinessKey: this.schoolData.id,
          comment: this.formopinion.opnion,
          applyBizCode: 'COOP_SELECT_TYPE_APPLY'
        }).then(res => {
          if (res.status === ERR_OK) {
            // this.$message.success('撤回成功')
            // setTimeout(() => {
            //     window.history.go(-1)
            // }, 1000)
            this.$alert('撤回成功！', '温馨提示', {
              confirmButtonText: '知道了',
              type: 'success',
              callback: action => {
                setTimeout(() => {
                  window.history.go(-1)
                }, 1000)
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
        this.$message.error('原因不能为空')
      }
    },
    _initData() {
      getTable({
        levelId: this.id
      }).then(res => {
        if (res.status === ERR_OK) {
          this.schoolData = res.data
          this.processKey = res.data.processKey
          this.applyID = res.data.id
          this.status = res.data.status
          this.isRevoke = res.data.hasRevoke
          this.userID = res.data.applyUserId
        }
      })
    }
  },
  computed: {
    isForBack() {
      if (this.isRevoke === true) {
        return true
      } else {
        return false
      }
    },
    changeTxt() {
      switch (this.type) {
        case 'UNCHECK':
          this.title = '院校合作项目不可选申请'
          return '院校下的项目设置不可选的申请原因'
        case 'CHECK':
          this.title = '院校合作项目可选申请'
          return '院校下的项目设置可选的申请原因'
      }
    },
    isCurrUser() {
      if (sessionStorage.getItem('currUserID') === this.schoolData.applyUserId) {
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
  },
  components: {
    SubHeader,
    BlockBorder,
    BlockHeader,
    ApplyCheck
  }
}
</script>
