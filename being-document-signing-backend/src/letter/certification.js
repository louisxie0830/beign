const Fs = require("fs");
const ErrorCodes = require("../libs/errorCodes");
const { Op } = require("sequelize");
const generatePdf = require("../libs/generatePdf");
const Uuidv4 = require("uuid/v4");
const Moment = require("moment");

async function checkLetterUser(request, userId, letterId) {
  const UserModel = request.getModel("user");
  const LetterModel = request.getModel("letter");
  const LetterReceiverModel = request.getModel("letterReceiver");
  const LetterFileModel = request.getModel("letterFile");
  const user = await UserModel.findOne({ where: { id: userId } });
  if (!user) {
    return false;
  }
  const letter = await LetterModel.findOne({
    where: { id: letterId }
  });
  if (!letter) {
    return false;
  }
  const letterReceiver = await LetterReceiverModel.findAll({
    where: { letterId: letterId },
    order: [["order", "ASC"]]
  });
  const userIds = letterReceiver.map(item => item.userId);
  const tap = userIds.find(item => item === userId);
  if (!tap && userId !== letter.senderId) {
    return false;
  }
  const emails = letterReceiver.map(item => item.email);
  const userList = await UserModel.findAll({
    where: {
      [Op.or]: [
        {
          email: {
            [Op.in]: emails
          }
        },
        {
          id: letter.senderId
        }
      ]
    }
  });
  const letterFile = await LetterFileModel.findAll({
    where: { letterId: letter.id }
  });
  return {
    letter,
    letterReceiver,
    userList,
    letterFile
  };
}

module.exports = {
  pdfView: async (request, h) => {
    const letterId = request.query.id;
    const LetterModel = request.getModel("letter");
    const LetterReceiverModel = request.getModel("letterReceiver");
    const LetterFileModel = request.getModel("letterFile");
    const UserModel = request.getModel("user");
    const UserDepartmentModel = request.getModel("userDepartment");
    const CompanyModel = request.getModel("company");
    const letter = await LetterModel.findOne({ where: { id: letterId } });
    const letterReceivers = await LetterReceiverModel.findAll({
      where: {
        letterId,
        type: {
          [Op.or]: [1, 3]
        }
      },
      order: [["order", "ASC"]]
    });
    const letterFiles = await LetterFileModel.findAll({
      where: { letterId }
    });
    const userIds = letterReceivers
      .filter(
        letterReceiver => letterReceiver.type === 1 || letterReceiver.type === 3
      )
      .map(letterReceiver => letterReceiver.userId);
    const companyIds = letterReceivers
      .filter(
        letterReceiver => letterReceiver.type === 1 || letterReceiver.type === 3
      )
      .map(letterReceiver => letterReceiver.receiverCompanyId);
    userIds.push(letter.senderId);
    companyIds.push(letter.companyId);
    const users = await UserModel.findAll({
      where: { id: { [Op.in]: userIds } }
    });
    const companies = await CompanyModel.findAll({
      where: { id: { [Op.in]: companyIds } }
    });
    const userDepartments = await UserDepartmentModel.findAll({
      where: {
        userId: { [Op.in]: userIds },
        companyId: { [Op.in]: companyIds }
      }
    });
    const data = {
      id: letter.id,
      uuid: letter.uuid,
      title: letter.title,
      signerList: letterReceivers.map(item => {
        const u = users.find(u => u.id === item.userId);
        const company = companies.find(
          company => company.id === item.receiverCompanyId
        );
        const userDepartment = userDepartments.find(
          ud =>
            ud.userId === item.userId && ud.companyId === item.receiverCompanyId
        );
        return {
          order: item.order,
          type: item.type,
          companyName: (company && company.name) || "",
          positionName: (userDepartment && userDepartment.positionName) || "",
          name: (u && u.name) || "",
          time: Moment(item.signTime).isValid() && Moment(item.signTime).utcOffset(480).format("YYYY-MM-DD HH:mm:ss") || ""
        };
      }),
      fileList: letterFiles.map(item => {
        return { fileName: item.name, fileId: item.uuid };
      })
    };
    return h.view("certification", data);
  },
  letterDownload: async (request, h) => {
    const userAgent = (request.headers["user-agent"] || "").toLowerCase();
    const letterId = request.query.letterId;
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    try {
      const checkResult = await checkLetterUser(
        request,
        currentUserId,
        letterId
      );
      if (!checkResult) {
        return {
          code: 92008,
          message: ErrorCodes[lang]["92008"]
        };
      }

      const fileUrl = await generatePdf.generatePdf(currentUserId, checkResult);
      const fileByte = Fs.readFileSync(fileUrl);
      console.log("fileByte", fileByte.length);
      const response = h.response(fileByte);
      response.type("application/pdf");
      if (userAgent.indexOf("firefox") >= 0) {
        response.header(
          "content-disposition",
          "attachment; filename*=utf-8'zh_cn'" +
          encodeURIComponent(Uuidv4()) +
          ".pdf"
        );
      } else {
        response.header(
          "content-disposition",
          "attachment; filename=" + encodeURIComponent(Uuidv4()) + ".pdf"
        );
      }
      return response;
    } catch (e) {
      console.log(e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  letterPreview: async (request, h) => {
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    const letterId = request.query.letterId;
    try {
      const checkResult = await checkLetterUser(
        request,
        currentUserId,
        letterId
      );
      if (!checkResult) {
        return {
          code: 92008,
          message: ErrorCodes[lang]["92008"]
        };
      }
      const fileUrl = await generatePdf.generatePdf(currentUserId, checkResult);
      return h.file(fileUrl);
    } catch (e) {
      console.log(e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  list: async (request, h) => {
    const type = request.query.type;
    const companyId = request.query.companyId || 0;
    const start = request.query.start;
    const limit = request.query.limit;
    const beginDate = request.query.beginDate;
    const endDate = request.query.endDate;
    const currentUserId = request.auth.credentials.userId;
    const letterModel = request.getModel("letter");
    const lang = request.getLocale(); // 获取语系
    try {
      const sequelize = request.getDb().sequelize;
      let list = [];
      const opt = {
        status: 3,
        senderId: currentUserId,
        companyId: companyId
      };
      // 发起的 签署完成的档案
      if (type === 1) {
        if (beginDate) {
          opt.completeTime = opt.completeTime || {};
          opt.completeTime[Op.gt] = beginDate + " 00:00:00";
        }
        if (endDate) {
          opt.completeTime = opt.completeTime || {};
          opt.completeTime[Op.lt] = endDate + " 23:59:59";
        }
        list = await letterModel.findAll({
          offset: start,
          limit: limit,
          where: opt
        });
      } else {
        let sql =
          "SELECT l.id, l.title, l.complete_time FROM letter l join letter_receiver lr on l.id = lr.letter_id WHERE l.status = 3 and lr.type = :myType and lr.user_id = :userId  and lr.receiver_company_id = :companyId ";
        const param = {
          userId: currentUserId,
          start,
          limit,
          companyId
        };
        if (beginDate) {
          sql += " and complete_time > :beginDate ";
          param.beginDate = beginDate + " 00:00:00 ";
        }
        if (endDate) {
          sql += " and complete_time < :endDate ";
          param.endDate = endDate + " 23:59:59 ";
        }
        sql += " limit :start, :limit";
        // 已签署
        if (type === 2) {
          param.myType = 1;
        }
        // 已同意
        if (type === 3) {
          param.myType = 3;
        }
        list = await sequelize.query(sql, {
          replacements: param,
          type: sequelize.QueryTypes.SELECT
        });
      }
      const data = list.map(item => {
        return {
          id: item.id,
          title: item.title,
          completeTime: item.complete_time || item.completeTime
        };
      });
      return {
        code: 200,
        message: "success",
        data
      };
    } catch (e) {
      console.log(e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  }
};
