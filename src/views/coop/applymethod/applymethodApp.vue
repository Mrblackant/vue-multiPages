<template>
  <div class="lx_container">
    <div class='lx_main'>
      <sub-header icon='' title='新建合作申请'></sub-header>
      <block-border>
        <block-header slot="title" title="合作方式"></block-header>
        <div slot="container">
          <el-radio-group v-model="mthChk" @change="changeWay">
            <el-radio-button label="院校直接合作"></el-radio-button>
            <el-radio-button label="合作机构院校合作"></el-radio-button>
            <el-radio-button label="衍生服务合作"></el-radio-button>
          </el-radio-group>
        </div>
      </block-border>
      <!--直接合作开始-->
      <block-border v-show="!isApplyType">
        <block-header slot="title" title="合作院校"></block-header>
        <div slot="container">
          <el-form ref='form' :model='form' label-width='120px'>
            <el-row>
              <el-col :span='6'>
                <el-form-item label='国家/地区'>
                  <country :data="countryData" title="请选择国家" overClass="lx_bottom_0" :more="false" :showTxt="false"
                           key="one"
                           ref="colC"
                           :inputVal="inputVal"
                           @country="getSelCountry"></country>
                </el-form-item>
              </el-col>
              <el-col :span='6'>
                <el-form-item label='院校名称'>
                  <el-input v-model="form.schoolName" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='4'>
                <el-form-item label-width="30px">
                  <el-button type='primary' plain class='width100' @click="searchSchoolList('0')">查询</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="lx_right_btn" v-if="goNewFlag">
            <el-button size="small" type="primary" plain @click="goAddProject">新签项目</el-button>
          </div>
          <el-table fit highlight-current-row
                    :data="tableData"
                    ref="schoolTable"
                    @current-change="handleCurrentRow"
                    class="width100 " header-row-class-name="lx_table_hd">
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
          <div v-if="isPage1" class="lx_page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[10, 15, 20, 30]"
              :page-size="pageSize"
              prev-text="上一页"
              next-text="下一页"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageTotal">
            </el-pagination>
          </div>
        </div>
      </block-border>
      <!--直接合作结束-->
      <!--合作机构开始-->
      <block-border v-show="isApplyType">
        <block-header slot="title" title="合作机构"></block-header>
        <el-form ref='form' slot="container" :model='form' label-width='120px'>
          <el-row>
            <el-col :span='6'>
              <el-form-item label='机构办理国家'>
                <country :data="countryData" title="请选择国家" overClass="lx_bottom_0" :more="false" :showTxt="false"
                         :inputVal="inputVal" key="two" ref="orgC"
                         @country="getSelCountry"></country>
              </el-form-item>
            </el-col>
            <el-col :span='6'>
              <el-form-item label='机构名称'>
                <el-input v-model="form.orgName" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='4'>
              <el-form-item label-width="30px">
                <el-button type='primary' plain class='width100' @click="searchOrg">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="lx_right_btn" slot="container">
          <el-button size="small" type="primary" v-show="newOrgBtn" plain @click="goNewOrg()">新签项目</el-button>
          <el-button size="small" type="primary" v-show="newDeriveBtn" plain @click="goNewDerive()">新签项目</el-button>
        </div>
        <el-table slot="container"
                  :data="orgData"
                  fit
                  ref="orgTable"
                  highlight-current-row
                  @current-change="handleCurrentRowOrg"
                  class="width100 " header-row-class-name="lx_table_hd">
          <el-table-column
            prop="nameEn"
            label="合作机构外文名">
          </el-table-column>
          <el-table-column
            prop="nameCn"
            label="合作机构中文名称">
          </el-table-column>
          <el-table-column
            prop="countryName"
            label="机构办理国家">
          </el-table-column>
        </el-table>
      </block-border>
      <!--合作机构结束-->
      <history-info :data="tableAnswer" :curID="userID" :isDer="isDer" v-show="isHistoryInfoFlag"
                    :coopBtn="btnData.LXCOOPAPPLY">
        <el-form ref='form' slot="form" :model='form' label-width='120px'>
          <el-row>
            <el-col :span='7'>
              <el-form-item label='合作项目名称'>
                <el-input v-model="form.projname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='7'>
              <el-form-item label='申请状态'>
                <el-select v-model='form.applyStatus' clearable placeholder='请选择' class='width100'>
                  <el-option v-for="item in applyStatuList" :label='item.name' :value='item.code'
                             :key="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='6'>
              <el-form-item label='合同状态'>
                <el-select v-model='form.commStatus' clearable placeholder='请选择' class='width100'>
                  <el-option v-for="item in commStatus" :label='item.name' :value='item.code'
                             :key="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='4'>
              <el-form-item label-width="30px">
                <el-button type='primary' v-if="!isOrg" class='width100' @click="_search(ID,'type2','0')">查询</el-button>
                <el-button type='primary' v-if="isOrg" class='width100' @click="_search(orgID,'type4','0')">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="lx_page" slot="pages" v-show="hisPageTotal>hisPageSize">
          <el-pagination
            @size-change="hisHandleSizeChange"
            @current-change="hisHandleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[10, 15, 20, 30]"
            :page-size="hisPageSize"
            prev-text="上一页"
            next-text="下一页"
            layout="total, sizes, prev, pager, next, jumper"
            :total="hisPageTotal">
          </el-pagination>
        </div>
      </history-info>
    </div>
  </div>
</template>
<style lang='scss' rel='stylesheet/scss'>
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
</style>
<script type='text/ecmascript-6'>
import SubHeader from '@/components/SubHeader'
import BlockHeader from '@/components/BlockHeader'
import BlockBorder from '@/components/BlockBorder'
import Country from '@/components/Country'
import HistoryInfo from './historyInfo'
import {CountryMixin, GetChildBtnMixin} from '@/utils/mixin'
import {searchSchool, getOrgList, getApplyList} from '@/api/coopManage'
import {ERR_OK} from '@/utils/status'
import {getApplyDict} from '@/api/dict'
import {mapGetters, mapMutations} from 'vuex'
import global_ from '@/Global'

export default {
  mixins: [CountryMixin, GetChildBtnMixin],
  data() {
    return {
      mthChk: '院校直接合作',
      isHistoryInfoFlag: false, // 是否显示历史申报信息
      isApplyType: false, // 显示合作方式
      goNewFlag: false, // 新签直接合作
      newOrgBtn: false, // 机构合作
      newDeriveBtn: false, // 衍生服务
      ID: null, // 院校ID
      orgID: null, // 机构ID
      form: {
        schoolName: null, // 院校名称
        orgName: null, // 机构名称
        projname: null, // 项目名称
        applyStatus: null, // 申请状态
        commStatus: null // 合同状态
      },
      tableData: [], // 查询院校列表
      orgData: [], // 查询机构列表
      tableAnswer: [], // 选择院校合作项目
      // currentPage4: 1, // 当前页数
      applyStatuList: [], // 申请状态枚举
      commStatus: [], // 合同状态枚举
      conTypeList: [], // 合同类型枚举
      applyTypeList: [], // 合作方式枚举
      pageTotal: 0,
      pageNum: 1,
      pageSize: 10,
      hisPageTotal: 0,
      hisPageNum: 1,
      hisPageSize: 10,
      userID: ''// 用户ID
    }
  },
  mounted() {
    // if (this.addApplyList.length > 0) {
    //   this.tableData = this.addApplyList
    // }
    // if (this.historyList.length > 0) {
    //   this.tableAnswer.length = 0
    //   this.historyList.map(item => {
    //     this.tableAnswer.push(item)
    //   })
    // }
    setTimeout(() => {
      this.getAuthort('LXCOOPAPPLY')
      this._initEnmu()
    }, 17)
  },
  methods: {
    // 获取枚举数据
    _initEnmu() {
      getApplyDict().then(res => {
        if (res.status === ERR_OK) {
          this.applyStatuList = res.data.applyStatus
          this.commStatus = res.data.conStatus
          this.conTypeList = res.data.conTypes
          this.applyTypeList = res.data.applyTypes
        }
      })
    },
    searchSchoolList(num) {
      if (!this.form.schoolName) {
        this.$message.error('院校名称不能为空哦！')
        return
      } else {
        searchSchool({
          pageNum: num === '0' ? 1 : this.pageNum,
          pageSize: this.pageSize,
          countryCodes: this.sendCountry,
          name: this.form.schoolName
        }).then(res => {
          if (res.status === ERR_OK) {
            this.tableData = res.data.list
            this.pageTotal = res.data.totalCount
            this.pageNum = res.data.page
            this.pageSize = res.data.pageSize
            this.setAddApplyList(res.data.list)
          }
        })
      }
    },
    // 机构查询
    searchOrg() {
      if (!this.form.orgName) {
        this.$message.error('机构名称不能为空哦')
        return
      } else {
        getOrgList({
          countryCode: this.sendCountry,
          nameCn: this.form.orgName,
          nameEn: this.form.orgName
        }).then(res => {
          if (res.status === ERR_OK) {
            this.orgData = res.data.list
            this.setAddApplyList(res.data.list)
          }
        })
      }
    },
    // 直接合作
    goAddProject() {
      //window.location.href = "partnerdirect.html?id=" + this.ID
      window.open("partnerdirect.html?id=" + this.ID)
//        this.$router.push({
//          name: 'DirectPartnerSchool',
//          query: {
//            id: this.ID
//          }
//        })
    },
    // 机构合作
    goNewOrg() {
      // window.location.href = "partnerorg.html?id=" + this.orgID
      window.open("partnerorg.html?id=" + this.orgID)
//        this.$router.push({
//          name: 'ParentOrgSchool',
//          query: {
//            id: this.orgID
//          }
//        })
    },
    // 衍生服务
    goNewDerive() {
//          window.location.href = "partnerderive.html?id=" + this.orgID
      window.open("partnerderive.html?id=" + this.orgID)
//        this.$router.push({
//          name: 'ParentOrgDerive',
//          query: {
//            id: this.orgID
//          }
//        })
    },
    // 切换合作方式
    changeWay(label) {
      this.isHistoryInfoFlag = false
      if (label !== '院校直接合作') {
        this.isApplyType = true
      } else {
        this.isApplyType = false
      }
      this.countrylist = []
      this.$refs.colC.clearRadio()
      this.$refs.orgC.clearRadio()
    },
    // 选择院校
    handleCurrentRow(val) {
      if (val) {
        this.ID = val.id
        this.goNewFlag = true
        this._search(val.id, 'type1')
      }
    },
    _initparams(id, type, num) {
      let resParams = {
        pageSize: this.hisPageSize,
        pageNum: num === '0' ? 1 : this.hisPageNum
      }
      if (type === 'type1') {
        let params = {
          coopColId: id
        }
        Object.assign(resParams, params)
      } else if (type === 'type2') {
        let params = {
          coopColId: id,
          projectName: this.form.projname,
          status: this.form.applyStatus,
          conStatus: this.form.commStatus
        }
        Object.assign(resParams, params)
      } else if (type === 'type3') {
        let params = {
          coopOrgId: id
        }
        Object.assign(resParams, params)
      } else if (type === 'type4') {
        let params = {
          coopOrgId: id,
          projectName: this.form.projname,
          status: this.form.applyStatus,
          conStatus: this.form.commStatus
        }
        Object.assign(resParams, params)
      }
      return resParams
    },
    _search(id, type, num) {
      getApplyList(
        this._initparams(id, type, num)
      ).then(res => {
        if (res.status === ERR_OK) {
          this.hisPageNum = res.data.page
          this.hisPageSize = res.data.pageSize
          this.hisPageTotal = res.data.totalCount
          if (res.data.list) {
            res.data.list.forEach((item) => {
              if (global_.DIRECTCOL === item.applyType.code) {
                item.coopOrgNameCn = item.colNameCn
                item.coopOrgNameEn = item.colNameEn
              } else {
                item.coopOrgNameCn = item.orgNameCn
                item.coopOrgNameEn = item.orgNameEn
              }
            })
          }
          this.tableAnswer = res.data.list
          this.setHistoryList(res.data.list)
          this.isHistoryInfoFlag = true
          this.userID = res.details
        }
      })
    },
    // 选择机构
    handleCurrentRowOrg(val) {
      if (val) {
        this.orgID = val.id
        this._search(val.id, 'type3')
      }
      if (this.mthChk === '合作机构院校合作') {
        this.newOrgBtn = true
        this.newDeriveBtn = false
      } else if (this.mthChk === '衍生服务合作') {
        this.newOrgBtn = false
        this.newDeriveBtn = true
      }
    },
    handleSelect(item) {
      console.log(item)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.searchSchoolList()
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.searchSchoolList(val)
      // console.log(`当前页: ${val}`)
    },
    hisHandleSizeChange(val) {
      this.pageSize = val
      if (this.mthChk === '合作机构院校合作') {
        this.newOrgBtn = true
        this.newDeriveBtn = false
        this._search(this.orgID, 'type1')
      } else {
        this.newOrgBtn = false
        this.newDeriveBtn = true
        this._search(this.ID, 'type3')
      }
      // this._search()
      // console.log(`每页 ${val} 条`)
    },
    hisHandleCurrentChange(val) {
      this.hisPageNum = val
      if (this.mthChk === '合作机构院校合作') {
        this._search(this.orgID, 'type3')
      } else {
        this._search(this.ID, 'type1')
      }
      // this._search(val)
      // console.log(`当前页: ${val}`)
    },
    ...mapMutations({
      setAddApplyList: 'SET_ADDAPPLYLIST',
      setHistoryList: 'SET_HISTORYLIST',
      setAddApplyCondition: 'SET_ADDAPPLYCODITION'
    })
  },
  computed: {
    isOrg() {
      if (this.mthChk === '院校直接合作') {
        return false
      } else {
        return true
      }
    },
    isDer() {
      if (this.mthChk === '衍生服务合作') {
        return true
      } else {
        return false
      }
    },
    isPage1() {
      if (this.pageSize < this.pageTotal) {
        return true
      }
    },
    currentPage4() {
      return this.hisPageNum
    },
    ...mapGetters([
      'addApplyList',
      'historyList',
      'addApplyCondition'
    ])
  },
  components: {
    SubHeader,
    BlockHeader,
    BlockBorder,
    Country,
    HistoryInfo
  }
}
</script>
