const Joi = require("@hapi/joi")
const Handlers = require("./handler");
module.exports = [
  {
    method: "GET",
    path: "/ding/active",
    handler: Handlers.activeSuite,
    options: {
      auth: false,
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      notes: "激活套件接口",
      description: "激活套件接口",
      tags: ["api", "ding_active"]
    }
  },
  {
    method: "GET",
    path: "/ding/config",
    handler: Handlers.getDingConfig,
    options: {
      auth: false,
      validate: {
        query: {
          corpId: Joi.string()
            .required()
            .description("钉钉企业ID"),
          url: Joi.string()
            .required()
            .description("当前页面URL")
        }
      },
      response: {
        schema: {
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          data: Joi.object({
            signature: Joi.string(),
            nonceStr: Joi.string(),
            timeStamp: Joi.number(),
            agentId: Joi.number(),
            corpId: Joi.string()
          })
            .description("钉钉登入配置参数")
            .label("Result")
        }
      },
      notes: "取得当前页面钉钉登入配置参数",
      description: "取得当前页面钉钉登入配置参数",
      tags: ["api", "ding_config"]
    }
  },
  {
    method: "POST",
    path: "/ding/login",
    handler: Handlers.login,
    options: {
      auth: false,
      validate: {
        payload: {
          code: Joi.string()
            .required()
            .description("免登授权码"),
          corpId: Joi.string()
            .required()
            .description("钉钉企业ID")
        }
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          token: Joi.string().description("API token"),
          lang: Joi.string()
            .allow("")
            .description("user's default language setting")
        }).label("Result")
      },
      notes: "钉钉用户登入",
      description: "钉钉用户登入",
      tags: ["api", "ding_login"]
    }
  }
];
