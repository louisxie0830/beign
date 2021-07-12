const Joi = require("@hapi/joi");
const Handlers = require('./handler');
module.exports = [{
  method: 'POST',
  path: '/email/send',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        email: Joi.string().lowercase().email({
          minDomainSegments: 2
        }).required().description('邮箱'),
        phone: Joi.string()
      })
    },
    response: {
      schema: Joi.object({
        code: Joi.number().description('200 for success, other fail'),
        message: Joi.string().description('text message for response')
      }).label('Result')
    },
    handler: Handlers.sendEmailCode,
    notes: '发送邮箱验证码',
    description: '发送邮箱验证码',
    tags: ['api', 'email']
  }
}, {
  method: 'POST',
  path: '/email/afterLogin',
  options: {
    validate: {
      headers: Joi.object({
        authorization: Joi.string().required().description('userAuthToken:以Bearer 开头'),
      }).options({
        allowUnknown: true
      }),
      payload: Joi.object({
        email: Joi.string().lowercase().email({
          minDomainSegments: 2
        }).required().description('邮箱'),
        type: Joi.number().allow(1, 2, 3).required().description('验证码类型: 1修改登入密码、2修改签署密码、3绑定邮箱'),
      })
    },
    response: {
      schema: Joi.object({
        code: Joi.number().description('200 for success, other fail'),
        message: Joi.string().description('text message for response')
      }).label('Result')
    },
    handler: Handlers.loginAfterEmailCode,
    notes: '登录后发送邮箱验证码',
    description: '登录后发送邮箱验证码',
    tags: ['api', 'email', 'modify']
  }
}, {
  method: 'POST',
  path: '/email/verify',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        email: Joi.string().lowercase().email({
          minDomainSegments: 2
        }).required().description('邮箱'),
        code: Joi.string().token().required().description('邮箱验证码'),
        type: Joi.number().default(0).description('验证码类型: 1修改登入密码、2修改签署密码、3绑定邮箱、0其他'),
      })
    },
    response: {
      schema: Joi.object({
        code: Joi.number().description('200 for success, other fail'),
        message: Joi.string().description('text message for response')
      }).label('Result')
    },
    handler: Handlers.verifyEmailCode,
    notes: '验证邮箱验证码',
    description: '验证邮箱验证码',
    tags: ['api', 'email']
  }
}, {
  method: 'POST',
  path: '/email/bind',
  options: {
    validate: {
      headers: Joi.object({
        authorization: Joi.string().required().description('userAuthToken:以Bearer 开头'),
        address: Joi.string().required().description('用户eth地址'),
      }).options({
        allowUnknown: true
      }),
      payload: Joi.object({
        email: Joi.string().lowercase().email({
          minDomainSegments: 2
        }).required().description('邮箱'),
        mobile: Joi.string().description("手机号码"),
        authCode: Joi.string().required().description('签署密码'),
        authCodeConfirm: Joi.string().valid(Joi.ref('authCode')).required().description('签署密码'),
        code: Joi.string().token().required().description('邮箱验证码')
      })
    },
    response: {
      schema: Joi.object({
        code: Joi.number().description('200 for success, other fail'),
        message: Joi.string().description('text message for response')
      }).label('Result')
    },
    handler: Handlers.bindEmail,
    notes: '绑定邮箱',
    description: '绑定邮箱',
    tags: ['api', 'email', 'bind']
  }
}];
