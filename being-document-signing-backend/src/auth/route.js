const Joi = require("@hapi/joi");
const Handlers = require("./handler");
const { getSummary, getContentType } = require("@promster/hapi");
module.exports = [
  {
    method: "GET",
    path: "/metrics",
    options: {
      auth: false
    },
    handler: async (request, h) => {
      return h
        .response(getSummary())
        .type(getContentType())
        .code(200);
    }
  },
  {
    method: "GET",
    path: "/auth/currentTime",
    handler: Handlers.getCurrentTimestamp,
    options: {
      auth: false,
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          timestamp: Joi.number().description("current time")
        }).label("Result")
      },
      notes: "取得当前时间戳",
      description: "取得当前时间戳",
      tags: ["api", "auth", "timestamp"]
    }
  },
  {
    method: "POST",
    path: "/user/lang",
    handler: Handlers.setLang,
    options: {
      validate: {
        payload: Joi.object({
          lang: Joi.string()
            .required()
            .description("语言")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      notes: "设置语言",
      description: "设置语言",
      tags: ["api", "user", "lang"]
    }
  },
  {
    method: "POST",
    path: "/auth/login",
    handler: Handlers.login,
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          email: Joi.string()
            .lowercase()
            .email({
              minDomainSegments: 2
            })
            .required()
            .description("邮箱"),
          password: Joi.string()
            .min(8)
            .max(32)
            .alphanum()
            .regex(/([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*/, "alphandnum")
            .required()
            .description("密码")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          token: Joi.string().description("API token"),
          lang: Joi.string()
            .allow("")
            .description("user's default language setting"),
          name: Joi.string().description("用户名")
        }).label("Result")
      },
      notes: "普通用户登入",
      description: "普通用户登入",
      tags: ["api", "auth", "login"]
    }
  },
  {
    method: "POST",
    path: "/auth/register",
    options: {
      auth: false,
      validate: {
        headers: Joi.object({
          address: Joi.string()
            .required()
            .description("用户eth地址")
        }).options({
          allowUnknown: true
        }),
        payload: Joi.object({
          name: Joi.string().description("姓名"),
          inviteCode: Joi.string()
            .allow("", null)
            .description("inviteCode"),
          email: Joi.string()
            .lowercase()
            .email({
              minDomainSegments: 2
            })
            .required()
            .description("邮箱"),
          password: Joi.string()
            .min(8)
            .max(32)
            .alphanum()
            .regex(/([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*/, "alphandnum")
            .required()
            .description("密码"),
          passwordConfirm: Joi.string()
            .valid(Joi.ref("password"))
            .required()
            .description("密码"),
          mobile: Joi.string().description("手机号码"),
          authCode: Joi.string()
            .required()
            .description("签署密码"),
          authCodeConfirm: Joi.string()
            .valid(Joi.ref("authCode"))
            .required()
            .description("签署密码"),
          code: Joi.string()
            .token()
            .length(6)
            .required()
            .description("邮箱验证码"),
          agreeTerms: Joi.boolean()
            .valid(true)
            .required()
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          token: Joi.string().description("API token"),
          name: Joi.string().description("用户名")
        }).label("Result")
      },
      handler: Handlers.register,
      notes: "普通用户注册",
      description: "普通用户注册",
      tags: ["api", "auth", "register"]
    }
  },
  {
    method: "POST",
    path: "/auth/password/forget",
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          email: Joi.string()
            .lowercase()
            .email({
              minDomainSegments: 2
            })
            .required()
            .description("邮箱")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.forgetPassword,
      notes: "用户忘记登入密码",
      description: "用户忘记登入密码",
      tags: ["api", "auth", "password_forget"]
    }
  },
  {
    method: "POST",
    path: "/auth/password/reset",
    options: {
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("userAuthToken:以Bearer 开头")
        }).options({
          allowUnknown: true
        }),
        payload: Joi.object({
          password: Joi.string()
            .min(8)
            .max(32)
            .alphanum()
            .regex(/([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*/, "alphandnum")
            .required()
            .description("密码"),
          passwordConfirm: Joi.string()
            .valid(Joi.ref("password"))
            .required()
            .description("密码"),
          code: Joi.string()
            .token()
            .length(6)
            .required()
            .description("邮箱验证码")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.resetPasswordAfterLogin,
      notes: "用户登入密码重置(登入后)",
      description: "用户登入密码重置(登入后)",
      tags: ["api", "auth", "password_reset", "write"]
    }
  },
  {
    method: "POST",
    path: "/auth/password/forget/reset",
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          password: Joi.string()
            .min(8)
            .max(32)
            .alphanum()
            .regex(/([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*/, "alphandnum")
            .required()
            .description("密码"),
          passwordConfirm: Joi.string()
            .valid(Joi.ref("password"))
            .required()
            .description("密码"),
          hash: Joi.string()
            .token()
            .required()
            .description("重置密码hash")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.resetPasswordBeforeLogin,
      notes: "用户登入密码重置",
      description: "用户登入密码重置",
      tags: ["api", "auth", "password_reset"]
    }
  },
  {
    method: "POST",
    path: "/auth/password/forget/validate",
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          hash: Joi.string()
            .token()
            .required()
            .description("重置密码hash")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.validateForgetPassword,
      notes: "用户登入密码重置验证hash",
      description: "用户登入密码重置验证hash",
      tags: ["api", "auth", "password_reset_validate"]
    }
  },
  {
    method: "POST",
    path: "/auth/sign/password",
    options: {
      auth: {
        mode: "required",
        payload: true,
        strategies: ["simple"]
      },
      validate: {
        headers: Joi.object({
          timestamp: Joi.number()
            .required()
            .description("时间戳"),
          address: Joi.string()
            .required()
            .description("用户eth地址"),
          signature: Joi.string()
            .required()
            .description("请求签名"),
          authorization: Joi.string()
            .required()
            .description("userAuthToken:以Bearer 开头")
        }).options({
          allowUnknown: true
        }),
        payload: Joi.object({
          password: Joi.string()
            .required()
            .description("密码"),
          passwordConfirm: Joi.string()
            .valid(Joi.ref("password"))
            .required()
            .description("密码"),
          code: Joi.string()
            .token()
            .length(6)
            .required()
            .description("邮箱验证码")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.saveSignPassword,
      notes: "用户签署密码设置",
      description: "用户签署密码设置",
      tags: ["api", "auth", "sign_password", "write"]
    }
  },
  {
    method: "GET",
    path: "/user/status",
    options: {
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("userAuthToken:以Bearer 开头")
        }).options({
          allowUnknown: true
        }),
        query: Joi.object({
          corpId: Joi.number()
            .optional()
            .description("企业ID")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          data: Joi.object({
            userId: Joi.number().description("being userId"),
            email: Joi.string()
              .allow(null, "")
              .description("verified email address"),
            remain: Joi.number().description("个人签署剩余"),
            limit: Joi.number().description("个人签署限制"),
            limit_duration: Joi.number().description("个人签署限制间隔"),
            address: Joi.string()
              .allow(null, "")
              .description("blockchain address"),
            type: Joi.string().description("登入类型"),
            role: Joi.number().description("用户在企业下的角色"),
            department: Joi.object({
              name: Joi.string().allow("", null).description("部门名称"),
              id: Joi.number().allow(0, null).description("部门id"),
              adminId: Joi.number().allow(0, null).description("部门管理员id"),
              adminName: Joi.string().allow("", null).description("部门管理员姓名")
            })
              .allow(null, "")
              .description("所属的公司部门")
          }).description("登入用户的信息")
        }).label("Result")
      },
      handler: Handlers.userStatus,
      notes: "登入用户的信息",
      description: "登入用户的信息",
      tags: ["api", "auth", "user_status"]
    }
  },
  {
    method: "GET",
    path: "/user/cerPassword",
    options: {
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("userAuthToken:以Bearer 开头")
        }).options({
          allowUnknown: true
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          data: Joi.object({
            password: Joi.string()
              .allow("", null)
              .description("用户签署密码")
          }).description("获取用户签署密码")
        }).label("Result")
      },
      handler: Handlers.userPassword,
      notes: "获取用户签署密码",
      description: "获取用户签署密码",
      tags: ["api", "auth", "user_password"]
    }
  },
  {
    method: "POST",
    path: "/auth/logout",
    options: {
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("userAuthToken:以Bearer 开头")
        }).options({
          allowUnknown: true
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.logout,
      notes: "登出",
      description: "登出",
      tags: ["api", "auth", "logout"]
    }
  }
];
