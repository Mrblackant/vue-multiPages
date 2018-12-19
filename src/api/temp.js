import axiosPlugin from '@/utils/axiosPlugin'

export function getApplyDetail(params) {
  let url = '/replenish/findApplyById'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 新增机构合作（院校）
export function addOrgProject(params) {
  let url = '/replenish/saveCoopOrg'
  return axiosPlugin.post(url, params).then((res) => {
    return Promise.resolve(res)
  })
}

// 机构合作等级查询
export function getLevelOrgDetail(params) {
  let url = '/replenish/findLeavelByOrgId'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 新增直接合作
export function addProject(params) {
  let url = '/replenish/saveDirect'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}
