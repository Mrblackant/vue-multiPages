import storage from 'good-storage'

const LINK_KEY = '__LINK__'
const LINK_MAX_LEN = 200

function insertArray(arr, val, compare, maxlen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxlen && arr.length > maxlen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveLink(params) {
  let links = storage.get(LINK_KEY, [])
  insertArray(links, (item) => {
    return item === params
  }, LINK_MAX_LEN)
  storage.set(LINK_KEY, links)
  return links
}

export function delLink(params) {
  let links = storage.get(LINK_KEY, [])
  deleteFromArray(links, (item) => {
    return item === params
  })
  storage.set(LINK_KEY, links)
  return links
}

export function clearLink() {
  storage.remove(LINK_KEY)
  return []
}

export function loadLink() {
  storage.get(LINK_KEY, [])
}
