const Boom = require("@hapi/boom");
const ErrorCodes = require("../libs/errorCodes");
const Uuidv4 = require("uuid/v4");
const Send = require("../libs/mailer");
module.exports = {
  notImplemented: async request => {
    throw Boom.notImplemented("not implemented");
  },
  addMessage: async (request, h) => {
    const pool = request.mysql.pool;
    // const currentUserId = request.auth.credentials.userId;
    const username = request.payload.username;
    const message = request.payload.message;
    const email = request.payload.email;
    if (!username && username.length > 30) {
      return {
        code: 99002,
        message: "姓名不能超過30字符"
      };
    }
    if (!message && message.length > 300) {
      return {
        code: 99002,
        message: "留言內容不能超過300字符"
      };
    }
    if (!email && email.length > 128) {
      return {
        code: 99002,
        message: "Email不能超過128字符"
      };
    }
    const lang = request.getLocale(); // 获取语系
    try {
      const insertMessageSql =
        "insert into contact_info (uuid, username, message, email, create_time) value (?, ?, ?, ?, ?)";
      await pool.query(insertMessageSql, [
        Uuidv4(),
        username,
        message,
        email,
        new Date()
      ]);
      // 发送邮件到指定邮箱
      Send.addMessage(username, email, message);
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("addMessage", e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  }
};
