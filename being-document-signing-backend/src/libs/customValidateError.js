const ErrorCodes = require("./errorCodes");
module.exports = (path, key, type, json, lang) => {

  console.log('validate : ', path, key, type, json, lang)
  if (key == 'email' && (type == 'string.email' || type == 'any.empty')) {
    json.code = 98001;
    json.message = ErrorCodes[lang]["98001"];
  }
  if (key == 'password' && (type == 'string.min' || type == 'string.max' || type == 'string.regex.name')) {
    json.code = 98002;
    json.message = ErrorCodes[lang]["98002"];
  }
  if (key == 'passwordConfirm' && type == 'any.allowOnly') {
    json.code = 98003;
    json.message = ErrorCodes[lang]["98003"];
  }
  if (key == 'agreeTerms' && type == 'any.allowOnly') {
    json.code = 98004;
    json.message = ErrorCodes[lang]["98004"];
  }
  if (key == 'timestamp' || key == 'start' || key == 'limit' || key == 'contractId' || key == 'type' || key == 'letterId' || key == 'userId' || key == 'fileSize') {
    // 不能为空，且必须为数字
    json.code = 98006;
    json.message = key + ' : ' + ErrorCodes[lang]["98006"];
  }
  if (key == 'hash' || key == 'address' || key == 'username' || key == 'message' || key == 'signature' || key == 'url' || key == 'name' || key == 'key' || key == 'role' || key == 'fileName' || key == 'fileType' || key == 'fileUrl' || key == 'fileHash') {
    // 不能为空，且必须为字符串
    json.code = 98007;
    json.message = key + ' : ' + ErrorCodes[lang]["98007"];
  }
  if (key == 'corpId') {
    json.code = 98008;
    json.message = key + ' : ' + ErrorCodes[lang]["98008"];
  }
  if ((key == 'code' || key == 'emailCode') && (type == 'string.length' || type == 'any.empty')) {
    json.code = 98013;
    json.message = ErrorCodes[lang]["98013"];
  }
  if (key == 'signerList' || key == 'fileList') {
    // /letter/create
    json.code = 98010;
    json.message = key + ' : ' + ErrorCodes[lang]["98007"];
  }
  if (key == 'authorization') {
    json.code = 98009;
    json.message = key + ' : ' + ErrorCodes[lang]["98009"];
  }
  if (path == '/letter/upload' && key == 'maxBytes') {
    json.code = 98005;
    json.message = ErrorCodes[lang]["98005"];
  }
  if (path == '/letter/upload' && key == 'timeout') {
    json.code = 98011;
    json.message = ErrorCodes[lang]["98011"];
  }
  if (path == '/letter/upload' && key == 'file') {
    json.code = 98012;
    json.message = ErrorCodes[lang]["98012"];
  }
  if (key == 'tagName' && path == '/tag/addOrUpdate') {
    json.code = 98014;
    json.message = ErrorCodes[lang]["98014"];
  }
  return json;
}
