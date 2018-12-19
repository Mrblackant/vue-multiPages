<template>
  <div class="lx_container">
    <div class="lx_main">
      <sub-header title="院校信息编辑" icon="yuanxiaoxinxi"></sub-header>
      <block-border>
        <block-header slot="title" title="基本信息">
          <div slot="right" class="lx_block_btn">
            <el-button type="primary" plain @click="updateSchool('base','TYPE1')">保存</el-button>
            <el-button @click="clearBaseSave('base')">取消</el-button>
          </div>
        </block-header>
        <el-form ref='form' slot="container" :rules="rules" :model='form' label-width='120px'>
          <el-row>
            <el-col :span='8'>
              <el-form-item label='院校中文名称' prop="nameCn">
                <el-input v-model="form.nameCn" class="width100" :maxlength="200"
                          placeholder="请输入院校中文名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='院校外文名称' prop="nameEn">
                <el-input v-model="form.nameEn" :maxlength="500"
                          placeholder="请输入院校外文名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='国家' prop="contryName">
                <country :data="countryData" title="请选择国家" overClass="lx_bottom_0"
                         :parentVal="countrylist"
                         :more="false"
                         :showTxt="true"
                         :inputVal="inputVal" key="one"
                         @country="getSelCountry">
                </country>
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
                <el-checkbox v-model="form.schoolTypeChk" v-for="item in schoolType"
                             :label="item" :key="item.code">{{item.name}}
                </el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="院校是否可选" prop="selectType">
              <el-radio v-model="form.selectType" v-for="item in selectTypeList" @change="changeSel"
                        :key="item.code" :checked="item.checked" :label="item.code" border class="width_110">{{item.name}}
              </el-radio>
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
          <div slot="right" class="lx_block_btn">
            <el-button type="primary" plain @click="updateSchool('base','TYPE2')">保存</el-button>
            <el-button @click="clearBaseSave('apply')">取消</el-button>
          </div>
        </block-header>
        <apply-table slot="container" :contsData="contsData" :isEdit="true"
                     :coopBtn="btnData.LXCOOPCOLSELECTAPPLY"></apply-table>
        <el-form ref="formInfo" :model="form" slot="container" label-width="80px" :disabled="formDisable">
          <div class="lx_school_sele lx_lone_apply">
            <div>
              <el-checkbox v-model="form.isSpecial" @change="changeApply" border>允许独立申请</el-checkbox>
            </div>
            <div>
              <el-form-item label="可选时间">
                <el-date-picker
                  v-model="form.specialEndTime"
                  type="datetime"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div><span class="lx_block_annotation" style="margin: 0 30px 0 0;color: red;" slot="annot">注：选择"允许独立申请"时,"可选时间"为必填项</span>
          </div>
        </el-form>
      </block-border>
      <school-link :disableLink="true" @schoolform="getSchollLink" :onlyRead="false" :dataAddress="form.colAddress"
                   :isAdd="false"
                   :dataAddressCn="form.colAddressCn"
                   :dataWebsite="form.colWebsite" @emit-event="updateLink('link','TYPE1')"
                   @emit-cancel="clearBaseSave('link')">
      </school-link>
      <block-border>
        <block-header slot="title" title="院校介绍及申请信息">
          <div slot="right" class="lx_block_btn">
            <el-button type="primary" plain @click="updateLink('link','TYPE2')">保存</el-button>
            <el-button @click="clearBaseSave('info')">取消</el-button>
          </div>
        </block-header>
        <el-form ref="formschool" slot="container" label-width="130px" :model="form">
          <el-form-item label="上传院校介绍附件">
            <file-upload :attaObj="obj" @files="_getFileID" :attaList="filesList"
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
      <logs logType='COL_HIS' :bizId="queryid" ref="logRecord"></logs>
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
import ApplyTable from '@/components/ApplySchoolTable'
import FileUpload from '@/components/AttachFile/index'
import Logs from '@/views/components/logs/logs'
import {editLink, editSchool, getConts, getSchoolDetail, setSel} from '@/api/schoolManage'
import {CountryMixin, DateTime, GetChildBtnMixin, ValitSchool} from '@/utils/mixin'
import {ERR_OK} from '@/utils/status.js'
import {mapGetters, mapMutations} from 'vuex'
import global_ from '@/Global'
import {getTime} from '@/utils/index'
import {GetRequest} from '@/utils/index.js'

export default {
  mixins: [CountryMixin, DateTime, ValitSchool, GetChildBtnMixin],
  data() {
    return {
      tmpList: [], // 附件临时存储
      form: {
        nameCn: '',
        nameEn: '',
        selectTime: null, // 临时可选时间
        fgmp: '', // 操作规范
        subWay: '', // 提交方式
        isSpecial: false,
        specialEndTime: null, //  独立申请到期时间
        reason: null, // 原因
        colAddress: '',
        colAddressCn: '',
        colWebsite: '',
        attaName: '',
        colPropertieSel: '', // 选中的院校性质
        schoolTypeChk: [], // 选择的院校类型
        selectType: null // 院校可选选中
      }, // 基础信息
      contsData: [], // 合作信息
      schoolType: [], // 院校类型
      colPropertieList: [], // 院校性质
      selectTypeList: [], // 院校可选列表
      resonFlag: false, // 展示不可选
      timeFlag: false, // 展示临时可选
      schoolData: [], // 院校详情临时存储
      formDisable: false, // 禁用编辑
      typeChkOri: [], // 原始院校选择类型数据
      contacts: [],
      obj: {
        bizType: 'COLLEGE'
      },
      filesList: [],
      fileID: [],
      pickerTimeLimit: { // 时间限制
        disabledDate: (time) => {
          // let selectTimeData = this.form.selectTime
          return time.getTime() < (new Date().getTime())
        }
      },
      queryid: '',
      pickerTimeLimit: { // 时间限制
        disabledDate: (time) => {
          let selectTimeData = this.form.selectTime
          return time.getTime() < (new Date().getTime())
        }
      }
    }
  },
  created() {
    this.initCountryParam = false
    let req = GetRequest()
    let id = req.id
    this.queryid = id
  },
  mounted() {
    if (!this.queryid) {
      this.$message.error('出错了，找不到对应院校信息！')
      setTimeout(() => {
        // this.$router.push({
        //   name: 'School'
        // })
        window.location.href = 'schoolmanage.html'
      }, 3001)
    } else {
      this.getAuthort('LXCOOPCOLSELECTAPPLY')
      this._initData(this.queryid)
      this.$refs.logRecord.getLogs();
      // if (sessionStorage.getItem('lx_type') === 'edit') {
      //     this.formDisable = false
      // }
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
          this._initEditData()
          sessionStorage.setItem('SCID', this.queryid)
        }
      }).then(() => {
        getConts({id: id}).then(res => {
          if (res.status === ERR_OK) {
            this.contsData = res.data
          }
          this.form.isSpecial = this.schoolData.isSpecial
          let heZuoData = this.contsData === null ? this.res.data : this.contsData
          let specialEndTime = this.form.specialEndTime === null ? this.schoolData.specialEndTime : this.form.specialEndTime
          let i = 0
          if (heZuoData.length > 0) {
            for (let argument of heZuoData) {
              if (argument.selectType === null) {
                if (argument.contStatus.name === '生效中' && (argument.isSelected)) {
                  this.form.isSpecial = false
                  i++
                }
              } else {
                if (argument.contStatus.name === '生效中' && (argument.selectType.code === 'UNCHECKED')) {
                  this.form.isSpecial = false
                  i++
                }
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
        })
      })
    },
    _initEditData() {
      if (this.schoolData !== null) {
        if (this.schoolData.colPropertiesList !== null) {
          this.colPropertieList = this.schoolData.colPropertiesList
        }
        if (this.schoolData.colProperty !== null) {
          // 院校性质列表
          this.form.colPropertieSel = this.schoolData.colProperty.code
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
      // this.form.isSpecial = this.schoolData.isSpecial
      this.form.specialEndTime = this.schoolData.specialEndTime
      this.form.selectTime = this.schoolData.selectTime
      this.tmpList = this.schoolData.attachments

      this._formatFile()
      this._initCountry()
      this.schoolType = this.schoolData.colTypes
      this.selectTypeList = this.schoolData.checkTypeList
      this._initSelType()
      this.contacts = this.schoolData.contacts.slice()
      this.setSchoolInfoList(this.schoolData.contacts)
      this.schoolType.map((item) => {
        if (item.checked === true) {
          this.form.schoolTypeChk.push(item)
          this.typeChkOri.push(item)
        }
      })
      // this.typeChkOri = this.schoolTypeChk.splice()
    },
    // 取消基本保存
    clearBaseSave(type) {
      if (type === 'base') {
        this.form.colPropertieSel = this.schoolData.colProperty.code
        this.form.nameCn = this.schoolData.nameCn
        this.form.nameEn = this.schoolData.nameEn
        this.form.reason = this.schoolData.reason
        this.form.selectTime = this.schoolData.selectTime
//          this.countrylist[0].code = this.schoolData.countryCode
//          this.countrylist[0].nameCn = this.schoolData.countryName
        this.countrylist = []
        this._initSelType()
        this.form.schoolTypeChk = this.typeChkOri
      } else if (type === 'link') {
        // console.log('联系取消')
        this.form.colAddress = this.schoolData.colAddress
        this.form.colAddressCn = this.schoolData.colAddressCn
        this.form.colWebsite = this.schoolData.colWebsite
        this.setSchoolInfoList(this.contacts)
        // console.log(this.contacts)
      } else if (type === 'info') {
        this.form.fgmp = this.schoolData.fgmp
        this.form.subWay = this.schoolData.subWay
      } else if (type === 'apply') {
        this.form.isSpecial = this.schoolData.isSpecial
        this.form.specialEndTime = this.schoolData.specialEndTime
      }
    },
    // 允许独立申请
    changeApply() {
      this.form.specialEndTime = null
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
    // 处理院校可选
    _initSelType() {
      this.selectTypeList.map((item) => {
        if (item.checked) {
          this.form.selectType = item.code
        }
      })
      this.changeSel(this.form.selectType)
    },
    // 修改合作信息和基本信息的参数
    _formSendType(module, type) {
      let ID = this.queryid
      let type1 = { // 基本信息
        id: ID,
        operatorType: type,
        countryCode: this.countrylist[0].code,
        countryName: this.countrylist[0].nameCn,
        nameCn: this.form.nameCn,
        nameEn: this.form.nameEn,
        colProperty: this.form.colPropertieSel,
        selectType: this.form.selectType,
        reason: this.form.reason,
        selectTime: getTime(this.form.selectTime),
        colTypes: this._formatSchoolType()
      }
      let type2 = { // 合作信息
        id: ID,
        operatorType: type,
        isSpecial: this.form.isSpecial === null ? false : this.form.isSpecial,
        specialEndTime: getTime(this.form.specialEndTime)
      }
      let type3 = { // 联系人
        id: ID,
        operatorType: type,
        contacts: this.schoolInfoList,
        colAddress: this.form.colAddress,
        colAddressCn: this.form.colAddressCn,
        colWebsite: this.form.colWebsite
      }
      let type4 = { // 院校介绍
        id: ID,
        operatorType: type,
        fgmp: this.form.fgmp,
        subWay: this.form.subWay,
        attachments: this._formatFileID()
        // attachments:
      }
      let params = {}
      if (module === 'base') {
        if (type === 'TYPE1') {
          params = type1
        } else if (type === 'TYPE2') {
          params = type2
        }
      } else if (module === 'link') {
        if (type === 'TYPE1') {
          params = type3
        } else if (type === 'TYPE2') {
          params = type4
        }
      }
      return params
    },
    // 编辑基本信息
    updateSchool(module, type) {
      if (type === 'TYPE2' && this.form.isSpecial !== null && this.form.isSpecial === true && this.form.specialEndTime === null) {
        this.$message.error('选择"允许独立申请"时,"可选时间"为必填项')
        return
      }

      if (type === 'TYPE1' && this.form.selectTime && getTime(this.form.selectTime) < (new Date().getTime())) {
        this.$message.error('可选时间必须大于现在的时间!')
        return
      }

      if (type === 'TYPE1') {
        let flag=false
        this.$refs.form.validate((valid) => {
          flag = valid
        })
        if (!flag) {
          this.$message.error('院校基本信息必须填写!')
          return
        }
      }
      let hZData = this.contsData === null ? this.res.data : this.contsData
      let i = 0
      let formIsSpecial = this.form.isSpecial
      if (hZData.length > 0) {
        for (let argument of hZData) {
          if (argument.selectType === null) {
            if (argument.contStatus.name === '生效中' && (argument.isSelected)) {
              this.form.isSpecial = false
              i++
            }
          } else {
            if (argument.contStatus.name === '生效中' && (argument.selectType.code === 'UNCHECKED')) {
              this.form.isSpecial = false
              i++
            }
          }
        }
        if (i === 0 && this.form.isSpecial === false) {
          this.$message.error('当前院校无可选的合作信息，独立申请状态不可取消')
          return
        }
      } else {
        if (this.form.isSpecial === false) {
          this.$message.error('当前院校无可选的合作信息，独立申请状态不可取消')
          return
        }
      }
      this.form.isSpecial = formIsSpecial
      editSchool(this._formSendType(module, type)).then(res => {
        if (res.status === ERR_OK) {
          // this.$message.success('修改成功')
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
    // 编辑联系人和院校申请信息
    updateLink(module, type) {
      // console.log(module, type, '院校联系人')
      editLink(this._formSendType(module, type)).then(res => {
        if (res.status === ERR_OK) {
          // console.log(res)
          // this.$message.success('修改成功')
          this.$alert('修改成功！', '温馨提示', {
            confirmButtonText: '知道了',
            type: 'success'
          })
        } else {
          // this.$message.error('程序错误')
          this.$alert('程序错误！' + res.msg, '错误提示', {
            confirmButtonText: '知道了',
            type: 'error'
          })
        }
      })
    },
    // 处理选中提交的院校类型
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
    // 显示可选类型
    changeSel(label) {
      if (label === 'UNCHECKED') {
        this.resonFlag = true
        this.timeFlag = false
        this.form.selectTime = null // 不可选时清空临时可选时间
      } else if (label === 'TEMPORARY') {
        this.resonFlag = false
        this.form.reason = null // 临时可选是清空不可选原因
        this.timeFlag = true
      } else {
        this.resonFlag = false
        this.timeFlag = false
        // 可选时清空原因和时间
        this.form.reason = null
        this.form.selectTime = null
      }
    },
    // 监听联系人
    getSchollLink(...data) {
      this.form.colAddress = data[0].address
      this.form.colAddressCn = data[0].addresscn
      this.form.colWebsite = data[0].website
    },
    _formatFileID() {
      if (this.filesList === 0) {
        return null
      } else {
        let M = []
        this.filesList.map(item => {
          M.push({
            id: item.id
          })
        })
        return M
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 设为不可选或可选
    handleSelected(index, row) {
      // console.log(index, row)
      setSel({
        colOrgId: row.levelId,
        selectType: row.selectType.code === 'UNCHECKED' ? 'CHECKED' : 'UNCHECKED'
      }).then(res => {
        if (res.status === ERR_OK) {
          console.log('111')
        }
      })
    },
    // 查看申请信息
    handleSee(index, row) {
      console.log(index, row)
    },
    _formatDate1(row) {
      if (row.originalStartTime === null) {
        return '/'
      } else {
        return this._forMatterTime(row.originalStartTime, '{y}-{m}-{d}')
      }
    },
    _formatDate2(row) {
      return this._forMatterTime(row.startTime, '{y}-{m}-{d}')
    },
    _formatDate3(row) {
      return this._forMatterTime(row.endTime, '{y}-{m}-{d}')
    },
    _formatType(row) {
      if (row.applyType.code === global_.DIRECTCOL) {
        return row.applyType.name
      } else {
        return `${row.orgNameEn}(${row.orgNameCn})`
      }
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
  watch: {
    countryData: {
      handler(newVal, oldVal) {
        if (newVal) {
          let that = this
          newVal.map(i => {
            if (i.code === that.schoolData.countryCode) {
              that.countrylist.push(i)
            }
          })
        }
      },
      deep: true
    }
  },
  components: {
    SubHeader,
    BlockHeader,
    BlockBorder,
    Country,
    SchoolLink,
    ApplyTable,
    FileUpload,
    Logs
  }
}
</script>
