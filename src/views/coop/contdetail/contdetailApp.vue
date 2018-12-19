<template>
  <div class="lx_container">
    <div class="lx_main">
      <sub-header title="合作项目详情" icon="hezuoxiangmuxiangqin"></sub-header>
      <block-border>
        <block-header slot="title" title="基本信息"></block-header>
        <div slot="container" class="lx_container">
          <el-row class="lx_row_txt" v-if="isShowOrg">
            <el-col :span="8">
              <span>机构中文名称：{{orgData.nameCn}}</span>
            </el-col>
            <el-col :span="8">
              <span>机构外文名称：{{orgData.nameEn}}</span>
            </el-col>
            <el-col :span="8">
              <span>机构国家：{{orgData.countryName}}</span>
            </el-col>
          </el-row>
          <el-row class="lx_row_txt" v-if="!isShowOrg">
            <el-col :span="8"><span>院校中文名称：{{schoolData.nameCn}}</span></el-col>
            <el-col :span="8">
              <span style="word-break:break-all; word-wrap:break-word;">院校外文名称：{{schoolData.nameEn}}</span>
            </el-col>
            <el-col :span="8">
              <span>院校国家：{{schoolData.countryName}}</span>
            </el-col>
          </el-row>
          <el-row class="lx_row_txt">
            <el-col :span="24">
              <span>合作项目名称：{{baseInfoData.projectName}}</span>
            </el-col>
          </el-row>
          <el-row class="lx_row_txt">
            <el-col :span="8">
              <span>合作方式：{{baseInfoData.applyType}}</span>
            </el-col>
            <el-col :span="8">
              <span>合同状态：{{baseInfoData.conStatus}}</span>
              <el-button size="mini" v-if="isNormal&&isShow&&!isIng&&btnData.LXCOOPSTATUSAPPLY" type="primary"
                         plain
                         @click="goContractOpt('FROZEN')">冻结
              </el-button>
              <el-button size="mini" v-if="isIng" type="primary" plain @click="goContractOpt('freezeing')">{{isIngText}}
              </el-button>
              <el-button size="mini" v-if="isFrozen&&isShow&&!isIng&&btnData.LXCOOPSTATUSAPPLY" type="primary"
                         plain
                         @click="goContractOpt('NORMAL')">解冻
              </el-button>
              <el-button size="mini" v-if="isNormal&&isShow&&!isIng&&btnData.LXCOOPSTATUSAPPLY" type="primary"
                         plain
                         @click="goContractOpt('STOP')">终止
              </el-button>
            </el-col>
          </el-row>
          <el-row class="lx_row_txt">
            <el-col :span="8" v-if="!isShowOrg">
              <span>院校性质：{{schoolData.colProperty}}</span>
            </el-col>
            <el-col :span="8">
          <span>合同开始日期：{{baseInfoData.startTime | formatTime}}
          </span>
            </el-col>
            <el-col :span="8"><span>合同结束日期：{{baseInfoData.endTime | formatTime}}</span></el-col>
          </el-row>
          <el-row class="lx_row_txt" v-show="baseInfoData.conType==='续签'">
            <el-col :span="24">
              <span>去年送生情况：{{baseInfoData.signInfo}}</span>
            </el-col>
          </el-row>
        </div>
      </block-border>

      <block-border v-if="isShowOrg&&!deriveFlag">
        <block-header slot="title" title="项目涉及学校">
          <div slot="right" class="process-bt-right"
               v-if="isSave">
            <el-button type="primary" plain @click="saveCol">保存</el-button>
            <el-button type="primary" plain @click="cancelCol">取消</el-button>
          </div>
        </block-header>
        <div slot="container" class="lx_container">
          <div style="width: 100%; margin-bottom: 10px">
            <el-row>
              <el-col :span="22">
                <font color="red" style="font-size: 14px">提示：此处的新增院校只有一个小时的有效期，到时间后，该新增的院校将不可通过此途经继续申请。如需保持此申请途经，请通过续签或者补充合同的方式。</font>
              </el-col>
              <el-col :span="1">
                <el-button type="primary" plain @click="addSchoolShow">+新增院校</el-button>
              </el-col>
            </el-row>
          </div>
          <el-form ref="ruleForm" :model="baseLevel">
            <el-table :data="baseLevel.colList" class="width100" fit header-row-class-name="lx_table_hd">
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
                label="当前合作等级">
                <template prop="levelitem" slot-scope="scope">
                  <el-input v-model="levalTemp[scope.row.leavel]" size="mini" class="lx_width_110" disabled v-if="!scope.row.isTmp"/>
                  <el-form-item :prop="'colList.' + scope.$index + '.leavel'"
                                :rules="[{type:'string' ,required: true, message: '合作等级不能为空', trigger: 'change' }]" v-else>
                    <el-select clearable v-model="scope.row.leavel" placeholder="请选择" size="mini"
                               @change="changLevel(scope.row.leavel)"
                               class="lx_width_110">
                      <el-option v-for="item in levelList" :label="item.name" :value="item.code"
                                 :key="item.code"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="isNew"
                               :formatter="isNew"
                               label="原项目中是否存在"></el-table-column>
              <el-table-column label="原合作等级">
                <template slot-scope="scope">{{ levalTemp[scope.row.originalLeavel] }}</template>
              </el-table-column>
              <el-table-column label="操作" width="80px" fixed="right">
                <template slot-scope="scope" v-if="scope.row.isTmp">
                  <el-button size="mini" if plain @click="handleDelSchool(scope.row,scope.$index)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </block-border>
      <block-border>
        <block-header slot="title" title="项目最新联系方式"></block-header>
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
        <block-header slot="title" title="最新项目信息">
          <div slot="right" class="lx_block_btn" v-if="isEdit">
            <el-button type="primary" plain @click="saveProtocol">保存</el-button>
          </div>
        </block-header>
        <el-form ref="projform" slot="container" label-width="160px" class="lx_form_baseinfo">
          <el-form-item label="项目基本情况说明">
            <p class="lx_txt_br" v-html="baseInfoData.memo"></p>
          </el-form-item>
          <el-form-item label="参与合作讨论人员">
            <span>{{baseInfoData.discPersons}}</span>
          </el-form-item>
          <el-form-item label="上传附件"><span>每种证书可上传最多5个文件，单个文件大小最大30M，支持文件格式：PDF、word、rar/zip等常用压缩文件</span>
          </el-form-item>
          <el-form-item label="合作协议书">
            <file-upload :isDisable="true" :attaObj="fileObj" @files="_getFileID" :attaList="fileList" :isTip="false"
                         key="one"></file-upload>
          </el-form-item>
          <el-form-item label="签字后的合作协议书" class="lx_level_main">
            <span class="lx_level_dialog lx_redcolor_up">(审批通过后上传)</span>
            <file-upload :isDisable="!isEdit" :attaObj="fileObj5" @files="_getFileID5" :attaList="fileList5"
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
            <span>{{baseInfoData.embassyWebsite}}</span>
          </el-form-item>
          <el-form-item label="申请特别要求">
            <span>{{baseInfoData.hocRequest}}</span>
          </el-form-item>
        </el-form>
      </block-border>
      <block-border>
        <block-header slot="title" title="项目最新佣金信息"></block-header>
        <div slot="container" class="lx_container">
          <el-row class="lx_row_txt">
            <el-col :span="8"><span>佣金支付方式：{{baseCommData.payTypes}}</span></el-col>
            <el-col :span="8">
              <span>佣金联系人：{{baseCommData.username}}</span>
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
              <el-col><span>合作等级：{{levalTemp[baseLevel.leavel]}}</span></el-col>
            </el-row>
            <el-row class="lx_row_txt">
              <el-col>
                <div class="lx_temp_bold">佣金模板：{{baseCommData.type.name}}</div>
                <!--<div class="lx_temp_bold">【{{baseCommData.mouldType.name}}】</div>-->
              </el-col>
            </el-row>
            <el-row class="lx_row_txt" v-if="commDetailList.length>0" v-for="item in commDetailList" :key="item.id">
              <el-col v-if="isDirCommData">
                                <span class="lx_temp_bold"
                                      v-if="isMoudelDetail&&baseCommData.mouldType.code!=='NUM_LADDER'">【{{baseCommData.mouldType.name}}】</span>
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
            <!--<el-row class="lx_row_txt" style="margin-bottom: 0" v-if="baseCommData.type!==null&&baseCommData.type.code==='STANDARD'">-->
            <!--&lt;!&ndash;<el-col><span>额外奖励：{{baseCommData.extraBonus}}</span></el-col>&ndash;&gt;-->
            <!--</el-row>-->
            <div class="clearfix">
              <el-col>
                <div class="lx_ly_txt"><span>佣金内容：</span>
                  <p v-if="baseCommData.commmemo" v-html="baseCommData.commmemo.replace(/\n/g,'</br>')"></p>
                </div>
              </el-col>
            </div>
            <div class="clearfix" v-if="baseCommData.type!==null&&baseCommData.type.code==='STANDARD'">
              <el-col>
                <div class="lx_ly_txt"><span>额外奖励：</span>
                  <p v-if="baseCommData.extraBonus" v-html="baseCommData.extraBonus.replace(/\n/g,'</br>')"></p>
                </div>
              </el-col>
            </div>
            <div class="clearfix">
              <!--<el-col>-->
              <!--<div class="lx_ly_txt"><span>佣金内容：</span>-->
              <!--<p v-if="baseCommData.commmemo" v-html="baseCommData.commmemo.replace(/\n/g,'</br>')"></p>-->
              <!--</div>-->
              <!--</el-col>-->
              <el-col>
                <div class="lx_ly_txt"><span>备注：</span>
                  <p v-if="baseCommData&&baseCommData.desc" v-html="baseCommData.desc.replace(/\n/g,'</br>')"></p>
                </div>
              </el-col>
            </div>
          </div>
          <!--院校佣金结束-->
          <!--机构佣金开始-->
          <div v-if="isShowOrg">
            <div class="clearfix" v-if="deriveFlag">
              <el-col>
                <div class="lx_ly_txt" v-for="item in baseCommData.commList"><span>佣金内容：</span>
                  <p>{{item.memo}}</p>
                </div>
              </el-col>
            </div>
            <div v-if="!deriveFlag">
              <div class="lx_comm lx_comm_diff" v-for="item in baseCommData.commList">
                <el-row class="lx_row_txt" style="margin-bottom: 0">
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
                    <div class="lx_temp_bold" v-if="m.mouldDetailType!==null">
                      【按人数梯度】&nbsp;人数：{{m.minNum}}≤{{m.maxNum}}({{m.mouldDetailType
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
                <!--<el-row class="lx_row_txt"  style="margin-bottom: 0" v-if="item.type!==null&&item.type.code==='STANDARD'">-->
                <!--&lt;!&ndash;<el-col><span>额外奖励：{{item.extraBonus}}</span></el-col>&ndash;&gt;-->
                <!--</el-row>-->
                <div class="clearfix">
                  <el-col>
                    <div class="lx_ly_txt" style="margin-bottom: 5px"><span>佣金内容：</span>
                      <p v-if="item && item.memo" v-html="item.memo.replace(/\n/g,'</br>')"></p>
                    </div>
                  </el-col>
                </div>
                <div class="clearfix" v-if="item.type!==null&&item.type.code==='STANDARD'">
                  <el-col>
                    <div class="lx_ly_txt" style="margin-bottom: 5px"><span>额外奖励：</span>
                      <p v-if="item && item.extraBonus" v-html="item.extraBonus.replace(/\n/g,'</br>')"></p>
                    </div>
                  </el-col>
                </div>
                <div class="clearfix">
                  <!--<el-col>-->
                  <!--<div class="lx_ly_txt"  style="margin-bottom: 5px"><span>佣金内容：</span>-->
                  <!--<p v-if="item && item.memo" v-html="item.memo.replace(/\n/g,'</br>')"></p>-->
                  <!--</div>-->
                  <!--</el-col>-->
                  <el-col>
                    <div class="lx_ly_txt" style="margin-bottom: 5px"><span>备注：</span>
                      <p v-if="item && item.desc" v-html="item.desc.replace(/\n/g,'</br>')"></p>
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
          </div>
          <!--机构佣金结束-->
          <!--新增院校开始-->
          <el-dialog
            :visible.sync="addSchoolDialog"
            center class="lx_dialog lx_addschool_dialog"
            ref="multipleTable"
            width="770px">
            <div class="lx_dialog_title" slot="title">
              <h2>新增院校</h2>
            </div>
            <div class="lx_dialog_main">
              <el-form :model="form" label-width="80px" class="lx_form_label_16">
                <el-row :gutter="40">
                  <el-col :span="8">
                    <el-form-item label='国家' label-width="60px">
                      <country :data="countryData" title="请选择国家" :parentVal="countrylist"
                               overClass="lx_bottom_0"
                               :more="false" :isInBody="true"
                               :showTxt="false"
                               :inputVal="inputVal" key="one" :isCancelCheck="false"
                               @country="getSelCountry"></country>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="院校名称">
                      <el-input v-model="form.schoolName" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="priamry" @click="getSchoolList">查询</el-button>
                  </el-col>
                </el-row>
              </el-form>
              <el-table :data="schoolListData"
                        ref="moreSchoolMult"
                        @selection-change="handleMoreSchool"
                        header-row-class-name="lx_table_hd lx_table_hd_blue">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="countryName" label="国家">
                </el-table-column>
                <el-table-column prop="nameEn" label="院校外文名">
                </el-table-column>
                <el-table-column prop="nameCn" label="院校中文名">
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
        </div>
      </block-border>
      <logs :hasType=true logType='COOP_CONT' :bizId="conId" ref="logRecord"></logs>
    </div>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  .process-bt-right {
    width: 100%;
    float: right;
    margin-right: 30px;
    padding-right: 30px;
    text-align: right;
  }

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

  .lx_txt_br {
    line-height: 24px;
    margin-top: 9px;
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

  .lx_temp_bold {
    font-family: "Microsoft YaHei";
    font-size: 16px;
    color: #303133;
    font-weight: bold;
  }

  .lx_width_110 {
    width: 110px;
  }
</style>
<script type="text/ecmascript-6">
import Country from '@/components/Country'
import SubHeader from '@/components/SubHeader'
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'
import FileUpload from '@/components/AttachFile/index'
import { ApplyFileMixin, GetChildBtnMixin, CountryMixin } from '@/utils/mixin'
import {
  getCoopConDetail,
  getConDirectCommDetail,
  getConDirectLevelDetail,
  getConOrgCommDetail,
  getConOrgLevelDetail,
  sendProtocol
} from '@/api/coopContract'
import { getOrgDetail, searchSchool, saveContTmpLevel } from '@/api/coopManage'
import { getSchoolDetail } from '@/api/schoolManage'
import { ERR_OK } from '@/utils/status'
import { GetRequest } from '@/utils/index.js'
import { getApplyEnum } from '@/api/dict'
import Logs from '@/views/components/logs/logs'

export default {
  mixins: [CountryMixin, ApplyFileMixin, GetChildBtnMixin],
  data() {
    return {
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
      baseLevel: {
        colList: []
      }, // 等级信息
      fileList: [], // 文件
      commDetailList: [], // 佣金列表,
      adp: {},
      /* eslint-disable */
      // deriveFlag: (this.$route.query.derive === 'true') ? true : false, // 是否为衍生服务
      deriveFlag: false, // 是否为衍生服务
      isEdit: '',
      conId: '', // 合同ID
      isIng: false, // 是否冻结申请中
      type: '',
      addSchoolDialog: false, // 新增院校弹出窗
      form: {
        schoolName: null // 院校名称
      },
      schoolTotalCount: 0,
      schoolPageNum: 1,
      schoolPageSize: 10,
      listOfOrgCountry: [],
      moreSelSchool: [], // 新增院校多选
      selectedSchoolData: [], // 选中学校
      schoolListData: [], // 学校列表
      tmplSchoolList: [],
      selectLevel: {},
      levelList: [],
      colLevelList: [],
      isSave: false,
      levalTemp:{}
    }
  },
  created() {
    let req = GetRequest()
    this.deriveFlag = (req.derive === 'true' ? true : false)
    this.isEdit = req.edit
    this.conId = req.id
    this.type = req.type
  },
  mounted() {
    let that = this
    setTimeout(() => {
      this.getAuthort('LXCOOPSTATUSAPPLY')
      this._initApply(this.conId)
    }, 17)
    getApplyEnum().then((res) => {
      if (res.status === ERR_OK) {
        that.levelList = res.data.leavels
        for (let l of that.levelList) {
          that.levalTemp[l.code] = l.name
        }
      }
    })
    this.$refs.logRecord.getLogs()
  },
  filters: {
    formatsss(val) {
      // console.log(val)
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
    }
  },
  methods: {
    _initApply(id) {
      let that = this
      // 申请详细
      getCoopConDetail({
        id: id
      }).then(res => {
        if (res.status === ERR_OK) {
          console.log('合同详情成功')
          this.baseInfoData = res.data
          this.baseInfoData['applyType'] = res.data.applyType === null ? null : res.data.applyType.name
          this.baseInfoData['conType'] = res.data.conType === null ? null : res.data.conType.name
          this.baseLinkData['address'] = res.data.address
          this.baseLinkData['addressCn'] = res.data.addressCn
          this.baseLinkData['website'] = res.data.website
          this.baseLinkData['contacts'] = res.data.contacts
          this.baseInfoData['conStatus'] = res.data.status.name
          this.baseInfoData['conStatusCode'] = res.data.status.code
          this.baseInfoData['memo'] = res.data && res.data.memo ? res.data.memo.replace(/\n/g, `</br>`) : ''
          // if (res.data.changeType !== null && res.data.changeType.code !== 'NORMAL') {
          //   this.isIng = true
          // }
          if (res.data.changeType !== null) {
            this.isIng = true
          }
          // 处理获取到的数组
          this._initFiles(res.data.attachments)
        }
      }).then(() => {
        if (this.type === 'org') {
          // 机构详情查询
          getOrgDetail({
            id: this.baseInfoData.orgId
          }).then((res) => {
            if (res.status === ERR_OK) {
              this.orgData = res.data
              this.listOfOrgCountry = res.data.listOfOrgCountry
              if (res.data.listOfOrgCountry && res.data.listOfOrgCountry.length > 0) {
                res.data.listOfOrgCountry.map((item) => {
                  this.countryCodes.push(
                    item.code
                  )
                })
                this._initCountry(this.countryCodes)
              }
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
            if (res.data && res.data.colList) {
              that.baseLevel = res.data
              that.baseLevel.colList.map(item => {
                this.adp[item.colId] = item.colNameCn + '--' + item.colNameEn
              })
              this.colLevelList = [].concat(this.baseLevel.colList)
            }
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
            this.baseCommData['commList'] = res.data.commList === null ? null : res.data.commList
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
            if (res.data.commContact) {
              this.baseCommData['commContact'] = res.data.commContact
              this.baseCommData['username'] = res.data.commContact === null ? '' : res.data.commContact.username
              this.baseCommData['position'] = res.data.commContact === null ? '' : res.data.commContact.position
              this.baseCommData['fax'] = res.data.commContact === null ? '' : res.data.commContact.fax
              this.baseCommData['tel'] = res.data.commContact === null ? '' : res.data.commContact.tel
              this.baseCommData['email'] = res.data.commContact === null ? '' : res.data.commContact.email
              this.baseCommData['address'] = res.data.commContact === null ? '' : res.data.commContact.address
            }
            if (res.data.comm) {
              this.baseCommData['type'] = res.data.comm.type === null ? '' : res.data.comm.type
              this.baseCommData['mouldType'] = res.data.comm.mouldType === null ? '' : res.data.comm.mouldType
              this.baseCommData['commmemo'] = res.data.comm.memo ? res.data.comm.memo.replace(/\n/g, `</br>`) : ''
              this.baseCommData['desc'] = res.data.comm.desc ? res.data.comm.desc.replace(/\n/g, `</br>`) : ''
              this.baseCommData['extraBonus'] = res.data.comm.extraBonus ? res.data.comm.extraBonus.replace(/\n/g, `</br>`) : ''
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
            if (res.data) {
              this.baseLevel = res.data
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
    _formatAdapt(id) {
      let m = this.adp[id].split('--')
      return m
    },
    saveProtocol() {
      sendProtocol({
        id: this.conId,
        attachs: this._formatProtocolAtta(this.fileList5)
      }).then(res => {
        if (res.status === ERR_OK) {
          this.$message.success('协议书保存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    goContractOpt(type) {
      window.location.href = 'contseeapply.html?id=' + this.conId + "&type=" + type
//        this.$router.push({
//          name: 'ContractApprove',
//          query: {
//            id: this.conId,
//            type: type
//          }
//        })
    },
    changLevel(...dat) {
      console.log(dat)
      this.isSave = true
    },
    // 新增院校弹窗
    addSchoolShow() {
      this.addSchoolDialog = true
    },
    // 选中学校
    handleSelSchool() {
      this.addSchoolDialog = false
      let b = {}
      this.baseLevel.colList.forEach(item => {
        b[item.colId] = item
      })
      let list = []
      this.moreSelSchool.forEach(item => {
        if (!b[item.id]) {
          let a = {
            colId: item.id,
            colNameCn: item.nameCn,
            colNameEn: item.nameEn,
            colProperty: item.colProperty,
            countryName: item.countryName,
            isTmp: true
          }
          list.push(a)
        }
      })
      if (list.length != this.colLevelList.length) {
        this.isSave = true
      }
      this.baseLevel.colList = list.concat(this.baseLevel.colList)
//				// this.setOrgSchoolCommList(this.moreSelSchool)
//				this.setOrgSchoolCommList(List)
    },
    // 新增院校多选
    handleMoreSchool(val) {
      this.moreSelSchool = val
    },
    getSchoolList() {
      searchSchool({
        countryCodes: this.sendCountry,
        name: this.form.schoolName,
        pageNum: this.schoolPageNum,
        pageSize: this.schoolPageSize
      }).then(res => {
        if (res.status === ERR_OK) {
          this.schoolListData = res.data.list
          this.schoolPageNum = res.data.page
          this.schoolTotalCount = res.data.totalCount
          // this.toggleSelection(this.orgSchoolCommList)
        }
      })
    },
    // 删除选中的院校
    handleDelSchool(col, index) {
        this.baseLevel.colList.splice(index, 1)
        this.isSave = true
        // this.setOrgSchoolCommList(this.selectedSchoolData)
    },
    saveCol() {
      let flag = false
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          this.$message.error('合作等级不能为空')
          flag = false
        } else {
          flag = true
        }
      });
      if (!flag) {
        return
      }
      let list = []
      this.baseLevel.colList.forEach(item => {
        if (item.isTmp) {
          let a = {
            colId: item.colId,
            orgId: this.baseInfoData.orgId,
            leavel: item.leavel,
            conId: this.conId
          }
          list.push(a)
        }
      })
      let params = {
        conId: this.conId,
        colOrgList: list
      }
      saveContTmpLevel(params).then((res) => {
        // console.log(params)
        if (res.status === ERR_OK) {
          this.colLevelList = [].concat(this.baseLevel.colList)
          this.isSave = false
          this.$alert('保存成功！', '保存成功', {
            confirmButtonText: '知道了',
            type: 'success',
            callback: action => {
            }
          })
        } else {
          this.$alert('保存失败！' + res.msg, '操作失败', {
            confirmButtonText: '知道了',
            type: 'error',
            callback: action => {
            }
          })
        }
      })
    },
    cancelCol() {
      this.$confirm('此操作将删除新增的院校, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isSave = false
        this.baseLevel.colList = [].concat(this.colLevelList)
      })
    },
    handleSchoolSizeChange(val) {
      this.schoolPageSize = val
      this.getSchoolList(val)
    },
    handleSchoolCurrentChange(val) {
      this.schoolPageNum = val
      this.getSchoolList(val)
    }
  },
  watch: {
    countryData: {
      handler(newVal, oldVal) {
        if (newVal) {
          // console.log(newVal)
          let that = this
          newVal.map(i => {
            // 此处产品要求，当机构有多个国家时，默认选中第一个
            if (that.listOfOrgCountry && that.listOfOrgCountry.length > 0 && i.code === that.listOfOrgCountry[0].code) {
              that.countrylist.length = 0
              that.countrylist.push(i)
            }
          })
        }
      },
      deep: true
    }
  },
  computed: {
    isShowOrg() {
      if (this.type === 'org') {
        return true
      } else {
        return false
      }
    },
    isShow() {
      if (this.isEdit === 'true' || this.isEdit === true) {
        return true
      } else {
        return false
      }
    },
    isIngText() {
      if (this.baseInfoData.changeType !== null) {
        if (this.baseInfoData.changeType.code === 'NORMAL') {
          return '解冻申请中'
        } else {
          return `${this.baseInfoData.changeType.name}申请中`
        }
      }
    },
    isNormal() {
      if (this.baseInfoData.status) {
        if (this.baseInfoData.status.code === 'NORMAL') {
          return true
        } else {
          return false
        }
      }
    },
    isFrozen() {
      if (this.baseInfoData.status) {
        if (this.baseInfoData.status.code === 'FROZEN') {
          return true
        } else {
          return false
        }
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
    BlockBorder,
    BlockHeader,
    SubHeader,
    FileUpload,
    Country,
    Logs
  }
}
</script>
