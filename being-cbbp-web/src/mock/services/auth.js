import Mock from 'mockjs2'
import { builder, getBody } from '../util'

const username = ['string', 'string']
// 强硬要求 ant.design 相同密碼
// '21232f297a57a5a743894a0e4a801fc3',
const password = ['string'] // admin, ant.design

const login = options => {
  const body = getBody(options)
  console.log('mock: body', body)
  if (!username.includes(body.name) || !password.includes(body.password)) {
    return builder({ isLogin: true }, '帳戶或密碼錯誤', 401)
  }

  return builder(
    {
      code: '200',
      data: 'sfdhjjklahdskfhlksjadhjfklas',
      message: 'success'
    },
    'success',
    200,
    { 'Custom-Header': Mock.mock('@guid') }
  )
}

const logout = () => {
  return builder({}, '[测试接口] 注销成功')
}

const smsCaptcha = () => {
  return builder({ captcha: Mock.mock('@integer(10000, 99999)') })
}

const twofactor = () => {
  return builder({ stepCode: Mock.mock('@integer(0, 1)') })
}

Mock.mock(/\/login/, 'post', login)
Mock.mock(/\/auth\/logout/, 'post', logout)
Mock.mock(/\/account\/sms/, 'post', smsCaptcha)
Mock.mock(/\/auth\/2step-code/, 'post', twofactor)
