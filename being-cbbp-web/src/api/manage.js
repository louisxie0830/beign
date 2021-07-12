import { axios } from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api

export function getUserList (parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function getShipmentList (parameter) {
  return axios({
    url: '/shipment/list',
    method: 'get',
    params: parameter
  })
}

export function getShipmentInfo (shipmentNo) {
  return axios({
    url: '/shipment/info',
    method: 'get',
    params: {
      shipmentNo: shipmentNo
    }
  })
}

export function shipmentRemoveDoc (parameter) {
  return axios({
    url: '/shipment/removeDocument',
    method: 'post',
    data: parameter
  })
}

export function shipmentUndo (parameter) {
  return axios({
    url: '/shipment/undo',
    method: 'post',
    data: parameter
  })
}

export function shipmentReturn (parameter) {
  return axios({
    url: '/shipment/return',
    method: 'post',
    data: parameter
  })
}

export function shipmentCustomsNo (parameter) {
  return axios({
    url: '/shipment/updateCustomsNo',
    method: 'post',
    data: parameter
  })
}

export function shipmentApprove (parameter) {
  return axios({
    url: '/shipment/approve',
    method: 'post',
    data: parameter
  })
}

export function shipmentWithdraw (parameter) {
  return axios({
    url: '/shipment/withdraw',
    method: 'post',
    data: parameter
  })
}

export function shipmentDelete (parameter) {
  return axios({
    url: '/shipment/delete',
    method: 'post',
    data: parameter
  })
}

export function companyCreate (parameter) {
  return axios({
    url: '/company/create',
    method: 'post',
    data: parameter
  })
}

export function companyEdit (parameter) {
  return axios({
    url: '/company/edit',
    method: 'post',
    data: parameter
  })
}

export function userEdit (parameter) {
  return axios({
    url: '/user/edit',
    method: 'post',
    data: parameter
  })
}

export function userInvite (parameter) {
  return axios({
    url: '/user/invite',
    method: 'post',
    data: parameter
  })
}

export function userRevoke (parameter) {
  return axios({
    url: '/company/removeUser',
    method: 'post',
    data: parameter
  })
}

export function userInviteDelete (parameter) {
  return axios({
    url: '/user/invite/delete',
    method: 'post',
    data: parameter
  })
}

export function userInviteResend (parameter) {
  return axios({
    url: '/user/invite/resend',
    method: 'post',
    data: parameter
  })
}

export function companyInfo (parameter) {
  return axios({
    url: '/company/info',
    method: 'get',
    params: parameter
  })
}

export function companyListUser (parameter) {
  return axios({
    url: '/company/listUser',
    method: 'get',
    params: parameter
  })
}

export function changeUserRole (data) {
  return axios({
    url: '/user/changeRole',
    method: 'post',
    data: data
  })
}

export function userRoleEdit (data) {
  return axios({
    url: '/user/role/edit',
    method: 'post',
    data: data
  })
}
