module.exports = {
  // auth
  "91001": "不正确的TOKEN",
  "91002": "验证码未发送，验证码不存在",
  "91003": "验证码错误，请重新输入",
  "91004": "因错误次数过多，此验证码已失效，请重新获取验证码",
  "91005": "验证码已经失效，请重新点击获取验证码",
  "91006": "不合法的hash值",
  "91007": "请于1分钟后再重新申请重置密码",
  "91008": "操作过于频繁，请于一个小时后重新申请重置密码",
  "91009": "申请重置密码失败",
  "91010": "注册失败",
  "91011": "此 E-mail 已存在，请输入别的 E-mail",
  "91012": "账户已被冻结",
  "91013": "此 E-mail 尚未注册或通过验证，请先完成注册流程",
  "91014": "密码错误，请重新输入",
  "91015": "签署密码错误",
  "91016": "邀请码不存在",
  "91017": "邀请记录不存在",
  "91018": "邀请已经过期",
  "91019": "邀请码已被使用",
  // verification
  "91900": "此文件并非由本服务产生",
  "91901": "查无文件下载记录",
  "91902": "原始文件已被修改",
  "91903": "验证文件错误",
  // contact
  "92001": "联系人已存在，不能重复添加",
  // organization
  "92002": "您没有指定公司部门管理员的权限",
  "92003": "部门名称已存在",
  "92004": "你没有权限修改",
  "92005": "部门管理员已存在",
  "92006": "部门不存在",
  "92007": "部门名称重复",
  "92008": "沒有权限",
  "92009": "该公司名下不存在此部门",
  "92010": "不能设置为部门管理员",
  // email
  "93001": "过于频繁获取验证码，请于一个小时后重新获取验证码",
  "93002": "请于1分钟后再重新获取验证码",
  // letter
  "94001": "签署文件不存在",
  "94002": "签署文件不允许撤回，只有签署中的文件才能被撤回",
  "94003": "签署文件已过期",
  "94004": "没有撤回文件的权限",
  "94005": "签署失败，签署人错误",
  "94006": "签署失败，当前用户不在签署人列表里面",
  "94007": "签署失败，不允许重复签署",
  "94008": "签署失败，当前文件不允许签署",
  "94009": "文件上传失败",
  "94010": "没有下载权限",
  "94011": "公司不存在",
  "94012": "剩余签署次数为0",
  "94013": "只能上传PDF格式的文档",
  "94014": "文件己被修改",
  "94015": "签署失败，签署身份错误",
  // signing
  "95001": "授权已存在",
  "95002": "无授权权限",
  "95003": "被解除授权的人不存在",
  "95004": "授权失败",
  sign_agree: "同意签署",
  sign_decline: "拒绝签署",
  // 标签相关
  "96001": "原标签已被删除或不存在",
  "96002": "单一账号不得超过20个标签",
  "96003": "更新的标签不在已有的标签列表中",
  "96004": "标签已存在，不能重复添加",
  // payment
  "97001": "商品不存在",
  "97002": "公司不存在",
  "97003": "订单不存在",
  "97004": "回调状态错误",
  "97005": "创建订单失败",
  "97006": "发票参数有误",
  // 通用错误提示
  "99001": "用户不存在",
  "99002": "系统错误",
  "99003": "参数错误",
  // 参数校验时提示
  "98001": "请输入有效的电子邮件格式",
  "98002": "请输入 8~12 位英文加数字的密码",
  "98003": "密码不一致",
  "98004": "请先同意用户使用条款",
  "98005": "文件超过 30 MB 的限制",
  "98006": "不能为空，且必须为数字",
  "98007": "不能为空，且必须为字符串",
  "98008": "不能为空",
  "98009": "不能为空，且必须为字符串，以Bearer 开头",
  "98010": "不能为空，且必须为数组",
  "98011": "文件上传超时，上传时间不能超过30分钟",
  "98012": "必须选择需要上传的文件",
  "98013": "验证码长度不对",
  "98014": "标签最大长度为16",
  // block chain
  "99999": "发送区块链交易异常",
  // 邮件相关提示
  success: "成功",
  fail: "失败",
  no: "无",
  you: "你",
  signTypeName: "签署",
  bindEmail: "绑定了此  E-mail",
  modifyLogin: "申请修改登入密码",
  modify: "申请修改签署密码",
  forgetEmailTitle: "主旨：忘记密码通知信-「签署王」",
  registerCodeEmailTitle: "主旨：注册信-「签署王」",
  loginSuccessEmailTitle: "主旨：登入成功通知信-「签署王」",
  loginFailEmailTitle: "主旨：登入失败通知信-「签署王」",
  resetEmailTitle: "主旨：重设密码通知信-「签署王」",
  bindEmailTitle: "主旨：绑定  E-mail  通知信-「签署王」",
  modifyLoginEmailTitle: "主旨：申请修改登入密码通知信-「签署王」",
  modifyEmailTitle: "主旨：申请修改签署密码通知信-「签署王」",
  creatorUserEmailTitle:
    "主旨：你发起了  {{title}}  签署；文件  {{len}}  份-「签署王」",
  signerUserEmailTitle:
    "主旨：{{userName}}  发起了  {{title}}  签署；文件  {{len}}  份-「签署王」",
  creatorCompanyEmailTitle:
    "主旨：你代表  {{companyName}}  发起了  {{title}}  签署；文件  {{len}}  份-「签署王」",
  signerCompanyEmailTitle:
    "主旨：{{userName}}  代表  {{companyName}}  发起了  {{title}}  签署；文件  {{len}}  份-「签署王」",
  signEmailTitle: "主旨：签署状态通知-「签署王」",
  refuse: "拒绝",
  signTitle: "{{userName}} {{agreeStr}}了 {{title}}。 -「签署王」",
  signCompanyTitle:
    "{{userName}} 代表 {{companyName}} {{agreeStr}}了 {{title}}。 -「签署王」",
  signCompleteTitle: "{{userName}} 发起的 {{title}} 已经完成签署。 -「签署王」",
  signCompleteCompanyTitle:
    "{{companyName}} 的 {{title}} 已经完成签署。 -「签署王」",
  signCompleteCompanyTitleEmail:
    "{{userName}} 代表 {{companyName}} 发起的 {{title}} 已经完成签署。 -「签署王」",
  withdrawTitle: "{{userName}} 撤回了 {{title}}。 -「签署王」",
  withdrawTitleEmail: "{{userName}} 撤回了 {{title}}。",
  withdrawCompanyTitle:
    "{{userName}} 代表 {{companyName}} 撤回了 {{title}} 。 -「签署王」",
  withdrawCompanyTitleEmail:
    "{{userName}} 代表 {{companyName}} 撤回了 {{title}} 。",
  sendInviteEmailTitle: "{{companyName}}的{{departmentName}}邀请您加入签署王",
  mailTitle: {
    alreadyRead: "主旨：阅读状态通知-「签署王」",
    viewFile: "主旨：查阅状态通知-「签署王」"
  }
};