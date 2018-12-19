import axiosPlugin from '@/utils/axiosPlugin.js'

export function delAttachment(params) {
  let url = '/common/delAttachment?id=' + params.id + '&bizType=' + params.bizType
  // let jsonParams = JSON.stringify(params)
  return axiosPlugin.post(url).then((res) => {
    return Promise.resolve(res)
  })
}
