const Boom = require("@hapi/boom");
const Axios = require("axios");
const Uuidv4 = require("uuid/v4");
const BigNumber = require("bignumber.js");
const Moment = require("moment");
const ErrorCodes = require("../libs/errorCodes");
const HappyPayUtil = require("../libs/happy-pay-util");
const AliPayUtil = require("../libs/alipay-util");
const Packages = require("./config.json");
const CreateOrderHtml = require("./createOrder");
const SHA256 = require("crypto-js/sha256");
const BAPLAY_PAY_API = process.env.BAPLAY_PAY_API;
const CN_WEB_BASE_URL =
  process.env.CN_WEB_BASE_URL ||
  `https://cn-frontend-signing-test.beingtech.org`;
const WEB_BASE_URL =
  process.env.WEB_BASE_URL || `https://tw-frontend-signing-test.beingtech.org`;
BigNumber.config({
  DECIMAL_PLACES: 8
});
const calculateCheckValue = (price, id) => {
  const vString =
    `HashKey=${process.env.NEWEBPAY_HASH_KEY}&` +
    `Amt=${price}&` +
    `MerchantID=${process.env.MERCHANT_ID}&` +
    `MerchantOrderNo=${id}&` +
    `TimeStamp=${id}&` +
    `Version=${process.env.NEWEBPAY_VERSION}&` +
    `HashIV=${process.env.NEWEBPAY_HASH_IV}`;
  return SHA256(vString)
    .toString()
    .toUpperCase();
};
async function checkAndSaveNewebPayOrder(conn, orderNo, tradeNo, tradeStatus) {
  const queryOrderSql = "select * from order_list where order_id = ?";
  const [orderRows] = await conn.query(queryOrderSql, [orderNo]);
  const order = orderRows[0];
  if (!order) {
    console.log("neweb_pay_notfound", orderNo);
    return {
      code: 404,
      message: "訂單不存在"
    };
  }

  if (order.order_status !== 0) {
    console.log("neweb_pay_duplicate", orderNo);
    return {
      code: 200,
      message: "已處理"
    };
  }
  const pkg = Packages.packages.filter(i => i.id === order.package_id)[0];
  if (!pkg) {
    return {
      code: 97001,
      message: ErrorCodes["97001"]
    };
  }

  const queryCompanySql = "select * from company where id = ? and status = 1";
  const [companyRow] = await conn.query(queryCompanySql, [order.company_id]);
  const companyInfo = companyRow[0];
  if (!companyInfo) {
    return {
      code: 97002,
      message: ErrorCodes["97002"]
    };
  }

  // const sale = await AliPayUtil.queryOrder(orderNo);
  // console.log("neweb_checkOrderDetail", sale);
  // if (!sale || !sale.code || sale.code !== "10000") {
  //   return {
  //     code: 97003,
  //     message: ErrorCodes["97003"]
  //   };
  // }

  // const checkOrderDetail = await HappyPayUtil.queryPayeeOrder(orderNo);
  // if (
  //   checkOrderDetail === null ||
  //   checkOrderDetail.totalCount <= 0 ||
  //   checkOrderDetail.salesList.length <= 0
  // ) {
  //   return {
  //     code: 97003,
  //     message: ErrorCodes["zh_cn"]["97003"]
  //   };
  // }

  // const sale = checkOrderDetail.salesList[0];
  if (tradeNo) {
    const updateOrderSql =
      "update order_list set payment_order_id = ?, modified_at = ? where order_id = ?";
    console.log("updateOrderId", tradeNo, new Date(), orderNo);
    await conn.query(updateOrderSql, [tradeNo, new Date(), orderNo]);
  }
  const updateOrderStatusSql =
    "update order_list set payment_result = ? , order_status = ? , modified_at = ? where order_id = ?";
  if (orderNo) {
    if (tradeStatus === "SUCCESS") {
      let signingQuota = companyInfo.signing_quota || 0;
      let signingRemain = companyInfo.signing_remain || 0;
      if (signingRemain <= 0) {
        signingQuota = pkg.offer;
        signingRemain = pkg.offer;
      } else {
        signingQuota = signingQuota + pkg.offer;
        signingRemain = signingRemain + pkg.offer;
      }

      const updateCompanyQuota =
        "update company set signing_quota = ?, signing_remain = ? where id = ? and status = 1";
      await conn.query(updateOrderStatusSql, [
        tradeStatus,
        1,
        new Date(),
        orderNo
      ]);
      console.log(
        "update_company",
        signingQuota,
        signingRemain,
        order.company_id
      );
      await conn.query(updateCompanyQuota, [
        signingQuota,
        signingRemain,
        order.company_id
      ]);
      return {
        code: 200,
        message: "success"
      };
    }
  }
  await conn.query(updateOrderStatusSql, [tradeStatus, 2, new Date(), orderNo]);
  return {
    code: 200,
    message: "error"
  };
}
async function checkAndSaveAliPayOrder(conn, orderNo) {
  const queryOrderSql = "select * from order_list where order_id = ?";
  const [orderRows] = await conn.query(queryOrderSql, [orderNo]);
  const order = orderRows[0];
  if (!order) {
    console.log("ali_pay_notfound", orderNo);
    return {
      code: 404,
      message: "订单不存在"
    };
  }

  if (order.order_status !== 0) {
    console.log("ali_pay_duplicate", orderNo);
    return {
      code: 200,
      message: "已经处理"
    };
  }
  const pkg = Packages.packages.filter(i => i.id === order.package_id)[0];
  if (!pkg) {
    return {
      code: 97001,
      message: ErrorCodes["97001"]
    };
  }

  const queryCompanySql = "select * from company where id = ? and status = 1";
  const [companyRow] = await conn.query(queryCompanySql, [order.company_id]);
  const companyInfo = companyRow[0];
  if (!companyInfo) {
    return {
      code: 97002,
      message: ErrorCodes["97002"]
    };
  }

  const sale = await AliPayUtil.queryOrder(orderNo);
  console.log("ALI_checkOrderDetail", sale);
  if (!sale || !sale.code || sale.code !== "10000") {
    return {
      code: 97003,
      message: ErrorCodes["97003"]
    };
  }

  const status = sale.trade_status;
  const paymentOrderId = sale.trade_no;
  if (paymentOrderId) {
    const updateOrderSql =
      "update order_list set payment_order_id = ?, modified_at = ? where order_id = ?";
    console.log("updateOrderId", paymentOrderId, new Date(), orderNo);
    await conn.query(updateOrderSql, [paymentOrderId, new Date(), orderNo]);
  }
  const updateOrderStatusSql =
    "update order_list set payment_result = ? , order_status = ? , modified_at = ? where order_id = ?";
  const num1 = new BigNumber(sale.total_amount);
  const num2 = new BigNumber(order.total_price);
  if (sale && sale.out_trade_no === orderNo && num1.isEqualTo(num2)) {
    if (status === "WAIT_BUYER_PAY") {
      return {
        code: 200,
        message: "WAIT_BUYER_PAY"
      };
    }
    if (status === "TRADE_SUCCESS" || status === "TRADE_FINISHED") {
      let signingQuota = companyInfo.signing_quota || 0;
      let signingRemain = companyInfo.signing_remain || 0;
      if (signingRemain <= 0) {
        signingQuota = pkg.offer;
        signingRemain = pkg.offer;
      } else {
        signingQuota = signingQuota + pkg.offer;
        signingRemain = signingRemain + pkg.offer;
      }

      const updateCompanyQuota =
        "update company set signing_quota = ?, signing_remain = ? where id = ? and status = 1";
      console.log("update_order_success", status, 1, new Date(), orderNo);
      await conn.query(updateOrderStatusSql, [status, 1, new Date(), orderNo]);
      console.log(
        "update_company",
        signingQuota,
        signingRemain,
        order.company_id
      );
      await conn.query(updateCompanyQuota, [
        signingQuota,
        signingRemain,
        order.company_id
      ]);
      return {
        code: 200,
        message: "success"
      };
    }
  }
  console.log("update_order_fail", status, 2, new Date(), orderNo);
  await conn.query(updateOrderStatusSql, [status, 2, new Date(), orderNo]);
  return {
    code: 200,
    message: "error"
  };
}
async function checkAndSaveHappyPayOrder(conn, orderNo) {
  const queryOrderSql = "select * from order_list where order_id = ?";
  const [orderRows] = await conn.query(queryOrderSql, [orderNo]);
  const order = orderRows[0];
  if (!order) {
    console.log("happy_pay_notfound", orderNo);
    return {
      code: 404,
      message: "订单不存在"
    };
  }

  if (order.order_status !== 0) {
    console.log("happy_pay_duplicate", orderNo);
    return {
      code: 200,
      message: "已经处理"
    };
  }
  const pkg = Packages.packages.filter(i => i.id === order.package_id)[0];
  if (!pkg) {
    return {
      code: 97001,
      message: ErrorCodes["zh_cn"]["97001"]
    };
  }

  const queryCompanySql = "select * from company where id = ? and status = 1";
  const [companyRow] = await conn.query(queryCompanySql, [order.company_id]);
  const companyInfo = companyRow[0];
  if (!companyInfo) {
    return {
      code: 97002,
      message: ErrorCodes["zh_cn"]["97002"]
    };
  }

  const checkOrderDetail = await HappyPayUtil.queryPayeeOrder(orderNo);
  if (
    checkOrderDetail === null ||
    checkOrderDetail.totalCount <= 0 ||
    checkOrderDetail.salesList.length <= 0
  ) {
    return {
      code: 97003,
      message: ErrorCodes["zh_cn"]["97003"]
    };
  }

  const sale = checkOrderDetail.salesList[0];
  const paymentOrderId = sale.paymentId;
  if (paymentOrderId) {
    const updateOrderSql =
      "update order_list set payment_order_id = ?, modified_at = ? where order_id = ?";
    console.log("updateOrderId", paymentOrderId, new Date(), orderNo);
    await conn.query(updateOrderSql, [paymentOrderId, new Date(), orderNo]);
  }
  const updateOrderStatusSql =
    "update order_list set payment_result = ? , order_status = ? , modified_at = ? where order_id = ?";
  if (
    sale &&
    // sale.amount.value === order.total_price &&
    sale.merchantOrderNo === orderNo
  ) {
    if (sale.status === "pending") {
      return {
        code: 200,
        message: "pending"
      };
    }
    if (sale.status === "authorized") {
      let signingQuota = companyInfo.signing_quota || 0;
      let signingRemain = companyInfo.signing_remain || 0;
      if (signingRemain <= 0) {
        signingQuota = pkg.offer;
        signingRemain = pkg.offer;
      } else {
        signingQuota = signingQuota + pkg.offer;
        signingRemain = signingRemain + pkg.offer;
      }

      const updateCompanyQuota =
        "update company set signing_quota = ?, signing_remain = ? where id = ? and status = 1";
      console.log("update_order_success", sale.status, 1, new Date(), orderNo);
      await conn.query(updateOrderStatusSql, [
        sale.status,
        1,
        new Date(),
        orderNo
      ]);
      console.log(
        "update_company",
        signingQuota,
        signingRemain,
        order.company_id
      );
      await conn.query(updateCompanyQuota, [
        signingQuota,
        signingRemain,
        order.company_id
      ]);
      return {
        code: 200,
        message: "success"
      };
    }
  }
  console.log("update_order_fail", sale.status, 2, new Date(), orderNo);
  await conn.query(updateOrderStatusSql, [sale.status, 2, new Date(), orderNo]);
  return {
    code: 200,
    message: "error"
  };
}

module.exports = {
  getMethods: (request, h) => {
    const area = request.headers["x-being-area"];
    if (area === "cn") {
      return {
        code: 200,
        message: "success",
        data: ["alipay"]
      };
    }
    return {
      code: 200,
      message: "success",
      // data: ["happypay","newebpay"]
      data: ["newebpay"]
    };
  },
  getPackages: (request, h) => {
    const area = request.headers["x-being-area"];
    let currency = "TWD";
    if (area === "cn") {
      currency = "CNY";
    }
    return {
      code: 200,
      message: "success",
      data: Packages.packages.filter(i => i.id.startsWith(currency))
    };
  },
  createOrder: async (request, h) => {
    const {
      corpId,
      packageId,
      amount,
      method,
      remark,
      invoice
    } = request.payload;
    const conn = await request.mysql.pool.getConnection();
    const lang = request.getLocale(); // 获取语系
    await conn.beginTransaction();
    try {
      const pkg = Packages.packages.filter(i => i.id === packageId);
      if (!pkg || pkg.length <= 0) {
        return {
          code: 97001,
          message: ErrorCodes[lang]["97001"]
        };
      }

      const userId = request.auth.credentials.userId;
      const userIdStr = ("0000" + userId).slice(-4);
      const now = Moment();
      const ts = (now.unix() + "").slice(-5);
      const orderId = "DSK" + now.format("YYYYMMDD") + ts + userIdStr;
      const packageName = pkg[0].name;
      const currency = pkg[0].currency;
      const unitPrice = pkg[0].unit_price;
      const unitPriceBn = new BigNumber(unitPrice);
      const totalPrice = unitPriceBn.times(amount).valueOf();
      const companyId = corpId;
      const queryUserSql = "select * from user where id = ? and status = 1";
      const [userRow] = await conn.query(queryUserSql, [userId]);
      const user = userRow[0];
      if (!user) {
        return {
          code: 99001,
          message: ErrorCodes[lang]["99001"]
        };
      }

      let companyInfo = null;
      const queryCompanyAuthList =
        "select * from company_authorized where user_id = ? and company_id = ? and status = 1";
      const [companyAuthRow] = await conn.query(queryCompanyAuthList, [
        userId,
        companyId
      ]);
      if (companyAuthRow.length <= 0) {
        return {
          code: 94011,
          message: ErrorCodes[lang]["94011"]
        };
      }

      const queryCompanySql =
        "select * from company where id = ? and status = 1";
      const [companyRow] = await conn.query(queryCompanySql, [companyId]);
      companyInfo = companyRow[0];
      if (!companyInfo) {
        return {
          code: 94011,
          message: ErrorCodes[lang]["94011"]
        };
      }

      const createOrderSql =
        "INSERT INTO `order_list` (`uuid`, `order_id`, `package_id`, `package_name`, `amount`, `currency`, `unit_price`, `total_price`, `user_id`, `company_id`, `remark`, `payment_method`, `payment_order_id`, `payment_result`, `order_status`, `created_at`, `modified_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      await conn.query(createOrderSql, [
        Uuidv4(),
        orderId,
        packageId,
        packageName,
        amount,
        currency,
        unitPrice,
        totalPrice,
        userId,
        companyId,
        remark,
        method,
        "",
        "",
        0,
        new Date(),
        null
      ]);
      if (method === "newebpay") {
        if (invoice.type !== 1) {
          if (!invoice.name || !invoice.mobile) {
            return {
              code: 97006,
              message: ErrorCodes[lang]["97006"]
            };
          }
          if (invoice.type === 2 && !invoice.email) {
            return {
              code: 97006,
              message: ErrorCodes[lang]["97006"]
            };
          }
          if (invoice.type === 3 && (!invoice.title || !invoice.tax_id)) {
            return {
              code: 97006,
              message: ErrorCodes[lang]["97006"]
            };
          }
        }
        const insertInvoiceSql =
          "INSERT INTO `invoice` (`order_id`, `type`, `name`, `mobile`, `address`, `title`, `tax_id`, `corp_id`, `invoice_no`, `user_id`, `email`, `created_at`, `invoice_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await conn.query(insertInvoiceSql, [
          orderId,
          invoice.type,
          invoice.name || "",
          invoice.mobile || "",
          invoice.address || "",
          invoice.title || "",
          invoice.tax_id || "",
          companyId,
          "",
          userId,
          invoice.email || "",
          new Date(),
          null
        ]);
        await conn.commit();
        return {
          code: 200,
          message: "success",
          data: JSON.stringify({
            amt: totalPrice,
            merchantOrderNo: orderId,
            timeStamp: orderId,
            merchantID: process.env.MERCHANT_ID,
            newebPayUrl: process.env.NEWEBPAY_URL,
            checkValue: calculateCheckValue(totalPrice, orderId)
          })
        };
      }
      if (method === "happypay" && currency === "TWD") {
        if (invoice.type !== 1) {
          if (!invoice.name || !invoice.mobile) {
            return {
              code: 97006,
              message: ErrorCodes[lang]["97006"]
            };
          }
          // if (!invoice.address) {
          //   return {
          //     code: 97006,
          //     message: ErrorCodes[lang]["97006"]
          //   };
          // }
          if (invoice.type === 2 && !invoice.email) {
            return {
              code: 97006,
              message: ErrorCodes[lang]["97006"]
            };
          }
          if (invoice.type === 3 && (!invoice.title || !invoice.tax_id)) {
            return {
              code: 97006,
              message: ErrorCodes[lang]["97006"]
            };
          }
        }
        const insertInvoiceSql =
          "INSERT INTO `invoice` (`order_id`, `type`, `name`, `mobile`, `address`, `title`, `tax_id`, `corp_id`, `invoice_no`, `user_id`, `email`, `created_at`, `invoice_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await conn.query(insertInvoiceSql, [
          orderId,
          invoice.type,
          invoice.name || "",
          invoice.mobile || "",
          invoice.address || "",
          invoice.title || "",
          invoice.tax_id || "",
          companyId,
          "",
          userId,
          invoice.email || "",
          new Date(),
          null
        ]);
        const token = await HappyPayUtil.getToken();
        if (!token) {
          return {
            code: 97005,
            message: ErrorCodes[lang]["97005"]
          };
        }
        const redirectUrl = HappyPayUtil.getHappyPayPaymentUrl(
          orderId,
          totalPrice,
          currency,
          userId,
          remark,
          token
        );
        request.log("happy_pay_redirect", redirectUrl);
        await conn.commit();
        return {
          code: 200,
          message: "success",
          data: redirectUrl
        };
      }
      if (method === "alipay" && currency === "CNY") {
        const redirectUrl = await AliPayUtil.alipayCreate(
          orderId,
          totalPrice,
          pkg[0].name,
          pkg[0].name,
          remark
        );
        request.log("ali_pay_redirect", redirectUrl);
        await conn.commit();
        return {
          code: 200,
          message: "success",
          data: redirectUrl
        };
      }

      return {
        code: 400,
        message: "method not supported"
      };
    } catch (e) {
      request.log("create_order_error", e);
      await conn.rollback();
      return {
        code: 97005,
        message: ErrorCodes[lang]["97005"]
      };
    } finally {
      await conn.release();
    }
  },
  happypayCallback: async (request, h) => {
    const {
      xid,
      status,
      orderNo,
      currency,
      nonce,
      amount,
      timestamp,
      checkCode
    } = request.payload;
    if (orderNo.slice(0, 3) !== "DSK") {
      if (request.mime === "application/x-www-form-urlencoded") {
        const html = CreateOrderHtml({
          api: BAPLAY_PAY_API,
          xid,
          status,
          orderNo,
          currency,
          nonce,
          amount,
          timestamp,
          checkCode
        });
        return h.response(html).type("text/html");
      } else {
        const result = await Axios.post(BAPLAY_PAY_API, {
          xid,
          status,
          orderNo,
          currency,
          nonce,
          amount,
          timestamp,
          checkCode
        });
        if (result.status === 200) {
          return result.data;
        }
        return {
          code: 500,
          message: "服務器錯誤"
        };
      }
    }
    const conn = await request.mysql.pool.getConnection();
    await conn.beginTransaction();
    try {
      const checked = HappyPayUtil.verifyCallback(
        xid,
        status,
        orderNo,
        nonce,
        timestamp,
        amount,
        currency,
        checkCode
      );
      if (checked) {
        const result = await checkAndSaveHappyPayOrder(conn, orderNo);
        request.log("happypay_callback_result", result);
        await conn.commit();
      } else {
        request.log("happy_pay_checkcode_error", checkCode);
      }
    } catch (e) {
      request.log("happy_pay_callback_error", e);
      await conn.rollback();
    } finally {
      await conn.release();
    }
    if (request.mime === "application/x-www-form-urlencoded") {
      return h.redirect(WEB_BASE_URL + "/client/PurchaseResult/" + orderNo);
    } else {
      return {
        code: 200,
        message: "success"
      };
    }
  },
  newebpayCallback: async (request, h) => {
    const { JSONData } = request.payload;
    const orderNo = JSON.parse(JSON.parse(JSONData).Result).MerchantOrderNo;
    const tradeNo = JSON.parse(JSON.parse(JSONData).Result).TradeNo;
    const tradeStatus = JSON.parse(JSONData).Status;

    const conn = await request.mysql.pool.getConnection();
    await conn.beginTransaction();
    try {
      const result = await checkAndSaveNewebPayOrder(
        conn,
        orderNo,
        tradeNo,
        tradeStatus
      );
      request.log("newebpay_callback_result", result);
      await conn.commit();
    } catch (e) {
      request.log("ali_pay_callback_error", e);
      await conn.rollback();
    } finally {
      await conn.release();
    }

    return h.redirect(WEB_BASE_URL + "/client/PurchaseResult/" + orderNo);
  },
  alipayReturnUrl: async (request, h) => {
    let orderNo = request.query.out_trade_no;
    return h.redirect(CN_WEB_BASE_URL + "/client/PurchaseResult/" + orderNo);
  },
  alipayCallback: async (request, h) => {
    const checked = AliPayUtil.validateNotify(request.payload);
    if (!checked) {
      return {
        code: 500,
        message: "ERROR"
      };
    }
    const orderNo = request.payload.out_trade_no;
    const conn = await request.mysql.pool.getConnection();
    await conn.beginTransaction();
    try {
      const result = await checkAndSaveAliPayOrder(conn, orderNo);
      request.log("ali_callback_result", result);
      await conn.commit();
    } catch (e) {
      request.log("ali_pay_callback_error", e);
      await conn.rollback();
    } finally {
      await conn.release();
    }
    return "success";
  },
  cancel: async (request, h) => {
    const { orderNo } = request.payload;
    const conn = await request.mysql.pool.getConnection();
    await conn.beginTransaction();
    try {
      const queryOrderSql = "select * from order_list where order_id = ?";
      const [orderRows] = await conn.query(queryOrderSql, [orderNo]);
      const order = orderRows[0];
      if (!order) {
        request.log("payment_notfound", orderNo);
        return h
          .response({
            code: 404,
            message: "订单不存在"
          })
          .code(404);
      }

      if (order.order_status !== 0) {
        request.log("payment_duplicate", orderNo);
        return {
          code: 500,
          message: "不能取消"
        };
      }

      await conn.query(
        "update order_order set order_status = 3 where order_id = ?",
        [orderNo]
      );
      await conn.commit();
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("happy_pay_retry_error", e);
      await conn.rollback();
      return h
        .response({
          code: 500,
          message: "取消失败"
        })
        .code(500);
    } finally {
      await conn.release();
    }
  },
  refund: async (request, h) => {
    throw Boom.notImplemented("not implemented");
  },
  retry: async (request, h) => {
    const { orderNo } = request.payload;
    const conn = await request.mysql.pool.getConnection();
    await conn.beginTransaction();
    try {
      const queryOrderSql = "select * from order_list where order_id = ?";
      const [orderRows] = await conn.query(queryOrderSql, [orderNo]);
      const order = orderRows[0];
      if (!order) {
        request.log("happy_pay_notfound", orderNo);
        return h
          .response({
            code: 404,
            message: "订单不存在"
          })
          .code(404);
      }

      if (order.order_status !== 0 || order.order_status !== 2) {
        request.log("happy_pay_duplicate", orderNo);
        return {
          code: 200,
          message: "已经处理"
        };
      }

      const result = await checkAndSaveHappyPayOrder(conn, orderNo);
      await conn.commit();
      return result;
    } catch (e) {
      request.log("happy_pay_retry_error", e);
      await conn.rollback();
      return h
        .response({
          code: 500,
          message: "补单失败"
        })
        .code(500);
    } finally {
      await conn.release();
    }
  },
  status: async (request, h) => {
    const queryOrderSql = "select * from order_list where order_id = ?";
    const { orderNo } = request.query;
    const lang = request.getLocale(); // 获取语系
    const pool = request.mysql.pool;
    const [list] = await pool.query(queryOrderSql, [orderNo]);
    const order = list[0];
    if (order) {
      const companyId = order.company_id;
      const [companyRows] = await pool.query(
        "select id, name, signing_quota, signing_remain from company where id = ? and status = 1",
        [companyId]
      );
      const company = companyRows[0];
      return {
        code: 200,
        message: "success",
        data: {
          orderNo: order.order_id,
          status: order.order_status,
          companyName: company && company.name ? company.name : ""
        }
      };
    } else {
      return {
        code: 97003,
        message: ErrorCodes[lang]["97003"]
      };
    }
  },
  list: async (request, h) => {
    const queryOrderSql = "select * from order_list where company_id = ?";
    const { corpId } = request.query;
    const pool = request.mysql.pool;
    const [list] = await pool.query(queryOrderSql, [corpId]);
    return {
      code: 200,
      message: "success",
      data: list
    };
  }
};
