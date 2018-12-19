<template>
  <div class="lx_container">
    <div class='lx_main'>
      <sub-header icon='' title='审批进度查询'></sub-header>
      <block-border>
        <block-header title="查询条件" slot="title"></block-header>
        <el-form slot="container" :model='form' label-width='120px'>
          <el-row>
            <el-col>
              <el-form-item label='国家'>
                <country :data="countryData" title="请选择国家" overClass="lx_bottom_0" :more="false" :showTxt="false"
                         :inputVal="inputVal"
                         @country="getSelCountry"></country>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label='合同类型'>
                <el-select v-model="form.conType" clearable placeholder="请选择合同类型" class="width100">
                  <el-option v-for="item in colTypeList" :label="item.name" :value="item.code"
                             :key="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label='合作等级'>
                <el-select v-model='form.level' clearable placeholder='请选择' class='width100'>
                  <el-option v-for="item in levelList" :label="item.name" :value='item.code'
                             :key="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='合作方式'>
                <el-select v-model='form.applyType' clearable placeholder='请选择' class='width100'
                           @change="changeDisable" @clear="changeClear">
                  <el-option v-for="item in applyTypesList" :label='item.name' :value='item.code'
                             :key="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='8'>
              <el-form-item label='院校名称'>
                <el-autocomplete
                  :disabled="disabledN"
                  popper-class="lx_autocomplete"
                  class='inline-input width100'
                  v-model='form.coopColName'
                  :fetch-suggestions='querySearch'
                  placeholder='请输入内容'
                  :trigger-on-focus='false'
                  @select='handleSelect'
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                    <span class="addr">{{ item.nameEn }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='机构名称'>
                <el-autocomplete
                  popper-class="lx_autocomplete"
                  :disabled="disabledO"
                  class='inline-input width100'
                  v-model='form.coopOrgName'
                  :fetch-suggestions='querySearchOrg'
                  placeholder='请输入内容'
                  :trigger-on-focus='false'
                  @select='handleSelectOrg'
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                    <span class="addr">{{ item.nameEn }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='合作项目'>
                <el-input type="text" v-model="form.projectName" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='8'>
              <el-form-item label='申请状态'>
                <el-select v-model='form.status' clearable placeholder='请选择' class='width100'>
                  <el-option v-for="item in applyStatusList" :label='item.name' :value='item.code'
                             :key="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='报审日期'>
                <el-date-picker v-model='form.applyDate' class='width100'
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='最初合同开始日期' class="longword">
                <el-date-picker
                  v-model='form.originalStartTime'
                  class='width100'
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='8'>
              <el-form-item label='最新合同开始日期' class="longword">
                <el-date-picker v-model='form.startTime' class='width100'
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='最新合同结束日期' class="longword">
                <el-date-picker
                  v-model='form.endTime'
                  class='width100'
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='报审人'>
                <el-input v-model="form.applyPerson" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span='8' v-show="isConStatu">
              <el-form-item label='合同状态'>
                <el-select v-model='form.conStatus' clearable placeholder='请选择' class='width100'>
                  <el-option v-for="item in conStatusList" :label='item.name' :value='item.code'
                             :key="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='2' v-show="isConStatu"></el-col>
            <el-col :span='10' v-show="!isConStatu"></el-col>
            <el-col :span='6' justify="right">
              <el-form-item>
                <el-button type='primary' class='width100' plain @click="searchApply('0')">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </block-border>
      <block-border>
        <block-header title="查询结果" slot="title"></block-header>
        <div slot="container">
          <el-table :data="tableData" class="width100 " header-row-class-name="lx_table_hd">
            <el-table-column
              prop="countryName"
              width="120px"
              label="国家">
            </el-table-column>
            <el-table-column
              :formatter="formatterEn"
              label="院校/机构外文名">
              <template slot-scope="scope">
                <span :title="formatterEn(scope.row)" v-text="formatterEn(scope.row)"></span>
              </template>
            </el-table-column>
            <el-table-column
              :formatter="formatterCn"
              label="院校/机构中文名">
            </el-table-column>
            <el-table-column
              prop="projectName"
              label="合作项目">
            </el-table-column>
            <el-table-column
              prop="applyType.name"
              width="140px"
              label="合作方式">
            </el-table-column>
            <el-table-column
              prop="conType.name"
              width="80px"
              label="合同类型">
            </el-table-column>
            <el-table-column
              prop="status.name"
              width="80px"
              label="申请状态">
            </el-table-column>
            <el-table-column
              prop="applyDate"
              :formatter="formatterDate1"
              width="100px"
              label="报审时间">
            </el-table-column>
            <el-table-column
              prop="endTime"
              :formatter="formatterDate2"
              width="110px"
              label="合同到期时间">
            </el-table-column>
            <el-table-column
              prop="conStatus.name"
              label="合同状态" width="90px">
            </el-table-column>
            <el-table-column
              prop="applyUserName"
              width="80px"
              label="报审人">
            </el-table-column>
            <el-table-column
              prop="operation"
              fixed="right"
              label="操作"
              width="220px">
              <template slot-scope="scope">
                <el-button size="mini" @click="goCheck(scope.row)">查看</el-button>
                <el-button size="mini" v-if="isEdit(scope.row)" @click="goEdit(scope.row)">编辑</el-button>
                <el-button size="mini" v-if="isDel(scope.row)" @click="goDel(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="lx_page" v-show="totalCount>pageSize">
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
<style lang='scss' rel='stylesheet/scss'>
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

  .longword label {
    line-height: 20px;
    padding-left: 50px;
  }

  .lx_subhd_box {
    position: absolute;
    right: 77px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .lx_country_box {
    display: flex;
    height: 40px;
    margin-bottom: 22px;
    align-items: center;
    .lx_chkall_country {
      width: 120px;
      display: flex;
      padding-right: 12px;
      justify-content: flex-end;
    }
  }

  .lx_page {
    margin-top: 50px;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
  }

  .el-button + .el-button {
    margin-left: 0px;
  }
</style>
<script type='text/ecmascript-6'>
import SubHeader from '@/components/SubHeader'
import BlockHeader from '@/components/BlockHeader'
import BlockBorder from '@/components/BlockBorder'
import Country from '@/components/Country'
import {CountryMixin, DateTime, SchoolNameAutoMixin, OrgNameAtuoMixin} from '@/utils/mixin'
import {getApplyDict} from '@/api/dict'
import {getApplyList, delApply} from '@/api/coopManage'
import {getTime} from '@/utils/index'
import {ERR_OK} from '@/utils/status'
import global_ from '@/Global'
import {mapGetters, mapMutations} from 'vuex'

export default {
  mixins: [CountryMixin, DateTime, SchoolNameAutoMixin, OrgNameAtuoMixin],
  data() {
    return {
      colTypeList: [], // 合同类型
      levelList: [], // 合作等级
      applyTypesList: [], // 合作方式
      conStatusList: [], // 合同状态
      applyStatusList: [], // 申请状态
      form: {
        conType: null, // 合同类型
        level: null, // 合作等级
        applyType: null, // 合作方式
        coopColId: null, // 院校id
        coopColName: null, // 院校名称
        coopOrgId: null, // 机构ID
        coopOrgName: null, // 机构名称
        projectName: null, // 合作项目名称
        status: null, // 申请状态
        conStatus: null, // 合同状态
        isUpload: null, // 签字协议是否上传
        applyDate: [], // 报审时间
        startTime: [], // 合同开始日期
        endTime: [], // 合同结束日期
        originalStartTime: [], // 最初合同开始日期
        applyPerson: null // 报审人
      },
      isDer: false, // 是否衍生服务
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      tableData: [],
      disabledN: false,
      disabledO: false
    }
  },
  mounted() {
    // if (this.applyList.length > 0) {
    //   this.tableData = this.applyList
    // }
    // if (JSON.stringify(this.applyCondition) !== '{}') {
    //   if (JSON.stringify(this.applyCondition.page) !== '{}') {
    //     this.pageNum = this.applyCondition.page.pageNum
    //     this.pageSize = this.applyCondition.page.pageSize
    //     this.totalCount = this.applyCondition.page.totalCount
    //   }
    //   if (JSON.stringify(this.applyCondition.condition) !== '{}') {
    //     this.form.conType = this.applyCondition.condition.conType
    //     this.form.level = this.applyCondition.condition.leavel
    //     // countryCode: this.sendCountry,
    //     this.form.applyType = this.applyCondition.condition.applyType
    //     this.form.projectName = this.applyCondition.condition.projectName
    //     this.form.status = this.applyCondition.condition.status
    //     this.form.conStatus = this.applyCondition.condition.conStatus
    //     this.form.coopColName = this.applyCondition.condition.colName
    //     this.form.coopOrgName = this.applyCondition.condition.orgName
    //     this.form.applyPerson = this.applyCondition.condition.applyUserName
    //     this.form.applyDate = this.applyCondition.condition.applyDate
    //     this.form.startTime = this.applyCondition.condition.startTime
    //     this.form.endTime = this.applyCondition.condition.endTime
    //     this.form.originalStartTime = this.applyCondition.condition.originalStartTime
    //   }
    // }
    setTimeout(() => {
      this._initEnmu()
    }, 17)
  },
  methods: {
    _initEnmu() {
      getApplyDict().then(res => {
        if (res.status === ERR_OK) {
          this.colTypeList = res.data.conTypes
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
    searchApply(nums) {
      // console.log(nums)
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
      getApplyList({
        pageNum: nums === '0' ? 1 : this.pageNum,
        pageSize: this.pageSize,
        conType: this.form.conType === '' ? null : this.form.conType,
        leavel: this.form.level === '' ? null : this.form.level,
        countryCode: this.sendCountry,
        applyType: this.form.applyType === '' ? null : this.form.applyType,
        projectName: this.form.projectName,
        status: this.form.status,
        conStatus: this.form.conStatus,
        coopColId: colID,
        colName: this.form.coopColName,
        coopOrgId: orgID,
        orgName: this.form.coopOrgName,
        applyUserName: this.form.applyPerson,
        applyDate1: getTime(this.form.applyDate === null ? null : this.form.applyDate[0]),
        applyDate2: getTime(this.form.applyDate === null ? null : this.form.applyDate[1]),
        startTime1: getTime(this.form.startTime === null ? null : this.form.startTime[0]),
        startTime2: getTime(this.form.startTime === null ? null : this.form.startTime[1]),
        endTime1: getTime(this.form.endTime === null ? null : this.form.endTime[0]),
        endTime2: getTime(this.form.endTime === null ? null : this.form.endTime[1]),
        originalStartTime1: getTime(this.form.originalStartTime === null ? null : this.form.originalStartTime[0]),
        originalStartTime2: getTime(this.form.originalStartTime === null ? null : this.form.originalStartTime[1])
      }).then(res => {
        if (res.status === ERR_OK) {
          this.pageNum = res.data.page
          this.tableData = res.data.list
          sessionStorage.setItem('currUserID', res.details)
          this.pageSize = res.data.pageSize
          this.totalCount = res.data.totalCount
          this.setApplyList(res.data.list)
          this.setApplyCondition({
            page: {
              pageNum: res.data.page,
              pageSize: res.data.pageSize,
              totalCount: res.data.totalCount
            },
            condition: {
              conType: this.form.conType,
              leavel: this.form.level,
              countryCode: this.sendCountry,
              applyType: this.form.applyType,
              projectName: this.form.projectName,
              status: this.form.status,
              conStatus: this.form.conStatus,
              colName: this.form.coopColName,
              orgName: this.form.coopOrgName,
              applyUserName: this.form.applyPerson,
              applyDate: this.form.applyDate,
              startTime: this.form.startTime,
              endTime: this.form.endTime,
              originalStartTime: this.form.originalStartTime
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 报审时间
    formatterDate1(row) {
      return this._forMatterTime(row.applyDate, '{y}-{m}-{d}')
    },
    // 合同到期时间
    formatterDate2(row) {
      return this._forMatterTime(row.endTime, '{y}-{m}-{d}')
    },
    // 中文名
    formatterCn(row) {
      if (row.applyType.code !== global_.DIRECTCOL) {
        return row.orgNameCn
      } else {
        return row.colNameCn
      }
    },
    // 英文名
    formatterEn(row) {
      if (row.applyType.code !== global_.DIRECTCOL) {
        return row.orgNameEn
      } else {
        return row.colNameEn
      }
    },
    changeDisable() {
      if (this.form.applyType === global_.SPECIAL || this.form.applyType === global_.DIRECTCOL) {
        this.disabledN = false
        this.disabledO = true
      } else if (this.form.applyType === global_.ORGCOL) {
        this.disabledN = false
        this.disabledO = false
      } else if (this.form.applyType === global_.ORGDERIVATIVE) {
        this.disabledN = true
        this.disabledO = false
      }
    },
    changeClear() {
      this.disabledN = false
      this.disabledO = false
      this.form.coopColName = null
      this.form.coopOrgName = null
    },
    _applyType(type) {
      if (type === global_.ORGCOL || type === global_.ORGDERIVATIVE) {
        return 'org'
      } else {
        return 'school'
      }
    },
    goCheck(row) {
      if (row.applyType.code === global_.ORGDERIVATIVE) {
        this.isDer = true
      } else {
        this.isDer = false
      }
      console.log(row.id)
      //window.location.href = "applydetail.html?id=" + row.id + "&type=" + this._applyType(row.applyType.code) + "&derive=" + this.isDer
      window.open("applydetail.html?id=" + row.id + "&type=" + this._applyType(row.applyType.code) + "&derive=" + this.isDer)
//        this.$router.push({
//          name: 'CoopApplyDetail',
//          query: {
//            id: row.id,
//            type: this._applyType(row.applyType.code),
//            derive: this.isDer
//          }
//        })
    },
    // 是否显示编辑
    isEdit(row) {
      let ID = sessionStorage.getItem('currUserID')
      let active = row.conStatus ? row.conStatus.code !== 'INVALID' : true
      if ((row.status.code === 'DRAFT' || row.status.code === 'REJECT' || row.status.code === 'REVOKE') && !row.approveConType && active && row.isActive) {
        if (ID === row.applyUserId) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    // 是否显示删除
    isDel(row) {
      let ID = sessionStorage.getItem('currUserID')
      if (row.status.code === 'DRAFT') {
        if (ID === row.applyUserId) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    // 删除按钮
    goDel(row) {
      this.$confirm('您确定要删除该草稿状态的合作项目申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delApply({
          applyId: row.id
        }).then(r => {
          if (r.status === ERR_OK) {
            this.searchApply(this.pageNum)
            // this.$message.success('删除成功')
            this.$alert('删除成功！', '温馨提示', {
              confirmButtonText: '知道了',
              type: 'success'
            })
          } else {
            // this.$message.error('删除失败！' + r.msg)
            this.$alert('删除失败！' + r.msg, '错误提示', {
              confirmButtonText: '知道了',
              type: 'error'
            })
          }
        })
      })
    },
    // 编辑按钮
    goEdit(row) {
      if (row.applyType.code === global_.DIRECTCOL) {
        // window.location.href = 'applyeditdirect.html?id=' + row.id
        window.open('applyeditdirect.html?id=' + row.id)
//          this.$router.push({
//            name: 'EditDirectSchool',
//            query: {
//              id: row.id
//            }
//          })
      }
      if (row.applyType.code === global_.ORGCOL) {
//            window.location.href = 'applyeditorg.html?id=' + row.id
        window.open('applyeditorg.html?id=' + row.id)
//          this.$router.push({
//            name: 'EditParentOrg',
//            query: {
//              id: row.id
//            }
//          })
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.searchApply()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.searchApply(val)
    },
    ...mapMutations({
      setApplyList: 'SET_APPLYLIST',
      setApplyCondition: 'SET_APPLYCONDITION'
    })
  },
  computed: {
    currentPage() {
      return this.pageNum
    },
    isConStatu() {
      if (this.form.status === 'PASS_APPROVAL') {
        return true
      } else {
        this.form.conStatus = null
        return false
      }
    },
    ...mapGetters([
      'applyList',
      'applyCondition'
    ])
  },
  components: {
    SubHeader,
    BlockHeader,
    BlockBorder,
    Country
  }
}
</script>
