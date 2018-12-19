<template>
  <div class="lx_container">
    <div class="lx_main">
      <sub-header title="合作机构维护" icon="yuanxiaohezuoxiangmu">
        <div class='lx_subhd_box' slot='right' v-if="btnData.LXORGADD">
          <el-button type="primary" plain @click="goAdd">+ 新增合作机构</el-button>
        </div>
      </sub-header>
      <block-border>
        <block-header slot="title" title="查询条件"></block-header>
        <div slot="container">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row>
              <el-col :span="7">
                <el-form-item label="国家">
                  <!--<country :data="countryData" title="请选择国家" overClass="lx_bottom_0" :more="false" :showTxt="false" :inputVal="inputVal"-->
                  <!--@country="getSelCountry"></country>-->
                  <country :data="countryData" class="lx_bottom_0" title="请选择国家" :more="false" :showTxt="false"
                           :inputVal="inputVal" :parentVal="countrylist"
                           @country="getSelCountry"></country>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label='合作机构'>
                  <el-input v-model="form.orgName" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label=''></el-form-item>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" plain class="width100" @click="searchOrg()">查询</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </block-border>
      <block-border>
        <block-header slot="title" title="查询结果"></block-header>
        <div slot="container">
          <el-table
            :data="tableData"
            class="width100" v-loading.body="listLoading" element-loading-text="Loading..."
            header-row-class-name="lx_table_hd">
            <el-table-column
              prop="nameEn"
              label="合作机构外文名">
              <template slot-scope="scope">
                <span :title="scope.row.nameEn">{{scope.row.nameEn}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="nameCn"
              label="合作机构中文名"
            >
            </el-table-column>
            <el-table-column
              prop="countryName"
              label="国家">
            </el-table-column>
            <el-table-column
              prop="headUserName"
              label="跨国家线人员">
            </el-table-column>
            <el-table-column label="操作" width="250px">
              <template slot-scope="scope">
                <el-button size="mini" plain v-if="btnData.LXORGEDIT" @click="handleEdit(scope.$index,scope.row)">编辑
                </el-button>
                <el-button size="mini" plain @click="handleOpt(scope.$index,scope.row)">操作历史</el-button>
                <el-button size="mini" plain @click="handleDel(scope.$index,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="lx_page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 15, 20, 30]"
              :page-size="20"
              prev-text="上一页"
              next-text="下一页"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount">
            </el-pagination>
          </div>
        </div>
      </block-border>
      <!--操作历史-->
      <el-dialog
        width="780px"
        :visible.sync="dialogHis">
        <!--center class="lx_dialog">-->
<!--        <div class="lx_dialog_title" slot="title">
          <h2>操作历史</h2>
        </div>
        
          <el-table :data="hisData" header-row-class-name="lx_table_hd" fit>
            <el-table-column label="操作人" prop="createrName" width="100px"></el-table-column>
            <el-table-column label="操作时间" prop="created" width="150px" :formatter="formatDate1"></el-table-column>
            <el-table-column label="操作内容" prop="optContent"></el-table-column>
          </el-table>
        </div>-->
        <!--center class="lx_dialog">-->
        <div class="lx_dialog_title" slot="title">
          <h2>操作历史</h2>
        </div>

          <logs logType='ORG_HIS' :bizId="orgId" :isTitle=false ref="logRecord"></logs>

        <!--        <span slot="footer" class="lx_dialpg_footer">
                  <el-button @click="dialogHis = false" round size="mini">取 消</el-button>
                  <el-button type="primary" @click="dialogHis = false" round size="mini">确 定</el-button>
                </span>-->
      </el-dialog>
      <!--操作历史-->
    </div>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
</style>
<script type="text/ecmascript-6">
import SubHeader from '@/components/SubHeader'
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'
import Country from '@/components/Country'
import {CountryMixin, DateTime, GetChildBtnMixin} from '@/utils/mixin'
import {ERR_OK} from '@/utils/status.js'
import {getOrgList, getOrgUpdLog, delOrg} from '@/api/org'
import {GetRequest} from '@/utils/index.js'
import Logs from '@/views/components/logs/logs'
export default {
  mixins: [CountryMixin, DateTime, GetChildBtnMixin],
  data() {
    return {
      listLoading: false,
      tableData: [],
      pageNum: 1,
      pageSize: 20,
      totalCount: 0,
      dialogHis: false,
      form: {
        orgName: null
      },
      hisData: [],
      orgId: ''
    }
  },
  mounted() {
    this.getAuthort('LXORGEDIT,LXORGADD')
  },
  methods: {
    goAdd() {
      // this.$router.push({
      //   name: 'OrgAdd'
      // })
      //  window.location.href = 'orgadd.html'
      window.open('orgadd.html')
    },

    handleOpt(index, row) {
      this.orgId = row.id
//      getOrgUpdLog({
//        bizId: row.id,
//        optType: 'ORG_HIS'
//      }).then(res => {
//        if (res.status === ERR_OK) {
//          this.hisData = res.data.list
//        }
//      })
      this.dialogHis = true
      setTimeout(() => {
        this.$refs.logRecord.getLogs()
      }, 0)
    },
    handleDel(index, row) {
      this.$confirm('您确定要删除该机构吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delOrg({
          id: row.id
        }).then(res => {
          if (res.status === ERR_OK) {
            this.searchOrg(this.pageNum)
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
    handleEdit(index, row) {
      // this.$router.push({
      //   name: 'OrgEdit',
      //   query: {
      //     id: row.id
      //   },
      //   params: {
      //     type: 'edit'
      //   }
      // })
      //  window.location.href = 'orgedit.html?id='+row.id+'&type=edit'
      window.open('orgedit.html?id=' + row.id + '&type=edit')
    },
    // 机构查询
    searchOrg(val) {
      getOrgList({
        countryCode: this.sendCountry,
        nameCn: this.form.orgName,
        nameEn: this.form.orgName,
        pageSize: this.pageSize,
        pageNum: val === undefined ? 1 : this.pageNum
      }).then(res => {
        if (res.status === ERR_OK) {
          this.tableData = res.data.list
          this.pageSize = res.data.pageSize
          this.totalCount = res.data.totalCount
          this.pageNum = res.data.page
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.searchOrg(val)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.searchOrg(val)
    },
    // 日期格式化
    formatDate1(row) {
      return this._forMatterTime(row.created, '{y}-{m}-{d}')
    }
  },

  computed: {
    // sendCountry() {
    //   let l = []
    //   this.countrylist.map((item) => {
    //     l.push(
    //       item.code
    //     )
    //   })
    //   return l
    // },
    currentPage() {
      this.pageNum + 1
    }
  },
  components: {
    SubHeader,
    BlockBorder,
    BlockHeader,
    Country,
    Logs
  }
}
</script>
