<template>

</template>

<script type="text/ecmascript-6">
import {GetRequest} from '@/utils/index'
import {ERR_OK} from '@/utils/status'
import {getRenew} from '@/api/coopContract'
import global_ from '@/Global'

export default {
  name: "applyrenewApp",
  mounted() {
    let req = GetRequest()
    let conId = req.conId
    let rowId = req.rowId
    let applyType = req.applyType
    let conType = req.conType
    if (applyType === global_.DIRECTCOL) {
      getRenew({
        conId: conId,
        conType: conType
      }).then(res => {
        if (res.status === ERR_OK) {
          if (res.data === null) {
            let url = 'applyrenewdirect.html?id=' + rowId + '&conType=' + conType
            window.location.href = url
          } else {
            window.location.href = 'applyeditdirect.html?id=' + res.data + '&conType=' + conType
          }
        } else {
          this.$alert('项目已有续签或者补充协议申请,当前不可操作！', '错误提示', {
            confirmButtonText: '知道了',
            type: 'warn',
            callback: action => {
              window.close()
            }
          });
        }
      })
    } else if (applyType === global_.ORGCOL) {
      getRenew({
        conId: conId
      }).then(res => {
        if (res.status === ERR_OK) {
          if (res.data === null) {
            window.location.href = 'applyreneworg.html?id=' + rowId + '&conType=' + conType
          } else {
            window.location.href = 'applyeditorg.html?id=' + res.data + '&conType=' + conType
          }
        } else {
          this.$alert('项目已有续签或者补充协议申请,当前不可操作！', '错误提示', {
            confirmButtonText: '知道了',
            type: 'warn',
            callback: action => {
              window.close()
            }
          });
        }
      })
    }
  }
}
</script>

<style scoped>

</style>