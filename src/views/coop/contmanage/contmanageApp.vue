<template>
  <div class="lx_container">
    <div class="lx_main">
      <sub-header title="合作项目查询">
      </sub-header>
      <block-border>
        <block-header slot="title" title="查询条件"></block-header>
        <div slot="container">
          <el-form rel="form" :model="form" label-width="120px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="国家">
                  <country :data="countryData" class="lx_bottom_0" title="国家选择" :more="false" :showTxt="true"
                           :inputVal="inputVal" :parentVal="countrylist"
                           @country="getSelCountry"></country>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合作方式">
                  <el-select v-model='form.applyType' @change="changeInput" clearable placeholder='请选择' class='width100'>
                    <el-option v-for="item in applyTypesList" :label='item.name' :value='item.code'
                               :key="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="院校名称">
                  <el-autocomplete
                    :disabled="isSchoolToggle"
                    popper-class="lx_autocomplete"
                    class='inline-input width100'
                    v-model='form.coopColName'
                    :fetch-suggestions='querySearch'
                    placeholder='请输入内容'
                    @select='handleSelect'>
                    <template slot-scope="{ item }">
                      <div class="name">{{ item.value }}</div>
                      <span class="addr">{{ item.nameEn }}</span>
                    </template>
                  </el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="机构名称">
                  <el-autocomplete
                    :disabled="isOrgToggle"
                    popper-class="lx_autocomplete"
                    class='inline-input width100'
                    v-model='form.coopOrgName'
                    :fetch-suggestions='querySearchOrg'
                    placeholder='请输入内容'
                    :trigger-on-focus='false'
                    @select='handleSelect'>
                    <template slot-scope="{ item }">
                      <div class="name">{{ item.value }}</div>
                      <span class="addr">{{ item.nameEn }}</span>
                    </template>
                  </el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合作项目">
                  <el-input v-model="form.projectName" placeholder="请输入合作项目名称" class="width100">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合作等级">
                  <el-select v-model='form.level' clearable placeholder='请选择' class='width100'>
                    <el-option v-for="item in levelList" :label='item.name' :key="item.code" :value='item.code'>
                      {{item.name}}
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="合同状态">
                  <el-select v-model='form.status' clearable placeholder='请选择' class='width100'>
                    <el-option v-for="item in conStatusList" :label='item.name' :value='item.code'
                               :key="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="签字协议是否上传" class="longword">
                  <el-select v-model="form.isUpload" clearable placeholder='请选择' class='width100'>
                    <el-option label='是' :value='true'></el-option>
                    <el-option label='否' :value='false'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最初合同开始日期" class="longword width100">
                  <el-date-picker
                    v-model='form.originalStartTime'
                    type='daterange'
                    class='width100'
                    placeholder='选择日期'>
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="最新合同开始日期" class="longword width100">
                  <el-date-picker
                    v-model='form.startTime'
                    type='daterange'
                    class='width100'
                    placeholder='选择日期'>
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最新合同结束日期" class="longword width100">
                  <el-date-picker
                    v-model='form.endTime'
                    type='daterange'
                    class='width100'
                    placeholder='选择日期'>
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="报审人">
                  <el-input v-model="form.applyPerson" placeholder="请输入报审人名称" class="width100">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="8">
                <el-form-item label="审批通过时间" class="longword width100">
                  <el-date-picker
                    v-model='form.approveDate'
                    type='daterange'
                    class='width100'
                    placeholder='选择日期'>
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button type="primary" plain class='width100' @click="search('0')">查询</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </block-border>
      <block-border>
        <block-header slot="title" title="查询结果">
        </block-header>
        <div slot="container">
          <el-table :data="resultData" header-row-class-name="lx_table_hd" fit>
            <el-table-column prop="countryName" label="国家"></el-table-column>
            <el-table-column prop="orgNameCn" :formatter="formatterNameCn" label="院校/机构中文名"
            ></el-table-column>
            <el-table-column prop="orgNameEn" :formatter="formatterNameEn" label="院校/机构外文名">
              <template slot-scope="scope">
                <span :title="formatterNameEn(scope.row)" v-text="formatterNameEn(scope.row)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="projectName" label="合作项目"></el-table-column>
            <el-table-column :formatter="formatterSchol" label="院校性质" width="80px"></el-table-column>
            <el-table-column prop="applyType.name" label="合作方式" width="80px"></el-table-column>
            <el-table-column label="合作等级" width="70px">
              <template prop="leavel" slot-scope="scope" >{{ levalTemp[scope.row.leavel] }}</template>
            </el-table-column>
            <el-table-column :formatter="formatterDate3" label="最初合同开始日期" width="95px"></el-table-column>
            <el-table-column :formatter="formatterDate1" label="最新合同开始日期" width="95px"></el-table-column>
            <el-table-column :formatter="formatterDate2" label="最新合同结束日期" width="95px"></el-table-column>
            <el-table-column :formatter="formatterDate4" label="审批通过日期" width="95px"></el-table-column>
            <el-table-column prop="status.name" label="合同状态" width="70px"></el-table-column>
            <el-table-column prop="applyUserName" label="报审人" width="70px"></el-table-column>
            <el-table-column prop="isUpload" :formatter="formatterUpload" label="签证协议是否上传" width="70px"></el-table-column>
            <el-table-column fixed="right" label="操作" width="190px">
              <template slot-scope="scope">
                <div class="lx_operation_btn">
                  <el-button size="mini" @click="goCheck(scope.row,'type2')">查看</el-button>
                </div>
                <div class="lx_operation_btn">
                  <el-button size="mini" v-if="isRenew(scope.row)" @click="goSupp(scope.row)">补充协议</el-button>
                </div>
                <div class="lx_operation_btn">
                  <el-button size="mini" v-if="isRenew(scope.row)" @click="goRenew(scope.row)">续签</el-button>
                </div>
                <div class="lx_operation_btn">
                  <el-button size="mini" v-if="isDiff(scope.row)&&btnData.LXCOOPAPPLY" @click="goDiff(scope.row)">信息修正</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="lx_page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 15, 20, 30]"
              :page-size="10"
              prev-text="上一页"
              next-text="下一页"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount">
            </el-pagination>
          </div>
        </div>
      </block-border>
    </div>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">

  .lx_operation_btn {
    margin-bottom: 2px;
    float: left;
    padding-left: 10px;
  }

  .el-date-editor--daterange.width100 {
    width: 100%;
  }

  .lx_autocomplete {
    li {
      line-height: normal;
      padding: 7px;
      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }

  .lx_table_conf {
    margin-left: 25px;
  }

  .lx_conf_chk {
    margin-right: 10px;
    margin-bottom: 10px;
    text-align: center;
  }

  .longword label {
    line-height: 20px;
    padding-left: 50px;
  }

</style>
<script type="text/ecmascript-6">
import SubHeader from '@/components/SubHeader'
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'
import {ERR_OK} from '@/utils/status'
import {getApplyDict, getLevelTable} from '@/api/dict'
import {searchAll} from '@/api/coopContract'
import Country from '@/components/Country'
import {CountryMixin, DateTime, SchoolNameAutoMixin, OrgNameAtuoMixin, GetChildBtnMixin} from '@/utils/mixin'
import global_ from '@/Global'
import {getTime} from '@/utils/index'
import {getRenew} from '@/api/coopContract'
import {mapMutations, mapGetters} from 'vuex'

export default {
  mixins: [CountryMixin, DateTime, SchoolNameAutoMixin, OrgNameAtuoMixin, GetChildBtnMixin],
  data() {
    return {
      resultData: [],
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      form: {
        country: null,
        applyType: null,
        coopColName: null,
        coopOrgName: null,
        colProperty: null,
        level: null,
        status: null,
        startTime: [],
        originalStartTime: [],
        endTime: [],
        approveDate: [],
        isUpload: null,
        applyPerson: null,
        projectName: null
      },
      isDer: false,
      applyTypesList: [],
      levelList: [],
      conStatusList: [],
      isSchoolToggle: false,
      isOrgToggle: false,
      levelTableList: [],
      levalTemp: {}
    }
  },
  mounted() {
    // if (this.contList.length > 0) {
    //   this.resultData = this.contList
    // }
    // if (JSON.stringify(this.contCondition) !== '{}') {
    //   if (JSON.stringify(this.contCondition.page) !== '{}') {
    //     this.pageNum = this.contCondition.page.pageNum
    //     this.pageSize = this.contCondition.page.pageSize
    //     this.totalCount = this.contCondition.page.totalCount
    //   }
    //   if (JSON.stringify(this.contCondition.condition) !== '{}') {
    //     this.form.country = this.contCondition.condition.country
    //     this.form.applyType = this.contCondition.condition.applyType
    //     this.form.coopColName = this.contCondition.condition.coopColName
    //     this.form.coopOrgName = this.contCondition.condition.coopOrgName
    //     this.form.colProperty = this.contCondition.condition.colProperty
    //     this.form.level = this.contCondition.condition.level
    //     this.form.status = this.contCondition.condition.status
    //     this.form.startTime = this.contCondition.condition.startTime
    //     this.form.originalStartTime = this.contCondition.condition.originalStartTime
    //     this.form.endTime = this.contCondition.condition.endTime
    //     this.form.isUpload = this.contCondition.condition.isUpload
    //     this.form.applyPerson = this.contCondition.condition.applyPerson
    //     this.form.projectName = this.contCondition.condition.projectName
    //   }
    // }
    let that = this
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
      this.getAuthort('LXCOOPAPPLY')
      this._initEnmu()
    }, 17)
  },
  methods: {
    _initEnmu() {
      getApplyDict().then(res => {
        if (res.status === ERR_OK) {
          // this.colTypeList = res.data.conTypes
          this.levelList = res.data.leavels
          res.data.applyTypes.map(item => {
            if (item.code !== global_.SPECIAL) {
              this.applyTypesList.push(item)
            }
          })
          this.conStatusList = res.data.conStatus
          this.applyStatusList = res.data.applyStatus
        }
      })
    },
    changeInput() {
      if (this.form.applyType === global_.ORGCOL) {
        this.isSchoolToggle = false
        this.isOrgToggle = false
      } else if (this.form.applyType === global_.DIRECTCOL || this.form.applyType === global_.SPECIAL) {
        this.isOrgToggle = true
        this.isSchoolToggle = false
      } else if (this.form.applyType === global_.ORGDERIVATIVE) {
        this.isSchoolToggle = true
        this.isOrgToggle = false
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.search()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.search(val)
    },
    search(num) {
      let names = this.form.coopColName
      let colID = this.selectSchoolID
      if (names === null || names === undefined || names === '') {
        colID = null // 清空院校ID
      }
      let orgNames = this.form.coopOrgName
      let orgID = this.selectOrgID
      if (orgNames === null || orgNames === undefined || orgNames === '') {
        orgID = null // 清空院校ID
      }
      searchAll({
        pageSize: this.pageSize,
        pageNum: num === '0' ? 1 : this.pageNum,
        countryCode: this.sendCountry,
        projectName: this.form.projectName,
        nameCn: this.form.orgName,
        nameEn: this.form.orgName,
        applyType: this.form.applyType,
        colName: this.form.coopColName,
        coopColId: colID,
        orgName: this.form.coopOrgName,
        coopOrgId: orgID,
        colProperty: this.form.colProperty,
        leavel: this.form.level,
        status: this.form.status,
        isUpload: this.form.isUpload,
        applyUserName: this.form.applyPerson,
        originalStartTime1: getTime((this.form.originalStartTime === null || this.form.originalStartTime.length === 0) ? null : this.form.originalStartTime[0]),
        originalStartTime2: getTime((this.form.originalStartTime === null || this.form.originalStartTime.length === 0) ? null : this.form.originalStartTime[1]),
        startTime1: getTime((this.form.startTime === null || this.form.startTime.length === 0) ? null : this.form.startTime[0]),
        startTime2: getTime((this.form.startTime === null || this.form.startTime.length === 0) ? null : this.form.startTime[1]),
        endTime1: getTime((this.form.endTime === null || this.form.endTime.length === 0) ? null : this.form.endTime[0]),
        endTime2: getTime((this.form.endTime === null || this.form.endTime.length === 0) ? null : this.form.endTime[1]),
        approveDate1: getTime((this.form.approveDate === null || this.form.approveDate.length === 0) ? null : this.form.approveDate[0]),
        approveDate2: getTime((this.form.approveDate === null || this.form.approveDate.length === 0) ? null : this.form.approveDate[1])
      }).then((res) => {
        if (res.status === ERR_OK) {
          this.pageSize = res.data.pageSize
          this.totalCount = res.data.totalCount
          this.pageNum = res.data.page
          this.setContList(res.data.list)
          this.setContCondition({
            page: {
              pageSize: res.data.pageSize,
              totalCount: res.data.totalCount,
              pageNum: res.data.page
            },
            condition: {
              country: this.sendCountry,
              applyType: this.form.applyType,
              coopColName: this.form.coopColName,
              coopOrgName: this.form.coopOrgName,
              colProperty: this.form.colProperty,
              level: this.form.level,
              status: this.form.status,
              startTime: this.form.startTime,
              originalStartTime: this.form.originalStartTime,
              endTime: this.form.endTime,
              approveDate: this.form.approveDate,
              isUpload: this.form.isUpload,
              applyPerson: this.form.applyPerson,
              projectName: this.form.projectName
            }
          })
          this.resultData = this.contList
        } else {
          // this.$message.error(res.msg)
          this.$alert(res.msg, '错误提示', {
            confirmButtonText: '知道了',
            type: 'error'
          })
        }
      })
    },
    breakGo(row){
      debugger
      if(row.approveConType){
        let type = ''
        if(global_.CONT_SUPP === row.approveConType.code){
          type = '补充协议'
        }else {
          type = '续签'
        }
        this.$alert('该项目已提交' + type + '申请正在审批中，不容许当前操作！', '错误提示', {
          confirmButtonText: '知道了',
          type: 'warn',
          callback: action => {
            return false
          }
        });
        return false
      }
      return true
    },
    // 续签
    goRenew(row) { // 此处逻辑为已经被自己续签过的项目跳转到编辑页面
      if(!this.breakGo(row)){
        return
      }
      if (row.applyType.code === global_.DIRECTCOL) {
        window.open('applyrenew.html?conId=' + row.id + '&rowId=' + row.id + '&applyType=' + row.applyType.code + '&conType=' + global_.CONT_RENEW)
      } else if (row.applyType.code === global_.ORGDERIVATIVE) {
        window.open('applyrenewderive.html?id=' + row.id + '&conType=' + global_.CONT_RENEW)
      } else if (row.applyType.code === global_.ORGCOL) {
        let conId = row.conId === undefined ? "" : row.conId
        window.open('applyrenew.html?conId=' + conId + '&rowId=' + row.id + '&applyType=' + row.applyType.code + '&conType=' + global_.CONT_RENEW)
      }
    },
    // 补充协议
    goSupp(row) { // 此处逻辑为已经被自己续签过的项目跳转到编辑页面
      if(!this.breakGo(row)){
        return
      }
      if (row.applyType.code === global_.DIRECTCOL) {
        window.open('applyrenew.html?conId=' + row.id + '&rowId=' + row.id + '&applyType=' + row.applyType.code + '&conType=' + global_.CONT_SUPP)
      } else if (row.applyType.code === global_.ORGDERIVATIVE) {
        window.open('applyrenewderive.html?id=' + row.id + '&conType=' + global_.CONT_SUPP)
      } else if (row.applyType.code === global_.ORGCOL) {
        let conId = row.conId === undefined ? "" : row.conId
        window.open('applyrenew.html?conId=' + conId + '&rowId=' + row.id + '&applyType=' + row.applyType.code + '&conType=' + global_.CONT_SUPP)
      }
    },
    // 是否新签
    isRenew(row) {
      if (row.status !== null && row.applyType !== null) {
        if ((row.status.code === 'NORMAL' || row.status.code === 'OUT_TIME') && row.isRenew !== true && row.applyType.code !== global_.ORGDERIVATIVE) {
          return true
        } else {
          return false
        }
      }
    },
    // 信息修正按钮
    goDiff(row) {
      if(!this.breakGo(row)){
        return
      }
      // window.location.href = 'contedit.html?id=' + row.id + '&type=' + this._applyType(row.applyType.code) + '&derive=' + this.isDer
      window.open('contedit.html?id=' + row.id + '&type=' + this._applyType(row.applyType.code) + '&derive=' + this.isDer)
//        this.$router.push({
//          name: 'DiffContract',
//          query: {
//            id: row.id,
//            type: this._applyType(row.applyType.code),
//            derive: this.isDer
//          }
//        })
    },
    // 是否显示信息修正
    isDiff(row) {
      let code = null
      if (row.status !== null) {
        code = row.status.code
      } else {
        code = null
      }
      if (row.applyType.code === global_.ORGDERIVATIVE || code !== 'NORMAL' || row.isRenew === true) {
        return false
      } else {
        return true
      }
    },
    formatterDate1(row) {
      return this._forMatterTime(row.startTime, '{y}-{m}-{d}')
    },
    formatterDate2(row) {
      return this._forMatterTime(row.endTime, '{y}-{m}-{d}')
    },
    formatterDate3(row) {
      if (row.originalStartTime === null) {
        return '/'
      }
      return this._forMatterTime(row.originalStartTime, '{y}-{m}-{d}')
    },
    formatterDate4(row) {
      return this._forMatterTime(row.approveDate, '{y}-{m}-{d}')
    },
    formatterUpload(row) {
      if (row.isUpload === true) {
        return '是'
      } else {
        return '否'
      }
    },
    formatterSchol(row) {
      if (row.colProperty === null) {
        return '/'
      }
      return row.colProperty.name
    },
    formatterNameEn(row) {
      if (row.applyType.code === global_.DIRECTCOL) {
        return row.colNameEn
      } else {
        return row.orgNameEn
      }
    },
    formatterNameCn(row) {
      if (row.applyType.code === global_.DIRECTCOL) {
        return row.colNameCn
      } else {
        return row.orgNameCn
      }
    },
    _applyType(type) {
      if (type === global_.ORGCOL || type === global_.ORGDERIVATIVE) {
        return 'org'
      } else {
        return 'school'
      }
    },
    goCheck(row, types) {
      if (row.applyType.code === global_.ORGDERIVATIVE) {
        this.isDer = true
      } else {
        this.isDer = false
      }
//        window.location.href = 'contdetail.html?id=' + row.id + '&type=' + this._applyType(row.applyType.code) 
//            + '&derive= ' + this.isDer + '&edit=' + (types === 'type2' ? true : false)
      window.open('contdetail.html?id=' + row.id + '&type=' + this._applyType(row.applyType.code)
        + '&derive= ' + this.isDer + '&edit=' + (types === 'type2' ? true : false))
//        this.$router.push({
//          name: 'Cooperation',
//          query: {
//            id: row.id,
//            type: this._applyType(row.applyType.code),
//            derive: this.isDer,
//            /* eslint-disable */
//            edit: types === 'type2' ? true : false
//          }
//        })
    },
    ...mapMutations({
      setContList: 'SET_CONTLIST',
      setContCondition: 'SET_CONTCONDITION'
    })
  },
  computed: {
    sendCountry() {
      let l = []
      this.countrylist.map((item) => {
        l.push(
          item.code
        )
      })
      return l
    },
    currentPage() {
      return this.pageNum
    },
    isShowPage() {
      if (this.totalCount <= this.pageSize) {
        return false
      } else {
        return true
      }
    },
    ...mapGetters([
      'contList',
      'contCondition'
    ])
  },
  components: {
    BlockBorder,
    BlockHeader,
    SubHeader,
    Country
  }
}
</script>
