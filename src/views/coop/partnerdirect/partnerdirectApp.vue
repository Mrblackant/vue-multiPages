<template>
  <div class="lx_container">
    <div class="lx_main">
      <sub-header title="申请直接合作院校"></sub-header>
      <base-info :country-name="schoolDetail.countryName"></base-info>
      <block-border>
        <block-header title="基本合作信息" slot="title" id="basicMsg"></block-header>
        <div slot="container" class="lx_container clearfix">
          <el-form :model="form" ref="baseForm" label-width="120px" :rules="rules" class="lx_form_baseinfo">
            <el-row class="lx_row_txt">
              <el-col :span="8"><span>院校中文名称：{{schoolDetail.nameCn}}</span></el-col>
              <el-col :span="16"><span>院校外文名称：{{schoolDetail.nameEn}}</span></el-col>
            </el-row>
            <el-row class="lx_row_txt">
              <el-col :span="8"><span>院校性质：{{property}}</span></el-col>
              <el-col :span="8"><span>院校类别：{{colType}}</span></el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="合作项目名称" prop="projName">
                  <el-input v-model="form.projName" placeholder="请输入项目名称" maxlength="250"></el-input>
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
              <el-col :span="16">
                <el-form-item label="合同结束日期" prop="enddate">
                  <el-date-picker
                    v-model="form.enddate"
                    @change="changeEndDate"
                    type="date"
                    :picker-options="pickerEndDateAfter"
                    placeholder="选择日期"></el-date-picker>&nbsp;&nbsp;<el-checkbox @change="changeForever"
                                                                                 v-model="form.isForever" border>永久
                </el-checkbox>
                  <span>（勾选后，默认合同到期时间为2050年12月31号）</span>
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
      <!--院校联系信息-->
      <!--<school-link @schoolform="getSchollLink" :disableLink="false" :onlyRead="false" :isAdd="true">-->
      <!--</school-link>-->
      <school-link :disableLink="true" @schoolform="getSchollLink" :onlyRead="false" :dataAddress="form.colAddress"
                   :isAdd="true"
                   :dataAddressCn="form.colAddressCn"
                   :dataWebsite="form.colWebsite"></school-link>
      <!--院校联系信息-->
      <block-border>
        <block-header slot="title" title="项目信息"></block-header>
        <el-form ref="projform" slot="container" :rules="rules" label-width="160px" :model="form"
                 class="lx_form_baseinfo">
          <el-form-item label="项目基本情况说明">
            <el-input
              type="textarea"
              maxlength="1000"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              v-model="form.memo">
            </el-input>
            <span>{{memoNum}}/1000</span>
          </el-form-item>
          <el-form-item label="参与合作讨论人员">
            <el-input placeholder="请输入内容" maxlength="100" v-model="form.discPersons"></el-input>
          </el-form-item>
          <el-form-item label="上传附件"><span>每种证书可上传最多5个文件，单个文件大小最大30M，支持文件格式：PDF、word、rar/zip等常用压缩文件</span>
          </el-form-item>
          <el-form-item label="合作协议书" class="is-required" id="fileBox" :class="{fileStyle : fileStyleFlag}">
            <file-upload :attaObj="fileObj" @files="_getFileID" @delFile="_getFileID" :isTip="false"
                         key="one"></file-upload>
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
            <el-input v-model="form.embassyWebsite" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="申请特别要求" prop="hocRequest" id="hocRequest">
            <el-input v-model="form.hocRequest" maxlength="250"></el-input>
          </el-form-item>
        </el-form>
      </block-border>
      <block-border>
        <block-header slot="title" title="佣金信息" id="comInfo"></block-header>
        <el-form slot="container" :model="form" ref="levelForm" :rules="rules" label-width="140px"
                 class="lx_form_baseinfo">
          <!--佣金联系人-->
          <comm-link :payList="payTypeList" @commform="_getCommLink" ref="commlink"></comm-link>
          <!--本次合作等级-->
          <coop-level :level-list="leavelList" :level-table="levelTableList" @level="_getLevcl"></coop-level>
          <!--佣金模板和类型-->
          <comm-tmp :mouldsList="mouldsList" :comm-sel.sync="commsel" :comm-tmp.sync="commtmp" id="commTmp"></comm-tmp>
        </el-form>
        <!--标准模板开始-->
        <el-form v-if="commTmpFlag" :model="commForm" ref="tmpbase" label-width="130px" slot="container"
                 class="lx_form_tmp lx_mr_20">
          <el-form-item label="按固定佣金" v-show="commFixationTmpFlag" :model="fixaList">
            <div class="lx_flex_broke lx_pdb_10" v-for="(item,index) in fixaList">
              <comm-category title="请选择留学类别" :width="typeWidth" :parentVal="parentVal(item.type)"
                             :data-list="schoolTypes"
                             :key="index"
                             :isUniq="true"
                             :class='item.typeFlag ? {fixaTypeBorderColor : true} : ""'
                             :values.sync="item.type"
                             category-cla="lx_category"></comm-category>
              <el-input v-model="item.amount" placeholder="输入佣金金额(只能为数字)" type="text"
                        :class='item.amountFlag ? {fixaAmoutBorderColor : true} : ""' class="lx_flex_item lx_flex_2" maxlength="10"></el-input>
              <el-select v-model="item.unit" placeholder="请选择" class="lx_flex_item lx_flex_1 lx_short_wd"
                         :class='item.unitFlag ? {fixaUnitBorderColor : true} : ""'>
                <el-option v-for="item in unitList" :label="item.name" :value="item.code" :key="item.code"></el-option>
              </el-select>
              <span class="lx_flex_item lx_broke_span">/学生</span>
              <el-button v-if="!index>0" type="primary" plain size="mini" class="lx_btn_mini" @click="addFixa">+增加类别
              </el-button>
              <div v-if="index>=1">
                <el-button type="primary" plain size="mini" @click="moveRow(fixaList,index)">移除</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="按费用百分比" v-show="commPercentTmpFlag" :model="percentList">
            <div class="lx_flex_broke lx_pdb_10" v-for="(item,index) in percentList">
              <comm-category title="请选择留学类别" :width="typeWidth" :parentVal="parentVal(item.type)"
                             :dataList="schoolTypes"
                             :key="index"
                             :values.sync="item.type"
                             :class='item.typeFlag ? {fixaTypeBorderColor : true} : ""'
                             category-cla="lx_category"></comm-category>
              <el-input v-model="item.chargeItem" placeholder="输入费用名称" class="lx_flex_item lx_flex_2"
                        :class='item.chargeItemFlag ? {fixaAmoutBorderColor : true} : ""' maxlength="100"></el-input>
              <el-input v-model="item.percent" placeholder="费用占比(只能为数字)" maxlength="10" type="text"
                        :class='item.percentFlag ? {fixaAmoutBorderColor : true} : ""' class="lx_flex_item lx_flex_1 lx_short_wd"></el-input>
              <span class="lx_flex_item lx_broke_span">%</span>
              <el-button v-if="!index>0" type="primary" plain size="mini" class="lx_btn_mini" @click="addPercent">+增加类别
              </el-button>
              <div v-if="index>=1">
                <el-button type="primary" plain size="mini" @click="moveRow(percentList,index)">移除</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="按人数梯度" v-show="commPersonTmpFlag" :model="gradList">
            <div class="lx_grads">
              <div class="lx_grads_header">
                <div class="lx_grads_nums">人数</div>
                <div class="lx_grads_charge">收取费用</div>
              </div>
              <div class="lx_grads_body">
                <div class="lx_grads_row" v-for="(item,index) in gradList">
                  <div class="lx_grads_nums">
                    <el-input size="small" class="lx_width_70" placeholder="请输入" :disabled="true"
                              v-model="item.minNum"></el-input>
                    &nbsp;&nbsp;≤&nbsp;&nbsp;
                    <el-input size="small" class="lx_width_70" type="text" maxlength="10"
                              :class='item.maxNumFlag ? {fixaAmoutBorderColor : true} : ""' placeholder="请输入数字" v-model="item.maxNum"
                              @change="changeGradNum(item,index)"></el-input>
                  </div>
                  <div class="lx_grads_charge">
                    <div class="lx_grads_item">
                      <el-select v-model="item.mouldDetailType" @change="changeRowType(item,index)" placeholder="请选择"
                                 size="small"
                                 class="lx_width_150">
                        <el-option v-for="m in costList" :label="m.name" :value="m.code" :key="m.code"></el-option>
                      </el-select>
                    </div>
                    <div class="lx_grads_item">
                      <comm-category :dataList="schoolTypes" :key="index" :values.sync="item.type"
                                     :parentVal="parentVal(item.type)" :width="typeWidth"
                                     title="请选择留学类别" :class='item.typeFlag ? {fixaTypeBorderColor : true} : ""'
                                     button-size="small"></comm-category>
                    </div>
                    <div class="lx_grads_item">
                      <el-input v-if="item.zanbiFlag" v-model="item.chargeItem" placeholder="费用名称" class="lx_width_150"
                                :class='item.chargeItemFlag ? {fixaAmoutBorderColor : true} : ""'
                                maxlength="100"
                                size="small"></el-input>
                      <el-input v-else v-model="item.amount" placeholder="费用金额(只能为数字)" class="lx_width_110"
                                :class='item.amountFlag ? {fixaAmoutBorderColor : true} : ""' maxlength="20" type="text"
                                size="small"></el-input>
                    </div>
                    <div class="lx_grads_item">
                      <el-input v-if="item.zanbiFlag" v-model="item.percent" placeholder="费用占比(只能为数字)" maxlength="10"
                                type="text"
                                size="small"
                                :class='item.percentFlag ? {fixaAmoutBorderColor : true} : ""'
                                class="lx_width_110"></el-input>
                      <el-select v-else v-model="item.unit" placeholder="请选择币种" size="small"
                                 :class='item.unitFlag ? {fixaUnitBorderColor : true} : ""' class="lx_width_150">
                        <el-option v-for="m in unitList" :label="m.name" :value="m.code" :key="m.code"></el-option>
                      </el-select>
                    </div>
                    <div class="lx_grads_item">
                      <label v-if="item.zanbiFlag">%</label>
                      <label v-else>学生</label>
                    </div>
                    <div v-if="index>=1&&index===gradList.length-1">
                      <el-button type="primary" plain size="mini" @click="moveRow(gradList,index)">移除</el-button>
                    </div>
                  </div>
                </div>
                <div class="lx_grads_add">
                  <el-button type="primary" plain size="mini" class="lx_grads_add_btn" @click="addGradRow">+&nbsp;增加梯度
                  </el-button>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="佣金内容">
            <el-input :autosize="{ minRows: 4, maxRows: 6}"
                      type="textarea"
                      v-model="commForm.memo"
                      maxlength="1000"
                      placeholder="文字描述佣金内容，可补充如预估金额\申请时间\发票要求\注意事项等">
            </el-input>
            <span>{{memoNum}}/1000</span>
          </el-form-item>
          <el-form-item label="额外奖励">
            <el-input v-model="commForm.extraBonus"
                      :autosize="{ minRows: 4, maxRows: 6}"
                      type="textarea"
                      placeholder="输入额外奖励条款，此部分金额不支持自动计算" maxlength="500"></el-input>
            <span>{{extraBonusNum}}/500</span>
          </el-form-item>
          <el-form-item label="备注">
            <el-input :autosize="{ minRows: 4, maxRows: 6}"
                      type="textarea"
                      v-model="commForm.desc"
                      maxlength="500"
                      placeholder="备注">
            </el-input>
            <span>{{remarkNum}}/500</span>
          </el-form-item>
        </el-form>
        <!--标准模板结束-->
        <!--非标准模板开始-->
        <el-form v-else :model="commForm" ref="tamcont" :rules="rules" label-width="130px" slot="container"
                 class="lx_form_tmp lx_mr_20">
          <el-form-item label="佣金内容" prop="memo">
            <el-input :autosize="{ minRows: 4, maxRows: 6}" :class='commForm.memoFlag ? {borderColor : true} : ""'
                      type="textarea"
                      maxlength="1000"
                      v-model="commForm.memo"
                      placeholder="文字描述佣金内容，可补充如预估金额\申请时间\发票要求\注意事项等">
            </el-input>
            <span>{{memoNum}}/1000</span>
          </el-form-item>
          <el-form-item label="备注">
            <el-input :autosize="{ minRows: 4, maxRows: 6}"
                      type="textarea"
                      v-model="commForm.desc"
                      maxlength="500"
                      placeholder="备注">
            </el-input>
            <span>{{remarkNum}}/500</span>
          </el-form-item>
        </el-form>
        <!--非标准模板结束-->
      </block-border>
      <div class="lx_btn_center" id="lx_btn_center">
        <el-button @click="submitProject('TYPE1')">保存</el-button>
        <el-button type="primary" @click="submitProject('TYPE2')">提交申请</el-button>
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

  .borderColor textarea {
    border-color: #f56c6c;
  }

  .fileStyle button {
    border-color: #f56c6c;
  }

  .fixaTypeBorderColor > button {
    border-color: #f56c6c;
  }

  .fixaAmoutBorderColor > input {
    border-color: #f56c6c;
  }

  .fixaUnitBorderColor > div > input {
    border-color: #f56c6c;
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

  .lx_redcolor_up {
    color: #f56c6c;
    text-decoration: none
  }

  .lx_grads_charge {
    display: flex
  }

  .lx_grads_item {
    margin-right: 10px;
  }

  .lx_width_150 {
    width: 150px;
  }

  .lx_category {
    margin-right: 10px;
  }
</style>
<script type="text/ecmascript-6">
import SubHeader from '@/components/SubHeader'
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'
import { getSchoolDetail } from '@/api/schoolManage'
import { ERR_OK } from '@/utils/status'
import { mapGetters, mapMutations } from 'vuex'
import SchoolLink from '@/components/SchoolLinkInfo'
import { addProject } from '@/api/coopManage'
import { getApplyEnum, getSchoolType, getLevelTable } from '@/api/dict'
import { getTime } from '@/utils/index'
import { FormValit, ChangeCommMixin, ParentValMixin } from '@/utils/mixin'
import BaseInfo from './components/baseApply'
import CommLink from '@/views/components/comm/commLinkInfo'
import CoopLevel from '@/views/components/comm/coopLevel'
import CommTmp from '@/views/components/comm/commTmpSel'
import global_ from '@/Global'
import CommCategory from '@/components/CommCategory/index'
import FileUpload from '@/components/AttachFile/index'
import { GetRequest } from '@/utils/index.js'

export default {
  mixins: [FormValit, ChangeCommMixin, ParentValMixin],
  data() {
    return {
      form: {
        pastyearInfo: '', // 去年送生情况
        projName: '', // 项目名称
        startdate: null, // 开始时间
        enddate: null, // 结束时间
        isForever: false, // 是否永久
        colAddress: '', // 院校地址
        colAddressCn: '', // 院校中国办事处地址
        colWebsite: '', // 网址
        memo: '', // 项目基本情况说明
        discPersons: '', // 参与合作讨论人员
        embassyWebsite: '', // 使馆认证网址
        hocRequest: '', // 申请特别要求
        level: '' // 合作等级
      },

      commForm: { // 佣金模板表单
        type: '', // 佣金类别
        unit: '', // 佣金单位
        chargeItem: '', // 费用名称
        amount: '', // 费用
        percent: '', // 百分比
        extraBonus: '', // 额外奖励
        memo: '', // 文本描述
        desc: '' // 备注
      },
      gradList: [ // 添加梯度
        {
          minNum: 1, // 最小值
          maxNum: '', // 最大值
          mouldDetailType: 'COST_PERCENT', // 佣金类别
          type: '请选择', // 类别
          chargeItem: '', // 费用名称
          percent: '',
          unit: null,
          amount: null,
          zanbiFlag: true
        }
      ],
      fixaList: [ // 添加固定佣金
        {
          type: '请选择',
          amount: '',
          unit: ''
        }
      ],
      percentList: [ // 添加百分比佣金
        {
          type: '请选择',
          chargeItem: '',
          percent: ''
        }
      ],
      schoolDetail: {}, // 学校详细
      propertiesList: [], // 院校性质
      types: [], // 院校类别
      // num1: 2,
      payTypeList: [], // 支付方式枚举
      leavelList: [], // 合作等级枚举
      unitList: [], // 币种
      costList: [], // 费用类型 (固定佣金，费用占比)
      costTypeList: [], // 费用类别 （语言，预科等）
      mouldsList: [], // 模板类型
      id: null,
      levelTableList: [], // 评判等级标准
      commLink: {}, // 佣金联系人信息
      schoolTypes: [], // 院校类别
      typeWidth: 730, // 佣金类型弹出窗宽度,
      fileObj: {
        bizType: 'COOP_APPLY',
        fileType: 'AGREEMENT'
      },
      fileObj1: {
        bizType: 'COOP_APPLY',
        fileType: 'EMBASSY_CERTIFY'
      },
      fileObj2: {
        bizType: 'COOP_APPLY',
        fileType: 'ORG_CERTIFY'
      },
      fileObj3: {
        bizType: 'COOP_APPLY',
        fileType: 'ORG_PUBLICIZE'
      },
      fileList: [], // 附件数组
      fileList1: [], // 附件数组
      fileList2: [], // 附件数组
      fileList3: [], // 附件数组
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
      },
      uniqList: [],
      tempSchoolTypeList: [],
      isVali: false,
      queryID: "",
      isTrue: false,
      fileStyleFlag: false
    }
  },
  mounted() {
    let req = GetRequest()
    this.queryID = req.id
    if (!this.queryID) {
      window.location.href = "applymethod.html"
//        this.$router.push({
//          name: 'Method'
//        })
    } else {
      setTimeout(() => {
        // 获取等级
        getLevelTable().then(res => {
          if (res.status === ERR_OK) {
            this.levelTableList = res.data
          }
        })
        this._initEnumSel()
        this._initSchool(this.queryID)
      }, 17)
    }
  },
  methods: {
    _getFileID(data) {
      // console.log(data)
      let list = data
      // this.probook = list
      this.fileList = list
    },
    _getFileID1(data) {
      // console.log(data)
      let list = data
      this.fileList1 = list
    },
    _getFileID2(data) {
      // console.log(data)
      let list = data
      this.fileList2 = list
    },
    _getFileID3(data) {
      // console.log(data)
      let list = data
      this.fileList3 = list
    },
    // 院校类别
    _initType(params) {
      getSchoolType({
        countryCodes: params
      }).then(res => {
        if (res.status === ERR_OK) {
          this.schoolTypes = res.data
          this.tempSchoolTypeList = res.data
          this.uniqList = res.data
        }
      })
    },
    // 获取佣金联系人信息
    _getCommLink(data) {
      this.commLink = data
    },
    _getLevcl(data) {
      this.form.level = data
    },
    _initSchool(id) {
      getSchoolDetail({ id: id }).then(res => {
        if (res.status === ERR_OK) {
          this.schoolDetail = res.data
          this.propertiesList = this.schoolDetail.colPropertiesList
          this.types = this.schoolDetail.colTypes
          this.form.colAddress = res.data.colAddress
          this.form.colAddressCn = res.data.colAddressCn
          this.form.colWebsite = res.data.colWebsite
          this.setSchoolInfoList(res.data.contacts)
          let arr = []
          arr.push(res.data.countryCode)
          this._initType(arr)
        }
      })
    },
    // 获取枚举下拉框
    _initEnumSel() {
      getApplyEnum().then(res => {
        if (res.status === ERR_OK) {
          // console.log('获取成功')
          this.payTypeList = res.data.payTypes
          this.leavelList = res.data.leavels
          this.unitList = res.data.units
          res.data.moulds.map((item) => {
            if (item.code !== 'NUM_LADDER') {
              this.costList.push(item)
            }
          })
          this.costTypeList = res.data.types
          this.mouldsList = res.data.moulds
        }
      })
    },
    changeForever() {
      if (this.form.isForever) {
        this.form.enddate = new Date(parseInt(2556028800000))
      } else {
        this.form.enddate = null
      }
    },
    changeEndDate() {
      let tim = getTime(this.form.enddate)
      // console.log(tim)
      if (tim === 2556028800000) {
        this.form.isForever = true
      } else {
        this.form.isForever = false
      }
    },
    // 处理已选的院校类型
    // testA() {
    //   let that = this
    //   that.schoolTypes.length = 0
    //   if (this.commsel === 'FIXED') {
    //     let M = []
    //     // let N = []
    //     // let B = []
    //     let A = []
    //     that.fixaList.map(item => { // 把没一条的类型转换为数组
    //       if (item.type !== '请选择') {
    //         item.type.split(',').map(a => {
    //           A.push(a)
    //         })
    //       }
    //     })
    //     that.uniqList.slice(0).map(m => {
    //       A.map(a => {
    //         if (a !== m.name) {
    //           M.push(m)
    //         }
    //       })
    //     })
    //     that.schoolTypes = M
    //   }
    // },

    // 增加梯度行
    addGradRow() {
      let len = this.gradList.length
      let prevItem = this.gradList[len - 1]
      // console.log(len)
      if (prevItem.maxNum === '' || prevItem.maxNum === undefined) {
        console.log(len)
        this.$message.error('请先填写内容')
        return
      }
      this.gradList.push({
        minNum: parseInt(prevItem.maxNum) + 1,
        maxNum: '',
        mouldDetailType: 'FIXED', // 佣金类别
        type: '请选择', // 类别
        chargeItem: '', // 费用名称
        percent: '',
        amount: null,
        unit: null,
        zanbiFlag: false
      })
    },
    // 移除梯度行
    moveRow(type, index) {
      type.splice(index, 1)
    },
    // 切换梯度人数
    changeGradNum(item, index) {
      if (this.gradList[(index + 1)] !== undefined){
        let nums1 = item.maxNum
        this.gradList[(index + 1)].minNum = parseInt(nums1) + 1
      }
    },
    // 切换梯度行类别
    changeRowType(item, index) {
      if (item.mouldDetailType === 'FIXED') {
        this.$nextTick(() => {
          this.gradList[index].zanbiFlag = false
        })
      } else {
        this.$nextTick(() => {
          this.gradList[index].zanbiFlag = true
        })
      }
    },
    // 增加固定佣金
    addFixa() {
      let len = this.fixaList.length
      let prevItem = this.fixaList[len - 1]
      if (prevItem.amount === '' ||
        prevItem.amount === undefined ||
        prevItem.type === '请选择'
      ) {
        this.$message.error('请先填写佣金模板内容')
        return
      }
      this.fixaList.push({
        type: '请选择',
        amount: '',
        unit: ''
      })
      // this.testA()
    },
    // 增加百分比佣金
    addPercent() {
      let len = this.percentList.length
      let prevItem = this.percentList[len - 1]
      if (prevItem.chargeItem === '' ||
        prevItem.chargeItem === undefined ||
        prevItem.type === '请选择'
      ) {
        this.$message.error('请先填写内容')
        return
      }
      this.percentList.push({
        type: '请选择',
        chargeItem: '',
        percent: ''
      })
    },
    getSchollLink(...data) {
      this.form.colAddress = data[0].address
      this.form.colAddressCn = data[0].addresscn
      this.form.colWebsite = data[0].website
    },
    // 过滤梯度无用字段
    _fromatGradList() {
      let list = this.gradList.slice()
      let l = []
      list.map((item) => {
        l.push({
          minNum: item.minNum,
          maxNum: item.maxNum,
          mouldDetailType: item.mouldDetailType, // 佣金类别
          type: item.type, // 类别
          chargeItem: item.chargeItem, // 费用名称
          percent: item.percent,
          amount: item.amount,
          unit: item.unit
        })
      })
      return l
    },
    // 佣金提交字段
    _initParam(type) {
      let requestParams = {}
      const params = {
        id: this.id,
        operatorType: type,
        attachments: [...this.fileList, ...this.fileList1, ...this.fileList2, ...this.fileList3],
        conType: 'NEW', // 合同类型
        applyType: global_.DIRECTCOL, // 直接申请
        payType: this.commLink.commpayType, // 佣金支付方式
        commContacts: this.commLink.commContacts, // 佣金联系人
        projectName: this.form.projName, // 项目名称
        startTime: getTime(this.form.startdate), // 合同开始时间
        endTime: getTime(this.form.enddate), // 合同结束时间
        isForever: this.form.isForever, // 是否永久
        // signInfo: this.form.pastyearInfo, // 去年送生情况
        contactsList: this.schoolInfoList, // 院校联系人
        address: this.form.colAddress, // 院校地址
        addressCn: this.form.colAddressCn, // 中国办事处地址
        website: this.form.colWebsite, // 院校网址
        memo: this.form.memo, // 基本情况说明
        discPersons: this.form.discPersons, // 参与合作讨论人员
        embassyWebsite: this.form.embassyWebsite, // 使馆认证网址
        hocRequest: this.form.hocRequest, // 申请特别要求
        leavel: this.form.level, // 合作等级
        colId: this.queryID, // 院校ID
        isUpload: false // 签字后合作协议书
      }
      // 非标准模板
      const nostand = {
        coopApplyComm: {
          memo: this.commForm.memo,
          type: this.commtmp, // 标准或非标准模板
          desc: this.commForm.desc // 备注
        }
      }
      // 固定佣金
      const fixationParams = {
        coopApplyComm: {
          commDetailRequestList: this.fixaList,
          extraBonus: this.commForm.extraBonus, // 额外奖励
          memo: this.commForm.memo, // 文本描述
          mouldType: this.commsel, // 佣金类别
          type: this.commtmp, // 标准或非标准模板
          desc: this.commForm.desc // 备注
        }
      }
      // 人数梯度佣金
      const numladderParams = {
        coopApplyComm: {
          commDetailRequestList: this._fromatGradList(),
          extraBonus: this.commForm.extraBonus, // 额外奖励
          memo: this.commForm.memo, // 文本描述
          mouldType: this.commsel, // 佣金类别
          type: this.commtmp, // 标准或非标准模板
          desc: this.commForm.desc // 备注
        }
      }
      // 百分比佣金
      const percentParams = {
        coopApplyComm: {
          commDetailRequestList: this.percentList,
          extraBonus: this.commForm.extraBonus, // 额外奖励
          memo: this.commForm.memo, // 文本描述
          mouldType: this.commsel, // 佣金类别
          type: this.commtmp, // 标准或非标准模板
          desc: this.commForm.desc // 备注
        }
      }
      if (this.commtmp === 'STANDARD') { // 标准模板
        if (this.commsel === 'NUM_LADDER') {
          Object.assign(requestParams, params, numladderParams)
        } else if (this.commsel === 'FIXED') {
          Object.assign(requestParams, params, fixationParams)
        } else if (this.commsel === 'COST_PERCENT') {
          Object.assign(requestParams, params, percentParams)
        }
      } else if (this.commtmp === 'NONSTANDARD') { // 非标准模板
        Object.assign(requestParams, params, nostand)
      }
      // console.log(requestParams)
      return requestParams
    },
    // 检查重复类别
    _formatTypesList(data) {

      let list = JSON.parse(JSON.stringify(data))
      let L = []
      if (list) {
        list.map(item => {
          L.push(...item.type.split(','))
        })
        let N = L.sort()
        if (N.length > 1) {
          for (let i = 0; i < N.length; i++) {
            if (N[i] === N[i + 1]) {
              this.isVali = true
              return
            } else {
              this.isVali = false
            }
          }
        } else {
          this.isVali = false
        }
      }
    },
    _valiTypes() {

      if (this.commtmp === 'STANDARD') {
        // 判断固定佣金
        if (this.commsel === 'FIXED') {
          this._formatTypesList(this.fixaList)
        } else if (this.commsel === 'COST_PERCENT') {
          this._formatTypesList(this.percentList)
        }
      } else {
        this.isVali = false

      }
    },
    // 提交申请
    submitProject(type) {
      if (window.location.hash.length > 0) {
        window.location.hash = ''
      }
      this.isTrue = false
      this.fileStyleFlag = false
      let that = this
      that.$refs.baseForm.validate((valid) => {
        if (valid) {
          if (that._vali()) {
            that._valiTypes()
            if (type === 'TYPE2') {
              // document.getElementById("fileBox").getElementsByTagName("button")[0].style = ""
              let lens = that.fileList.length
              if (lens === 0) {
                that.$message.error('合作协议书没有上传！')
                this.fileStyleFlag = true
                // document.getElementById("fileBox").getElementsByTagName("button")[0].style = "border-color:#f56c6c"
                window.location.hash = "#fileBox"
                return
              }
            }

            let flag = that.$refs.commlink.validForm()
            if (!flag) {
              window.location.hash = "#comInfo"
              that.$message.error('佣金信息填写错误')
              return
            }
            if (that.commLink.commpayType === undefined) {
              that.$message.error('请填写佣金支付方式！')
              window.location.hash = "#comInfo"
              return
            }
            if (that.commLink.commContacts.email === '' || that.commLink.commContacts.email === null) {
              that.$message.error('请填写佣金联系邮箱！')
              window.location.hash = "#comInfo"
              return
            }
            if (type === 'TYPE2') {
              if (that.commtmp === 'STANDARD') {
                switch (that.commsel) {
                  case 'FIXED':
                    let fixaListData = that.fixaList
                    that.fixaList = []
                    that.fixaList = fixaListData
                    for (let fixa of fixaListData) {
                      if (fixa.type === '请选择') {
                        fixa.typeFlag = true
                        that.$message.error('请选择留学类别！')
                        window.location.hash = "#commTmp"
                        return
                      } else if (fixa.amount === '' || fixa.amount === null) {
                        fixa.amountFlag = true
                        that.$message.error('请输入佣金金额！')
                        window.location.hash = "#commTmp"
                        return
                      }  else if (!fixa.amount.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                        fixa.amountFlag = true
                        that.$message.error('佣金金额只能是数字！')
                        window.location.hash = "#commTmp"
                        return
                      } else if (fixa.unit === '' || fixa.unit === null) {
                        fixa.unitFlag = true
                        that.$message.error('请选择佣金的货币种类!')
                        window.location.hash = "#commTmp"
                        return
                      }
                    }
                    break
                  case 'COST_PERCENT':
                    let percentListData = that.percentList
                    that.percentList = []
                    that.percentList = percentListData
                    for (let percent of percentListData) {
                      if (percent.type === '请选择') {
                        percent.typeFlag = true
                        that.$message.error('请选择留学类别！')
                        window.location.hash = "#commTmp"
                        return
                      } else if (percent.chargeItem === '' || percent.chargeItem === null) {
                        percent.chargeItemFlag = true
                        that.$message.error('请输入费用名称!')
                        window.location.hash = "#commTmp"
                        return
                      } else if (percent.percent === '' || percent.percent === null) {
                        percent.percentFlag = true
                        that.$message.error('请输入费用占比！')
                        window.location.hash = "#commTmp"
                        return
                      } else if (!percent.percent.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                        percent.percentFlag = true
                        that.$message.error('费用占比只能为数字！')
                        window.location.hash = "#commTmp"
                        return
                      }
                    }
                    break
                  default:
                    let gradListData = that.gradList
                    that.gradList = []
                    that.gradList = gradListData
                    that.isVali = false
                    for (let grad of gradListData) {
                      if (grad.maxNum !== '' && grad.maxNum !== null && !grad.maxNum.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                        grad.maxNumFlag = true
                        this.$message.error('人数最大值只能填数字！')
                        window.location.hash = "#commTmp"
                        return
                      } else if ((grad.maxNum !== '' && grad.maxNum !== null) && grad.maxNum < grad.minNum) {
                        grad.maxNumFlag = true
                        that.$message.error('人数最大值不能小于最小值！')
                        window.location.hash = "#commTmp"
                        return
                      } else if (grad.type === '请选择') {
                        grad.typeFlag = true
                        that.$message.error('请选择留学类别！')
                        window.location.hash = "#commTmp"
                        return
                      } else if (grad.mouldDetailType === 'COST_PERCENT') { // 按费用百分比
                        if (grad.chargeItem === '' || grad.chargeItem === null) {
                          grad.chargeItemFlag = true
                          that.$message.error('请输入费用名称!')
                          window.location.hash = "#commTmp"
                          return
                        } else if (grad.percent === '' || grad.percent === null) {
                          grad.percentFlag = true
                          that.$message.error('请输入费用占比！')
                          window.location.hash = "#commTmp"
                          return
                        } else if (!grad.percent.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                          grad.percentFlag = true
                          this.$message.error('费用占比只能为数字！')
                          window.location.hash = "#commTmp"
                          return
                        }
                      } else if (grad.mouldDetailType === 'FIXED') { // 按固定佣金
                        if (grad.amount === null) {
                          grad.amountFlag = true
                          that.$message.error('请输入金额！')
                          window.location.hash = "#commTmp"
                          return
                        }  else if (!grad.amount.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                          grad.amountFlag = true
                          this.$message.error('金额只能填数字!')
                          window.location.hash = "#commTmp"
                          return
                        } else if (grad.unit === null) {
                          grad.unitFlag = true
                          that.$message.error('请选择佣金的货币种类!')
                          window.location.hash = "#commTmp"
                          return
                        }
                      }
                    }
                }
              } else {
                if (!that.commTmpFlag && that.commForm.memo === '') {
                  let memo = that.commForm.memo
                  that.commForm.memo = null
                  that.commForm.memo = memo
                  that.$message.error('请填写"佣金内容"！')
                  that.commForm.memoFlag = true
                  window.location.hash = "#comInfo"
                  return
                }
              }
            } else {
              if (that.commtmp === 'STANDARD') {
                switch (that.commsel) {
                  case 'FIXED':
                    let fixaListData = that.fixaList
                    that.fixaList = []
                    that.fixaList = fixaListData
                    for (const fixa of fixaListData) {
                      if (fixa.amount !== '' && fixa.amount !== null && !fixa.amount.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                        fixa.amountFlag = true
                        that.$message.error('佣金金额只能是数字！')
                        window.location.hash = "#commTmp"
                        return
                      }
                    }
                    break
                  case 'COST_PERCENT':
                    let percentListData = that.percentList
                    that.percentList = []
                    that.percentList = percentListData
                    for (let percent of percentListData) {
                      if (percent.percent !== '' && percent.percent !== null && !percent.percent.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                        percent.percentFlag = true
                        that.$message.error('费用占比只能为数字！')
                        window.location.hash = "#commTmp"
                        return
                      }
                    }
                    break
                  default:
                    let gradListData = that.gradList
                    that.gradList = []
                    that.gradList = gradListData
                    that.isVali = false
                    for (let grad of gradListData) {
                      if (grad.maxNum !== '' && grad.maxNum !== null && !grad.maxNum.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                        grad.maxNumFlag = true
                        this.$message.error('人数最大值只能填数字！')
                        window.location.hash = "#commTmp"
                        return
                      } else if ((grad.maxNum !== '' && grad.maxNum !== null) && grad.maxNum < grad.minNum) {
                        grad.maxNumFlag = true
                        that.$message.error('人数最大值不能小于最小值！')
                        window.location.hash = "#commTmp"
                        return
                      } else if (grad.mouldDetailType === 'COST_PERCENT') { // 按费用百分比
                        if (grad.percent !== '' && grad.percent !== null && !grad.percent.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                          grad.percentFlag = true
                          this.$message.error('费用占比只能为数字！')
                          window.location.hash = "#commTmp"
                          return
                        }
                      } else if (grad.mouldDetailType === 'FIXED') { // 按固定佣金
                        if (grad.amount !== null && grad.amount !== '' && !grad.amount.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                          grad.amountFlag = true
                          this.$message.error('金额只能填数字!')
                          window.location.hash = "#commTmp"
                          return
                        }
                      }
                    }
                }
              }
            }
            if (that.isVali) {
              that.$message.error('留学类别重复，请重新选择')
              window.location.hash = "#lx_btn_center"
              return
            }
            addProject(that._initParam(type)).then(res => {
              if (res.status === ERR_OK) {
                if (that.id === null) {
                  that.id = res.data
                }
                if (type === 'TYPE2') {
                  // that.$message.success('提交申请成功！！！')
                  // setTimeout(() => {
                  //     window.location.href = "applydetail.html?id=" + res.data + "&type=school&derive=false"
                  // }, 3001)

                  that.$alert('提交申请成功！', '温馨提示', {
                    confirmButtonText: '知道了',
                    type: 'success',
                    callback: action => {
                      setTimeout(() => {
                        window.location.href = "applydetail.html?id=" + res.data + "&type=school&derive=false"
                      }, 3001)
                    }
                  })
                } else {
                  // that.$message.success('保存成功！！！')
                  // setTimeout(() => {
                  //     window.location.href = "applyeditdirect.html?id=" + res.data
                  // }, 3001)

                  that.$alert('保存成功！', '温馨提示', {
                    confirmButtonText: '知道了',
                    type: 'success',
                    callback: action => {
                      setTimeout(() => {
                        window.location.href = "applyeditdirect.html?id=" + res.data
                      }, 3001)
                    }
                  })
                }
              } else {
                // that.$message.error(res.msg)
                that.$alert(res.msg, '错误提示', {
                  confirmButtonText: '知道了',
                  type: 'error'
                })
              }
              // window.location.hash  = "#lx_btn_center"
            })
          } else {
            that.$message.error('信息填写错误')
            window.location.hash = "#hocRequest"
          }
        } else {
          window.location.hash = "#basicMsg"
          that.$message.error('基本合作信息填写错误')
        }
      })
      // this._initParam()
    },
    ...mapMutations({
      setSchoolInfoList: 'SET_SCHOOLINFOLIST'
    })
  },
  computed: {
    colType() {
      let l = []
      if (this.types === 0) {
        return
      }
      this.types.map((item) => {
        if (item.checked === true) {
          l.push(item.name)
        }
      })
      return l.toString()
    },
    property() {
      let t = []
      if (this.propertiesList === 0) {
        return
      }
      this.propertiesList.map((item) => {
        if (item.checked === true) {
          t.push(item.name)
        }
      })
      return t.toString()
    },
    ...mapGetters([
      'schoolInfoList'
    ]),
    memoNum() {
      return this.commForm.memo.length
    },
    extraBonusNum() {
      return this.commForm.extraBonus.length
    },
    remarkNum() {
      return this.commForm.desc.length
    }
  },
  watch: {
    // 按固定佣金
    fixaList: {
      handler(newVal, oldVal) {
        if (newVal) {
          let that = this
          newVal.map(i => {
            if (i.type && i.type !== '请选择' && i.typeFlag) {
              delete i.typeFlag
            }

            if (i.amount && i.amount !== '' && i.amountFlag && i.amount.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
              delete i.amountFlag
            }

            if (i.unit && i.unitFlag) {
              delete i.unitFlag
            }

          })
        }
      },
      deep: true
    },
    // 按照费用百分比
    percentList: {
      handler(newVal, oldVal) {
        if (newVal) {
          let that = this
          newVal.map(i => {
            if (i.type && i.type !== '请选择' && i.typeFlag) {
              delete i.typeFlag
            }

            if (i.percent && i.percent !== '' && i.percentFlag && i.percent.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
              delete i.percentFlag
            }

            if (i.chargeItem && i.chargeItemFlag) {
              delete i.chargeItemFlag
            }

          })
        }
      },
      deep: true
    },
    // 按照人数梯度
    gradList: {
      handler(newVal, oldVal) {
        if (newVal) {
          let that = this
          newVal.map(i => {
            if (i.type && i.type !== '请选择' && i.typeFlag) {
              delete i.typeFlag
            }

            if (i.maxNum && i.maxNum !== '' && i.maxNumFlag && i.maxNum.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
              delete i.maxNumFlag
            }

            if (i.chargeItem && i.chargeItemFlag) {
              delete i.chargeItemFlag
            }
            if (i.percent && i.percent !== '' && i.percentFlag && i.percent.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
              delete i.percentFlag
            }
            if (i.unit && i.unitFlag) {
              delete i.unitFlag
            }
            if (i.amount && i.amount !== '' && i.amountFlag && i.amount.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
              delete i.amountFlag
            }

          })
        }
      },
      deep: true
    },
    // 佣金内容
    commForm: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (newVal.memo && newVal.memoFlag) {
            delete newVal.memoFlag
          }
        }
      },
      deep: true
    }
  },
  components: {
    SubHeader,
    BlockBorder,
    BlockHeader,
    SchoolLink,
    BaseInfo,
    CommLink,
    CoopLevel,
    CommTmp,
    CommCategory,
    FileUpload
  }
}
</script>
