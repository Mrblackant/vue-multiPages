<template>
  <el-table class="width100" :data="contsData" header-row-class-name="lx_table_hd">
    <el-table-column label="合作方式" :formatter="_formatType"></el-table-column>
    <el-table-column label="合作项目" prop="projectName"></el-table-column>
    <el-table-column label="合作等级" width="100px">
      <template prop="leavel" slot-scope="scope">{{ levalTemp[scope.row.leavel] }}</template>
    </el-table-column>
    <el-table-column label="最初合作日期" :formatter="_formatDate1" width="140px"></el-table-column>
    <el-table-column label="最新合同开始日期" :formatter="_formatDate2" width="140px"></el-table-column>
    <el-table-column label="最新合同结束日期" :formatter="_formatDate3" width="140px"></el-table-column>
    <el-table-column label="合同状态" prop="contStatus.name" width="100px"></el-table-column>
    <el-table-column label="操作" width="260px" v-if="isEdit" fixed="right">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" plain @click="handleSee(scope.row)">查看申请信息</el-button>
        <el-button size="mini" type="primary" v-if="_isApplyNo(scope.row)==='unselbtn'&&coopBtn" plain
                   @click="goApply(scope.row,'UNCHECK')">设为不可选
        </el-button>
        <el-button size="mini" type="primary" v-if="_isApplyNo(scope.row)==='selbtn'&&coopBtn" plain
                   @click="goApply(scope.row,'CHECK')">恢复可选
        </el-button>
        <el-button size="mini" type="primary" v-if="_isSelted(scope.row)==='unchecked'&&coopBtn" plain
                   @click="goApply(scope.row,'UNCHECK')">不可选申请中
        </el-button>
        <el-button size="mini" type="primary" v-if="_isSelted(scope.row)==='checked'&&coopBtn" plain
                   @click="goApply(scope.row,'CHECK')">可选申请中
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<style lang="scss" rel="stylesheet/scss">

</style>
<script type="text/ecmascript-6">
import global_ from '@/Global'
import {DateTime} from '@/utils/mixin'
import {getLevelTable} from '@/api/dict'
import {ERR_OK} from '@/utils/status'
// import {setSel} from '@/api/schoolManage'
// import {ERR_OK} from '@/utils/status.js'

export default {
  mixins: [DateTime],
  props: {
    contsData: {
      type: Array,
      default: []
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    coopBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDer: null,
      levelTableList: [],
      levalTemp: {}
    }
  },
  mounted(){
    let that = this
    setTimeout(() => {
      // 获取等级
      getLevelTable().then(res => {
        if (res.status === ERR_OK) {
          this.levelTableList = res.data
          for (let l of that.levelTableList) {
            that.levalTemp[l.levelCode] = l.levelName
          }
          }
        })
      })
  },
  methods: {
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
    // 设为不可选
    _isApplyNo(row) {
      if (row.contStatus.code === 'NORMAL') {
        if (row.selectType === null) {
          if (row.isSelected === true) {
            return 'unselbtn'
          } else {
            return 'selbtn'
          }
        }
      }
      return null
    },
    _isSelted(row) {
      if (row.contStatus.code === 'NORMAL') {
        if (row.selectType === null) {
          return
        } else {
          if (row.selectType.code === 'CHECKED') {
            return 'checked'
          } else {
            return 'unchecked'
          }
        }
      }
      return
    },
    _applyType(type) {
      if (type === global_.ORGCOL || type === global_.ORGDERIVATIVE) {
        return 'org'
      } else {
        return 'school'
      }
    },
    handleSee(row) {
      if (row.applyType.code === global_.ORGDERIVATIVE) {
        this.isDer = true
      } else {
        this.isDer = false
      }
      // 查看合同详情不需要院校ID?
      window.location.href = "contdetail.html?id=" + row.conId + "&type=" + this._applyType(row.applyType.code) + "&derive=" + this.isDer + "&edit=false"
//        this.$router.push({
//          name: 'Cooperation',
//          query: {
//            id: row.conId,
//            type: this._applyType(row.applyType.code),
//            derive: this.isDer,
//            edit: false
//          },
//          params: {
//            schoolId: row.id
//          }
//        })
    },
    goApply(row, type) { // 不可选申请
      window.location.href = "coopseeapply.html?id=" + row.levelId + "&type=" + type
//        this.$router.push({
//          name: 'Partner',
//          query: {
//            id: row.levelId,
//            type: type
//          },
//          params: {
//            schoolId: row.id
//          }
//        })
    }
  }
}
</script>
