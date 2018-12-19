import {getCountry, getBtnManage} from '@/api/dict.js'
import {ERR_OK} from '@/utils/status.js'
import {parseTime} from '@/utils/index'
import global_ from '@/Global'
import {delAttachment} from '@/api/files'
import {getPersonByRole} from '@/api/org'
import {searchName} from '@/api/schoolManage'
import {getOrgList} from '@/api/coopManage'
import {mapGetters, mapMutations} from 'vuex'
import {addProject} from '@/api/coopManage'

export const CountryMixin = {
  data() {
    return {
      countrylist: [],
      countryData: [],
      more: null,
      initCountryParam: true,
      form: {
        contryName: this.inputVal
      },
      countryCodes: []
    }
  },
  created() {
    setTimeout(() => {
      if (this.initCountryParam) {
        this._initCountry(this.countryCodes)
      }
    }, 200)
  },
  methods: {
    // 获取国家
    _initCountry(params) {
      getCountry({countryCodes: params, isAuth: true}).then((res) => {
        if (res.status === ERR_OK) {
          this.countryData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 监听子组件的值
    getSelCountry(data) {
      // console.log(data.data)
      this.countrylist = data.data
      this.more = data.more
    },
    // 国家回传值进行处理
    _formatCountry() {
      let l = []
      this.countrylist.map((item) => {
        l.push({
          code: item.code,
          nameCn: item.nameCn
        })
      })
      return l
    }
  },
  computed: {
    // 选中国家值绑定
    inputVal() {
      let data = []
      if (this.countrylist.length > 0 && this._formatCountry().length === 0) {
        this.countrylist.map((item) => {
          data.push(item.nameCn)
        })
        this.form.contryName = data
        return data.join(',')
      }
      if (this._formatCountry().length === 0) {
        return
      } else {
        this._formatCountry().map((item) => {
          data.push(item.nameCn)
        })
        this.form.contryName = data
        return data.join(',')
      }
    },
    // 提交数据时国家的code值
    sendCountry() {
      if (this.more === true) {
        let n = []
        this.countrylist.map((item) => {
          n.push({countryCode: item.code, nameCn: item.nameCn})
        })
        return n
      } else {
        let l = null
        this.countrylist.map((item) => {
          l = item.code
        })
        return l
      }
    }
  }
}
export const DateTime = {
  methods: {
    _forMatterTime(time, formatter) {
      if (time === null || time === 'undefined' || time === undefined || time === null || time === 'null') {
        // console.log(time)
        return null
      } else {

        let datetime = parseTime(time, formatter)
        return datetime
      }
    }
  }
}

export const EditFormValit = {
  data() {
    return {
      pjf: false,
      rules: {
        projName: [
          {required: true, message: '项目名称不能为空', trigger: 'blur'}
        ],
        startdate: [
          {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
        ],
        enddate: [
          {type: 'date', required: true, message: '请选择日期', trigger: ['change', 'blur']}
        ],
        hocRequest: [
          {required: true, message: '申请要求不能为空', trigger: ['change', 'blur']}
        ]
      }
    }
  },
  methods: {
    _vali() {
      const projform = this.$refs.projform // 特别要求
      projform.validate((v) => { // 特别要求
        if (v) {
          this.pjf = true
        } else {
          this.pjf = false
        }
      })
      return this.pjf
    }
  }
}

export const FormEditValit = {
  data() {
    return {
      pjf: false,
      lef: false,
      tmpf: false,
      tcf: false,
      rules: {
        projName: [
          {required: true, message: '项目名称不能为空', trigger: 'blur'}
        ],
        startdate: [
          {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
        ],
        enddate: [
          {type: 'date', required: true, message: '请选择日期', trigger: ['change', 'blur']}
        ],
        hocRequest: [
          {required: true, message: '申请要求不能为空', trigger: ['change', 'blur']}
        ],
        memo: [
          {required: true, message: '佣金内容不能为空', trigger: 'blur'}
        ],
        level: [
          {required: true, message: '合作等级不能为空', trigger: ['change', 'blur']}
        ]
      }
    }
  },
  methods: {
    _vali() {
      const projform = this.$refs.projform // 特别要求
      // const levelForm = this.$refs.levelForm // 合作等级
      const tmpbase = this.$refs.tmpbase // 标准模板
      const tamcont = this.$refs.tamcont // 非标准模板
      projform.validate((v) => { // 特别要求
        if (v) {
          this.pjf = true
        } else {
          this.pjf = false
        }
      })
      return this.pjf
      // levelForm.validate((v2) => { // 合作等级
      //     if (v2) {
      //         this.lef = true
      //     } else {
      //         this.lef = false
      //     }
      // })
      // if (this.form.commtmp === 'STANDARD') { // 标准模板
      //     tmpbase.validate((v3) => {
      //         if (v3) {
      //             this.tmpf = true
      //         } else {
      //             this.tmpf = false
      //         }
      //     })
      //     if (this.pjf && this.lef && this.tmpf) {
      //         return true
      //     } else {
      //         return false
      //     }
      // } else if (this.form.commtmp === undefined) {
      //     if (this.pjf && this.lef) {
      //         return true
      //     } else {
      //         return false
      //     }
      // } else {
      //     tamcont.validate((v4) => {
      //         if (v4) {
      //             this.tcf = true
      //         } else {
      //             this.tcf = false
      //         }
      //     })
      //     if (this.pjf && this.lef && this.tcf) {
      //         return true
      //     } else {
      //         return false
      //     }
      // }
    }
  }
}


export const ProjectFormValit = {
  data() {
    return {
      rules: {
        hocRequest: [
          {required: true, message: '申请特别要求不能为空', trigger: ['change', 'blur']}
        ]
      }
    }
  }
}

export const comInfoValit = {
  data() {
    return {
      rules: {
        email: [
          {required: true, message: '佣金联系邮箱不能为空', trigger: ['change', 'blur']}
        ]
      }
    }
  }
}

export const FormValit = {
  data() {
    return {
      pjf: false,
      lef: false,
      tmpf: false,
      tcf: false,
      rules: {
        projName: [
          {required: true, message: '项目名称不能为空', trigger: 'blur'}
        ],
        startdate: [
          {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
        ],
        enddate: [
          {required: true, message: '请选择日期', trigger: ['change', 'blur']}
        ],
        hocRequest: [
          {required: true, message: '申请要求不能为空', trigger: ['change', 'blur']}
        ],
        memo: [
          {required: true, message: '佣金内容不能为空', trigger: 'blur'}
        ],
        level: [
          {required: true, message: '合作等级不能为空', trigger: ['change', 'blur']}
        ],
        pastyearInfo: [
          {required: true, message: '送生情况不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    _vali() {
      const projform = this.$refs.projform // 特别要求
      const levelForm = this.$refs.levelForm // 合作等级
      const tmpbase = this.$refs.tmpbase // 标准模板
      const tamcont = this.$refs.tamcont // 非标准模板
      projform.validate((v) => { // 特别要求
        if (v) {
          this.pjf = true
        } else {
          this.pjf = false
        }
      })
      if (levelForm !== undefined) {
        levelForm.validate((v2) => { // 合作等级
          if (v2) {
            this.lef = true
          } else {
            this.lef = false
          }
        })
      } else {
        this.lef = true
      }
      if (this.form.commtmp === 'STANDARD') { // 标准模板
        tmpbase.validate((v3) => {
          if (v3) {
            this.tmpf = true
          } else {
            this.tmpf = false
          }
        })
        if (this.pjf && this.lef && this.tmpf) {
          return true
        } else {
          return false
        }
      } else if (this.form.commtmp === undefined) {
        if (this.pjf && this.lef) {
          return true
        } else {
          return false
        }
      } else {
        tamcont.validate((v4) => {
          if (v4) {
            this.tcf = true
          } else {
            this.tcf = false
          }
        })
        if (this.pjf && this.lef && this.tcf) {
          return true
        } else {
          return false
        }
      }
    }
  }
}

export const ValitSchool = {
  data() {
    return {
      rules: {
        nameCn: [
          {required: true, message: '院校名称不能为空', trigger: 'blur'}
        ],
        nameEn: [
          {required: true, message: '院校名称不能为空', trigger: 'blur'}
        ],
        colPropertieSel: [
          {required: true, message: '院校性质不能为空', trigger: 'change'}
        ],
        schoolTypeChk: [
          {type: 'array', required: true, message: '请至少选择一个院校类型', trigger: 'change'}
        ],
        selectType: [
          {required: true, message: '请至少选择一个院校类型', trigger: 'change'}
        ],
        contryName: [
          {required: true, message: '国家不能为空', trigger: 'change'}
        ],
        reason: [
          {required: true, message: '原因不能为空', trigger: 'blur'}
        ],
        selectTime: [
          {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
        ]
      }
    }
  }
}
export const ValitOrg = {
  data() {
    return {
      rules: {
        nameCn: [
          {required: true, message: '院校名称不能为空', trigger: 'blur'}
        ],
        nameEn: [
          {required: true, message: '院校名称不能为空', trigger: 'blur'}
        ],
        contryName: [
          {type: 'array', required: true, message: '国家不能为空', trigger: ['blur', 'change']}
        ]
      }
    }
  }
}

export const FileMixin = {
  data() {
    return {
      fileList: [], // 附件列表
      fileID: [],
      attaUrl: global_.ADDATTACHURL,
      flag: false
    }
  },
  methods: {
    handleRemove(file, fileList) { // 文件删除
      // console.log(file, fileList)
      this.$message.success(`${file.name}删除成功`)
    },
    handlePreview(file) { // 文件预览
      // console.log(file)
    },
    handleExceed(files, fileList) { // 文件选择限制
      this.$message.error(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) { // 文件删除之前
      // let mm = false
      let k = this.$confirm((`确定删除 ${file.name}？次操作不可恢复！`), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let fileId = null
            if (file.hasOwnProperty('response')) {
              fileId = file.response.data.id
            } else {
              fileId = file.id
            }
            delAttachment({
              id: fileId,
              bizType: 'COLLEGE'
            }).then((res) => {
              if (res.status === ERR_OK) {
                this.fileList.map((item) => {
                  if (item.id === fileId) {
                    this.fileList.splice(item, 1)
                  }
                })
                this.flag = true
                // mm = true
              } else {
                // mm = false
                this.flag = false
              }
            })
            done()
          } else {
            done()
          }
        }
      })
      return k
      // if (mm) {
      //   return k
      // } else {
      //   return false
      // }
    },
    _delatt(file) {
      let fileId = null
      if (file.hasOwnProperty('response')) {
        fileId = file.response.data.id
      } else {
        fileId = file.id
      }
      delAttachment({
        id: fileId,
        bizType: 'COLLEGE'
      }).then((res) => {
        if (res.status === ERR_OK) {
          this.fileList.map((item) => {
            if (item.id === fileId) {
              this.fileList.splice(item, 1)
            }
          })
          this.flag = true
          this.$message.success('成功')
        } else {
          this.flag = false
        }
      }).then(() => {
        return this.flag
      })
    },
    handleError(error, file, fileList) { // 上传错误
      this.$message.error(error)
    },
    handleSuccess(response, file, fileList) { // 上传成功
      if (response.status === ERR_OK) {
        this.fileID.push({
          id: response.data.id
        })
        this.fileList = fileList
        this.$message.success('文件上传成功')
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

export const RoleMixin = {
  data() {
    return {
      roleSelList: [],
      roleData: [],
      roleMore: null
    }
  },
  mounted() {
    setTimeout(() => {
      this.getRole()
    }, 17)
  },
  methods: {
    getRole() {
      getPersonByRole({}).then((res) => {
        if (res.status === ERR_OK) {
          res.data.list.map(item => {
            this.roleData.push({
              code: item.id,
              nameCn: item.username
            })
          })
        }
      })
    },
    getSelRole(data) {
      this.roleSelList = data.data
      this.roleMore = data.more
    }
  },
  computed: {
    roleVal() {
      let data = []
      if (this.roleSelList.length > 0) {
        this.roleSelList.map(item => {
          data.push(item.nameCn)
        })
        return data.join(',')
      }
    },
    sendRole() {
      let l = null
      this.roleSelList.map(item => {
        l = item.code
      })
      return l
    }
  }
}

export const SchoolNameAutoMixin = {
  data() {
    return {
      selectSchoolID: null, // 查询院校ID
      restaurants: []
    }
  },
  methods: {
    querySearch(queryString, cb) {
      let restaurants = null
      console.log(queryString)
      this.selectSchoolID = null
      searchName({
        name: queryString,
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        if (res.status === ERR_OK) {
          this.restaurants = res.data.list
          console.log(res.data.list)
          restaurants = this.restaurants.map((item) => {
            return {value: item.nameCn, code: item.id, nameEn: item.nameEn}
          })
        }
      }).then(() => {
        let results = restaurants.slice()
        cb(results)
      })
    },
    handleSelect(item) {
      // console.log(item)
      this.selectSchoolID = item.code
    }
  }
}

export const OrgNameAtuoMixin = {
  data() {
    return {
      selectOrgID: null
    }
  },
  methods: {
    // 机构名字自动补全
    querySearchOrg(queryString, cb) {
      let restaurants = null
      this.selectOrgID = null
      getOrgList({
        pageNum: 1,
        pageSize: 10,
        nameCn: queryString
      }).then(res => {
        if (res.status === ERR_OK) {
          restaurants = res.data.list.map(item => {
            return {
              value: item.nameCn, code: item.id, nameEn: item.nameEn
            }
          })
        }
      }).then(() => {
        let results = restaurants.slice()
        cb(results)
      })
    },
    handleSelectOrg(item) {
      this.selectOrgID = item.code
    }
  }
}

// 切换佣金模板
export const ChangeCommMixin = {
  data() {
    return {
      commtmp: 'STANDARD', // 佣金模板标准或非标准。1：标准模板，2：非标准模板,
      commsel: 'FIXED', // 佣金模板选择
      commTmpFlag: null, // 默认显示标准模板
      commPersonTmpFlag: false, // 人数梯度模板
      commFixationTmpFlag: false, // 固定佣金模板
      commPercentTmpFlag: false // 百分比模板
    }
  },
  created() {
    this._switch(this.commtmp)
    this._switchType(this.commsel)
  },
  watch: {
    // 监听佣金模板类别切换
    commtmp(newVal, oldVal) {
      if (newVal) {
        this._switch(newVal)
      }
    },
    // 监听佣金类别切换
    commsel(newVal) {
      if (newVal) {
        this._switchType(newVal)
      }
    }
  },
  methods: {
    // 切换模板
    _switch(val) {
      switch (val) {
        case 'STANDARD':
          this.commTmpFlag = true
          break
        case 'NONSTANDARD':
          this.commTmpFlag = false
          break
      }
    },
    _switchType(val) {
      switch (val) {
        case 'FIXED':
          this.commFixationTmpFlag = true
          this.commPersonTmpFlag = false
          this.commPercentTmpFlag = false
          break
        case 'COST_PERCENT':
          this.commFixationTmpFlag = false
          this.commPersonTmpFlag = false
          this.commPercentTmpFlag = true
          break
        case 'NUM_LADDER':
          this.commFixationTmpFlag = false
          this.commPersonTmpFlag = true
          this.commPercentTmpFlag = false
          break
      }
    }
  }
}

// 佣金相关组件
export const CompoentsCommMixin = {
  data() {
    return {
      commLink: {}, // 佣金联系人信息
      applyLevel: '', // 合作等级
      typeWidth: 730 // 佣金类型弹出窗宽度
    }
  },
  methods: {
    // 获取佣金联系人信息
    _getCommLink(data) {
      this.commLink = data
    },
    // 获取合作等级
    _getLevcl(data) {
      this.applyLevel = data
    },
    // 佣金提交字段
    _initParam(type) {
    },
    // 提交申请
    submitProject(type) {
      addProject(this._initParam(type)).then(res => {
        if (res.status === ERR_OK) {
          if (type === 'TYPE1') {
            this.$message.success('保存成功')
          } else {
            this.$message.success('提交成功')
          }
          console.log('提交成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    ...mapMutations({
      setSchoolInfoList: 'SET_SCHOOLINFOLIST'
    })
  },
  computed: {
    ...mapGetters([
      'schoolInfoList'
    ])
  }
}

// 申请附件续签和编辑
export const ApplyFileMixin = {
  data() {
    return {
      fileObj: {
        bizId: '',
        bizType: 'COOP_APPLY',
        fileType: 'AGREEMENT'
      },
      fileObj1: {
        bizType: 'COOP_APPLY',
        fileType: 'EMBASSY_CERTIFY'
      },
      fileObj2: {
        bizType: 'COOP_APPLY',
        fileType: 'ORG_CERTIFY'
      },
      fileObj3: {
        bizType: 'COOP_APPLY',
        fileType: 'ORG_PUBLICIZE'
      },
      fileObj5: {
        bizType: 'COOP_CONT',
        fileType: 'SIGN_AGREEMENT'
      },
      fileObj6: {
        bizType: 'COOP_APPLY',
        fileType: 'SIGN_AGREEMENT'
      },
      fileList: [], // 附件数组
      fileList1: [], // 附件数组
      fileList2: [], // 附件数组
      fileList3: [], // 附件数组
      fileList5: [],
      fileList6: [] // 签字后协议
    }
  },
  methods: {
    _getFileID(data) {
      let list = data
      this.fileList = list
    },
    _getFileID1(data) {
      let list = data
      this.fileList1 = list
    },
    _getFileID2(data) {
      let list = data
      this.fileList2 = list
    },
    _getFileID3(data) {
      let list = data
      this.fileList3 = list
    },
    _getFileID5(data) {
      let list = data
      this.fileList5 = list
    },
    _getFileID6(data) {
      let list = data
      this.fileList6 = list
    },
    _formatAtta() { // 对附件提交的字段内容进行过滤
      let M = []
      let N = [...this.fileList, ...this.fileList1, ...this.fileList2, ...this.fileList3, ...this.fileList6]
      N.map((item) => {
        M.push({
          id: item.id,
          fileType: item.fileType
        })
      })
      return M
    },
    _formatProtocolAtta() {
      let M = []
      let N = [...this.fileList5]
      N.map((item) => {
        M.push({
          id: item.id,
          fileType: item.fileType
        })
      })
      return M
    },
    // 初始化绑定附件内容
    _initFiles(data) {
      if (data.length > 0) {
        data.map(item => {
          if (item.fileType.code === 'AGREEMENT') {
            this.fileList.push({
              id: item.id,
              name: item.fileName,
              fileType: item.fileType.code,
              fileId: item.fileId
            })
          } else if (item.fileType.code === 'EMBASSY_CERTIFY') {
            this.fileList1.push({
              id: item.id,
              name: item.fileName,
              fileType: item.fileType.code,
              fileId: item.fileId
            })
          } else if (item.fileType.code === 'ORG_CERTIFY') {
            this.fileList2.push({
              id: item.id,
              name: item.fileName,
              fileType: item.fileType.code,
              fileId: item.fileId
            })
          } else if (item.fileType.code === 'ORG_PUBLICIZE') {
            this.fileList3.push({
              id: item.id,
              name: item.fileName,
              fileType: item.fileType.code,
              fileId: item.fileId
            })
          } else if (item.fileType.code === 'SIGN_AGREEMENT') {
            this.fileList5.push({
              id: item.id,
              name: item.fileName,
              fileType: item.fileType.code,
              fileId: item.fileId
            })
            this.fileList6.push({
              id: item.id,
              name: item.fileName,
              fileType: item.fileType.code,
              fileId: item.fileId
            })
          }
        })
      }
    }
  }
}

// 返回上一级
export const GoBackMixin = {
  methods: {
    goBackR() {
      this.$router.go(-1)
    }
  }
}

// 标记已选中的院校类别
export const ParentValMixin = {
  methods: {
    // 传值到子组件的选中状态
    parentVal(data) {
      if (data) {
        let list = data.split(',')
        let M = []
        list.map(item => {
          if (item !== '请选择') {
            M.push(item)
          }
        })
        return M
      }
    }
  }
}

// 权限按钮
export const GetChildBtnMixin = {
  data() {
    return {
      btnData: {}
    }
  },
  methods: {
    getAuthort(codes) {
      getBtnManage({
        codes: codes
      }).then(res => {
        if (res.status === ERR_OK) {
          // console.log('权限')
          this.btnData = res.data
        }
      })
    }
  }
}

export const GetCommSchoolListMxin = { // 处理所有合作项目选择院校(机构合作)
  methods: {
    _getCommList(levelList, colList, commList) { // levelList 页面已经显示的院校  colList 搜索新选择的院校  commList佣金模板中的院校

      const res = new Map()
      levelList.forEach((item) => {
        res.set(item.colId, item)
      })
      if (colList && colList !== 0) {
        colList.map(i => {
          i['colId'] = i.id
          // i['cheked'] = false
          commList.map(c => {
            if (c.colId === i.colId) {
              i['checked'] = true
            } else {
              i['checked'] = false
            }
          })
          if (!res.get(i.colId)) {
            levelList.push(i)
          }
        })
      }
      return levelList
    }
  }
}
