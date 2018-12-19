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
                  <el-input v-model="form.nameCn" placeholder="请输入" maxlength="250"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="合作机构外文名" prop="nameEn">
                  <el-input v-model="form.nameEn" placeholder="请输入" maxlength="250"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="国家" prop="contryName">
                  <country :data="countryData" title="请选择国家" :parentVal="countrylist"
                           overClass="lx_bottom_0"
                           :more="true" :showTxt="false"
                           :inputVal="inputVal" key="one"
                           @country="getSelCountry">
                  </country>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="跨国家线项目人员">
                  <country :data="roleData" title="请选择跨国家线人员" overClass="lx_bottom_0" :more="false"
                           :showTxt="false"
                           :inputVal="roleVal"
                           key="two"
                           @country="getSelRole"></country>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </block-border>
      <school-link :disableLink="true" @schoolform="getSchollLink" :isOrg="true"
                   :dataAddress="form.colAddress"
                   :dataAddressCn="form.colAddressCn"
                   :dataWebsite="form.colWebsite">
      </school-link>
      <block-border>
        <block-header slot="title" title="机构介绍及申请信息"></block-header>
        <el-form slot="container" label-width="130px" :model="form" class="lx_mr_130">
          <el-form-item label="上传机构介绍附件">
            <file-upload :attaObj="obj" @files="_getFileID" :attaList="filesList"
                         key="one"></file-upload>
          </el-form-item>
          <el-form-item label="申请操作规范">
            <div>
              <el-input
                type="textarea"
                maxlength="200"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入内容"
                v-model="form.fgmp">
              </el-input>
              <span>{{nums}}/200</span>
            </div>
          </el-form-item>
          <el-form-item label="申请提交方式">
            <div>
              <el-input
                type="textarea"
                maxlength="200"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入内容"
                v-model="form.subWay">
              </el-input>
              <span>{{nums2}}/200</span>
            </div>
          </el-form-item>
        </el-form>
      </block-border>
      <div class="lx_btn_center">
        <el-button type="primary" @click="saveOrg">保存</el-button>
        <el-button @click="cancel">取消</el-button>
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
import {CountryMixin, ValitOrg, RoleMixin} from '@/utils/mixin'
import {ERR_OK} from '@/utils/status.js'
import {edit, getOrgDetail} from '@/api/org'
import {mapGetters, mapMutations} from 'vuex'
import {GetRequest} from '@/utils/index.js'

export default {
  mixins: [CountryMixin, ValitOrg, RoleMixin],
  data() {
    return {
      form: {
        fgmp: '', // 操作规范
        subWay: '', // 提交方式
        nameCn: null, // 中文名
        nameEn: null, // 英文名
        colAddress: null,
        colAddressCn: null,
        colWebsite: null,
        contryName: this.inputVal
      },
      // id: this.$route.query.id,
      tmpList: [], // 附件临时存储
      orgData: {}, // 机构详情临时存储
      personData: [], // 跨过线人员暂存
      personDatavalue: '',
      obj: {
        bizType: 'ORG'
      },
      filesList: [],
      fileID: [],
      queryid: ''
    }
  },
  created() {
    this.initCountryParam = false
  },
  mounted() {
    let req = GetRequest()
    let id = req.id
    this.queryid = id
    if (!this.queryid) {
      this.$message.error('出错了，找不到对应机构信息！')
      setTimeout(() => {
        // this.$router.push({
        //     name: 'OrgMaintain'
        // })
        window.location.href = 'orgmaintain.html'
      }, 1000)
    } else {
      setTimeout(() => {
        this._initData(this.queryid)
      }, 100)
    }
  },
  methods: {
    _getFileID(data) {
      this.filesList = data
    },
    _formatFileID() {
      if (this.filesList === 0) {
        return null
      } else {
        let M = []
        this.filesList.map(item => {
          M.push({
            id: item.id
          })
        })
        return M
      }
    },
    // 保存机构
    saveOrg() {
      if (window.location.hash.length > 0) {
        window.location.hash = ''
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          edit({
            id: this.queryid,
            fgmp: this.form.fgmp,
            subWay: this.form.subWay,
            nameCn: this.form.nameCn,
            nameEn: this.form.nameEn,
            countryList: this._country(),
            contacts: this.schoolInfoList,
            attachments: this._formatFileID(),
            orgAddress: this.form.colAddress,
            orgAddressCn: this.form.colAddressCn,
            orgWebsite: this.form.colWebsite,
            headUserId: this.sendRole
          }).then(res => {
            if (res.status === ERR_OK) {
              // this.$message.success({
              //   message: '机构编辑成功',
              //   duration: 2000
              // })

              this.$alert('机构编辑成功！', '温馨提示', {
                confirmButtonText: '知道了',
                type: 'success'
              })
              // setTimeout(() => {
              //     // this.$router.push({
              //     //     name: 'OrgMaintain'
              //     // })
              //     window.location.href = 'orgmanage.html'
              // }, 2001)
            } else {
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
      // this._initData(this.id)
      // this.$router.go(-1)
      window.history.go(-1)
    },
    getSchollLink(...data) {
      this.form.colAddress = data[0].address
      this.form.colAddressCn = data[0].addresscn
      this.form.colWebsite = data[0].website
    },
    _country() {
      let m = []
      this.countrylist.map((item) => {
        m.push({
          countryCode: item.code,
          nameCn: item.nameCn
        })
      })
      return m
    },
    // 初始化数据
    _initData(id) {
      getOrgDetail({id: id}).then((res) => {
        if (res.status === ERR_OK) {
          this.orgData = res.data
          this._initEditData()
        }
      })
    },
    _initEditData() {
      this.form.nameCn = this.orgData.nameCn
      this.form.nameEn = this.orgData.nameEn
      this.form.fgmp = this.orgData.fgmp
      this.form.subWay = this.orgData.subWay
      this.form.colAddress = this.orgData.orgAddress
      this.form.colAddressCn = this.orgData.orgAddressCn
      this.form.colWebsite = this.orgData.orgWebsite
      this.tmpList = this.orgData.attachments
      this._formatFile()
      this._initCountry()
      this.roleSelList.push({
        code: this.orgData.headUserId,
        nameCn: this.orgData.headUserName
      })
      this.setSchoolInfoList(this.orgData.contacts)
    },
    // 附件
    _formatFile() {
      this.tmpList.map((item) => {
        this.filesList.push({
          name: item.fileName,
          id: item.id,
          fileId: item.fileId
        })
      })
    },
    ...mapMutations({
      setSchoolInfoList: 'SET_SCHOOLINFOLIST'
    })
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
  watch: {
    countryData: {
      handler(newVal, oldVal) {
        if (newVal) {
          // console.log(newVal)
          let that = this
          newVal.map(i => {
            that.orgData.listOfOrgCountry.map((item) => {
              if (i.code === item.code) {
                this.countrylist.push(i)
              }
            })
          })
        }
      },
      deep: true
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
