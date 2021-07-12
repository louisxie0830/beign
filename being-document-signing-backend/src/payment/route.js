const Handlers = require("./handler");
const Joi = require("@hapi/joi")
module.exports = [
  {
    method: "GET",
    path: "/payment/methods",
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
      handler: Handlers.getMethods,
      notes: "返回支付方式列表",
      description: "返回支付方式列表",
      tags: ["api", "payment", "methods"]
    }
  },
  {
    method: "GET",
    path: "/payment/packages",
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
      handler: Handlers.getPackages,
      notes: "返回商品列表",
      description: "返回商品列表",
      tags: ["api", "payment", "packages"]
    }
  },
  {
    method: "POST",
    path: "/payment/create",
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
        payload: Joi.object({
          corpId: Joi.number()
            .required()
            .description("企业ID"),
          packageId: Joi.string()
            .required()
            .description("Package ID"),
          amount: Joi.number()
            .positive()
            .max(999)
            .description("购买数量"),
          method: Joi.string()
            .allow("happypay", "alipay")
            .description("支付方式"),
          remark: Joi.string()
            .allow("")
            .default("")
            .description("备注"),
          invoice: Joi.object({
            address: Joi.string()
              .allow("")
              .default("")
              .description("地址"),
            mobile: Joi.string()
              .allow("")
              .default("")
              .description("手机"),
            name: Joi.string()
              .allow("")
              .default("")
              .description("名字"),
            tax_id: Joi.string()
              .allow("")
              .default("")
              .description("税号"),
            title: Joi.string()
              .allow("")
              .default("")
              .description("抬头"),
            email: Joi.string()
              .allow("")
              .default("")
              .description("邮箱"),
            type: Joi.number()
              .allow(1, 2, 3)
              .required()
              .description("类型: 1捐赠，2二联，3三联")
          }).description("发票相关")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          data: Joi.string()
            .allow(null, "")
            .description("支付url")
        })
      },
      handler: Handlers.createOrder,
      notes: "创建订单",
      description: "创建订单",
      tags: ["api", "payment", "create"]
    }
  },
  {
    method: "POST",
    path: "/payment/cancel",
    options: {
      handler: Handlers.cancel,
      notes: "取消支付订单",
      description: "取消支付订单",
      tags: ["api", "payment", "pay"]
    }
  },
  {
    method: "POST",
    path: "/payment/callback/happypay",
    options: {
      auth: false,
      handler: Handlers.happypayCallback,
      notes: "支付乐回调",
      description: "支付乐回调",
      tags: ["api", "payment", "callback", "happypay"]
    }
  },{
    method: "POST",
    path: "/payment/callback/newebpay",
    options: {
      auth: false,
      handler: Handlers.newebpayCallback,
      notes: "信用卡回调",
      description: "信用卡回调",
      tags: ["api", "payment", "callback", "newebpay"]
    }
  },
  {
    method: "GET",
    path: "/payment/return/alipay",
    options: {
      auth: false,
      handler: Handlers.alipayReturnUrl,
      notes: "支付宝返回",
      description: "支付宝返回",
      tags: ["api", "payment", "return", "alipay"]
    }
  },
  {
    method: "POST",
    path: "/payment/callback/alipay",
    options: {
      auth: false,
      handler: Handlers.alipayCallback,
      notes: "支付宝回调",
      description: "支付宝回调",
      tags: ["api", "payment", "callback", "alipay"]
    }
  },
  {
    method: "POST",
    path: "/payment/refund",
    options: {
      auth: false,
      handler: Handlers.refund,
      notes: "退款",
      description: "退款",
      tags: ["api", "payment", "refund"]
    }
  },
  {
    method: "POST",
    path: "/payment/retry",
    options: {
      validate: {
        payload: Joi.object({
          orderNo: Joi.string()
            .required()
            .description("商家提供的訂單編號")
        })
      },
      handler: Handlers.retry,
      notes: "补单",
      description: "补单",
      tags: ["api", "payment", "retry"]
    }
  },
  {
    method: "GET",
    path: "/payment/status",
    options: {
      handler: Handlers.status,
      validate: {
        query: Joi.object({
          orderNo: Joi.string()
            .required()
            .description("订单编号")
        })
      },
      response: {
        schema: Joi.object({
          code: Joi.number().description("200 for success, other fail"),
          message: Joi.string().description("text message for response"),
          data: {
            orderNo: Joi.string().description("订单编号"),
            status: Joi.number().description("订单支付状态"),
            companyName: Joi.string().description("公司名称")
          }
        })
      },
      notes: "订单支付状态",
      description: "订单支付状态",
      tags: ["api", "payment", "status"]
    }
  },
  {
    method: "GET",
    path: "/payment/list",
    options: {
      handler: Handlers.list,
      notes: "订单列表",
      description: "订单列表",
      tags: ["api", "payment", "list"]
    }
  }
];
