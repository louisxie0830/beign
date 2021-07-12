const Nodemailer = require("nodemailer");
const ErrorCodes = require("../libs/errorCodes");
const Handlebars = require("handlebars");
const Moment = require("moment");
const Fs = require("fs");
const path = require("path");

const SEND_FROM = process.env.SMTP_SEND_FROM
  ? process.env.SMTP_SEND_FROM
  : "no-reply@beingtech.org";
const appUrl =
  process.env.API_BASE_URL || `https://backend-signing-test.beingtech.org`;

const poolConfig = {
  pool: true,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  ignoreTLS: process.env.SMTP_IGNORE_TLS === "true",
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

const Client = Nodemailer.createTransport(poolConfig);

// this will be called after the file is read
function renderToString(source, data) {
  var template = Handlebars.compile(source);
  var outputString = template(data);
  return outputString;
}

function sendOneMail(type, lang, email, options) {
  const imgUrl = `${appUrl}/static/email_${lang}.png`; // 邮件的图片地址
  const htmlPath = path.join(__dirname, `./i18n/${lang}/${type}.html`);
  const source = Fs.readFileSync(htmlPath, "utf8");
  let subject = "";
  if (type === "alreadyRead") {
    // 邮件标题
    const template = Handlebars.compile(ErrorCodes[lang]["mailTitle"][type]);
    subject = template({});
    // 邮件主体内容
    const myTime = Moment()
      .utcOffset(480)
      .format("YYYY/MM/DD HH:mm ([UTC]+8)");
    options = {
      ...options,
      imgUrl,
      myTime
    };
  } else if (type === "viewFile") {
    // 邮件标题
    const template = Handlebars.compile(ErrorCodes[lang]["mailTitle"][type]);
    subject = template({});
    // 邮件主体内容
    const myTime = Moment()
      .utcOffset(480)
      .format("YYYY/MM/DD HH:mm ([UTC]+8)");
    options = {
      ...options,
      imgUrl,
      myTime
    };
  } else {
    console.log("SendEmail Error: Invalid type", type);
    return;
  }
  const html = renderToString(source, options);
  // 发送邮件
  const mailOptions = {
    from: SEND_FROM, // sender address
    to: email, // list of receivers
    subject, // Subject line
    html // plain text body
  };
  console.log("邮件标题：", subject);
  Client.sendMail(mailOptions).catch(err => {
    console.error(err);
  });
}

module.exports = {
  sendOneMail
};
