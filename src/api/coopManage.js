import axiosPlugin from '@/utils/axiosPlugin'

// 查询学校列表
export function searchSchool(arms) {
  let url = '/college/query'
  return axiosPlugin.get(url, {params: arms}).then(res => {
    // console.log(url)
    return Promise.resolve(res)
  })
}

// 新增直接合作
export function addProject(params) {
  let url = '/coopApply/saveDirect'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 新增机构合作（院校）
export function addOrgProject(params) {
  let url = '/coopApply/saveCoopOrg'
  return axiosPlugin.post(url, params).then((res) => {
    return Promise.resolve(res)
  })
}

// 申请信息查询
export function getApplyList(params) {
  let url = '/coopApply/query'
  return axiosPlugin.get(url, {params: params}).then((res) => {
    return Promise.resolve(res)
  })
}

// 机构列表查询
export function getOrgList(params) {
  let url = '/org/queryOrgList'
  return axiosPlugin.get(url, {params: params}).then((res) => {
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

// 合作项目查询
export function getApplyDetail(params) {
  let url = '/coopApply/findApplyById'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 机构佣金查询
export function getOrgCommDetail(params) {
  let url = '/coopApply/findOrgCommById'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 直接合作佣金
export function getDirectCommDetail(params) {
  let url = '/coopApply/findDirectCommById'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 直接合作等级查询
export function getLevelDetail(params) {
  let url = '/coopApply/findDirectLeavelById'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 机构合作等级查询
export function getLevelOrgDetail(params) {
  let url = '/coopApply/findOrgLeavelById'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 临时测试用
export function getTmp() {
  let url = '/common/user'
  return axiosPlugin.get(url).then(res => {
    return Promise.resolve(res)
  })
}

// 申请撤回
export function withDraw(params) {
  let url = '/common/withDraw'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 删除合作申请
export function delApply(params) {
  let url = '/coopApply/delApplyById'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 新增机构合作院校
export function saveContTmpLevel(params) {
  let url = '/comm/saveContTmpLevel'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}
