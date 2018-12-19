import axiosPlugin from '@/utils/axiosPlugin'
import {isArray} from '@//utils/index'

// 新增院校
export function addSchool(params) {
  let url = '/college/save'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 留学院校维护查询和顾问查询
// export function searchSchool(params) {
//   let url = '/college/contColList'
//   let code = null
//   let URI = null
//   if (isArray(params.countryCodes)) { // 判断是否数组
//     code = params.countryCodes.map(i => `countryCodes=${i}`).join('&')
//   } else {
//     if (params.countryCodes === null) {
//       code = null
//     } else {
//       code = `countryCodes=${params.countryCodes}`
//     }
//   }
//   if (code === null) {
//     URI = url
//   } else {
//     URI = url + '?' + code
//   }
//   delete params.countryCodes
//   return axiosPlugin.get(URI, {params: params}).then(res => {
//     return Promise.resolve(res)
//   })
// }
export function searchSchool(params) {
  let url = '/college/query'
  let code = null
  let URI = null
  if (isArray(params.countryCodes)) { // 判断是否数组
    code = params.countryCodes.map(i => `countryCodes=${i}`).join('&')
  } else {
    if (params.countryCodes === null) {
      code = null
    } else {
      code = `countryCodes=${params.countryCodes}`
    }
  }
  if (code === null) {
    URI = url
  } else {
    URI = url + '?' + code
  }
  delete params.countryCodes
  return axiosPlugin.get(URI, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 查询学校名称
export function getSchoolName() {
  let url = '/college/query'
  return axiosPlugin.get(url).then(res => {
    return Promise.resolve(res)
  })
}

// 查询院校详细信息
export function getSchoolDetail(id) {
  let url = '/college/findById'
  return axiosPlugin.get(url, {params: id}).then((res) => {
    return Promise.resolve(res)
  })
}

// 合作信息查询
export function getConts(params) {
  let url = '/college/colContList'
  return axiosPlugin.get(url, {params: params}).then((res) => {
    return Promise.resolve(res)
  })
}

// 院校项目可选申请--数据获取
export function getTable(params) {
  let url = '/apply/querySelect'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑院校信息
export function editSchool(params) {
  let url = '/college/edit'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑联系人信息和院校介绍
export function editLink(params) {
  let url = '/college/editExt'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 恢复可选和设为不可选
export function setSel(params) {
  let url = '/apply/contSelect'
  return axiosPlugin.post(url, params).then(res => {
    return Promise.resolve(res)
  })
}

// 可选不可选申请查看
export function getSel(params) {
  let url = '/apply/querySelect'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 查询院校名称
export function searchName(params) {
  let url = '/college/queryName'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}

// 删除院校
export function delSchool(params) {
  let url = '/college/delSchool'
  return axiosPlugin.get(url, {params: params}).then(res => {
    return Promise.resolve(res)
  })
}
