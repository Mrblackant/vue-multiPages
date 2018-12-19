<script type="text/ecmascript-6">
const CONT_NEW = 'NEW'
const CONT_RENEW = 'RENEW'
const CONT_SUPP = 'SUPP'
const SPECIAL = 'SPECIAL'
const ORGCOL = 'ORG_COL'
const DIRECTCOL = 'DIRECT_COL'
const ORGDERIVATIVE = 'ORG_DERIVATIVE'
const HTTP = 'http://mylx.shinyway.org/views/'
// const ADDATTACHURL = 'http://lx.test.org/common/attachments'
const ADDATTACHURL = '/common/attachments'
// const ADDATTACHURL = 'http://kflx.cg.shinyway.org/common/attachments/'
const APPROVE = sessionStorage.getItem('LXURI') // 审批地址
const COOPAPPLY = 'COOP_APPLY'// 合作项目申请流程CODE
const DOWNLOADURL = '/common/download/' // 下载地址
export default {
  SPECIAL,
  ORGCOL,
  DIRECTCOL,
  ORGDERIVATIVE,
  ADDATTACHURL,
  APPROVE,
  COOPAPPLY,
  DOWNLOADURL,
  CONT_SUPP,
  CONT_RENEW,
  CONT_NEW
}
</script>
