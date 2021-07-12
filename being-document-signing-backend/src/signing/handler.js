const Uuidv4 = require("uuid/v4");
const ErrorCodes = require("../libs/errorCodes");
const Sign = require("../libs/sign");
const { web3, contractInstance } = require("../libs/web3-client");
const { Op } = require("sequelize");

module.exports = {
  getSigningSignature: async (request, h) => {
    const uuid = request.query.uuid;
    request.log("query_signature", uuid);
    try {
      let result = await contractInstance.methods.getSignature(uuid).call({
        from: web3.eth.defaultAccount
      });
      return {
        signatureId: result["0"],
        signatureString: result["1"],
        creatorId: result["2"],
        creatorAddress: result["3"],
        executorAddress: result["4"],
        createTime: result["5"]
      };
    } catch (e) {
      return e;
    }
  },
  getCompanyList: async request => {
    const userId = request.auth.credentials.userId;
    const lang = request.getLocale(); // 获取语系
    const role = request.query.role === "admin" ? [1, 2, 3] : [3];
    const CompanyAuthorizedModel = request.getModel('companyAuthorized');
    const CompanyModel = request.getModel('company');
    const DepartmentModel = request.getModel('department');
    try {
      const rows = await CompanyAuthorizedModel.findAll({
        where: {
          userId,
          role: {
            [Op.in]: role
          },
          status: 1
        }
      })
      const companyIds = rows.map(i => i.companyId);
      if (companyIds.length <= 0) {
        return {
          code: 200,
          message: "success",
          data: []
        };
      }
      const companyRows = await CompanyModel.findAll({
        where: {
          id: {
            [Op.in]: companyIds
          },
          status: 1
        }
      });
      const department = await DepartmentModel.findAll({
        where: {
          companyId: {
            [Op.in]: companyIds
          },
          status: 1
        }
      })
      const data = companyRows.map(i => {
        const companyAuth = rows.filter(j => j.companyId === i.id);
        const departmentList = department.filter(j => j.companyId === i.id).map(j => {
          return {
            id: j.id,
            name: j.name,
            adminId: j.adminId
          }
        })
        let minRole = null;
        if (companyAuth.length > 0) {
          minRole = companyAuth.reduce(
            (min, p) => (p.role < min ? p.role : min),
            companyAuth[0].role
          );
        }
        return {
          id: i.id,
          name: i.name,
          signing_quota: i.signingQuota,
          signing_remain: i.signingRemain,
          role: minRole,
          department: departmentList
        };
      });
      return {
        code: 200,
        message: "success",
        data: data
      };
    } catch (err) {
      request.log("ERROR", err);
      return {
        code: 99003,
        message: ErrorCodes[lang]["99003"]
      };
    }
  },
  getAuthorizedUserListByCompanyId: async request => {
    const pool = request.mysql.pool;
    const corpId = request.query.corpId;
    const role = request.query.role;
    const lang = request.getLocale(); // 获取语系
    const roleCode = role === "admin" ? [1, 2] : [3];
    try {
      const [rows] = await pool.query(
        "select user_id as id, role from company_authorized where company_id = ? and role in (?) and status = 1",
        [corpId, roleCode]
      );
      const user_ids = rows.map(i => i.id);
      if (user_ids && user_ids.length <= 0) {
        return {
          code: 200,
          message: "success",
          data: []
        };
      }
      const [user_rows] = await pool.query(
        "select id, name, email from user where id in (?) and status = 1",
        [user_ids]
      );
      const data = rows
        .map(x => {
          const b = user_rows.find(y => y.id == x.id);
          if (b) {
            return Object.assign({}, x, b);
          } else {
            return null;
          }
        })
        .filter(z => z !== null);
      return {
        code: 200,
        message: "success",
        data
      };
    } catch (err) {
      request.log("ERROR", err);
      return {
        code: 99003,
        message: ErrorCodes[lang]["99003"]
      };
      // throw Boom.internal('Internal Mysql Error', err)
    }
  },
  addSigningUser: async request => {
    const signature = request.headers.signature;
    const address = request.headers.address;
    const corpId = request.payload.corpId;
    const email = request.payload.email;
    const role = request.payload.role;
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    const pool = await request.mysql.pool.getConnection();
    await pool.beginTransaction();
    try {
      // 检查被授权人是否存在
      const checkUserExistSql =
        "select id,email,name from user where email = ? and status = 1";
      const [userRow] = await pool.query(checkUserExistSql, [email]);
      if (userRow.length <= 0) {
        return {
          code: 99001,
          message: ErrorCodes[lang]["99001"]
        };
      }
      // 检查当前用户
      const checkUserMeExistSql = "select id,email,name from user where id = ?";
      const [userMeRow] = await pool.query(checkUserMeExistSql, [
        currentUserId
      ]);
      if (userMeRow.length <= 0) {
        return {
          code: 99001,
          message: ErrorCodes[lang]["99001"]
        };
      }
      // 检查目标用户是否存在
      const userId = userRow[0].id;
      const checkAuthExistSql =
        "select count(1) c from company_authorized where company_id = ? and user_id = ? and status = 1 and role = ?";
      const [existRow] = await pool.query(checkAuthExistSql, [
        corpId,
        userId,
        role
      ]);
      if (existRow && existRow[0].c) {
        return {
          code: 95001,
          message: ErrorCodes[lang]["95001"]
        };
      }
      let roleCode = [1, 2];
      if (role === 2) {
        roleCode = [1];
      }
      // 检查当前用户是否存在且有相应权限
      const checkAdminSql =
        "select count(1) c from company_authorized where company_id = ? and user_id = ? and status = 1 and role in (?)";
      const [adminRow] = await pool.query(checkAdminSql, [
        corpId,
        currentUserId,
        roleCode
      ]);
      if (adminRow[0].c <= 0) {
        return {
          code: 95002,
          message: ErrorCodes[lang]["95002"]
        };
      }
      if (role === 2 && currentUserId === userId) {
        return {
          code: 95004,
          message: ErrorCodes[lang]["95004"]
        };
      }
      // 执行签署
      const signatureId = await Sign(pool, {
        target_type: 1,
        target_id: userId,
        signer_id: currentUserId,
        signer_address: address,
        message: request.payload,
        signature: signature,
        payload: "ADD_USER",
        signer_company_id: corpId
      });
      // end 执行签署
      const insertSql =
        "INSERT INTO `company_authorized` (`uuid`, `company_id`, `authorizer_signature_id`, `user_id`, `role`, `status`, `create_time`,`cancel_signature_id`) VALUES (?, ?, ?, ?, ?, ?, ?, 0)";
      await pool.query(insertSql, [
        Uuidv4(),
        corpId,
        signatureId,
        userId,
        role,
        1,
        new Date()
      ]);
      await pool.commit();
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("ERROR", e);
      await pool.rollback();
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    } finally {
      await pool.release();
    }
  },
  deleteSigningUser: async request => {
    const signature = request.headers.signature;
    const address = request.headers.address;
    const corpId = request.payload.corpId;
    const userId = request.payload.userId;
    const role = request.payload.role;
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    const pool = await request.mysql.pool.getConnection();
    await pool.beginTransaction();
    try {
      const queryUserSql = "select * from user where id = ? and status = 1";
      const [userPasswordRow] = await pool.query(queryUserSql, [currentUserId]);
      if (!userPasswordRow || !userPasswordRow[0]) {
        return {
          code: 99001,
          message: ErrorCodes[lang]["99001"]
        };
      }

      // 检查被授权人是否存在
      const checkAuthExistSql =
        "select * from company_authorized where company_id = ? and user_id = ? and role = ? and status = 1";
      const [existRow] = await pool.query(checkAuthExistSql, [
        corpId,
        userId,
        role
      ]);
      if (!existRow || !existRow[0]) {
        return {
          code: 95003,
          message: ErrorCodes[lang]["95003"]
        };
      }
      let roleCode = [1, 2];
      if (role === 2) {
        roleCode = [1];
      }
      // 检查授权人是否存在且有相应权限
      const checkAdminSql =
        "select count(1) c from company_authorized where company_id = ? and user_id = ? and status = 1 and role in (?)";
      const [adminRow] = await pool.query(checkAdminSql, [
        corpId,
        currentUserId,
        roleCode
      ]);
      if (adminRow[0].c <= 0) {
        return {
          code: 95002,
          message: ErrorCodes[lang]["95002"]
        };
      }
      // 执行签署
      const signatureId = await Sign(pool, {
        target_type: 1,
        target_id: userId,
        signer_id: currentUserId,
        signer_address: address,
        message: request.payload,
        signature: signature,
        payload: "DEL_USER",
        signer_company_id: corpId
      });
      // end 执行签署
      // 执行更新
      const updateSql =
        "UPDATE `company_authorized` SET `cancel_signature_id` = ?, `status` = ?, `stop_time` = ? WHERE company_id = ? AND user_id = ? and role = ?";
      await pool.query(updateSql, [
        signatureId,
        2,
        new Date(),
        corpId,
        userId,
        role
      ]);
      await pool.commit();
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("ERROR", e);
      await pool.rollback();
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    } finally {
      await pool.release();
    }
  },
  transferSigningAdmin: async request => {
    const signature = request.headers.signature;
    const address = request.headers.address;
    const corpId = request.payload.corpId;
    const email = request.payload.email;
    const lang = request.getLocale(); // 获取语系
    const code = request.payload.emailCode;
    const currentUserId = request.auth.credentials.userId;
    const pool = await request.mysql.pool.getConnection();
    await pool.beginTransaction();
    const redis = request.redis.client;
    const xFF = request.headers["x-forwarded-for"];
    const xR = request.headers["x-real-ip"];
    const ip = xFF ? xFF.split(",")[0] : xR || request.info.remoteAddress;
    const key = "email_code:" + email + "@" + ip;
    const data = await redis.get(key);
    let emailCode = JSON.parse(data);
    const now = Date.now();
    try {
      // 校验签署密码
      const queryUserSql = "select * from user where id = ? and status = 1";
      const [userPasswordRow] = await pool.query(queryUserSql, [currentUserId]);
      if (!userPasswordRow || !userPasswordRow[0]) {
        return {
          code: 99001,
          message: ErrorCodes[lang]["99001"]
        };
      }
      if (
        !emailCode ||
        !emailCode.code ||
        emailCode.code.toUpperCase() != code.toUpperCase()
      ) {
        if (!(process.env.NODE_ENV === "test" && code === "999999")) {
          emailCode = emailCode || {};
          emailCode.errorCount = (emailCode.errorCount || 0) + 1;
          await redis.set(key, JSON.stringify(emailCode));
          return {
            code: 91003,
            message: ErrorCodes[lang]["91003"]
          };
        }
      }
      if (emailCode.errorCount >= 5) {
        emailCode = emailCode || {};
        emailCode.errorCount = (emailCode.errorCount || 0) + 1;
        await redis.set(key, JSON.stringify(emailCode));
        return {
          code: 91004,
          message: ErrorCodes[lang]["91004"]
        };
      }
      if (now - emailCode.lastSend >= 1800000) {
        emailCode = emailCode || {};
        emailCode.errorCount = (emailCode.errorCount || 0) + 1;
        await redis.set(key, JSON.stringify(emailCode));
        return {
          code: 91005,
          message: ErrorCodes[lang]["91005"]
        };
      }

      // 检查被授权人是否存在
      const checkUserExistSql =
        "select id,email,name from user where email = ? and status = 1";
      const [userRow] = await pool.query(checkUserExistSql, [email]);
      if (!userRow || !userRow[0] || !userRow[0].id) {
        return {
          code: 99001,
          message: ErrorCodes[lang]["99001"]
        };
      }
      const userId = userRow[0].id;
      const checkAuthExistSql =
        "select count(1) c from company_authorized where company_id = ? and user_id = ? and role = 1 and status = 1";
      const [existRow] = await pool.query(checkAuthExistSql, [
        corpId,
        currentUserId
      ]);
      if (existRow[0].c <= 0) {
        return {
          code: 95002,
          message: ErrorCodes[lang]["95002"]
        };
      }
      // 执行签署
      const signatureId = await Sign(pool, {
        target_type: 1,
        target_id: userId,
        signer_id: currentUserId,
        signer_address: address,
        message: request.payload,
        signature: signature,
        payload: "TRANS_ADMIN",
        signer_company_id: corpId
      });
      // end 执行签署
      // 执行更新
      const updateOldAdminSql =
        "UPDATE `company_authorized` SET `cancel_signature_id` = ?, `status` = ?, `stop_time` = ? WHERE company_id = ? AND user_id = ? and role = 1 and status = 1";
      await pool.query(updateOldAdminSql, [
        signatureId,
        2,
        new Date(),
        corpId,
        currentUserId
      ]);
      await pool.query(updateOldAdminSql, [
        signatureId,
        2,
        new Date(),
        corpId,
        userId
      ]);
      const insertNewAdminSql =
        "INSERT INTO `company_authorized` (`uuid`, `company_id`, `user_id`, `role`, `status`, `authorizer_signature_id`, `cancel_signature_id`, `create_time`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      await pool.query(insertNewAdminSql, [
        Uuidv4(),
        corpId,
        userId,
        1,
        1,
        signatureId,
        0,
        new Date()
      ]);
      await pool.commit();
      emailCode.code = "";
      await redis.set(key, JSON.stringify(emailCode));
      return {
        code: 200,
        message: "SUCCESS"
      };
    } catch (e) {
      request.log("ERROR", e);
      await pool.rollback();
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    } finally {
      await pool.release();
    }
  }
};
