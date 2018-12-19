<template>
  <block-border>
    <block-header title="院校申请信息" slot="title"></block-header>
    <div slot="container" class="lx_container">
      <el-row class="lx_row_txt">
        <el-col :span="8"><span>申请类型：院校直接合作 <el-tag>新签</el-tag></span></el-col>
        <el-col :span="8">
          <span>院校国家：{{countryName}}</span>
        </el-col>
        <!--<el-col :span="8">-->
        <!--<span>合作类型：院校直接合作</span>-->
        <!--</el-col>-->
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
    countryName: {
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
