const Joi = require("@hapi/joi");
const Handlers = require("./handler");
module.exports = [
  {
    method: "POST",
    path: "/organization/company/create",
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string()
            .required()
            .description("公司名稱")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.companyCreate,
      notes: "创建公司",
      description: "创建公司",
      tags: ["api", "create", "company"]
    }
  },
  {
    method: "GET",
    path: "/organization/departments",
    options: {
      validate: {
        query: Joi.object({
          companyId: Joi.number()
            .required()
            .description("公司id")
        })
      },
      response: {
        schema: Joi.object({
          data: Joi.array().items(
            Joi.object({
              id: Joi.number()
                .required()
                .description("部门id"),
              name: Joi.string()
                .required()
                .description("部门名字"),
              adminId: Joi.number().description("管理员id"),
              adminName: Joi.string()
                .allow("", null)
                .description("管理员姓名")
            })
          ),
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.departmentList,
      notes: "查询公司名下所有部门",
      description: "查询公司名下所有部门",
      tags: ["api", "list", "departments"]
    }
  },
  {
    method: "POST",
    path: "/organization/company/sendEmail",
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string()
            .required()
            .description("公司名稱"),
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
      handler: Handlers.companySendEmail,
      notes: "发送注册公司的邮件",
      description: "发送注册公司的邮件",
      tags: ["api", "email", "company", "send"]
    }
  },
  {
    method: "POST",
    path: "/organization/department/create",
    options: {
      validate: {
        payload: Joi.object({
          companyId: Joi.number()
            .required()
            .description("公司id"),
          adminId: Joi.number()
            .allow("", null)
            .description("部门管理员id"),
          name: Joi.string()
            .required()
            .description("部门名称")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.departmentCreate,
      notes: "创建部门",
      description: "创建部门",
      tags: ["api", "create", "department"]
    }
  },
  {
    method: "POST",
    path: "/organization/department/update",
    options: {
      validate: {
        payload: Joi.object({
          departmentId: Joi.number()
            .required()
            .description("部门id"),
          adminId: Joi.number()
            .required()
            .description("部门管理员id"),
          name: Joi.string()
            .required()
            .description("部门名称")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.departmentUpdate,
      notes: "更新部门信息",
      description: "更新部门信息",
      tags: ["api", "update", "department"]
    }
  },
  {
    method: "POST",
    path: "/organization/department/delete",
    options: {
      validate: {
        payload: Joi.object({
          departmentId: Joi.number()
            .required()
            .description("部门id")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.departmentDelete,
      notes: "删除部门",
      description: "删除部门",
      tags: ["api", "delete", "department"]
    }
  },
  {
    method: "GET",
    path: "/organization/department/query",
    options: {
      validate: {
        query: Joi.object({
          departmentId: Joi.number()
            .required()
            .description("部门id"),
          companyId: Joi.number()
            .required()
            .description("公司id"),
        })
      },
      response: {
        schema: Joi.object({
          data: Joi.array().items(
            Joi.object({
              isAdmin: Joi.boolean()
                .required()
                .description("是否为管理员"),
              id: Joi.number()
                .required()
                .description("id"),
              name: Joi.string()
                .required()
                .description("名字"),
              email: Joi.string()
                .required()
                .description("email"),
              mobile: Joi.string()
                .required()
                .description("mobile")
            })
          ),
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.departmentQuery,
      notes: "查询部门所有人员",
      description: "查询部门所有人员",
      tags: ["api", "query", "department"]
    }
  },
  {
    method: "GET",
    path: "/user/userinfo/query",
    options: {
      validate: {
        query: Joi.object({
          companyId: Joi.number()
            .required()
            .description("公司id"),
          userId: Joi.number()
            .required()
            .description("用户id")
        })
      },
      response: {
        schema: Joi.object({
          data: Joi.object({
            isAdmin: Joi.boolean()
              .allow("")
              .description("是否管理员"),
            name: Joi.string()
              .allow("")
              .description("部门人员的名称"),
            email: Joi.string().description("email"),
            mobile: Joi.string().description("电话"),
            userId: Joi.number().description("用户id"),
            city: Joi.string()
              .allow("")
              .description("城市"),
            country: Joi.string()
              .allow("")
              .description("国家"),
            positionName: Joi.string()
              .allow("")
              .description("职位"),
            departmentId: Joi.number()
              .allow("")
              .description("部门id")
          }),
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.departmentUserInfo,
      notes: "查询本公司其他人员信息",
      description: "查询本公司其他人员信息",
      tags: ["api", "query", "userinfo", "department"]
    }
  },
  {
    method: "POST",
    path: "/user/userinfo/updateOrCreate",
    options: {
      validate: {
        payload: Joi.object({
          companyId: Joi.number()
            .required()
            .description("公司id"),
          userId: Joi.number()
            .required()
            .description("用户id"),
          departmentId: Joi.number()
            .required()
            .description("部门id"),
          positionName: Joi.string()
              .allow("")
              .description("职位"),
          city: Joi.string()
            .allow("", null)
            .description("城市"),
          country: Joi.string()
            .allow("", null)
            .description("国家"),
          isAdmin: Joi.boolean()
            .allow("", null)
            .default(false)
            .description("是否指定为管理员")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.departmentInfoUpdate,
      notes: "更新或者创建本公司其他人员部门信息",
      description: "更新或者创建本公司其他人员部门信息",
      tags: ["api", "update", "userinfo", "department", "create"]
    }
  },
  {
    method: "POST",
    path: "/organization/department/resetAdmin",
    options: {
      validate: {
        payload: Joi.object({
          adminId: Joi.number()
            .required()
            .description("部门管理员id"),
          departmentId: Joi.number()
            .required()
            .description("公司id")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      handler: Handlers.resetAdmin,
      notes: "重新设置部门管理员",
      description: "重新设置部门管理员",
      tags: ["api", "department", "setAdmin"]
    }
  }
];
