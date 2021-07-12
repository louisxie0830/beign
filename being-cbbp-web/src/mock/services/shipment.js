import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'
const totalCount = 5701
const shipmentList = options => {
  const parameters = getQueryParameters(options)

  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? totalCount % pageSize : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    result.push({
      id: tmpKey,
      shipmentNumber: 'No ' + tmpKey,
      exporter: 'Exporter ' + tmpKey,
      importer: 'Importer ' + tmpKey,
      status: Mock.mock('@integer(1, 3)'),
      createdAt: Mock.mock('@datetime')
    })
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: result
  })
}

const shipmentDetails = options => {
  const parameters = getQueryParameters(options)
  return builder({
    id: parameters.id,
    shipmentNumber: 'No ' + parameters.id,
    exporter: {
      name: 'Exporter ' + parameters.id,
      address: 'Exporter ' + parameters.id + 'address',
      phone: 'Exporter ' + parameters.id + 'phone'
    },
    importer: {
      name: 'Importer ' + parameters.id,
      address: 'Importer ' + parameters.id + 'address',
      phone: 'Importer ' + parameters.id + 'phone'
    },
    customsBroker: {
      name: 'Importer ' + parameters.id,
      address: 'Importer ' + parameters.id + 'address',
      phone: 'Importer ' + parameters.id + 'phone'
    },
    fileList: [
      {
        name: 'File ' + parameters.id,
        type: 'application/pdf',
        createdAt: Mock.mock('@datetime'),
        creator: 'Uploader ' + parameters.id
      },
      {
        name: 'File2 ' + parameters.id,
        type: 'application/pdf',
        createdAt: Mock.mock('@datetime'),
        creator: 'Uploader2 ' + parameters.id
      }
    ],
    shipmentHistory: [
      {
        user: 'User0',
        action: 'upload',
        createdAt: Mock.mock('@datetime')
      },
      {
        user: 'User1',
        action: 'sign',
        createdAt: Mock.mock('@datetime')
      }
    ],
    hsCode: 'HS000' + parameters.id,
    status: Mock.mock('@integer(1, 3)'),
    createdAt: Mock.mock('@datetime'),
    forwardAt: Mock.mock('@datetime')
  })
}

Mock.mock(/\/shipment\/list/, 'get', shipmentList)
Mock.mock(/\/shipment\/info/, 'get', shipmentDetails)
