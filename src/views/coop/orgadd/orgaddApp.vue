<template>
  <div class="lx_container">
    <div class="lx_main">
      <sub-header title="合作机构维护" icon="yuanxiaohezuoxiangmu"></sub-header>
      <block-border>
        <block-header slot="title" title="基本信息" id="basicMsg"></block-header>
        <div slot="container">
          <el-form ref="form" :rules="rules" :model="form" label-width="150px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="合作机构中文名" prop="nameCn">
                  <el-input v-model="form.nameCn" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合作机构外文名" prop="nameEn">
                  <el-input v-model="form.nameEn" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="国家" prop="contryName" class="lx_overwrite_input">
                  <country :data="countryData" title="国家选择" overClass="lx_bottom_0" :more="true"
                           :showTxt="false"
                           :inputVal="inputVal"
                           @country="getSelCountry" key="one"></country>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="跨国家线项目人员" class="lx_overwrite_input">
                  <!--<el-button>请选择</el-button>-->
                  <country :data="roleData" @country="getSelRole" title="跨国家线人员"
                           overClass="lx_bottom_0"
                           :showTxt="false" :more="false" :inputVal="roleVal"
                           key="two">
                  </country>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </block-border>
      <school-link @schoolform="getSchollLink" :disableLink="false" :onlyRead="false" :isAdd="true" :isOrg="true">
      </school-link>
      <block-border>
        <block-header slot="title" title="机构介绍及申请信息"></block-header>
        <el-form slot="container" label-width="130px" :model="form" class="lx_mr_130">
          <el-form-item label="上传机构介绍附件">
            <file-upload :attaObj="obj" @files="_getFileID"
                         key="one"></file-upload>
          </el-form-item>
          <el-form-item label="申请操作规范">
            <el-input
              type="textarea"
              maxlength="200"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              v-model="form.fgmp">
            </el-input>
            <span>{{nums}}/200</span>
          </el-form-item>
          <el-form-item label="申请提交方式">
            <el-input
              type="textarea"
              maxlength="200"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              v-model="form.subWay">
            </el-input>
            <span>{{nums2}}/200</span>
          </el-form-item>
        </el-form>
      </block-border>
      <div class="lx_btn_center">
        <el-button type="primary" @click="saveOrg">保存</el-button>
        <el-button type="primary" plain @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">

</style>
<script type="text/ecmascript-6">
import SubHeader from '@/components/SubHeader'
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'
import Country from '@/components/Country'
import SchoolLink from '@/components/SchoolLinkInfo'
import FileUpload from '@/components/AttachFile/index'
import {CountryMixin, ValitOrg, FileMixin, RoleMixin} from '@/utils/mixin'
import {ERR_OK} from '@/utils/status.js'
import {addOrg} from '@/api/coopManage'

import {mapGetters} from 'vuex'

export default {
  mixins: [CountryMixin, ValitOrg, FileMixin, RoleMixin],
  data() {
    return {
      form: {
        fgmp: null, // 操作规范
        subWay: null, // 提交方式
        nameCn: null, // 中文名
        nameEn: null, // 英文名
        colAddress: null,
        colAddressCn: null,
        colWebsite: null
        // contryName: this.inputVal
      },
      obj: {
        bizType: 'ORG'
      },
      filesList: [] // 院校附件
      // roleData: []
    }
  },
  methods: {
    _getFileID(data) {
      this.filesList = data
    },
    // 保存机构
    saveOrg() {
      if (window.location.hash.length > 0) {
        window.location.hash = ''
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          addOrg({
            fgmp: this.form.fgmp,
            subWay: this.form.subWay,
            nameCn: this.form.nameCn,
            nameEn: this.form.nameEn,
            countryList: this.sendCountry,
            contacts: this.schoolInfoList,
            attachments: this.filesList,
            orgAddress: this.form.colAddress,
            orgAddressCn: this.form.colAddressCn,
            orgWebsite: this.form.colWebsite,
            headUserId: this.sendRole
          }).then(res => {
            if (res.status === ERR_OK) {
//                                 this.$message.success('机构新增成功')
//                                 setTimeout(() => {
//                                     window.location.href = 'orgedit.html?id=' + res.data + '&type=edit'
// //                                    this.$router.push({
// //                                        name: 'OrgMaintain'
// //                                    })
//                                 }, 3001)
              this.$alert('机构新增成功！', '温馨提示', {
                confirmButtonText: '知道了',
                type: 'success',
                callback: action => {
                  setTimeout(() => {
                    window.location.href = 'orgedit.html?id=' + res.data + '&type=edit'
                  }, 3001)
                }
              })
            } else {
              // this.$message.error(res.msg)
              this.$alert(res.msg, '错误提示', {
                confirmButtonText: '知道了',
                type: 'error'
              })
            }
          })
        } else {
          this.$message.error('机构基本信息必须填写！')
          window.location.hash = "#basicMsg"
        }
      })
    },
    cancel() {
      // window.location.href = 'orgmanage.html'
//                this.$router.push({
//                    name: 'OrgMaintain'
//                })
//                     this.form.fgmp = ''
//                     this.form.subWay = ''
//                     this.form.nameCn = ''
//                     this.form.nameEn = ''
//                     this.form.countryList = ''
//                     this.form.contacts = []
//                     this.form.attachments = []
//                     this.form.orgAddress = ''
//                     this.form.orgAddressCn = ''
//                     this.form.orgWebsite = ''
//                     this.form.headUserId = ''
      window.close();
    },
    getSchollLink(...data) {
      this.form.colAddress = data[0].address
      this.form.colAddressCn = data[0].addresscn
      this.form.colWebsite = data[0].website
    }
  },
  computed: {
    ...mapGetters([
      'schoolInfoList'
    ]),
    nums() {
      if (!this.form.fgmp) {
        return 0
      } else {
        return this.form.fgmp.length
      }
    },
    nums2() {
      if (!this.form.subWay) {
        return 0
      } else {
        return this.form.subWay.length
      }
    }
  },
  components: {
    SubHeader,
    BlockBorder,
    BlockHeader,
    Country,
    SchoolLink,
    FileUpload
  }
}
</script>
