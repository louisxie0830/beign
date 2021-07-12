const Send = require("../libs/mailer");
const ErrorCodes = require("../libs/errorCodes");
const Uuidv4 = require("uuid/v4");
const Moment = require("moment");
module.exports = {
  inviteCreate: async (request, h) => {
    const email = request.payload.email;
    const mobile = request.payload.mobile;
    const city = request.payload.city;
    const companyId = request.payload.companyId;
    const departmentId = request.payload.departmentId || null;
    const name = request.payload.name;
    const country = request.payload.country;
    const positionName = request.payload.positionName;
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    const inviteCode = Uuidv4();
    const InviteRecordModel = request.getModel("inviteRecord");
    const UserModel = request.getModel("user");
    const CompanyModel = request.getModel("company");
    const DepartmentModel = request.getModel("department");
    const expiredTime = Moment()
      .add(7, "days")
      .toDate();
    try {
      await InviteRecordModel.create({
        userId: currentUserId,
        companyId,
        departmentId,
        name,
        mobile,
        email,
        inviteCode,
        country,
        city,
        expiredTime,
        positionName
      });
      const user = await UserModel.findOne({
        where: { id: currentUserId }
      });
      const company = await CompanyModel.findOne({
        where: { id: companyId }
      });
      const department = await DepartmentModel.findOne({
        where: { id: departmentId }
      });
      const departmentName = department.name || "";
      Send.sendInviteEmail(
        email,
        lang,
        inviteCode,
        name,
        user.name,
        company.name,
        departmentName
      );
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      console.error(e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  inviteInfo: async (request, h) => {
    const lang = request.getLocale();
    const inviteCode = request.query.inviteCode;
    const InviteRecordModel = request.getModel("inviteRecord");
    const CompanyModel = request.getModel("company");
    const DepartmentModel = request.getModel("department");
    try {
      const inviteRecord = await InviteRecordModel.findOne({
        where: { inviteCode }
      });
      if (!inviteRecord) {
        return {
          code: 91016,
          message: ErrorCodes[lang]["91016"]
        };
      }
      const company = await CompanyModel.findOne({
        where: { id: inviteRecord.companyId }
      });
      const department = await DepartmentModel.findOne({
        where: { id: inviteRecord.departmentId }
      });
      const data = {
        mobile: inviteRecord.mobile,
        company: {
          id: company.id,
          name: company.name
        },
        department: {
          id: department.id,
          name: department.name
        },
        email: inviteRecord.email,
        city: inviteRecord.city,
        country: inviteRecord.country,
        name: inviteRecord.name,
        positionName: inviteRecord.positionName
      };
      return {
        code: 200,
        data,
        message: "success"
      };
    } catch (e) {
      console.error(e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  }
};
