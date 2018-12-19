import axiosPlugin from '@/utils/axiosPlugin'

// 合作院校、合作机构及合作项目查询
export function searchAll(params) {
  let code = params.countryCode.map(i => `countryCode=${i}`).join('&')
  let url = '/coopContract/query' + '?' + code
  delete params.countryCode
  return axiosPlugin.get(url, {params: params}).then((res) => {
    return Promise.resolve(res)
  })
}

// 合作项目合同详情
export function getCoopConDetail(params) {
  let url = '/coopContract/findById'
  return axiosPlugin.get(url, {params: params}).then((res) => {
    return Promise.resolve(res)
  })
}

// 直接合作合同佣金查询
export function getConDirectCommDetail(params) {
  let url = '/comm/findDirectCommById'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 直接合作合同等级查询
export function getConDirectLevelDetail(params) {
  let url = '/comm/findDirectLeavelById'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 机构合作合同佣金查询
export function getConOrgCommDetail(params) {
  let url = '/comm/findOrgCommById'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 机构合作合同等级查询
export function getConOrgLevelDetail(params) {
  let url = '/comm/findOrgLeavelById'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 信息修正（直接合作）
export function updateConBase(params) {
  let url = '/coopContract/update'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 信息修正（机构合作）
export function updateConOrgBase(params) {
  let url = ''
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 信息修正（机构佣金）
export function updateConOrgComm(params) {
  let url = '/comm/updateOrgComm'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 信息修正（院校佣金）
export function updateConDirectComm(params) {
  let url = '/comm/updateDirectComm'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 项目信息
export function updateConProj(params) {
  let url = '/coopContract/updateAttach'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 修改联系信息
export function updateConLink(params) {
  let url = '/coopContract/updateContacts'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 合同冻结解冻
export function approveCont(params) {
  let url = '/apply/contStatus'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 合同申请查询
export function getApproveCont(params) {
  let url = '/apply/queryStatus'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 代办列表
export function getUpcoming(params) {
  let url = '/common/pre_do'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 续签执行逻辑处理
export function getRenew(params) {
  let url = '/coopApply/queryRenew'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 通过后的合作协议书
export function sendProtocol(params) {
  let url = '/coopContract/updateSignAttach'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 更改审批合作等级
export function sendLevel(params) {
  let url = '/coopApply/updateLevel'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}
