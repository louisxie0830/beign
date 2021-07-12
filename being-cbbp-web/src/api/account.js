import { axios } from '@/utils/request'

export function inviteUser (data) {
  return axios({
    url: '/user/invite',
    method: 'post',
    data
  })
}

export function checkUserRoleCanRegister (data) {
  return axios({
    url: '/userrole/canRegister',
    method: 'get',
    params: data
  })
}

export function checkUsernameIsExist (data) {
  return axios({
    url: '/user/usernameIsExist',
    method: 'get',
    params: data
  })
}

export function checkEmailIsExist (data) {
  return axios({
    url: '/user/emailIsExist',
    method: 'get',
    params: data
  })
}

export function confirmUser (data) {
  return axios({
    url: '/user/confirm',
    method: 'post',
    data
  })
}

export function addressName (data) {
  return axios({
    url: '/user/address',
    method: 'get',
    params: data
  })
}

export function forgetPassword (data) {
  return axios({
    url: '/user/forgetPassword',
    method: 'post',
    data
  })
}

export function resetPassword (data) {
  return axios({
    url: '/user/resetPassword',
    method: 'post',
    data
  })
}

export function getInviteRecord (parameter) {
  return axios({
    url: '/user/invite',
    method: 'get',
    params: parameter
  })
}

export function customsList (parameter) {
  return axios({
    url: '/customs/list',
    method: 'get',
    params: parameter
  })
}

export function customsUpdate (data) {
  return axios({
    url: '/customs/update',
    method: 'post',
    data
  })
}

export function companyList (parameter) {
  return axios({
    url: '/company/list',
    method: 'get',
    params: parameter
  })
}

export function userList (parameter) {
  return axios({
    url: '/user/list',
    method: 'get',
    params: parameter
  })
}
