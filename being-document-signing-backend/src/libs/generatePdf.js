const Fs = require("fs");
const Path = require("path");
const Moment = require("moment");
const PdfUtil = require("./pdf-util");
const Uuidv4 = require("uuid/v4");

module.exports = {
  generatePdf: async (
    currentUserId,
    { letter, letterReceiver, userList, letterFile }
  ) => {
    const dataBaseFileKey = letter.id + Uuidv4() + ".pdf";
    const baseUrl = Path.join(__dirname, "../../attachment");
    if (!Fs.existsSync(baseUrl)) {
      Fs.mkdirSync(baseUrl);
    }
    const pdfPath = baseUrl + "/" + dataBaseFileKey;
    // let senderUserRow = userList.find(item => item.id === letter.senderId);
    // let lastSignTime = "";
    // const receiverList = letterReceiver
    //   .filter(item => item.type === 1 || item.type === 3)
    //   .map((item, index) => {
    //     if (index === letterReceiver.length - 1) {
    //       lastSignTime = item.signTime;
    //     }
    //     return {
    //       name: userList.find(i => i.id === item.userId).name || "",
    //       userId: item.userId,
    //       type: item.type,
    //       time: Moment(item.signTime)
    //         .utcOffset(480)
    //         .format("YYYY-MM-DD HH:mm:ss")
    //     };
    //   });
    // const pdfData = {
    //   documentId: letter.id,
    //   documentName: letter.title,
    //   completedAt: Moment(letter.completeTime || lastSignTime)
    //     .utcOffset(480)
    //     .format("YYYY-MM-DD HH:mm:ss"),
    //   creator: senderUserRow.name,
    //   createdAt: Moment(letter.createTime)
    //     .utcOffset(480)
    //     .format("YYYY-MM-DD HH:mm:ss"),
    //   receiverList,
    //   fileList: letterFile
    // };
    // const lang = userList.find(item => item.id === currentUserId).languageCode;
    await PdfUtil.generateCertificationFile2(letter.id, pdfPath);
    return baseUrl + "/" + dataBaseFileKey;
  }
};
