const Joi = require("@hapi/joi");
const Handlers = require("./handler");
module.exports = [
  {
    method: "POST",
    path: "/invite/create",
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string()
            .lowercase()
            .email({
              minDomainSegments: 2
            })
            .required()
            .description("邮箱"),
          mobile: Joi.string()
            .required()
            .description("手机号"),
          companyId: Joi.number()
            .required()
            .description("公司ID"),
          departmentId: Joi.number().description("部门ID"),
          name: Joi.string()
            .required()
            .description("姓名"),
          country: Joi.string()
            .allow("", null)
            .description("国家代碼"),
          city: Joi.string()
            .allow("", null)
            .description("城市代碼"),
          positionName: Joi.string()
            .allow("")
            .default("")
            .description("城市代碼")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.inviteCreate,
      notes: "发送邀请注册的邮件",
      description: "发送邀请注册的邮件",
      tags: ["api", "email", "invite", "send"]
    }
  },
  {
    method: "get",
    path: "/invite/info",
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          inviteCode: Joi.string()
            .required()
            .description("inviteCode")
        })
      },
      handler: Handlers.inviteInfo,
      notes: "获取邀请信息",
      description: "获取邀请信息",
      tags: ["api", "info", "invite"]
    }
  }
];
