<template>
  <div class="lx_container">
    <div class='lx_main'>
      <sub-header icon='liuxuyuanxiaoweihu' title='留学院校维护'>
        <div class='lx_subhd_box' slot='right' v-if="btnData.LXCOLADD">
          <el-button type="primary" plain @click="goAdd">+ 新增院校</el-button>
        </div>
      </sub-header>
      <div class="lx_form_main">
        <block-border>
          <block-header slot="title" title="查询条件"></block-header>
          <el-form slot="container" ref='form' label-width='120px' class=''>
            <el-row>
              <el-col :span="24">
                <el-form-item label="国家">
                  <country :data="countryData" title="请选择国家" overClass="lx_bottom_0" :more="true"
                           :showTxt="false"
                           :inputVal="inputVal"
                           :parentVal="countrylist"
                           @country="getSelCountry"></country>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='8'>
                <el-form-item label='院校名称'>
                  <el-autocomplete
                    popper-class="lx_autocomplete"
                    class='inline-input width100'
                    v-model='name'
                    :fetch-suggestions='querySearch'
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
              <el-col :span='8'>
                <el-form-item label='院校类型'>
                  <el-select v-model='selSchoolType' clearable placeholder='请选择院校类型' class='width100'>
                    <el-option v-for="item in formSchoolType" :label='item.name' :key="item.code"
                               :value='item.code'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span='8'>
                <el-form-item label='院校可选'>
                  <el-select v-model='selSelectType' clearable placeholder='请选择' class='width100'>
                    <el-option v-for="item in formSelectType" :label='item.name' :value='item.code'
                               :key="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row type="flex" justify="center" slot="container">
            <el-button type="primary" plain class="lx_larger_btn" @click="search()">
              查询
            </el-button>
          </el-row>
        </block-border>
        <block-border>
          <block-header slot="title" title="查询结果"></block-header>
          <div slot="container">
            <el-table
              :data="tableData"
              class="width100" v-loading.body="listLoading" element-loading-text="Loading..."
              header-row-class-name="lx_table_hd">
              <el-table-column
                prop="countryName"
                width="120px"
                label="国家">
              </el-table-column>
              <el-table-column
                prop="nameEn"
                label="院校外文名">
                <template slot-scope="scope">
                  <span :title="scope.row.nameEn">{{scope.row.nameEn}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="nameCn"
                label="院校中文名">
              </el-table-column>
              <el-table-column
                width="160px"
                prop="type"
                label="院校类型">
              </el-table-column>
              <el-table-column
                width="100px"
                prop="selectType.name"
                label="院校可选">
              </el-table-column>
              <el-table-column label="操作" width="250px">
                <template slot-scope="scope">
                  <el-button size="mini" v-if="btnData.LXCOL"
                             @click="handleEdit(scope.$index, scope.row)">编辑
                  </el-button>
                  <el-button size="mini"
                             @click="handleSee(scope.$index, scope.row)">查看
                  </el-button>
                  <el-button size="mini"
                             @click="handleDel(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="lx_page" v-show="totalCount>10">
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
  </div>
</template>
<style lang='scss' rel='stylesheet/scss'>
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


</style>
<script type='text/ecmascript-6'>
import SubHeader from '@/components/SubHeader'
import BlockHeader from '@/components/BlockHeader'
import BlockBorder from '@/components/BlockBorder'
import Country from '@/components/Country'
import {CountryMixin, DateTime, SchoolNameAutoMixin, GetChildBtnMixin} from '@/utils/mixin'
import {getColType} from '@/api/dict.js'
import {ERR_OK} from '@/utils/status.js'
import {searchSchool, delSchool} from '@/api/schoolManage'
import {getSchoolDict} from '@/api/dict'
import {mapGetters, mapMutations} from 'vuex'
import global_ from '@/Global.vue'

export default {
  name: 'App',
  mixins: [CountryMixin, DateTime, SchoolNameAutoMixin, GetChildBtnMixin],
  data() {
    return {
      listLoading: false,
      restaurants: [],
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      name: null,
      formSchoolType: [], // 院校类型
      selSchoolType: null, // 选中院校类型
      formSelectType: [], // 院校可选
      selSelectType: null, // 选中院校可选
      // 权限按钮
      addBtn: false,
      editBtn: false
    }
  },
  mounted() {
    // if (this.manageColList.length > 0) {
    //   this.tableData = this.manageColList
    // }
    // if (JSON.stringify(this.colCondition) !== '{}') {
    //   if (JSON.stringify(this.colCondition.page) !== '{}') {
    //     this.pageNum = this.colCondition.page.pageNum
    //     this.pageSize = this.colCondition.page.pageSize
    //     this.totalCount = this.colCondition.page.totalCount
    //   }
    //   if (JSON.stringify(this.colCondition.condition) !== '{}') {
    //     this.name = this.colCondition.condition.name
    //     this.selSchoolType = this.colCondition.condition.colType
    //     this.selSelectType = this.colCondition.condition.selectType
    //     // this.countrylist = this.colCondition.condition.countryCodes
    //   }
    // }
    setTimeout(() => {
      this._initEnum()
      this._initColType()
      this.getAuthort('LXCOLADD,LXCOL')
    }, 17)
  },
  methods: {

    _initEnum() {
      getSchoolDict().then(res => {
        if (res.status === ERR_OK) {
          this.formSchoolType = res.data.colTypes
          this.formSelectType = res.data.selectTypes
        }
      })
    },
    // 跳转到新增
    goAdd() {
      // this.$router.push({
      //     name: 'AddSchool'
      // })
      //window.location.href = 'schooladd.html'
      window.open('schooladd.html')
    },
    // 获取院校类型和院校性质
    _initColType() {
      getColType().then((res) => {
        if (res.status === ERR_OK) {
          this.formSchoolType = res.data.colTypeList
          this.formSelectType = res.data.checkedTypeList
        }
      })
    },
    search(pagenum) {
      // console.log(pagenum)
      this.listLoading = true
      let names = this.name
      let ID = this.selectSchoolID
      if (names === null || names === undefined || names === '') {
        ID = null // 清空院校ID
      }
      searchSchool({
        countryCodes: this.sendCountry,
        pageNum: pagenum === undefined ? 1 : this.pageNum,
        pageSize: this.pageSize,
        id: ID,
        name: this.name,
        colType: this.selSchoolType === '' ? null : this.selSchoolType,
        selectType: this.selSelectType === '' ? null : this.selSelectType,
        isAll: true
      }).then((res) => {
        if (res.status === ERR_OK) {
          this.listLoading = false
          this.tableData = res.data.list
          this.pageSize = res.data.pageSize
          this.totalCount = res.data.totalCount
          this.pageNum = res.data.page
          this.SetManageColList(res.data.list)
          this.SetColCondition({
            page: {
              pageNum: res.data.page,
              totalCount: res.data.totalCount,
              pageSize: res.data.pageSize
            },
            condition: {
              name: this.name,
              colType: this.selSchoolType,
              selectType: this.selSelectType
              // countryCodes: this.countrylist
            }
          })
        }
      })
    },
    handleEdit(index, row) {
      // console.log(index, row)
      // this.$router.push({
      //     name: 'SchoolEdit',
      //     query: {
      //         id: row.id
      //     }
      // })
      //window.location.href = 'schooledit.html?id=' + row.id
      window.open('schooledit.html?id=' + row.id)
      sessionStorage.setItem('lx_type', 'edit')
    },
    handleSee(index, row) {
      // this.$router.push({
      //     name: 'Detail',
      //     query: {
      //         id: row.id
      //     }
      // })
      /*                window.location.href = 'schooldetail.html?id=' + row.id*/

      window.open('schooldetail.html?id=' + row.id)
      sessionStorage.setItem('lx_type', 'see')
    },
    handleDel(index, row) {
      this.$confirm('您确定要删除该院校吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSchool({
          id: row.id
        }).then(res => {
          if (res.status === ERR_OK) {
            this.search(this.pageNum)
            // this.$message.success('删除成功')
            this.$alert('删除成功！', '温馨提示', {
              confirmButtonText: '知道了',
              type: 'success'
            })
          } else {
            // this.$message.error('删除失败！' + res.msg)
            this.$alert('删除失败！' + res.msg, '错误提示', {
              confirmButtonText: '知道了',
              type: 'error'
            })
          }
        })
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.search()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.search(val)
    },
    ...mapMutations({
      SetManageColList: 'SET_MANAGECOLLIST',
      SetColCondition: 'SET_COLCONDITION'
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
    ...mapGetters([
      'manageColList',
      'colCondition'
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
