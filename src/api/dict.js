import axiosPlugin from '@/utils/axiosPlugin'

export function getCountry(params) {
  // let url = ''

  if (params.countryCodes && params.countryCodes.length > 0) {
    let code = params.countryCodes.map(i => `countryCodes=${i}`).join('&')
    // console.log(code)
    let url = '/dict/country' + '?' + code + '&isAuth=' + params.isAuth
    delete params.countryCodes
    return axiosPlugin.get(url).then(res => {
      return Promise.resolve(res)
    })
  } else {
    let url = '/dict/country'
    return axiosPlugin.get(url, {params: params}).then(res => {
      return Promise.resolve(res)
    })
  }
}

// 获取院校类型和院校性质
export function getColType() {
  let url = '/dict/colExt'
  return axiosPlugin.get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取院校申请枚举
export function getApplyEnum() {
  let url = '/dict/apply'
  return axiosPlugin.get(url).then(res => {
    return Promise.resolve(res)
  })
}

// 信息查询
export function getApplyDict() {
  let url = '/dict/queryApply'
  return axiosPlugin.get(url).then(res => {
    return Promise.resolve(res)
  })
}

// 院校管理枚举
export function getSchoolDict() {
  let url = '/dict/queryCol'
  return axiosPlugin.get(url).then(res => {
    return Promise.resolve(res)
  })
}

// 院校类别
export function getSchoolType(params) {
  let url = '/dict/overSeasType'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 待办枚举
export function getApproveEnmu() {
  let url = '/common/approveQuery'
  return axiosPlugin.get(url).then(res => {
    return Promise.resolve(res)
  })
}

// 获取当前用户
export function getCurrUser() {
  let url = '/common/user'
  return axiosPlugin.get(url).then(res => {
    return Promise.resolve(res)
  })
}

export function getLevelTable() {
  let url = '/dict/queryLevel'
  return axiosPlugin.get(url).then(res => {
    return Promise.resolve(res)
  })
}

// 查询工作流地址
export function getWorkFlowURI() {
  let url = '/common/workflowUrl'
  return axiosPlugin.get(url).then(res => {
    return Promise.resolve(res)
  })
}

export function getRouter() {
  let url = '/menus'
  return axiosPlugin.get(url).then(res => {
    return Promise.resolve(res)
  })
}

export function getBtnManage(code) {
  let url = '/menuChilds'
  return axiosPlugin.get(url, {params: code}).then(res => {
    return Promise.resolve(res)
  })
}
