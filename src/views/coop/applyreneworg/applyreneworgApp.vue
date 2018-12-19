<template>
  <div class="lx_container">
    <div class="lx_main">
      <sub-header title="编辑合作机构项目（院校）"></sub-header>
      <block-border>
        <block-header title="机构申请信息" slot="title"></block-header>
        <div slot="container" class="lx_container">
          <el-row class="lx_row_txt">
            <el-col :span="8">
              <span>申请类型：合作机构合作
                <el-tag>{{_getConType()}}</el-tag>
              </span>
            </el-col>
            <el-col :span="8">
              <span>机构国家：{{baseInfo.countryName}}</span>
            </el-col>
            <el-col :span="8">
              <span>合作类型：机构院校合作</span>
            </el-col>
          </el-row>
        </div>
      </block-border>
      <block-border>
        <block-header title="基本合作信息" slot="title"></block-header>
        <div slot="container" class="lx_container">
          <el-form :model="form" label-width="120px" :rules="rules" class="lx_form_baseinfo" ref="baseForm" id="basicMsg">
            <el-row>
              <el-col class="lx_col" :span="8">
                <label class="label_cont">机构中文名称：</label>
                <div class="item_cont">{{baseInfo.nameCn}}</div>
              </el-col>
              <el-col class="lx_col" :span="16">
                <label class="label_cont">机构外文名称：</label>
                <div class="item_cont">{{baseInfo.nameEn}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16">
                <el-form-item label="合作项目" label-width="120px">
                  <!--<el-input v-model="form.projName" placeholder="请输入项目名称"></el-input>-->
                  <span>{{form.projName}}</span>
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
                    placeholder="选择日期" :disabled="isSupp()">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="合同结束日期" prop="enddate">
                  <el-date-picker
                    v-model="form.enddate"
                    :picker-options="pickerEndDateAfter"
                    @change="changeEndDate"
                    type="date"
                    placeholder="选择日期" :disabled="isSupp()">
                  </el-date-picker>
                  &nbsp;&nbsp;
                  <el-checkbox @change="changeForever" v-model="form.isForever" border v-if="!isSupp()">永久</el-checkbox>
                  <span v-if="!isSupp()">（勾选后，默认合同到期时间为2050年12月31号）</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16">
                <el-form-item label="去年送生情况">
                  <el-input v-model="form.pastyearInfo" maxlength="100" placeholder="请输入" class="inline"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="lx_set_btn">
            <div>
              <el-button :disabled="leavelAble" @click="handleSelDelSchool" style="margin-left: -44px;">删除选中</el-button>
              <el-button @click="showLevel" :disabled="leavelAble">批量设置合作等级</el-button>
              <el-button type="text" @click="handleLevelDialog">查看等级评判标准</el-button>
            </div>
            <div>
              <el-button type="primary" plain @click="addSchoolShow" id="addSchool">+新增院校</el-button>
            </div>
          </div>
          <el-table :data="selectedSchoolData"
                    @selection-change="setMoreLevel"
                    header-row-class-name="lx_table_hd">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="countryName" label="国家"></el-table-column>
            <el-table-column prop="nameEn" label="院校外文名"></el-table-column>
            <el-table-column prop="nameCn" label="院校中文名"></el-table-column>
            <el-table-column prop="colProperty.name" label="院校性质"></el-table-column>
            <el-table-column label="本次申请合作等级">
              <template prop="levelitem" slot-scope="scope">
                <el-select v-model="scope.row.leavelItem" placeholder="请选择" size="mini"
                           class="lx_width_110">
                  <el-option v-for="item in levelList" :label="item.name" :value="item.code"
                             :key="item.code"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="isNew"
                             :formatter="isNew"
                             label="原项目中是否存在"></el-table-column>
            <el-table-column label="原合作等级">
              <template prop="originalLeavel" slot-scope="scope" >{{ levalTemp[scope.row.originalLeavel] }}</template>
            </el-table-column>
            <el-table-column label="操作" width="80px" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" plain @click="handleDelSchool(scope.row,scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </block-border>
      <school-link :disableLink="true" @schoolform="getSchollLink" :isOrg="true" :onlyRead="false" :isAdd="true"
                   :dataAddress="linkform.colAddress"
                   :dataAddressCn="linkform.colAddressCn"
                   :dataWebsite="linkform.colWebsite">
      </school-link>
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
          </el-form-item>
          <el-form-item label="参与合作讨论人员">
            <el-input placeholder="请输入内容" v-model="form.discPersons" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="上传附件"><span>每种证书可上传最多5个文件，单个文件大小最大30M，支持文件格式：PDF、word、rar/zip等常用压缩文件</span></el-form-item>
          <el-form-item label="合作协议书" class="is-required" id="fileItem">
            <file-upload :attaObj="fileObj" @files="_getFileID" :attaList="fileList" :isTip="false"
                         key="one"></file-upload>
          </el-form-item>
          <el-form-item label="签字后的合作协议书" class="lx_level_main">
            <span class="lx_level_dialog lx_redcolor_up">(审批通过后上传)</span>
            <file-upload :isDisable="true" :isTip="false" key="two"></file-upload>
          </el-form-item>
          <el-form-item label="使馆认证书">
            <file-upload :attaObj="fileObj1" @files="_getFileID1" :attaList="fileList1" :isTip="false"
                         key="three"></file-upload>
          </el-form-item>
          <el-form-item label="合作机构资质证明">
            <file-upload :attaObj="fileObj2" @files="_getFileID2" :attaList="fileList2" :isTip="false"
                         key="four"></file-upload>
          </el-form-item>
          <el-form-item label="合作机构宣传资源">
            <file-upload :attaObj="fileObj3" @files="_getFileID3" @delFile="_getFileID3" :atta-list="fileList3"
                         :isTip="false"
                         key="five"></file-upload>
          </el-form-item>
          <el-form-item label="使馆认证网址">
            <el-input v-model="form.embassyWebsite" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="申请特别要求" prop="hocRequest" id="hocRequest">
            <el-input v-model="form.hocRequest" maxlength="100"></el-input>
          </el-form-item>
        </el-form>
      </block-border>
      <block-border>
        <block-header slot="title" title="佣金信息" id="comInfo"></block-header>
        <div slot="container">
          <el-form :model="form" label-width="150px" class="lx_form_label_16">
            <el-row>
              <el-col :span="8">
                <el-form-item label="佣金支付方式" class="is-required">
                  <el-select v-model="form.payType" placeholder="请选择佣金支付方式" class="width100">
                    <el-option v-for="item in payTypeList" :label="item.name" :value="item.code"
                               :key="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="佣金联系人">
                  <el-input v-model="form.commContacts.username" placeholder="请输入佣金联系人" maxlength="100"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="佣金联系职务">
                  <el-input v-model="form.commContacts.position" placeholder="请输入" maxlength="150"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="佣金联系电话">
                  <el-input v-model="form.commContacts.tel" placeholder="请输入" maxlength="40"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="佣金联系传真">
                  <el-input v-model="form.commContacts.fax" placeholder="请输入" maxlength="40"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="佣金联系邮箱" class="is-required">
                  <el-input v-model="form.commContacts.email" placeholder="请输入" maxlength="100"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="佣金联系人地址">
                  <el-input v-model="form.commContacts.address" placeholder="请输入" maxlength="250"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!--非标准模板-->
          <div v-if="coopApplyCommList1.length>0" v-for="(item,index) in coopApplyCommList1"> <!--添加的模板-->
            <div class="lx_tmp_title">
              <h2>【*佣金模板{{index | formatterNum}}】</h2>
              <span class="lx_tool_tmp_btn">
            <el-button type="primary" plain @click="editTmp(item,index)">编辑</el-button>
            <el-button plain @click="delTmp(item,index)">删除</el-button>
          </span>
            </div>
            <el-form label-width="150px" class="lx_form_label_16" :disabled="true">
              <el-form-item label="按固定佣金" v-if="item.hasOwnProperty('mouldType') && item.mouldType==='FIXED'">
                <div class="lx_flex_broke lx_pdb_10" v-for="(n,index) in item.commDetailRequestList">
                  <el-input class="lx_flex_item lx_flex_2" v-model="n.type" disabled :key="index"
                            :title="n.type"></el-input>
                  <el-input v-model="n.amount" placeholder="输入佣金金额" class="lx_flex_item lx_flex_2" type="text"></el-input>
                  <el-select v-model="n.unit" placeholder="请选择" class="lx_flex_item lx_flex_1 lx_short_wd">
                    <el-option v-for="j in unitList" :label="j.name" :value="j.code" :key="j.code"></el-option>
                  </el-select>
                  <span class="lx_flex_item lx_broke_span">/学生</span>
                </div>
              </el-form-item>
              <el-form-item label="按费用百分比" v-if="item.hasOwnProperty('mouldType') && item.mouldType==='COST_PERCENT'">
                <div class="lx_flex_broke lx_pdb_10" v-for="(n,index) in item.commDetailRequestList">
                  <el-input class="lx_flex_item lx_flex_2" v-model="n.type" disabled :title="n.type"></el-input>
                  <el-input v-model="n.chargeItem" placeholder="输入费用名称" class="lx_flex_item lx_flex_2"></el-input>
                  <el-input v-model="n.percent" placeholder="费用占比" type="text"
                            class="lx_flex_item lx_flex_1 lx_short_wd"></el-input>
                  <span class="lx_flex_item lx_broke_span">%</span>
                </div>
              </el-form-item>
              <el-form-item label="按人数梯度" v-if="item.hasOwnProperty('mouldType') && item.mouldType==='NUM_LADDER'">
                <div class="lx_grads">
                  <div class="lx_grads_header">
                    <div class="lx_grads_nums">人数</div>
                    <div class="lx_grads_charge">收取费用</div>
                  </div>
                  <div class="lx_grads_body">
                    <div class="lx_grads_row" v-for="(n,index) in item.commDetailRequestList" :key="index">
                      <div class="lx_grads_nums">
                        <el-input size="mini" class="lx_width_70" placeholder="请输入" :disabled="true"
                                  v-model="n.minNum"></el-input>
                        &nbsp;&nbsp;≤&nbsp;&nbsp;
                        <el-input size="mini" class="lx_width_70" placeholder="请输入" type="text" v-model="n.maxNum"></el-input>
                      </div>
                      <div class="lx_grads_charge">
                  <span class="lx_grads_span">
                    <el-select v-model="n.mouldDetailType" placeholder="请选择"
                               size="mini"
                               class="lx_width_150">
                    <el-option v-for="j in costList" :label="j.name" :value="j.code" :key="j.code"></el-option>
                    </el-select>
                  </span>
                        <span class="lx_grads_span">
                        <el-input v-model="n.type" size="mini" :title="n.type"
                                  class="lx_width_110"></el-input>
                  </span>
                        <span class="lx_grads_span">
                    <el-input v-if="n.zanbiFlag" v-model="n.chargeItem" placeholder="费用名称" class="lx_width_110"
                              size="mini"></el-input>
                    <el-input v-else v-model="n.amount" placeholder="费用金额" class="lx_width_110" type="text"
                              size="mini"></el-input>
                  </span>
                        <span class="lx_grads_span">
                    <el-input v-if="n.zanbiFlag" v-model="n.percent" placeholder="费用占比" size="mini" type="text"
                              class="lx_width_110"></el-input>
                    <el-select v-else v-model="n.unit" placeholder="请选择币种" size="mini"
                               class="lx_width_110">
                      <el-option v-for="m in unitList" :label="m.name" :value="m.code" :key="m.code"></el-option>
                    </el-select>
                  </span>
                        <span class="lx_grads_span">
                    <label v-if="n.zanbiFlag">%</label>
                    <label v-else>学生</label>
                  </span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="佣金内容">
                <el-input :autosize="{ minRows: 4, maxRows: 6}"
                          type="textarea"
                          v-model="item.memo">
                </el-input>
              </el-form-item>
              <el-form-item v-if="item.hasOwnProperty('extraBonus')&&item.extraBonus!==null" label="额外奖励">
                <el-input v-model="item.extraBonus"
                          :autosize="{ minRows: 4, maxRows: 6}"
                          type="textarea"
                          maxlength="500"
                          placeholder="输入额外奖励条款，此部分金额不支持自动计算"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input :autosize="{ minRows: 4, maxRows: 6}"
                          type="textarea"
                          v-model="item.desc">
                </el-input>
              </el-form-item>
              <el-form-item label="适合院校">
                <el-checkbox-group v-model="item.colIdList" :disabled="true">
                  <el-checkbox v-for="ch in item.colIdList" :label="ch" :key="ch.id" border
                               class="lx_chk_comm_school">
                    <span class="lx_chk_school_name">{{ch.nameEn}}</span>
                    <span class="lx_chk_school_name">{{ch.nameCn}}</span>
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </div>
          <!--新增模板按钮开始-->
          <comm-tmpt
            ref="commtmpl"
            :moulds-list="mouldsList"
            :scholl-list="selectedSchoolData"
            :school-types="schoolTypes"
            :unit-list="unitList"
            :cost-list="costList"
            :temp-list="tempList"
            :is-temp="isTemp"
            :temp-school-list="parentTmpSchool"
            :disable-school-list="disAbleSchool"
            :is-r="true"
            key="tmp"
            @code="getCounCode"
            @comm-list="getCommItem"
            @comm-save="getSaveCommItem"
            @is-edit="getIsEdit"
            @is-temp="_isTemp"
          ></comm-tmpt>
          <!--新增模板按钮结束-->
        </div>
      </block-border>
      <div class="lx_btn_center">
        <el-button @click="submitApply('TYPE1')">保存</el-button>
        <el-button type="primary" @click="submitApply('TYPE2')" id="saveButton">提交申请</el-button>
      </div>
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
            <el-select v-model="form.moreSelLevel" placeholder="请选择">
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
      <!--新增院校开始-->
      <el-dialog
        :visible.sync="addSchoolDialog"
        center class="lx_dialog lx_addschool_dialog"
        width="770px">
        <div class="lx_dialog_title" slot="title">
          <h2>新增院校</h2>
        </div>
        <div class="lx_dialog_main">
          <el-form :model="form" label-width="80px" class="lx_form_label_16">
            <el-row :gutter="40">
              <el-col :span="8">
                <el-form-item label='国家' label-width="60px">
                  <country :data="countryData" title="国家选择" :parentVal="countrylist" :more="false" :showTxt="false"
                           :isInBody="true"
                           :inputVal="inputVal"
                           :isCancelCheck="false" key="one"
                           @country="getSelCountry"></country>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="院校名称">
                  <el-input v-model="form.schoolName" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-button type="priamry" @click="getSchoolList(0)">查询</el-button>
              </el-col>
            </el-row>
          </el-form>
          <el-table :data="schoolListData"
                    ref="moreSchoolMult"
                    @selection-change="handleMoreSchool"
                    header-row-class-name="lx_table_hd lx_table_hd_blue">
            <el-table-column type="selection"></el-table-column>
            <el-table-column
              prop="countryName"
              label="国家">
            </el-table-column>
            <el-table-column
              prop="nameEn"
              label="院校外文名">
            </el-table-column>
            <el-table-column
              prop="nameCn"
              label="院校中文名">
            </el-table-column>
          </el-table>
          <div class="lx_page" style="margin-top: 10px; margin-bottom: 0px" v-if="isShowPage">
            <el-pagination
              @size-change="handleSchoolSizeChange"
              @current-change="handleSchoolCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 15, 20, 30]"
              :page-size="10"
              prev-text="上一页"
              next-text="下一页"
              layout="total, sizes, prev, pager, next, jumper"
              :total="schoolTotalCount">
            </el-pagination>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" round size="mini" @click="handleSelSchool">确 定</el-button>
          <el-button @click="addSchoolDialog = false" round size="mini">取 消</el-button>
        </div>
      </el-dialog>
      <!--新增院校结束-->
      <level-dialog ref="levelD" :table-list="levelTableList"></level-dialog>
    </div>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  /*@import "./parentorg";*/
  .lx_container {
    .lx_row_txt {
      //height: 30px;
      line-height: 30px;
      margin-bottom: 15px;
      color: #303133;
      font-size: 16px;
      font-family: "Microsoft YaHei";
    }
  }

  .lx_pastinfo {
    display: flex;
    overflow: hidden;
    margin-top: 10px;
    span {
      display: block;
      line-height: 40px;
      width: 120px;
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

  .lx_level_main {
    position: relative;
    .el-form-item__label {
      line-height: 22px;
    }
  }

  .lx_form_label_16 {
    .el-form-item__label {
      font-size: 16px;
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
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
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

  .lx_set_btn {
    margin: 0 80px 20px 43px;
    display: flex;
    justify-content: space-between;
  }

  .lx_set_morelevel {
    display: flex;
    .lx_set_span {
      font-size: 16px;
      line-height: 42px;
      margin-right: 30px;
    }
  }

  .lx_dialog.lx_addschool_dialog {
    div.el-dialog__body {
      padding-left: 0;
    }
  }

  .lx_form_tmp_dialog {
    margin-top: 20px;
    margin-right: 30px;
  }

  .lx_chk_comm_school {
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
    .lx_chk_school_name {
      text-align: left;
      display: block;
    }
    .el-checkbox__input {
      position: absolute;
      top: 50%;
      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      transform: translateY(-50%);
      left: 10px;
    }
    .el-checkbox__label {
      padding-left: 25px;
    }
  }

  .lx_chk_comm_school.is-bordered {
    height: auto;
  }

  .lx_tmp_title {
    height: 78px;
    line-height: 78px;
    border-top: 1px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 20px;
    h2 {
      color: #2196f3;
      font-size: 16px;
      font-family: "Microsoft YaHei";
      font-weight: 500;
      line-height: 78px;
      margin: 0;
    }
  }

  .lx_tool_tmp_btn {
    margin-right: 40px;
  }

</style>
<script type="text/ecmascript-6">
import SubHeader from '@/components/SubHeader'
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'
import Country from '@/components/Country'
import SchoolLink from '@/components/SchoolLinkInfo'
import CommTmpt from '@/views/components/comm/addCommTmp'
import FileUpload from '@/components/AttachFile/index'
import LevelDialog from '@/views/components/levelDialog/levelDialog'
import {getTime, GetRequest} from '@/utils/index'
import {getApplyEnum, getSchoolType, getLevelTable} from '@/api/dict'
import {ERR_OK} from '@/utils/status'
import {CountryMixin, ApplyFileMixin, EditFormValit, GetCommSchoolListMxin} from '@/utils/mixin'
import {searchSchool} from '@/api/coopManage'
import {SimplifiedChinese} from '@/utils/index'
import {addOrgProject} from '@/api/coopManage'
import {mapGetters, mapMutations} from 'vuex'
import {getOrgDetail} from '@/api/coopManage'
import {
  getCoopConDetail,
  getConOrgCommDetail,
  getConOrgLevelDetail
} from '@/api/coopContract'
import global_ from '@/Global'

export default {
  mixins: [CountryMixin, EditFormValit, ApplyFileMixin, GetCommSchoolListMxin],
  data() {
    return {
      levelDialog: false, // 设置合作等级弹出窗
      addSchoolDialog: false, // 新增院校弹出窗
      addCommDialog: false, // 新增佣金模板
      setMoreLevelList: [],
      moreSelSchool: [], // 新增院校多选
      selectedSchoolData: [], // 选中学校
      schoolListData: [], // 学校列表
      multipleSelection: [], // 多选的数据
      commSchoolIDList: [], // 佣金学校列表,用来临时存储
      checkListID: [], // 选中佣金模板的大学列表ID
      coopApplyCommList1: [], // 佣金模板
      leavelAble: true,
      form: {
        projName: '', // 项目名称
        startdate: null, // 开始时间
        enddate: null, // 结束时间
        pastyearInfo: '', // 去年送生信息
        moreSelLevel: null, // 批量合作等级选中
        schoolName: null, // 院校名称
        payType: null, // 佣金支付方式
        commContacts: {
          username: '', // 佣金联系人
          position: '', // 佣金联系职务
          tel: '', // 佣金联系电话
          fax: '', // 佣金联系传真
          email: '', // 佣金联系邮箱
          address: '' // 佣金联系地址
        },
        commtmp: 'STANDARD', // 佣金模板标准或非标准。1：标准模板，2：非标准模板,
        commsel: 'FIXED', // 佣金模板选择
        memo: '', // 项目基本情况说吧
        discPersons: '' // 参与合作讨论人员
      },
      linkform: {
        colAddress: null,
        colAddressCn: null,
        colWebsite: null
      },
      baseInfo: {
        countryName: null, // 机构国家
        nameCn: null,
        nameEn: null
      },
      payTypeList: [], // 支付方式枚举
      levelList: [], // 合作等级枚举
      unitList: [], // 币种
      costList: [], // 费用类型 (固定佣金，费用占比)
      costTypeList: [], // 费用类别 （语言，预科等）
      mouldsList: [], // 模板类型
      commForm: { // 佣金模板表单
        type: '', // 佣金类别
        unit: '', // 佣金单位
        chargeItem: '', // 费用名称
        amount: '', // 费用
        percent: '', // 百分比
        extraBonus: '', // 额外奖励
        memo: '' // 文本描述
      },
      gradList: [
        {
          minNum: 1, // 最小值
          maxNum: null, // 最大值
          mouldDetailType: 'COST_PERCENT', // 佣金类别
          type: null, // 类别
          chargeItem: null, // 费用名称
          percent: null,
          unit: null,
          amount: null,
          zanbiFlag: true
        }
      ], // 添加梯度
      fixaList: [
        {
          type: '请选择',
          amount: null,
          unit: null
        }
      ], // 添加固定佣金
      percentList: [
        {
          type: '请选择',
          chargeItem: '',
          percent: ''
        }
      ], // 添加百分比佣金
      commTmpFlag: false, // 标准和非标准模板选择
      commPersonTmpFlag: false, // 人数梯度模板
      commFixationTmpFlag: true, // 固定佣金模板
      commPercentTmpFlag: false, // 百分比模板
      contactsList: [], // 机构联系人
      orgId: null,
      id: null,
      schoolTypes: [],
      tempList: {}, // 需要编辑的模板对象
      isTemp: false, // 是否是佣金模板编辑对象
      levelTableList: [], // 评判标准
      pickerStartDateAfter: { // 开始时间判定
        disabledDate: (time) => {
          // let beginDateVal = this.form.startdate
          let endDateVal = this.form.enddate
          if (endDateVal) {
            if (endDateVal.constructor === Date) {
              endDateVal = endDateVal.getTime()
            }
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
      parentTmpSchool: [],
      disAbleSchool: [],
      listOfOrgCountry: [],
      schoolTotalCount: 0,
      schoolPageNum: 1,
      schoolPageSize: 10,
      queryID: '',
      conType: '',
      levalTemp: {}
    }
  },
  filters: {
    // 过滤模板title
    formatterNum(val) {
      let num = parseInt(val + 1)
      return SimplifiedChinese(num)
    }
  },
  mounted() {
    this.initCountryParam = false
    let req = GetRequest()
    this.queryID = req.id
    this.conType = req.conType
    let that = this
    window.document.getElementsByTagName('title')[0].innerText = this._getConType() + '--机构院校合作项目'
    if (!this.queryID) {
      window.location.href = 'applymethod.html'
//        this.$router.push({
//          name: 'Method'
//        })
    } else {
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
        this._initApply(this.queryID)
      }, 17)
    }
  },
  methods: {
    // 永久
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
    isSupp() {
      return global_.CONT_SUPP === this.conType
    },
    _getConType(){
      if(global_.CONT_SUPP === this.conType){
        return "补充协议"
      }else {
        return "续签"
      }
    },
    // 禁用的学校
    _isTemp() {
      // if (this.coopApplyCommList1.length) {
      //   this.disAbleSchool.length = 0
      //   this.coopApplyCommList1.map(item => {
      //     if (item.colIdList) {
      //       item.colIdList.map(n => {
      //         this.disAbleSchool.push(n.colId)
      //       })
      //     }
      //   })
      // } else {
      //   this.disAbleSchool.length = 0
      // }
      let M = [...this.orgSchoolCommList]
      const allComm = new Map() // 被选中的所有院校
      let List = JSON.parse(JSON.stringify(this.coopApplyCommList1))
      if (List && List.length > 0) {
        for (let i = 0; i < List.length; i++) {
          List[i].colIdList.forEach(item => {
            allComm.set(item.colId, true)
          })
        }
      }
      // const maps = new Map() // 当前院校
      // item.colIdList.map((m) => {
      //   maps.set(m.colId, 1)
      // })
      M.map(item => {
        if (allComm.get(item.colId)) {
          item['disable'] = true
        } else {
          item['disable'] = false
        }
      })
      this.setOrgSchoolCommList(M)
    },
    getCounCode(data) {
      this._initType(data)
    },
    _initEnum() {
      getApplyEnum().then((res) => {
        if (res.status === ERR_OK) {
          this.levelList = res.data.leavels
          this.payTypeList = res.data.payTypes
          this.mouldsList = res.data.moulds
          this.unitList = res.data.units
          res.data.moulds.map((item) => {
            if (item.code !== 'NUM_LADDER') {
              this.costList.push(item)
            }
          })
          this.costTypeList = res.data.types
        }
      })
    },
    // 院校类别
    _initType(params) {
      getSchoolType({
        countryCodes: params
      }).then(res => {
        if (res.status === ERR_OK) {
          // console.log('aaa')
          this.schoolTypes = res.data
        }
      })
    },
    handleLevelDialog() {
      this.$refs.levelD.showLevel()
    },
    _initOrg(id) {
      getOrgDetail({
        id: id
      }).then(res => {
        if (res.status === ERR_OK) {
          // console.log('成功')
          this.baseInfo.countryName = res.data.countryName
          this.baseInfo.nameCn = res.data.nameCn
          this.baseInfo.nameEn = res.data.nameEn
          this.listOfOrgCountry = res.data.listOfOrgCountry
          if (res.data.listOfOrgCountry.length > 0) {
            res.data.listOfOrgCountry.map((item) => {
              this.countryCodes.push(
                item.code
              )
            })
            this._initCountry(this.countryCodes)
          }
        }
      })
    },
    _initApply(id) {
      getCoopConDetail({
        id: id
      }).then(res => {
        if (res.status === ERR_OK) {
          this.form.projName = res.data.projectName
          this.form.isForever = res.data.isForever
          this.form.startdate = new Date(res.data.startTime)
          this.form.enddate = new Date(res.data.endTime)
          this.form.pastyearInfo = res.data.signInfo
          this.linkform.colAddress = res.data.address
          this.linkform.colAddressCn = res.data.addressCn
          this.linkform.colWebsite = res.data.website
          this.contactsList = res.data.contacts
          this.setSchoolInfoList(this.formtLink(this.contactsList))
          this.form.memo = res.data.memo
          this.form.discPersons = res.data.discPersons
          this.form.embassyWebsite = res.data.embassyWebsite
          this.form.hocRequest = res.data.hocRequest
          // 处理获取到的数组
          this._initFiles(res.data.attachments)

          this._initOrg(res.data.orgId)
          this.orgID = res.data.orgId
          // console.log('申请成功')
          getConOrgLevelDetail({
            conId: id
          }).then(res => {
            if (res.status === ERR_OK) {
              // if()
              let selSchoolData = []
              if (res.data !== null) {

                res.data.colList.map((item) => {
                  selSchoolData.push({
                    colId: item.colId,
                    countryCode: item.countryCode,
                    countryName: item.countryName,
                    nameEn: item.colNameEn,
                    nameCn: item.colNameCn,
                    colProperty: item.colProperty,
                    leavelItem: item.leavel,
                    originalLeavel: item.leavel
                  })
                  // this.adp[item.colId] = item.colNameCn + '--' + item.colNameEn // java中 仿map 做法
                })
              }
              this.setOrgSchoolCommList(selSchoolData)
              console.log('机构等级成功')

              getConOrgCommDetail({
                conId: id
              }).then(r => {
                if (r.status === ERR_OK) {
                  this.form.payType = r.data.payType === null ? null : r.data.payType.code
                  this.form.commContacts.username = r.data.commContact === null ? null : r.data.commContact.username
                  this.form.commContacts.address = r.data.commContact === null ? null : r.data.commContact.address
                  this.form.commContacts.email = r.data.commContact === null ? null : r.data.commContact.email
                  this.form.commContacts.fax = r.data.commContact === null ? null : r.data.commContact.fax
                  this.form.commContacts.position = r.data.commContact === null ? null : r.data.commContact.position
                  this.form.commContacts.tel = r.data.commContact === null ? null : r.data.commContact.tel
                  let tmpCommList = r.data.commList
                  let setList = []
                  // console.log(tmpCommList)
                  tmpCommList.map((item) => {
                    // console.log(item)
                    delete item.id
                    delete item.version
                    setList.push({
                      colIdList: item.colIdList.map(m => {
                        return {colId: m.id, nameCn: m.nameCn, nameEn: m.nameEn}
                      }),
                      commDetailRequestList: item.commDetailList.map(i => {
                        delete i.id
                        delete i.commId
                        delete i.version
                        delete i.gradient
                        // if (item.mouldType === 'NUM_LADDER') {
                        // i['zanbiFlag'] = true
                        if (i.mouldDetailType.code === 'COST_PERCENT') {
                          i.zanbiFlag = true
                        } else {
                          i.zanbiFlag = false
                        }
                        // }
                        i.mouldDetailType = i.mouldDetailType.code
                        return i
                      }),
                      extraBonus: item.extraBonus,
                      memo: item.memo,
                      desc: item.desc,
                      mouldType: item.mouldType === null ? null : item.mouldType.code,
                      payType: item.payType === null ? null : item.payType.code,
                      type: item.type === null ? null : item.type.code
                    })
                  })
                  this.setOrgCommList(setList)
                  this.coopApplyCommList1 = this.orgCommList
                  // this.coopApplyCommList = tmpCommList
                  this._isTemp()
                  console.log('机构佣金成功')
                }
              })
            }
          })
        }
      })
    },
    // 过滤联系人信息
    formtLink(data) {
      let l = []
      data.map((item) => {
        l.push({
          username: item.username,
          position: item.position,
          tel: item.tel,
          qq: item.qq,
          wechat: item.wechat,
          email: item.email,
          other: item.other,
          comment: item.comment
        })
      })
      return l
    },
    getSchoolList(num) {
      searchSchool({
        countryCodes: this.sendCountry,
        name: this.form.schoolName,
        pageNum: num === 0 ? 1 : this.schoolPageNum,
        pageSize: this.schoolPageSize
      }).then(res => {
        if (res.status === ERR_OK) {
          this.schoolPageNum = res.data.page
          this.schoolTotalCount = res.data.totalCount
          this.schoolListData = res.data.list
        }
      })
    },
    getIsEdit(data) { // 获取新增派发的状态，并设置为新增状态
      // console.log(data)
      this.isTemp = data
    },
    // 查看评判标准
    showJudge() {
      this.judgeFlag = true
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
    // 设置合作等级
    showLevel() {
      this.levelDialog = true
    },
    setLeavel() {
      this.levelDialog = false
      this.setMoreLevelList.map((item) => {
        this.selectedSchoolData.map((i) => {

          if (item.colId === i.colId) {
            i.leavelItem = this.form.moreSelLevel
          }
        })
      })
    },
    // 格式化适合院校
    // _formatAdapt(id) {
    //   let m = this.adp[id].split('--')
    //   return m
    // },
    // 合作等级选中
    setMoreLevel(val) {
      this.setMoreLevelList = val
      this.multipleSelection = val
    },
    // 新增院校弹窗
    addSchoolShow() {
      this.addSchoolDialog = true
    },
    // 删除选中的院校
    handleDelSchool(col, index) {
      this.$confirm('此操作将删除该院校, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // alert(index)

        // let  that=this
        this.selectedSchoolData.splice(index, 1)
        // this.setOrgSchoolCommList(this.selectedSchoolData)
        if (this.coopApplyCommList1.length > 0) {
          let List = JSON.parse(JSON.stringify(this.coopApplyCommList1))
          for (let j = 0; j < List.length; j++) {
            if (List[j].colIdList.length === 1) {
              if (List[j].colIdList[0].colId === col.colId) {
                this.coopApplyCommList1.splice(j, 1)
                break
              }
            } else {

              for (let i = 0; i < List[j].colIdList.length; i++) {
                if (List[j].colIdList[i].colId === col.colId) {
                  this.coopApplyCommList1[j].colIdList.splice(i, 1)
                  break
                }
              }
            }
          }
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 删除选中的院校
    handleSelDelSchool() {
      let selList = this.multipleSelection
      if (selList.length > 0) {
        this.$confirm('此操作将删除选中的院校, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let col of selList) {
            this.selectedSchoolData.splice(this.selectedSchoolData.indexOf(col), 1)
            // this.setOrgSchoolCommList(this.selectedSchoolData)
            if (this.coopApplyCommList1.length > 0) {
              let List = JSON.parse(JSON.stringify(this.coopApplyCommList1))
              for (let j = 0; j < List.length; j++) {
                if (List[j].colIdList.length === 1) {
                  if (List[j].colIdList[0].colId === col.colId) {
                    this.coopApplyCommList1.splice(j, 1)
                    break
                  }
                } else {

                  for (let i = 0; i < List[j].colIdList.length; i++) {
                    if (List[j].colIdList[i].colId === col.colId) {
                      this.coopApplyCommList1[j].colIdList.splice(i, 1)
                      break
                    }
                  }
                }
              }
            }
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }
    },
    // 新增院校多选
    handleMoreSchool(val) {
      this.moreSelSchool = val
    },
    // 选中学校
    handleSelSchool() {

      this.addSchoolDialog = false
      let List = this._getCommList(this.orgSchoolCommList, this.moreSelSchool, [])
      // this.setOrgSchoolCommList(this.moreSelSchool)
      this.setOrgSchoolCommList(List)
    },
    // 获得新增的佣金模板
    getCommItem(data) {
      this.setOrgCommList(data[0])
      this.coopApplyCommList1.push(this.orgCommList)
    },
    // 编辑佣金模板
    getSaveCommItem(data) {
      this.coopApplyCommList1.splice(this.tempIndex, 1, data[0])
    },
    // 编辑佣金模板
    editTmp(item, index) {
      // console.log('编辑内容：' + item)

      this.parentTmpSchool = []
      this.tempList = item
      this.tempIndex = index
      this.isTemp = true
      let M = [...this.orgSchoolCommList]
      const allComm = new Map() // 被选中的所有院校
      let List = JSON.parse(JSON.stringify(this.coopApplyCommList1))
      if (List && List.length > 0) {
        for (let i = 0; i < List.length; i++) {
          List[i].colIdList.forEach(item => {
            allComm.set(item.colId, true)
          })
        }
      }
      const maps = new Map() // 当前院校
      item.colIdList.map((m) => {
        maps.set(m.colId, 1)
      })
      M.map(item => {
        // if (allComm.get(item.colId) && !maps.get(item.colId)) {
        //   item['disable'] = true
        // }
        if (maps.get(item.colId)) {
          item.disable = false
          this.parentTmpSchool.push(item)
        } else if (allComm.get(item.colId)) {
          item['disable'] = true
        }
      })

      // M.map(n => {
      //   if (maps.get(n.colId)) {
      //     n.disable = false
      //     this.parentTmpSchool.push(n)
      //   } else {
      //     n.disable = true
      //   }
      // })
      this.setOrgSchoolCommList(M)
      this.$refs.commtmpl.changeCoopComm()
    },
    // 删除佣金模板
    delTmp(item, index) {
      let that = this
      that.$confirm('您确定要删除该佣金模板吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.coopApplyCommList1.splice(index, 1)
        that.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    isNew(row) {
      if (row.originalLeavel !== undefined && row.originalLeavel !== null) {
        return '存在'
      } else {
        return '不存在'
      }
    },
    // 提交机构申请
    submitApply(type) {
      if (window.location.hash.length > 0) {
        window.location.hash = ''
      }
      let that = this
      that.$refs.baseForm.validate((valid) => {
        if (valid) {
          if (that._vali()) {
            let schoolLen = that.selectedSchoolData.length
            if (!schoolLen) {
              window.location.hash = "#addSchool"
              // that.$alert('请选择合作院校！', '提示', {
              //     confirmButtonText: '确定'
              // })
              that.$message.error('请选择合作院校！')
              return
            }
            if (type === 'TYPE2') {
              let lens = that.fileList.length
              document.getElementById("fileItem").getElementsByTagName("button")[0].style = ""
              if (lens === 0) {
                that.$message.error('合作协议书没有上传！')
                document.getElementById("fileItem").getElementsByTagName("button")[0].style = "border-color:#f56c6c;"
                window.location.hash = "#fileItem"
                return
              }
            }
            if (that.form.payType === null) {
              that.$message.error('请填写佣金支付方式！');
              window.location.hash = "#comInfo";
              return
            }
            if (that.form.commContacts.email === null || that.form.commContacts.email === '') {
              that.$message.error('请填写佣金联系邮箱！');
              window.location.hash = "#comInfo";
              return
            }
            let list = that.coopApplyCommList1.slice(0)
            if (type === 'TYPE2' && list.length === 0) {
              that.$message.error('请添加佣金模板！');
              window.location.hash = "#saveButton";
              return
            }
            let params = {
              commContacts: that.form.commContacts, // 佣金联系人
              contactsList: that.schoolInfoList, // 机构联系人
              address: that.linkform.colAddress,
              addressCn: that.linkform.colAddress,
              website: that.linkform.colWebsite,
              attachments: that._formatAtta(), // 附件
              colOrgList: that._formatterOrgList(), // 院校列表
              coopApplyCommList: that.formtComm(that.coopApplyCommList1), // 模板列表
              projectName: that.form.projName, // 机构名称
              startTime: that._parTime(that.form.startdate), // 合同开始日期
              endTime: that._parTime(that.form.enddate), // 合同结束日期
              signInfo: that.form.pastyearInfo, // 去年送生情况
              memo: that.form.memo, // 项目基本情况说明
              discPersons: that.form.discPersons, // 参与合作讨论人员
              embassyWebsite: that.form.embassyWebsite, // 使馆认证网址
              hocRequest: that.form.hocRequest, // 申请特别要求
              applyType: 'ORG_COL', // 申请类型
              conType: this.conType, // 合同类型
              coopOrgId: that.orgID,
              payType: that.form.payType,
              operatorType: type,
              id: that.id, // 保存后返回的id
              originalConId: that.queryID // 合同原始id
            }
            addOrgProject(params).then((res) => {
              if (res.status === ERR_OK) {
                that.id = res.data.id
                if (type === 'TYPE1') {
                  // that.$message.success('保存成功!')
                  //   setTimeout(() => {
                  //       window.location.href = 'applyeditorg.html?id=' + res.data
                  //   }, 1000)
                  that.$alert('保存成功！', '温馨提示', {
                    confirmButtonText: '知道了',
                    type: 'success',
                    callback: action => {
                      setTimeout(() => {
                        window.location.href = 'applyeditorg.html?id=' + res.data
                      }, 1000)
                    }
                  })
                } else {
                  // that.$message.success('提交成功')
                  //   setTimeout(() => {
                  //       window.location.href = 'applydetail.html?id=' + res.data + '&type=org&derive=false&edit=false'
                  //   }, 1000)
                  that.$alert('提交成功！', '温馨提示', {
                    confirmButtonText: '知道了',
                    type: 'success',
                    callback: action => {
                      setTimeout(() => {
                        window.location.href = 'applydetail.html?id=' + res.data + '&type=org&derive=false&edit=false'
                      }, 1000)
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
              // window.location.hash = "#saveButton"
            })
          } else {
            that.$message.error('请填写申请特别要求!')
            window.location.hash = "#hocRequest"
          }
        } else {
          that.$message.error('基本合作信息填写错误')
          window.location.hash = "#basicMsg"
        }
      })
    },
    formtComm(data) {

      let M = JSON.parse(JSON.stringify(data))


      M.map(m => {
        if (m && m.type !== 'NONSTANDARD') {
          m.commDetailRequestList.map(n => {
            delete n.zanbiFlag
          })
        }
        m.colIdList = m.colIdList.map(c => {
          return c.colId
        })
        // delete m.colList
      })
      // console.log(M)
      return M
    },
    // 监听联系人
    getSchollLink(...data) {
      this.linkform.colAddress = data[0].address
      this.linkform.colAddressCn = data[0].addresscn
      this.linkform.colWebsite = data[0].website
    },
    // 处理提交的学习列表数组
    _formatterOrgList() {
      let l = []
      this.selectedSchoolData.map((item) => {
        l.push({
          colId: item.colId,
          leavel: item.leavelItem,
          originalLeavel: item.originalLeavel,
          isNew: true
        })
      })
      return l
    },
    _parTime(time) {
      let date = new Date(time)
      let t = date.getTime()
      return t
    },
    handleSchoolSizeChange(val) {
      this.schoolPageSize = val
      this.getSchoolList(val)
    },
    handleSchoolCurrentChange(val) {
      this.schoolPageNum = val
      this.getSchoolList(val)
    },
    ...mapMutations({
      setSchoolInfoList: 'SET_SCHOOLINFOLIST',
      setOrgCommList: 'SET_ORG_COMM_LIST',
      setOrgSchoolCommList: 'SET_ORG_SCHOOL_COMM_LIST'
    })
  },
  watch: {
    // 对设置等级按钮权限控制
    setMoreLevelList(val) {
      if (val.length > 0) {
        this.leavelAble = false
      } else {
        this.leavelAble = true
      }
    },
    orgSchoolCommList(newVal, oldVal) {
      // console.log(newVal === oldVal)
      this.selectedSchoolData = newVal
    },
    countryData: {
      handler(newVal, oldVal) {
        if (newVal) {
          // console.log(newVal)
          let that = this
          newVal.map(i => {

            // 此处产品要求，当机构有多个国家时，默认选中第一个
            if (that.listOfOrgCountry && i.code === that.listOfOrgCountry[0].code) {
              this.countrylist.length = 0
              this.countrylist.push(i)
            }
          })
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'schoolInfoList',
      'orgCommList',
      'orgSchoolCommList'
    ]),
    currentPage() {
      return this.schoolPageNum
    },
    isShowPage() {
      if (this.schoolTotalCount <= this.schoolPageSize) {
        return false
      } else {
        return true
      }
    }
  },
  components: {
    SubHeader,
    BlockBorder,
    BlockHeader,
    Country,
    FileUpload,
    SchoolLink,
    CommTmpt,
    LevelDialog
  }
}
</script>
