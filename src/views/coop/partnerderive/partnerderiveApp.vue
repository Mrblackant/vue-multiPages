<template>
  <div class="lx_container">
    <div class="lx_main">
      <sub-header title="申请衍生服务合作项目"></sub-header>
      <base-apply :name="orgDetail.countryName"></base-apply>
      <block-border>
        <block-header title="基本合作信息" slot="title"></block-header>
        <div slot="container" class="lx_container clearfix">
          <el-form :model="form" label-width="120px" ref="baseForm" :rules="rules" class="lx_form_baseinfo">
            <el-row class="lx_row_txt">
              <el-col :span="8"><span>机构中文名称：</span><span class="lx_row_values">{{orgDetail.nameCn}}</span></el-col>
              <el-col :span="8"><span>机构外文名称：</span><span class="lx_row_values">{{orgDetail.nameEn}}</span></el-col>
              <el-col :span="8">
                <el-form-item label="合作项目" prop="projName">
                  <el-input v-model="form.projName" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="服务类型">
                  <el-select v-model="form.serviceSel" placeholder="请选择">
                    <el-option v-for="item in serviceTypes" :label="item.name" :value="item.code"
                               :key="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="合同开始日期" prop="startdate">
                  <el-date-picker
                    v-model="form.startdate"
                    :picker-options="pickerStartDateAfter"
                    type="date"
                    style="width: 100%"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同结束日期" prop="enddate">
                  <el-date-picker
                    v-model="form.enddate"
                    :picker-options="pickerEndDateAfter"
                    type="date"
                    placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <!--<el-col>-->
            <!--<el-form-item label="去年送生情况" prop="pastyearInfo">-->
            <!--<el-input v-model="form.pastyearInfo" placeholder="请输入" class="inline"></el-input>-->
            <!--</el-form-item>-->
            <!--</el-col>-->
          </el-form>
        </div>
      </block-border>
      <!--机构联系信息-->
      <school-link :disableLink="true" @schoolform="getSchollLink" :onlyRead="false" :isAdd="true" :isOrg="true"
                   :dataAddress="form.colAddress"
                   :dataAddressCn="form.colAddressCn"
                   :dataWebsite="form.colWebsite"></school-link>
      <!--院校联系信息-->
      <block-border>
        <block-header slot="title" title="项目信息"></block-header>
        <el-form ref="projform" :rules="rules" slot="container" label-width="160px" :model="form"
                 class="lx_form_baseinfo">
          <el-form-item label="项目基本情况说明">
            <el-input
              type="textarea"
              maxlength="1000"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              v-model="form.memo">
            </el-input>
          </el-form-item>
          <el-form-item label="参与合作讨论人员">
            <el-input placeholder="请输入内容" v-model="form.discPersons"></el-input>
          </el-form-item>
          <el-form-item label="上传附件"><span>每种证书可上传最多5个文件，单个文件大小最大30M，支持文件格式：PDF、word、rar/zip等常用压缩文件</span></el-form-item>
          <el-form-item label="合作协议书" prop="probook">
            <file-upload :attaObj="fileObj" @files="_getFileID" :isTip="false" key="one"></file-upload>
          </el-form-item>
          <el-form-item label="签字后的合作协议书" class="lx_level_main">
            <span class="lx_level_dialog lx_redcolor_up">(审批通过后上传)</span>
            <file-upload :isDisable="true" :isTip="false" key="two"></file-upload>
          </el-form-item>
          <el-form-item label="使馆认证书">
            <file-upload :attaObj="fileObj1" @files="_getFileID1" :isTip="false" key="three"></file-upload>
          </el-form-item>
          <el-form-item label="合作机构资质证明">
            <file-upload :attaObj="fileObj2" @files="_getFileID2" :isTip="false" key="four"></file-upload>
          </el-form-item>
          <el-form-item label="合作机构宣传资源">
            <file-upload :attaObj="fileObj3" @files="_getFileID3" :isTip="false" key="five"></file-upload>
          </el-form-item>
          <el-form-item label="使馆认证网址">
            <el-input v-model="form.embassyWebsite"></el-input>
          </el-form-item>
          <el-form-item label="申请特别要求" prop="hocRequest">
            <el-input v-model="form.hocRequest"></el-input>
          </el-form-item>
        </el-form>
      </block-border>
      <block-border>
        <block-header slot="title" title="佣金信息"></block-header>
        <div slot="container">
          <el-form :model="form" label-width="140px" ref="levelForm" :rules="rules" class="lx_form_baseinfo">
            <!--佣金联系人-->
            <comm-link :payList="payTypeList" @commform="_getCommLink"></comm-link>
            <!--本次合作等级-->
            <coop-level :level-list="leavelList" :level-table="levelTableList" @level="_getLevcl"></coop-level>
          </el-form>
          <!--非标准模板开始-->
          <el-form :model="commForm" label-width="140px" ref="tamcont" :rules="rules" class="lx_form_baseinfo">
            <el-form-item label="佣金内容" prop="memo">
              <el-input :autosize="{ minRows: 4, maxRows: 6}"
                        type="textarea"
                        maxlength="1000"
                        v-model="commForm.memo"
                        placeholder="文字描述佣金内容，可补充如预估金额\申请时间\发票要求\注意事项等">
              </el-input>
              <span>{{nums}}/1000</span>
            </el-form-item>
          </el-form>
          <!--非标准模板结束-->
        </div>
      </block-border>
      <div class="lx_btn_center">
        <!--<el-button @click="submitProject('TYPE1')">保存</el-button>-->
        <el-button type="primary" @click="submitProject('TYPE2')">保存</el-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  .lx_container {
    .lx_row_txt {
      /*height: 30px;*/
      line-height: 30px;
      margin-bottom: 15px;
      color: #303133;
      font-size: 16px;
      font-family: "Microsoft YaHei";
    }
  }

  .lx_brotmp_sel {
    display: block;
    margin-top: 15px;
  }

  .lx_brotmp_radio {
    margin-right: 15px;
  }

  .lx_brotmp_radio.is-bordered {
    width: 300px;
    height: 83px;
  }

  .lx_form_baseinfo {
    margin-right: 150px;
    label.el-form-item__label {
      font-size: 16px;
      font-family: "Microsoft YaHei";
    }
  }

  .lx_flex_broke {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .lx_flex_2 {
      flex: 3;
    }
    .lx_flex_1 {
      flex: 1;
    }
    .lx_flex_item {
      margin-right: 15px;
      max-width: 300px;
    }
    .lx_short_wd {
      max-width: 100px;
    }
    .lx_broke_span {
      display: inline-block;
      width: 65px;
    }
    .lx_btn_mini {
      height: 28px;
      line-height: 28px;
      padding: 0;
      padding: 0 12px;
    }
  }

  .lx_pdb_10 {
    padding-bottom: 10px;
  }

  .lx_grads {
    &_header {
      height: 39px;
      line-height: 39px;
      background-color: #f2f9ff;
      border-top: 1px solid #e4e7ed;
      display: flex;
      color: #909399;
      font-family: "Microsoft YaHei";
      font-size: 14px;
    }
    &_nums {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    &_charge {
      flex: 3;
      box-sizing: border-box;
      padding-left: 30px;
    }
    &_body {

    }
    &_row {
      display: flex;
      border-bottom: 1px solid #e4e7ed;
      height: 53px;
      line-height: 53px;
    }
    &_add {
      display: flex;
      justify-content: flex-end;
      height: 52px;
      border-bottom: 1px solid #e4e7ed;
      align-items: center;
      &_btn {
        margin-right: 40px;
      }
    }
  }

  .lx_nums_init {
    text-align: center;
  }

  .lx_width_110 {
    width: 110px;
  }

  .lx_width_70 {
    width: 70px;
  }

  .lx_form_tmp {
    width: 80%;
    min-width: 950px;
  }

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

  .lx_redcolor_up {
    color: #f56c6c;
    text-decoration: none
  }
</style>
<script type="text/ecmascript-6">
import SubHeader from '@/components/SubHeader'
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'
import {getOrgDetail} from '@/api/coopManage'
import {ERR_OK} from '@/utils/status'
import {mapGetters, mapMutations} from 'vuex'
import SchoolLink from '@/components/SchoolLinkInfo'
import {addProject} from '@/api/coopManage'
import {getApplyEnum, getLevelTable} from '@/api/dict'
import {getTime} from '@/utils/index'
import global_ from '@/Global'
import {FormValit, ApplyFileMixin} from '@/utils/mixin'
import BaseApply from './components/baseApply'
import CommLink from '@/views/components/comm/commLinkInfo'
import CoopLevel from '@/views/components/comm/coopLevel'
import FileUpload from '@/components/AttachFile/index'
import {GetRequest} from '@/utils/index.js'

export default {
  mixins: [FormValit, ApplyFileMixin],
  data() {
    return {
      form: {
        pastyearInfo: null, // 去年送生情况
        projName: '', // 项目名称
        startdate: null, // 开始时间
        enddate: null, // 结束时间
        colAddress: '', // 院校地址
        colAddressCn: '', // 院校中国办事处地址
        colWebsite: '', // 网址
        memo: '', // 项目基本情况说明
        discPersons: '', // 参与合作讨论人员
        embassyWebsite: null, // 使馆认证网址
        hocRequest: null, // 申请特别要求
        level: '', // 合作等级
        serviceSel: null, // 服务类型
        commtmp: 'NONSTANDARD', //  非标准佣金模板
        queryID: ''
      },
      commLink: {}, // 佣金联系人信息
      commForm: { // 佣金模板表单
        memo: '' // 文本描述
      },
      orgDetail: {}, // 机构详细
      payTypeList: [], // 支付方式枚举
      serviceTypes: [], // 服务类型枚举
      leavelList: [], // 合作等级枚举
      sopid: null, // 提交成功后的ID
      levelTableList: [], // 评判标准
      pickerStartDateAfter: { // 开始时间判定
        disabledDate: (time) => {
          // let beginDateVal = this.form.startdate
          let endDateVal = this.form.enddate
          if (endDateVal) {
            return time.getTime() > (endDateVal - (60 * 60 * 24))
          }
        }
      },
      pickerEndDateAfter: { // 结束时间判定
        disabledDate: (time) => {
          let beginDateVal = this.form.startdate
          if (beginDateVal) {
            if (beginDateVal.constructor === Date) {
              beginDateVal = beginDateVal.getTime()
            }
            return time.getTime() < (beginDateVal + (60 * 60 * 24))
          }
        }
      }
    }
  },
  mounted() {
    let req = GetRequest()
    this.queryID = req.id
    if (!this.queryID) {
      window.location.href = "applymethod.html"
//          this.$router.push({
//            name: 'Method'
//          })
    } else {
      setTimeout(() => {
        // 获取等级
        getLevelTable().then(res => {
          if (res.status === ERR_OK) {
            this.levelTableList = res.data
          }
        })
        this._initEnumSel()
        this._initOrg(this.queryID)
      }, 17)
    }
  },
  methods: {
    // 获取佣金联系人信息
    _getCommLink(data) {
      this.commLink = data
    },
    _initOrg(id) {
      getOrgDetail({id: id}).then(res => {
        if (res.status === ERR_OK) {
          this.orgDetail = res.data
          this.form.colAddress = res.data.orgAddress
          this.form.colAddressCn = res.data.orgAddressCn
          this.form.colWebsite = res.data.orgWebsite
          this.setSchoolInfoList(res.data.contacts)
        }
      })
    },
    _getLevcl(data) {
      this.form.level = data
    },
    // 获取枚举下拉框
    _initEnumSel() {
      getApplyEnum().then(res => {
        if (res.status === ERR_OK) {
          // console.log('获取成功')
          this.payTypeList = res.data.payTypes
          this.leavelList = res.data.leavels
          this.serviceTypes = res.data.serviceTypes
        }
      })
    },
    getSchollLink(...data) {
      this.form.colAddress = data[0].address
      this.form.colAddressCn = data[0].addresscn
      this.form.colWebsite = data[0].website
    },
    // 佣金提交字段
    _initParam(type) {
      const params = {
        id: this.sopid,
        operatorType: type,
        attachments: [...this.fileList, ...this.fileList1, ...this.fileList2, ...this.fileList3],
        conType: 'NEW', // 合同类型
        applyType: global_.ORGDERIVATIVE, // 直接申请
        commContacts: this.commLink.commContacts, // 佣金联系人
        projectName: this.form.projName, // 项目名称
        startTime: getTime(this.form.startdate), // 合同开始时间
        endTime: getTime(this.form.enddate), // 合同结束时间
        // signInfo: this.form.pastyearInfo, // 去年送生情况
        contactsList: this.schoolInfoList, // 院校联系人
        address: this.form.colAddress, // 院校地址
        addressCn: this.form.colAddressCn, // 中国办事处地址
        website: this.form.colWebsite, // 院校网址
        memo: this.form.memo, // 基本情况说明
        discPersons: this.form.discPersons, // 参与合作讨论人员
        embassyWebsite: this.form.embassyWebsite, // 使馆认证网址
        hocRequest: this.form.hocRequest, // 申请特别要求
        payType: this.commLink.commpayType, // 佣金支付方式
        leavel: this.form.level, // 合作等级
        isUpload: false, // 签字后合作协议书
        serviceType: this.form.serviceSel, // 服务类型
        coopApplyComm: { // 非标准模板佣金
          memo: this.commForm.memo,
          type: this.form.commtmp // 佣金模板类型
        },
        coopOrgId: this.queryID // 机构ID
      }
      return params
    },
    // 提交申请
    submitProject(type) {
      // console.log(this.sopid)
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          if (this._vali()) {
            addProject(this._initParam(type)).then(res => {
              if (res.status === ERR_OK) {
                // console.log('提交成功')
                if (this.sopid === null) {
                  this.sopid = res.data
                }
//                   this.$message.success(`提交成功,即将跳转！`)
//                   setTimeout(() => {
//                       window.location.href = 'applydetail.html?id=' + res.data + '&type=org&derive=true&edit=false'
// //                    this.$router.push({
// //                      name: 'Method'
// //                    })
//                   }, 3001)
                this.$alert('提交成功！', '温馨提示', {
                  confirmButtonText: '知道了',
                  type: 'success',
                  callback: action => {
                    setTimeout(() => {
                      window.location.href = 'applydetail.html?id=' + res.data + '&type=org&derive=true&edit=false'
                    }, 3001)
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
            this.$message.error('佣金信息填写错误')
          }
        } else {
          this.$message.error('基本信息填写错误')
        }
      })
    },
    ...mapMutations({
      setSchoolInfoList: 'SET_SCHOOLINFOLIST'
    })
  },
  computed: {
    ...mapGetters([
      'schoolInfoList'
    ]),
    nums() {
      return this.commForm.memo.length
    }
  },
  components: {
    SubHeader,
    BlockBorder,
    BlockHeader,
    SchoolLink,
    BaseApply,
    CommLink,
    CoopLevel,
    FileUpload
  }
}
</script>
