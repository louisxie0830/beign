const Joi = require("@hapi/joi")
const Handlers = require("./handler");
module.exports = [
  {
    method: "GET",
    path: "/contact/list",
    handler: Handlers.getContactList,
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
          keyword: Joi.string()
            .allow("")
            .description("查询条件:name or email"),
          start: Joi.number()
            .required()
            .description("分页参数start"),
          limit: Joi.number()
            .positive()
            .required()
            .description("分页参数limit")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          data: Joi.array().items(
            Joi.object({
              id: Joi.number()
                .required()
                .description("Contract ID"),
              name: Joi.string()
                .required()
                .description("用户名字"),
              email: Joi.string()
                .required()
                .description("用户邮箱")
            })
          )
        }).label("Result")
      },
      notes: "取得联络人列表",
      description: "取得联络人列表",
      tags: ["api", "contact", "list"]
    }
  },
  {
    method: "POST",
    path: "/contact/delete",
    handler: Handlers.postContactDelete,
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
          contractId: Joi.number()
            .positive()
            .required()
            .description("Contract ID")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      notes: "删除联络人",
      description: "删除联络人",
      tags: ["api", "contact", "delete"]
    }
  },
  {
    method: "POST",
    path: "/contact/add",
    handler: Handlers.postContactAdd,
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
          name: Joi.string()
            .required()
            .description("用户名字"),
          email: Joi.string()
            .lowercase()
            .email({
              minDomainSegments: 2
            })
            .required()
            .description("用户邮箱")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          data: Joi.object({
            id: Joi.number()
              .required()
              .description("Contract ID"),
            name: Joi.string()
              .required()
              .description("用户名字"),
            email: Joi.string()
              .required()
              .description("用户邮箱")
          })
        }).label("Result")
      },
      notes: "新增联络人",
      description: "新增联络人",
      tags: ["api", "contact", "add"]
    }
  },
  {
    method: "GET",
    path: "/contact/signingCrops",
    options: {
      auth: false,
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("userAuthToken:以Bearer 开头")
        }).options({
          allowUnknown: true
        }),
        query: Joi.object({
          email: Joi.string()
            .required()
            .description("用户邮箱")
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
                id: Joi.number()
                  .required()
                  .description("企业ID")
              })
            )
            .description("企业列表")
        }).label("Result")
      },
      notes: "用户可用的企业列表",
      description: "用户可用的企业列表",
      tags: ["api", "signingCrops"]
    }
  }
];
