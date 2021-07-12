const Handlebars = require("handlebars");
const Fs = require("fs");
const path = require("path");

// this will be called after the file is read
function renderToString(source, data) {
  var template = Handlebars.compile(source);
  var outputString = template(data);
  return outputString;
}

// lang 是語系 tmpName 是模板文件文件名 其餘參數為模板要用到的參數
function allTemplate({
  lang,
  tmpName,
  myTime,
  loginStr,
  allUrl,
  code,
  personStr,
  messageStr,
  title,
  len,
  baseUrl,
  companyName,
  imgUrl,
  bindStr,
  signTitle,
  signCompleteTitle,
  refuse,
  contentTitleEmail,
  comment,
  commentStr,
  inviteCode,
  inviter,
  departmentName,
  letter,
  signerList,
  approverList,
  userName,
  serviceMail
}) {
  // console.log({ imgUrl });
  const htmlPath = path.join(__dirname, `./${lang}/${tmpName}.html`);
  const source = Fs.readFileSync(htmlPath, "utf8");
  return renderToString(source, {
    lang,
    tmpName,
    myTime,
    loginStr,
    allUrl,
    code,
    personStr,
    messageStr,
    title,
    len,
    baseUrl,
    companyName,
    imgUrl,
    bindStr,
    signTitle,
    signCompleteTitle,
    refuse,
    contentTitleEmail,
    comment,
    commentStr,
    inviteCode,
    inviter,
    departmentName,
    letter,
    signerList,
    approverList,
    userName,
    serviceMail
  });
}

module.exports = allTemplate;
