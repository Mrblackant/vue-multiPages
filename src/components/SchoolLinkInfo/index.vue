<template>
  <block-border>
    <block-header slot="title" :title="title">
      <div slot="right" class="lx_block_btn" v-if="!isAdd">
        <el-button type="primary" plain @click="updateLink">保存</el-button>
        <el-button v-if="isCancel" @click="cancel">取消</el-button>
      </div>
    </block-header>
    <div slot="container" class="lx_mr_45">
      <el-form :model="form" label-width="160px" v-if="!isOrg">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="院校地址">
              <el-input v-model="form.address" :class={lx_link_input:formTip} :disabled="formDisableFlag"
                        placeholder="请输入院校地址" maxlength="100"></el-input>
              <span v-show="tip1" class="lx_txt_red">字符串过长,不能超过200</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="院校中国办事处地址">
              <el-input v-model="form.addresscn" :class={lx_link_input:formTip2} :disabled="formDisableFlag"
                        placeholder="请输入院校中国办事处地址" maxlength="100"></el-input>
              <span v-show="tip2" class="lx_txt_red">字符串过长,不能超过200</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="网址">
              <el-input v-model="form.website" :class={lx_link_input:formTip3} :disabled="formDisableFlag"
                        placeholder="请输入网址" maxlength="100"></el-input>
              <span v-show="tip3" class="lx_txt_red">字符串过长,不能超过100</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form :model="form" label-width="160px" v-else>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="机构地址">
              <el-input v-model="form.address" :class={lx_link_input:formTip} :disabled="formDisableFlag"
                        placeholder="请输入院校地址" maxlength="100"></el-input>
              <span v-show="formTip" class="lx_txt_red">字符串过长,不能超过200</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机构中国办事处地址">
              <el-input v-model="form.addresscn" :class={lx_link_input:formTip2} :disabled="formDisableFlag"
                        placeholder="请输入院校中国办事处地址" maxlength="100"></el-input>
              <span v-show="formTip2" class="lx_txt_red">字符串过长,不能超过200</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机构网址">
              <el-input v-model="form.website" :class={lx_link_input:formTip3} :disabled="formDisableFlag"
                        placeholder="请输入网址" maxlength="100"></el-input>
              <span v-show="formTip3" class="lx_txt_red">字符串过长,不能超过100</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="container" class="editform">
      <table cellspacing="0" cellpadding="0" border="0">
        <thead>
        <tr v-if="!isOrg">
          <th style="min-width:130px">院校联系人</th>
          <th style="min-width: 130px">联系人职位</th>
          <th style="min-width: 100px">院校联系电话</th>
          <th style="min-width: 130px">微信</th>
          <th style="min-width: 120px">QQ</th>
          <th style="min-width: 130px">联系人邮箱</th>
          <th style="min-width: 130px">其他联系方式</th>
          <th style="min-width: 100px">备注</th>
          <th width="160px">操作</th>
        </tr>
        <tr v-else>
          <th style="min-width:130px">机构联系人</th>
          <th style="min-width: 130px">联系人职位</th>
          <th style="min-width: 100px">机构联系电话</th>
          <th style="min-width: 130px">微信</th>
          <th style="min-width: 120px">QQ</th>
          <th style="min-width: 130px">联系人邮箱</th>
          <th style="min-width: 130px">其他联系方式</th>
          <th style="min-width: 100px">备注</th>
          <th width="160px">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="linkInfo.length!==0" v-for="(item,index) in linkInfo" :key="index">
          <td style="min-width: 130px">
            <span v-show="!item.edit" :title="item.username">{{item.username}}</span>
            <el-input v-show="item.edit" clearable maxlength="50" size="mini" width="100%"
                      v-model="item.username"></el-input>
          </td>
          <td style="min-width: 130px">
            <span v-show="!item.edit" :title="item.position">{{item.position}}</span>
            <el-input v-show="item.edit" clearable maxlength="100" size="mini" width="100%"
                      v-model="item.position"></el-input>
          </td>
          <td style="min-width: 100px">
            <span v-show="!item.edit" :title="item.tel">{{item.tel}}</span>
            <el-input v-show="item.edit" clearable maxlength="20" size="mini" width="100%"
                      v-model="item.tel"></el-input>
          </td>
          <td style="min-width: 130px">
            <span v-show="!item.edit" :title="item.wechat">{{item.wechat}}</span>
            <el-input maxlength="100" clearable v-show="item.edit" size="mini" width="100%"
                      v-model="item.wechat"></el-input>
          </td>
          <td style="min-width: 120px">
            <span v-show="!item.edit" :title="item.qq">{{item.qq}}</span>
            <el-input maxlength="50" clearable v-show="item.edit" size="mini" width="100%" v-model="item.qq"></el-input>
          </td>
          <td style="min-width: 130px">
            <span v-show="!item.edit" :title="item.email">{{item.email}}</span>
            <el-input maxlength="100" type="email" clearable v-show="item.edit" size="mini" width="100%"
                      v-model="item.email"></el-input>
          </td>
          <td style="min-width: 130px">
            <span v-show="!item.edit" :title="item.other">{{item.other}}</span>
            <el-input maxlength="100" clearable v-show="item.edit" size="mini" width="100%"
                      v-model="item.other"></el-input>
          </td>
          <td style="min-width: 100px">
            <span v-show="!item.edit" :title="item.commit">{{item.comment}}</span>
            <el-input maxlength="100" clearable v-show="item.edit" size="mini" width="100%"
                      v-model="item.comment"></el-input>
          </td>
          <td style="min-width: 160px">
            <div v-if="!item.edit">
              <el-button size="mini" :disabled="isIng" @click="delLinkFun(index)">删除</el-button>
              <el-button size="mini" :disabled="isIng" @click="editLinkFun(index,item)">编辑
              </el-button>
            </div>
            <div v-else>
              <el-button size="mini" @click="saveEditLink(item)">保存</el-button>
              <el-button size="mini" @click="cancelEdit(item)">取消</el-button>
            </div>
          </td>
        </tr>
        <tr v-show="formLinkFlag">
          <td style="min-width: 130px">
            <el-input size="mini" v-model="addLink.username" maxlength="50" placeholder="请输入"></el-input>
          </td>
          <td style="min-width: 130px">
            <el-input size="mini" v-model="addLink.position" maxlength="100" placeholder="请输入"></el-input>
          </td>
          <td style="min-width: 100px">
            <el-input size="mini" v-model="addLink.tel" maxlength="20" placeholder="请输入"></el-input>
          </td>
          <td style="min-width: 130px">
            <el-input size="mini" v-model="addLink.wechat" maxlength="100" placeholder="请输入"></el-input>
          </td>
          <td style="min-width: 120px">
            <el-input size="mini" v-model="addLink.qq" maxlength="50" placeholder="请输入"></el-input>
          </td>
          <td style="min-width: 130px">
            <el-input size="mini" type="email" v-model="addLink.email" maxlength="100" placeholder="请输入"></el-input>
          </td>
          <td style="min-width: 130px">
            <el-input size="mini" v-model="addLink.other" maxlength="100" placeholder="请输入"></el-input>
          </td>
          <td style="min-width: 100px">
            <el-input size="mini" v-model="addLink.comment" maxlength="100" placeholder="请输入"></el-input>
          </td>
          <td style="min-width: 160px">
            <el-button size="mini" @click="addLinkFun">保存</el-button>
            <el-button size="mini" @click="delLinkInput">取消</el-button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="lx_right_btn lx_add_link" slot="container">
      <el-button v-if="!isOrg" type="primary" size="mini" plain :disabled="formLinkAddBtn" @click="addLinkForm">+
        增加院校联系方式
      </el-button>
      <el-button v-else type="primary" plain size="mini" :disabled="formLinkAddBtn" @click="addLinkForm">+ 增加机构联系方式
      </el-button>
    </div>
  </block-border>
</template>
<style lang="scss" rel="stylesheet/scss">
  .editform {
    overflow-x: auto;
    /*width: 800px;*/
    table {
      width: 100%;
      min-width: 1200px;
    }
    th {
      height: 64px;
      line-height: 64px;
      font-size: 14px;
      font-family: "Microsoft YaHei";
      text-align: left;
      color: #909399;
      background-color: #e9f7f9;
      font-weight: 500;
      box-sizing: border-box;
      padding: 0 10px;
      border-top: 1px solid #e4e7ed;
      &:last-child {
        width: 155px;
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

  .lx_txt_red {
    color: #f00
  }

  .lx_link_input {
    input.el-input__inner {
      border-color: #f00;
    }
  }

  .lx_add_link {
    margin-top: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
    padding: 10px 0;
  }
</style>
<script type="text/ecmascript-6">
import BlockHeader from '@/components/BlockHeader'
import BlockBorder from '@/components/BlockBorder'
// import {IsURL} from '@/utils/index'
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
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    isOrg: {
      type: Boolean,
      default: false
    },
    isCancel: {
      type: Boolean,
      default: true
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
        qq: '',
        email: '',
        other: '',
        comment: '',
        edit: false
      },
      linkInfo: [],
      itemIndex: 0, // 临时存储编辑的id
      editFlag: false, // 判断是编辑还是添加
      disableFlag: true, // 禁止编辑
      formLinkFlag: true, // 显示编辑框
      formLinkAddBtn: true, // 显示添加按钮
      formDisableFlag: false, // 禁用
      // isIng: false, // 按钮是否禁用
      formTip: false, // 字符串太长
      formTip2: false, // 字符串太长
      formTip3: false, // 字符串太长
      tmpModle: {},
      itemTmp: {} // 用来保存临时编辑的内容
    }
  },
  created() {
    setTimeout(() => {
      if (this.disableLink && this.onlyRead) { // 传值且只读时获取输入框值，隐藏输入并且禁止修改,联系人列表
        // console.log()
        this._initData() // 加载获取的值
        this.formLinkFlag = false
        this.formDisableFlag = true
        this.isIng = true
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
    } else if (this.isAdd) {
      this.$watch('form', (newForm) => {
        this.$emit('schoolform', newForm)
      }, {deep: true})
    } else {
      return
    }
  },
  methods: {
    _initData() {
      // console.log(this.dataAddress)
      setTimeout(() => { // 添加延迟，解决数据组件间数据传递延迟问题
        this.form.address = this.dataAddress
        this.form.addresscn = this.dataAddressCn
        this.form.website = this.dataWebsite
        this.linkInfo = this.schoolInfoList
        this.tmpModle['a'] = this.dataAddress
        this.tmpModle['b'] = this.dataAddressCn
        this.tmpModle['c'] = this.dataWebsite
      }, 500)
    },
    // 添加
    addLinkFun() {
      if (
        this.addLink.username !== '' ||
        this.addLink.position !== '' ||
        this.addLink.tel !== '' ||
        this.addLink.wechat !== '' ||
        this.addLink.qq !== '' ||
        this.addLink.email !== '' ||
        this.addLink.other !== '' ||
        this.addLink.comment !== ''
      ) {
        this.linkInfo.push({
          username: this.addLink.username,
          position: this.addLink.position,
          tel: this.addLink.tel,
          wechat: this.addLink.wechat,
          qq: this.addLink.qq,
          email: this.addLink.email,
          other: this.addLink.other,
          comment: this.addLink.comment
          // edit: false
        })
        this._clear()
        this.formLinkFlag = false
        this.formLinkAddBtn = false
      } else {
        this.$message.error('联系人信息不能都为空哦！')
      }
      this.setSchoolInfoList(this.linkInfo)
    },
    delLinkInput() {
      if (
        this.addLink.username !== '' ||
        this.addLink.position !== '' ||
        this.addLink.tel !== '' ||
        this.addLink.wechat !== '' ||
        this.addLink.qq !== '' ||
        this.addLink.email !== '' ||
        this.addLink.other !== '' ||
        this.addLink.comment !== ''
      ) {
        this.$confirm('您正在编辑的数据未保存，您确定取消吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._clear()
          this.formLinkFlag = false
          this.formLinkAddBtn = false
        })
      } else {
        this._clear()
        this.formLinkFlag = false
        this.formLinkAddBtn = false
      }
    },
    addLinkForm() {
      this._clear()
      this.formLinkAddBtn = true
      this.formLinkFlag = true
    },
    // 删除
    delLinkFun(index) {
      this.$confirm('您确定要移除此联系人吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.linkInfo.splice(index, 1)
        this.setSchoolInfoList(this.linkInfo)
        this.$message({
          type: 'success',
          message: '移除成功!'
        })
      })
    },
    // 编辑
    editLinkFun(index, item) {
      this.itemIndex = index
      this.editFlag = true
      this._clear()
      this.formLinkFlag = false
      this.formLinkAddBtn = true
      item.edit = true
      this.itemTmp = JSON.parse(JSON.stringify(item))
      this.linkInfo.map((i) => {
        if (item === i) {
          this.addLink.username = i.username
          this.addLink.position = i.position
          this.addLink.tel = i.tel
          this.addLink.wechat = i.wechat
          this.addLink.qq = i.qq
          this.addLink.email = i.email
          this.addLink.other = i.other
          this.addLink.comment = i.comment
        }
      })
    },
    cancelEdit(item) {
      this.$confirm('您正在编辑的数据未保存，您确定取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.itemTmp.edit = false
        this.linkInfo.splice(this.itemIndex, 1, this.itemTmp)
        this.formLinkAddBtn = false
      })
    },
    updateLink() {
      this.$emit('emit-event')
    },
    cancel() {
      this.$emit('emit-cancel')
      this.form.address = this.tmpModle.a
      this.form.addresscn = this.tmpModle.b
      this.form.website = this.tmpModle.c
      this.linkInfo = this.schoolInfoList
    },
    // 保存编辑
    saveEditLink(item) {
      this.linkInfo.splice(this.itemIndex, 1, {
        username: item.username,
        position: item.position,
        tel: item.tel,
        wechat: item.wechat,
        qq: item.qq,
        email: item.email,
        other: item.other,
        comment: item.comment
      }) // 替换原数组中的内容
      this.setSchoolInfoList(this.linkInfo)
      this.formLinkAddBtn = false
    },
    // 清空表单
    _clear() {
      this.addLink.username = ''
      this.addLink.position = ''
      this.addLink.tel = ''
      this.addLink.wechat = ''
      this.addLink.qq = ''
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
    ]),
    isIng: {
      get() {
        if (this.formLinkAddBtn) {
          return true
        } else {
          return false
        }
      },
      set() {

      }
    },
    title() {
      if (this.isOrg === true) {
        return '机构联系方式'
      } else {
        return '院校联系方式'
      }
    },
    tip1() {
      if (this.form.address !== null && this.form.address !== '' && this.form.address !== undefined) {
        if (this.form.address.length > 200) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    tip2() {
      if (this.form.addresscn !== null && this.form.addresscn !== '' && this.form.addresscn !== undefined) {
        if (this.form.addresscn.length > 200) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    tip3() {
      if (this.form.website !== null && this.form.website !== '' && this.form.website !== undefined) {
        if (this.form.website.length > 200) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  watch: {},
  components: {
    BlockHeader,
    BlockBorder
  }
}
</script>
