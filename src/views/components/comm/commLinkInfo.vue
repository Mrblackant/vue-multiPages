<template>
  <el-row class="commClass">
    <el-col :span="7">
      <el-form :model="form" ref="commInfo" :rules="rules">
        <el-form-item label="佣金支付方式" prop="commpayType">
          <el-select v-model="form.commpayType" placeholder="请选择佣金支付方式" class="width100">
            <el-option v-for="item in payList" :label="item.name" :value="item.code"
                       :key="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>
    <el-form :model="form.commContacts" ref="commContactsInfo" :rules="commRules">
      <el-col :span="7">
        <el-form-item label="佣金联系人">
          <el-input v-model="form.commContacts.username" placeholder="请输入佣金联系人" maxlength="100"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="佣金联系职务">
          <el-input v-model="form.commContacts.position" placeholder="请输入" maxlength="150"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="佣金联系电话">
          <el-input v-model="form.commContacts.tel" placeholder="请输入" maxlength="40"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="佣金联系传真">
          <el-input v-model="form.commContacts.fax" placeholder="请输入" maxlength="40"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="佣金联系邮箱" prop="email">
          <el-input v-model="form.commContacts.email" placeholder="请输入" maxlength="100"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="14" class="address">
        <el-form-item label="佣金联系人地址">
          <el-input v-model="form.commContacts.address" placeholder="请输入" maxlength="250"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
</template>
<style lang="scss" rel="stylesheet/scss">
  .commClass [class*=el-col-] {
    margin-left: 16px;
  }

  .commClass .el-form-item__content {
    padding-left: 124px;
  }

  .address {
    width: 89.3%
  }

  .commClass .el-form-item__error {
    margin-left: 135px;
  }
</style>
<script type="text/ecmascript-6">
import {debounce} from '@/utils/index'

export default {
  name: 'commlink',
  props: {
    payList: {
      type: Array,
      default: []
    },
    commLink: {
      type: Object,
      default() {
        return {
          commpayType: null,
          username: null,
          position: null,
          tel: null,
          fax: null,
          email: null,
          address: null
        }
      }
    }
  },
  created() {
    this.$watch('form', debounce((newForm) => {
      this.$emit('commform', newForm)
    }, 1000), {
      deep: true
    })
  },
  data() {
    return {
      form: {
        commpayType: null, // 佣金支付方式
        commContacts: {
          username: null, // 佣金联系人
          position: null, // 佣金联系职务
          tel: null, // 佣金联系电话
          fax: null, // 佣金联系传真
          email: null, // 佣金联系邮箱
          address: null // 佣金联系地址
        }
      },
      rules: {
        commpayType: [
          {required: true, message: '佣金支付方式不能为空', trigger: ['blur', 'change']}
        ]
      },
      commRules: {
        email: [
          {required: true, message: '佣金联系邮箱不能为空', trigger: ['blur', 'change']}
        ]
      }
    }
  },
  methods: {
    validForm() {
      let flag = false
      let commFlag = false
      this.$refs['commInfo'].validate((valid) => {
        flag = valid
      })
      this.$refs['commContactsInfo'].validate((valid) => {
        commFlag = valid
      })
      if (flag && commFlag) {
        return flag
      } else {
        return false
      }
    }
  },
  watch: {
    commLink: {
      handler(newVal, oldVal) {
        // console.log(newVal)
        this.form.commpayType = newVal.commpayType
        this.form.commContacts.username = newVal.username
        this.form.commContacts.position = newVal.position
        this.form.commContacts.tel = newVal.tel
        this.form.commContacts.fax = newVal.fax
        this.form.commContacts.email = newVal.email
        this.form.commContacts.address = newVal.address
      }, deep: true
    }
  }
}
</script>
