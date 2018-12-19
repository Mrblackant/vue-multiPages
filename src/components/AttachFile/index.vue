<template>
  <el-upload
    class="lx_upload_atta"
    :class="customUpload"
    :disabled="isDisable"
    :action="actionUrl"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :name="attaName"
    :data="attaObj"
    :before-remove="beforeRemove"
    :multiple="isMultiple"
    :limit="attaLimit"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :on-error="handleError"
    :file-list="attafiles"
    :headers="headers">
    <el-button :disabled="isDisable" :size="upBtnSize">{{btnTxt}}</el-button>
    <div v-if="isTip" slot="tip" class="el-upload__tip">{{tipTxt}}</div>
  </el-upload>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  // 附件样式覆盖
  .lx_upload_atta {
    .el-upload-list {
      position: absolute;
      top: 5px;
      left: 95px;
      display: flex;
      .el-upload-list__item {
        margin-top: 0;
        height: 20px;
        box-sizing: border-box;
        line-height: 20px;
        background-color: #f0f2f5;
        margin-top: 5px;
        margin-right: 10px;
        width: 194px;
        overflow: hidden;
        .el-icon-close {
          top: 4px;
        }
      }
    }
  }
</style>
<script type="text/ecmascript-6">
import {ERR_OK} from '@/utils/status.js'
import global_ from '@/Global'
import {downloadFile, LogDiogFun} from '@/utils/index.js'

export default {
  props: {
    isDisable: { // 是否禁用
      type: Boolean,
      default: false
    },
    actionUrl: { // 提交地址
      type: String,
      default: global_.ADDATTACHURL
    },
    delActionUrl: { // 删除附件地址
      type: String,
      default: ''
    },
    attaObj: { // 上传时附带的额外参数
      type: Object,
      default() {
        return null
      }
    },
    attaList: { // 附件接收列表
      type: Array,
      default() {
        return []
      }
    },
    attaLimit: { // 附件提交数量
      type: Number,
      default: 5
    },
    attaName: { // 上传的文件字段名
      type: String,
      default: 'files'
    },
    isMultiple: { // 是否支持多选文件
      type: Boolean,
      default: true
    },
    isTip: { // 固定提示文件
      type: Boolean,
      default: true
    },
    tipTxt: { // 提示文字内容
      type: String,
      default: '非必填，可上传最多5个文件，单个文件最大30M，支持文件格式：PDF、word、rar/zip等常用压缩文件'
    },
    upBtnSize: { // 按钮大小 参数同element
      type: String,
      default: 'medium'
    },
    btnTxt: { // 按钮文字
      type: String,
      default: '请选择'
    },
    customUpload: { // 自定义样式
      type: [String, Array],
      default: ''
    }
  },
  data() {
    return {
      attafiles: this.attaList, // 附件列表
      fileID: [], // 附件ID
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    }
  },
  methods: {
    handleRemove(file, fileList) { // 文件删除
      this.attafiles.map((item, index) => {
        if (file.id === '' || file.id === undefined) {
          if (item.id === file.responses.data.id) {
            this.attafiles.splice(index, 1)
          }
        } else {
          if (item.id === file.id) {
            this.attafiles.splice(index, 1)
          }
        }
      })
      this.$emit('delFile', this.attafiles)
      this.$message.success(`${file.name}删除成功`)
    },
    handlePreview(file) { // 文件预览

      // console.log(file)
      if (file.response) {
        downloadFile(global_.DOWNLOADURL + file.response.data.fileId)
      } else {
        downloadFile(global_.DOWNLOADURL + file.fileId)
      }
    },
    handleExceed(files, fileList) { // 文件选择限制
      this.$message.error(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) { // 文件删除之前
      return this.$confirm((`您确定删除 ${file.name}？`), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(null).catch(e => {
        e()
      })
    },
    handleError(error, file, fileList) { // 上传错误
      LogDiogFun(error)
      this.$message.error(error)
    },
    handleSuccess(response, file, fileList) { // 上传成功
      if (response.status === ERR_OK) {
        if (response.data.fileType === null) {
          this.fileID.push({
            id: response.data.id
          })
        } else {
          this.fileID.push({
            id: response.data.id,
            fileType: response.data.fileType.code
          })
        }
        if (this.attafiles.length > 0) {
          let M = this.fileID.concat(this.attafiles)
          this.$emit('files', M)
        } else {
          this.$emit('files', this.fileID)
        }
        this.$message.success('文件上传成功!')
      }
    },
    // 文件改变
    onChangeFile(file, fileList) {
      if (file.status === 'ready') {
        let size = file.size
        let largeSize = size / 1024 / 1024
        if (largeSize > 30) {
          this.$message.error(file.name + '文件太大,请重新选择')
        } else {
          this.$refs.upload.submit()
        }
      }
    }
  }
}
</script>
