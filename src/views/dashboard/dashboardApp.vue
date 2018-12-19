<template>
  <div class="lx_container">
    <!--<div class="app-wrapper">-->
    <!--<div class="main-container">-->
    <div class="lx_upcoming">
      <block-border>
        <block-header slot="title" class="lx_upcom_hd">
          <div class="ls_upcoming_title" slot="overwrite-title">
            审批事项（共<span style="color:#f56c6c; margin: 0 5px;">{{pageTotal}}</span>条待审批）
          </div>
          <div slot="right" class="lx_btn_more">
            <el-button type="primary" plain size="small" @click="goMore">
              我的历史审批
            </el-button>
          </div>
        </block-header>
        <div slot="container">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row :gutter="10">
              <el-col :span="5">
                <el-form-item label="审批事项">
                  <el-input v-model="form.projName" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="申请人">
                  <el-input v-model="form.applyUser" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="审批人">
                  <el-select v-model="form.approveUser" clearable placeholder="请输入">
                    <el-option v-for="item in approveUserList" :value="item.srcUserId"
                               :label="item.srcUserName"
                               :key="item.srcUserId">{{item.srcUserName}}
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="审批类型">
                  <el-select v-model="form.apprveType" clearable placeholder="请输入">
                    <el-option v-for="item in approveTypeList" :value="item.approveType"
                               :label="item.approveTypeName"
                               :key="item.approveType">
                      {{item.approveTypeName}}
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" plain @click="search('0')">查询</el-button>
              </el-col>
            </el-row>
          </el-form>
          <el-table
            :data="tableData"
            class="width100" v-loading.body="listLoading" element-loading-text="Loading..."
            header-row-class-name="lx_table_hd">
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="approveName"
              label="审批事项">
              <!--<template slot-scope="scope">-->
              <!--<el-button type="text" class="lx_apply_txt_btn" @click="goFrame(scope.$index, scope.row)">-->
              <!--{{scope.row.approveName}}-->
              <!--</el-button>-->
              <!--</template>-->
            </el-table-column>
            <el-table-column
              prop="approveTypeName"
              label="审批类型">
            </el-table-column>
            <el-table-column
              prop="applyUserName"
              width="120px"
              label="申请人">
            </el-table-column>
            <el-table-column
              prop="fullDeptName"
              label="部门">
            </el-table-column>
            <el-table-column
              width="100px"
              prop="applyDate"
              :formatter="formatterDate2"
              label="申请时间">
            </el-table-column>
            <el-table-column
              width="100px"
              label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="goFrame(scope.$index, scope.row)">审批
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="lx_page" v-if="pageSize<pageTotal">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 15, 20, 30]"
              :page-size="10"
              prev-text="上一页"
              next-text="下一页"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageTotal">
            </el-pagination>
          </div>
        </div>
      </block-border>
    </div>
    <!--</div>-->
    <!--</div>-->


  </div>
</template>

<script>
import global_ from '@/Global'
import {getUpcoming} from '@/api/coopContract'
import {getApproveEnmu, getWorkFlowURI} from '@/api/dict'
import {ERR_OK} from '@/utils/status'
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'
import {DateTime} from '@/utils/mixin'

export default {
  name: 'App',
  mixins: [DateTime],
  data() {
    return {
      form: {
        projName: null,
        applyUser: null,
        approveUser: null,
        apprveType: null
      },
      list: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: [],
      listLoading: false,
      approveUserList: [],
      approveTypeList: [],
      approveUrl: ''
    }
  },
  mounted() {
    setTimeout(() => {
      this.search()
      this._initEnmu()
      this._initApplpveUrl()
    }, 17)
  },
  methods: {
    _initApplpveUrl() {
      getWorkFlowURI().then((res) => {
        if (res.status === ERR_OK) {
          this.approveUrl = res.data
          sessionStorage.setItem('LXURI', res.data)
        }
      })
    },
    goMore() {
//                ${global_.APPROVE}/views/history/history.html?tenantId=203&v=${new Date().getTime()}
      if (this.approveUrl === null) {
        this._initApplpveUrl()
        setTimeout(() => {
          if (this.approveUrl === null) {
            this.$message.error("登录失效后，请刷新当前页面重试")
            return
          }
          window.location.href = this.approveUrl + '/views/history/history.html?tenantId=203&v=' + new Date().getTime()
        })
      } else {
        window.location.href = this.approveUrl + '/views/history/history.html?tenantId=203&v=' + new Date().getTime()
      }
//                this.$router.push({
//                    name: 'MoreFrame'
//                })
    },
    _initEnmu() {
      getApproveEnmu().then(res => {
        if (res.status === ERR_OK) {
          // console.log(res)
          this.approveUserList = res.data.approverList
          this.approveTypeList = res.data.approveTypeVOList
        }
      })
    },
    search(nums) {
      getUpcoming({
        pageNum: nums === 0 ? 1 : this.pageNum,
        pageSize: this.pageSize,
        approveName: this.form.projName, // 项目名称
        applyUserName: this.form.applyUser, // 申请人
        approveUserId: this.form.approveUser, // 审批人
        approveType: this.form.apprveType // 申请类型
      }).then(res => {
        if (res.status === ERR_OK) {
          this.tableData = res.data.list
          this.pageTotal = res.data.totalCount
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    goFrame(index, item) {
      if (this.approveUrl === null) {
        this._initApplpveUrl()
        setTimeout(() => {
          if (this.approveUrl === null) {
            this.$message.error("没有获取到工作流地址，请刷新当前页面重试")
            return
          }
          window.location.href = this.approveUrl + '/commonApprove.html?businessKey=' + item.businessKey
            + '&taskId=' + item.taskId + '&processInstanceId=' + item.processInstanceId
        }, 1000)
      } else {
        window.location.href = this.approveUrl + '/commonApprove.html?businessKey=' + item.businessKey
          + '&taskId=' + item.taskId + '&processInstanceId=' + item.processInstanceId
      }
//                ${global_.APPROVE}/commonApprove.html?businessKey=${this.id}&taskId=${this.taskId}&processInstanceId=${this.processInstanceId}` + "&" + new Date().getTime()
//                this.$router.push({
//                    name: 'Frame',
//                    query: {
//                        id: item.businessKey,
//                        taskId: item.taskId,
//                        processInstanceId: item.processInstanceId
//                    }
//                })
    },
    formatterDate2(row) {
      return this._forMatterTime(row.applyDate, '{y}-{m}-{d}')
    },
    handleSizeChange(val) {
      this.pageNum = val
      this.search()
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.search(val)
      // console.log(`当前页: ${val}`)
    }
  },
  components: {
    BlockBorder,
    BlockHeader
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .lx_upcoming {
    margin-top: 30px;
    .ls_upcoming_title {
      height: 23px;
      line-height: 23px;
      background-color: #26c6da;
      color: #fff;
      font-size: 14px;
      font-family: "Microsoft YaHei";
      padding: 0 10px;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
  }

  .lx_upcom_hd {
    display: flex;
    justify-content: space-between;
  }

  .lx_btn_more {
    margin-right: 20px;
  }

  .lx_apply_txt_btn {
    color: #000;
    text-decoration: underline;
  }
</style>
