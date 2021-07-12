import { fileUpload, addDocument, getOTBInfo, fileRegisterToOTB } from '@/api/document'
import { shipmentUndo, shipmentReturn, shipmentApprove, shipmentWithdraw, shipmentDelete } from '@/api/manage'
const create = {
  state: {
    fileList: []
  },
  mutations: {
    detailUpdateFileList (state, file) {
      state.fileList.push(file)
    },
    detailClearData (state) {
      state.fileList = []
    }
  },
  actions: {
    async detailUploadFile ({ commit, dispatch }, formData) {
      return fileUpload(formData).then(result => {
        console.log(result)
        const fileHash = result.data.hash
        dispatch('signDocument', { fileHash, action: 2, t: Date.now() })
        return result
      })
    },
    async snedFileToOTB ({ commit, dispatch }, formData) {
      return fileRegisterToOTB(formData).then(result => {
        console.log(result)
        // const fileHash = result.data.hash
        return result
      })
    },
    requestOTBInfo ({ commit }, data) {
      return getOTBInfo(data)
    },
    detailAddDocument ({ commit }, data) {
      return addDocument(data)
    },
    operationTransmitToCB ({ commit }, data) {
      return shipmentApprove(data)
    },
    operationWithdraw ({ commit }, data) {
      return shipmentWithdraw(data)
    },
    operationSubmitToCustoms ({ commit }, data) {
      return shipmentApprove(data)
    },
    operationReviewCompleted ({ commit }, data) {
      return shipmentApprove(data)
    },
    operationReturnToImporter ({ commit }, data) {
      return shipmentReturn(data)
    },
    operationUndoReviewed ({ commit }, data) {
      return shipmentUndo(data)
    },
    operationUndoReturned ({ commit }, data) {
      return shipmentUndo(data)
    },
    operationDelete ({ commit }, data) {
      return shipmentDelete(data)
    }
  }
}

export default create
