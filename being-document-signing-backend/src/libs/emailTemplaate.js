// 获取当前时间
const Moment = require("moment");
const HandlebarsHtml = require("./i18n");
const ErrorCodes = require("../libs/errorCodes");

const baseUrl =  process.env.WEB_BASE_URL || `https://frontend-signing-test.beingtech.org`;
// console.log(Moment().utcOffset(480).format('YYYY/MM/DD HH:mm ([UTC]+8ZZ') + ')')
// const env = process.env.NODE_ENV;
const appUrl = process.env.API_BASE_URL || `https://backend-signing-test.beingtech.org`;
function formatHtml({
  code,
  url,
  login,
  type,
  role,
  userName,
  companyName,
  len,
  title,
  message,
  lang,
  tmpName,
  signTitle,
  agree,
  contentTitleEmail,
  signCompleteTitle,
  comment,
  inviteCode,
  inviter,
  departmentName,
  letter,
  signerList,
  approverList,
  serviceMail
}) {
  // 邮件的图片地址
  const imgUrl = `${appUrl}/static/email_${lang}.png`;
  if(letter){
    letter.create_time = Moment(letter.create_time).utcOffset(480).format('YYYY-MM-DD HH:mm:ss');
  }
  const myTime =
    Moment()
      .utcOffset(480)
      .format("YYYY/MM/DD HH:mm ([UTC]+8") + ")";
  // 忘記密码 需要跳转的url
  let allUrl = baseUrl + url;
  // 登錄 分成功和失败
  const loginStr = login === "success" ? ErrorCodes[lang]['success'] : ErrorCodes[lang]['fail'];
  // 绑定邮箱 申请修改登录密码 申请修改签署密码 时发送验证码 三封邮件只有几个字不一样
  let bindStr = "";
  if (type === "bind") {
    bindStr = ErrorCodes[lang]['bindEmail'];
  } else if (type === "modifyLogin") {
    bindStr = ErrorCodes[lang]['modifyLogin'];
  } else {
    bindStr = ErrorCodes[lang]['modify'];
  }
  // 个人邮件 公司邮件 签署时 创建签署的人和被要求签署的人的内容有点不同
  let personStr = role === "creater" ? ErrorCodes[lang]['you'] : userName;
  let messageStr = message || ErrorCodes[lang]['no'];
  let commentStr = comment || ErrorCodes[lang]['no'];
  // console.log(commentStr, '撤回/拒绝 评论')
  //
  const refuse = !agree;
  // console.log('signTitle', signTitle);
  // console.log('signCompleteTitle', signCompleteTitle);
  const formatEmailHtml = HandlebarsHtml({
    allUrl,
    lang,
    imgUrl,
    myTime,
    code,
    tmpName,
    loginStr,
    bindStr,
    baseUrl,
    len,
    title,
    personStr,
    messageStr,
    companyName,
    signTitle,
    signCompleteTitle,
    contentTitleEmail,
    refuse,
    comment,
    commentStr,
    inviteCode,
    inviter,
    departmentName,
    letter,
    signerList,
    userName,
    approverList,
    serviceMail
  });

  return formatEmailHtml
}

module.exports = formatHtml;
