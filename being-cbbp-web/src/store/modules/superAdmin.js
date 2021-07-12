import {
  companyCreate,
  companyInfo,
  companyEdit,
  userEdit,
  userInviteDelete,
  userInviteResend,
  userInvite,
  companyListUser,
  userRevoke,
  userRoleEdit
} from '@/api/manage'
const create = {
  state: {},
  mutations: {},
  actions: {
    companyCreatePost ({ commit }, data) {
      return companyCreate(data)
    },
    companyEditPost ({ commit }, data) {
      return companyEdit(data)
    },
    userEditPost ({ commit }, data) {
      return userEdit(data)
    },
    userInvitePost ({ commit, dispatch }, data) {
      return userInvite(data)
    },
    userInviteDeletePost ({ commit }, data) {
      return userInviteDelete(data)
    },
    userRevokePost ({ commit }, data) {
      return userRevoke(data)
    },
    userInviteResendPost ({ commit }, data) {
      return userInviteResend(data)
    },
    requestCompanyInfo ({ commit }, data) {
      return companyInfo(data)
    },
    requestCompanyListUser ({ commit }, data) {
      return companyListUser(data)
    },
    userRoleEditPost ({ commit }, data) {
      return userRoleEdit(data)
    }
  }
}

export default create
