<template>
  <el-form label-width="150px" class="lx_form_label_16">
    <el-row>
      <el-col>
        <el-form-item label="">
          <el-button type="primary" plain @click="addCommShow">+新增佣金模板</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <!--新增佣金模板开始-->
    <el-dialog
      :visible.sync="addCommDialog"
      center class="lx_dialog"
      width="1050px">
      <div class="lx_dialog_title" slot="title">
        <h2>新增佣金模板</h2>
      </div>
      <div class="lx_dialog_main">
        <el-form>
          <!--佣金模板和类型-->
          <comm-tmp :mouldsList="MouldsList" :comm-sel.sync="commsel" :comm-tmp.sync="commtmp"></comm-tmp>
        </el-form>
        <el-form label-width="100px" class="lx_form_tmp_dialog">
          <el-form-item label="适合院校">
            <el-checkbox border style="margin-bottom: 10px;" v-model="chkAll" @change="handleCheckAllChange">全选
            </el-checkbox>
            <el-checkbox-group v-model="checkListID" @change="handleChangeSchool">
              <el-checkbox v-for="(item,index) in allSchoolList" :label="item.colId" :key="index"
                           :disabled="item.disable"
                           :checked="item.checked"
                           border
                           class="lx_chk_comm_school">
                <span class="lx_chk_school_name" v-if="item.nameEn.length<125">{{item.nameEn}}</span>
                <span class="lx_chk_school_name" :title="item.nameEn" v-else>{{item.nameEn.substr(0, 125)}}</span>
                <span class="lx_chk_school_name" v-if="item.nameCn<125">{{item.nameCn}}</span>
                <span class="lx_chk_school_name" :title="item.nameCn" v-else>{{item.nameCn.substr(0, 125)}}</span>
              </el-checkbox>
            </el-checkbox-group>
            <!--<el-checkbox-group v-if="!isTemp" v-model="checkListID" @change="handleChangeSchool">-->
            <!--<el-checkbox v-for="item in allSchoolList" :label="item" :code="item" :checked="item.flag" :key="item.id"-->
            <!--:disabled="item.disable"-->
            <!--border-->
            <!--class="lx_chk_comm_school">-->
            <!--<span class="lx_chk_school_name">{{item.nameEn}}</span>-->
            <!--<span class="lx_chk_school_name">{{item.nameCn}}</span>-->
            <!--</el-checkbox>-->
            <!--</el-checkbox-group>-->
            <!--<el-checkbox-group v-else v-model="checkListID" @change="handleChangeSchool">-->
            <!--<el-checkbox v-for="item in allSchoolList" :label="item" :code="item" :checked="item.flag" :key="item.id"-->
            <!--border :disabled="item.disable"-->
            <!--class="lx_chk_comm_school">-->
            <!--<span class="lx_chk_school_name">{{item.nameEn}}</span>-->
            <!--<span class="lx_chk_school_name">{{item.nameCn}}</span>-->
            <!--</el-checkbox>-->
            <!--</el-checkbox-group>-->
          </el-form-item>
        </el-form>
        <!--标准模板开始-->
        <el-form v-if="commTmpFlag" :model="commForm" ref="tmpbase" label-width="110px" class="lx_form_tmp_dialog">
          <el-form-item label="按固定佣金" v-show="commFixationTmpFlag">
            <div class="lx_flex_broke lx_pdb_10" v-for="(item,index) in fixaList" :model="fixaList">
              <comm-category title="请选择留学类别" :isCountry="isFalse" @country="getCountry" @sendpost="getPost"
                             :isInBody="true"
                             :width="typeWidth"
                             :dataList="SchoolTypes"
                             :key="index"
                             :class='item.typeFlag ? {fixaTypeBorderColor : true} : ""'
                             :disableList="disableTypes"
                             :values.sync="item.type" :parentVal="parentVal(item.type)"
                             category-cla="lx_category"></comm-category>
              <el-input v-model="item.amount" placeholder="输入佣金金额(只能为数字)" maxlength="10" type="text"
                        :class='item.amountFlag ? {fixaAmoutBorderColor : true} : ""'
                        class="lx_flex_item lx_flex_2"></el-input>
              <el-select v-model="item.unit" placeholder="请选择" class="lx_flex_item lx_flex_1 lx_short_wd"
                         :class='item.unitFlag ? {fixaUnitBorderColor : true} : ""'>
                <el-option v-for="item in UnitList" :label="item.name" :value="item.code" :key="item.code"></el-option>
              </el-select>
              <span class="lx_flex_item lx_broke_span">/学生</span>
              <el-button v-if="!index>0" type="primary" plain size="mini" class="lx_btn_mini" @click="addFixa">+增加类别
              </el-button>
              <div v-if="index>=1">
                <el-button type="primary" plain size="mini" @click="moveRow(fixaList,index)">移除</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="按费用百分比" v-show="commPercentTmpFlag" :model="percentList">
            <div class="lx_flex_broke lx_pdb_10" v-for="(item,index) in percentList">
              <comm-category title="请选择留学类别" :isInBody="true" :width="typeWidth" :dataList="SchoolTypes"
                             :isCountry="isFalse" @country="getCountry" @sendpost="getPost"
                             :class='item.typeFlag ? {fixaTypeBorderColor : true} : ""'
                             :key="index" :values.sync="item.type" :parentVal="parentVal(item.type)"
                             category-cla="lx_category"></comm-category>
              <el-input v-model="item.chargeItem" placeholder="输入费用名称" class="lx_flex_item lx_flex_2"
                        :class='item.chargeItemFlag ? {fixaAmoutBorderColor : true} : ""'
                        maxlength="100"></el-input>
              <el-input v-model="item.percent" placeholder="费用占比(只能为数字)" maxlength="10" type="text"
                        :class='item.percentFlag ? {fixaAmoutBorderColor : true} : ""'
                        class="lx_flex_item lx_flex_1 lx_short_wd"></el-input>
              <span class="lx_flex_item lx_broke_span">%</span>
              <el-button v-if="!index>0" type="primary" plain size="mini" class="lx_btn_mini" @click="addPercent">+增加类别
              </el-button>
              <div v-if="index>=1">
                <el-button type="primary" plain size="mini" @click="moveRow(percentList,index)">移除</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="按人数梯度" v-show="commPersonTmpFlag" :model="gradList">
            <div class="lx_grads">
              <div class="lx_grads_header">
                <div class="lx_grads_nums">人数</div>
                <div class="lx_grads_charge">收取费用</div>
              </div>
              <div class="lx_grads_body">
                <div class="lx_grads_row" v-for="(item,index) in gradList">
                  <div class="lx_grads_nums">
                    <el-input size="small" class="lx_width_70" placeholder="请输入" :disabled="true"
                              v-model="item.minNum"></el-input>
                    &nbsp;&nbsp;≤&nbsp;&nbsp;
                    <el-input size="small" class="lx_width_70"
                              placeholder="请输入数字" type="text" v-model="item.maxNum" maxlength="10"
                              :class='item.maxNumFlag ? {fixaAmoutBorderColor : true} : ""'
                              @change="changeGradNum(item,index)" @blur="handleBlur(item,index)"></el-input>
                  </div>
                  <div class="lx_grads_charge">
                    <div class="lx_grads_item">
                      <el-select v-model="item.mouldDetailType" @change="changeRowType(item,index)" placeholder="请选择"
                                 size="small"
                                 class="lx_width_130">
                        <el-option v-for="m in CostList" :label="m.name" :value="m.code" :key="m.code"></el-option>
                      </el-select>
                    </div>
                    <div class="lx_grads_item">
                      <comm-category :dataList="SchoolTypes" :key="index" :values.sync="item.type" :width="typeWidth"
                                     :isInBody="true" :isCountry="isFalse" @country="getCountry" @sendpost="getPost"
                                     title="请选择留学类别" :parentVal="parentVal(item.type)"
                                     :class='item.typeFlag ? {fixaTypeBorderColor : true} : ""'
                                     button-size="small"></comm-category>
                    </div>
                    <div class="lx_grads_item">
                      <el-input v-if="item.mouldDetailType!==null&&item.mouldDetailType==='COST_PERCENT'"
                                maxlength="100"
                                :class='item.chargeItemFlag ? {fixaAmoutBorderColor : true} : ""'
                                v-model="item.chargeItem" placeholder="费用名称" class="lx_width_150"
                                size="small"></el-input>
                      <el-input v-else v-model="item.amount" placeholder="费用金额(只能为数字)" class="lx_width_110" type="text"
                                maxlength="10" :class='item.amountFlag ? {fixaAmoutBorderColor : true} : ""'
                                size="small"></el-input>
                    </div>
                    <div class="lx_grads_item">
                      <el-input v-if="item.mouldDetailType!==null&&item.mouldDetailType==='COST_PERCENT'"
                                v-model="item.percent" placeholder="费用占比" maxlength="10" type="text"
                                :class='item.percentFlag ? {fixaAmoutBorderColor : true} : ""' size="small"
                                class="lx_width_110"></el-input>
                      <el-select v-else v-model="item.unit" placeholder="请选择币种" size="small"
                                 :class='item.unitFlag ? {fixaUnitBorderColor : true} : ""' class="lx_width_150">
                        <el-option v-for="m in UnitList" :label="m.name" :value="m.code" :key="m.code"></el-option>
                      </el-select>
                    </div>
                    <div class="lx_grads_item">
                      <label v-if="item.mouldDetailType!==null&&item.mouldDetailType==='COST_PERCENT'">%</label>
                      <label v-else>学生</label>
                    </div>
                    <div v-if="index>=1&&index===gradList.length-1">
                      <el-button type="primary" plain size="mini" @click="moveRow(gradList,index)">移除</el-button>
                    </div>
                  </div>
                </div>
                <div class="lx_grads_add">
                  <el-button type="primary" plain size="mini" class="lx_grads_add_btn" @click="addGradRow">+&nbsp;增加梯度
                  </el-button>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="佣金内容" prop="memo">
            <el-input :autosize="{ minRows: 4, maxRows: 6}"
                      type="textarea"
                      maxlength="1000"
                      v-model="commForm.memo"
                      placeholder="文字描述佣金内容，可补充如预估金额\申请时间\发票要求\注意事项等">
            </el-input>
            <span>{{numlen}}/1000</span>
          </el-form-item>
          <el-form-item label="额外奖励">
            <el-input v-model="commForm.extraBonus"
                      :autosize="{ minRows: 4, maxRows: 6}"
                      type="textarea"
                      placeholder="输入额外奖励条款，此部分金额不支持自动计算" maxlength="500"></el-input>
            <span>{{extraBonusNum}}/500</span>
          </el-form-item>
          <el-form-item label="备注">
            <el-input :autosize="{ minRows: 4, maxRows: 6}"
                      type="textarea"
                      maxlength="500"
                      v-model="commForm.desc"
                      placeholder="备注内容">
            </el-input>
            <span>{{remarkLen}}/500</span>
          </el-form-item>
        </el-form>
        <!--标准模板结束-->
        <!--非标准模板开始-->
        <el-form v-else ref="tamcont" label-width="100px" class="lx_form_tmp_dialog">
          <el-form-item label="佣金内容" class="is-required">
            <el-input :autosize="{ minRows: 4, maxRows: 6}" :class='commForm.memoFlag ? {borderColor : true} : ""'
                      type="textarea"
                      maxlength="1000"
                      style="margin-right: 10px;"
                      v-model="commForm.memo"
                      placeholder="文字描述佣金内容，可补充如预估金额\申请时间\发票要求\注意事项等">
            </el-input>
            <span>{{numlen}}/1000</span>
          </el-form-item>
          <el-form-item label="备注">
            <el-input :autosize="{ minRows: 4, maxRows: 6}"
                      type="textarea"
                      maxlength="500"
                      v-model="commForm.desc"
                      placeholder="备注内容">
            </el-input>
            <span>{{remarkLen}}/500</span>
          </el-form-item>
        </el-form>
        <!--非标准模板结束-->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!isTemp" type="primary" round size="mini" @click="addCommTmp('add')">确 定</el-button>
        <el-button v-else type="primary" round size="mini" @click="addCommTmp('save')">确 定</el-button>
        <el-button @click="addCommDialog = false" round size="mini">取 消</el-button>
      </div>
    </el-dialog>
    <!--新增佣金模板结束-->
  </el-form>
</template>
<style lang="scss" rel="stylesheet/scss">
  .lx_category {
    margin-right: 10px;
  }

  .lx_grads_charge {
    display: flex;
    .lx_grads_item {
      margin-right: 10px;
    }
  }

  .borderColor textarea {
    border-color: #f56c6c;
  }

  .fileStyle button {
    border-color: #f56c6c;
  }

  .fixaTypeBorderColor > button {
    border-color: #f56c6c;
  }

  .fixaAmoutBorderColor > input {
    border-color: #f56c6c;
  }

  .fixaUnitBorderColor > div > input {
    border-color: #f56c6c;
  }

  .lx_width_130 {
    width: 130px;
  }
</style>
<script type="text/ecmascript-6">
import CommTmp from '@/views/components/comm/commTmpSel'
import { ChangeCommMixin, ParentValMixin } from '@/utils/mixin'
import CommCategory from '@/components/CommCategory/index'
import { mapGetters } from 'vuex'

export default {
  mixins: [ChangeCommMixin, ParentValMixin],
  props: {
    // 院校列表
    SchollList: {
      type: Array,
      default: []
    },
    // 剩余可选院校列表
    remainingSchollList: {
      type: Array,
      default() {
        return []
      }
    },
    // 佣金模板和类型
    MouldsList: {
      type: Array,
      default: []
    },
    // 院校类型
    SchoolTypes: {
      type: Array,
      default: []
    },
    // 币种
    UnitList: {
      type: Array,
      default: []
    },
    CostList: {
      type: Array,
      default: []
    },
    tempList: {
      type: Object,
      default() {
        return {
          colIdList: [],
          commDetailRequestList: [],
          extraBonus: '',
          memo: '',
          mouldType: '',
          type: ''
        }
      }
    },
    isTemp: {
      type: Boolean,
      default: false
    },
    TempSchoolList: {
      type: Array,
      default: []
    },
    disableSchoolList: {
      type: Array,
      /* eslint-disable */
      default: function () {
        return []
      }
    },
    isR: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      slit: [],
      typeWidth: 730, // 佣金类型弹出窗宽度
      addCommDialog: false, // 弹出窗显示
      // checkListID: this.TempSchoolList, // 选中的模板院校
      checkListID: [],
      chkAll: false,
      checkList: this.remainingSchollList,
      commForm: { // 佣金模板表单
        extraBonus: '', // 额外奖励
        memo: '', // 文本描述,
        desc: '' // 备注
      },
      commTmpFlag: true, // 模板控制
      fixaList: [{ // 添加固定佣金
        type: '请选择',
        amount: '',
        unit: ''
      }],
      percentList: [{ // 添加百分比佣金
        type: '请选择',
        chargeItem: '',
        percent: ''
      }],
      gradList: [{
        minNum: 1, // 最小值
        maxNum: '', // 最大值
        mouldDetailType: 'COST_PERCENT', // 佣金类别
        type: '请选择', // 类别
        chargeItem: '', // 费用名称
        percent: '',
        unit: '',
        amount: '',
        zanbiFlag: true
      }],
      isCountry: false,
      coopApplyCommList: [],
      isStandard: false,
      schoolList: this.SchoolList,
      allSchoolList: [], // 所有学校
      allSchoolTypes: this.SchoolTypes, // 所有院校类型
      disableTypes: [],
      isTrue: false,
      isVali: false
    }
  },
  mounted() {
    // if (this.isR) {
    //
    //   this.$nextTick(() => {
    //     if (this.SchollList.length) {
    //       this.SchollList.map(item => {
    //         item.disable = false
    //         this.allSchoolList = this.orgSchoolCommList
    //       })
    //       if (this.allSchoolList.length) {
    //         this.disableSchoolList.map(item => {
    //           this.allSchoolList.map(n => {
    //             if (item === n.id) {
    //               n['disable'] = true
    //             }
    //           })
    //         })
    //       }
    //     }
    //   })
    // }
  },
  methods: {
    // 新增佣金
    addCommShow() {
      if (this.SchollList.length <= 0) {
        this.$message.error('请先选择学校')
        return
      }
      this.$nextTick(() => {
        this.allSchoolList.length = 0
        this.commForm.extraBonus = ''
        this.commForm.memo = ''
        this.commForm.desc = ''
        this.fixaList = [{ // 添加固定佣金
          type: '请选择',
          amount: '',
          unit: ''
        }]
        this.percentList = [{
          type: '请选择',
          chargeItem: '',
          percent: ''
        }]
        this.gradList = [{
          minNum: 1, // 最小值
          maxNum: '', // 最大值
          mouldDetailType: 'COST_PERCENT', // 佣金类别
          type: '请选择', // 类别
          chargeItem: '', // 费用名称
          percent: '',
          unit: '',
          amount: '',
          zanbiFlag: true
        }]
        this.$emit('is-edit', false)
        this.$emit('is-temp')

        this.allSchoolList.length = 0
        if (this.SchollList.length) {
          this.SchollList.map(item => {
            this.allSchoolList.push(item)
          })
          this.allSchoolList = this.allSchoolList.sort(function (a, b) {
            return a.nameEn.toUpperCase() > b.nameEn.toUpperCase() ? 1 : -1;
          })
          // if (this.allSchoolList.length) {
          //   this.disableSchoolList.map(item => {

          // this.allSchoolList.map(n => {
          //   if (item === n.colId) {
          //     n.disable = true
          //   } else {
          //     n.disable = false
          //   }
          // })
          //   })
          // }
        }
      })
      // 点击时把状态设置为新增并派发出去
      this.addCommDialog = true
      this.getRemainingSchollList()
      this.checkListID = []
      this.chkAll = false
    },
    // 获取剩余可选数据
    getRemainingSchollList() {
      if (this.allSchoolList) {
        this.remainingSchollList = []
        this.checkList = []
        this.allSchoolList.map(n => {
          if (n.disable === undefined || n.disable === false) {
            this.remainingSchollList.push(n)
          }
        })
      }
      // let chkCount = this.checkListID
      // this.chkAll = chkCount === this.remainingSchollList.length

      // if (this.remainingSchollList.length > 0) {
      //   let i = 0
      //   this.remainingSchollList.map(n => {
      //     if (n.checked !== undefined && n.checked === false) {
      //       i++
      //     }
      //   })
      //   if (i > 0) {
      //     this.chkAll = true
      //   } else {
      //     this.chkAll = false
      //   }
      // }
    },
    // 格式发派发到父组件的院校内容
    _formatColID() {
      let arr = []
      const res = new Map()
      this.allSchoolList.forEach(item => {
        res.set(item.colId, item)
      })
      this.checkListID.map(item => {
        arr.push(res.get(item))
      })
      return arr
    },
    _requestList(params) {

      if (params === 'FIXED') { // 固定佣金模板验证
        this.isStandard = this.fixaList.every(item => {
          return (item.type !== '请选择' && item.unit !== '' && item.amount !== '')
        })
      } else if (params === 'COST_PERCENT') { // 百分比模板验证
        this.isStandard = this.percentList.every(item => {
          return (item.type !== '请选择' && item.chargeItem !== '' && item.percent !== '')
        })
      } else if (params === 'NUM_LADDER') { // 人数梯度模板验证
        let m = true
        let n = true
        this.gradList.every(item => {
          if (item.mouldDetailType === 'COST_PERCENT') {
            m = (item.type !== '请选择' && item.maxNum !== '' && item.chargeItem !== '' && item.percent !== '')
          } else if (item.mouldDetailType === 'FIXED') {
            n = (item.type !== '请选择' && item.maxNum !== '' && item.amount !== '' && item.unit === '')
          }
        })
        if (m && n) {
          this.isStandard = true
        }
      }
    },
    _fixedComm() {
      this.coopApplyCommList.push({
        colIdList: this._formatColID(), // 拷贝一份当前的学校ID
        extraBonus: this.commForm.extraBonus, // 额外奖励
        memo: this.commForm.memo, // 佣金描述
        mouldType: this.commsel, // 佣金类别
        desc: this.commForm.desc,
        commDetailRequestList: this.fixaList.slice(),
        type: this.commtmp // 标准模板和非标准模板
      })
      this.fixaList.length = 0
      this.fixaList.push({
        type: '请选择',
        amount: '',
        unit: ''
      })
    },
    _costComm() {
      this.coopApplyCommList.push({
        colIdList: this._formatColID(), // 拷贝一份当前的学校ID
        extraBonus: this.commForm.extraBonus, // 额外奖励
        memo: this.commForm.memo, // 佣金描述
        desc: this.commForm.desc,
        mouldType: this.commsel, // 佣金类别
        commDetailRequestList: this.percentList.slice(),
        type: this.commtmp // 标准模板和非标准模板
      })
      this.percentList.length = 0
      this.percentList.push({
        type: '请选择',
        chargeItem: '',
        percent: ''
      })
    },
    _ladderComm() {
      this.coopApplyCommList.push({
        colIdList: this._formatColID(), // 拷贝一份当前的学校ID
        extraBonus: this.commForm.extraBonus, // 额外奖励
        memo: this.commForm.memo, // 佣金描述
        desc: this.commForm.desc,
        mouldType: this.commsel, // 佣金类别
        commDetailRequestList: this._fromatGradList(),
        type: this.commtmp // 标准模板和非标准模板
      })
      this.gradList.length = 0
      this.gradList.push({
        minNum: 1, // 最小值
        maxNum: '', // 最大值
        mouldDetailType: 'COST_PERCENT', // 佣金类别
        type: '请选择', // 类别
        chargeItem: '', // 费用名称
        percent: '',
        unit: '',
        amount: '',
        zanbiFlag: true
      })
    },
    // 检查类型是否重复
    _formatTypesList(data) {

      let list = JSON.parse(JSON.stringify(data))
      let L = []
      list.map(item => {
        L.push(...item.type.split(','))
      })
      let N = L.sort()
      if (N.length > 1) {
        for (let i = 0; i < N.length; i++) {
          if (N[i] === N[i + 1]) {
            this.isVali = true
            return
          } else {
            this.isVali = false
          }
        }
      } else {
        this.isVali = false
      }
    },
    _valiTypes() {
      if (this.commtmp === 'STANDARD') {
        // 判断固定佣金
        if (this.commsel === 'FIXED') {
          this._formatTypesList(this.fixaList)
        } else if (this.commsel === 'COST_PERCENT') {

          this._formatTypesList(this.percentList)
        } else {
          this.isVali = false
          return
        }
      } else {
        this.isVali = false
        return
      }
    },
    // 添加模板
    addCommTmp(type) {
      // console.log('a')
      if (this.checkListID.length <= 0) {
        this.$message.error('请选择模板院校')
        return
      }
      let that = this
      if (this.commtmp === 'STANDARD') { // 判断标准模板
        // if (this.commsel === 'FIXED') { // 固定佣金
        //   this._requestList('FIXED')
        //   if (!this.isStandard) {
        //     this.$message.error('固定佣金模板不能为空')
        //     return
        //   }
        //   this._fixedComm()
        // } else if (this.commsel === 'COST_PERCENT') { // 百分比佣金
        //   this._requestList('COST_PERCENT')
        //   if (!this.isStandard) {
        //     this.$message.error('百分比佣金模板不能为空')
        //     return
        //   }
        //   this._costComm()
        // } else if (this.commsel === 'NUM_LADDER') { // 人数梯度佣金
        //   this._requestList('NUM_LADDER')
        //   if (!this.isStandard) {
        //     this.$message.error('人数梯度佣金模板不能为空')
        //     return
        //   }
        //   this._ladderComm()
        // } else {
        //   this.$message.error('模板错误')
        //   return
        // }
        switch (this.commsel) {
          case 'FIXED':
            let fixaListData = this.fixaList
            that.fixaList = []
            that.fixaList = fixaListData
            for (let fixa of fixaListData) {
              if (fixa.type === '请选择') {
                fixa.typeFlag = true
                this.$message.error('请选择留学类别！')
                return
              } else if (fixa.amount === '' || fixa.amount === null) {
                fixa.amountFlag = true
                this.$message.error('请输入佣金金额！')// window.location.hash  = "#commTmp"
                return
              } else if (!fixa.amount.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                fixa.amountFlag = true
                this.$message.error('佣金金额只能填数字！')
                return
              } else if (fixa.unit === '' || fixa.unit === null) {
                fixa.unitFlag = true
                this.$message.error('请选择佣金的货币种类!')
                return
              }
            }
            this._fixedComm()
            break
          case 'COST_PERCENT':
            let percentListData = this.percentList
            that.percentList = []
            that.percentList = percentListData
            for (let percent of percentListData) {
              if (percent.type === '请选择') {
                percent.typeFlag = true
                this.$message.error('请选择留学类别！')
                return
              } else if (percent.chargeItem === '' || percent.chargeItem === null) {
                percent.chargeItemFlag = true
                this.$message.error('请输入费用名称!')
                return
              } else if (percent.percent === '' || percent.percent === null) {
                percent.percentFlag = true
                this.$message.error('请输入费用占比！')
                return
              } else if (!percent.percent.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                percent.percentFlag = true
                this.$message.error('费用占比只能填数字！')
                return
              }
            }
            this._costComm()
            break
          default:
            let gradListData = this.gradList
            that.gradList = []
            that.gradList = gradListData
            this.isVali = false
            for (const grad of gradListData) {
              if (grad.maxNum !== '' && grad.maxNum !== null && !grad.maxNum.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                grad.maxNumFlag = true
                this.$message.error('人数最大值只能填数字！')
                return
              } else if ((grad.maxNum !== '' && grad.maxNum !== null) && grad.maxNum < grad.minNum) {
                grad.maxNumFlag = true
                this.$message.error('人数最大值不能小于最小值！')
                return
              } else if (grad.type === '请选择') {
                grad.typeFlag = true
                this.$message.error('请选择留学类别！')
                return
              } else if (grad.mouldDetailType === 'COST_PERCENT') { // 按费用百分比
                if (grad.chargeItem === '' || grad.chargeItem === null) {
                  grad.chargeItemFlag = true
                  this.$message.error('请输入费用名称!')
                  return
                } else if (grad.percent === '' || grad.percent === null) {
                  grad.percentFlag = true
                  this.$message.error('请输入费用占比！')
                  return
                } else if (!grad.percent.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                  grad.percentFlag = true
                  this.$message.error('费用占比只能为数字！')
                  return
                }
              } else if (grad.mouldDetailType === 'FIXED') { // 按固定佣金
                if (grad.amount === null || grad.amount === '') {
                  grad.amountFlag = true
                  this.$message.error('请输入金额！')
                  return
                } else if (!grad.amount.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
                  grad.amountFlag = true
                  this.$message.error('金额只能填数字!')
                  return
                } else if (grad.unit === null || grad.unit === '') {
                  grad.unitFlag = true
                  this.$message.error('请选择佣金的货币种类!')
                  return
                }
              }
            }
            this._ladderComm()
        }
        this.isStandard = true
        this._valiTypes()
        if (this.isVali) {
          this.$message.error('院校类别重复，请重新选择')
          return
        }
      } else { // 非标准模板
        let memo = that.commForm.memo
        that.commForm.memo = null
        that.commForm.memo = memo
        if (!this.commTmpFlag && (this.commForm.memo === undefined || this.commForm.memo.trim().length === 0)) {
          this.$message.error('请填写"佣金内容"！');
          that.commForm.memoFlag = true
          return
        }
        this.coopApplyCommList.push({
          memo: this.commForm.memo, // 非标准佣金描述
          colIdList: this._formatColID(), // 拷贝一份当前的学校ID
          type: this.commtmp, // 标准模板和非标准模板
          desc: this.commForm.desc
        })
      }
      if (!this.isStandard && this.commtmp === 'STANDARD') {
        return
      } else {
        if (type === 'save') {
          // console.log('模板页回传：' + this.coopApplyCommList.slice())
          let N = JSON.parse(JSON.stringify(this.coopApplyCommList))
          this.$emit('comm-save', N)
        } else if (type === 'add') {
          // const res=new Map()
          // this.coopApplyCommList.map(item=>{
          //   res.set(item.colId,1)
          // })
          // this.allSchoolList.forEach(n=>{
          //
          // })
          let A = []
          this.coopApplyCommList.forEach(item => {
            if (item.disable !== true) {
              A.push(item)
            }
          })
          // this.$emit('comm-list', this.coopApplyCommList.slice())
          this.$emit('comm-list', A)
        }
        this.checkListID = [] // 清空数组，防止影响下一次添加
        this.commForm.memo = '' // 清空描述
        this.commForm.extraBonus = '' // 清空额外奖励
        this.commForm.desc = '' // 清空备注
        this.coopApplyCommList = []
        this.addCommDialog = false
      }
    },
    // 过滤梯度无用字段
    _fromatGradList() {
      let list = this.gradList.slice()
      let l = []
      list.map((item) => {
        l.push({
          minNum: item.minNum,
          maxNum: item.maxNum,
          mouldDetailType: item.mouldDetailType, // 佣金类别
          type: item.type, // 类别
          chargeItem: item.chargeItem, // 费用名称
          percent: item.percent,
          amount: item.amount,
          unit: item.unit
        })
      })
      return l
    },
    // 监控是否选中合适院校,否则不能选择院校类型
    getCountry(data) {
      if (this.checkListID.length <= 0) {
        this.$message.error('请先选择院校!')
        return
      }
    },
    // 派发选择院校的国家ID
    getPost() {
      let arr = []
      let res = new Map()
      this.allSchoolList.forEach(item => {
        res.set(item.colId, item.countryCode)
      })

      this.checkListID.map((item) => {
        arr.push(res.get(item))
      })
      this.$emit('code', arr)
      this.$nextTick(() => {
      })
    },
    // 增加固定佣金行
    addFixa() {
      let len = this.fixaList.length
      let prevItem = this.fixaList[len - 1]
      if (prevItem.amount === '' ||
        prevItem.amount === undefined ||
        prevItem.type === '请选择'
      ) {
        this.$message.error('请先填写内容')
        return
      }

      // this.schoolTypes
      if (this.fixaList.length) {
        this.disableTypes.length = 0
        this.fixaList.map(item => {
          this.disableTypes.push(item.type)
        })
      }
      this.fixaList.push({
        type: '请选择',
        amount: '',
        unit: ''
      })
    },
    // 增加百分比佣金
    addPercent() {
      let len = this.percentList.length
      let prevItem = this.percentList[len - 1]
      if (prevItem.chargeItem === '' ||
        prevItem.chargeItem === undefined ||
        prevItem.type === '请选择'
      ) {
        this.$message.error('请先填写内容')
        return
      }
      this.percentList.push({
        type: '请选择',
        chargeItem: '',
        percent: ''
      })
    },
    // 切换梯度人数
    changeGradNum(item, index) {
      if (this.gradList[(index + 1)] !== undefined){
        let nums1 = item.maxNum
        this.gradList[(index + 1)].minNum = parseInt(nums1) + 1
      }
    },
    // 切换梯度行类别
    changeRowType(item, index) {
      if (item.mouldDetailType === 'FIXED') {
        this.$nextTick(() => {
          this.gradList[index].zanbiFlag = false
        })
      } else {
        this.$nextTick(() => {
          this.gradList[index].zanbiFlag = true
        })
      }
    },
    // 增加梯度行
    addGradRow() {
      let len = this.gradList.length
      let prevItem = this.gradList[len - 1]
      // console.log(len)
      if (prevItem.maxNum === '' ||
        prevItem.maxNum === undefined ||
        prevItem.type === '请选择'
      ) {
        // console.log(len)
        this.$message.error('请先填写内容')
        return
      }
      this.gradList.push({
        minNum: parseInt(prevItem.maxNum) + 1,
        maxNum: '',
        mouldDetailType: 'FIXED', // 佣金类别
        type: '请选择', // 类别
        chargeItem: '', // 费用名称
        percent: '',
        amount: null,
        unit: null,
        zanbiFlag: false
      })
    },
    // 移除梯度行
    moveRow(type, index) {
      type.splice(index, 1)
    },
    // 防止梯度输入数字错误
    handleBlur(item) {
      // console.log(item.minNum)
      if (item.maxNum <= item.minNum) {
        this.$message.error('输入错误')
        item.maxNum = ''
      }
    },
    handleChangeSchool(value) {
      this.fixaList.map(item => {
        item.type = '请选择'
      })
      this.percentList.map(item => {
        item.type = '请选择'
      })
      this.gradList.map(item => {
        item.type = '请选择'
      })
      this.getRemainingSchollList()
      let chkCount = value.length
      this.chkAll = chkCount === this.remainingSchollList.length
    },
    // 全选
    handleCheckAllChange(val) {
      // this.checkList = val ? this.remainingSchollList : []
      this.getRemainingSchollList()
      if (val) {
        if (this.allSchoolList.length) {
          this.remainingSchollList.map(item => {
            this.allSchoolList.map(n => {
              if (item.colId === n.colId) {
                n['checked'] = true
              }
            })
          })
        }
      } else {
        this.remainingSchollList = []
      }
      this.checkListID = []
      this.remainingSchollList.map(n => {
        this.checkListID.push(n.colId)
      })
    },
    // 编辑模板方法
    changeCoopComm() {

      this.$nextTick(() => {

        var tempList = {};
        tempList = JSON.parse(JSON.stringify(this.tempList)); //this.templateData是父组件传递的对象
        this.commtmp = tempList.type
        this.commsel = tempList.mouldType === null ? "FIXED" : this.tempList.mouldType
        this.commForm.extraBonus = tempList.extraBonus
        this.commForm.memo = tempList.memo
        this.commForm.desc = tempList.desc
        if (tempList.type === 'STANDARD') {
          if (tempList.mouldType === 'FIXED') {
            this.fixaList = (tempList.commDetailRequestList)
          } else if (tempList.mouldType === 'COST_PERCENT') {
            this.percentList = (tempList.commDetailRequestList)
          } else if (tempList.mouldType === 'NUM_LADDER') {
            this.gradList = (tempList.commDetailRequestList)
          }
        }
        this.checkListID = [] // 清空选择院校的值
        this.TempSchoolList.map(n => {

          this.checkListID.push(n.colId) // 对编辑模板选中的院校重新赋值，是 v-for 重新渲染
        })

        if (this.isTemp) {
          if (this.checkListID.length && this.disableSchoolList) {
            this.allSchoolList = [...this.orgSchoolCommList]

            this.allSchoolList = this.allSchoolList.sort(function (a, b) {
              return a.nameEn.toUpperCase() > b.nameEn.toUpperCase() ? 1 : -1;
            })
            // this.allSchoolList.map(item => {
            //   this.checkListID.map(n => {
            //     if (item.colId === n.colId) {
            //       item['disable'] = false
            //     }
            //   })
            // })
          }
        }
        this.addCommDialog = true
        this.getRemainingSchollList()
        this.chkAll = false
      })
    }
  },
  computed: {
    // 向院校类型组件传递是否选中院校
    isFalse() {
      if (this.checkListID) {
        let len = this.checkListID.length
        if (len <= 0) {
          return false
        } else {
          return true
        }
      }
    },
    numlen() {
      if (this.commForm.memo) {
        return this.commForm.memo.length
      } else {
        return 0
      }
    },
    extraBonusNum() {
      if (this.commForm.extraBonus) {
        return this.commForm.extraBonus.length
      } else {
        return 0
      }
    },
    remarkLen() {
      if (this.commForm.desc) {
        return this.commForm.desc.length
      } else {
        return 0
      }
    },
    ...mapGetters([
      'orgSchoolCommList'
    ])
  },
  watch: {
    // SchollList: {
    //   handler(newVal, oldVal) {
    // console.log(`new:${newVal}`)
    // this.schoolList = newVal
    //   },
    //   deep: true
    // },
    disableSchoolList: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (this.isR === true) {
            // this.$nextTick(()=>{
            this.$nextTick(() => {
              if (this.SchollList.length) {
                this.allSchoolList.length = 0
                this.SchollList.map(item => {
                  item.disable = false
                  item.checked = false
                  this.allSchoolList.push(item)
                })
                if (this.allSchoolList.length) {
                  this.disableSchoolList.map(item => {
                    this.allSchoolList.map(n => {
                      if (item === n.id) {
                        n['disable'] = true
                      }
                    })
                  })
                }
              }
            })
            // })
          }
        }
      }, deep: true
    },
    // 按固定佣金
    fixaList: {
      handler(newVal, oldVal) {
        if (newVal) {
          let that = this
          newVal.map(i => {
            if (i.type && i.type !== '请选择' && i.typeFlag) {
              delete i.typeFlag
            }

            if (i.amount && i.amount !== '' && i.amountFlag && i.amount.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
              delete i.amountFlag
            }

            if (i.unit && i.unitFlag) {
              delete i.unitFlag
            }

          })
        }
      },
      deep: true
    },
    // 按照费用百分比
    percentList: {
      handler(newVal, oldVal) {
        if (newVal) {
          let that = this
          newVal.map(i => {
            if (i.type && i.type !== '请选择' && i.typeFlag) {
              delete i.typeFlag
            }

            if (i.percent && i.percent !== '' && i.percentFlag && i.percent.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
              delete i.percentFlag
            }

            if (i.chargeItem && i.chargeItemFlag) {
              delete i.chargeItemFlag
            }

          })
        }
      },
      deep: true
    },
    // 按照人数梯度
    gradList: {
      handler(newVal, oldVal) {
        if (newVal) {
          let that = this
          newVal.map(i => {
            if (i.type && i.type !== '请选择' && i.typeFlag) {
              delete i.typeFlag
            }

            if (i.maxNum && i.maxNum !== '' && i.maxNumFlag && i.maxNum.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
              delete i.maxNumFlag
            }

            if (i.chargeItem && i.chargeItemFlag) {
              delete i.chargeItemFlag
            }
            if (i.percent && i.percent !== '' && i.percentFlag && i.percent.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
              delete i.percentFlag
            }
            if (i.unit && i.unitFlag) {
              delete i.unitFlag
            }
            if (i.amount && i.amount !== '' && i.amountFlag && i.amount.toString().match('^[0-9]+([.]{1}[0-9]+){0,1}$')) {
              delete i.amountFlag
            }

          })
        }
      },
      deep: true
    },
    // 佣金内容
    commForm: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (newVal.memo && newVal.memoFlag) {
            delete newVal.memoFlag
          }
        }
      },
      deep: true
    }
  },
  components: {
    CommTmp,
    CommCategory
  }
}
</script>
