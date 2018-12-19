const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  // permission_routers: state => state.permission.routers,
  // addRouters: state => state.permission.addRouters,
  schoolList: state => state.school.schoolList,
  schoolInfoList: state => state.school.schoolInfoList,
  orgCommList: state => state.school.orgCommList,
  orgSchoolCommList: state => state.school.orgSchoolCommList,
  contList: state => state.search.contList,
  contCondition: state => state.search.contCondition,
  manageColList: state => state.search.manageColList,
  colCondition: state => state.search.colCondition,
  applyList: state => state.search.applyList,
  applyCondition: state => state.search.applyCondition,
  addApplyList: state => state.search.addApplyList,
  historyList: state => state.search.historyList,
  addApplyCondition: state => state.search.addApplyCondition
}
export default getters
