const searchList = {
  state: {
    contList: [], // 查询合同列表
    contCondition: {}, // 查询条件
    manageColList: [], // 院校管理查询列表
    colCondition: {}, // 院校查询条件
    applyList: [], // 查询申请列表
    applyCondition: {}, // 查询申请条件
    addApplyList: [], // 新建院校/机构申请列表
    historyList: [], // 新建申请历史信息列表
    addApplyCondition: {} // 新建申请条件
  },
  mutations: {
    SET_CONTLIST: (state, list) => {
      state.contList = list
    },
    SET_CONTCONDITION: (state, obj) => {
      state.contCondition = obj
    },
    SET_MANAGECOLLIST: (state, list) => {
      state.manageColList = list
    },
    SET_COLCONDITION: (state, obj) => {
      state.colCondition = obj
    },
    SET_APPLYLIST: (state, list) => {
      state.applyList = list
    },
    SET_APPLYCONDITION: (state, obj) => {
      state.applyCondition = obj
    },
    SET_ADDAPPLYLIST: (state, list) => {
      state.addApplyList = list
    },
    SET_HISTORYLIST: (state, list) => {
      state.historyList = list
    },
    SET_ADDAPPLYCODITION: (state, obj) => {
      state.addApplyCondition = obj
    }
  }
}
export default searchList
