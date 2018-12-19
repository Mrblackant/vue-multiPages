<template>
  <block-border>
    <block-header slot="title" title="院校联系信息"></block-header>
    <div slot="container" class="lx_mr_45">
      <el-form :model="form" label-width="160px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="院校地址">
              <el-input v-model="form.address" :disabled="formDisableFlag" placeholder="请输入院校地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="院校中国办事处地址">
              <el-input v-model="form.addresscn" :disabled="formDisableFlag" placeholder="请输入院校中国办事处地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="网址">
              <el-input v-model="form.website" :disabled="formDisableFlag" placeholder="请输入网址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="lx_right_btn" slot="container">
      <el-button type="primary" plain :disabled="formLinkAddBtn" @click="addLinkForm">+ 增加院校联系方式</el-button>
    </div>
    <div slot="container" class="editForm">
      <table cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr>
          <th>院校联系人</th>
          <th>联系人职位</th>
          <th>院校联系电话</th>
          <th>微信/QQ等</th>
          <th>联系人邮箱</th>
          <th>其他联系方式</th>
          <th>备注</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="linkInfo.length!==0" v-for="(item,index) in linkInfo" :key="index">
          <td>{{item.username}}</td>
          <td>{{item.position}}</td>
          <td>{{item.tel}}</td>
          <td>{{item.wechat}}</td>
          <td>{{item.email}}</td>
          <td>{{item.other}}</td>
          <td>{{item.comment}}</td>
          <td>
            <el-button size="mini" :disabled="formDisableFlag" @click="delLinkFun(index)">删除</el-button>
            <el-button size="mini" :disabled="formDisableFlag" @click="editLinkFun(index,item)">编辑</el-button>
          </td>
        </tr>
        <tr v-show="formLinkFlag">
          <td>
            <el-input size="mini" v-model="addLink.username" placeholder="请输入"></el-input>
          </td>
          <td>
            <el-input size="mini" v-model="addLink.position" placeholder="请输入"></el-input>
          </td>
          <td>
            <el-input size="mini" v-model="addLink.tel" placeholder="请输入"></el-input>
          </td>
          <td>
            <el-input size="mini" v-model="addLink.wechat" placeholder="请输入"></el-input>
          </td>
          <td>
            <el-input size="mini" v-model="addLink.email" placeholder="请输入"></el-input>
          </td>
          <td>
            <el-input size="mini" v-model="addLink.other" placeholder="请输入"></el-input>
          </td>
          <td>
            <el-input size="mini" v-model="addLink.comment" placeholder="请输入"></el-input>
          </td>
          <td>
            <el-button v-if="!editFlag" size="mini" @click="addLinkFun">添加</el-button>
            <el-button v-else size="mini" @click="saveEditLink">保存</el-button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </block-border>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .editForm {
    table {
      width: 100%;
    }
    th {
      height: 64px;
      line-height: 64px;
      font-size: 14px;
      font-family: "Microsoft YaHei";
      text-align: left;
      color: #909399;
      background-color: #f0f9fb;
      font-weight: 500;
      box-sizing: border-box;
      padding: 0 10px;
      border-top: 1px solid #e4e7ed;
      &:last-child {
        width: 150px;
      }
    }
    td {
      height: 50px;
      box-sizing: border-box;
      padding: 5px 10px;
      border-bottom: 1px solid #e4e7ed;
      font-size: 14px;
      color: #606266;
    }
  }
</style>
<script type="text/ecmascript-6">
import BlockHeader from '@/components/BlockHeader'
import BlockBorder from '@/components/BlockBorder'
import {mapMutations, mapGetters} from 'vuex'

export default {
  props: {
    disableLink: { // 是否父组件传值
      type: Boolean,
      default: false
    },
    onlyRead: { // 是否只读
      type: Boolean,
      default: false
    },
    dataAddress: {
      type: String,
      default: ''
    },
    dataAddressCn: {
      type: String,
      default: ''
    },
    dataWebsite: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        address: '',
        addresscn: '',
        website: ''
      },
      addLink: {
        username: '',
        position: '',
        tel: '',
        wechat: '',
        email: '',
        other: '',
        comment: ''
      },
      linkInfo: [],
      itemIndex: 0, // 临时存储编辑的id
      editFlag: false, // 判断是编辑还是添加
      disableFlag: true,
      formLinkFlag: true,
      formLinkAddBtn: true,
      formDisableFlag: false
    }
  },
  created() {
    setTimeout(() => {
      if (this.disableLink && this.onlyRead) { // 传值且只读时获取输入框值，隐藏输入并且禁止修改,联系人列表
        console.log()
        this._initData() // 加载获取的值
        this.formLinkFlag = false
        this.formDisableFlag = true
        this.formLinkAddBtn = true
      } else if (this.disableLink) {
        this._initData()
        this.formLinkFlag = false
        this.formLinkAddBtn = false
      }
    }, 17)
    if (!this.onlyRead) { // 非只读时派发form
      // 派发院校信息
      this.$watch('form', (newForm) => {
        this.$emit('schoolform', newForm)
      }, {deep: true})
    } else {
      return
    }
  },
  methods: {
    _initData() {
      console.log(this.dataAddress)
      this.form.address = this.dataAddress
      this.form.addresscn = this.dataAddressCn
      this.form.website = this.dataWebsite
      this.linkInfo = this.schoolInfoList
    },
    // 添加
    addLinkFun() {
      if (
        this.addLink.username !== '' ||
        this.addLink.position !== '' ||
        this.addLink.tel !== '' ||
        this.addLink.wechat !== '' ||
        this.addLink.email !== '' ||
        this.addLink.other !== '' ||
        this.addLink.comment !== ''
      ) {
        this.linkInfo.push({
          username: this.addLink.username ? this.addLink.username : ' - ',
          position: this.addLink.position ? this.addLink.position : ' - ',
          tel: this.addLink.tel ? this.addLink.tel : ' - ',
          wechat: this.addLink.wechat ? this.addLink.wechat : ' - ',
          email: this.addLink.email ? this.addLink.email : ' - ',
          other: this.addLink.other ? this.addLink.other : ' - ',
          comment: this.addLink.comment ? this.addLink.comment : ' - '
        })
        this._clear()
        this.formLinkFlag = false
        this.formLinkAddBtn = false
      } else {
        this.$message.error('联系人信息不能都为空哦！')
      }
      this.setSchoolInfoList(this.linkInfo)
    },
    addLinkForm() {
      this.formLinkAddBtn = true
      this.formLinkFlag = true
    },
    // 删除
    delLinkFun(index) {
      this.linkInfo.splice(index, 1)
      this.setSchoolInfoList(this.linkInfo)
    },
    // 编辑
    editLinkFun(index, item) {
      this.itemIndex = index
      this.editFlag = true
      this.formLinkAddBtn = true
      this.formLinkFlag = true
      this.linkInfo.map((i) => {
        if (item === i) {
          this.addLink.username = i.username ? i.username : ''
          this.addLink.position = i.position ? i.position : ''
          this.addLink.tel = i.tel ? i.tel : ''
          this.addLink.wechat = i.wechat ? i.wechat : ''
          this.addLink.email = i.email ? i.email : ''
          this.addLink.other = i.other ? i.other : ''
          this.addLink.comment = i.comment ? i.comment : ''
        }
      })
    },
    // 保存编辑
    saveEditLink() {
      this.linkInfo.splice(this.itemIndex, 1, {
        username: this.addLink.username ? this.addLink.username : ' - ',
        position: this.addLink.position ? this.addLink.position : ' - ',
        tel: this.addLink.tel ? this.addLink.tel : ' - ',
        wechat: this.addLink.wechat ? this.addLink.wechat : ' - ',
        email: this.addLink.email ? this.addLink.email : ' - ',
        other: this.addLink.other ? this.addLink.other : ' - ',
        comment: this.addLink.comment ? this.addLink.comment : ' - '
      }) // 替换原数组中的内容
      this.editFlag = false
      this._clear()
      this.setSchoolInfoList(this.linkInfo)
      this.formLinkAddBtn = false
      this.formLinkFlag = false
    },
    // 清空表单
    _clear() {
      this.addLink.username = ''
      this.addLink.position = ''
      this.addLink.tel = ''
      this.addLink.wechat = ''
      this.addLink.email = ''
      this.addLink.other = ''
      this.addLink.comment = ''
    },
    ...mapMutations({
      setSchoolInfoList: 'SET_SCHOOLINFOLIST'
    })
  },
  computed: {
    ...mapGetters([
      'schoolInfoList'
    ])
  },
  components: {
    BlockHeader,
    BlockBorder
  }
}
</script>
