<template>
  <div class="lx_container">
    <div class="lx_main">
      <sub-header title="院校信息" icon="yuanxiaoxinxi"></sub-header>
      <block-border>
        <block-header slot="title" title="基本信息"></block-header>
        <el-form ref='form' slot="container" :model='form' label-width='120px'>
          <el-row>
            <el-col :span='8'>
              <el-form-item label='院校中文名称'>
                <el-input v-model="form.nameCn" :disabled="formDisable" class="width100" maxlength="200"
                          placeholder="请输入院校中文名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='院校外文名称'>
                <el-input v-model="form.nameEn" :disabled="formDisable" :maxlength="500"
                          placeholder="请输入院校外文名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='国家'>
                <country :data="countryData" class="lx_bottom_0" :more="false" :showTxt="true" :inputVal="inputVal"
                         @country="getSelCountry" :inputDisabled="formDisable"></country>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='8'>
              <el-form-item label='院校性质'>
                <el-select v-model='colPropertieSel' placeholder='请选择' class='width100' :disabled="formDisable">
                  <el-option v-for="item in colPropertieList" :label="item.name" :value='item.code'
                             :key="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='16'>
              <el-form-item label='院校类型'>
                <el-checkbox v-model="schoolTypeChk" :disabled="formDisable" v-for="item in schoolType"
                             :checked="item.checked" :label="item.code" :key="item.code">{{item.name}}
                </el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="院校是否可选">
              <el-radio v-model="selectType" v-for="item in selectTypeList" @change="changeSel" :disabled="formDisable"
                        :key="item.code" :checked="item.checked" :label="item.code" border class="width_110">{{item.name}}
              </el-radio>
            </el-form-item>
          </el-row>
          <el-row>
          </el-row>
          <el-row>
            <div class="lx_school_sele">
              <div v-show="resonFlag">
                <el-form-item label="原因">
                  <el-input v-model="form.reason" :disabled="formDisable" class="width100" maxlength="250">请填写原因</el-input>
                </el-form-item>
              </div>
              <div v-show="timeFlag">
                <el-form-item label="可选时间">
                  <el-date-picker
                    v-model="form.selectTime"
                    type="datetime"
                    placeholder="设置可选时间"
                    :disabled="formDisable"
                    class="width100">
                  </el-date-picker>
                </el-form-item>
              </div>
            </div>
          </el-row>
        </el-form>
      </block-border>
      <block-border>
        <block-header slot="title" title="合作信息">
          <span class="lx_block_annotation" slot="annot">注：新增合作请在合作院校申请页面发起</span>
        </block-header>
        <apply-table slot="container" :contsData="contsData"></apply-table>
        <el-form ref="formInfo" :model="form" slot="container" label-width="80px" :disabled="formDisable">
          <div class="lx_school_sele lx_lone_apply">
            <div>
              <el-checkbox v-model="form.isSpecial" :disabled="formDisable" border>允许独立申请</el-checkbox>
            </div>
            <div>
              <el-form-item label="可选时间">
                <el-date-picker
                  v-model="form.specialEndTime"
                  :disabled="formDisable"
                  type="datetime"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </block-border>
      <school-link :disableLink="true" :onlyRead="true" :dataAddress="form.colAddress" :dataAddressCn="form.colAddressCn"
                   :dataWebsite="form.colWebsite">
      </school-link>
      <block-border>
        <block-header slot="title" title="院校介绍及申请信息"></block-header>
        <el-form ref="formschool" slot="container" label-width="130px" :model="form">
          <el-form-item label="上传院校介绍附件">
            <!--<el-upload-->
            <!--class="lx_upload_atta"-->
            <!--:disabled="formDisable"-->
            <!--:action="attaUrl"-->
            <!--:on-preview="handlePreview"-->
            <!--:on-remove="handleRemove"-->
            <!--name="files"-->
            <!--:before-remove="beforeRemove"-->
            <!--multiple-->
            <!--:limit="5"-->
            <!--:on-exceed="handleExceed"-->
            <!--:on-success="handleSuccess"-->
            <!--:on-error="handleError"-->
            <!--:file-list="fileList">-->
            <!--<el-button size="medium" plain>请选择</el-button>-->
            <!--<div slot="tip" class="el-upload__tip">非必填，可上传最多5个文件，单个文件最大30M，支持文件格式：PDF、word、rar/zip等常用压缩文件</div>-->
            <!--</el-upload>-->
            <file-upload :attaObj="obj" :isDisable="true" @files="_getFileID" :attaList="filesList"
                         key="one"></file-upload>
          </el-form-item>
          <el-form-item label="申请操作规范">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              :disabled="formDisable"
              v-model="form.fgmp">
            </el-input>
          </el-form-item>
          <el-form-item label="申请提交方式">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              :disabled="formDisable"
              v-model="form.subWay">
            </el-input>
          </el-form-item>
        </el-form>
      </block-border>
      <!--<el-button @click="goBackR">返回</el-button>-->
    </div>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  .lx_school_sele {
    display: flex;
    justify-content: flex-start;
  }

  .lx_lone_apply {
    margin-top: 30px
  }
</style>
<script type="text/ecmascript-6">
import SubHeader from '@/components/SubHeader'
import BlockHeader from '@/components/BlockHeader'
import BlockBorder from '@/components/BlockBorder'
import Country from '@/components/Country'
import SchoolLink from '@/components/SchoolLinkInfo'
import ApplyTable from '@/components/ApplySearchSchoolTable'
import {getSchoolDetail, getConts} from '@/api/schoolManage'
import {CountryMixin, GoBackMixin} from '@/utils/mixin'
import {ERR_OK} from '@/utils/status.js'
import {mapMutations} from 'vuex'
import global_ from '@/Global'
import FileUpload from '@/components/AttachFile/index'
import {getTime, GetRequest} from '@/utils/index.js'

export default {
  mixins: [CountryMixin, GoBackMixin],
  data() {
    return {
      disableLink: true,
      // fileList: [],
      // actionUrl: 'http://lx.test.org/college/attachments/',
      attaUrl: global_.ADDATTACHURL,
      tmpList: [],
      // 再用字段
      form: {
        nameCn: '',
        nameEn: '',
        selectTime: null, // 临时可选时间
        fgmp: '', // 操作规范
        subWay: '', // 提交方式
        isSpecial: false,
        specialEndTime: null, //  独立申请到期时间
        reason: '', // 原因
        colAddress: '',
        colAddressCn: '',
        colWebsite: '',
        attaName: ''
      }, // 基础信息
      contsData: [], // 合作信息
      schoolType: [], // 院校类型
      schoolTypeChk: [], // 选择的院校类型
      colPropertieList: [], // 院校性质
      colPropertieSel: '', // 选中的院校性质
      selectTypeList: [],
      selectType: '', // 院校可选
      resonFlag: false, // 展示不可选
      timeFlag: false, // 展示临时可选
      schoolData: [], // 院校详情临时存储
      formDisable: true, // 禁用编辑
      obj: {
        bizType: 'COLLEGE'
      },
      filesList: [],
      fileID: [],
    }
  },
  mounted() {
    let req = GetRequest()
    let id = req.id
    let type = req.type
    let that = this
    if (!id && !type) {
      this.$message.error('出错了，找不到对应院校信息！')
      setTimeout(() => {
        window.location.href = "schoolsearch.html"
//          this.$router.push({
//            name: 'School'
//          })
      }, 3001)
    } else {
      this._initData(id)
    }
  },
  methods: {
    _getFileID(data) {
      this.filesList = data
    },
    _initData(id) {
      getSchoolDetail({id: id}).then((res) => {
        if (res.status === ERR_OK) {
          this.schoolData = res.data
          if (this.schoolData !== null) {
            if (this.schoolData.colPropertiesList !== null) {
              this.colPropertieList = this.schoolData.colPropertiesList
            }
            if (this.schoolData.colProperty !== null) {
              // 院校性质列表
              this.colPropertieSel = this.schoolData.colProperty.code
            }
          }
          this.form.nameCn = this.schoolData.nameCn
          this.form.nameEn = this.schoolData.nameEn
          this.form.fgmp = this.schoolData.fgmp
          this.form.subWay = this.schoolData.subWay
          this.form.reason = this.schoolData.reason
          this.form.colAddress = this.schoolData.colAddress
          this.form.colAddressCn = this.schoolData.colAddressCn
          this.form.colWebsite = this.schoolData.colWebsite
          this.form.isSpecial = this.schoolData.isSpecial
          this.form.specialEndTime = this.schoolData.specialEndTime
          this.form.selectTime = this.schoolData.selectTime
          this.tmpList = this.schoolData.attachments
          this._formatFile()
          this.countrylist.push({
            code: this.schoolData.countryCode,
            nameCn: this.schoolData.countryName
          })
          this.schoolType = this.schoolData.colTypes
          this.selectTypeList = this.schoolData.checkTypeList
          this._initSelType()
          this.setSchoolInfoList(this.schoolData.contacts)
        }
      }).then(() => {
        getConts({id: id, active: true}).then(res => {
          if (res.status === ERR_OK) {
            this.contsData = res.data

            this.form.isSpecial = this.schoolData.isSpecial
            let heZuoData = this.contsData === null ? this.res.data : this.contsData
            let specialEndTime = this.form.specialEndTime
            let i = 0
            if (heZuoData.length > 0) {
              for (let argument of heZuoData) {
                if (argument.contStatus.name === '生效中') {
                  this.form.isSpecial = false
                  i++
                }
              }
              if (i === 0) {
                this.form.isSpecial = true
              }
            } else {
              if (specialEndTime === null) {
                this.form.isSpecial = true
              }
            }
            let now = getTime(new Date())
            if (specialEndTime !== null && specialEndTime > now) {
              this.form.isSpecial = true
            } else {
              this.form.specialEndTime = null
            }
          }
        })
      })
    },
    // 附件
    _formatFile() {
      this.tmpList.map((item) => {
        this.filesList.push({
          name: item.fileName,
          id: item.id,
          fileId: item.fileId
        })
      })
    },
    _initSelType() {
      this.selectTypeList.map((item) => {
        if (item.checked) {
          this.selectType = item.code
        }
      })
      this.changeSel(this.selectType)
    },
    changeSel(label) {
      if (label === 'UNCHECKED') {
        this.resonFlag = true
        this.timeFlag = false
      } else if (label === 'TEMPORARY') {
        this.resonFlag = false
        this.timeFlag = true
      } else {
        this.resonFlag = false
        this.timeFlag = false
      }
    },
    ...mapMutations({
      setSchoolInfoList: 'SET_SCHOOLINFOLIST'
    })
  },
  computed: {},
  components: {
    SubHeader,
    BlockHeader,
    BlockBorder,
    Country,
    SchoolLink,
    ApplyTable,
    FileUpload
  }
}
</script>
