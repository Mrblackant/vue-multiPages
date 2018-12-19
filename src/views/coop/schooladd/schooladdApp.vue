<template>
  <div class="lx_container">
    <div class="lx_main">
      <sub-header title="新增留学院校" icon="xinzengliuxueyuanxiao"></sub-header>
      <block-border>
        <block-header slot="title" title="基本信息" id="basicMsg"></block-header>
        <el-form ref='form' slot="container" :rules="rules" :model='form' label-width='120px'>
          <el-row>
            <el-col :span='8'>
              <el-form-item label='院校中文名称' prop="nameCn">
                <el-input v-model="form.nameCn" class="width100" placeholder="请输入院校中文名称" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='院校外文名称' prop="nameEn">
                <el-input v-model="form.nameEn" :maxlength="500" placeholder="请输入院校外文名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='国家' prop="contryName">
                <country :data="countryData" overClass="lx_bottom_0" title="国家选择" :more="false" :showTxt="true"
                         :inputVal="inputVal"
                         @country="getSelCountry"></country>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='8'>
              <el-form-item label='院校性质' prop="colPropertieSel">
                <el-select v-model='form.colPropertieSel' placeholder='请选择' class='width100'>
                  <el-option v-for="item in colPropertieList" :label="item.name" :value='item.code'
                             :key="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='16'>
              <el-form-item label='院校类型' prop="schoolTypeChk">
                <el-checkbox-group v-model="form.schoolTypeChk">
                  <el-checkbox v-for="item in schoolType" :label="item" :key="item.code">{{item.name}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="院校是否可选" prop="selectType">
              <el-radio-group v-model="form.selectType">
                <el-radio v-for="item in selectTypeList" @change="changeSel" :label="item.code"
                          :key="item.code" border
                          class="width_110">{{item.name}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
          </el-row>
          <el-row>
            <div class="lx_school_sele">
              <div v-if="resonFlag">
                <el-form-item label="原因" prop="reason">
                  <el-input v-model="form.reason" class="width100" maxlength="250">请填写原因</el-input>
                </el-form-item>
              </div>
              <div v-if="timeFlag">
                <el-form-item label="可选时间" prop="selectTime">
                  <el-date-picker
                    v-model="form.selectTime"
                    :picker-options="pickerTimeLimit"
                    type="datetime"
                    placeholder="设置可选时间"
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
        <el-form ref="formInfo" :model="form" slot="container" label-width="80px">
          <div class="lx_school_sele lx_lone_apply">
            <div>
              <el-checkbox v-model="form.isSpecial" @change="changeApply" border>允许独立申请</el-checkbox>
            </div>
            <!--<div>-->
            <!--<el-form-item label="可选时间">-->
            <!--<el-date-picker-->
            <!--v-model="form.specialEndTime"-->
            <!--type="date"-->
            <!--placeholder="选择日期">-->
            <!--</el-date-picker>-->
            <!--</el-form-item>-->
            <!--</div>-->
          </div>
        </el-form>
      </block-border>
      <!--院校联系信息-->
      <school-link @schoolform="getSchollLink" :disableLink="false" :onlyRead="false" :isAdd="true">
      </school-link>
      <!--院校联系信息-->
      <block-border>
        <block-header slot="title" title="院校介绍及申请信息"></block-header>
        <el-form ref="formschool" slot="container" label-width="130px" :model="form" class="lx_mr_130">
          <el-form-item label="上传院校介绍附件">
            <file-upload :attaObj="obj" @files="_getFileID"
                         key="one"></file-upload>
          </el-form-item>
          <el-form-item label="申请操作规范">
            <el-input
              type="textarea"
              maxlength="200"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              v-model="form.fgmp">
            </el-input>
            <span>{{nums}}/200</span>
          </el-form-item>
          <el-form-item label="申请提交方式">
            <el-input
              type="textarea"
              maxlength="200"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              v-model="form.subWay">
            </el-input>
            <span>{{nums2}}/200</span>
          </el-form-item>
        </el-form>
      </block-border>
      <div class="lx_btn_center">
        <el-button type="primary" @click="saveSchool">保存</el-button>
        <el-button @click="goR">取消</el-button>
      </div>
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
import FileUpload from '@/components/AttachFile/index'
import {addSchool} from '@/api/schoolManage.js'
import {getColType} from '@/api/dict.js'
import {ERR_OK} from '@/utils/status.js'
import {mapGetters} from 'vuex'
import {CountryMixin, ValitSchool} from '@/utils/mixin'
import {getTime} from '@/utils/index'

export default {
  mixins: [CountryMixin, ValitSchool],
  data() {
    return {
      disableLink: true,
      form: {
        nameCn: '', // 院校中文名
        nameEn: '', // 院校英文名
        selectTime: null, // 临时可选时间
        fgmp: '', // 操作规范
        subWay: '', // 提交方式
        isSpecial: true, // 是否独立申请
        specialEndTime: '', //  独立申请到期时间
        reason: '', // 原因 不可选原因
        colAddress: '',
        colAddressCn: '',
        colWebsite: '',
        attaName: '',
        colPropertieSel: '',
        selectType: '',
        schoolTypeChk: []
        // contryName: this.inputVal
      },
      // 使用中字段
      schoolType: [], // 院校类型
      colPropertieList: [], // 院校性质
      selectTypeList: [], // 是否可选
      resonFlag: false,
      timeFlag: false,
      obj: {
        bizType: 'COLLEGE'
      },
      filesList: [], // 院校附件
      pickerTimeLimit: { // 时间限制
        disabledDate: (time) => {
          // let selectTimeData = this.form.selectTime
          return time.getTime() < (new Date().getTime())
        }
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this._initColType()
    }, 17)
  },
  methods: {
    goR() {
      // window.history.go(-1)
      // this.form.nameCn = '' // 院校中文名
      // this.form.nameEn = '' // 院校英文名
      // this.form.selectTime = null // 临时可选时间
      // this.form.fgmp = '' // 操作规范
      // this.form.subWay = '' // 提交方式
      // this.form.isSpecial = true // 是否独立申请
      // this.form.specialEndTime = '' //  独立申请到期时间
      // this.form.reason = '' // 原因 不可选原因
      // this.form.colAddress = ''
      // this.form.colAddressCn = ''
      // this.form.colWebsite = ''
      // this.form.attaName = ''
      // this.form.colPropertieSel = ''
      // this.form.selectType = ''
      // this.form.schoolTypeChk = []
      window.close();

    },
    _getFileID(data) {
      this.filesList = data
    },
    // 新增院校
    saveSchool() {
      if (window.location.hash.length > 0) {
        window.location.hash = ''
      }
      if (this.countrylist.length < 0) {
        return
      }
      if (this.form.selectTime && getTime(this.form.selectTime) < (new Date().getTime())) {
        this.$message.error('可选时间必须大于现在的时间!')
        return
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          // console.log('111')
          addSchool({
            nameCn: this.form.nameCn,
            nameEn: this.form.nameEn,
            countryCode: this.countrylist[0].code,
            countryName: this.countrylist[0].nameCn,
            colProperty: this.form.colPropertieSel,
            selectType: this.form.selectType,
            selectTime: getTime(this.form.selectTime),
            colTypes: this._formatSchoolType(),
            isSpecial: this.form.isSpecial,
            specialEndTime: getTime(this.form.specialEndTime),
            contacts: this.schoolInfoList,
            colAddress: this.form.colAddress,
            colAddressCn: this.form.colAddressCn,
            colWebsite: this.form.colWebsite,
            fgmp: this.form.fgmp,
            subWay: this.form.subWay,
            attachments: this.filesList,
            reason: this.form.reason
          }).then((res) => {
            if (res.status === ERR_OK) {
//                 this.$message({
//                   duration: 2000,
//                   message: '院校添加成功',
//                   type: 'success'
//                 })
//                 setTimeout(() => {
//                     window.location.href = 'schooldetail.html?id='+res.data
// //                  this.$router.push({
// //                    name: 'School'
// //                  })
//                 }, 2001)

              this.$alert('院校添加成功！', '温馨提示', {
                confirmButtonText: '知道了',
                type: 'success',
                callback: action => {
                  setTimeout(() => {
                    window.location.href = 'schooldetail.html?id=' + res.data
                  }, 2001)
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
          this.$message.error('院校基本信息必须填写！')
          window.location.hash = "#basicMsg"
        }
      })
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
    // 允许独立申请
    changeApply() {
      this.form.specialEndTime = null
    },
    _formatSchoolType() {
      let data = []
      this.form.schoolTypeChk.map((item) => {
        data.push({
          typeCode: item.code,
          typeName: item.name
        })
      })
      return data
    },
    getSchollLink(...data) {
      this.form.colAddress = data[0].address
      this.form.colAddressCn = data[0].addresscn
      this.form.colWebsite = data[0].website
    },
    // 获取院校类型和院校性质及是否可选
    _initColType() {
      getColType().then((res) => {
        if (res.status === ERR_OK) {
          this.schoolType = res.data.colTypeList // 院校类型
          this.colPropertieList = res.data.colPropertieList // 院校性质
          this.selectTypeList = res.data.checkedTypeList
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'schoolInfoList'
    ]),
    nums() {
      if (!this.form.fgmp) {
        return 0
      } else {
        return this.form.fgmp.length
      }
    },
    nums2() {
      if (!this.form.subWay) {
        return 0
      } else {
        return this.form.subWay.length
      }
    }
  },
  watch: {},
  components: {
    SubHeader,
    BlockHeader,
    BlockBorder,
    Country,
    SchoolLink,
    FileUpload
  }
}
</script>
