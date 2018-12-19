<template>
  <block-border :hasClass="isTitle">
    <block-header v-if="isTitle" slot="title" title="操作记录"></block-header>
    <div slot="container">
      <el-table :data="dataList" header-row-class-name="lx_table_hd" fit>
        <el-table-column type="index" label="序号" align="center"><template slot-scope="scope"><span>{{scope.$index+(pageNum - 1) * pageSize + 1}} </span></template></el-table-column>
        <el-table-column :width="isTitle ? '' : columnWidth" prop="created" :formatter="formatTime" label="操作时间" align="center"></el-table-column>
        <el-table-column :width="isTitle ? '' : columnWidth" prop="createrName" label="操作人" align="center"></el-table-column>
        <el-table-column v-if="hasType" prop="bizExtId" label="修改类型" align="center"></el-table-column>
        <el-table-column :width="isTitle ? '' : optColumnWidth" label="操作内容" header-align="center">
            <template slot-scope="scope">
              <div v-html="scope.row.optContent"></div>
            </template>
        </el-table-column>
      </el-table>
      <div class="lx_page" v-show="totalCount>pageSize">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20, 30]"
          :page-size="pageSize"
          prev-text="上一页"
          next-text="下一页"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </block-border>
</template>
<style lang="scss" rel="stylesheet/scss">

</style>
<script type="text/ecmascript-6">
import BlockHeader from '@/components/BlockHeader'
import BlockBorder from '@/components/BlockBorder'
import {DateTime} from '@/utils/mixin'
import {getOrgUpdLog} from '@/api/org'
import {ERR_OK} from '@/utils/status'

export default {
  mixins: [DateTime],
  props: {
    isTitle: {
      type: Boolean,
      default() {
        return true
      }
    },
    hasType: {
      type: Boolean,
      default() {
        return false
      }
    },
    logType: {
      type: String,
      default() {
        return ""
      }
    },
    bizId: {
      type: String,
      default() {
        return ""
      }
    }
  },
  data() {
    return {
      dataList: [],
      pageNum: 1,
      pageSize: 5,
      totalCount: 0,
      columnWidth : '150',
      optColumnWidth : '380'
    }
  },
  methods: {
    formatTime(row) {
      return this._forMatterTime(row.created, '{y}-{m}-{d} {h}:{i}:{s}')
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.searchApply()
    },
    getLogs() {
      if(this.logType === '' || this.bizId == ''){
        this.$alert('日志查询参数异常！', '警告', {
          confirmButtonText: '知道了',
          type: 'success',
          callback: action => {
          }
        })
        return
      }
      getOrgUpdLog({
        optType: this.logType,
        bizId: this.bizId,
        pageSize: this.pageSize,
        pageNum: this.pageNum <= 0 ? 1 : this.pageNum
      }).then(res => {
        if (res.status === ERR_OK) {
          this.pageNum = res.data.page
          this.dataList = res.data.list
          this.pageSize = res.data.pageSize
          this.totalCount = res.data.totalCount
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getLogs()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getLogs()
    }
  },
  computed: {
    currentPage() {
      return this.pageNum
    }
  },
  components: {
    BlockHeader,
    BlockBorder
  }
}
</script>
