import { inviteUser } from '@/api/account'
const create = {
  state: {
    step1: {}
  },
  mutations: {
    createAccountStep1 (state, data) {
      state.step1 = data
    }
  },
  actions: {
    adminInviteUser ({ commit }, data) {
      return inviteUser(data)
    }
  }
}

export default create
