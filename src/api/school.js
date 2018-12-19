// import request from '@/utils/request'
import axios from 'axios'

export function getSchoolList() {
  return new Promise((resolve, reject) => {
    axios.get('https://www.easy-mock.com/mock/5a587a8a3dcb200788d2c4e0/example/school').then((res) => {
      if (res.data.code === '0') {
        resolve(res.data)
      }
    }).catch(err => {
      reject(err)
    })
  })
}
