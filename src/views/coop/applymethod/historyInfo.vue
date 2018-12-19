<template>
  <block-border>
    <block-header slot="title" title="历史报审信息"></block-header>
    <div slot="container">
      <slot name="form"></slot>
      <el-table :data="hisData" class="width100 " header-row-class-name="lx_table_hd">
        <el-table-column
          prop="countryName"
          label="国家">
        </el-table-column>
        <el-table-column prop="coopOrgNameEn" label="机构/院校外文名"></el-table-column>
        <el-table-column prop="coopOrgNameCn" label="机构/院校中文名"></el-table-column>
        <el-table-column prop="projectName" label="合作项目"></el-table-column>
        <el-table-column prop="applyType.name" label="合作方式"></el-table-column>
        <el-table-column prop="conType.name" label="合同类型"></el-table-column>
        <el-table-column prop="applyDate" :formatter="formatDate1" label="报审时间"></el-table-column>
        <el-table-column prop="status.name" label="申请状态"></el-table-column>
        <el-table-column prop="endtime" :formatter="formatDate2" label="合同到期时间"></el-table-column>
        <el-table-column prop="conStatus.name" label="合同状态"></el-table-column>
        <el-table-column prop="applyUserName" label="报审人"></el-table-column>
        <el-table-column fixed="right" label="操作" width="240px">
          <template slot-scope="scope">
            <el-button size="mini" @click="goCheck(scope.row)">查看</el-button>
            <el-button size="mini" v-if="isEdit(scope.row)" @click="goEdit(scope.row)">编辑</el-button>
            <!--            <el-button size="mini" v-if="isRenew(scope.row)" @click="goRenew(scope.row)">续签</el-button>
                        <el-button size="mini" v-if="isDiff(scope.row)&&coopBtn" @click="goDiff(scope.row)">信息修正</el-button>-->
            <el-button size="mini" v-if="isDel(scope.row)" @click="goDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div slot="container">
      <slot name="pages"></slot>
    </div>
  </block-border>
</template>
<script type="text/ecmascript-6">
import BlockHeader from '@/components/BlockHeader'
import BlockBorder from '@/components/BlockBorder'
import {DateTime} from '@/utils/mixin'
import global_ from '@/Global'
import {getRenew} from '@/api/coopContract'
import {ERR_OK} from '@/utils/status'
import {delApply} from '@/api/coopManage'

export default {
  mixins: [DateTime],
  props: {
    data: {
      type: Array,
      default: []
    },
    coopBtn: {
      type: Boolean,
      default: false
    },
    curID: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isDer: false,
      isLoading: '',
      hisData: []
    }
  },
  watch: {
    data() {
      this.hisData = this.data
    }
  }
  ,
  methods: {
    // 报审时间
    formatDate1(row) {
      return this._forMatterTime(row.applyDate, '{y}-{m}-{d}')
    },
    formatDate2(row) {
      return this._forMatterTime(row.endTime, '{y}-{m}-{d}')
    },
    _applyType(type) {
      if (type === global_.ORGCOL || type === global_.ORGDERIVATIVE) {
        return 'org'
      } else {
        return 'school'
      }
    },
    // 是否新签
    isRenew(row) {
      if (row.conStatus !== null && row.conType !== null) {
        if ((row.conStatus.code === 'NORMAL' || row.conStatus.code === 'OUT_TIME') && row.contIsRenew !== true && row.applyType.code !== global_.ORGDERIVATIVE) {
          return true
        } else {
          return false
        }
      }
    },
    // 查看详细
    goCheck(row) {
      if (row.applyType.code === global_.ORGDERIVATIVE) {
        this.isDer = true
      } else {
        this.isDer = false
      }
      // 查看申请页面取消查看合同
//        if (row.conId) {
//            window.open('contdetail.html?id=' + row.conId + '&type=' + this._applyType(row.applyType.code) + '&derive=' + this.isDer + '&edit=false')
////          this.$router.push({
////            name: 'Cooperation',
////            query: {
////              id: row.conId,
////              type: this._applyType(row.applyType.code),
////              derive: this.isDer,
////              edit: false
////            }
////          })
//        } else {
      window.open('applydetail.html?id=' + row.id + '&type=' + this._applyType(row.applyType.code) + '&derive=' + this.isDer)
//          this.$router.push({
//            name: 'CoopApplyDetail',
//            query: {
//              id: row.id,
//              type: this._applyType(row.applyType.code),
//              derive: this.isDer
//            }
//          })
//        }
    },
    // 是否显示编辑
    isEdit(row) {
      // let ID = sessionStorage.getItem('currUserID')
      if (row.hasEdit) {
        return true
      } else {
        return false
      }
    },
    // 续签
//      goRenew(row) { // 此处逻辑为已经被自己续签过的项目跳转到编辑页面
//        if (row.applyType.code === global_.DIRECTCOL) {
//          getRenew({
//            conId: row.conId
//          }).then(res => {
//            if (res.status === ERR_OK) {
//              if (res.data === null) {
//                  window.open('applyrenewdirect.html?id=' + row.conId)
//              } else {
//                  window.open('applyeditdirect.html?id=' + res.data)
//              }
//            } else {
//              this.$message.error(res.msg)
//            }
//          })
//        } else if (row.applyType.code === global_.ORGDERIVATIVE) {
//            window.open('applyrenewdirect.html?id=' + row.conId)
//        } else if (row.applyType.code === global_.ORGCOL) {
//          getRenew({
//            conId: row.conId
//          }).then(res => {
//            if (res.status === ERR_OK) {
//              if (res.data === null) {
//                  window.open('applyreneworg.html?id=' + row.conId)
//              } else {
//                  window.open('applyeditorg.html?id=' + res.data)
//              }
//            }
//          })
//        }
//      },
    // 编辑按钮
    goEdit(row) {
      if (row.applyType.code === global_.DIRECTCOL) {
        window.open('applyeditdirect.html?id=' + row.id)
//          this.$router.push({
//            name: 'EditDirectSchool',
//            query: {
//              id: row.id
//            }
//          })
      }
      if (row.applyType.code === global_.ORGCOL) {
        window.open('applyeditorg.html?id=' + row.id)
//          this.$router.push({
//            name: 'EditParentOrg',
//            query: {
//              id: row.id
//            }
//          })
      }
    },
    // 信息修正按钮
//      goDiff(row) {
//          window.open('contedit.html?id=' + row.conId + '&type=' + this._applyType(row.applyType.code) + '&derive=' + this.isDer)
////        this.$router.push({
////          name: 'DiffContract',
////          query: {
////            id: row.conId,
////            type: this._applyType(row.applyType.code),
////            derive: this.isDer
////          }
////        })
//      },
    // 是否显示信息修正
    isDiff(row) {
      let code = null
      if (row.conStatus !== null) {
        code = row.conStatus.code
      } else {
        code = null
      }
      if (row.applyType.code === global_.ORGDERIVATIVE || code !== 'NORMAL' || row.contIsRenew === true) {
        return false
      } else {
        return true
      }
    },
    // 是否显示删除
    isDel(row) {
      if (row.status.code === 'DRAFT') {
        if (row.hasEdit) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    // 编辑按钮
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
            for (let i = 0; i < this.data.length; i++) {
              if (this.data[i].id === row.id) {
                this.data.splice(i, 1);
                break;
              }
            }
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败！' + r.msg)
          }
        })
      })
    }
  },
  components: {
    BlockHeader,
    BlockBorder
  }
}
</script>
