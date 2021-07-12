const Boom = require("@hapi/boom");
const PasswordHasher = require("../libs/password-hasher");
const Uuidv4 = require("uuid/v4");
const RandomString = require("randomstring");
const Crc32 = require("node-crc");
const Crypto = require("crypto");
const ErrorCodes = require("../libs/errorCodes");
const Send = require("../libs/mailer");
const Moment = require("moment");
const { Op } = require("sequelize");
module.exports = {
  getCurrentTimestamp: async () => {
    return {
      code: 200,
      message: "success",
      timestamp: Date.now()
    };
  },
  setLang: async (request, h) => {
    const currentUserId = request.auth.credentials.userId;
    const pool = request.mysql.pool;
    const lang = request.payload.lang.replace(/-/g, "_");
    if (lang) {
      const updateSql = "update user set language_code = ? where id = ?";
      try {
        await pool.query(updateSql, [lang, currentUserId]);
      } catch (e) {
        request.log("set_lang", e);
      }
    }
    return {
      code: 200,
      message: "success"
    };
  },
  userPassword: async (request, h) => {
    const currentUserId = request.auth.credentials.userId;
    const lang = request.getLocale(); // 获取语系
    const queryRoleSql = "select * from user where id = ? and status = 1";
    const pool = request.mysql.pool;
    const [queryPassword] = await pool.query(queryRoleSql, [currentUserId]);
    if (queryPassword && queryPassword[0]) {
      const password = queryPassword[0].cer_pwd;
      return {
        code: 200,
        message: "success",
        data: {
          password
        }
      };
    }
    return {
      code: 99001,
      message: ErrorCodes[lang]["99001"] // 'UNKNOWN_TOKEN'
    };
  },
  saveSignPassword: async (request, h) => {
    const redis = request.redis.client;
    const lang = request.getLocale(); // 获取语系
    const xFF = request.headers["x-forwarded-for"];
    const xR = request.headers["x-real-ip"];
    const ip = xFF ? xFF.split(",")[0] : xR || request.info.remoteAddress;
    const currentUserId = request.auth.credentials.userId;
    const token = request.auth.credentials.token;
    const email = request.auth.credentials.email;
    const key = "email_code_modify:" + email + "@" + ip;
    const password = request.payload.password;
    const address = request.headers.address;
    const pool = await request.mysql.pool.getConnection();
    try {
      const data = await redis.get(key);
      await pool.beginTransaction();
      request.log("send_email_code_data", data);
      if (!data) {
        return {
          code: 91002,
          message: ErrorCodes[lang]["91002"] // 'INVALID_EMAIL_CODE'
        };
      }
      let emailCode = JSON.parse(data);
      const code = request.payload.code;
      const now = Date.now();
      if (
        !emailCode ||
        !emailCode.code ||
        emailCode.code.toUpperCase() !== code.toUpperCase()
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
      const updateCertPasswordSql =
        "update user set cer_pwd = ? where id = ? limit 1";
      await pool.query(updateCertPasswordSql, [password, currentUserId]);
      const updateOldCertPasswordSql =
        "update address_list set status = 2, stop_time = ? where user_id = ? and status = 1";
      await pool.query(updateOldCertPasswordSql, [new Date(), currentUserId]);
      const insertAddressSql =
        "INSERT INTO `address_list` (`uuid`, `user_id`, `address`, `status`, `create_time`, `stop_time`) VALUES ( ?, ?, ?, ?, ?, ?)";
      await pool.query(insertAddressSql, [
        Uuidv4(),
        currentUserId,
        address,
        1,
        new Date(),
        null
      ]);
      await pool.commit();
      const authData = await redis.get("access_token:" + token);
      const auth = JSON.parse(authData);
      auth.address = address;
      await redis.set("access_token:" + token, JSON.stringify(auth));
      emailCode.code = "";
      await redis.set(key, JSON.stringify(emailCode));
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
  resetPasswordAfterLogin: async (request, h) => {
    const xFF = request.headers["x-forwarded-for"];
    const xR = request.headers["x-real-ip"];
    const lang = request.getLocale(); // 获取语系
    const ip = xFF ? xFF.split(",")[0] : xR || request.info.remoteAddress;
    const email = request.auth.credentials.email;
    const key = "email_code_modify_login:" + email + "@" + ip;
    const redis = request.redis.client;
    try {
      const data = await redis.get(key);
      const password = request.payload.password;
      const pool = request.mysql.pool;
      const currentUserId = request.auth.credentials.userId;
      request.log("send_email_code_data", data);
      if (!data) {
        return {
          code: 91002,
          message: ErrorCodes[lang]["91002"] // 'INVALID_EMAIL_CODE'
        };
      }
      let emailCode = JSON.parse(data);
      const code = request.payload.code;
      const now = Date.now();

      if (
        !emailCode ||
        !emailCode.code ||
        emailCode.code.toUpperCase() !== code.toUpperCase()
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
      const hashedPassword = await PasswordHasher.hash(password);
      const updatePasswordSql =
        "update user set password = ? where status = 1 AND  id = ? limit 1";
      await pool.query(updatePasswordSql, [hashedPassword, currentUserId]);
      Send.resetSendEmail(email, lang);
      emailCode.code = "";
      await redis.set(key, JSON.stringify(emailCode));
      return {
        code: 200,
        message: "success"
      };
    } catch (error) {
      request.log("resetPasswordAfterLogin", error);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  resetPasswordBeforeLogin: async (request, h) => {
    const redis = request.redis.client;
    const hash = request.payload.hash;
    const emailHash = `resetHash:${hash}`;
    const lang = request.getLocale(); // 获取语系
    const email = await redis.get(emailHash);
    if (!email) {
      return {
        code: 91006,
        message: ErrorCodes[lang]["91006"] // 'INVALID_HASH'
      };
    }
    const emailCrc = Crc32.crc32(Buffer.from(email, "utf8")).readUInt32BE(0);
    const password = request.payload.password;
    const key = "forget_pass:" + email + emailCrc;
    const forgetPassJson = await redis.get(key);
    const pool = request.mysql.pool;
    if (forgetPassJson) {
      const forgetPass = JSON.parse(forgetPassJson);
      if (forgetPass) {
        const now = Date.now();
        if (
          hash === forgetPass.hash &&
          now - forgetPass.createTime < 24 * 60 * 3600000
        ) {
          const hashedPassword = await PasswordHasher.hash(password);
          const updatePasswordSql =
            "update user set password = ?, status = 1 where email_crc = ? and email = ? limit 1";
          await pool.query(updatePasswordSql, [
            hashedPassword,
            emailCrc,
            email
          ]);
          await redis.del(key);
          await redis.del(emailHash);
          return {
            code: 200,
            message: "success"
          };
        } else {
          return {
            code: 91006,
            message: ErrorCodes[lang]["91006"] // 'INVALID_HASH'
          };
        }
      }
    }
    return {
      code: 91002,
      message: ErrorCodes[lang]["91002"]
    };
  },
  validateForgetPassword: async (request, h) => {
    const redis = request.redis.client;
    const hash = request.payload.hash;
    const emailHash = `resetHash:${hash}`;
    const lang = request.getLocale(); // 获取语系
    const email = await redis.get(emailHash);
    if (!email) {
      return {
        code: 91006,
        message: ErrorCodes[lang]["91006"] // 'INVALID_HASH'
      };
    }
    const emailCrc = Crc32.crc32(Buffer.from(email, "utf8")).readUInt32BE(0);
    const key = "forget_pass:" + email + emailCrc;
    const forgetPassJson = await redis.get(key);
    if (forgetPassJson) {
      const forgetPass = JSON.parse(forgetPassJson);
      if (forgetPass) {
        const now = Date.now();
        if (
          hash === forgetPass.hash &&
          now - forgetPass.createTime < 24 * 60 * 3600000
        ) {
          return {
            code: 200,
            message: "success"
          };
        } else {
          return {
            code: 91006,
            message: ErrorCodes[lang]["91006"]
          };
        }
      }
    }
    return {
      code: 91002,
      message: ErrorCodes[lang]["91002"]
    };
  },
  forgetPassword: async (request, h) => {
    const email = request.payload.email;
    const lang = request.getLocale(); // 获取语系
    const emailCrc = Crc32.crc32(Buffer.from(email, "utf8")).readUInt32BE(0);
    const pool = request.mysql.pool;
    const redis = request.redis.client;
    const userSql =
      "select id, email, email, status from user where email_crc = ? and email = ? limit 1";
    const [userRow] = await pool.query(userSql, [emailCrc, email]);
    const user = userRow[0];
    if (user) {
      try {
        const key = "forget_pass:" + email + emailCrc;
        const forgetPassJson = await redis.get(key);
        let count = 1;
        const now = Date.now();
        let forgetPass = {
          createTime: now,
          count: count
        };
        if (forgetPassJson) {
          let forgetPass = JSON.parse(forgetPassJson);
          if (forgetPass) {
            // 1分钟内
            if (now - forgetPass.createTime < 60000) {
              return {
                code: 91007,
                message: ErrorCodes[lang]["91007"] // 'ALREADY_SENDED'
              };
            }
            // 1小时内
            if (
              now - forgetPass.createTime < 3600000 &&
              forgetPass.count >= 5
            ) {
              return {
                code: 91008,
                message: ErrorCodes[lang]["91008"] // 'SEND_TOO_MANY'
              };
            }
            // 超过1小时重置
            if (now - forgetPass.createTime < 3600000) {
              count = forgetPass.count + 1;
            }
          }
        }
        const resetHash = Crypto.createHash("md5")
          .update(email + now + RandomString.generate(8))
          .digest("hex");

        const result = await Send.forgetSendEmail(email, resetHash, lang);
        request.log("forget", result);
        forgetPass.hash = resetHash;
        forgetPass.email = email;
        forgetPass.emailCrc = emailCrc;
        forgetPass.count = count;
        await redis.set(`resetHash:${resetHash}`, email);
        await redis.set(key, JSON.stringify(forgetPass));
        return {
          code: 200,
          message: "success"
        };
      } catch (e) {
        request.log("forget_error", e);
        return {
          code: 91009,
          message: ErrorCodes[lang]["91009"] // 'SEND_FAIL'
        };
      }
    } else {
      return {
        code: 99001,
        message: ErrorCodes[lang]["99001"]
      };
    }
  },
  notImplemented: async request => {
    throw Boom.notImplemented("not implemented");
  },
  register: async request => {
    const name = request.payload.name || "";
    const email = request.payload.email;
    const lang = request.getLocale(); // 获取语系
    const emailCrc = Crc32.crc32(Buffer.from(email, "utf8")).readUInt32BE(0);
    const redis = request.redis.client;
    const xFF = request.headers["x-forwarded-for"];
    const xR = request.headers["x-real-ip"];
    const ip = xFF ? xFF.split(",")[0] : xR || request.info.remoteAddress;
    const key = "email_code:" + email + "@" + ip;
    const data = await redis.get(key);
    const password = request.payload.password;
    const authCode = request.payload.authCode;
    const mobile = request.payload.mobile;
    const address = request.headers.address;
    const inviteCode = request.payload.inviteCode || "";
    request.log("send_email_code_data", data);
    const UserModel = request.getModel("user");
    const LetterReceiverModel = request.getModel("letterReceiver");
    const AddressListModel = request.getModel("addressList");
    const CompanyAuthorizedModel = request.getModel("companyAuthorized");
    const UserDepartmentModel = request.getModel("userDepartment");
    const InviteRecordModel = request.getModel("inviteRecord");
    const sequelize = request.getDb().sequelize;
    if (!data) {
      return {
        code: 91002,
        message: ErrorCodes[lang]["91002"]
      };
    }
    let emailCode = JSON.parse(data);
    const code = request.payload.code;
    const now = Date.now();

    if (
      !emailCode ||
      !emailCode.code ||
      emailCode.code.toUpperCase() !== code.toUpperCase()
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
    try {
      const inviteRecord = await InviteRecordModel.findOne({
        where: { inviteCode }
      });
      if (inviteCode) {
        if (!inviteRecord) {
          return {
            code: 91017,
            message: ErrorCodes[lang]["91017"]
          };
        }
        if (now > inviteRecord.expiredTime) {
          return {
            code: 91018,
            message: ErrorCodes[lang]["91018"]
          };
        }
        if (inviteRecord.useBy) {
          return {
            code: 91019,
            message: ErrorCodes[lang]["91019"]
          };
        }
      }

      const user = await UserModel.findOne({
        where: { emailCrc: emailCrc, emailVerify: email }
      });
      if (user) {
        return {
          code: 91011,
          message: ErrorCodes[lang]["91011"] // 'EMAIL_EXISTS'
        };
      }
      const hashedPassword = await PasswordHasher.hash(password);

      const userId = await sequelize.transaction(async transaction => {
        const insert = await UserModel.create(
          {
            uuid: Uuidv4(),
            password: hashedPassword,
            name,
            email,
            emailCrc: emailCrc,
            emailVerify: email,
            emailVerifyTime: new Date(),
            status: 1,
            registerIp: ip,
            registerTime: new Date(),
            languageCode: lang,
            mobileVerify: mobile,
            cerPwd: authCode
          },
          {
            transaction
          }
        );
        const userId = insert.id;
        await LetterReceiverModel.update(
          {
            userId
          },
          {
            where: {
              userId: 0,
              email
            },
            transaction
          }
        );
        await AddressListModel.update(
          {
            status: 2,
            stopTime: new Date()
          },
          {
            where: {
              userId,
              status: 1
            },
            transaction
          }
        );
        await AddressListModel.create(
          {
            uuid: Uuidv4(),
            userId,
            address,
            status: 1,
            createTime: new Date(),
            stopTime: null
          },
          {
            transaction
          }
        );
        if (inviteCode) {
          await InviteRecordModel.update(
            {
              useBy: userId
            },
            {
              where: { inviteCode },
              transaction
            }
          );
          await UserDepartmentModel.create(
            {
              country: inviteRecord.country,
              city: inviteRecord.city,
              companyId: inviteRecord.companyId,
              departmentId: inviteRecord.departmentId,
              positionName: inviteRecord.positionName,
              userId,
              status: 1
            },
            {
              transaction
            }
          );
          await CompanyAuthorizedModel.create(
            {
              uuid: Uuidv4(),
              companyId: inviteRecord.companyId,
              userId,
              role: 3,
              status: 1,
              authorizerSignatureId: 0,
              cancelSignatureId: 0,
              createTime: new Date(),
              stopTime: null
            },
            {
              transaction
            }
          );
        }
        return userId;
      });
      const token = Uuidv4();
      const userObj = {
        userId: userId,
        address: address,
        email: email,
        type: "password"
      };
      emailCode.code = "";
      await redis.set(key, JSON.stringify(emailCode));
      await redis.set("access_token:" + token, JSON.stringify(userObj));
      return {
        code: 200,
        message: "success",
        name,
        token
      };
    } catch (e) {
      request.log("register_error", e);
      return {
        code: 91010,
        message: ErrorCodes[lang]["91010"]
      };
    }
  },
  login: async request => {
    const email = request.payload.email;
    const emailCrc = Crc32.crc32(Buffer.from(email, "utf8")).readUInt32BE(0);
    const password = request.payload.password;
    const pool = await request.mysql.pool.getConnection();
    const lang = request.getLocale(); // 获取语系
    // console.log("获取语系: ", lang);
    try {
      await pool.beginTransaction();
      const redis = request.redis.client;
      const userSql =
        "select id, language_code, name, email, email_verify, password, password_error_count, status from user where email_crc = ? and email_verify = ? limit 1";
      const [userRow] = await pool.query(userSql, [emailCrc, email]);
      const user = userRow[0];
      if (!user) {
        return {
          code: 99001,
          message: ErrorCodes[lang]["99001"] // 'LOGIN_FAIL'
        };
      }
      if (user.status !== 1) {
        return {
          code: 91012,
          message: ErrorCodes[lang]["91012"]
        };
      }
      if (!user.email) {
        return {
          code: 91013,
          message: ErrorCodes[lang]["91013"] // 'EMAIL_NOT_VERIFIED'
        };
      }
      if (!user.password) {
        return {
          code: 91014,
          message: ErrorCodes[lang]["91014"]
        };
      }
      const match = await PasswordHasher.compare(password, user.password);
      if (!match) {
        Send.loginFailSendEmail(user.email, lang);
        const updateErrorCountSql =
          "update user set password_error_count = password_error_count + 1 where id = ?";
        await pool.query(updateErrorCountSql, [user.id]);
        const [userErrorRow] = await pool.query(userSql, [emailCrc, email]);
        const userError = userErrorRow[0];
        if (userError.password_error_count > 4) {
          const lockAccountSql = "update user set status = 2 where id = ?";
          await pool.query(lockAccountSql, [user.id]);
        }
        await pool.commit();
        return {
          code: 91014,
          message: ErrorCodes[lang]["91014"] // 'LOGIN_FAIL'
        };
      }
      const data = {
        userId: user.id,
        email: user.email,
        address: null,
        type: "password"
      };
      const updateLastLoginTime =
        "update user set password_error_count = 0, status = 1, last_login_time = ? where id = ?";
      await pool.query(updateLastLoginTime, [new Date(), user.id]);
      const addressSql =
        "select user_id,address from address_list where status = 1 and user_id = ? order by create_time desc limit 1";
      const [addressRow] = await pool.query(addressSql, [user.id]);
      const userAddress = addressRow[0];
      if (userAddress) {
        data.address = userAddress.address;
      }
      const token = Uuidv4();
      await redis.set("access_token:" + token, JSON.stringify(data));
      Send.loginSuccessSendEmail(user.email, lang);
      await pool.commit();
      return {
        code: 200,
        message: "success",
        token,
        lang: user.language_code || "",
        name: user.name
      };
    } catch (error) {
      request.log("login", error);
      await pool.rollback();
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    } finally {
      await pool.release();
    }
  },
  logout: async request => {
    const redis = request.redis.client;
    const lang = request.getLocale(); // 获取语系
    const token = request.auth.credentials.token;
    try {
      await redis.del("access_token:" + token);
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("logout", e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  userStatus: async (request, h) => {
    const data = request.auth.credentials;
    const currentUserId = request.auth.credentials.userId;
    const corpId = request.query.corpId;
    // const pool = request.mysql.pool;
    let department = null;
    const CompanyAuthorizedModel = request.getModel("companyAuthorized");
    const UserModel = request.getModel("user");
    const UserDepartmentModel = request.getModel("userDepartment");
    const LetterModel = request.getModel("letter");
    const DepartmentModel = request.getModel("department");
    if (corpId) {
      const queryRole = await CompanyAuthorizedModel.findOne({
        where: {
          userId: currentUserId,
          companyId: corpId,
          status: 1
        }
      });
      if (queryRole) {
        data.role = queryRole.role;
      }
      const userDepartment = await UserDepartmentModel.findOne({
        where: {
          userId: currentUserId,
          companyId: corpId,
          status: 1
        }
      });
      if (userDepartment) {
        const d = await DepartmentModel.findOne({
          where: {
            id: userDepartment.departmentId,
            companyId: corpId,
            status: 1
          }
        });
        if (d) {
          const user = await UserModel.findOne({
            where: { id: d.adminId }
          });
          department = {
            name: d.name,
            id: d.id,
            adminId: d.adminId,
            adminName: (user && user.name) || ""
          };
        }
      }
    }
    const USER_LIMIT = process.env.CONFIG_USER_CREATE_LIMIT || -1;
    const USER_LIMIT_DURATION_DAYS =
      process.env.CONFIG_USER_CREATE_LIMIT_DURATION_DAYS || 0;
    const startTime = Moment()
      .add(0 - USER_LIMIT_DURATION_DAYS, "day")
      .toDate();
    const userCount = await LetterModel.count({
      where: {
        senderId: currentUserId,
        createTime: {
          [Op.gt]: startTime
        }
      }
    });
    const remain = USER_LIMIT - userCount;
    const result = {
      userId: data.userId,
      email: data.email ? data.email : null,
      remain: remain,
      limit: USER_LIMIT,
      limit_duration: USER_LIMIT_DURATION_DAYS,
      address: data.address ? data.address : null,
      type: data.type,
      department
    };
    request.log("user_status", data);
    return {
      code: 200,
      message: "success",
      data: result
    };
  }
};
