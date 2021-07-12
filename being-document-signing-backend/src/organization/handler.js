const ErrorCodes = require("../libs/errorCodes");
const Send = require("../libs/mailer");
const Uuidv4 = require("uuid/v4");

module.exports = {
  companyCreate: async (request, h) => {
    const currentUserId = request.auth.credentials.userId;
    const name = request.payload.name;
    const lang = request.getLocale(); // 获取语系
    const Company = request.getModel("company");
    const CompanyAuthorized = request.getModel("companyAuthorized");
    try {
      const company = await Company.create({
        uuid: Uuidv4(),
        name: name,
        status: 1,
        applicantId: currentUserId,
        createTime: new Date()
      });
      await CompanyAuthorized.create({
        uuid: Uuidv4(),
        companyId: company.id,
        userId: currentUserId,
        role: 1,
        status: 1,
        authorizerSignatureId: 0,
        cancelSignatureId: 0,
        createTime: new Date()
      });
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("companyCreate", e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  companySendEmail: async (request, h) => {
    const name = request.payload.name;
    const email = request.payload.email;
    const lang = request.getLocale(); // 获取语系
    try {
      Send.sendRegisterCompanyEmail(name, email);
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("sendRegisterCompanyEmail", e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  departmentList: async (request, h) => {
    const companyId = request.query.companyId;
    const currentUserId = request.auth.credentials.userId;
    const companyAuthorizedModel = request.getModel("companyAuthorized");
    const lang = request.getLocale(); // 获取语系
    try {
      const company = await companyAuthorizedModel.findOne({
        where: { companyId, userId: currentUserId, status: 1 }
      });
      if (!company) {
        return {
          code: 94011,
          message: ErrorCodes[lang]["94011"]
        };
      }
      const sequelize = request.getDb().sequelize;
      const list = await sequelize.query(
        "SELECT u.name as adminName, d.id, d.admin_id as adminId, d.name FROM department d left join user u on d.admin_id = u.id WHERE d.company_id = :companyId and d.status = 1",
        {
          replacements: { companyId: companyId },
          type: sequelize.QueryTypes.SELECT
        }
      );
      return {
        code: 200,
        message: "success",
        data: list
      };
    } catch (err) {
      console.log("departmentList", err);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  departmentCreate: async (request, h) => {
    const name = request.payload.name;
    const companyId = request.payload.companyId;
    const adminId = request.payload.adminId || 0;
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    const Company = request.getModel("company");
    const CompanyAuthorized = request.getModel("companyAuthorized");
    const Department = request.getModel("department");
    const UserDepartmentModel = request.getModel("userDepartment");
    try {
      const companyRow = await Company.findOne({
        where: { id: companyId, status: 1 }
      });

      if (!companyRow) {
        return {
          code: 94011,
          message: ErrorCodes[lang]["94011"]
        };
      }
      const companyAdminRow = await CompanyAuthorized.findOne({
        where: {
          companyId: companyId,
          userId: currentUserId,
          role: 1,
          status: 1
        }
      });
      if (!companyAdminRow) {
        return {
          code: 92002,
          message: ErrorCodes[lang]["92002"]
        };
      }
      const DepNameRow = await Department.findOne({
        where: { companyId: companyId, name: name, status: 1 }
      });
      if (DepNameRow) {
        return {
          code: 92003,
          message: ErrorCodes[lang]["92003"]
        };
      }
      const department = await Department.create({
        companyId: companyId,
        name: name,
        adminId: adminId,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 1
      });
      if (adminId) {
        await UserDepartmentModel.create({
          userId: adminId,
          companyId,
          departmentId: department.id,
          isAdmin: true
        });
      }
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
  departmentUpdate: async (request, h) => {
    const departmentId = request.payload.departmentId;
    const adminId = request.payload.adminId;
    const name = request.payload.name;
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    const DepartmentModel = request.getModel("department");
    const UserModel = request.getModel("user");
    const companyAuthorizedModel = request.getModel("companyAuthorized");
    try {
      const department = await DepartmentModel.findOne({
        where: { id: departmentId, status: 1 }
      });
      if (!department) {
        return {
          code: 92006,
          message: ErrorCodes[lang]["92006"]
        };
      }
      const departmentInfo = await DepartmentModel.findOne({
        where: { id: departmentId, name, status: 1 }
      });
      if (departmentInfo && departmentInfo.id !== departmentId) {
        return {
          code: 92007,
          message: ErrorCodes[lang]["92007"]
        };
      }
      const user = await UserModel.findOne({ where: { id: adminId } });
      if (!user) {
        return {
          code: 99001,
          message: ErrorCodes[lang]["99001"]
        };
      }
      const companyAuthorized = await companyAuthorizedModel.findOne({
        where: {
          userId: currentUserId,
          companyId: department.companyId,
          role: 1
        }
      });
      if (!companyAuthorized) {
        return {
          code: 92004,
          message: ErrorCodes[lang]["92004"]
        };
      }
      department.adminId = adminId;
      department.name = name;
      await department.save();
      return {
        code: 200,
        message: "success"
      };
    } catch (err) {
      console.log(err);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  departmentDelete: async (request, h) => {
    const departmentId = request.payload.departmentId;
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    const DepartmentModel = request.getModel("department");
    const companyAuthorizedModel = request.getModel("companyAuthorized");
    try {
      const department = await DepartmentModel.findOne({
        where: { id: departmentId }
      });
      if (!department) {
        return {
          code: 92006,
          message: ErrorCodes[lang]["92006"]
        };
      }
      const company = await companyAuthorizedModel.findOne({
        where: {
          userId: currentUserId,
          role: 1,
          companyId: department.companyId,
          status: 1
        }
      });
      if (!company) {
        return {
          code: 92008,
          message: ErrorCodes[lang]["92008"]
        };
      }
      department.status = 2;
      await department.save();
      return {
        code: 200,
        message: "success"
      };
    } catch (err) {
      console.log(err);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  departmentQuery: async (request, h) => {
    const departmentId = request.query.departmentId;
    const companyId = request.query.companyId;
    const sequelize = request.getDb().sequelize;
    const lang = request.getLocale(); // 获取语系
    const DepartmentModel = request.getModel("department")
    try {
      let departmentSql = " IS NULL or ud.department_id = 0";
      const opt = { companyId }
      if (departmentId !== 0) {
        departmentSql = " = :departmentId"
        opt.departmentId = departmentId;
        const d = await DepartmentModel.findOne({
          where: {
            id: departmentId,
            companyId
          }
        });
        if (!d) {
          return {
            code: 92009,
            message: ErrorCodes[lang]["92009"]
          }
        }
      }
      const sql = "SELECT u.id, u.email, u.name, u.mobile_verify, ca.company_id, ud.department_id, ud.is_admin FROM `user` u LEFT JOIN (SELECT user_id,company_id FROM company_authorized WHERE status = 1 GROUP BY user_id,company_id) ca ON u.id = ca.user_id LEFT JOIN user_department ud ON u.id = ud.user_id AND ca.company_id = ud.company_id WHERE ca.company_id = :companyId AND ud.department_id " + departmentSql;
      const list = await sequelize.query(
        sql,
        {
          replacements: opt,
          type: sequelize.QueryTypes.SELECT
        }
      );
      const data = list.map(item => {
        return {
          isAdmin: item.is_admin === 1,
          id: item.id,
          name: item.name,
          email: item.email,
          mobile: item.mobile_verify
        };
      });
      return {
        data,
        code: 200,
        message: "success"
      };
    } catch (err) {
      console.log("departmentQuery", err);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  departmentUserInfo: async (request, h) => {
    const companyId = request.query.companyId;
    const userId = request.query.userId;
    const lang = request.getLocale();
    const UserDepartmentModel = request.getModel("userDepartment");
    const DepartmentModel = request.getModel("department");
    const UserModel = request.getModel("user");
    try {
      const user = await UserModel.findOne({
        where: { id: userId, status: 1 }
      });
      if (!user) {
        return {
          code: 99001,
          message: ErrorCodes[lang]["99001"]
        };
      }
      const userInfo = await UserDepartmentModel.findOne({
        where: { userId, companyId, status: 1 }
      });
      let department = null;
      if (userInfo) {
        department = await DepartmentModel.findOne({
          where: { id: userInfo.departmentId, status: 1 }
        });
      }
      return {
        data: {
          email: user.email,
          isAdmin: userInfo ? userInfo.isAdmin === 1 : "",
          name: user.name || "",
          mobile: user.mobileVerify,
          userId: user.id,
          city: userInfo ? userInfo.city : "",
          country: userInfo ? userInfo.country : "",
          positionName: userInfo ? userInfo.positionName : "",
          departmentId: department ? department.id : 0
        },
        code: 200,
        message: "success"
      };
    } catch (err) {
      console.log("departmentUserInfo", err);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  departmentInfoUpdate: async (request, h) => {
    const companyId = request.payload.companyId;
    const userId = request.payload.userId;
    const departmentId = request.payload.departmentId;
    const city = request.payload.city;
    const isAdmin = request.payload.isAdmin;
    const lang = request.getLocale(); // 获取语系
    const country = request.payload.country;
    const positionName = request.payload.positionName;
    const currentUserId = request.auth.credentials.userId;
    const UserDepartmentModel = request.getModel("userDepartment");
    const DepartmentModel = request.getModel("department")
    const CompanyAuthorizedModel = request.getModel("companyAuthorized");
    try {
      const company = await CompanyAuthorizedModel.findOne({
        where: {
          userId: currentUserId,
          role: 1,
          companyId: companyId,
          status: 1
        }
      });
      // 被指定的部门的管理员信息
      const d = await UserDepartmentModel.findOne({
        where: { departmentId, isAdmin: 1 }
      })
      // 当前用户的部门信息
      const currentUd = await UserDepartmentModel.findOne({
        where: { userId: currentUserId, companyId: companyId, status: 1 }
      });
      // 当前用户既不是公司管理员也不是部门管理员
      if (!company && currentUd && !currentUd.isAdmin) {
        console.log("第一个权限判断");
        return {
          code: 92004,
          message: ErrorCodes[lang]["92004"]
        };
      }
      // 被指定的用户的部门信息
      const setUd = await UserDepartmentModel.findOne({
        where: { userId, companyId, status: 1 }
      });
      // 当前用户不是公司管理员，是部门管理员 && 把没有部门信息的人指定到非本部门去 || <想指定管理员> || 想把管理员指定为非管理员 || 被指定的人已有部门且不是本部门的人 || 是本部门的人但是想把他丢到别的部门
      if (
        !company && currentUd && currentUd.isAdmin &&
        (
          (departmentId !== 0 && departmentId !== currentUd.departmentId)
          || isAdmin
          || (d && d.userId === userId && !isAdmin)
          || (setUd && setUd.departmentId !== 0 && setUd.departmentId !== currentUd.departmentId)
          || (setUd && setUd.departmentId === currentUd.departmentId && departmentId !== 0 && departmentId !== currentUd.departmentId)
        )
      ) {
        console.log("第2个权限判断");
        return {
          code: 92004,
          message: ErrorCodes[lang]["92004"]
        };
      }
      // 没有部门的人，不能指定管理员
      if (departmentId === 0 && isAdmin) {
        return {
          code: 92010,
          message: ErrorCodes[lang]["92010"]
        };
      }
      // 部门管理员已存在还要另外指定管理员，指定的人也不是已存在的管理员
      if (d && d.userId !== userId && isAdmin) {
        return {
          code: 92005,
          message: ErrorCodes[lang]["92005"]
        };
      }

      const options = { city, userId, companyId, country, positionName, departmentId, isAdmin: isAdmin ? 1 : 0 }
      const [userDepartment, created] = await UserDepartmentModel.findOrCreate({
        where: { userId, companyId, status: 1 },
        defaults: options
      });
      const oldDepartmentId = userDepartment.departmentId;
      if (!created) {
        await UserDepartmentModel.update(options, {
          where: { id: userDepartment.id }
        })
      }
      if (oldDepartmentId !== departmentId) {
        const ud = await UserDepartmentModel.findOne({
          where: { departmentId: oldDepartmentId, isAdmin: 1 }
        })
        await DepartmentModel.update({
          adminId: ud ? ud.userId : 0
        }, {
          where: { id: oldDepartmentId }
        });
      }
      const ud = await UserDepartmentModel.findOne({
        where: { departmentId, isAdmin: 1 }
      })
      await DepartmentModel.update({
        adminId: ud ? ud.userId : 0
      }, {
        where: { id: departmentId }
      });
      return {
        code: 200,
        message: "success"
      };
    } catch (err) {
      console.log("departmentInfoUpdate", err);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  resetAdmin: async (request, h) => {
    const adminId = request.payload.adminId;
    const departmentId = request.payload.departmentId;
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    const CompanyAuthorized = request.getModel("companyAuthorized");
    const Department = request.getModel("department");
    const UserDepartment = request.getModel("userDepartment");
    try {
      const department = await Department.findOne({
        where: { id: departmentId }
      });
      if (!department) {
        return {
          code: 92002,
          message: ErrorCodes[lang]["92002"]
        };
      }
      const companyAdminRow = await CompanyAuthorized.findOne({
        where: {
          companyId: department.companyId,
          userId: currentUserId,
          role: 1,
          status: 1
        }
      });
      if (!companyAdminRow) {
        return {
          code: 92002,
          message: ErrorCodes[lang]["92002"]
        };
      }
      department.adminId = adminId;
      await department.save();
      const userDepartment = await UserDepartment.findOne({
        where: {
          companyId: department.companyId,
          departmentId: departmentId,
          isAdmin: 1,
          status: 1
        }
      });
      if (userDepartment) {
        userDepartment.isAdmin = 0;
        await userDepartment.save();
      }
      const newUserDepartment = await UserDepartment.findOne({
        where: {
          companyId: department.companyId,
          departmentId: departmentId,
          userId: adminId,
          status: 1
        }
      });
      if (newUserDepartment) {
        userDepartment.isAdmin = 1;
        await userDepartment.save();
      } else {
        await UserDepartment.create({
          companyId: department.companyId,
          departmentId: departmentId,
          userId: adminId,
          isAdmin: 1,
          status: 1
        });
      }
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
  }
};
