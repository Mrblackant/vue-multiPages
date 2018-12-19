<template>
  <div class="lx_container">
    <div class="lx_main">
      <sub-header title="信息修正" icon="hezuoxiangmuxiangqin"></sub-header>
      <block-border>
        <block-header slot="title" title="院校申请信息"></block-header>
        <div slot="container" class="lx_container">
          <el-row class="lx_row_txt">
            <el-col :span="8">
              <span>申请类型：{{baseInfoData.applyType}} <el-tag>{{baseInfoData.conType}}</el-tag></span>
            </el-col>
            <el-col :span="8" v-if="!isShowOrg">
              <span>院校国家：{{schoolData.countryName}}</span>
            </el-col>
            <el-col :span="8" v-if="isShowOrg">
              <span>机构国家：{{orgData.countryName}}</span>
            </el-col>
          </el-row>
        </div>
      </block-border>
      <block-border>
        <block-header slot="title" title="基本合作信息">
          <div slot="right" class="lx_block_btn">
            <!--<el-button type="primary" plain @click="updateOrgBaseInfo">保11111存</el-button>-->
            <el-button type="primary" plain @click="saveBaseInfo">保存</el-button>
          </div>
        </block-header>
        <div slot="container" class="lx_container">
          <div v-if="!isShowOrg">
            <el-row class="lx_row_txt">
              <el-col :span="8"><span>院校中文名称：</span><span class="lx_row_values">{{schoolData.nameCn}}</span></el-col>
              <el-col :span="16">
                <span>院校外文名称：</span><span class="lx_row_values">{{schoolData.nameEn}}</span>
              </el-col>
            </el-row>
            <el-row class="lx_row_txt">
              <el-col :span="8"><span>院校性质：</span><span class="lx_row_values">{{schoolData.colProperty}}</span></el-col>
              <el-col :span="8">
                <div>院校类型：
                  <label v-for="item in schoolData.colTypes" :key="item.code" v-if="item.checked">{{item.name}}&nbsp;&nbsp;&nbsp;</label>
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-if="isShowOrg">
            <el-row class="lx_row_txt">
              <el-col :span="8"><span>机构中文名称：</span><span class="lx_row_values">{{orgData.nameCn}}</span></el-col>
              <el-col :span="16">
                <span>机构外文名称：</span><span class="lx_row_values">{{orgData.nameEn}}</span>
              </el-col>
            </el-row>
          </div>
          <el-row class="lx_row_txt" v-if="deriveFlag">
            <el-col :span="8">
              <span>服务类型：</span><span class="lx_row_values">{{baseInfoData.serviceType}}</span>
            </el-col>
          </el-row>
          <el-row class="lx_row_txt">
            <el-col :span="24">
              <span>合作项目名称：</span><span class="lx_row_values">{{baseInfoData.projectName}}</span>
            </el-col>
          </el-row>
          <el-row class="lx_row_txt">
            <el-col :span="8">
          <span>合同开始日期：{{baseInfoData.startTime | formatTime}}
          </span>
            </el-col>
            <el-col :span="8"><span>合同结束日期：{{baseInfoData.endTime | formatTime}}</span></el-col>
          </el-row>
          <el-row class="lx_row_txt">
            <el-col :span="16">
              <div class="lx_diff_flex">
                <div class="lx_diff_label">去年送生情况：</div>
                <div class="width80">
                  <el-input v-model="baseInfoData.signInfo" placeholder="请输入内容" class="width100" maxlength="250"></el-input>
                </div>
              </div>
            </el-col>
          </el-row>
          <div v-if="isShowOrg&&!deriveFlag">
            <div class="lx_set_btn">
              <div class="toolButton">
                <el-button @click="showLevel" :disabled="leavelAble">批量设置合作等级</el-button>
                <el-button type="text" @click="handleLevelDialog">查看等级评判标准</el-button>
              </div>
            </div>
            <el-table :data="schoolDataList" @selection-change="setMoreLevel" class="width100" fit header-row-class-name="lx_table_hd">
              <el-table-column type="selection"></el-table-column>
              <el-table-column prop="countryName" label="国家"></el-table-column>
              <el-table-column prop="colNameEn" label="合作院校外文名"></el-table-column>
              <el-table-column prop="colNameCn" label="院校中文名"></el-table-column>
              <el-table-column prop="colProperty.name" label="院校性质"></el-table-column>
              <el-table-column prop="leavel" label="当前合作等级">
                <template prop="levelitem" slot-scope="scope">
                  <el-select v-model="scope.row.leavel" placeholder="请选择" size="mini" class="lx_width_110">
                    <el-option v-for="item in levelList" :label="item.name" :value="item.code"
                               :key="item.code"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="isNew"
                               :formatter="isNew"
                               label="原项目中是否存在"></el-table-column>
              <el-table-column label="原合作等级">
                <template prop="originalLeavel" slot-scope="scope">{{ levalTemp[scope.row.originalLeavel] }}</template>
              </el-table-column>
            </el-table>
            <!--设置合作等级开始-->
            <el-dialog
              :visible.sync="levelDialog"
              center class="lx_dialog"
              width="500px">
              <div class="lx_dialog_title" slot="title">
                <h2>设置合作等级</h2>
              </div>
              <div class="lx_dialog_main">
                <div class="lx_set_morelevel">
                  <span class="lx_set_span">请选择所需批量设置的合作等级</span>
                  <el-select v-model="moreSelLevel" placeholder="请选择">
                    <el-option v-for="item in levelList" :label="item.name" :value="item.code" :key="item.code"></el-option>
                  </el-select>
                </div>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setLeavel" round size="mini">确 定</el-button>
                <el-button @click="levelDialog = false" round size="mini">取 消</el-button>
              </div>
            </el-dialog>
            <!--设置合作等级结束-->
            <level-dialog ref="levelD" :table-list="levelTableList"></level-dialog>
          </div>
        </div>
      </block-border>
      <school-link :disableLink="true" @schoolform="getSchollLink" :onlyRead="false" :dataAddress="form.colAddress"
                   :isAdd="false" :isOrg="isShowOrg"
                   :dataAddressCn="form.colAddressCn"
                   :isCancel="false"
                   :dataWebsite="form.colWebsite" @emit-event="updateLink">
      </school-link>
      <block-border>
        <block-header slot="title" title="项目信息">
          <div slot="right" class="lx_block_btn">
            <el-button type="primary" plain @click="saveProjInfo">保存</el-button>
          </div>
        </block-header>
        <el-form ref="projform" slot="container" :rules="rules" :model="baseInfoData" label-width="160px" class="lx_form_baseinfo">
          <el-form-item label="项目基本情况说明">
            <!--<el-input v-model="baseInfoData.memo" placeholder="请输入内容" class="width100"></el-input>-->
            <el-input
              type="textarea"
              maxlength="1000"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              v-model="baseInfoData.memo"></el-input>
          </el-form-item>
          <el-form-item label="参与合作讨论人员">
            <el-input v-model="baseInfoData.discPersons" placeholder="请输入内容" class="width100" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="上传附件"><span>每种证书可上传最多5个文件，单个文件大小最大30M，支持文件格式：PDF、word、rar/zip等常用压缩文件</span></el-form-item>
          <el-form-item label="合作协议书" id="fileBox">
            <file-upload :isDisable="true" :attaObj="fileObj" @files="_getFileID" :attaList="fileList" :isTip="false"
                         key="one"></file-upload>
          </el-form-item>
          <el-form-item label="签字后的合作协议书" class="lx_level_main">
            <span class="lx_level_dialog lx_redcolor_up">(审批通过后上传)</span>
            <!--<file-upload :attaObj="fileObj5" @files="_getFileID5" :isTip="false"-->
            <!--key="two"></file-upload>-->
            <file-upload :isDisable="true" :attaObj="fileObj5" @files="_getFileID5" :attaList="fileList5"
                         :isTip="false" key="two"></file-upload>
          </el-form-item>
          <el-form-item label="使馆认证书">
            <file-upload :isDisable="true" :attaObj="fileObj1" @files="_getFileID1" :attaList="fileList1" :isTip="false"
                         key="three"></file-upload>
          </el-form-item>
          <el-form-item label="合作机构资质证明">
            <file-upload :isDisable="true" :attaObj="fileObj2" @files="_getFileID2" :attaList="fileList2" :isTip="false"
                         key="four"></file-upload>
          </el-form-item>
          <el-form-item label="合作机构宣传资源">
            <file-upload :isDisable="true" :attaObj="fileObj3" @files="_getFileID3" @delFile="_getFileID3"
                         :atta-list="fileList3"
                         :isTip="false"
                         key="five"></file-upload>
          </el-form-item>
          <el-form-item label="使馆认证网址">
            <el-input v-model="baseInfoData.embassyWebsite" placeholder="请输入内容" class="width100" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="申请特别要求" class="is-required" prop="hocRequest">
            <el-input v-model="baseInfoData.hocRequest" placeholder="请输入内容" class="width100" maxlength="250"></el-input>
          </el-form-item>
        </el-form>
      </block-border>
      <block-border>
        <block-header slot="title" title="佣金信息">
          <div slot="right" class="lx_block_btn">
            <el-button type="primary" plain @click="saveCommInfo">保存</el-button>
          </div>
        </block-header>
        <div slot="container" class="lx_container">
          <div style="margin-left: -80px;">
            <el-form label-width="160px" class="lx_form_baseinfo" ref="comInfo" :rules="rules" :model="baseCommData">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="佣金支付方式">
                    <span>{{baseCommData.payTypes}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="佣金联系人">
                    <el-input v-model="baseCommData.username" placeholder="请输入内容" class="width100" maxlength="100"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="佣金联系职务">
                    <el-input v-model="baseCommData.position" placeholder="请输入内容" class="width100" maxlength="150"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="佣金联系电话">
                    <el-input v-model="baseCommData.tel" placeholder="请输入内容" class="width100" maxlength="20"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="佣金联系传真">
                    <el-input v-model="baseCommData.fax" placeholder="请输入内容" class="width100" maxlength="40"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="佣金联系邮箱" class="is-required" prop="email">
                    <el-input v-model="baseCommData.email" placeholder="请输入内容" class="width100" maxlength="100"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="佣金联系地址">
                    <el-input v-model="baseCommData.address" placeholder="请输入内容" class="width100" maxlength="250"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!--院校佣金开始-->
          <div class="lx_comm" v-if="!isShowOrg">
            <el-row class="lx_row_txt">
              <!--<el-col><span>合作等级：{{baseLevel.leavel}}</span></el-col>-->
              <el-col>
                <div class="lx_diff_flex">
                  <div class="lx_diff_label">合作等级：</div>
                  <div class="width80">
                    <el-select v-model="baseLevel.leavel" placeholder="请选择" class="lx_width_110">
                      <el-option v-for="item in levelList" :label="item.name" :value="item.code"
                                 :key="item.code"></el-option>
                    </el-select>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row class="lx_row_txt">
              <div class="lx_temp_bold">佣金模板：{{baseCommData.type.name}}</div>
            </el-row>
            <el-row class="lx_row_txt" v-for="item in commDetailList" :key="item.id">
              <el-col v-if="isDirCommData">
                <span class="lx_temp_bold" v-if="isMoudelDetail&&baseCommData.mouldType.code!=='NUM_LADDER'">【{{baseCommData.mouldType.name}}】</span>
              </el-col>
              <el-col v-if="baseCommData.mouldType.code!=='NUM_LADDER'">
                <!--<div class="lx_temp_bold">{{a.mouldDetailType.name}}</div>-->
                <div>留学类别：{{item.type}}</div>
                <div v-if="baseCommData.mouldType.code==='FIXED'">
                  <div>佣金金额：{{item.amount}}</div>
                  <div>货币类型：{{item.unit}}/学生</div>
                </div>
                <div v-else>
                  <div>费用名称：{{item.chargeItem}}</div>
                  <div>费用占比：{{item.percent}}%</div>
                </div>
              </el-col>
              <el-col v-else>
                <div class="lx_temp_bold" v-if="item.mouldDetailType!==null">
                  【按人数梯度】&nbsp;人数&nbsp;{{item.minNum}}≤{{item.maxNum}}&nbsp;({{item.mouldDetailType
                | formatDetailType}})
                </div>
                <div>留学类别：{{item.type}}</div>
                <div v-if="item.mouldDetailType!==null&&item.mouldDetailType.code==='COST_PERCENT'">
                  <div>费用名称：{{item.chargeItem}}</div>
                  <div>费用占比：{{item.percent}}%</div>
                </div>
                <div v-else>
                  <div>佣金金额：{{item.amount}}</div>
                  <div>货币类型：{{item.unit}}/学生</div>
                </div>
              </el-col>

            </el-row>
            <div class="clearfix">
              <el-col>
                <div class="lx_ly_txt"><span>佣金内容：</span>
                  <p v-html="baseCommData.commmemo"></p>
                </div>
              </el-col>
            </div>
            <el-row class="lx_row_txt" v-if="baseCommData.type!==null&&baseCommData.type.code==='STANDARD'">
              <el-col><span class="lx_edit_extra">额外奖励：</span>
                <span class="lx_edit_extra" style="width: 500px">
                <el-input
                  :autosize="{ minRows: 4, maxRows: 6}"
                  type="textarea"
                  size="small" v-model="baseCommData.extraBonus" maxlength="500"/></span>
              </el-col>
            </el-row>
            <div class="clearfix">
              <!--<el-col>-->
              <!--<div class="lx_ly_txt"><span>佣金内容：</span>-->
              <!--<p v-html="baseCommData.commmemo"></p>-->
              <!--</div>-->
              <!--</el-col>-->
              <el-col>
                <div class="lx_ly_txt"><span>备注：</span>
                  <p v-if="baseCommData.desc" v-html="baseCommData.desc.replace(/\n/g,'</br>')"></p>
                </div>
              </el-col>
            </div>
          </div>
          <!--院校佣金结束-->
          <!--机构佣金开始-->
          <div v-if="!deriveFlag">
            <div class="lx_comm lx_comm_diff" v-for="item in baseCommData.commList">
              <el-row class="lx_row_txt">
                <el-col><span class="lx_temp_bold">佣金模板：{{item.type | formatCommType}}</span></el-col>
              </el-row>
              <el-row class="lx_row_txt" style="margin-bottom: 0" v-for="m in item.commDetailList" :key="m.id">
                <el-col v-if="item.mouldType!==null && item.mouldType.code!=='NUM_LADDER'">
                  <div class="lx_temp_bold">【{{m.mouldDetailType | formatDetailType}}】</div>
                  <div>留学类别：{{m.type}}</div>
                  <div v-if="item.mouldType.code==='FIXED'">
                    <div>佣金金额：{{m.amount}}</div>
                    <div>货币类型：{{m.unit}}/学生</div>
                  </div>
                  <div v-else>
                    <div>费用名称：{{m.chargeItem}}</div>
                    <div>费用占比：{{m.percent}}%</div>
                  </div>
                </el-col>
                <el-col v-else>
                  <div class="lx_temp_bold" v-if="m.mouldDetailType!==null">【按人数梯度】&nbsp;人数：{{m.minNum}}≤{{m.maxNum}}({{m.mouldDetailType
                  | formatDetailType}})
                  </div>
                  <div>留学类别：{{m.type}}</div>
                  <div v-if="m.mouldDetailType!==null && m.mouldDetailType.code==='COST_PERCENT'">
                    <div>费用名称：{{m.chargeItem}}</div>
                    <div>费用占比：{{m.percent}}%</div>
                  </div>
                  <div v-else>
                    <div>佣金金额：{{m.amount}}</div>
                    <div>货币类型：{{m.unit}}/学生</div>
                  </div>
                </el-col>

              </el-row>
              <div class="clearfix">
                <el-col>
                  <div class="lx_ly_txt clearfix" style="margin-bottom: 6px"><span>佣金内容：</span>
                    <p v-if="item.memo" v-html="item.memo.replace(/\n/g,'</br>')"></p>
                  </div>
                </el-col>
              </div>
              <el-row class="lx_row_txt" style="margin-bottom: 0">
                <el-col v-if="item.type!==null&&item.type.code==='STANDARD'"><span class="lx_edit_extra">额外奖励：</span>
                  <span class="lx_edit_extra" style="width: 500px">
                  <el-input
                    :autosize="{ minRows: 4, maxRows: 6}"
                    type="textarea"
                    size="small" v-model="item.extraBonus" maxlength="500"/></span></el-col>
              </el-row>
              <div class="clearfix">
                <!--<el-col>-->
                <!--<div class="lx_ly_txt clearfix" style="margin-bottom: 6px"><span>佣金内容：</span>-->
                <!--<p v-if="item.memo" v-html="item.memo.replace(/\n/g,'</br>')"></p>-->
                <!--</div>-->
                <!--</el-col>-->
                <el-col>
                  <div class="lx_ly_txt clearfix" style="margin-bottom: 6px"><span>备注：</span>
                    <p v-if="item&&item.desc" v-html="item.desc.replace(/\n/g,'</br>')"></p>
                  </div>
                </el-col>
              </div>
              <div class="lx_school_adapt">
                <div class="lx_lab">适合院校：</div>
                <div class="lx_school_item">
                  <div v-for="i in item.colIdList" class="lx_adapt_i">
                    <span class="lx_school_name" v-for="j in _formatAdapt(i.id)">{{j}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--机构佣金结束-->
        </div>
      </block-border>
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

  .lx_table {
    margin-top: 30px;
  }

  .lx_ly_txt {
    margin-bottom: 20px;
    line-height: 1.8;
    span {
      display: block;
      float: left;
    }
    p {
      margin: 0;
      overflow: hidden;
    }
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

  .lx_comm_diff {
    border-top: 1px solid #B5BFC6;
    padding-top: 10px;
  }

  .lx_school_adapt {
    display: flex;
    justify-content: flex-start;
    .lx_lab {
      width: 90px;
    }
    .lx_school_item {
      display: flex;
      flex: 1;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .lx_adapt_i {
      width: 298px;
      height: 118px;
      border: 1px solid #2196f3;
      margin-right: 10px;
      padding: 10px 20px;
      border-radius: 5px;
      margin-bottom: 20px;
      .lx_school_name {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-align: left;
        height: 48px;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 24px;
      }
    }
  }

  .lx_diff_flex {
    display: flex;
    justify-content: flex-start;
    .lx_diff_label {
      line-height: 40px;
    }
  }

  .width80 {
    width: 80%;
  }

  .lx_temp_bold {
    font-family: "Microsoft YaHei";
    font-size: 16px;
    color: #303133;
    font-weight: bold;
  }

  .lx_edit_extra {
    float: left;
  }

  .lx_set_btn {
    margin: 0 80px 20px 43px;
    display: flex;
    justify-content: space-between;
  }

  .toolButton {
    margin-left: -44px;
  }
</style>
<script type="text/ecmascript-6">
import SubHeader from '@/components/SubHeader'
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'
import SchoolLink from '@/components/SchoolLinkInfo'
import FileUpload from '@/components/AttachFile/index'
import {getApplyEnum} from '@/api/dict'
import {ApplyFileMixin, ProjectFormValit, comInfoValit} from '@/utils/mixin'
import {
  getCoopConDetail,
  getConDirectCommDetail,
  getConDirectLevelDetail,
  getConOrgCommDetail,
  getConOrgLevelDetail,
  updateConBase, // 直接合作基本信息修正
  updateConOrgBase, // 机构合作基本信息修正
  updateConProj,
  updateConDirectComm,
  updateConOrgComm,
  updateConLink
} from '@/api/coopContract'
import {getOrgDetail} from '@/api/coopManage'
import {getSchoolDetail} from '@/api/schoolManage'
import {ERR_OK} from '@/utils/status'
import {mapMutations, mapGetters} from 'vuex'
import {GetRequest} from '@/utils/index'
import LevelDialog from '@/views/components/levelDialog/levelDialog'
import {getLevelTable} from '@/api/dict'

export default {
  mixins: [ApplyFileMixin, ProjectFormValit, comInfoValit],
  data() {
    return {
      levelDialog: false, // 设置合作等级弹出窗
      setMoreLevelList: [],
      multipleSelection: [], // 多选的数据
      tableData: [],
      baseInfoData: {}, // 基础信息数据
      baseLinkData: {}, // 联系方式数据
      baseProjectData: {}, // 项目信息数据
      baseCommData: {
        type: {
          code: '',
          name: ''
        },
        mouldType: {
          code: '',
          name: ''
        },
        extraBonus: '',
        memo: ''
      }, // 佣金信息数据
      baseApplyData: {}, // 申请信息
      schoolData: {}, // 院校信息
      orgData: {}, // 机构信息
      baseLevel: {}, // 等级信息
      fileList: [], // 文件
      commDetailList: [], // 佣金列表,
      form: {
        colAddress: null,
        colAddressCn: null,
        colWebsite: null
      },
      schoolDataList: [],
      adp: {},
      /* eslint-disable */
      deriveFlag: false, // 是否为衍生服务
      levelList: [], // 合作等级枚举,
      type: '',
      commLists: [], // 机构佣金修改列表
      conID: '',
      levelTableList: [], // 评判标准
      leavelAble: true,
      moreSelLevel: null, // 批量合作等级选中
      levalTemp:{}
    }
  },
  // created() {
  //   console.log(this.$route.query.derive)
  // },
  mounted() {
    let req = GetRequest()
    this.conID = req.id
    this.deriveFlag = req.derive === 'true' ? true : false
    //this.$route.query.derive === 'true' ? true : false,
    let that = this
    this.type = req.type
    setTimeout(() => {
      // 获取等级
      getLevelTable().then(res => {
        if (res.status === ERR_OK) {
          that.levelTableList = res.data
          for (let l of that.levelTableList) {
            that.levalTemp[l.levelCode] = l.levelName
          }

        }
      })
      this._initEnum()
      this._initApply(this.conID)
    }, 17)
  },
  filters: {
    formatsss(val) {
      return val.code
    },
    // 佣金详细模板
    formatDetailType(val) {
      if (val !== null) {
        return val.name
      } else {
        return ''
      }
    },
    // 佣金模板
    formatCommType(val) {
      // console.log(val)
      if (val !== null) {
        return val.name
      } else {
        return ''
      }
    },
  },
  methods: {
    _initEnum() {
      getApplyEnum().then((res) => {
        if (res.status === ERR_OK) {
          this.levelList = res.data.leavels
        }
      })
    },
    _initApply(id) {
      // 申请详细
      getCoopConDetail({
        id: id
      }).then(res => {
        if (res.status === ERR_OK) {
          console.log('申请详情成功')
          this.baseInfoData = res.data
          this.baseInfoData['applyType'] = res.data.applyType === null ? '' : res.data.applyType.name
          this.baseInfoData['conType'] = res.data.conType === null ? '' : res.data.conType.name
          this.form.colAddress = res.data.address
          this.form.colAddressCn = res.data.addressCn
          this.form.colWebsite = res.data.website
          // this.baseLinkData['contacts'] = res.data.contacts
          let contactsList = res.data.contacts.map((item) => {
            return {
              username: item.username,
              position: item.position,
              tel: item.tel,
              wechat: item.wechat,
              email: item.email,
              other: item.other,
              comment: item.comment
            }
          })
          // 处理获取到的数组
          this._initFiles(res.data.attachments)
          this.setSchoolInfoList(contactsList)
        }
      }).then(() => {
        if (this.type === 'org') {
          // 机构详情查询
          getOrgDetail({
            id: this.baseInfoData.orgId
          }).then((r) => {
            if (r.status === ERR_OK) {
              this.orgData = r.data
              console.log('机构详情成功')
            }
          })
        } else if (this.type === 'school') {
          // 请求院校
          getSchoolDetail({
            id: this.baseInfoData.orgId
          }).then(r => {
            if (r.status === ERR_OK) {
              console.log('院校成功')
              this.schoolData = r.data
              this.schoolData['colProperty'] = r.data.colProperty ? r.data.colProperty.name : ''
            }
          })
        }
      })
      if (this.type === 'org') {
        // 机构等级查询
        getConOrgLevelDetail({
          conId: id
        }).then(res => {
          if (res.status === ERR_OK) {
            if (res.data) {
              this.baseLevel = res.data
              if (res.data !== null && res.data.colList.length > 0) {
                this.schoolDataList = res.data.colList.slice(0)
                this.schoolDataList.map(item => {
                  this.adp[item.colId] = item.colNameCn + '--' + item.colNameEn
                })
              }
            }
            // this.baseLevel.colList.map(item => {
            //   this.adp[item.colId] = item.colNameCn + '--' + item.colNameEn
            // })
            console.log('机构等级')
          }
        })
        // 机构佣金
        getConOrgCommDetail({
          conId: id
        }).then(res => {
          if (res.status === ERR_OK) {
            this.baseCommData['payTypes'] = res.data.payType === null ? null : res.data.payType.name
            this.baseCommData['username'] = res.data.commContact === null ? null : res.data.commContact.username
            this.baseCommData['position'] = res.data.commContact === null ? null : res.data.commContact.position
            this.baseCommData['tel'] = res.data.commContact === null ? null : res.data.commContact.tel
            this.baseCommData['fax'] = res.data.commContact === null ? null : res.data.commContact.fax
            this.baseCommData['email'] = res.data.commContact === null ? null : res.data.commContact.email
            this.baseCommData['address'] = res.data.commContact === null ? null : res.data.commContact.address
            this.baseCommData['commList'] = res.data.commList
            console.log('机构佣金成功')
            // this.baseApplyData = res.data
          }
        })
      } else if (this.type === 'school') {
        // 院校佣金
        getConDirectCommDetail({
          conId: id
        }).then(res => {
          if (res.status === ERR_OK) {
            console.log('院校佣金成功')
            this.baseCommData['payTypes'] = res.data.payType === null ? '' : res.data.payType.name
            this.baseCommData['commContact'] = res.data.commContact
            this.baseCommData['username'] = res.data.commContact === null ? '' : res.data.commContact.username
            this.baseCommData['position'] = res.data.commContact === null ? '' : res.data.commContact.position
            this.baseCommData['fax'] = res.data.commContact === null ? '' : res.data.commContact.fax
            this.baseCommData['tel'] = res.data.commContact === null ? '' : res.data.commContact.tel
            this.baseCommData['email'] = res.data.commContact === null ? '' : res.data.commContact.email
            this.baseCommData['address'] = res.data.commContact === null ? '' : res.data.commContact.address
            if (res.data.comm) {
              this.baseCommData['type'] = res.data.comm.type === null ? '' : res.data.comm.type
              this.baseCommData['mouldType'] = res.data.comm.mouldType === null ? '' : res.data.comm.mouldType
              this.baseCommData['commmemo'] = res.data.comm.memo
              this.baseCommData['extraBonus'] = res.data.comm.extraBonus
              this.baseCommData['desc'] = res.data.comm.desc
              this.commDetailList = res.data.comm.commDetailList
            }
          }
        })
        // 请求等级
        getConDirectLevelDetail({
          conId: id
        }).then(res => {
          if (res.status === ERR_OK) {
            console.log('院校等级')
            this.baseLevel = res.data
          }
        })
      }
    },
    isNew(row) {
      if (row.originalLeavel !== undefined && row.originalLeavel !== null) {
        return '存在'
      } else {
        return '不存在'
      }
    },
    _formatAdapt(id) {
      let m = this.adp[id].split('--')
      return m
    },
    // 保存基本合作信息
    _saveDirBase() {
      updateConBase({
        signInfo: this.baseInfoData.signInfo,
        id: this.conID
      }).then(res => {
        if (res.status === ERR_OK) {
          // this.$message.success('修改成功!')
          this.$alert('修改成功！', '温馨提示', {
            confirmButtonText: '知道了',
            type: 'success'
          })
        }
      })
    },
    _saveOrgBase() {
      updateConOrgBase({
        id: this.conID,
        signInfo: this.this.baseInfoData.signInfo
      }).then(res => {
        if (res.status === ERR_OK) {
          // this.$message.success('修改成功!')
          this.$alert('修改成功！', '温馨提示', {
            confirmButtonText: '知道了',
            type: 'success'
          })
        } else {
          // this.$message.error(res.msg)
          this.$alert(res.msg, '错误提示', {
            confirmButtonText: '知道了',
            type: 'error'
          })
        }
      })
    },
    // 基本信息修改
    saveBaseInfo() {
      if (this.type === 'school') {
        this._saveDirBase()
      } else if (this.type === 'org') {
        // this._saveOrgBase()
        this.updateOrgBaseInfo()
      }
    },
    _directComm() {
      this.$refs.comInfo.validate((valid) => {
        if (valid) {
          updateConDirectComm({
            conId: this.conID,
            leavel: this.baseLevel.leavel,
            coopComm: {
              extraBonus: this.baseCommData.extraBonus
            },
            commContacts: {
              username: this.baseCommData.username,
              position: this.baseCommData.position,
              tel: this.baseCommData.tel,
              email: this.baseCommData.email,
              fax: this.baseCommData.fax,
              address: this.baseCommData.address
            }
          }).then(res => {
            if (res.status === ERR_OK) {
              // this.$message.success('修改成功!')
              this.$alert('修改成功！', '温馨提示', {
                confirmButtonText: '知道了',
                type: 'success'
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
          this.$message.error('佣金联系邮箱不能为空')
        }
      })
    },
    _formatComm() {
      let list = this.baseCommData.commList.map((item) => {
        return {
          commId: item.id,
          extraBonus: item.extraBonus
        }
      })
      return list
    },
    _orgComm(type) {
      this.$refs.comInfo.validate((valid) => {
        if (valid) {
          updateConOrgComm({
            conId: this.conID,
            operatorTyp: type,
            commContacts: {
              username: this.baseCommData.username,
              position: this.baseCommData.position,
              tel: this.baseCommData.tel,
              fax: this.baseCommData.fax,
              email: this.baseCommData.email,
              address: this.baseCommData.address
            },
            coopCommList: this._formatComm()
          }).then(res => {
            if (res.status === ERR_OK) {
              // this.$message.success('修改成功!')
              this.$alert('修改成功！', '温馨提示', {
                confirmButtonText: '知道了',
                type: 'success'
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
          this.$message.error('佣金联系邮箱不能为空')
        }
      })
    },
    // 合作等级选中
    setMoreLevel(val) {
      this.setMoreLevelList = val
      this.multipleSelection = val
    },
    // 设置合作等级
    showLevel() {
      this.levelDialog = true
    },
    setLeavel() {
      this.levelDialog = false
      this.setMoreLevelList.map((item) => {
        this.schoolDataList.map((i) => {
          if (item.id === i.id) {
            i.leavel = this.moreSelLevel
          }
        })
      })
    },
    handleLevelDialog() {
      this.$refs.levelD.showLevel()
    },
    // 佣金信息修改
    saveCommInfo() {
      if (this.type === 'school') {
        this._directComm()
      } else if (this.type === 'org') {
        this._orgComm('TYPE2')
      }
    },
    // 项目信息修改
    saveProjInfo() {
      // document.getElementById("fileBox").getElementsByTagName("button")[0].style="";
      // let lens = this.fileList.length;
      // if (lens === 0) {
      //     this.$message.error('合作协议书没有上传！');
      //     document.getElementById("fileBox").getElementsByTagName("button")[0].style="border-color:#f56c6c;";
      //     window.location.hash  = "#fileBox";
      //     return
      // }
      this.$refs.projform.validate((valid) => {
        if (valid) {
          updateConProj({
            id: this.conID,
            memo: this.baseInfoData.memo,
            discPersons: this.baseInfoData.discPersons,
            embassyWebsite: this.baseInfoData.embassyWebsite,
            hocRequest: this.baseInfoData.hocRequest,
            attachs: this._formatProtocolAtta(this.fileList5)
          }).then(res => {
            if (res.status === ERR_OK) {
              // this.$message.success('修改成功!')
              this.$alert('修改成功！', '温馨提示', {
                confirmButtonText: '知道了',
                type: 'success'
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
          this.$message.error('申请特别要求不能为空!')
        }
      })
    },
    // 监听联系人
    getSchollLink(...data) {
      this.form.colAddress = data[0].address
      this.form.colAddressCn = data[0].addresscn
      this.form.colWebsite = data[0].website
    },
    // 修改
    updateLink() {
      updateConLink({
        id: this.conID,
        address: this.form.colAddress,
        addressCn: this.form.colAddressCn,
        website: this.form.colWebsite,
        contactsList: this.schoolInfoList
      }).then(res => {
        console.log(this.form)
        if (res.status === ERR_OK) {
          // this.$message.success('修改成功!')
          this.$alert('修改成功！', '温馨提示', {
            confirmButtonText: '知道了',
            type: 'success'
          })
        }
      })
    },
    _levelList() {
      if (this.type === 'org') {
        let list = this.baseLevel.colList.map((item) => {
          return {
            id: item.id,
            colName: item.colNameCn + ',' + item.colNameEn,
            leavel: item.leavel
          }
        })
        return list
      }
    },
    // 修改机构基本信息
    updateOrgBaseInfo() {
      updateConOrgComm({
        conId: this.conID,
        operatorTyp: 'TYPE1',
        singInfo: this.baseInfoData.signInfo,
        colOrgList: this._levelList(),
        version: this.baseInfoData.version
      }).then(res => {
        if (res.status === ERR_OK) {
          // this.$message.success('修改成功!')
          this.$alert('修改成功！', '温馨提示', {
            confirmButtonText: '知道了',
            type: 'success'
          })
          // 机构等级查询
          getConOrgLevelDetail({
            conId: this.conID
          }).then(res => {
            if (res.status === ERR_OK) {
              this.baseLevel = res.data
              if (res.data !== null && res.data.colList.length > 0) {
                this.schoolDataList = res.data.colList.slice(0)
                this.schoolDataList.map(item => {
                  this.adp[item.colId] = item.colNameCn + '--' + item.colNameEn
                })
              }
              console.log('机构等级')
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
    },
    ...mapMutations({
      setSchoolInfoList: 'SET_SCHOOLINFOLIST'
    })
  },
  computed: {
    isShowOrg() {
      if (this.type === 'org') {
        return true
      } else {
        return false
      }
    },
    isDirCommData() {
      if (this.baseCommData.mouldType === null || this.baseCommData.mouldType.code === 'NONSTANDARD') {
        return false
      } else {
        return true
      }
    },
    isMoudelDetail() {
      if (this.baseCommData.mouldType !== null || this.baseCommData.mouldType !== undefined) {
        // if (this.dircCommData.mouldType.code !== 'NUM_LADDER') {
        return true
        // }
      } else {
        return false
      }
    },
    ...mapGetters([
      'schoolInfoList'
    ])
  },
  watch: {
    // 对设置等级按钮权限控制
    setMoreLevelList(val) {
      if (val.length > 0) {
        this.leavelAble = false
      } else {
        this.leavelAble = true
      }
    }
  },
  components: {
    BlockBorder,
    BlockHeader,
    SubHeader,
    SchoolLink,
    FileUpload,
    LevelDialog
  }
}
</script>
