const RandomString = require("randomstring");
const Crc32 = require("node-crc");
const Send = require("../libs/mailer");
const SendSMS = require("../libs/sms-util");
const ErrorCodes = require("../libs/errorCodes");
const Uuidv4 = require("uuid/v4");
module.exports = {
  sendEmailCode: async (request, h) => {
    const email = request.payload.email;
    const phone = request.payload.phone || null;
    const redis = request.redis.client;
    const lang = request.getLocale(); // 获取语系
    const xFF = request.headers["x-forwarded-for"];
    const xR = request.headers["x-real-ip"];
    const ip = xFF ? xFF.split(",")[0] : xR || request.info.remoteAddress;
    const key = "email_code:" + email + "@" + ip;
    let data = await redis.get(key);
    request.log("send_email_code_data", data);
    if (!data) {
      data = {
        lastSend: null,
        count: 0
      };
    } else {
      data = JSON.parse(data);
    }
    if (data.lastSend && Date.now() - data.lastSend > 3600000) {
      data = {
        lastSend: null,
        count: 0
      };
    }
    if (data.count > 4) {
      return {
        code: 93001,
        message: ErrorCodes[lang]["93001"] // 'SEND_EMAIL_TOO_MANY'
      };
    }
    if (data.lastSend && Date.now() - data.lastSend < 60000) {
      return {
        code: 93002,
        message: ErrorCodes[lang]["93002"] // 'SEND_EMAIL_TOO_QUICK'
      };
    }

    let code = RandomString.generate({
      length: 6,
      charset: "numeric"
    });

    try {
      const result = await Send.registerCodeSendEmail(email, code, lang);
      request.log("send_email_code", result);
      if (phone) {
        request.log("send_sms_code", await SendSMS.sendSMS(phone, SendSMS.authWording(code)));
      } 
      data.lastSend = Date.now();
      data.count = data.count + 1;
      data.code = code;
      data.errorCount = 0;
      await redis.set(key, JSON.stringify(data));
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("ERROR", e);
      return {
        code: 99002,
        message: ErrorCodes[lang][99002]
      };
      // throw Boom.internal('Send Email Error', e);
    }
  },
  loginAfterEmailCode: async (request, h) => {
    const email = request.payload.email;
    const redis = request.redis.client;
    const type = request.payload.type;
    const lang = request.getLocale(); // 获取语系
    const xFF = request.headers["x-forwarded-for"];
    const xR = request.headers["x-real-ip"];
    const ip = xFF ? xFF.split(",")[0] : xR || request.info.remoteAddress;
    let key = "";
    if (type == 1) {
      key = "email_code_modify_login:" + email + "@" + ip; // 修改登录密码
    } else if (type == 2) {
      key = "email_code_modify:" + email + "@" + ip; // 修改签署密码
    } else if (type == 3) {
      key = "email_code_bind:" + email + "@" + ip; // 绑定邮箱
    }
    let data = await redis.get(key);
    request.log("send_email_code_data", data);
    if (!data) {
      data = {
        lastSend: null,
        count: 0
      };
    } else {
      data = JSON.parse(data);
    }
    if (data.lastSend && Date.now() - data.lastSend > 3600000) {
      data = {
        lastSend: null,
        count: 0
      };
    }
    if (data.count > 4) {
      return {
        code: 93001,
        message: ErrorCodes[lang]["93001"] // 'SEND_EMAIL_TOO_MANY'
      };
    }
    if (data.lastSend && Date.now() - data.lastSend < 60000) {
      return {
        code: 93002,
        message: ErrorCodes[lang]["93002"] // 'SEND_EMAIL_TOO_QUICK'
      };
    }

    let code = RandomString.generate({
      length: 6,
      charset: "numeric"
    });

    try {
      let result = "";
      if (type == 1) {
        result = await Send.modifyLoginSendEmail(email, code, lang);
      } else if (type == 2) {
        result = await Send.modifySendEmail(email, code, lang);
      } else if (type == 3) {
        result = await Send.bindSendEmail(email, code, lang);
      }
      request.log("send_email_code", result);
      data.lastSend = Date.now();
      data.count = data.count + 1;
      data.code = code;
      data.errorCount = 0;
      await redis.set(key, JSON.stringify(data));
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("ERROR", e);
      return {
        code: 99002,
        message: ErrorCodes[lang][99002]
      };
      // throw Boom.internal('Send Email Error', e);
    }
  },
  verifyEmailCode: async (request, h) => {
    const email = request.payload.email;
    const redis = request.redis.client;
    const type = request.payload.type;
    const lang = request.getLocale(); // 获取语系
    const xFF = request.headers["x-forwarded-for"];
    const xR = request.headers["x-real-ip"];
    const ip = xFF ? xFF.split(",")[0] : xR || request.info.remoteAddress;
    let key = "";
    if (type == 1) {
      key = "email_code_modify_login:" + email + "@" + ip; // 修改登录密码
    } else if (type == 2) {
      key = "email_code_modify:" + email + "@" + ip; // 修改签署密码
    } else if (type == 3) {
      key = "email_code_bind:" + email + "@" + ip; // 绑定邮箱
    } else {
      key = "email_code:" + email + "@" + ip;
    }
    const data = await redis.get(key);
    request.log("send_email_code_data", data);
    if (!data) {
      return {
        code: 91002,
        message: ErrorCodes[lang]["91002"] // 'INVALID_EMAIL_CODE'
      };
    }
    let emailCode = JSON.parse(data);
    const code = request.payload.code;
    const now = Date.now();
    if (
      !emailCode ||
      !emailCode.code ||
      emailCode.code.toUpperCase() != code.toUpperCase()
    ) {
      if (!(process.env.NODE_ENV === "test" && code === "999999")) {
        emailCode = emailCode || {};
        emailCode.errorCount = (emailCode.errorCount || 0) + 1;
        await redis.set(key, JSON.stringify(emailCode));
        return {
          code: 91003,
          message: ErrorCodes[lang]["91003"]
        };
      }
    }
    if (emailCode.errorCount >= 5) {
      emailCode = emailCode || {};
      emailCode.errorCount = (emailCode.errorCount || 0) + 1;
      await redis.set(key, JSON.stringify(emailCode));
      return {
        code: 91004,
        message: ErrorCodes[lang]["91004"]
      };
    }
    if (now - emailCode.lastSend >= 1800000) {
      emailCode = emailCode || {};
      emailCode.errorCount = (emailCode.errorCount || 0) + 1;
      await redis.set(key, JSON.stringify(emailCode));
      return {
        code: 91005,
        message: ErrorCodes[lang]["91005"]
      };
    }
    return {
      code: 200,
      message: "success"
    };
  },
  bindEmail: async (request, h) => {
    const email = request.payload.email;
    const redis = request.redis.client;
    const lang = request.getLocale(); // 获取语系
    const xFF = request.headers["x-forwarded-for"];
    const xR = request.headers["x-real-ip"];
    const ip = xFF ? xFF.split(",")[0] : xR || request.info.remoteAddress;
    const key = "email_code_bind:" + email + "@" + ip;
    const data = await redis.get(key);
    const authCode = request.payload.authCode;
    const mobile = request.payload.mobile;
    const address = request.headers.address;
    request.log("send_email_code_data", data);
    if (!data) {
      return {
        code: 91002,
        message: ErrorCodes[lang]["91002"] // 'INVALID_EMAIL_CODE'
      };
    }
    let emailCode = JSON.parse(data);
    const code = request.payload.code;
    const now = Date.now();
    if (
      !emailCode ||
      !emailCode.code ||
      emailCode.code.toUpperCase() != code.toUpperCase()
    ) {
      if (!(process.env.NODE_ENV === "test" && code === "999999")) {
        emailCode = emailCode || {};
        emailCode.errorCount = (emailCode.errorCount || 0) + 1;
        await redis.set(key, JSON.stringify(emailCode));
        return {
          code: 91003,
          message: ErrorCodes[lang]["91003"]
        };
      }
    }
    if (emailCode.errorCount >= 5) {
      emailCode = emailCode || {};
      emailCode.errorCount = (emailCode.errorCount || 0) + 1;
      await redis.set(key, JSON.stringify(emailCode));
      return {
        code: 91004,
        message: ErrorCodes[lang]["91004"]
      };
    }
    if (now - emailCode.lastSend >= 1800000) {
      emailCode = emailCode || {};
      emailCode.errorCount = (emailCode.errorCount || 0) + 1;
      await redis.set(key, JSON.stringify(emailCode));
      return {
        code: 91005,
        message: ErrorCodes[lang]["91005"]
      };
    }
    const currentUserId = request.auth.credentials.userId;
    const token = request.auth.credentials.token;
    const emailCrc = Crc32.crc32(Buffer.from(email, "utf8")).readUInt32BE(0);
    const pool = await request.mysql.pool.getConnection();
    try {
      await pool.beginTransaction();
      const checkEmailSql =
        "select count(1) c from user where email_crc = ? and email = ?";
      const [checkEmailRow] = await pool.query(checkEmailSql, [
        emailCrc,
        email
      ]);
      if (checkEmailRow[0] && checkEmailRow[0].c) {
        return {
          code: 91011,
          message: ErrorCodes[lang]["91011"]
        };
      }
      const updateEmailBindSql =
        "update user set mobile_verify = ?, email = ?, email_verify_time = ?, email_crc = ?, email_verify = ? where id=? and status = 1";
      await pool.query(updateEmailBindSql, [
        mobile,
        email,
        new Date(),
        emailCrc,
        email,
        currentUserId
      ]);
      const updateLetterReceiverSql =
        "update letter_receiver set user_id = ? where user_id = 0 and email = ?";
      await pool.query(updateLetterReceiverSql, [currentUserId, email]);
      // 新增设定签署密码
      const updateCertPasswordSql =
        "update user set cer_pwd = ? where id = ? limit 1";
      await pool.query(updateCertPasswordSql, [authCode, currentUserId]);
      const updateOldCertPasswordSql =
        "update address_list set status = 2, stop_time = ? where user_id = ? and status = 1";
      await pool.query(updateOldCertPasswordSql, [new Date(), currentUserId]);
      const insertAddressSql =
        "INSERT INTO `address_list` (`uuid`, `user_id`, `address`, `status`, `create_time`, `stop_time`) VALUES ( ?, ?, ?, ?, ?, ?)";
      await pool.query(insertAddressSql, [
        Uuidv4(),
        currentUserId,
        address,
        1,
        new Date(),
        null
      ]);

      await pool.commit();
      const authData = await redis.get("access_token:" + token);
      const auth = JSON.parse(authData);
      auth.email = email;
      await redis.set("access_token:" + token, JSON.stringify(auth));
      emailCode.code = "";
      await redis.set(key, JSON.stringify(emailCode));
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("ERROR", e);
      await pool.rollback();
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    } finally {
      await pool.release();
    }
  }
};
