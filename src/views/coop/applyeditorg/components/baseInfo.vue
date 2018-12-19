<template>
  <block-border>
    <block-header title="机构申请信息" slot="title"></block-header>
    <div slot="container" class="lx_container">
      <el-row class="lx_row_txt">
        <el-col :span="8"><span>申请类型：合作机构合作 <el-tag>{{tags}}</el-tag></span></el-col>
        <el-col :span="8">
          <span>机构国家：{{country}}</span>
        </el-col>
        <el-col :span="8">
          <span>合作类型：机构院校合作</span>
        </el-col>
      </el-row>
    </div>
  </block-border>
</template>
<style lang="scss" rel="stylesheet/scss">

</style>
<script type="text/ecmascript-6">
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'

export default {
  props: {
    tags: { // 标签
      type: String,
      default: '新签'
    },
    country: { // 国家
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
