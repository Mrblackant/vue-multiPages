import request from '@/utils/request'
import axios from 'axios'

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {token}
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getRouter() {
  return new Promise((resolve, reject) => {
    axios.get('/api?userId=b8qp&productId=1vfja').then((res) => {

      if (res.data.status === 1) {
        // if (res.data.code === '0') {
        resolve(res.data.data)
      }
    }).catch(error => {
      reject(error)
    })
  })
}
