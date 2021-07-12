import { fileUpload, createShipment, getExporter, getCustomsBroker, getCustoms, getRole } from '@/api/document'
import i18n from '@/locales/index'
const create = {
  state: {
    exporter: [],
    customsBroker: [],
    fileListIsOTB: [],
    fileListIsNotOTB: [],
    customsList: [],
    selectExporter: null,
    step1FileList: [],
    step2FileList: [],
    consigneeList: []
  },
  mutations: {
    updateFileListIsOTB (state, file) {
      state.fileListIsOTB.push(file)
    },
    step1FileList (state, files) {
      state.step1FileList = files
    },
    step2FileList (state, files) {
      state.step2FileList = files
    },
    deleteFileIsOTB (state, item) {
      state.fileListIsOTB = state.fileListIsOTB.filter(file => file.key !== item.key)
      state.step1FileList = state.step1FileList.filter(file => file.name !== item.name)
    },
    updateFileListIsNotOTB (state, file) {
      state.fileListIsNotOTB.push(file)
    },
    deleteFileIsNotOTB (state, item) {
      state.fileListIsNotOTB = state.fileListIsNotOTB.filter(file => file.key !== item.key)
      state.step2FileList = state.step2FileList.filter(file => file.key !== item.key)
    },
    clearShipmentData (state) {
      state.fileListIsOTB = []
      state.fileListIsNotOTB = []
      state.fileListIsOTB = []
      state.step1FileList = []
      state.step2FileList = []
      state.selectExporter = null
    },
    setCustomsBroker (state, data) {
      state.customsBroker = data
    },
    setCustoms (state, data) {
      state.customsList = data
    },
    setExporter (state, data) {
      state.exporter = data
    },
    set_select_Exporter (state, data) {
      state.selectExporter = data
    },
    setConsigneeList (state, data) {
      state.consigneeList = data
    }
  },
  actions: {
    uploadFile ({ commit }, formData) {
      return fileUpload(formData)
    },
    submitCreateShipment ({ commit }, data) {
      return createShipment(data)
    },
    clearShipment ({ commit }) {
      commit('clearShipmentData')
    },
    requestCustomsBroker ({ commit }) {
      getCustomsBroker().then(({ data }) => {
        commit('setCustomsBroker', data)
      })
    },
    requestCustoms ({ commit }) {
      getCustoms().then(({ data }) => {
        commit('setCustoms', data)
      })
    },
    requestExporter ({ commit }) {
      getExporter().then(({ data }) => {
        commit('setExporter', data)
      })
    },
    requestConsignee ({ commit, dispatch }, type) {
      getRole({ type })
        .then(({ data }) => {
          commit('setConsigneeList', data)
        })
        .catch(err => {
          dispatch('errHandler', err)
        })
    },
    setSelectExporter ({ commit }, data) {
      commit('set_select_Exporter', data)
    },
    errHandler ({ commit }, res) {
      function showError (exception) {
        if (exception.code) {
          window.app.$notification.error({ message: '[' + exception.code + ']' + i18n.tc(exception.code), duration: 4 })
        } else {
          window.app.$notification.error({ message: exception.message, duration: 4 })
        }
      }
      if (!res) {
        return
      }
      // const code = null
      let data = null
      // console.log('res', res)
      if (res.status && res.data) {
        data = res.data
      } else if (res.error) {
        data = res.error
      } else {
        return
      }
      showError(data)
      // switch (code) {
      //     case 500:
      //         showError(data);
      //         break;
      //     case 401:
      //         if (data.message === 'Bad token') {
      //             // commit("", false);
      //         } else {
      //             showError(data);
      //         }
      //         break;
      //     case 200:
      //         if (data.message === 'Bad token') {
      //             commit(type.mutations.UPDATE_LOGIN_STATUS, false);
      //         }
      //         break;
      // }
    }
  }
}

export default create
