import {getSchoolList} from '@/api/school'

const school = {
  state: {
    schoolList: [],
    schoolInfoList: [],
    orgSchoolCommList: [], // 机构合作佣金院校列表
    orgCommList: [] // 机构佣金列表
  },
  mutations: {
    SET_SCHOOLLIST: (state, list) => {
      state.schoolList = list
    },
    SET_SCHOOLINFOLIST: (state, list) => {
      state.schoolInfoList = list
    },
    SET_ORG_SCHOOL_COMM_LIST: (state, list) => {
      if (list === 0) {
        state.orgSchoolCommList.length = 0 // 清空 orgSchoolCommList
      } else {
        // const res = new Map()
        // let lt = JSON.parse(JSON.stringify(state.orgSchoolCommList))
        // 
        // lt.forEach((item) => {
        //   res.set(item.colId, item)
        // })
        // 
        // if (list && list !== 0) {
        //   list.map(i => {
        //     i['colId'] = i.id
        //     if (!res.get(i.id)) {
        //       lt.push(i)
        //     }
        //   })
        // }
        // state.orgSchoolCommList = lt
        state.orgSchoolCommList = list
      }
    },
    SET_ORG_COMM_LIST: (state, list) => {
      if (list === 0) {
        state.orgCommList = []
      } else {
        state.orgCommList = list
      }
    }
  },
  actions: {
    SchoolList({commit}) {
      return new Promise((resolve, reject) => {

        getSchoolList().then(res => {
          // console.log(res)
          if (res) {
            const data = res.data
            // console.log(data)
            commit('SET_SCHOOLLIST', data)
            resolve()
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
export default school
