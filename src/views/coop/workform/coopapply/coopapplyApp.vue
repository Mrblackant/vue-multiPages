<template>
  <div class="lx_main">
    <sub-header title="合作项目详情" icon="hezuoxiangmuxiangqin"></sub-header>
    <block-border>
      <block-header slot="title" title="院校申请信息"></block-header>
      <div slot="container" class="lx_container">
        <el-row class="lx_row_txt">
          <el-col :span="8"><span>报审人：{{baseInfoData.applyUser}}</span></el-col>
          <el-col :span="16">
            <span>报审部门：{{baseInfoData.applyDept}}</span>
          </el-col>
        </el-row>
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
          <el-col :span="8">
            <span>报审时间：{{baseInfoData.applyDate | formatTime}}</span>
          </el-col>
        </el-row>
      </div>
    </block-border>
    <block-border>
      <block-header slot="title" title="基本合作信息"></block-header>
      <div slot="container" class="lx_container">
        <div v-if="!isShowOrg">
          <el-row class="lx_row_txt">
            <el-col :span="8"><span>院校中文名称：{{schoolData.nameCn}}</span></el-col>
            <el-col :span="16">
              <span>院校外文名称：{{schoolData.nameEn}}</span>
            </el-col>
          </el-row>
          <el-row class="lx_row_txt">
            <el-col :span="8"><span>院校性质：{{schoolData.colProperty}}</span></el-col>
            <el-col :span="16">
              <span>院校类型：
                <label v-for="item in schoolData.colTypes"
                       :key="item.code" v-if="item.checked">{{item.name}}&nbsp;&nbsp;&nbsp;</label>
              </span>
            </el-col>
          </el-row>
        </div>
        <div v-if="isShowOrg">
          <el-row class="lx_row_txt">
            <el-col :span="8"><span>机构中文名称：{{orgData.nameCn}}</span></el-col>
            <el-col :span="16">
              <span>机构外文名称：{{orgData.nameEn}}</span>
            </el-col>
          </el-row>
        </div>
        <!--<el-row class="lx_row_txt" v-if="deriveFlag">-->
        <!--<el-col :span="8">-->
        <!--<span>服务类型：{{baseInfoData.serviceType}}</span>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <el-row class="lx_row_txt">
          <el-col :span="24">
            <span>合作项目名称：{{baseInfoData.projectName}}</span>
          </el-col>
        </el-row>
        <el-row class="lx_row_txt">
          <el-col :span="8">
          <span>合同开始日期：{{baseInfoData.startTime | formatTime}}
          </span>
          </el-col>
          <el-col :span="16"><span>合同结束日期：{{baseInfoData.endTime | formatTime}}</span></el-col>
        </el-row>
        <el-row class="lx_row_txt" v-show="baseInfoData.conType&&baseInfoData.conType==='续签'">
          <el-col :span="24">
            <span>去年送生情况：{{baseInfoData.signInfo}}</span>
          </el-col>
        </el-row>
        <div v-if="isShowOrg&&!deriveFlag">
          <el-table
            :data="baseLevel.colList"
            class="width100"
            fit
            header-row-class-name="lx_table_hd"
          >
            <el-table-column prop="countryName" label="国家"></el-table-column>
            <el-table-column
              prop="colNameEn"
              label="合作院校外文名">
            </el-table-column>
            <el-table-column
              prop="colNameCn"
              label="院校中文名">
            </el-table-column>
            <el-table-column
              prop="colProperty.name"
              label="院校性质">
            </el-table-column>
            <el-table-column
              prop="leavel"
              class-name="hezuo"
              label="本次合作申请等级">
              <template prop="levelitem" slot-scope="scope">
                <el-select v-model="scope.row.leavel" placeholder="请选择" size="mini" class="lx_width_110">
                  <el-option v-for="item in levelList" :label="item.name" :value="item.code"
                             :key="item.code"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="isNew"
              :formatter="isNew"
              label="原项目中是否存在">
            </el-table-column>
            <el-table-column v-if="isShowOriginalLeavel()" label="原合作等级">
              <template prop="originalLeavel" slot-scope="scope">{{ levalTemp[scope.row.originalLeavel] }}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </block-border>
    <block-border>
      <block-header slot="title" title="院校联系信息"></block-header>
      <div slot="container">
        <el-row v-if="!isShowOrg">
          <el-col :span="8"><span>院校地址：{{baseLinkData.address}}</span></el-col>
          <el-col :span="8"><span>院校中国办事处地址：{{baseLinkData.addressCn}}</span></el-col>
          <el-col :span="8">院校网址：{{baseLinkData.website}}</el-col>
        </el-row>
        <el-row v-if="isShowOrg">
          <el-col :span="8"><span>机构地址：{{baseLinkData.address}}</span></el-col>
          <el-col :span="8"><span>机构中国办事处地址：{{baseLinkData.addressCn}}</span></el-col>
          <el-col :span="8">机构网址：{{baseLinkData.website}}</el-col>
        </el-row>
        <el-table :data="baseLinkData.contacts" header-row-class-name="lx_table_hd" class="lx_table">
          <el-table-column label="院校联系人" prop="username"></el-table-column>
          <el-table-column label="联系人职位" prop="position"></el-table-column>
          <el-table-column label="院校联系电话" prop="tel"></el-table-column>
          <el-table-column label="微信" prop="wechat"></el-table-column>
          <el-table-column label="QQ" prop="qq"></el-table-column>
          <el-table-column label="联系人邮箱" prop="email"></el-table-column>
          <el-table-column label="其他联系方式" prop="other"></el-table-column>
          <el-table-column label="备注" prop="comment"></el-table-column>
        </el-table>
      </div>
    </block-border>
    <block-border>
      <block-header slot="title" title="项目信息"></block-header>
      <el-form ref="projform" slot="container" label-width="160px" class="lx_form_baseinfo">
        <el-form-item label="项目基本情况说明">
          <!--<span>{{}}</span>-->
          <p class="lx_txt_br" v-html="baseInfoData.memos"></p>
        </el-form-item>
        <el-form-item label="参与合作讨论人员">
          <span>{{baseInfoData.discPersons}}</span>
        </el-form-item>
        <el-form-item label="上传附件"><span>每种证书可上传最多5个文件，单个文件大小最大30M，支持文件格式：PDF、word、rar/zip等常用压缩文件</span></el-form-item>
        <el-form-item label="合作协议书">
          <file-upload :isDisable="true" :attaObj="fileObj" @files="_getFileID" :attaList="fileList" :isTip="false"
                       key="one"></file-upload>
        </el-form-item>
        <el-form-item label="签字后的合作协议书" class="lx_level_main">
          <span class="lx_level_dialog lx_redcolor_up">(审批通过后上传)</span>
          <file-upload :isDisable="true" :isTip="false" key="two"></file-upload>
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
          <span>{{baseInfoData.embassyWebsite}}</span>
        </el-form-item>
        <el-form-item label="申请特别要求">
          <span>{{baseInfoData.hocRequest}}</span>
        </el-form-item>
      </el-form>
    </block-border>
    <block-border>
      <block-header slot="title" title="佣金信息"></block-header>
      <div slot="container" class="lx_container">
        <el-row class="lx_row_txt">
          <el-col :span="8"><span>佣金支付方式：{{baseCommData.payTypes}}</span></el-col>
          <el-col :span="8">
            <span>佣金联系人：{{baseCommData.username }}</span>
          </el-col>
          <el-col :span="8">
            <span>佣金联系职务：{{baseCommData.position}}</span>
          </el-col>
        </el-row>
        <el-row class="lx_row_txt">
          <el-col :span="8"><span>佣金联系电话：{{baseCommData.tel}}</span></el-col>
          <el-col :span="8">
            <span>佣金联系传真：{{baseCommData.fax}}</span>
          </el-col>
          <el-col :span="8">
            <span>佣金联系邮箱：{{baseCommData.email}}</span>
          </el-col>
        </el-row>
        <el-row class="lx_row_txt">
          <el-col><span>佣金联系人地址：{{baseCommData.address}}</span></el-col>
        </el-row>
        <!--院校佣金开始-->
        <div class="lx_comm" v-if="!isShowOrg">
          <el-row class="lx_row_txt">
            <!--<el-col><span>合作等级：{{baseLevel | formatLevel}}</span></el-col>-->
            <el-col><span id="commissionLevel">合作等级：<el-select v-model="baseLevel.leavel" placeholder="请选择" size="mini" class="lx_width_110">
                  <el-option v-for="item in levelList" :label="item.name" :value="item.code"
                             :key="item.code"></el-option>
                </el-select>
            </span>
              <span v-if="isShowOriginalLeavel()" id="origCommissionLevel">原合作等级：{{ levalTemp[baseLevel.originalLeavel] }}</span>
            </el-col>
          </el-row>
          <el-row class="lx_row_txt" style="margin-bottom: 0px;">
            <el-col>
              <span class="lx_temp_bold">佣金模板：{{dircCommData.type.name}}</span>
            </el-col>
          </el-row>
          <el-row class="lx_row_txt" v-if="moudleList.length>0" v-for="a in moudleList" :key="a.id">
            <el-col v-if="isDirCommData">
              <span class="lx_temp_bold" v-if="isMoudelDetail&&dircCommData.mouldType.code!=='NUM_LADDER'">【{{dircCommData.mouldType.name}}】</span>
            </el-col>
            <el-col v-if="dircCommData.mouldType.code!=='NUM_LADDER'">
              <!--<div class="lx_temp_bold">{{a.mouldDetailType.name}}</div>-->
              <div class="indentation">留学类别：{{a.type}}</div>
              <div class="indentation" v-if="dircCommData.mouldType.code==='FIXED'">
                <div>佣金金额：{{a.amount}}</div>
                <div>货币类型：{{a.unit}}/学生</div>
              </div>
              <div v-else class="indentation">
                <div>费用名称：{{a.chargeItem}}</div>
                <div>费用占比：{{a.percent}}%</div>
              </div>
            </el-col>
            <el-col v-else>
              <div class="lx_temp_bold" v-if="dircCommData.mouldType.code ==='NUM_LADDER'">
                【按人数梯度】&nbsp;人数{{a.minNum}}≤{{a.maxNum}}&nbsp;({{a.mouldDetailType
              | formatDetailType}})
              </div>
              <div class="indentation">留学类别：{{a.type}}</div>
              <div v-if="a.mouldDetailType!==null&&a.mouldDetailType.code==='COST_PERCENT'" class="indentation">
                <div>费用名称：{{a.chargeItem}}</div>
                <div>费用占比：{{a.percent}}%</div>
              </div>
              <div v-else class="indentation">
                <div>佣金金额：{{a.amount}}</div>
                <div>货币类型：{{a.unit}}/学生</div>
              </div>
              <!--<span v-if="a.mouldDetailType!==null && a.mouldDetailType.code==='COST_PERCENT'">{{a.mouldDetailType | formatDetailType}}：{{a.minNum}}&nbsp;&#45;&#45;&nbsp;{{a.maxNum}}&nbsp;&nbsp;{{a.type}}&nbsp;&nbsp;{{a.chargeItem}}&nbsp;&nbsp;{{a.percent}}/%</span>-->
              <!--<span v-else>{{a.mouldDetailType | formatDetailType}}：{{a.minNum}}&nbsp;&#45;&#45;&nbsp;{{a.maxNum}}&nbsp;&nbsp;{{a.type}}&nbsp;&nbsp;{{a.percent}}&nbsp;&nbsp;{{a.unit}}</span>-->
            </el-col>
          </el-row>
          <!--<el-row class="lx_row_txt" v-if="dircCommData.type!==null&&dircCommData.type.code==='STANDARD'">-->
          <!--<el-col><span>额外奖励：{{dircCommData.extraBonus}}</span></el-col>-->
          <!--</el-row>-->
          <div class="clearfix">
            <el-row class="lx_row_txt" v-if="dircCommData.type!==null&&dircCommData.type.code==='STANDARD'">
              <el-col>
                <div class="lx_ly_txt botton"><span>佣金内容：</span>
                  <p v-html="dircCommData.memo"></p>
                </div>
              </el-col>
              <el-col>
                <div class="lx_ly_txt reward"><span>额外奖励：</span>
                  <p v-html="dircCommData.extraBonus"></p>
                </div>
              </el-col>
              <el-col>
                <div class="lx_ly_txt botton"><span>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</span>
                  <p v-html="dircCommData.desc"></p>
                  <!--<p v-html="dircCommData.desc.replace(/\n/g, `</br>`)"></p>-->
                </div>
              </el-col>
            </el-row>
            <el-row class="lx_row_txt" v-if="dircCommData.type!==null&&dircCommData.type.code!=='STANDARD'">
              <el-col>
                <div class="lx_ly_txt botton"><span>佣金内容：</span>
                  <p v-html="dircCommData.memo"></p>
                </div>
              </el-col>
              <!--<el-col>-->
              <!--<div class="lx_ly_txt reward"><span>额外奖励：</span>-->
              <!--<p v-html="dircCommData.extraBonus"></p>-->
              <!--</div>-->
              <!--</el-col>-->
              <el-col>
                <div class="lx_ly_txt botton"><span>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</span>
                  <p v-html="dircCommData.desc"></p>
                  <!--<p v-html="dircCommData.desc.replace(/\n/g, `</br>`)"></p>-->
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <!--院校佣金结束-->
        <!--机构佣金开始-->
        <div v-if="isShowOrg">
          <div class="lx_comm lx_comm_diff" v-if="!deriveFlag"
               v-for="item in baseCommData.commList">
            <el-row class="lx_row_txt" style="margin-bottom: 0px;">
              <el-col><span class="lx_temp_bold">佣金模板：{{item.type | formatCommType}}</span></el-col>
            </el-row>
            <el-row class="lx_row_txt" v-for="m in item.commDetailList" :key="m.id">
              <el-col v-if="item.mouldType!==null && item.mouldType.code!=='NUM_LADDER'">
                <div class="lx_temp_bold">【{{m.mouldDetailType | formatDetailType}}】</div>
                <div class="indentation">留学类别：{{m.type}}</div>
                <div class="indentation" v-if="item.mouldType.code==='FIXED'">
                  <div>佣金金额：{{m.amount}}</div>
                  <div>货币类型：{{m.unit}}/学生</div>
                </div>
                <div class="indentation" v-else>
                  <div>费用名称：{{m.chargeItem}}</div>
                  <div>费用占比：{{m.percent}}%</div>
                </div>
              </el-col>
              <el-col v-else>
                <div class="lx_temp_bold" v-if="m.mouldDetailType!==null">【按人数梯度】&nbsp;人数：{{m.minNum}}≤{{m.maxNum}}({{m.mouldDetailType
                | formatDetailType}})
                </div>
                <div class="indentation">留学类别：{{m.type}}</div>
                <div class="indentation" v-if="m.mouldDetailType!==null && m.mouldDetailType.code==='COST_PERCENT'">
                  <div>费用名称：{{m.chargeItem}}</div>
                  <div>费用占比：{{m.percent}}%</div>
                </div>
                <div class="indentation" v-else>
                  <div>佣金金额：{{m.amount}}</div>
                  <div>货币类型：{{m.unit}}/学生</div>
                </div>
                <!--<span v-else>{{m.mouldDetailType | formatDetailType}}：{{m.minNum}}&nbsp;&#45;&#45;&nbsp;{{m.maxNum}}&nbsp;&nbsp;{{m.type}}&nbsp;&nbsp;&nbsp;&nbsp;</span>-->
              </el-col>
            </el-row>
            <!--<el-row class="lx_row_txt" v-if="item.type!==null&&item.type.code==='STANDARD'">-->
            <!--<el-col><span>额外奖励：{{item.extraBonus}}</span></el-col>-->
            <!--</el-row>-->
            <div class="clearfix">
              <el-col>
                <div class="lx_ly_txt botton"><span>佣金内容：</span>
                  <!--<p>{{item.memo}}</p>-->
                  <p v-if="item && item.memo" v-html="item.memo.replace(/\n/g,'</br>')"></p>
                </div>
              </el-col>
            </div>
            <el-row class="lx_row_txt" v-if="item.type!==null&&item.type.code==='STANDARD'">
              <el-col>
                <div class="lx_ly_txt reward"><span>额外奖励：</span>
                  <p v-if="item && item.extraBonus" v-html="item.extraBonus.replace(/\n/g,'</br>')"></p>
                </div>
              </el-col>
            </el-row>
            <div class="clearfix">
              <!--<el-col>-->
              <!--<div class="lx_ly_txt botton"><span>佣金内容：</span>-->
              <!--&lt;!&ndash;<p>{{item.memo}}</p>&ndash;&gt;-->
              <!--<p v-if="item && item.memo" v-html="item.memo.replace(/\n/g,'</br>')"></p>-->
              <!--</div>-->
              <!--</el-col>-->
              <el-col>
                <div class="lx_ly_txt botton"><span>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</span>
                  <!--<p>{{item.memo}}</p>-->
                  <p v-if="item && item.desc" v-html="item.desc.replace(/\n/g,'</br>')"></p>
                </div>
              </el-col>
            </div>
            <div class="lx_school_adapt">
              <div class="lx_lab">适合院校：</div>
              <div class="lx_school_item">
                <div v-for="i in item.colIdList" class="lx_adapt_i">
                  <!--<span v-for="j in _formatAdapt(i.id)">{{j}}</span>-->
                  <span class="lx_school_name">{{i.nameCn}}</span>
                  <span class="lx_school_name">{{i.nameEn}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="clearfix" v-else>
            <el-col>
              <div class="lx_ly_txt" style="margin-bottom: 0;" v-for="item in baseCommData.commList"><span>佣金内容：</span>
                <!--<p>{{item.memo}}</p>-->
                <p v-if="item && item.memo" v-html="item.memo.replace(/\n/g,'</br>')"></p>
              </div>
            </el-col>
            <el-col>
              <div class="lx_ly_txt" style="margin-bottom: 0;" v-for="item in baseCommData.commList"><span>备注：</span>
                <!--<p>{{item.memo}}</p>-->
                <p v-if="item && item.desc" v-html="item.desc.replace(/\n/g,'</br>')"></p>
              </div>
            </el-col>
          </div>
        </div>
        <!--机构佣金结束-->
      </div>
    </block-border>
    <!--<el-button @click="gerResult">执行</el-button>-->
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  #app {
    width: 100%;
    min-width: auto;
  }

  .lx_container {
    .lx_row_txt {
      height: 30px;
      line-height: 30px;
      margin-bottom: 15px;
      color: #303133;
      font-size: 15px;
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
      font-weight: bold;
    }
    p {
      margin: 0;
      overflow: hidden;
      font-size: 15px;
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
    color: red;
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
      font-weight: bold;
    }
    .lx_school_item {
      display: flex;
      flex: 1;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-top: 20px;
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

  .lx_temp_bold {
    font-family: "Microsoft YaHei";
    font-size: 16px;
    color: #303133;
    font-weight: bold;
  }

  .lx_color_red {
    color: #ff211a;
  }

  .el-select .el-input .el-input__inner {
    border-color: #409EFF
  }

  #commissionLevel {
    color: #409eff;
    font-weight: bold;
    font-size: 16px;
  }

  #origCommissionLevel {
    color: #303133;
    font-size: 16px;
    margin-left: 20px;
  }

  .lx_table_hd .hezuo {
    color: #409eff;
    font-weight: bold;
  }

  .indentation {
    margin-left: 40px;
    font-size: 15px;
  }

  .reward {
    margin-bottom: 0px;
    span {
      font-size: 16px;
    }
  }

  .botton {
    margin-bottom: 0px;
    font-size: 16px;
  }
</style>
<script type="text/ecmascript-6">
import SubHeader from '@/components/SubHeader'
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'
import FileUpload from '@/components/AttachFile/index'
import {getApplyEnum} from '@/api/dict'
import {ApplyFileMixin} from '@/utils/mixin'
import {sendLevel} from '@/api/coopContract'
import {
  getApplyDetail,
  getDirectCommDetail,
  getOrgCommDetail,
  getLevelDetail,
  getOrgDetail,
  getLevelOrgDetail,
  withDraw
} from '@/api/coopManage'
import {getSchoolDetail} from '@/api/schoolManage'
import {ERR_OK} from '@/utils/status'
import {isEmptyObj} from '@/utils/index'
import global_ from '@/Global'
import {GetRequest} from '@/utils/index.js'
import {getLevelTable} from '@/api/dict'
/* eslint-disable */
// window.addEventListener("message", receiveMessage, false);


//  function getUrl(paramName, urlSearch) {
//    var search = window.location.hash;
//    if (urlSearch) {
//      urlSearch = urlSearch.substr(urlSearch.lastIndexOf("?"));
//      search = urlSearch;
//    }
//    if (search && search.length > 0) {
//      search = search.substring(search.indexOf("?") + 1);
//    }
//    var result = [];
//    if (search) {
//      var searchArray = search.split("&");
//      for (var i in searchArray) {
//        var keyValue = searchArray[i].split("=");
//        if (keyValue.length === 2) {
//          if ((keyValue[0]) === paramName) {
//            result.push(keyValue[1]);
//          }
//        }
//      }
//    }
//    if (result.length === 0) {
//      return undefined;
//    } else if (result.length === 1) {
//      return result[0]
//    } else {
//      return result;
//    }
//  };

export default {
  mixins: [ApplyFileMixin],
  data() {
    return {
      tableData: [],
      baseInfoData: {}, // 基础信息数据
      baseLinkData: {}, // 联系方式数据
      baseProjectData: {}, // 项目信息数据
      baseCommData: {}, // 佣金信息数据
      baseApplyData: {}, // 申请信息
      schoolData: {}, // 院校信息
      orgData: {}, // 机构信息
      baseLevel: {}, // 等级信息
      fileList: [], // 文件
      commDetailList: [], // 佣金列表,
      adp: {},
      deriveFlag: null, // 是否为衍生服务
      withdrawTxt: null, // 撤回原因
      isWithdraw: false,
      applyTypes: '',
      dircCommData: {
        type: {
          code: '',
          name: ''
        },
        mouldType: {
          code: '',
          name: ''
        },
        extraBonus: '',
        memo: '',
        desc: ''
      },
      moudleList: [],
      levelList: [], // 合作等级枚举
      app: {},
      cbBool: true, // 修改合作等级结果状态
      cbBoolMsg: '', // 修改合作等级结果
      queryID: '',
      businessKey: '',
      levalTemp: {},
      levelTableList: []
    }
  },
  created() {
    let req = GetRequest()
    this.applyTypes = req.type
    this.queryID = req.id
    this.businessKey = req.businessKey ? req.businessKey : '未获取到businessKey'
    if (req.derive === 'true' || req.derive === true) {
      this.deriveFlag = true
    } else {
      this.deriveFlag = false
    }
    this._initApply(this.queryID)
  },
  mounted() {
    this.$nextTick(() => {
      this._initEnum()
//        this.MyWindow.document.domain = 'shinyway.org'
      window.document.domain = 'shinyway.org'
      // 多单页面对象使用window
//        let keys = `callBackBiz_${this.getOtherKey()}`
      let keys = `callBackBiz_` + this.businessKey
//        this.MyWindow[keys] = this.gerResult
      window[keys] = this.gerResult
//          window[keys] = () => {
//              this.gerResult()
//          }
    })
    let that = this
    setTimeout(() => {
      // 获取等级
      getLevelTable().then(res => {
        if (res.status === ERR_OK) {
          this.levelTableList = res.data
          for (let l of that.levelTableList) {
            that.levalTemp[l.levelCode] = l.levelName
          }
        }
      })
    }, 17)
  },
  filters: {
    formatsss(val) {
      // console.log(val)
      return val.code
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
    // 佣金详细模板
    formatDetailType(val) {
      if (val !== null) {
        return val.name
      } else {
        return ''
      }
    },
    // 合作等级
    formatLevel(val) {
      if (val !== null) {
        return val.leavel
      } else {
        return ''
      }
    }
  },
  methods: {
//      getOtherKey() {
//        // console.log('6')
//        if (!getUrl('businessKey')) {
//          return '未获取到申请编号'
//        }
//        return getUrl('businessKey')
//      },
    
    gerResult() {
      let a = {
        success: false,
        errorMsg: '合作等级不能为空'
      }
      let M = []
      if (this.applyTypes !== 'org') {
        M.push({
          id: this.baseLevel.id,
          leavel: this.baseLevel.leavel
        })
        if (!this.baseLevel.leavel) {
          this.cbBool = false
          this.cbBoolMsg = a.errorMsg
          return a
        } else {
          this.cbBool = true
          this.cbBoolMsg = ''
        }
      } else {
        // 机构审批
        let O = JSON.parse(JSON.stringify(this.baseLevel.colList))
        if (O.length === 0) {
          this.cbBool = false
          this.cbBoolMsg = '没有获取到机构院校合作列表'
          a.errorMsg = this.cbBoolMsg
          return a
        } else {
          let L = O.some(function (item) {
            return item.leavel === null || item.leavel === undefined
          })
          if (L) {
            this.cbBool = false
            this.cbBoolMsg = a.errorMsg
            return a
          } else {
            this.cbBool = true
            this.cbBoolMsg = ''
          }
        }
        M = this.formatL(this.baseLevel.colList)
      }
      sendLevel(M).then(res => {
        if (res.status === ERR_OK) {
          console.log("审批修改等级成功")
        } else {
          this.cbBool = false
          this.cbBoolMsg = '等级修改失败'
          this.$message.error('等级修改失败!')
        }
      })
      a.success = this.cbBool
      a.errorMsg = this.cbBoolMsg
      return a
    },
    _initEnum() {
      getApplyEnum().then((res) => {
        if (res.status === ERR_OK) {
          this.levelList = res.data.leavels
        }
      })
    },
    isShowOriginalLeavel(){
      if(global_.CONT_SUPP == this.baseInfoData.conTypeCode || global_.CONT_RENEW == this.baseInfoData.conTypeCode){
        return true
      }else {
        return false
      }
    },
    formatL(data) {
      let M = []
      if (data) {
        data.map(item => {
          M.push({
            id: item.id,
            leavel: item.leavel
          })
        })
      }
      return M
    },
    // 撤回
    withdraw() {
      withDraw({
        bussinessKey: this.queryID,
        comment: this.withdrawTxt,
        applyBizCode: global_.COOPAPPLY
      }).then(res => {
        if (res.status === ERR_OK) {
          this.$message.success('撤回成功')
        }
      })
    },
    _initApply(id) {
      let that = this
      // 申请详细
      getApplyDetail({
        id: id
      }).then(res => {
        if (res.status === ERR_OK) {
          this.baseInfoData = res.data
          this.baseInfoData['applyType'] = res.data.applyType === null ? '' : res.data.applyType.name
          this.baseInfoData['conTypeCode'] = res.data.conType === null ? '' : res.data.conType.code
          this.baseInfoData['conType'] = res.data.conType === null ? '' : res.data.conType.name
          this.baseLinkData['address'] = res.data.address
          this.baseLinkData['addressCn'] = res.data.addressCn
          this.baseLinkData['website'] = res.data.website
          this.baseLinkData['contacts'] = res.data.contacts.slice(0)
          this.baseInfoData['memos'] = res.data && res.data.memo ? res.data.memo.replace(/\n/g, `</br>`) : ''
          this.isWithdraw = res.data.hasRevoke
          // 处理获取到的数组
          this._initFiles(res.data.attachments)
        }
      }).then(() => {
        // let that = this
        if (this.applyTypes === 'org') {
          // 机构详情查询
          getOrgDetail({
            id: this.baseInfoData.orgId
          }).then((r) => {
            if (r.status === ERR_OK) {
              this.orgData = r.data
              console.log('机构详情成功')
            }
          })
          // 机构等级查询
          getLevelOrgDetail({
            applyId: id
          }).then(res => {
            if (res.status === ERR_OK) {
              if (res.data === null) {
                return
              }
              this.baseLevel = res.data
              if (!this.baseLevel.colList) {
                this.baseLevel.colList.map(item => {
                  this.adp[item.colId] = item.colNameCn + '--' + item.colNameEn
                })
              }
//                console.log('4:' + this.getOtherKey())

              // this.MyWindow.applyFun = this.applyWindowFun()
              // console.log('aaaamsg')
              // this.MyWindow.addEventListener("message", this.receiveMessage, false);
            }
          })
          // 机构佣金
          getOrgCommDetail({
            applyId: id
          }).then(res => {
            if (res.status === ERR_OK) {
              if (res.data !== null && res.data.payType !== null) {
                this.baseCommData['payTypes'] = res.data.payType.name
              }
              if (isEmptyObj(res.data.commContact)) {
                // return
                this.baseCommData['username'] = ''
                this.baseCommData['tel'] == ''
                this.baseCommData['fax'] = ''
                this.baseCommData['email'] = ''
                this.baseCommData['address'] = ''
                this.baseCommData['position'] = ''
              } else {
                this._isEmptyPer(res.data.commContact)
              }
              this.baseCommData['commList'] = res.data.commList
              console.log('机构佣金成功')
              // this.baseApplyData = res.data
              this.$forceUpdate() // 强制刷新渲染dom
            }
          })
        }
        // else if (this.applyTypes === 'school') {
        //   // 院校佣金
        // }
      })
      if (that.applyTypes === 'school') {
        getDirectCommDetail({
          applyId: id
        }).then(res => {
          if (res.status === ERR_OK) {
            console.log('院校佣金成功')
            if (res.data !== null) {
              that.baseCommData['payTypes'] = res.data.payType === null ? '' : res.data.payType.name
              that.baseCommData['commContact'] = res.data.commContact
              if (isEmptyObj(res.data.commContact)) {
                that.baseCommData['username'] = ''
                that.baseCommData['tel'] == ''
                that.baseCommData['fax'] = ''
                that.baseCommData['email'] = ''
                that.baseCommData['address'] = ''
                that.baseCommData['position'] = ''
              } else {
                that._isEmptyPer(res.data.commContact)
              }
              if (res.data.comm !== null) {
                // if(res.data.comm.type!==null){
                that.dircCommData.type = res.data.comm.type
                // if(res.data.comm.mouldType!=null){
                that.dircCommData.mouldType = res.data.comm.mouldType
                // }if()
                that.dircCommData.extraBonus = res.data.comm.extraBonus === null ? '' : res.data.comm.extraBonus.replace(/\n/g, `</br>`)
                that.dircCommData.memo = res.data.comm.memo === null ? '' : res.data.comm.memo.replace(/\n/g, `</br>`)
                that.dircCommData.desc = res.data.comm.desc === null ? '' : res.data.comm.desc.replace(/\n/g, `</br>`)
                if (res.data.comm.commDetailList.length > 0) {
                  that.dircCommData.commDetailList = []
                  that.dircCommData.commDetailList = res.data.comm.commDetailList
                }
              }
              // that.ba
              // if (res.data.comm.type) {
              //   that.baseCommData['type'] = res.data.comm.type
              // }
              // if (res.data.comm.mouldType) {
              //   that.baseCommData['mouldType'] = res.data.comm.mouldType
              // }
              // that.baseCommData['commmemo'] = res.data.comm.memo
              // that.baseCommData['extraBonus'] = res.data.comm.extraBonus
              // that.baseCommData['commDetailList'] = res.data.comm.commDetailList
            }
          }
        })
        // 请求等级
        getLevelDetail({
          applyId: id
        }).then(res => {
          if (res.status === ERR_OK) {
            console.log('院校等级')
            that.baseLevel = res.data
            // 请求院校
            if (res.data !== null && res.data.colId !== null) {
              getSchoolDetail({
                id: res.data.colId
              }).then(r => {
                if (r.status === ERR_OK) {
                  console.log('院校成功')
                  that.schoolData = r.data
                  if (r.data === null) {
                    return
                  }
                  that.schoolData['colProperty'] = r.data.colProperty === null ? '' : r.data.colProperty.name
                }
              })
            }
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
    _isEmptyPer(obj) {
      if (obj.hasOwnProperty('username')) {
        this.baseCommData['username'] = obj.username
      } else {
        this.baseCommData['username'] = ''
      }
      if (obj.hasOwnProperty('tel')) {
        this.baseCommData['tel'] = obj.tel
      } else {
        this.baseCommData['tel'] == ''
      }
      if (obj.hasOwnProperty('fax')) {
        this.baseCommData['fax'] = obj.fax
      } else {
        this.baseCommData['fax'] = ''
      }
      if (obj.hasOwnProperty('email')) {
        this.baseCommData['email'] = obj.email
      } else {
        this.baseCommData['email'] = ''
      }
      if (obj.hasOwnProperty('address')) {
        this.baseCommData['address'] = obj.address
      } else {
        this.baseCommData['address'] = ''
      }
      if (obj.hasOwnProperty('position')) {
        this.baseCommData['position'] = obj.position
      } else {
        this.baseCommData['position'] = ''
      }
    }
    // _formatAdapt(id) {
    //   let m = this.adp[id].split('--')
    //   return m
    // }
  },
  computed: {
    isShowOrg() {
      if (this.applyTypes === 'org') {
        return true
      } else {
        return false
      }
    },
    
    isBaseCommData() {
      
      if (this.baseCommData.type !== null && this.baseCommData.type.code === 'STANDARD') {
        return true
      } else {
        return false
      }
    },
    isDirCommData() {
      if (this.dircCommData.mouldType === null) {
        return false
      } else {
        return true
      }
    },
    isMoudelDetail() {
      if (this.dircCommData.mouldType !== null || this.dircCommData.mouldType !== undefined) {
        // if (this.dircCommData.mouldType.code !== 'NUM_LADDER') {
        return true
        // }
      } else {
        return false
      }
    }
  },
  watch: {
    dircCommData: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.moudleList = []
          if (newVal.commDetailList) {
            newVal.commDetailList.map(item => {
              // console.log(item)
              this.moudleList.push(item)
            })
          }
        }
      },
      deep: true
    }
  },
  components: {
    BlockBorder,
    BlockHeader,
    SubHeader,
    FileUpload
  }
}
</script>
