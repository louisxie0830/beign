import { axios } from '@/utils/request'

export function fileUpload (option) {
  return axios({
    url: '/document/upload',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data: option
  })
}

export function fileRegisterToOTB (option) {
  return axios({
    url: '/document/otb/fileinfo',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data: option
  })
}

export function createShipment (option) {
  return axios({
    url: '/shipment/create',
    method: 'post',
    data: option
  })
}

export function getCustomsBroker () {
  return axios({
    url: '/role/list',
    method: 'get',
    params: {
      type: 'CUSTOMS_BROKER'
    }
  })
}

export function getCustoms () {
  return axios({
    url: '/role/list',
    method: 'get',
    params: {
      type: 'CUSTOMS'
    }
  })
}

export function getExporter () {
  return axios({
    url: '/role/list',
    method: 'get',
    params: {
      type: 'EXPORTER'
    }
  })
}

export function getRole (parameter) {
  return axios({
    url: '/role/list',
    method: 'get',
    params: parameter
  })
}

export function addDocument (data) {
  return axios({
    url: '/shipment/addDocument',
    method: 'post',
    data: data
  })
}

export function getOTBInfo (parameter) {
  return axios({
    url: '/document/otbinfo',
    method: 'get',
    params: parameter
  })
}
