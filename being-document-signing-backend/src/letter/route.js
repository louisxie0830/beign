const BaseJoi = require("@hapi/joi");
const Handlers = require("./handler");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);
const Certification = require("./certification");
module.exports = [
  {
    method: "GET",
    path: "/letter/certification/info",
    handler: Certification.pdfView,
    options: {
      auth: false,
      notes: "取得签署html",
      description: "取得签署列表",
      tags: ["letter", "view"]
    }
  },
  {
    method: "GET",
    path: "/letter/list",
    handler: Handlers.getLetterList,
    options: {
      // auth: false,
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("userAuthToken:以Bearer 开头")
        }).options({
          allowUnknown: true
        }),
        query: Joi.object({
          type: Joi.number()
            .allow(1, 2, 3, 4, 5)
            .required()
            .description(
              "清单类型: 1待我簽署、2我發起的、3我已簽署、4接收副本、5歷史清單"
            ),
          status: Joi.number()
            .allow(0, 1, 2, 3, 4, "")
            .description(
              "签署状态: 0「待簽署」、1「已撤回」、2「簽署中」、3「已完成」、4「已拒絕」，如果取所有状态则不传"
            ),
          keyWord: Joi.string()
            .allow("")
            .description("搜索关键字"),
          start: Joi.number()
            .required()
            .description("分页参数start"),
          limit: Joi.number()
            .positive()
            .required()
            .description("分页参数limit"),
          beginDate: Joi.date()
            .format("YYYY-MM-DD")
            .allow("")
            .raw()
            .description("开始日期 YYYY-MM-DD"),
          endDate: Joi.date()
            .format("YYYY-MM-DD")
            .allow("")
            .raw()
            .description("结束日期 YYYY-MM-DD"),
          "tagIds[]": Joi.array()
            .items(Joi.number().description("id"))
            .single()
            .allow("")
            .description("标签id列表")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          data: Joi.array().items(
            Joi.object({
              id: Joi.number().description("LetterId"),
              title: Joi.string().description("标题"),
              companyName: Joi.string()
                .allow("")
                .description("发送者公司"),
              tagNames: Joi.array()
                .items(Joi.string().description("标签 名称"))
                .description("标签名称列表"),
              senderName: Joi.string()
                .allow("")
                .description("发送者姓名"),
              status: Joi.number()
                .allow(1, 2, 3, 4, 5)
                .description(
                  "文件状态: 1(過期)、2(簽署中、待簽署)、3(已完成)、4(已撤回)、5(已拒絕)"
                ),
              isSigning: Joi.number()
                .allow(0, 1, 2, 3, 4)
                .description(
                  "签署状态: 0「已發起」、1「已撤回」、2「等待中」、3「已簽署」、4「已拒絕」"
                ),
              read: Joi.number()
                .allow(0, 1)
                .description("读取状态：1(已读)，0(未读)"),
              expiredTime: Joi.date()
                .timestamp()
                .allow(null)
                .description("文件到期日期"),
              createTime: Joi.date()
                .timestamp()
                .description("创建时间")
            })
          )
        }).label("Result")
      },
      notes: "取得签署列表",
      description: "取得签署列表",
      tags: ["api", "letter", "list"]
    }
  },
  {
    method: "GET",
    path: "/letter/detail",
    handler: Handlers.getLetterDetail,
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
          letterId: Joi.number()
            .positive()
            .required()
            .description("Letter ID")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          data: Joi.object({
            id: Joi.number()
              .required()
              .description("ID"),
            title: Joi.string().description("标题"),
            status: Joi.number()
              .allow(1, 2, 3, 4, 5)
              .description(
                "签署状态: 1(過期)、2(簽署中、待簽署)、3(已完成)、4(已撤回)、5(已拒絕)"
              ),
            message: Joi.string()
              .allow("")
              .description("消息"),
            comment: Joi.string()
              .allow("")
              .description("拒绝签署后的评论"),
            senderId: Joi.number().description("发送者ID"),
            tagList: Joi.array().items(
              Joi.object({
                tagId: Joi.number().description("标签ID"),
                tagName: Joi.string().description("标签名称")
              })
            ),
            senderName: Joi.string()
              .allow("")
              .description("发送者名字"),
            senderEmail: Joi.string()
              .allow("")
              .description("发送者邮箱"),
            createTime: Joi.date()
              .timestamp()
              .description("文件創建日期"),
            expiredTime: Joi.date()
              .timestamp()
              .allow(null)
              .description("文件到期日期"),
            withdrawTime: Joi.date()
              .timestamp()
              .allow(null)
              .description("撤回日期"),
            companyId: Joi.number()
              .required()
              .description("公司id"),
            fileList: Joi.array().items(
              Joi.object({
                fileId: Joi.number().description("文件ID"),
                fileName: Joi.string().description("文件标题"),
                fileType: Joi.string().description("文件类型"),
                url: Joi.string().description("檔案url"),
                signatures: Joi.array().items(
                  Joi.object({
                    page: Joi.number().required(),
                    pageOffsetX: Joi.number().required(),
                    pageOffsetY: Joi.number().required(),
                    color: Joi.string().required(),
                    content: Joi.string().required(),
                    zoom: Joi.number().allow(0, "", null)
                  })
                )
              })
            ),
            signerList: Joi.array().items(
              Joi.object({
                companyName: Joi.string()
                  .allow("")
                  .description("发送者公司"),
                senderName: Joi.string()
                  .allow("")
                  .description("发送者姓名"),
                email: Joi.string().description("发送者邮箱"),
                createTime: Joi.date().description("创建时间"),
                status: Joi.number()
                  .allow(1, 2, 3)
                  .description(
                    "签署状态: 1「等待中」、2「已簽署」、3「已拒絕」"
                  ),
                order: Joi.number().description("签署顺序"),
                comment: Joi.string()
                  .allow("")
                  .description("评论"),
                signTime: Joi.date()
                  .allow("")
                  .description("签署时间"),
                type: Joi.string()
                  .allow("SIGN", "APPROVAL")
                  .default("SIGN")
                  .description("签署or同意"),
                corpId: Joi.number()
                  .default(0)
                  .description("签署身份，0: 个人，n: 公司ID")
              })
            )
          })
        }).label("Result")
      },
      notes: "签署详情",
      description: "签署详情",
      tags: ["api", "letter", "detail"]
    }
  },
  {
    method: "POST",
    path: "/letter/sign",
    handler: Handlers.signLetter,
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
          letterId: Joi.number()
            .required()
            .description("签署档案ID"),
          corpId: Joi.number()
            .required()
            .description("签署身份，0: 个人，n: 公司ID"),
          comment: Joi.string()
            .allow("")
            .description("评论"),
          signatures: Joi.array().items(
            Joi.object({
              fileUrl: Joi.string().required(),
              page: Joi.number().required(),
              pageOffsetX: Joi.number().required(),
              pageOffsetY: Joi.number().required(),
              color: Joi.string().required(),
              content: Joi.string().required(),
              zoom: Joi.number().allow(0, "", null)
            })
          )
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      notes: "签署档案",
      description: "签署档案",
      tags: ["api", "letter", "sign", "write"]
    }
  },
  {
    method: "POST",
    path: "/letter/decline",
    handler: Handlers.postLetterDecline,
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
          letterId: Joi.number()
            .required()
            .description("签署档案ID"),
          corpId: Joi.number()
            .required()
            .description("签署身份，0: 个人，n: 公司ID"),
          comment: Joi.string()
            .allow("")
            .description("评论")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      notes: "拒绝签署档案",
      description: "拒绝签署档案",
      tags: ["api", "letter", "sign", "write"]
    }
  },
  {
    method: "POST",
    path: "/letter/withdraw",
    handler: Handlers.withdrawLetter,
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
          letterId: Joi.number()
            .required()
            .description("签署档案ID"),
          comment: Joi.string()
            .allow("")
            .description("撤回签署的评论"),
          corpId: Joi.number()
            .required()
            .description("签署身份，0: 个人，n: 公司ID")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      notes: "撤回签署档案",
      description: "撤回签署档案",
      tags: ["api", "letter", "sign", "write"]
    }
  },
  {
    method: "POST",
    path: "/letter/create",
    handler: Handlers.createLetter,
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
          fileList: Joi.array().items(
            Joi.object({
              fileName: Joi.string()
                .required()
                .description("文件名"),
              fileType: Joi.string()
                .required()
                .description("文件类型"),
              fileUrl: Joi.string()
                .required()
                .description("文件URL"),
              fileSize: Joi.number()
                .required()
                .description("文件大小"),
              fileHash: Joi.string()
                .required()
                .description("文件hash"),
              signature: Joi.object({
                page: Joi.number().required(),
                pageOffsetX: Joi.number().required(),
                pageOffsetY: Joi.number().required(),
                color: Joi.string().required(),
                content: Joi.string().required(),
                zoom: Joi.number().allow(0, "", null)
              })
            })
          ),
          tagNames: Joi.array()
            .items(Joi.string().description("标签 name"))
            .description("标签name列表"),
          corpId: Joi.number()
            .required()
            .description("签署身份，0: 个人，n: 公司ID"),
          emailSwitch: Joi.boolean()
            .default(false)
            .description("签署状态通知"),
          smsNotify: Joi.number()
            .required()
            .default(0)
            .description("是否接收SMS通知,0否，1是"),
          viewerList: Joi.array()
            .items(
              Joi.object({
                email: Joi.string().description("阅览人 email"),
                name: Joi.string().description("阅览人 名字")
              })
            )
            .description("阅览人列表 email List"),
          signerList: Joi.array()
            .items(
              Joi.object({
                email: Joi.string().description("签署人 email"),
                name: Joi.string().description("签署人 名字"),
                type: Joi.string()
                  .allow("SIGN", "APPROVAL")
                  .default("SIGN")
                  .description("签署or同意"),
                corpId: Joi.number()
                  .default(0)
                  .description("签署身份，0: 个人，n: 公司ID")
              })
            )
            .required()
            .description("签署人列表 email List"),
          title: Joi.string()
            .required()
            .description("标题"),
          message: Joi.string()
            .allow("")
            .description("签署信息"),
          duteDate: Joi.date()
            .iso()
            .description("签署有效日期"),
          creatorSign: Joi.boolean()
            .default(0)
            .allow(0, 1, 3)
            .description("發起人簽署或者同意")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      notes: "创建签署档案",
      description: "创建签署档案",
      tags: ["api", "letter", "sign", "write"]
    }
  },
  {
    method: "POST",
    path: "/letter/createDraft",
    handler: Handlers.createLetterDraft,
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
          fileList: Joi.array()
            .allow("")
            .items(
              Joi.object({
                fileName: Joi.string().description("文件名"),
                fileType: Joi.string().description("文件类型"),
                fileUrl: Joi.string().description("文件URL"),
                fileSize: Joi.number().description("文件大小"),
                fileHash: Joi.string().description("文件hash"),
                signature: Joi.object({
                  page: Joi.number().required(),
                  pageOffsetX: Joi.number().required(),
                  pageOffsetY: Joi.number().required(),
                  content: Joi.string().required(),
                  color: Joi.string().required(),
                  zoom: Joi.number().allow(0, "", null)
                })
              })
            ),
          tagNames: Joi.array()
            .allow("")
            .items(Joi.string().description("标签 name"))
            .description("标签name列表"),
          corpId: Joi.number()
            .allow("")
            .description("签署身份，0: 个人，n: 公司ID"),
          emailSwitch: Joi.boolean()
            .default(false)
            .description("签署状态通知"),
          smsNotify: Joi.number()
            .allow("")
            .default(0)
            .description("是否接收SMS通知,0否，1是"),
          viewerList: Joi.array()
            .items(
              Joi.object({
                email: Joi.string().description("阅览人 email"),
                name: Joi.string().description("阅览人 名字")
              })
            )
            .description("阅览人列表 email List"),
          signerList: Joi.array()
            .items(
              Joi.object({
                email: Joi.string().description("签署人 email"),
                name: Joi.string().description("签署人 名字"),
                type: Joi.string()
                  .allow("SIGN", "APPROVAL")
                  .default("SIGN")
                  .description("签署or同意"),
                corpId: Joi.number()
                  .default(0)
                  .description("签署身份，0: 个人，n: 公司ID"),
                companyName: Joi.string().description("公司名称"),
                typeName: Joi.string().description("同意或者签署")
              })
            )
            .allow("")
            .description("签署人列表 email List"),
          title: Joi.string()
            .allow("")
            .description("标题"),
          message: Joi.string()
            .allow("")
            .description("签署信息"),
          duteDate: Joi.date()
            .iso()
            .description("签署有效日期"),
          creatorSign: Joi.number()
            .default(0)
            .allow(0, 1, 3)
            .description("發起人簽署")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response")
        }).label("Result")
      },
      notes: "创建签署档案草稿",
      description: "创建签署档案草稿",
      tags: ["api", "letter", "sign", "write", "draft"]
    }
  },
  {
    method: "GET",
    path: "/letter/draft",
    handler: Handlers.letterDraft,
    options: {
      // auth: false,
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
            fileList: Joi.array()
              .allow("")
              .items(
                Joi.object({
                  fileName: Joi.string().description("文件名"),
                  fileType: Joi.string().description("文件类型"),
                  fileUrl: Joi.string().description("文件URL"),
                  fileSize: Joi.number().description("文件大小"),
                  fileHash: Joi.string().description("文件hash"),
                  signature: Joi.object({
                    page: Joi.number(),
                    pageOffsetX: Joi.number(),
                    pageOffsetY: Joi.number(),
                    content: Joi.string(),
                    color: Joi.string(),
                    zoom: Joi.number().allow(0, "", null)
                  })
                })
              ),
            tagNames: Joi.array()
              .allow("")
              .items(Joi.string().description("标签 name"))
              .description("标签name列表"),
            corpId: Joi.number()
              .allow("")
              .description("签署身份，0: 个人，n: 公司ID"),
            emailSwitch: Joi.number()
              .allow("")
              .description("签署状态通知"),
            viewerList: Joi.array()
              .allow("")
              .items(
                Joi.object({
                  email: Joi.string().description("阅览人 email"),
                  name: Joi.string().description("阅览人 名字")
                })
              )
              .description("阅览人列表 email List"),
            signerList: Joi.array()
              .items(
                Joi.object({
                  email: Joi.string().description("签署人 email"),
                  name: Joi.string().description("签署人 名字"),
                  type: Joi.string()
                    .allow("SIGN", "APPROVAL")
                    .default("SIGN")
                    .description("签署or同意"),
                  corpId: Joi.number()
                    .default(0)
                    .description("签署身份，0: 个人，n: 公司ID"),
                  companyName: Joi.string().description("公司名称"),
                  typeName: Joi.string().description("同意或者签署")
                })
              )
              .allow("")
              .description("签署人列表 email List"),
            title: Joi.string()
              .allow("")
              .description("标题"),
            message: Joi.string()
              .allow("")
              .description("签署信息"),
            duteDate: Joi.date()
              .timestamp()
              .allow(null, "")
              .description("签署有效日期"),
            smsNotify: Joi.number()
              .allow("")
              .default(0)
              .description("是否接收SMS通知,0否，1是"),
            creatorSign: Joi.number()
              .default(0)
              .allow(0, 1, 3)
              .description("發起人簽署")
          })
        }).label("Result")
      },
      notes: "签署档案草稿详情",
      description: "签署档案草稿详情",
      tags: ["api", "letter", "draft", "detail"]
    }
  },
  {
    method: "GET",
    path: "/letter/status",
    handler: Handlers.letterStatus,
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
            pending: Joi.number()
              .required()
              .description("待签署数量"),
            myOwn: Joi.number()
              .required()
              .description("我发起签署数量"),
            sendToMe: Joi.number()
              .required()
              .description("接收副本")
          })
        }).label("Result")
      },
      notes: "首页签署档案状态",
      description: "首页签署档案状态",
      tags: ["api", "letter", "sign"]
    }
  },
  {
    method: "GET",
    path: "/letter/download",
    handler: Handlers.letterDownload,
    options: {
      validate: {
        query: Joi.object({
          key: Joi.string()
            .required()
            .description("需要下载的文件名"),
          accessToken: Joi.string().description("access_token")
        })
      },
      notes: "档案下载",
      description: "档案下载",
      tags: ["api", "letter", "download"]
    }
  },
  {
    method: "GET",
    path: "/letter/preview",
    handler: Handlers.letterPreview,
    options: {
      // auth: false,
      validate: {
        query: Joi.object({
          key: Joi.string()
            .required()
            .description("需要下载的文件名"),
          accessToken: Joi.string().description("access_token"),
          access: Joi.string()
            .allow("")
            .description("允许直接预览，而不必等创建完成")
        })
      },
      notes: "档案预览",
      description: "档案预览",
      tags: ["api", "letter", "preview"]
    }
  },
  {
    method: "POST",
    path: "/letter/upload",
    handler: Handlers.fileUpload,
    options: {
      // auth: false,
      timeout: {
        socket: 18005000
      },
      payload: {
        output: "file",
        allow: "multipart/form-data", // important
        maxBytes: 31457280, // 104857600, // 100 MB -> 30MB
        timeout: 18000000 // 30 minutes
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form"
        }
      },
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("userAuthToken:以Bearer 开头")
        }).options({
          allowUnknown: true
        }),
        payload: Joi.object({
          version: Joi.number()
            .allow("")
            .description("密码版本"),
          file: Joi.any()
            .meta({
              swaggerType: "file"
            })
            .required()
            .description("file")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number()
            .required()
            .description("200 for success, other fail"),
          message: Joi.string()
            .required()
            .description("text message for response"),
          data: Joi.object({
            fileSize: Joi.number().description("文件大小"),
            fileName: Joi.string().description("文件名"),
            fileType: Joi.string().description("文件类型"),
            fileUrl: Joi.string().description("文件URL"),
            fileHash: Joi.string().description("文件HASH")
          })
        }).label("Result")
      },
      notes: "签署档案上传",
      description: "签署档案上传",
      tags: ["api", "letter", "upload"]
    }
  },
  {
    method: "POST",
    path: "/letter/verify",
    handler: Handlers.fileVerify,
    options: {
      // auth: false,
      timeout: {
        socket: 18005000
      },
      payload: {
        output: "file",
        allow: "multipart/form-data", // important
        maxBytes: 31457280, // 104857600, // 100 MB -> 30MB
        timeout: 18000000 // 30 minutes
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form"
        }
      },
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .description("userAuthToken:以Bearer 开头")
        }).options({
          allowUnknown: true
        }),
        payload: Joi.object({
          file: Joi.any()
            .meta({
              swaggerType: "file"
            })
            .required()
            .description("file")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number()
            .required()
            .description("200 for success, other fail"),
          message: Joi.string()
            .required()
            .description("text message for response"),
          data: Joi.object({
            isChanged: Joi.boolean()
              .required()
              .description(
                "true/false(true: 文件被修改了,false: 文件未被修改)"
              ),
            signStatus: Joi.number()
              .required()
              .description("簽署狀態")
          })
        }).label("Result")
      },
      notes: "签署档案验证",
      description: "签署档案验证",
      tags: ["api", "letter", "verify"]
    }
  },
  {
    method: "GET",
    path: "/certification/info",
    handler: Certification.letterDownload,
    options: {
      validate: {
        query: Joi.object({
          letterId: Joi.number()
            .required()
            .description("签署档案的id"),
          accessToken: Joi.string().description("access_token")
        })
      },
      notes: "认证档案下载",
      description: "认证档案下载",
      tags: ["api", "certification", "download"]
    }
  },
  {
    method: "GET",
    path: "/certification/preview",
    handler: Certification.letterPreview,
    options: {
      // auth: false,
      validate: {
        query: Joi.object({
          letterId: Joi.number()
            .required()
            .description("签署档案的id"),
          accessToken: Joi.string().description("access_token")
        })
      },
      notes: "认证档案预览",
      description: "认证档案预览",
      tags: ["api", "certification", "preview"]
    }
  },
  {
    method: "GET",
    path: "/certification/list",
    handler: Certification.list,
    options: {
      validate: {
        query: Joi.object({
          companyId: Joi.number()
            .allow("")
            .description("公司id"),
          type: Joi.number()
            .required()
            .allow(1, 2, 3)
            .description("类型：1(发起签署)、2(已签署)、3(已同意)"),
          start: Joi.number()
            .required()
            .description("分页参数start"),
          limit: Joi.number()
            .positive()
            .required()
            .description("分页参数limit"),
          beginDate: Joi.date()
            .format("YYYY-MM-DD")
            .allow("")
            .raw()
            .description("开始日期 YYYY-MM-DD"),
          endDate: Joi.date()
            .format("YYYY-MM-DD")
            .allow("")
            .raw()
            .description("结束日期 YYYY-MM-DD")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number()
            .required()
            .description("200 for success, other fail"),
          message: Joi.string()
            .required()
            .description("text message for response"),
          data: Joi.array().items(
            Joi.object({
              id: Joi.number().description("档案id"),
              title: Joi.string().description("档案名"),
              completeTime: Joi.date()
                .iso()
                .allow("", null)
                .description("签署完成时间")
            })
          )
        }).label("Result")
      },
      notes: "认证档案列表",
      description: "认证档案列表",
      tags: ["api", "certification", "list"]
    }
  },
  {
    method: "GET",
    path: "/sms/notify",
    handler: Handlers.smsNotify,
    options: {
      auth: false,
      notes: "簡訊狀態更新",
      description: "簡訊狀態更新",
      tags: ["sms", "notify"]
    }
  },
  {
    method: "GET",
    path: "/sms/check",
    handler: Handlers.smsCheck,
    options: {
      auth: false,
      notes: "簡訊狀態查詢",
      description: "簡訊狀態查詢",
      tags: ["sms", "check"]
    }
  }
];
