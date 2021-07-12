const Axios = require("axios");
const strEncoding = require('./string-encode-util');

module.exports = {
    sendSMS: async (phoneNumber, smsBody) => {
        const requestUrl = "http://smsapi.mitake.com.tw/api/mtk/SmSend";
        const queryUrl =
            requestUrl +
            `?username=${process.env.SMS_ACCOUNT}` + // 42977332
            `&password=${process.env.SMS_PASSWORD}` + // beingsignalan
            `&dstaddr=${phoneNumber}` +
            `&smbody=${strEncoding(smsBody)}`; // need Big 5
        const result = await Axios.get(queryUrl);
        
        return {
            msgid: result.data.split("msgid=", 2)[1].substring(0,10),
            statusCode: result.data.split("statuscode=", 2)[1].substring(0,1)
        }
    },
    authWording: (code) => {
        return `您的簽署王註冊驗證碼為${code}，請於30分鐘內完成驗證。`
    }
};
