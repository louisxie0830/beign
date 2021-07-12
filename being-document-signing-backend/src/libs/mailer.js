const Nodemailer = require("nodemailer");
const FormatHtml = require("./emailTemplaate");
const ErrorCodes = require("../libs/errorCodes");
const generatePdf = require("../libs/generatePdf");
const Handlebars = require("handlebars");
const Uuid = require("uuid/v4");
const SEND_FROM = process.env.SMTP_SEND_FROM
  ? process.env.SMTP_SEND_FROM
  : "no-reply@beingtech.org";
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

function sendAll(mailOptions) {
  // console.log(mailOptions);
  Client.sendMail(mailOptions).catch(err => {
    console.error(err);
  });
}

function sendOneEmail({ email, lang, html, titleType, subject, pdfPath }) {
  const subjectObj = titleType ? ErrorCodes[lang][titleType] : subject;
  const mailOptions = {
    from: SEND_FROM, // sender address
    to: email, // list of receivers
    subject: subjectObj, // Subject line
    html: html // plain text body
  };
  if (pdfPath) {
    mailOptions.attachments = [
      {
        filename: encodeURIComponent(Uuid()) + ".pdf",
        path: pdfPath
      }
    ];
  }
  console.log("邮件标题：", subjectObj);
  sendAll(mailOptions);
}
// 发送邀请注册的邮件
function sendInviteEmail(
  email,
  lang,
  inviteCode,
  userName,
  inviter,
  companyName,
  departmentName
) {
  const tmpName = "sendInviteEmail"; // 模板文件名
  // const titleType = "sendInviteEmailTitle"; // 标题名称
  const serviceMail = "service@beingsign.com";
  const html = FormatHtml({
    lang,
    tmpName,
    inviteCode,
    userName,
    inviter,
    companyName,
    departmentName,
    serviceMail
  });
  const template = Handlebars.compile(ErrorCodes[lang]["sendInviteEmailTitle"]);
  const subject = template({ companyName, departmentName });
  sendOneEmail({ email, lang, html, subject });
}
// 注册公司 发送到指定邮箱
function sendRegisterCompanyEmail(name, email) {
  const html = `
    <p>用戶Email：${email}</p>
    <p>公司名稱：${name}</p>
  `;
  sendOneEmail({
    email: "service@beingsign.com ",
    html,
    subject: "簽署王 公司註冊"
  });
}
// 留言 发送到指定的邮箱
function addMessage(userName, email, message) {
  // 用户名，用户邮箱，留言信息
  const html = `
    <p>用戶姓名：${userName}</p>
    <p>用戶Email：${email}</p>
    <p>用戶提問：${message}</p>
  `;
  sendOneEmail({
    email: "service@beingsign.com ",
    html,
    subject: "簽署王 客服提問信"
  });
}
// 撤回时 发送邮件
function withdrawEmail(
  email,
  lang,
  userName,
  companyName,
  title,
  length,
  message,
  comment
) {
  const tmpName = "withdraw"; // 模板文件名
  // 邮件标题
  const withdrawTitle = companyName
    ? ErrorCodes[lang]["withdrawCompanyTitle"]
    : ErrorCodes[lang]["withdrawTitle"];
  const template = Handlebars.compile(withdrawTitle);
  const subject = template({ userName, companyName, title });

  // 邮件内的内容标题
  const contentTitle = companyName
    ? ErrorCodes[lang]["withdrawCompanyTitleEmail"]
    : ErrorCodes[lang]["withdrawTitleEmail"];
  const sTemplate = Handlebars.compile(contentTitle);
  const contentTitleEmail = sTemplate({ userName, companyName, title });

  const html = FormatHtml({
    lang,
    tmpName,
    companyName,
    contentTitleEmail,
    userName,
    title,
    message,
    length,
    comment
  });

  sendOneEmail({ email, lang, html, subject });
}

// 同意 拒绝 签署时发送邮件
function signSendEmail(
  email,
  lang,
  agree,
  userName,
  companyName,
  title,
  length,
  message,
  comment,
  type
) {
  const tmpName = "sign"; // 模板文件名
  // 同意或者拒絕簽署
  let typeName = "同意";
  if (type === 3) {
    typeName = ErrorCodes[lang]["signTypeName"]; // '签署'
  }
  const agreeStr = agree ? typeName : ErrorCodes[lang]["refuse"];
  const signTitle = companyName
    ? ErrorCodes[lang]["signCompanyTitle"]
    : ErrorCodes[lang]["signTitle"];

  const template = Handlebars.compile(signTitle);
  const subject = template({ userName, agreeStr, companyName, title });
  const html = FormatHtml({
    lang,
    tmpName,
    agree,
    companyName,
    signTitle: subject,
    title,
    message,
    length,
    comment
  });

  sendOneEmail({ email, lang, html, subject });
}

// 签署完成
function signCompleteSendEmail(
  sendAllEmailList,
  signerList,
  approverList,
  letter,
  lang,
  userName,
  companyName,
  { currentUserId, letterReceiver, userList, letterFile }
) {
  const tmpName = "signComplete"; // 模板文件名
  const title = letter.title;
  const signTitle = companyName
    ? ErrorCodes[lang]["signCompleteCompanyTitle"]
    : ErrorCodes[lang]["signCompleteTitle"];
  const template = Handlebars.compile(signTitle);
  const subject = template({ userName, companyName, title });

  // const signCompleteTitleEmail = companyName
  //   ? ErrorCodes[lang]["signCompleteCompanyTitleEmail"]
  //   : ErrorCodes[lang]["signCompleteTitle"]; // 邮件内的标题
  // const sTemplate = Handlebars.compile(signCompleteTitleEmail);
  // const signCompleteTitle = sTemplate({ userName, companyName, title });
  const html = FormatHtml({
    lang,
    tmpName,
    letter,
    signerList,
    userName,
    approverList
  });
  Promise.all(
    sendAllEmailList.map(async item => {
      const pdfPath = await generatePdf.generatePdf(currentUserId, {
        letter,
        letterReceiver,
        userList,
        letterFile
      });
      sendOneEmail({ email: item, lang, html, subject, pdfPath });
    })
  );
}

// 忘记密码 发送邮件
function forgetSendEmail(email, resetHash, lang) {
  let url = `/client/ResetPassword?hash=${resetHash}`;
  const tmpName = "forget"; // 模板文件名
  const titleType = "forgetEmailTitle"; // 标题名称
  const html = FormatHtml({
    url,
    lang,
    tmpName
  });

  sendOneEmail({ email, lang, html, titleType });
}

// 注册时的「验证码信函」
function registerCodeSendEmail(email, code, lang) {
  const tmpName = "registerCode"; // 模板文件名
  const titleType = "registerCodeEmailTitle"; // 标题名称
  const html = FormatHtml({
    code,
    lang,
    tmpName
  });
  sendOneEmail({ email, lang, html, titleType });
}

// 登入成功时的通知范本
function loginSuccessSendEmail(email, lang) {
  const tmpName = "login"; // 模板文件名
  const titleType = "loginSuccessEmailTitle"; // 标题名称
  const html = FormatHtml({
    login: "success",
    lang,
    tmpName
  });
  sendOneEmail({ email, lang, html, titleType });
}

// 登入失败时的通知范本
function loginFailSendEmail(email, lang) {
  const tmpName = "login"; // 模板文件名
  const titleType = "loginFailEmailTitle"; // 标题名称
  const html = FormatHtml({
    login: "fail",
    lang,
    tmpName
  });
  sendOneEmail({ email, lang, html, titleType });
}

// 重设密码的通知范本
function resetSendEmail(email, lang) {
  const tmpName = "reset"; // 模板文件名
  const titleType = "resetEmailTitle"; // 标题名称
  const html = FormatHtml({ lang, tmpName });
  sendOneEmail({ email, lang, html, titleType });
}

// 绑定  E-mail  的验证码通知
function bindSendEmail(email, code, lang) {
  const tmpName = "bindModify"; // 模板文件名
  const titleType = "bindEmailTitle"; // 标题名称
  const html = FormatHtml({
    type: "bind",
    code,
    lang,
    tmpName
  });
  sendOneEmail({ email, lang, html, titleType });
}

// 申请修改登入密码的通知
function modifyLoginSendEmail(email, code, lang) {
  const tmpName = "bindModify"; // 模板文件名
  const titleType = "modifyLoginEmailTitle"; // 标题名称
  const html = FormatHtml({
    type: "modifyLogin",
    code,
    lang,
    tmpName
  });
  sendOneEmail({ email, lang, html, titleType });
}

// 申请修改签署密码的通知的通知
function modifySendEmail(email, code, lang) {
  const tmpName = "bindModify"; // 模板文件名
  const titleType = "modifyEmailTitle"; // 标题名称
  const html = FormatHtml({
    type: "modify",
    code,
    lang,
    tmpName
  });
  sendOneEmail({ email, lang, html, titleType });
}

// 以个人身分发起签署，發起人"會收到的通知
function createrUserSendEmail(email, len, title, message, lang) {
  console.log("createrUserSendEmail->len", len);
  const tmpName = "person"; // 模板文件名
  const html = FormatHtml({
    role: "creater",
    len,
    title,
    message,
    lang,
    tmpName
  });
  const template = Handlebars.compile(
    ErrorCodes[lang]["creatorUserEmailTitle"]
  );
  const subject = template({ title, len });
  sendOneEmail({ email, lang, html, subject });
}

// 以个人身分发起签署，簽署人和閱覽人會收到的通知
function signerUserSendEmail(email, len, title, userName, message, lang) {
  console.log("signerUserSendEmail->len", len);
  const tmpName = "person"; // 模板文件名
  const html = FormatHtml({
    role: "signer",
    userName,
    len,
    title,
    message,
    lang,
    tmpName
  });
  const template = Handlebars.compile(ErrorCodes[lang]["signerUserEmailTitle"]);
  const subject = template({ title, len, userName });
  sendOneEmail({ email, lang, html, subject });
}

// 以公司身分发起签署，發起人會收到的通知
function createrCompanySendEmail(
  email,
  len,
  title,
  userName,
  companyName,
  message,
  lang
) {
  console.log("createrCompanySendEmail->len", len);
  const tmpName = "company"; // 模板文件名
  const html = FormatHtml({
    role: "signer",
    len,
    title,
    userName,
    companyName,
    message,
    lang,
    tmpName
  });
  const template = Handlebars.compile(
    ErrorCodes[lang]["creatorCompanyEmailTitle"]
  );
  const subject = template({ title, len, companyName });
  sendOneEmail({ email, lang, html, subject });
}

// 以公司身分发起签署，簽署人和閱覽人會收到的通知
function signerCompanySendEmail(
  email,
  len,
  title,
  userName,
  companyName,
  message,
  lang
) {
  console.log("signerCompanySendEmail->len", len);
  const tmpName = "company"; // 模板文件名
  const html = FormatHtml({
    role: "signer",
    len,
    title,
    userName,
    companyName,
    message,
    lang,
    tmpName
  });
  const template = Handlebars.compile(
    ErrorCodes[lang]["signerCompanyEmailTitle"]
  );
  const subject = template({ title, len, companyName, userName });
  sendOneEmail({ email, lang, html, subject });
}

module.exports = {
  signSendEmail,
  resetSendEmail,
  forgetSendEmail,
  registerCodeSendEmail,
  loginSuccessSendEmail,
  loginFailSendEmail,
  bindSendEmail,
  modifyLoginSendEmail,
  modifySendEmail,
  createrUserSendEmail,
  signerUserSendEmail,
  createrCompanySendEmail,
  signerCompanySendEmail,
  signCompleteSendEmail,
  withdrawEmail,
  addMessage,
  sendInviteEmail,
  sendRegisterCompanyEmail
};
