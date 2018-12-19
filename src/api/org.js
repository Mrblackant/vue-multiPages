import axiosPlugin from '@/utils/axiosPlugin'
// import qs from 'qs'

// 机构列表查询
export function getOrgList(params) {
  // let code = params.countryCode.map(i => `countryCode=${i}`).join('&')
  // let URI = '/org/queryOrgList' + '?' + code
  // delete params.countryCode
  let url = '/org/queryOrgList'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 新增机构
export function addOrg(params) {
  let url = '/org/save'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 查询机构详情
export function getOrgDetail(params) {
  let url = '/org/findById'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑机构信息
export function edit(params) {
  let url = '/org/update'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑联系人信息和机构介绍
export function editLink(params) {
  let url = '/college/editExt'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 获取操作日志
export function getOrgUpdLog(params) {
  let url = '/common/findLog'
  return axiosPlugin.get(url, {params: params}).then(res => {
    // console.log('---------' + res)
    return Promise.resolve(res)
  })
}

// 获取跨国家线项目人员（方法本身支持其他属性条件的查询）
export function getPersonByRole(params) {
  let url = '/common/getPersonByRole'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 删除
export function delOrg(params) {
  let url = '/org/delOrg'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}
