<template>
  <div class="lx_main">
    <sub-header :title="title" icon="yuanxiaohezuoxiangmu"></sub-header>
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
            <span>合作等级：{{schoolData.leavel}}</span>
          </el-col>
        </el-row>
      </div>
    </block-border>
    <block-border>
      <block-header slot="title" title="申请原因"></block-header>
      <div class="lx_apply_info" slot="container">
        <h4>{{changeTxt}}:</h4>
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
import {getTable} from '@/api/schoolManage'
import {ERR_OK} from '@/utils/status'
import {GetRequest} from '@/utils/index.js'

export default {
  data() {
    return {
      selectType: '',
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
      userID: ''
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
    _initData() {
      getTable({
        levelId: this.id
      }).then(res => {
        if (res.status === ERR_OK) {
          this.schoolData = res.data
          this.status = res.data.status
          this.isRevoke = res.data.hasRevoke
          this.userID = res.data.applyUserId
          this.selectType = res.data.selectType.code
        }
      })
    }
  },
  computed: {
    changeTxt() {
      if (this.selectType) {
        console.log(this.selectType)
        // if(this.selectType==='')
        switch (this.selectType) {
          case 'UNCHECKED':
            this.title = '院校合作项目不可选申请'
            return '院校下的项目设置不可选的申请原因'
          case 'CHECKED':
            this.title = '院校合作项目可选申请'
            return '院校下的项目设置可选的申请原因'
        }
      }
    }
  },
  components: {
    SubHeader,
    BlockBorder,
    BlockHeader
  }
}
</script>
