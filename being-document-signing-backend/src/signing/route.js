const Joi = require("@hapi/joi")
const Handlers = require("./handler");
module.exports = [
  {
    method: "GET",
    path: "/signing/corps",
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
          role: Joi.string()
            .allow("admin", "user")
            .default("user")
            .description("用户类型: admin管理员，user普通用户")
        })
      },
      handler: Handlers.getCompanyList,
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          data: Joi.array()
            .items(
              Joi.object({
                name: Joi.string()
                  .required()
                  .description("企业名字"),
                role: Joi.number().description(
                  "角色：1主管理者，2子管理者、3簽署者"
                ),
                signing_quota: Joi.number().description("企业总签署次数"),
                signing_remain: Joi.number().description("企业剩余签署次数"),
                id: Joi.number()
                  .required()
                  .description("企业ID"),
                department: Joi.array().items(Joi.object({
                  id: Joi.number().description("部门id"),
                  name: Joi.string().description("部门名称"),
                  adminId: Joi.number().description("管理员id")
                }))
              })
            )
            .description("企业列表")
        }).label("Result")
      },
      notes: "按用户ID返回认证企业列表",
      description: "返回认证企业列表",
      tags: ["api", "signing"]
    }
  },
  {
    method: "GET",
    path: "/signing/users",
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
          corpId: Joi.string()
            .required()
            .description("企业ID"),
          role: Joi.string()
            .required()
            .allow("admin", "user")
            .description("用户类型: admin管理员，user普通用户")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          data: Joi.array()
            .items(
              Joi.object({
                id: Joi.number()
                  .required()
                  .description("用户ID"),
                name: Joi.string()
                  .required()
                  .description("用户名字"),
                email: Joi.string()
                  .required()
                  .description("用户邮箱"),
                role: Joi.number()
                  .required()
                  .allow(1, 2, 3)
                  .description("角色：1主管理者，2子管理者、3簽署者")
              })
            )
            .description("用户列表")
            .label("data")
        })
      },
      handler: Handlers.getAuthorizedUserListByCompanyId,
      notes: "按企业ID返回认证用户列表",
      description: "返回认证用户列表",
      tags: ["api", "signing"]
    }
  },
  {
    method: "POST",
    path: "/signing/users/add",
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
          corpId: Joi.number()
            .required()
            .description("企业ID"),
          email: Joi.string()
            .lowercase()
            .email({
              minDomainSegments: 2
            })
            .required()
            .description("邮箱"),
          role: Joi.number()
            .required()
            .allow(2, 3)
            .description("角色：2子管理者、3簽署者")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.addSigningUser,
      notes: "添加签署用户",
      description: "添加签署用户",
      tags: ["api", "signing", "write"]
    }
  },
  {
    method: "POST",
    path: "/signing/users/delete",
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
          corpId: Joi.number()
            .required()
            .description("企业ID"),
          userId: Joi.number()
            .required()
            .description("用户ID"),
          role: Joi.number()
            .required()
            .allow(2, 3)
            .description("角色：2子管理者、3簽署者")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.deleteSigningUser,
      notes: "移除签署用户",
      description: "移除签署用户",
      tags: ["api", "signing", "write"]
    }
  },
  {
    method: "POST",
    path: "/signing/admin/transfer",
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
          corpId: Joi.number()
            .required()
            .description("企业ID"),
          email: Joi.string()
            .lowercase()
            .email({
              minDomainSegments: 2
            })
            .required()
            .description("新主管理员邮箱"),
          emailCode: Joi.string()
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
      handler: Handlers.transferSigningAdmin,
      notes: "企业主管理员转让",
      description: "企业主管理员转让",
      tags: ["api", "signing", "write"]
    }
  },
  {
    method: "GET",
    path: "/signing/signature",
    options: {
      auth: false,
      handler: Handlers.getSigningSignature,
      notes: "取得签名",
      description: "取得签名",
      tags: ["api", "signing", "get_signature"]
    }
  }
];
