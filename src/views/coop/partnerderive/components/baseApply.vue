<template>
  <block-border>
    <block-header title="院校申请信息" slot="title"></block-header>
    <div slot="container" class="lx_container">
      <el-row class="lx_row_txt">
        <el-col :span="6"><span>申请类型：衍生服务合作 <el-tag>新签</el-tag></span></el-col>
        <el-col :span="12">
          <span>机构国家：{{name}}</span>
        </el-col>
        <el-col :span="6">
          <span>合作类型：衍生服务</span>
        </el-col>
      </el-row>
    </div>
  </block-border>
</template>
<script type="text/ecmascript-6">
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'

export default {
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  components: {
    BlockBorder,
    BlockHeader
  }
}
</script>
