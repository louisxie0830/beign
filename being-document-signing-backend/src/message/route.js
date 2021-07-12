const Joi = require("@hapi/joi")
const Handlers = require("./handler");

module.exports = [
  {
    method: "POST",
    path: "/message/add",
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          username: Joi.string()
            .description("姓名/公司名称"),
          email: Joi.string()
            .lowercase()
            .email({
              minDomainSegments: 2
            })
            .description("邮箱"),
          message: Joi.string()
            .description("留言内容")
        })
      },
      handler: Handlers.addMessage,
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      notes: "新增客户留言",
      description: "新增客户留言",
      tags: ["api", "message", "custom"]
    }
  }
];
