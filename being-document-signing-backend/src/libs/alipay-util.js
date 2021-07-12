const AlipaySdk = require("alipay-sdk").default;
const AlipayFormData = require("alipay-sdk/lib/form").default;
const ALIPAY_APP_ID = process.env.ALIPAY_APP_ID;
const ALIPAY_ALI_PUBLIC_KEY = process.env.ALIPAY_ALI_PUBLIC_KEY;
const ALIPAY_PRIVATE_KEY = process.env.ALIPAY_PRIVATE_KEY;
const ALIPAY_GATEWAY = process.env.ALIPAY_GATEWAY;
const HOST = process.env.API_BASE_URL;
const alipaySdk = new AlipaySdk({
  gateway: ALIPAY_GATEWAY, // dev: "https://openapi.alipaydev.com/gateway.do", prod:"https://openapi.alipay.com/gateway.do"
  camelcase: false,
  appId: ALIPAY_APP_ID,
  privateKey: ALIPAY_PRIVATE_KEY,
  alipayPublicKey: ALIPAY_ALI_PUBLIC_KEY
});
alipaySdk.getSignStr("", "");
module.exports = {
  alipayCreate: (orderNo, totalAmount, subject, body, remark) => {
    const notifyUrl = `${HOST}/payment/callback/alipay`;
    const returnUrl = `${HOST}/payment/return/alipay`;
    const formData = new AlipayFormData();
    formData.addField("return_url", returnUrl);
    formData.addField("notify_url", notifyUrl);
    formData.addField("biz_content", {
      outTradeNo: orderNo,
      timeout_express: "30m",
      productCode: "QUICK_WAP_WAY",
      goods_type: "0",
      passback_params: remark,
      totalAmount: totalAmount,
      subject: subject,
      body: body
    });
    formData.setMethod("get");
    return alipaySdk.exec(
      "alipay.trade.wap.pay",
      {},
      {
        validateSign: true,
        formData: formData,
        log: console
      }
    );
  },
  queryOrder: orderNo => {
    return alipaySdk.exec(
      "alipay.trade.query",
      {
        bizContent: { outTradeNo: orderNo }
      },
      {
        validateSign: true,
        log: console
      }
    );
  },
  validateNotify: payload => {
    return alipaySdk.checkNotifySign(payload);
  }
};
