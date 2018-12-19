<template>
  <div class="lx_container">
    <div class='lx_main'>
      <sub-header icon='liuxuyuanxiaoweihu' title='留学院校查询'>
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
              <el-col :span='7'>
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
              <el-col :span='7'>
                <el-form-item label='院校类型'>
                  <el-select v-model='selSchoolType' clearable placeholder='请选择院校类型' class='width100'>
                    <el-option v-for="item in formSchoolType" :label='item.name' :key="item.code"
                               :value='item.code'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!--<el-col :span='8'>-->
              <!--<el-form-item label='院校可选'>-->
              <!--<el-select v-model='selSelectType' clearable placeholder='请选择' class='width100'>-->
              <!--<el-option v-for="item in formSelectType" :label='item.name' :value='item.code'-->
              <!--:key="item.code"></el-option>-->
              <!--</el-select>-->
              <!--</el-form-item>-->
              <!--</el-col>-->
              <el-col :span="2">
                <el-form-item label=''></el-form-item>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" plain class="lx_larger_btn" @click="search()">
                  查询
                </el-button>
              </el-col>
            </el-row>
          </el-form>
          <!--        <el-row type="flex" justify="center" slot="container">
                    
                  </el-row>-->
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
                width="100px"
                prop="type"
                label="院校类型">
              </el-table-column>
              <el-table-column label="操作" width="160px">
                <template slot-scope="scope">
                  <el-button size="mini"
                             @click="handleSee(scope.$index, scope.row)">查看
                  </el-button>
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
import {CountryMixin, DateTime, SchoolNameAutoMixin} from '@/utils/mixin'
import {getColType} from '@/api/dict.js'
import {ERR_OK} from '@/utils/status.js'
import {searchSchool} from '@/api/schoolManage'
import {getSchoolDict} from '@/api/dict'

export default {
  mixins: [CountryMixin, DateTime, SchoolNameAutoMixin],
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
      selSchoolType: null // 选中院校类型
      // formSelectType: [], // 院校可选
      // selSelectType: null // 选中院校可选
    }
  },
  mounted() {
    setTimeout(() => {
      this._initEnum()
      this._initColType()
      this._initCountry()
    }, 17)
  },
  methods: {
    // 获取国家
//      _initCountry() {
//        getCountry({
//          isAuth: false
//        }).then((res) => {
//          if (res.status === ERR_OK) {
//            this.countryData = res.data
//          }
//        })
//      },
    _initEnum() {
      getSchoolDict().then(res => {
        if (res.status === ERR_OK) {
          this.formSchoolType = res.data.colTypes
          // this.formSelectType = res.data.selectTypes
        }
      })
    },
    // 跳转到新增
    goAdd() {
      //window.location.href = 'schooladd.html'
      window.open('schooladd.html')
      // console.log('aaa')
//        this.$router.push({
//          name: 'AddSchool'
//        })
    },
    // 获取院校类型和院校性质
    _initColType() {
      getColType().then((res) => {
        if (res.status === ERR_OK) {
          this.formSchoolType = res.data.colTypeList
          // this.formSelectType = res.data.checkedTypeList
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
        isActive: true
      }).then((res) => {
        if (res.status === ERR_OK) {
          this.listLoading = false
          this.tableData = res.data.list
          this.pageSize = res.data.pageSize
          this.totalCount = res.data.totalCount
          this.pageNum = res.data.page
        }
      })
    },
    handleSee(index, row) {
      // console.log(index, row)
//          window.location.href = 'schoolsearchdetail.html?id=' + row.id + '&type=see'
      window.open('schoolsearchdetail.html?id=' + row.id + '&type=see')
//        this.$router.push({
//          name: 'SearchColDetail',
//          query: {
//            id: row.id,
//            type : 'see'
//          },
//          params: {
//            type: 'see'
//          }
//        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.search()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.search(val)
      // console.log(`当前页: ${val}`)
    }
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
      this.pageNum + 1
    }
  },
  components: {
    SubHeader,
    BlockHeader,
    BlockBorder,
    Country
  }
}
</script>
