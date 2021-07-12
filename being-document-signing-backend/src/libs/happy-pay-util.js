const Axios = require("axios");
const Util = require("util");
const Crypto = require("crypto");
const QueryString = require("querystring");
const HAPPY_PAY_PAYEE_ID = process.env.HAPPY_PAY_PAYEE_ID;
const HAPPY_PAY_APP_KEY_ID = process.env.HAPPY_PAY_APP_KEY_ID;
const HAPPY_PAY_SERVER_SECRET_KEY = process.env.HAPPY_PAY_SERVER_SECRET_KEY;
const HAPPY_PAY_PAYMENT_URL = process.env.HAPPY_PAY_PAYMENT_URL;
const HAPPY_PAY_TOKEN_ENDPOINT = process.env.HAPPY_PAY_TOKEN_ENDPOINT;
const HAPPY_PAY_PAYEE_ORDER_ENDPOINT =
  process.env.HAPPY_PAY_PAYEE_ORDER_ENDPOINT;
const HOST = process.env.API_BASE_URL;
const _USER_PASSWORD_AUTHORIZATION =
  "Basic " +
  Buffer.from(
    HAPPY_PAY_APP_KEY_ID + ":" + HAPPY_PAY_SERVER_SECRET_KEY
  ).toString("base64");
/**
 *
PAYEEID=d79bbdab-75e8-11e7-8b29-0242ac12000f
BACKURL=http://210.59.245.9:8202/happypay_sendStone.shtml
APP_KEY_ID = evatar
SERVER_KEY = ]HUr/aWX30]o_42qXH8lb96VAi@zAI56
# QC env
HAPPYPAY_CALLBACK_URL=https://api-qc.happy-pay.com/open/v1/payee/%s/sales/%s
HAPPYPAY_URL_CREATEPAYMENT=https://webview-sdk.happy-pay.com/qc/createPayment.html
HAPPYPAY_GET_TOKENS_URL=https://api-qc.happy-pay.com/open/v1/tokens
USER_PASSWORD=evatar:]HUr/aWX30]o_42qXH8lb96VAi@zAI56
 */

module.exports = {
  getToken: async () => {
    const url = HAPPY_PAY_TOKEN_ENDPOINT;
    const data = {
      type: "ot_token",
      label: "Being Signing",
      payee: {
        payeeId: HAPPY_PAY_PAYEE_ID
      }
    };
    const result = await Axios.post(url, data, {
      timeout: 3000,
      headers: {
        "content-type": "application/json",
        authorization: _USER_PASSWORD_AUTHORIZATION,
        "cache-control": "no-cache",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11"
      }
    });
    console.log("HAPPY_PAY_TOKEN", result.data);
    if (result.status === 200) {
      return result.data.id;
    }
    console.log("HAPPY_PAY_TOKEN_CODE", result.code);
    return null;
  },
  getHappyPayPaymentUrl: (
    orderNo,
    value,
    currency,
    payerId,
    metaData,
    token
  ) => {
    const data = {
      orderNo: orderNo || "",
      value: value || 0,
      currency: currency || "",
      payerId: payerId || 0,
      metaData: metaData || "",
      token: token || "",
      payeeId: HAPPY_PAY_PAYEE_ID,
      capture: 0,
      backUrl: HOST + "/payment/callback/happypay"
    };
    return HAPPY_PAY_PAYMENT_URL + "?" + QueryString.stringify(data);
  },
  verifyCallback: (
    xid,
    status,
    orderNo,
    nonce,
    timestamp,
    amount,
    currency,
    checkCode
  ) => {
    // HMAC-SHA512HEX(server_key, app_key_id+xid+status+orderNo+amount+currency+nonce+timestamp)
    const content =
      HAPPY_PAY_APP_KEY_ID +
      xid +
      status +
      orderNo +
      amount +
      currency +
      nonce +
      timestamp;
    const hash = Crypto.createHmac("sha512", HAPPY_PAY_SERVER_SECRET_KEY)
      .update(content)
      .digest("hex");
    return checkCode === hash;
  },
  queryPayeeOrder: async orderNo => {
    const url = Util.format(
      HAPPY_PAY_PAYEE_ORDER_ENDPOINT,
      HAPPY_PAY_PAYEE_ID,
      orderNo
    );
    const result = await Axios.get(url, {
      timeout: 3000,
      headers: {
        "content-type": "application/json",
        authorization: _USER_PASSWORD_AUTHORIZATION,
        "cache-control": "no-cache",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11"
      }
    });
    console.log("HAPPY_PAY_PAYEE_ORDER", result.data);
    /**
     * {
        “totalCount”: 1,
        “salesList”: [{
          “status”: “captured”,
          “amount”: { value: 100 },
          “merchantOrderNo”: “e3062e46b2f933d5fe66”,
          “merchantMetaData”: "{\"product\": \"who are you\"}",
          “createdTime”: “123123123”`
        }]
      }
     */
    if (result.status === 200) {
      return result.data;
    }
    console.log("HAPPY_PAY_PAYEE_ORDER_CODE", result.status);
    return null;
  }
};
